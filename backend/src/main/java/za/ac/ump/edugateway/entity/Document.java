package za.ac.ump.edugateway.entity;

import jakarta.persistence.*;
import za.ac.ump.edugateway.enums.DocumentStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "document")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "document_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    /** Document kind, matching one of the intake's required documents (e.g. "Birth Certificate"). */
    @Column(nullable = false)
    private String type;

    /** Location on disk, relative to the configured upload directory. */
    @Column(name = "file_path")
    private String filePath;

    @Column(name = "original_file_name")
    private String originalFileName;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "size_bytes")
    private Long sizeBytes;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "verified_flag", nullable = false)
    private DocumentStatus status = DocumentStatus.PENDING;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public Long getSizeBytes() { return sizeBytes; }
    public void setSizeBytes(Long sizeBytes) { this.sizeBytes = sizeBytes; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
    public DocumentStatus getStatus() { return status; }
    public void setStatus(DocumentStatus status) { this.status = status; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
