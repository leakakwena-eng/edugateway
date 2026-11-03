package za.ac.ump.edugateway.entity;

import jakarta.persistence.*;
import za.ac.ump.edugateway.enums.ApplicationStatus;
import za.ac.ump.edugateway.enums.ApplicationType;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "application")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "learner_id", nullable = false)
    private Learner learner;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "intake_id", nullable = false)
    private Intake intake;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "decided_at")
    private LocalDateTime decidedAt;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    /** Notes the receiving school keeps while reviewing; never shown to guardians. */
    @Column(name = "review_notes", length = 2000)
    private String reviewNotes;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id")
    private List<Document> documents = new ArrayList<>();

    @OneToOne(mappedBy = "application", fetch = FetchType.LAZY)
    private TransferRecord transferRecord;

    /** Public reference shown in the UI, e.g. APP-1004. */
    public String getReference() {
        return id == null ? null : "APP-" + (1000 + id);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Learner getLearner() { return learner; }
    public void setLearner(Learner learner) { this.learner = learner; }
    public Intake getIntake() { return intake; }
    public void setIntake(Intake intake) { this.intake = intake; }
    public ApplicationType getType() { return type; }
    public void setType(ApplicationType type) { this.type = type; }
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public LocalDateTime getDecidedAt() { return decidedAt; }
    public void setDecidedAt(LocalDateTime decidedAt) { this.decidedAt = decidedAt; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public String getReviewNotes() { return reviewNotes; }
    public void setReviewNotes(String reviewNotes) { this.reviewNotes = reviewNotes; }
    public List<Document> getDocuments() { return documents; }
    public void setDocuments(List<Document> documents) { this.documents = documents; }
    public TransferRecord getTransferRecord() { return transferRecord; }
    public void setTransferRecord(TransferRecord transferRecord) { this.transferRecord = transferRecord; }
}
