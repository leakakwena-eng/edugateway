package za.ac.ump.edugateway.dto;

public record DocumentDTO(
        Long id,
        Long applicationId,
        String applicationRef,
        String learnerName,
        String type,
        String fileName,
        String contentType,
        Long sizeBytes,
        String status,
        String rejectionReason,
        String uploadedAt) {
}
