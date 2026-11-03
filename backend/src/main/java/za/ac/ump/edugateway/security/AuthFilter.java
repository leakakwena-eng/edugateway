package za.ac.ump.edugateway.security;

import io.jsonwebtoken.JwtException;
import jakarta.annotation.Priority;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ResourceInfo;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;
import za.ac.ump.edugateway.exception.ErrorResponse;

import java.lang.reflect.Method;
import java.security.Principal;
import java.util.Arrays;

/**
 * Authenticates the bearer token and enforces access rules declared on resources:
 * <ul>
 *   <li>{@code @PermitAll} — no token needed</li>
 *   <li>{@code @RolesAllowed({"SCHOOL_ADMIN", ...})} — token with one of those roles</li>
 *   <li>no annotation — any valid token</li>
 * </ul>
 * Method-level annotations override class-level ones.
 */
@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthFilter implements ContainerRequestFilter {

    private static final String BEARER = "Bearer ";

    @Context
    private ResourceInfo resourceInfo;

    @Override
    public void filter(ContainerRequestContext ctx) {
        Method method = resourceInfo.getResourceMethod();
        if (method == null || "OPTIONS".equals(ctx.getMethod())) {
            return;
        }
        Class<?> resource = resourceInfo.getResourceClass();

        AuthUser user = null;
        String header = ctx.getHeaderString(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith(BEARER)) {
            try {
                user = JwtUtil.parse(header.substring(BEARER.length()).trim());
            } catch (JwtException | IllegalArgumentException e) {
                ctx.abortWith(ErrorResponse.of(Response.Status.UNAUTHORIZED, "Invalid or expired session"));
                return;
            }
            ctx.setSecurityContext(new TokenSecurityContext(user, ctx.getSecurityContext().isSecure()));
        }

        if (isPublic(method, resource)) {
            return;
        }
        if (user == null) {
            ctx.abortWith(ErrorResponse.of(Response.Status.UNAUTHORIZED, "Authentication required"));
            return;
        }

        RolesAllowed allowed = method.isAnnotationPresent(RolesAllowed.class)
                ? method.getAnnotation(RolesAllowed.class)
                : resource.getAnnotation(RolesAllowed.class);
        if (allowed != null) {
            String role = user.role().name();
            if (Arrays.stream(allowed.value()).noneMatch(role::equals)) {
                ctx.abortWith(ErrorResponse.of(Response.Status.FORBIDDEN, "You do not have access to this resource"));
            }
        }
    }

    private boolean isPublic(Method method, Class<?> resource) {
        if (method.isAnnotationPresent(PermitAll.class)) return true;
        if (method.isAnnotationPresent(RolesAllowed.class)) return false;
        return resource.isAnnotationPresent(PermitAll.class);
    }

    private record TokenSecurityContext(AuthUser user, boolean secure) implements SecurityContext {
        @Override
        public Principal getUserPrincipal() {
            return user;
        }

        @Override
        public boolean isUserInRole(String role) {
            return user.role().name().equals(role);
        }

        @Override
        public boolean isSecure() {
            return secure;
        }

        @Override
        public String getAuthenticationScheme() {
            return "Bearer";
        }
    }
}
