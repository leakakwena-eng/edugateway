package za.ac.ump.edugateway.dto;

/** Application as shown in lists. Transfer fields are null for NEW applications. */
public record ApplicationDTO(
        Long id,
        String reference,
        String type,
        String status,
        Long learnerId,
        String learnerName,
        Long guardianId,
        String guardianName,
        Long intakeId,
        Long schoolId,
        String schoolName,
        String grade,
        int year,
        String submittedAt,
        String decidedAt,
        String rejectionReason,
        Long transferId,
        Long sendingSchoolId,
        String sendingSchoolName,
        String releaseStatus) {
}
