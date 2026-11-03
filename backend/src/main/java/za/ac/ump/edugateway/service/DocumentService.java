package za.ac.ump.edugateway.service;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.ws.rs.core.Response;
import za.ac.ump.edugateway.config.AppSettings;
import za.ac.ump.edugateway.dto.DocumentDTO;
import za.ac.ump.edugateway.dto.Requests;
import za.ac.ump.edugateway.entity.Application;
import za.ac.ump.edugateway.entity.Document;
import za.ac.ump.edugateway.enums.DocumentStatus;
import za.ac.ump.edugateway.enums.Role;
import za.ac.ump.edugateway.exception.ApiException;
import za.ac.ump.edugateway.mapper.DtoMapper;
import za.ac.ump.edugateway.security.AuthUser;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Supporting documents for applications. Files are stored on disk under the configured
 * upload directory (outside the web root); the database keeps the relative path.
 */
@Stateless
public class DocumentService {

    private static final Map<String, String> ALLOWED_TYPES = Map.of(
            "application/pdf", ".pdf",
            "image/jpeg", ".jpg",
            "image/png", ".png");

    @PersistenceContext(unitName = "EduGatewayPU")
    private EntityManager em;

    @Inject
    private AuditService audit;

    @Inject
    private NotificationService notifications;

    /** A stored file ready to stream back to the client. */
    public record StoredFile(Path path, String fileName, String contentType) {
    }

    public List<DocumentDTO> list(AuthUser user) {
        var query = switch (user.role()) {
            case GUARDIAN -> em.createQuery(
                            "SELECT d FROM Document d WHERE d.application.learner.guardian.id = :id "
                                    + "ORDER BY d.uploadedAt DESC, d.id DESC", Document.class)
                    .setParameter("id", user.id());
            case SCHOOL_ADMIN -> em.createQuery(
                            "SELECT d FROM Document d WHERE d.application.intake.school.id = :id "
                                    + "ORDER BY d.uploadedAt DESC, d.id DESC", Document.class)
                    .setParameter("id", user.schoolId());
            case DISTRICT_ADMIN -> em.createQuery(
                    "SELECT d FROM Document d ORDER BY d.uploadedAt DESC, d.id DESC", Document.class);
        };
        return query.getResultStream().map(DtoMapper::toDTO).toList();
    }

    /**
     * Stores an upload for one of the application's required documents. Uploading the same
     * type again replaces a pending or rejected file; verified documents are locked.
     */
    public DocumentDTO upload(AuthUser user, Long applicationId, String type,
                              String originalName, String contentType, InputStream content) {
        Application app = em.find(Application.class, applicationId);
        if (app == null) throw ApiException.notFound("Application");
        Access.requireView(user, app);
        if (user.role() != Role.GUARDIAN) {
            throw ApiException.forbidden("Only the guardian can upload documents");
        }
        if (!app.getStatus().isActive()) {
            throw ApiException.conflict("Documents cannot be changed on a closed application");
        }

        String docType = Parse.trimToNull(type);
        List<String> required = app.getIntake().getRequiredDocuments();
        if (docType == null) throw ApiException.badRequest("type is required");
        if (!required.isEmpty() && !required.contains(docType)) {
            throw ApiException.badRequest("This intake does not ask for '" + docType + "'");
        }
        String mediaType = contentType == null ? "" : contentType.split(";")[0].trim().toLowerCase();
        String extension = ALLOWED_TYPES.get(mediaType);
        if (extension == null) {
            throw ApiException.badRequest("Only PDF, JPEG or PNG files are accepted");
        }

        Document doc = app.getDocuments().stream()
                .filter(d -> d.getType().equals(docType))
                .findFirst()
                .orElse(null);
        if (doc != null && doc.getStatus() == DocumentStatus.VERIFIED) {
            throw ApiException.conflict(docType + " has already been verified");
        }

        String relative = "application-" + app.getId() + "/" + UUID.randomUUID() + extension;
        long size = store(content, AppSettings.uploadDir().resolve(relative));
        String previous = doc != null ? doc.getFilePath() : null;

        if (doc == null) {
            doc = new Document();
            doc.setApplication(app);
            doc.setType(docType);
            app.getDocuments().add(doc);
        }
        doc.setFilePath(relative);
        doc.setOriginalFileName(safeFileName(originalName, extension));
        doc.setContentType(mediaType);
        doc.setSizeBytes(size);
        doc.setUploadedAt(LocalDateTime.now());
        doc.setStatus(DocumentStatus.PENDING);
        doc.setRejectionReason(null);
        em.persist(doc);
        em.flush();

        if (previous != null) deleteQuietly(previous);
        audit.record(user, app.getReference(), "DOCUMENT_UPLOADED", docType);
        notifications.toSchool(app.getIntake().getSchool().getId(), "Document uploaded",
                docType + " uploaded for " + app.getLearner().getName() + " (" + app.getReference() + ").", app.getId());
        return DtoMapper.toDTO(doc);
    }

    public DocumentDTO review(AuthUser user, Long documentId, Requests.DocumentReview req) {
        Document doc = find(documentId);
        Application app = doc.getApplication();
        Access.requireReceivingSchool(user, app);

        DocumentStatus status = Parse.enumValue(DocumentStatus.class, "status", req.status());
        if (status == DocumentStatus.PENDING) {
            throw ApiException.badRequest("status must be VERIFIED or REJECTED");
        }
        String reason = Parse.trimToNull(req.reason());
        if (status == DocumentStatus.REJECTED && reason == null) {
            throw ApiException.badRequest("A reason is required when rejecting a document");
        }

        doc.setStatus(status);
        doc.setRejectionReason(status == DocumentStatus.REJECTED ? reason : null);

        audit.record(user, app.getReference(), "DOCUMENT_" + status.name(),
                reason == null ? doc.getType() : doc.getType() + ": " + reason);
        if (status == DocumentStatus.REJECTED) {
            notifications.toGuardian(app.getLearner().getGuardian().getId(), "Document needs attention",
                    doc.getType() + " for " + app.getLearner().getName() + " was rejected: " + reason
                            + ". Please upload a new copy.", app.getId());
        }
        return DtoMapper.toDTO(doc);
    }

    public StoredFile open(AuthUser user, Long documentId) {
        Document doc = find(documentId);
        Access.requireView(user, doc.getApplication());
        if (doc.getFilePath() == null) throw ApiException.notFound("File");
        Path path = AppSettings.uploadDir().resolve(doc.getFilePath()).normalize();
        if (!Files.isReadable(path)) {
            throw ApiException.notFound("File");
        }
        return new StoredFile(path, doc.getOriginalFileName(), doc.getContentType());
    }

    private Document find(Long id) {
        Document d = em.find(Document.class, id);
        if (d == null) throw ApiException.notFound("Document");
        return d;
    }

    /** Copies the upload to disk, enforcing the size limit while streaming. */
    private long store(InputStream in, Path target) {
        long max = AppSettings.maxUploadBytes();
        try {
            Files.createDirectories(target.getParent());
            long total = 0;
            byte[] buffer = new byte[8192];
            try (in; OutputStream out = Files.newOutputStream(target)) {
                int n;
                while ((n = in.read(buffer)) != -1) {
                    total += n;
                    if (total > max) {
                        throw new ApiException(Response.Status.REQUEST_ENTITY_TOO_LARGE,
                                "Files must be smaller than " + (max / (1024 * 1024)) + " MB");
                    }
                    out.write(buffer, 0, n);
                }
            }
            if (total == 0) throw ApiException.badRequest("The uploaded file is empty");
            return total;
        } catch (IOException e) {
            deleteQuietly(target.toString());
            throw new UncheckedIOException("Could not store upload", e);
        } catch (ApiException e) {
            deleteQuietly(target.toString());
            throw e;
        }
    }

    private void deleteQuietly(String path) {
        try {
            Files.deleteIfExists(AppSettings.uploadDir().resolve(path));
        } catch (IOException ignored) {
            // Leftover files are harmless; nothing references them any more.
        }
    }

    private static String safeFileName(String name, String extension) {
        if (name == null || name.isBlank()) return "document" + extension;
        String base = Path.of(name).getFileName().toString();
        return base.replaceAll("[^A-Za-z0-9._ -]", "_");
    }
}
