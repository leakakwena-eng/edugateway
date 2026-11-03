package za.ac.ump.edugateway.enums;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static za.ac.ump.edugateway.enums.ApplicationStatus.*;

class ApplicationStatusTest {

    @Test
    void submittedCanBeReviewedOrDecided() {
        assertTrue(SUBMITTED.canTransitionTo(UNDER_REVIEW));
        assertTrue(SUBMITTED.canTransitionTo(ACCEPTED));
        assertTrue(SUBMITTED.canTransitionTo(REJECTED));
        assertTrue(SUBMITTED.canTransitionTo(WAITLISTED));
        assertFalse(SUBMITTED.canTransitionTo(ENROLLED));
    }

    @Test
    void onlyAcceptedApplicationsCanBeEnrolled() {
        for (ApplicationStatus s : values()) {
            assertEquals(s == ACCEPTED, s.canTransitionTo(ENROLLED), s.name());
        }
    }

    @Test
    void waitlistedCanStillBeAcceptedOrRejected() {
        assertTrue(WAITLISTED.canTransitionTo(ACCEPTED));
        assertTrue(WAITLISTED.canTransitionTo(REJECTED));
        assertFalse(WAITLISTED.canTransitionTo(SUBMITTED));
    }

    @Test
    void finalStatusesCannotChange() {
        for (ApplicationStatus next : values()) {
            assertFalse(REJECTED.canTransitionTo(next));
            assertFalse(ENROLLED.canTransitionTo(next));
        }
        assertFalse(REJECTED.isActive());
        assertFalse(ENROLLED.isActive());
        assertTrue(ACCEPTED.isActive());
    }
}
