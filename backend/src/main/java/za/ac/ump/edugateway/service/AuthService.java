package za.ac.ump.edugateway.service;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.mindrot.jbcrypt.BCrypt;
import za.ac.ump.edugateway.dto.AuthResponse;
import za.ac.ump.edugateway.dto.Requests;
import za.ac.ump.edugateway.dto.UserDTO;
import za.ac.ump.edugateway.entity.Guardian;
import za.ac.ump.edugateway.entity.StaffUser;
import za.ac.ump.edugateway.enums.Role;
import za.ac.ump.edugateway.exception.ApiException;
import za.ac.ump.edugateway.mapper.DtoMapper;
import za.ac.ump.edugateway.security.AuthUser;
import za.ac.ump.edugateway.security.JwtUtil;

/**
 * Sign-in for every account type. Guardians and staff live in separate tables;
 * an email is looked up in both, and the role comes from whichever matched.
 */
@Stateless
public class AuthService {

    /** Hash checked when no account matches, so response time doesn't reveal which emails exist. */
    private static final String DUMMY_HASH = BCrypt.hashpw("not-a-real-password", BCrypt.gensalt(12));

    @PersistenceContext(unitName = "EduGatewayPU")
    private EntityManager em;

    @Inject
    private AuditService audit;

    public AuthResponse login(Requests.Login req) {
        String email = Parse.email(req.email());

        Guardian guardian = findGuardian(email);
        if (guardian != null) {
            requirePassword(req.password(), guardian.getPasswordHash());
            return issue(new AuthUser(guardian.getId(), guardian.getName(), guardian.getEmail(), Role.GUARDIAN, null),
                    DtoMapper.toUser(guardian));
        }

        StaffUser staff = findStaff(email);
        if (staff != null) {
            requirePassword(req.password(), staff.getPasswordHash());
            Long schoolId = staff.getSchool() != null ? staff.getSchool().getId() : null;
            return issue(new AuthUser(staff.getId(), staff.getName(), staff.getEmail(), staff.getRole(), schoolId),
                    DtoMapper.toUser(staff));
        }

        BCrypt.checkpw(req.password(), DUMMY_HASH);
        throw ApiException.unauthorized("Invalid email or password");
    }

    /** Self-registration is for guardians only; staff accounts are provisioned by the district. */
    public AuthResponse registerGuardian(Requests.Register req) {
        String email = Parse.email(req.email());
        if (findGuardian(email) != null || findStaff(email) != null) {
            throw ApiException.conflict("An account with this email already exists");
        }

        Guardian g = new Guardian();
        g.setName(req.name().trim());
        g.setEmail(email);
        g.setPhone(Parse.trimToNull(req.phone()));
        g.setPasswordHash(BCrypt.hashpw(req.password(), BCrypt.gensalt(12)));
        em.persist(g);
        em.flush();

        AuthUser user = new AuthUser(g.getId(), g.getName(), g.getEmail(), Role.GUARDIAN, null);
        audit.record(user, "GUARDIAN-" + g.getId(), "GUARDIAN_REGISTERED", null);
        return issue(user, DtoMapper.toUser(g));
    }

    public UserDTO me(AuthUser user) {
        if (user.role() == Role.GUARDIAN) {
            Guardian g = em.find(Guardian.class, user.id());
            if (g == null) throw ApiException.unauthorized("Account no longer exists");
            return DtoMapper.toUser(g);
        }
        StaffUser s = em.find(StaffUser.class, user.id());
        if (s == null) throw ApiException.unauthorized("Account no longer exists");
        return DtoMapper.toUser(s);
    }

    private AuthResponse issue(AuthUser user, UserDTO dto) {
        return new AuthResponse(JwtUtil.generateToken(user), dto);
    }

    private void requirePassword(String plain, String hash) {
        boolean matches;
        try {
            matches = BCrypt.checkpw(plain, hash);
        } catch (IllegalArgumentException e) {
            // Stored value is not a BCrypt hash (e.g. a legacy placeholder): the account can't sign in.
            matches = false;
        }
        if (!matches) {
            throw ApiException.unauthorized("Invalid email or password");
        }
    }

    private Guardian findGuardian(String email) {
        return em.createQuery("SELECT g FROM Guardian g WHERE LOWER(g.email) = :email", Guardian.class)
                .setParameter("email", email)
                .getResultStream().findFirst().orElse(null);
    }

    private StaffUser findStaff(String email) {
        return em.createQuery("SELECT s FROM StaffUser s WHERE LOWER(s.email) = :email", StaffUser.class)
                .setParameter("email", email)
                .getResultStream().findFirst().orElse(null);
    }
}
