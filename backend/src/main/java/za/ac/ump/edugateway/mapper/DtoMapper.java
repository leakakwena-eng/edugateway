package za.ac.ump.edugateway.mapper;

import za.ac.ump.edugateway.dto.*;
import za.ac.ump.edugateway.entity.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Entity → DTO conversion. Call only inside a transaction, since it walks lazy associations.
 */
public final class DtoMapper {

    private DtoMapper() {}

    public static String iso(LocalDateTime t) {
        return t == null ? null : t.truncatedTo(ChronoUnit.SECONDS).toString();
    }

    public static String iso(LocalDate d) {
        return d == null ? null : d.toString();
    }

    public static SchoolDTO toDTO(School s) {
        return new SchoolDTO(s.getId(), s.getName(), s.getType(), s.getEmisNo());
    }

    public static GuardianDTO toDTO(Guardian g) {
        return new GuardianDTO(g.getId(), g.getName(), g.getEmail(), g.getPhone());
    }

    public static UserDTO toUser(Guardian g) {
        return new UserDTO(g.getId(), g.getName(), g.getEmail(), g.getPhone(), "GUARDIAN", null, null);
    }

    public static UserDTO toUser(StaffUser s) {
        School school = s.getSchool();
        return new UserDTO(s.getId(), s.getName(), s.getEmail(), null, s.getRole().name(),
                school != null ? school.getId() : null,
                school != null ? school.getName() : null);
    }

    public static LearnerDTO toDTO(Learner l) {
        School current = l.getCurrentSchool();
        return new LearnerDTO(
                l.getId(),
                l.getGuardian().getId(),
                l.getGuardian().getName(),
                l.getName(),
                iso(l.getDateOfBirth()),
                l.getIdNumber(),
                l.getGender(),
                current != null ? current.getId() : null,
                current != null ? current.getName() : null,
                l.getCurrentGrade());
    }

    public static IntakeDTO toDTO(Intake i, long applicationCount, long acceptedCount) {
        return new IntakeDTO(
                i.getId(),
                i.getSchool().getId(),
                i.getSchool().getName(),
                i.getGrade(),
                i.getYear(),
                iso(i.getOpenDate()),
                iso(i.getCloseDate()),
                i.getCapacity(),
                List.copyOf(i.getRequiredDocuments()),
                i.isOpenOn(LocalDate.now()),
                applicationCount,
                acceptedCount);
    }

    public static ApplicationDTO toDTO(Application a) {
        Learner learner = a.getLearner();
        Intake intake = a.getIntake();
        TransferRecord t = a.getTransferRecord();
        return new ApplicationDTO(
                a.getId(),
                a.getReference(),
                a.getType().name(),
                a.getStatus().name(),
                learner.getId(),
                learner.getName(),
                learner.getGuardian().getId(),
                learner.getGuardian().getName(),
                intake.getId(),
                intake.getSchool().getId(),
                intake.getSchool().getName(),
                intake.getGrade(),
                intake.getYear(),
                iso(a.getSubmittedAt()),
                iso(a.getDecidedAt()),
                a.getRejectionReason(),
                t != null ? t.getId() : null,
                t != null ? t.getSendingSchool().getId() : null,
                t != null ? t.getSendingSchool().getName() : null,
                t != null ? t.getReleaseStatus().name() : null);
    }

    public static DocumentDTO toDTO(Document d) {
        Application a = d.getApplication();
        return new DocumentDTO(
                d.getId(),
                a.getId(),
                a.getReference(),
                a.getLearner().getName(),
                d.getType(),
                d.getOriginalFileName(),
                d.getContentType(),
                d.getSizeBytes(),
                d.getStatus().name(),
                d.getRejectionReason(),
                iso(d.getUploadedAt()));
    }

    public static TransferDTO toDTO(TransferRecord t) {
        Application a = t.getApplication();
        Intake intake = a.getIntake();
        return new TransferDTO(
                t.getId(),
                a.getId(),
                a.getReference(),
                a.getStatus().name(),
                a.getLearner().getId(),
                a.getLearner().getName(),
                intake.getGrade(),
                t.getSendingSchool().getId(),
                t.getSendingSchool().getName(),
                intake.getSchool().getId(),
                intake.getSchool().getName(),
                t.getReleaseStatus().name(),
                iso(t.getReleasedAt()),
                iso(a.getSubmittedAt()));
    }

    public static NotificationDTO toDTO(Notification n) {
        return new NotificationDTO(n.getId(), n.getTitle(), n.getBody(), n.getApplicationId(),
                iso(n.getCreatedAt()), n.isRead());
    }

    public static AuditEntryDTO toDTO(AuditEvent e) {
        return new AuditEntryDTO(
                e.getId(),
                iso(e.getTimestamp()),
                e.getActorName() != null ? e.getActorName() : "System",
                e.getActorRole() != null ? e.getActorRole().name() : null,
                e.getEntityRef(),
                e.getAction(),
                e.getDetails());
    }
}
