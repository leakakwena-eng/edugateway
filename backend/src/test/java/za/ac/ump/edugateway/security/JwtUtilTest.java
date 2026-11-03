package za.ac.ump.edugateway.security;

import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.Test;
import za.ac.ump.edugateway.enums.Role;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    @Test
    void tokenRoundTripsTheUser() {
        AuthUser admin = new AuthUser(7L, "Mrs. Dlamini", "dlamini@mpuma.edu", Role.SCHOOL_ADMIN, 2L);
        assertEquals(admin, JwtUtil.parse(JwtUtil.generateToken(admin)));
    }

    @Test
    void guardianTokenHasNoSchool() {
        AuthUser guardian = new AuthUser(1L, "Thandi", "thandi@example.com", Role.GUARDIAN, null);
        assertNull(JwtUtil.parse(JwtUtil.generateToken(guardian)).schoolId());
    }

    @Test
    void tamperedTokenIsRejected() {
        String token = JwtUtil.generateToken(new AuthUser(1L, "A", "a@b.c", Role.GUARDIAN, null));
        String[] parts = token.split("\\.");
        String forged = parts[0] + "." + parts[1] + "x." + parts[2];
        assertThrows(JwtException.class, () -> JwtUtil.parse(forged));
    }
}
