package za.ac.ump.edugateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import za.ac.ump.edugateway.config.AppSettings;
import za.ac.ump.edugateway.enums.Role;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;

public final class JwtUtil {

    private static final String ISSUER = "edugateway";

    private static final SecretKey KEY =
            Keys.hmacShaKeyFor(AppSettings.jwtSecret().getBytes(StandardCharsets.UTF_8));

    private static final long TTL_MS = Duration.ofHours(AppSettings.jwtTtlHours()).toMillis();

    private JwtUtil() {}

    public static String generateToken(AuthUser user) {
        Date now = new Date();
        var builder = Jwts.builder()
                .issuer(ISSUER)
                .subject(String.valueOf(user.id()))
                .claim("name", user.name())
                .claim("email", user.email())
                .claim("role", user.role().name())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + TTL_MS));
        if (user.schoolId() != null) {
            builder.claim("schoolId", user.schoolId());
        }
        return builder.signWith(KEY).compact();
    }

    /** Parses and verifies a token. Throws {@link JwtException} if it is invalid or expired. */
    public static AuthUser parse(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(KEY)
                .requireIssuer(ISSUER)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        Number schoolId = claims.get("schoolId", Number.class);
        return new AuthUser(
                Long.valueOf(claims.getSubject()),
                claims.get("name", String.class),
                claims.get("email", String.class),
                Role.valueOf(claims.get("role", String.class)),
                schoolId != null ? schoolId.longValue() : null);
    }
}
