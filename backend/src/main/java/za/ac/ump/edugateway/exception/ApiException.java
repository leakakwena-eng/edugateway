package za.ac.ump.edugateway.exception;

import jakarta.ejb.ApplicationException;
import jakarta.ws.rs.core.Response.Status;

/**
 * A business error that maps directly to an HTTP status. Marked as an EJB application
 * exception so it reaches the REST layer unwrapped and still rolls back the transaction.
 */
@ApplicationException(rollback = true)
public class ApiException extends RuntimeException {

    private final Status status;

    public ApiException(Status status, String message) {
        super(message);
        this.status = status;
    }

    public Status getStatus() {
        return status;
    }

    public static ApiException badRequest(String message) {
        return new ApiException(Status.BAD_REQUEST, message);
    }

    public static ApiException unauthorized(String message) {
        return new ApiException(Status.UNAUTHORIZED, message);
    }

    public static ApiException forbidden(String message) {
        return new ApiException(Status.FORBIDDEN, message);
    }

    public static ApiException notFound(String what) {
        return new ApiException(Status.NOT_FOUND, what + " not found");
    }

    public static ApiException conflict(String message) {
        return new ApiException(Status.CONFLICT, message);
    }
}
