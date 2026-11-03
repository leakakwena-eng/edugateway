package za.ac.ump.edugateway.service;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import za.ac.ump.edugateway.dto.ApplicationDTO;
import za.ac.ump.edugateway.dto.ApplicationDetailDTO;
import za.ac.ump.edugateway.dto.Requests;
import za.ac.ump.edugateway.entity.*;
import za.ac.ump.edugateway.enums.ApplicationStatus;
import za.ac.ump.edugateway.enums.ApplicationType;
import za.ac.ump.edugateway.enums.DocumentStatus;
import za.ac.ump.edugateway.enums.Role;
import za.ac.ump.edugateway.enums.TransferReleaseStatus;
import za.ac.ump.edugateway.exception.ApiException;
import za.ac.ump.edugateway.mapper.DtoMapper;
import za.ac.ump.edugateway.security.AuthUser;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * The admission workflow. A guardian applies for a learner to an intake; if the learner is
 * already enrolled at another school, the application is a TRANSFER and the sending school
 * must release records before the receiving school can enrol the learner.
 */
@Stateless
public class ApplicationService {

    @PersistenceContext(unitName = "EduGatewayPU")
    private EntityManager em;

    @Inject
    private IntakeService intakes;

    @Inject
    private AuditService audit;

    @Inject
    private NotificationService notifications;

    public List<ApplicationDTO> list(AuthUser user, String status) {
        StringBuilder jpql = new StringBuilder("SELECT a FROM Application a WHERE 1 = 1");
        switch (user.role()) {
            case GUARDIAN -> jpql.append(" AND a.learner.guardian.id = :uid");
            case SCHOOL_ADMIN -> jpql.append(" AND a.intake.school.id = :sid");
            case DISTRICT_ADMIN -> { }
        }
        if (status != null) jpql.append(" AND a.status = :status");
        jpql.append(" ORDER BY a.submittedAt DESC, a.id DESC");

        var query = em.createQuery(jpql.toString(), Application.class);
        if (user.role() == Role.GUARDIAN) query.setParameter("uid", user.id());
        if (user.role() == Role.SCHOOL_ADMIN) query.setParameter("sid", user.schoolId());
        if (status != null) query.setParameter("status", Parse.enumValue(ApplicationStatus.class, "status", status));

        return query.getResultStream().map(DtoMapper::toDTO).toList();
    }

    public ApplicationDetailDTO detail(AuthUser user, Long id) {
        Application a = find(id);
        Access.requireView(user, a);
        return toDetail(user, a);
    }

    public ApplicationDetailDTO submit(AuthUser user, Requests.NewApplication req) {
        Learner learner = em.find(Learner.class, req.learnerId());
        if (learner == null) throw ApiException.notFound("Learner");
        Access.requireOwnLearner(user, learner);
        Intake intake = intakes.find(req.intakeId());
        School school = intake.getSchool();

        if (!intake.isOpenOn(LocalDate.now())) {
            throw ApiException.conflict("This intake is not open for applications");
        }
        School current = learner.getCurrentSchool();
        if (current != null && Objects.equals(current.getId(), school.getId())) {
            throw ApiException.conflict(learner.getName() + " is already enrolled at " + school.getName());
        }
        Long duplicates = em.createQuery(
                        "SELECT COUNT(a) FROM Application a WHERE a.learner.id = :lid AND a.intake.id = :iid "
                                + "AND a.status NOT IN :closed", Long.class)
                .setParameter("lid", learner.getId())
                .setParameter("iid", intake.getId())
                .setParameter("closed", Set.of(ApplicationStatus.REJECTED, ApplicationStatus.ENROLLED))
                .getSingleResult();
        if (duplicates > 0) {
            throw ApiException.conflict(learner.getName() + " already has an open application for this intake");
        }

        Application a = new Application();
        a.setLearner(learner);
        a.setIntake(intake);
        a.setType(current != null ? ApplicationType.TRANSFER : ApplicationType.NEW);
        a.setStatus(ApplicationStatus.SUBMITTED);
        a.setSubmittedAt(LocalDateTime.now());
        em.persist(a);
        em.flush();

        String what = learner.getName() + " applied for " + intake.getGrade() + " " + intake.getYear()
                + " (" + a.getReference() + ")";
        if (a.getType() == ApplicationType.TRANSFER) {
            TransferRecord t = new TransferRecord();
            t.setApplication(a);
            t.setSendingSchool(current);
            t.setReleaseStatus(TransferReleaseStatus.PENDING);
            em.persist(t);
            a.setTransferRecord(t);

            audit.record(user, a.getReference(), "TRANSFER_REQUESTED", current.getName() + " → " + school.getName());
            notifications.toSchool(school.getId(), "New transfer request", what + ", transferring from " + current.getName() + ".", a.getId());
            notifications.toSchool(current.getId(), "Transfer requested",
                    learner.getName() + " has requested a transfer to " + school.getName()
                            + ". Records can be released once the transfer is accepted.", a.getId());
        } else {
            audit.record(user, a.getReference(), "APPLICATION_SUBMITTED", school.getName() + ", " + intake.getGrade());
            notifications.toSchool(school.getId(), "New application", what + ".", a.getId());
        }
        return toDetail(user, a);
    }

    /** Moves a newly submitted application into review so the guardian can see it is being handled. */
    public ApplicationDetailDTO startReview(AuthUser user, Long id) {
        Application a = find(id);
        Access.requireReceivingSchool(user, a);
        transition(a, ApplicationStatus.UNDER_REVIEW);
        audit.record(user, a.getReference(), "REVIEW_STARTED", null);
        notifications.toGuardian(guardianId(a), "Application under review",
                a.getIntake().getSchool().getName() + " is reviewing " + a.getLearner().getName()
                        + "'s application (" + a.getReference() + ").", a.getId());
        return toDetail(user, a);
    }

    public ApplicationDetailDTO decide(AuthUser user, Long id, Requests.Decision req) {
        Application a = find(id);
        Access.requireReceivingSchool(user, a);

        ApplicationStatus decision = Parse.enumValue(ApplicationStatus.class, "decision", req.decision());
        if (!ApplicationStatus.DECISIONS.contains(decision)) {
            throw ApiException.badRequest("decision must be one of " + ApplicationStatus.DECISIONS);
        }
        String reason = Parse.trimToNull(req.reason());
        if (decision == ApplicationStatus.REJECTED && reason == null) {
            throw ApiException.badRequest("A reason is required when rejecting an application");
        }
        if (decision == ApplicationStatus.ACCEPTED) {
            long taken = intakes.countAccepted(a.getIntake().getId());
            if (taken >= a.getIntake().getCapacity()) {
                throw ApiException.conflict("This intake is full (" + taken + "/" + a.getIntake().getCapacity()
                        + "). Waitlist the application instead.");
            }
        }

        transition(a, decision);
        a.setDecidedAt(LocalDateTime.now());
        a.setRejectionReason(decision == ApplicationStatus.REJECTED ? reason : null);

        audit.record(user, a.getReference(), "DECISION_" + decision.name(), reason);
        String school = a.getIntake().getSchool().getName();
        String learner = a.getLearner().getName();
        switch (decision) {
            case ACCEPTED -> notifications.toGuardian(guardianId(a), "Application accepted",
                    learner + " has been offered a place at " + school + " (" + a.getReference() + ").", a.getId());
            case WAITLISTED -> notifications.toGuardian(guardianId(a), "Application waitlisted",
                    learner + " has been placed on the waiting list at " + school + ".", a.getId());
            case REJECTED -> notifications.toGuardian(guardianId(a), "Application unsuccessful",
                    learner + "'s application to " + school + " was not successful: " + reason, a.getId());
            default -> { }
        }
        if (decision == ApplicationStatus.ACCEPTED && a.getTransferRecord() != null) {
            notifications.toSchool(a.getTransferRecord().getSendingSchool().getId(), "Records release needed",
                    school + " accepted " + learner + "'s transfer. Please release their academic records.", a.getId());
        }
        return toDetail(user, a);
    }

    public ApplicationDetailDTO enrol(AuthUser user, Long id) {
        Application a = find(id);
        Access.requireReceivingSchool(user, a);

        if (!a.getStatus().canTransitionTo(ApplicationStatus.ENROLLED)) {
            throw ApiException.conflict("Only accepted applications can be enrolled");
        }
        TransferRecord t = a.getTransferRecord();
        if (t != null && t.getReleaseStatus() != TransferReleaseStatus.RELEASED) {
            throw ApiException.conflict("Waiting for " + t.getSendingSchool().getName() + " to release the learner's records");
        }
        List<String> outstanding = outstandingDocuments(a);
        if (!outstanding.isEmpty()) {
            throw ApiException.conflict("Documents not yet verified: " + String.join(", ", outstanding));
        }

        transition(a, ApplicationStatus.ENROLLED);
        Learner learner = a.getLearner();
        learner.setCurrentSchool(a.getIntake().getSchool());
        learner.setCurrentGrade(a.getIntake().getGrade());

        String school = a.getIntake().getSchool().getName();
        audit.record(user, a.getReference(), "LEARNER_ENROLLED", school + ", " + a.getIntake().getGrade());
        notifications.toGuardian(guardianId(a), "Enrolment confirmed",
                learner.getName() + " is now enrolled at " + school + ".", a.getId());
        if (t != null) {
            notifications.toSchool(t.getSendingSchool().getId(), "Transfer completed",
                    learner.getName() + " has been enrolled at " + school + ".", a.getId());
        }
        return toDetail(user, a);
    }

    public ApplicationDetailDTO saveNotes(AuthUser user, Long id, Requests.Notes req) {
        Application a = find(id);
        Access.requireReceivingSchool(user, a);
        a.setReviewNotes(Parse.trimToNull(req.notes()));
        return toDetail(user, a);
    }

    private Application find(Long id) {
        Application a = em.find(Application.class, id);
        if (a == null) throw ApiException.notFound("Application");
        return a;
    }

    private void transition(Application a, ApplicationStatus next) {
        if (!a.getStatus().canTransitionTo(next)) {
            throw ApiException.conflict("An application that is " + a.getStatus() + " cannot become " + next);
        }
        a.setStatus(next);
    }

    /** Required documents that are missing or not yet verified. */
    private List<String> outstandingDocuments(Application a) {
        Set<String> verified = a.getDocuments().stream()
                .filter(d -> d.getStatus() == DocumentStatus.VERIFIED)
                .map(Document::getType)
                .collect(Collectors.toSet());
        return a.getIntake().getRequiredDocuments().stream()
                .filter(doc -> !verified.contains(doc))
                .toList();
    }

    private Long guardianId(Application a) {
        return a.getLearner().getGuardian().getId();
    }

    private ApplicationDetailDTO toDetail(AuthUser user, Application a) {
        boolean staff = user.role() != Role.GUARDIAN;
        return new ApplicationDetailDTO(
                DtoMapper.toDTO(a),
                DtoMapper.toDTO(a.getLearner().getGuardian()),
                List.copyOf(a.getIntake().getRequiredDocuments()),
                a.getDocuments().stream().map(DtoMapper::toDTO).toList(),
                audit.historyFor(a.getReference()),
                staff ? a.getReviewNotes() : null);
    }
}
