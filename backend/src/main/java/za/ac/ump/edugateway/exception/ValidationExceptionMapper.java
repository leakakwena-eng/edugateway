package za.ac.ump.edugateway.exception;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import java.util.stream.Collectors;

@Provider
public class ValidationExceptionMapper implements ExceptionMapper<ConstraintViolationException> {

    @Override
    public Response toResponse(ConstraintViolationException e) {
        String message = e.getConstraintViolations().stream()
                .map(this::describe)
                .sorted()
                .collect(Collectors.joining("; "));
        return ErrorResponse.of(Response.Status.BAD_REQUEST, message);
    }

    private String describe(ConstraintViolation<?> v) {
        String path = v.getPropertyPath().toString();
        String field = path.substring(path.lastIndexOf('.') + 1);
        return field + " " + v.getMessage();
    }
}
