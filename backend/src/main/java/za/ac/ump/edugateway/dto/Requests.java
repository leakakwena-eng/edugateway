package za.ac.ump.edugateway.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * Request bodies accepted by the API. Dates are ISO strings (yyyy-MM-dd) and are
 * parsed in the service layer so a bad value yields a clear 400.
 */
public final class Requests {

    private Requests() {}

    public record Login(
            @NotBlank @Email String email,
            @NotBlank String password) {
    }

    public record Register(
            @NotBlank @Size(max = 120) String name,
            @NotBlank @Email String email,
            @Size(max = 30) String phone,
            @NotBlank @Size(min = 8, message = "must be at least 8 characters") String password) {
    }

    public record Profile(
            @NotBlank @Size(max = 120) String name,
            @Size(max = 30) String phone) {
    }

    public record Learner(
            @NotBlank @Size(max = 120) String name,
            String dateOfBirth,
            @Pattern(regexp = "\\d{13}", message = "must be a 13-digit SA ID number") String idNumber,
            @Size(max = 20) String gender) {
    }

    public record NewApplication(
            @NotNull Long learnerId,
            @NotNull Long intakeId) {
    }

    public record Decision(
            @NotBlank String decision,
            @Size(max = 500) String reason) {
    }

    public record Notes(@Size(max = 2000) String notes) {
    }

    public record Intake(
            @NotBlank @Size(max = 40) String grade,
            @NotNull @Min(2000) @Max(2100) Integer year,
            String openDate,
            String closeDate,
            @NotNull @Min(1) Integer capacity,
            List<String> requiredDocuments) {
    }

    public record DocumentReview(
            @NotBlank String status,
            @Size(max = 500) String reason) {
    }

    public record School(
            @NotBlank @Size(max = 160) String name,
            @NotBlank String type,
            @NotBlank @Pattern(regexp = "\\d{6,9}", message = "must be 6 to 9 digits") String emisNo) {
    }
}
