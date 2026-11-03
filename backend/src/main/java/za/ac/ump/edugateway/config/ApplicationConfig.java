package za.ac.ump.edugateway.config;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

/**
 * JAX-RS entry point. Resources and providers are discovered by classpath scanning,
 * so new @Path / @Provider classes are picked up without being registered here.
 */
@ApplicationPath("/api/v1")
public class ApplicationConfig extends Application {
}
