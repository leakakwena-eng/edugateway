package za.ac.ump.edugateway.service;

import za.ac.ump.edugateway.entity.Application;
import za.ac.ump.edugateway.entity.Learner;
import za.ac.ump.edugateway.entity.TransferRecord;
import za.ac.ump.edugateway.enums.Role;
import za.ac.ump.edugateway.exception.ApiException;
import za.ac.ump.edugateway.security.AuthUser;

import java.util.Objects;

/**
 * Row-level access rules. Role checks happen in the REST layer ({@code @RolesAllowed});
 * these checks decide whether a caller may touch a particular record.
 * Records the caller may not see are reported as "not found" so their existence is not leaked.
 */
final class Access {

    private Access() {}

    static boolean canView(AuthUser user, Application app) {
        return switch (user.role()) {
            case GUARDIAN -> Objects.equals(app.getLearner().getGuardian().getId(), user.id());
            case SCHOOL_ADMIN -> isReceivingSchool(user, app) || isSendingSchool(user, app);
            case DISTRICT_ADMIN -> true;
        };
    }

    static void requireView(AuthUser user, Application app) {
        if (!canView(user, app)) throw ApiException.notFound("Application");
    }

    /** Only the school an application was made to may decide on it, review documents, or enrol. */
    static void requireReceivingSchool(AuthUser user, Application app) {
        requireView(user, app);
        if (!isReceivingSchool(user, app)) {
            throw ApiException.forbidden("Only the receiving school can do this");
        }
    }

    static void requireOwnLearner(AuthUser user, Learner learner) {
        if (user.role() != Role.GUARDIAN || !Objects.equals(learner.getGuardian().getId(), user.id())) {
            throw ApiException.notFound("Learner");
        }
    }

    static boolean isReceivingSchool(AuthUser user, Application app) {
        return user.role() == Role.SCHOOL_ADMIN
                && Objects.equals(app.getIntake().getSchool().getId(), user.schoolId());
    }

    static boolean isSendingSchool(AuthUser user, Application app) {
        TransferRecord t = app.getTransferRecord();
        return user.role() == Role.SCHOOL_ADMIN
                && t != null
                && Objects.equals(t.getSendingSchool().getId(), user.schoolId());
    }
}
