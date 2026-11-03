package za.ac.ump.edugateway.service;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import za.ac.ump.edugateway.dto.TransferDTO;
import za.ac.ump.edugateway.entity.Application;
import za.ac.ump.edugateway.entity.TransferRecord;
import za.ac.ump.edugateway.enums.ApplicationStatus;
import za.ac.ump.edugateway.enums.TransferReleaseStatus;
import za.ac.ump.edugateway.exception.ApiException;
import za.ac.ump.edugateway.mapper.DtoMapper;
import za.ac.ump.edugateway.security.AuthUser;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Transfers are created by {@link ApplicationService#submit}; this service covers the
 * sending school's side: seeing incoming/outgoing transfers and releasing records.
 */
@Stateless
public class TransferService {

    @PersistenceContext(unitName = "EduGatewayPU")
    private EntityManager em;

    @Inject
    private AuditService audit;

    @Inject
    private NotificationService notifications;

    public List<TransferDTO> list(AuthUser user) {
        var query = switch (user.role()) {
            case GUARDIAN -> em.createQuery(
                            "SELECT t FROM TransferRecord t WHERE t.application.learner.guardian.id = :id "
                                    + "ORDER BY t.id DESC", TransferRecord.class)
                    .setParameter("id", user.id());
            case SCHOOL_ADMIN -> em.createQuery(
                            "SELECT t FROM TransferRecord t WHERE t.sendingSchool.id = :id "
                                    + "OR t.application.intake.school.id = :id ORDER BY t.id DESC", TransferRecord.class)
                    .setParameter("id", user.schoolId());
            case DISTRICT_ADMIN -> em.createQuery(
                    "SELECT t FROM TransferRecord t ORDER BY t.id DESC", TransferRecord.class);
        };
        return query.getResultStream().map(DtoMapper::toDTO).toList();
    }

    public TransferDTO get(AuthUser user, Long id) {
        TransferRecord t = find(id);
        Access.requireView(user, t.getApplication());
        return DtoMapper.toDTO(t);
    }

    public TransferDTO releaseRecords(AuthUser user, Long id) {
        TransferRecord t = find(id);
        Application app = t.getApplication();
        Access.requireView(user, app);
        if (!Access.isSendingSchool(user, app)) {
            throw ApiException.forbidden("Only the sending school can release records");
        }
        if (t.getReleaseStatus() == TransferReleaseStatus.RELEASED) {
            throw ApiException.conflict("Records have already been released");
        }
        if (app.getStatus() != ApplicationStatus.ACCEPTED) {
            throw ApiException.conflict("Records can be released once the receiving school has accepted the transfer");
        }

        t.setReleaseStatus(TransferReleaseStatus.RELEASED);
        t.setReleasedAt(LocalDateTime.now());

        String learner = app.getLearner().getName();
        audit.record(user, app.getReference(), "TRANSFER_RECORDS_RELEASED", t.getSendingSchool().getName());
        notifications.toSchool(app.getIntake().getSchool().getId(), "Transfer records released",
                t.getSendingSchool().getName() + " released " + learner + "'s records. You can now enrol the learner.",
                app.getId());
        notifications.toGuardian(app.getLearner().getGuardian().getId(), "Transfer records released",
                learner + "'s academic records have been released by " + t.getSendingSchool().getName() + ".",
                app.getId());
        return DtoMapper.toDTO(t);
    }

    private TransferRecord find(Long id) {
        TransferRecord t = em.find(TransferRecord.class, id);
        if (t == null) throw ApiException.notFound("Transfer");
        return t;
    }
}
