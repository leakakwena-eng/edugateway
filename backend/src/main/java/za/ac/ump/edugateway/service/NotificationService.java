package za.ac.ump.edugateway.service;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import za.ac.ump.edugateway.dto.NotificationDTO;
import za.ac.ump.edugateway.entity.Notification;
import za.ac.ump.edugateway.enums.RecipientType;
import za.ac.ump.edugateway.enums.Role;
import za.ac.ump.edugateway.exception.ApiException;
import za.ac.ump.edugateway.mapper.DtoMapper;
import za.ac.ump.edugateway.security.AuthUser;

import java.util.List;

/** In-app notifications. Guardians get their own; school admins share their school's inbox. */
@Stateless
public class NotificationService {

    @PersistenceContext(unitName = "EduGatewayPU")
    private EntityManager em;

    public void toGuardian(Long guardianId, String title, String body, Long applicationId) {
        create(RecipientType.GUARDIAN, guardianId, title, body, applicationId);
    }

    public void toSchool(Long schoolId, String title, String body, Long applicationId) {
        create(RecipientType.SCHOOL, schoolId, title, body, applicationId);
    }

    public void toDistrict(String title, String body, Long applicationId) {
        create(RecipientType.DISTRICT, null, title, body, applicationId);
    }

    public List<NotificationDTO> listFor(AuthUser user) {
        TypedQuery<Notification> q = em.createQuery(
                "SELECT n FROM Notification n WHERE " + inboxClause(user) + " ORDER BY n.createdAt DESC, n.id DESC",
                Notification.class);
        bindInbox(q, user);
        return q.setMaxResults(100).getResultStream().map(DtoMapper::toDTO).toList();
    }

    public void markRead(AuthUser user, Long id) {
        Query q = em.createQuery("UPDATE Notification n SET n.read = true WHERE n.id = :id AND " + inboxClause(user));
        bindInbox(q, user);
        if (q.setParameter("id", id).executeUpdate() == 0) {
            throw ApiException.notFound("Notification");
        }
    }

    public void markAllRead(AuthUser user) {
        Query q = em.createQuery("UPDATE Notification n SET n.read = true WHERE n.read = false AND " + inboxClause(user));
        bindInbox(q, user);
        q.executeUpdate();
    }

    private void create(RecipientType type, Long recipientId, String title, String body, Long applicationId) {
        Notification n = new Notification();
        n.setRecipientType(type);
        n.setRecipientId(recipientId);
        n.setTitle(title);
        n.setBody(body);
        n.setApplicationId(applicationId);
        em.persist(n);
    }

    private static String inboxClause(AuthUser user) {
        return user.role() == Role.DISTRICT_ADMIN
                ? "n.recipientType = :type"
                : "n.recipientType = :type AND n.recipientId = :rid";
    }

    private static void bindInbox(Query q, AuthUser user) {
        switch (user.role()) {
            case GUARDIAN -> q.setParameter("type", RecipientType.GUARDIAN).setParameter("rid", user.id());
            case SCHOOL_ADMIN -> q.setParameter("type", RecipientType.SCHOOL).setParameter("rid", user.schoolId());
            case DISTRICT_ADMIN -> q.setParameter("type", RecipientType.DISTRICT);
        }
    }
}
