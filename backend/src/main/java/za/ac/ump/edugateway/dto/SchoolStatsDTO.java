package za.ac.ump.edugateway.dto;

public record SchoolStatsDTO(
        Long schoolId,
        String schoolName,
        String schoolType,
        long applications,
        long pending,
        long accepted,
        long enrolled,
        long rejected,
        long capacity) {
}
