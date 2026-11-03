package za.ac.ump.edugateway.dto;

public record AuditEntryDTO(
        Long id,
        String timestamp,
        String actorName,
        String actorRole,
        String entityRef,
        String action,
        String details) {
}
