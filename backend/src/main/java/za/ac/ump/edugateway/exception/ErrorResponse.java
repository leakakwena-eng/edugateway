package za.ac.ump.edugateway.exception;

import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/** The single error shape every endpoint returns: {"error": "..."}. */
public record ErrorResponse(String error) {

    public static Response of(Response.StatusType status, String message) {
        return Response.status(status)
                .type(MediaType.APPLICATION_JSON)
                .entity(new ErrorResponse(message))
                .build();
    }
}
