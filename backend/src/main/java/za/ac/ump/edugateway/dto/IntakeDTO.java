package za.ac.ump.edugateway.dto;

import java.util.List;

public record IntakeDTO(
        Long id,
        Long schoolId,
        String schoolName,
        String grade,
        int year,
        String openDate,
        String closeDate,
        int capacity,
        List<String> requiredDocuments,
        boolean open,
        long applicationCount,
        long acceptedCount) {
}
