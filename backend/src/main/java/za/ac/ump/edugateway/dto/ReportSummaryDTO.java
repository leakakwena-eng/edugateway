package za.ac.ump.edugateway.dto;

import java.util.List;
import java.util.Map;

/** Headline numbers for a dashboard, scoped to one school or the whole district. */
public record ReportSummaryDTO(
        int year,
        long totalApplications,
        long totalLearners,
        long totalSchools,
        long totalGuardians,
        long openIntakes,
        long pendingTransfers,
        Map<String, Long> byStatus,
        Map<String, Long> byType,
        List<Long> byMonth) {
}
