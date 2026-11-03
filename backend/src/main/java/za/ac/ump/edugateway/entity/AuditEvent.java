package za.ac.ump.edugateway.entity;

import jakarta.persistence.*;
import za.ac.ump.edugateway.enums.Role;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_event", indexes = @Index(columnList = "entity_ref"))
public class AuditEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long id;

    @Column(name = "actor_id")
    private Long actorId;

    @Column(name = "actor_name")
    private String actorName;

    @Enumerated(EnumType.STRING)
    @Column(name = "actor_role")
    private Role actorRole;

    /** What the event is about, e.g. APP-1004 or SCHOOL-3. */
    @Column(name = "entity_ref", nullable = false)
    private String entityRef;

    /** Machine-readable event code, e.g. APPLICATION_SUBMITTED. */
    @Column(nullable = false)
    private String action;

    @Column(length = 500)
    private String details;

    @Column(name = "event_timestamp", nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getActorId() { return actorId; }
    public void setActorId(Long actorId) { this.actorId = actorId; }
    public String getActorName() { return actorName; }
    public void setActorName(String actorName) { this.actorName = actorName; }
    public Role getActorRole() { return actorRole; }
    public void setActorRole(Role actorRole) { this.actorRole = actorRole; }
    public String getEntityRef() { return entityRef; }
    public void setEntityRef(String entityRef) { this.entityRef = entityRef; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
