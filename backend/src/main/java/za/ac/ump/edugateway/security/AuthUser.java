package za.ac.ump.edugateway.security;

import za.ac.ump.edugateway.enums.Role;

import java.security.Principal;

/**
 * The authenticated caller, rebuilt from the JWT on every request.
 * {@code schoolId} is only set for school admins.
 */
public record AuthUser(Long id, String name, String email, Role role, Long schoolId) implements Principal {

    @Override
    public String getName() {
        return email;
    }

    public boolean is(Role r) {
        return role == r;
    }

    /** Human-readable actor label used in audit entries, e.g. "Mrs. Dlamini (School Admin)". */
    public String label() {
        return switch (role) {
            case GUARDIAN -> name + " (Guardian)";
            case SCHOOL_ADMIN -> name + " (School Admin)";
            case DISTRICT_ADMIN -> name + " (District Admin)";
        };
    }
}
