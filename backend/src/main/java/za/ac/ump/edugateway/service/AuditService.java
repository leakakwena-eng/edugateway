package za.ac.ump.edugateway.service;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import za.ac.ump.edugateway.dto.AuditEntryDTO;
import za.ac.ump.edugateway.entity.AuditEvent;
import za.ac.ump.edugateway.mapper.DtoMapper;
import za.ac.ump.edugateway.security.AuthUser;

import java.time.LocalDateTime;
import java.util.List;

/** Append-only record of who did what. Joins the caller's transaction. */
@Stateless
public class AuditService {

    @PersistenceContext(unitName = "EduGatewayPU")
    private EntityManager em;

    /** @param actor the user responsible, or null for system actions */
    public void record(AuthUser actor, String entityRef, String action, String details) {
        AuditEvent ev = new AuditEvent();
        if (actor != null) {
            ev.setActorId(actor.id());
            ev.setActorName(actor.label());
            ev.setActorRole(actor.role());
        }
        ev.setEntityRef(entityRef);
        ev.setAction(action);
        ev.setDetails(details);
        ev.setTimestamp(LocalDateTime.now());
        em.persist(ev);
    }

    public List<AuditEntryDTO> historyFor(String entityRef) {
        return em.createQuery(
                        "SELECT e FROM AuditEvent e WHERE e.entityRef = :ref ORDER BY e.timestamp, e.id",
                        AuditEvent.class)
                .setParameter("ref", entityRef)
                .getResultStream()
                .map(DtoMapper::toDTO)
                .toList();
    }

    public List<AuditEntryDTO> recent(int limit) {
        return em.createQuery("SELECT e FROM AuditEvent e ORDER BY e.timestamp DESC, e.id DESC", AuditEvent.class)
                .setMaxResults(Math.max(1, Math.min(limit, 500)))
                .getResultStream()
                .map(DtoMapper::toDTO)
                .toList();
    }
}
