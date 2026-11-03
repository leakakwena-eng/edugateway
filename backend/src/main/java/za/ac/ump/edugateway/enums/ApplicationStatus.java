package za.ac.ump.edugateway.enums;

import java.util.EnumSet;
import java.util.Set;

public enum ApplicationStatus {
    DRAFT,
    SUBMITTED,
    UNDER_REVIEW,
    ACCEPTED,
    REJECTED,
    WAITLISTED,
    ENROLLED;

    /** Statuses a school may set when deciding on an application. */
    public static final Set<ApplicationStatus> DECISIONS = EnumSet.of(ACCEPTED, REJECTED, WAITLISTED);

    /** The allowed lifecycle: DRAFT → SUBMITTED → (UNDER_REVIEW) → ACCEPTED/WAITLISTED/REJECTED → ENROLLED. */
    public boolean canTransitionTo(ApplicationStatus next) {
        return switch (this) {
            case DRAFT -> next == SUBMITTED;
            case SUBMITTED -> next == UNDER_REVIEW || DECISIONS.contains(next);
            case UNDER_REVIEW -> DECISIONS.contains(next);
            case WAITLISTED -> next == ACCEPTED || next == REJECTED;
            case ACCEPTED -> next == ENROLLED;
            case REJECTED, ENROLLED -> false;
        };
    }

    /** True while the application can still change, i.e. it holds a place in the queue. */
    public boolean isActive() {
        return this != REJECTED && this != ENROLLED;
    }
}
