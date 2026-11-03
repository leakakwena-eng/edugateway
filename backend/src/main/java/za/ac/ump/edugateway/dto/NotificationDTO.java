package za.ac.ump.edugateway.dto;

public record NotificationDTO(
        Long id,
        String title,
        String body,
        Long applicationId,
        String createdAt,
        boolean read) {
}
