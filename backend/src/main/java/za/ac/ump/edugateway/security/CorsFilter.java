package za.ac.ump.edugateway.security;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.container.PreMatching;
import jakarta.ws.rs.ext.Provider;
import za.ac.ump.edugateway.config.AppSettings;

import java.util.List;

/**
 * Adds CORS headers for the origins listed in EDUGATEWAY_CORS_ORIGINS.
 * Not needed in development, where the Vite dev server proxies /api to WildFly.
 */
@Provider
@PreMatching
public class CorsFilter implements ContainerResponseFilter {

    private static final List<String> ALLOWED = AppSettings.corsOrigins();

    @Override
    public void filter(ContainerRequestContext req, ContainerResponseContext res) {
        String origin = req.getHeaderString("Origin");
        if (origin == null || !ALLOWED.contains(origin)) {
            return;
        }
        var headers = res.getHeaders();
        headers.putSingle("Access-Control-Allow-Origin", origin);
        headers.putSingle("Vary", "Origin");
        headers.putSingle("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
        headers.putSingle("Access-Control-Allow-Headers", "Authorization, Content-Type");
        headers.putSingle("Access-Control-Max-Age", "3600");
    }
}
