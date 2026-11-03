package za.ac.ump.edugateway.security;

import jakarta.ws.rs.core.SecurityContext;
import za.ac.ump.edugateway.exception.ApiException;

public final class CurrentUser {

    private CurrentUser() {}

    /** The caller set by {@link AuthFilter}; only valid on endpoints that require authentication. */
    public static AuthUser from(SecurityContext ctx) {
        if (ctx != null && ctx.getUserPrincipal() instanceof AuthUser user) {
            return user;
        }
        throw ApiException.unauthorized("Authentication required");
    }
}
