package za.ac.ump.edugateway.dto;

public record TransferDTO(
        Long id,
        Long applicationId,
        String applicationRef,
        String applicationStatus,
        Long learnerId,
        String learnerName,
        String grade,
        Long sendingSchoolId,
        String sendingSchoolName,
        Long receivingSchoolId,
        String receivingSchoolName,
        String releaseStatus,
        String releasedAt,
        String submittedAt) {
}
