package za.ac.ump.edugateway.entity;

import jakarta.persistence.*;
import za.ac.ump.edugateway.enums.RecipientType;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification", indexes = @Index(columnList = "recipient_type, recipient_id"))
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "recipient_type", nullable = false)
    private RecipientType recipientType;

    /** Guardian id or school id, depending on {@link #recipientType}; null for the district. */
    @Column(name = "recipient_id")
    private Long recipientId;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String body;

    /** Optional application this notification is about, so the UI can link to it. */
    @Column(name = "application_id")
    private Long applicationId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "read_flag", nullable = false)
    private boolean read;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public RecipientType getRecipientType() { return recipientType; }
    public void setRecipientType(RecipientType recipientType) { this.recipientType = recipientType; }
    public Long getRecipientId() { return recipientId; }
    public void setRecipientId(Long recipientId) { this.recipientId = recipientId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
}
