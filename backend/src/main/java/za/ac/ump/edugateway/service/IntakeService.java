package za.ac.ump.edugateway.service;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import za.ac.ump.edugateway.dto.IntakeDTO;
import za.ac.ump.edugateway.dto.Requests;
import za.ac.ump.edugateway.entity.Intake;
import za.ac.ump.edugateway.entity.School;
import za.ac.ump.edugateway.enums.ApplicationStatus;
import za.ac.ump.edugateway.exception.ApiException;
import za.ac.ump.edugateway.mapper.DtoMapper;
import za.ac.ump.edugateway.security.AuthUser;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;

@Stateless
public class IntakeService {

    @PersistenceContext(unitName = "EduGatewayPU")
    private EntityManager em;

    @Inject
    private AuditService audit;

    /**
     * @param schoolId  restrict to one school (optional)
     * @param openOnly  only intakes accepting applications today
     */
    public List<IntakeDTO> list(Long schoolId, boolean openOnly) {
        String jpql = "SELECT i FROM Intake i"
                + (schoolId != null ? " WHERE i.school.id = :sid" : "")
                + " ORDER BY i.year DESC, i.school.name, i.grade";
        var query = em.createQuery(jpql, Intake.class);
        if (schoolId != null) query.setParameter("sid", schoolId);

        LocalDate today = LocalDate.now();
        return query.getResultStream()
                .filter(i -> !openOnly || i.isOpenOn(today))
                .map(this::toDTO)
                .toList();
    }

    public IntakeDTO get(Long id) {
        return toDTO(find(id));
    }

    public IntakeDTO create(AuthUser user, Requests.Intake req) {
        Intake i = new Intake();
        i.setSchool(em.getReference(School.class, user.schoolId()));
        apply(i, req);
        requireUnique(i);
        em.persist(i);
        em.flush();
        audit.record(user, "INTAKE-" + i.getId(), "INTAKE_CREATED", i.getGrade() + " " + i.getYear());
        return toDTO(i);
    }

    public IntakeDTO update(AuthUser user, Long id, Requests.Intake req) {
        Intake i = find(id);
        if (!Objects.equals(i.getSchool().getId(), user.schoolId())) {
            throw ApiException.forbidden("You can only edit your own school's intakes");
        }
        apply(i, req);
        requireUnique(i);
        long accepted = countAccepted(i.getId());
        if (i.getCapacity() < accepted) {
            throw ApiException.conflict("Capacity cannot be below the " + accepted + " places already accepted");
        }
        audit.record(user, "INTAKE-" + i.getId(), "INTAKE_UPDATED", i.getGrade() + " " + i.getYear());
        return toDTO(i);
    }

    public Intake find(Long id) {
        Intake i = em.find(Intake.class, id);
        if (i == null) throw ApiException.notFound("Intake");
        return i;
    }

    /** Places already taken (accepted or enrolled) in an intake. */
    public long countAccepted(Long intakeId) {
        return em.createQuery(
                        "SELECT COUNT(a) FROM Application a WHERE a.intake.id = :id AND a.status IN :st", Long.class)
                .setParameter("id", intakeId)
                .setParameter("st", List.of(ApplicationStatus.ACCEPTED, ApplicationStatus.ENROLLED))
                .getSingleResult();
    }

    private void apply(Intake i, Requests.Intake req) {
        LocalDate open = Parse.date("openDate", req.openDate());
        LocalDate close = Parse.date("closeDate", req.closeDate());
        if (open != null && close != null && close.isBefore(open)) {
            throw ApiException.badRequest("closeDate must be on or after openDate");
        }
        List<String> docs = req.requiredDocuments() == null ? List.of() : req.requiredDocuments().stream()
                .filter(Objects::nonNull).map(String::trim).filter(s -> !s.isEmpty())
                .collect(LinkedHashSet<String>::new, LinkedHashSet::add, LinkedHashSet::addAll)
                .stream().toList();

        i.setGrade(req.grade().trim());
        i.setYear(req.year());
        i.setOpenDate(open);
        i.setCloseDate(close);
        i.setCapacity(req.capacity());
        i.setRequiredDocuments(new ArrayList<>(docs));
    }

    private void requireUnique(Intake i) {
        boolean clashes = em.createQuery(
                        "SELECT i.id FROM Intake i WHERE i.school.id = :sid AND i.grade = :grade AND i.year = :year",
                        Long.class)
                .setParameter("sid", i.getSchool().getId())
                .setParameter("grade", i.getGrade())
                .setParameter("year", i.getYear())
                .getResultStream()
                .anyMatch(otherId -> !otherId.equals(i.getId()));
        if (clashes) {
            throw ApiException.conflict("An intake for " + i.getGrade() + " " + i.getYear() + " already exists");
        }
    }

    private IntakeDTO toDTO(Intake i) {
        long total = em.createQuery("SELECT COUNT(a) FROM Application a WHERE a.intake.id = :id", Long.class)
                .setParameter("id", i.getId())
                .getSingleResult();
        return DtoMapper.toDTO(i, total, countAccepted(i.getId()));
    }
}
