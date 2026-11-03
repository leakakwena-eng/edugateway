package za.ac.ump.edugateway.config;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

/**
 * Runtime configuration. Each setting is read from a JVM system property
 * (e.g. -Dedugateway.jwt.secret=...) or the matching environment variable
 * (EDUGATEWAY_JWT_SECRET), falling back to a development default.
 */
public final class AppSettings {

    private static final Logger LOG = Logger.getLogger(AppSettings.class.getName());

    private static final String DEV_JWT_SECRET =
            "dev-only-EduGateway-jwt-secret-change-me-in-production-0123456789";

    private AppSettings() {}

    public static String jwtSecret() {
        String secret = get("edugateway.jwt.secret", null);
        if (secret == null || secret.isBlank()) {
            LOG.warning("EDUGATEWAY_JWT_SECRET is not set; using the development secret");
            return DEV_JWT_SECRET;
        }
        if (secret.length() < 32) {
            throw new IllegalStateException("EDUGATEWAY_JWT_SECRET must be at least 32 characters");
        }
        return secret;
    }

    public static long jwtTtlHours() {
        return Long.parseLong(get("edugateway.jwt.ttl.hours", "8"));
    }

    public static Path uploadDir() {
        String dir = get("edugateway.upload.dir", null);
        if (dir != null && !dir.isBlank()) return Paths.get(dir);
        return Paths.get(System.getProperty("user.home"), "edugateway-uploads");
    }

    public static long maxUploadBytes() {
        return Long.parseLong(get("edugateway.upload.max.bytes", String.valueOf(5L * 1024 * 1024)));
    }

    /** Comma-separated list of allowed browser origins; empty disables CORS headers. */
    public static List<String> corsOrigins() {
        String value = get("edugateway.cors.origins", "");
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }

    public static boolean seedDemoData() {
        return Boolean.parseBoolean(get("edugateway.seed.demo", "true"));
    }

    private static String get(String key, String defaultValue) {
        String value = System.getProperty(key);
        if (value == null) {
            value = System.getenv(key.toUpperCase().replace('.', '_'));
        }
        return value != null ? value : defaultValue;
    }
}
