package za.ac.ump.edugateway.service;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import za.ac.ump.edugateway.dto.ReportSummaryDTO;
import za.ac.ump.edugateway.dto.SchoolStatsDTO;
import za.ac.ump.edugateway.entity.Intake;
import za.ac.ump.edugateway.entity.School;
import za.ac.ump.edugateway.enums.ApplicationStatus;
import za.ac.ump.edugateway.enums.ApplicationType;
import za.ac.ump.edugateway.enums.Role;
import za.ac.ump.edugateway.enums.TransferReleaseStatus;
import za.ac.ump.edugateway.security.AuthUser;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Stateless
public class ReportService {

    @PersistenceContext(unitName = "EduGatewayPU")
    private EntityManager em;

    /** Dashboard figures: a school admin sees their own school, the district sees everything. */
    public ReportSummaryDTO summary(AuthUser user, Integer year) {
        Long schoolId = user.role() == Role.SCHOOL_ADMIN ? user.schoolId() : null;
        int reportYear = year != null ? year : LocalDate.now().getYear();

        var appQuery = em.createQuery("SELECT a.status, a.type, a.submittedAt FROM Application a"
                + (schoolId != null ? " WHERE a.intake.school.id = :sid" : ""), Object[].class);
        if (schoolId != null) appQuery.setParameter("sid", schoolId);
        List<Object[]> rows = appQuery.getResultList();

        Map<String, Long> byStatus = new LinkedHashMap<>();
        for (ApplicationStatus s : ApplicationStatus.values()) byStatus.put(s.name(), 0L);
        Map<String, Long> byType = new LinkedHashMap<>();
        for (ApplicationType t : ApplicationType.values()) byType.put(t.name(), 0L);
        Long[] byMonth = new Long[12];
        Arrays.fill(byMonth, 0L);

        for (Object[] row : rows) {
            byStatus.merge(((ApplicationStatus) row[0]).name(), 1L, Long::sum);
            byType.merge(((ApplicationType) row[1]).name(), 1L, Long::sum);
            LocalDateTime submitted = (LocalDateTime) row[2];
            if (submitted != null && submitted.getYear() == reportYear) {
                byMonth[submitted.getMonthValue() - 1]++;
            }
        }

        LocalDate today = LocalDate.now();
        var intakeQuery = em.createQuery("SELECT i FROM Intake i"
                + (schoolId != null ? " WHERE i.school.id = :sid" : ""), Intake.class);
        if (schoolId != null) intakeQuery.setParameter("sid", schoolId);
        long openIntakes = intakeQuery.getResultStream().filter(i -> i.isOpenOn(today)).count();

        return new ReportSummaryDTO(
                reportYear,
                rows.size(),
                schoolId != null
                        ? count("SELECT COUNT(l) FROM Learner l WHERE l.currentSchool.id = :sid", schoolId)
                        : count("SELECT COUNT(l) FROM Learner l", null),
                schoolId != null ? 1 : count("SELECT COUNT(s) FROM School s", null),
                schoolId != null
                        ? count("SELECT COUNT(DISTINCT a.learner.guardian.id) FROM Application a "
                        + "WHERE a.intake.school.id = :sid", schoolId)
                        : count("SELECT COUNT(g) FROM Guardian g", null),
                openIntakes,
                pendingTransfers(schoolId),
                byStatus,
                byType,
                List.of(byMonth));
    }

    /** Per-school application counts for the district. */
    public List<SchoolStatsDTO> schoolStats() {
        Map<Long, Map<ApplicationStatus, Long>> counts = new HashMap<>();
        em.createQuery("SELECT a.intake.school.id, a.status, COUNT(a) FROM Application a "
                        + "GROUP BY a.intake.school.id, a.status", Object[].class)
                .getResultList()
                .forEach(r -> counts.computeIfAbsent((Long) r[0], k -> new EnumMap<>(ApplicationStatus.class))
                        .put((ApplicationStatus) r[1], (Long) r[2]));

        Map<Long, Long> capacity = new HashMap<>();
        em.createQuery("SELECT i.school.id, SUM(i.capacity) FROM Intake i GROUP BY i.school.id", Object[].class)
                .getResultList()
                .forEach(r -> capacity.put((Long) r[0], ((Number) r[1]).longValue()));

        return em.createQuery("SELECT s FROM School s ORDER BY s.name", School.class)
                .getResultStream()
                .map(s -> {
                    Map<ApplicationStatus, Long> c = counts.getOrDefault(s.getId(), Map.of());
                    long total = c.values().stream().mapToLong(Long::longValue).sum();
                    long pending = c.getOrDefault(ApplicationStatus.SUBMITTED, 0L)
                            + c.getOrDefault(ApplicationStatus.UNDER_REVIEW, 0L)
                            + c.getOrDefault(ApplicationStatus.WAITLISTED, 0L);
                    return new SchoolStatsDTO(s.getId(), s.getName(), s.getType(), total, pending,
                            c.getOrDefault(ApplicationStatus.ACCEPTED, 0L),
                            c.getOrDefault(ApplicationStatus.ENROLLED, 0L),
                            c.getOrDefault(ApplicationStatus.REJECTED, 0L),
                            capacity.getOrDefault(s.getId(), 0L));
                })
                .toList();
    }

    private long pendingTransfers(Long schoolId) {
        var q = em.createQuery("SELECT COUNT(t) FROM TransferRecord t WHERE t.releaseStatus = :pending"
                + (schoolId != null
                ? " AND (t.sendingSchool.id = :sid OR t.application.intake.school.id = :sid)" : ""), Long.class)
                .setParameter("pending", TransferReleaseStatus.PENDING);
        if (schoolId != null) q.setParameter("sid", schoolId);
        return q.getSingleResult();
    }

    private long count(String jpql, Long schoolId) {
        var q = em.createQuery(jpql, Long.class);
        if (schoolId != null) q.setParameter("sid", schoolId);
        return q.getSingleResult();
    }
}
