package za.ac.ump.edugateway.exception;

import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import java.util.logging.Level;
import java.util.logging.Logger;

/** Turns anything not handled elsewhere into the standard error body, hiding internals on 500s. */
@Provider
public class FallbackExceptionMapper implements ExceptionMapper<Exception> {

    private static final Logger LOG = Logger.getLogger(FallbackExceptionMapper.class.getName());

    @Override
    public Response toResponse(Exception e) {
        if (e instanceof WebApplicationException wae) {
            Response.StatusType status = wae.getResponse().getStatusInfo();
            return ErrorResponse.of(status, status.getReasonPhrase());
        }
        LOG.log(Level.SEVERE, "Unhandled error", e);
        return ErrorResponse.of(Response.Status.INTERNAL_SERVER_ERROR, "Unexpected server error");
    }
}
