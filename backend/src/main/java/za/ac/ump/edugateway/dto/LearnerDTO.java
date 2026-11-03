package za.ac.ump.edugateway.dto;

public record LearnerDTO(
        Long id,
        Long guardianId,
        String guardianName,
        String name,
        String dateOfBirth,
        String idNumber,
        String gender,
        Long currentSchoolId,
        String currentSchoolName,
        String currentGrade) {
}
