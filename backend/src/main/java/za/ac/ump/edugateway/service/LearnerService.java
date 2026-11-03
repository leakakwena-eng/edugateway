package za.ac.ump.edugateway.service;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import za.ac.ump.edugateway.dto.LearnerDTO;
import za.ac.ump.edugateway.dto.Requests;
import za.ac.ump.edugateway.entity.Guardian;
import za.ac.ump.edugateway.entity.Learner;
import za.ac.ump.edugateway.exception.ApiException;
import za.ac.ump.edugateway.mapper.DtoMapper;
import za.ac.ump.edugateway.security.AuthUser;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Stateless
public class LearnerService {

    @PersistenceContext(unitName = "EduGatewayPU")
    private EntityManager em;

    @Inject
    private AuditService audit;

    /** Guardians see their own children, school admins see learners enrolled at their school. */
    public List<LearnerDTO> list(AuthUser user) {
        var query = switch (user.role()) {
            case GUARDIAN -> em.createQuery(
                            "SELECT l FROM Learner l WHERE l.guardian.id = :id ORDER BY l.name", Learner.class)
                    .setParameter("id", user.id());
            case SCHOOL_ADMIN -> em.createQuery(
                            "SELECT l FROM Learner l WHERE l.currentSchool.id = :id ORDER BY l.name", Learner.class)
                    .setParameter("id", user.schoolId());
            case DISTRICT_ADMIN -> em.createQuery("SELECT l FROM Learner l ORDER BY l.name", Learner.class);
        };
        return query.getResultStream().map(DtoMapper::toDTO).toList();
    }

    public LearnerDTO get(AuthUser user, Long id) {
        Learner l = em.find(Learner.class, id);
        if (l == null || !canView(user, l)) throw ApiException.notFound("Learner");
        return DtoMapper.toDTO(l);
    }

    public LearnerDTO create(AuthUser user, Requests.Learner req) {
        Learner l = new Learner();
        l.setGuardian(em.getReference(Guardian.class, user.id()));
        apply(l, req);
        em.persist(l);
        em.flush();
        audit.record(user, "LEARNER-" + l.getId(), "LEARNER_ADDED", l.getName());
        return DtoMapper.toDTO(l);
    }

    public LearnerDTO update(AuthUser user, Long id, Requests.Learner req) {
        Learner l = em.find(Learner.class, id);
        if (l == null) throw ApiException.notFound("Learner");
        Access.requireOwnLearner(user, l);
        apply(l, req);
        audit.record(user, "LEARNER-" + l.getId(), "LEARNER_UPDATED", l.getName());
        return DtoMapper.toDTO(l);
    }

    private void apply(Learner l, Requests.Learner req) {
        LocalDate dob = Parse.date("dateOfBirth", req.dateOfBirth());
        if (dob != null && dob.isAfter(LocalDate.now())) {
            throw ApiException.badRequest("dateOfBirth cannot be in the future");
        }
        l.setName(req.name().trim());
        l.setDateOfBirth(dob);
        l.setIdNumber(Parse.trimToNull(req.idNumber()));
        l.setGender(Parse.trimToNull(req.gender()));
    }

    private boolean canView(AuthUser user, Learner l) {
        return switch (user.role()) {
            case GUARDIAN -> Objects.equals(l.getGuardian().getId(), user.id());
            case SCHOOL_ADMIN -> l.getCurrentSchool() != null
                    && Objects.equals(l.getCurrentSchool().getId(), user.schoolId());
            case DISTRICT_ADMIN -> true;
        };
    }
}
