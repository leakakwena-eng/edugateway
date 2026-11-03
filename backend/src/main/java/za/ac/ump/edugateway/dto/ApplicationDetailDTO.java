package za.ac.ump.edugateway.dto;

import java.util.List;

/** Everything needed for an application's detail page. {@code reviewNotes} is null for guardians. */
public record ApplicationDetailDTO(
        ApplicationDTO application,
        GuardianDTO guardian,
        List<String> requiredDocuments,
        List<DocumentDTO> documents,
        List<AuditEntryDTO> history,
        String reviewNotes) {
}
