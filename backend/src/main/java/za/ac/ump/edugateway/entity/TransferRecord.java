package za.ac.ump.edugateway.entity;

import jakarta.persistence.*;
import za.ac.ump.edugateway.enums.TransferReleaseStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "transfer_record")
public class TransferRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transfer_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private Application application;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sending_school_id", nullable = false)
    private School sendingSchool;

    @Enumerated(EnumType.STRING)
    @Column(name = "record_release_status", nullable = false)
    private TransferReleaseStatus releaseStatus = TransferReleaseStatus.PENDING;

    @Column(name = "released_at")
    private LocalDateTime releasedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }
    public School getSendingSchool() { return sendingSchool; }
    public void setSendingSchool(School sendingSchool) { this.sendingSchool = sendingSchool; }
    public TransferReleaseStatus getReleaseStatus() { return releaseStatus; }
    public void setReleaseStatus(TransferReleaseStatus releaseStatus) { this.releaseStatus = releaseStatus; }
    public LocalDateTime getReleasedAt() { return releasedAt; }
    public void setReleasedAt(LocalDateTime releasedAt) { this.releasedAt = releasedAt; }
}
