package za.ac.ump.edugateway.service;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import za.ac.ump.edugateway.dto.Requests;
import za.ac.ump.edugateway.dto.SchoolDTO;
import za.ac.ump.edugateway.entity.School;
import za.ac.ump.edugateway.exception.ApiException;
import za.ac.ump.edugateway.mapper.DtoMapper;
import za.ac.ump.edugateway.security.AuthUser;

import java.util.List;
import java.util.Locale;
import java.util.Set;

@Stateless
public class SchoolService {

    private static final Set<String> TYPES = Set.of("PRIMARY", "HIGH", "COMBINED");

    @PersistenceContext(unitName = "EduGatewayPU")
    private EntityManager em;

    @Inject
    private AuditService audit;

    public List<SchoolDTO> listAll() {
        return em.createQuery("SELECT s FROM School s ORDER BY s.name", School.class)
                .getResultStream()
                .map(DtoMapper::toDTO)
                .toList();
    }

    public SchoolDTO findById(Long id) {
        School s = em.find(School.class, id);
        if (s == null) throw ApiException.notFound("School");
        return DtoMapper.toDTO(s);
    }

    public SchoolDTO create(AuthUser actor, Requests.School req) {
        String type = req.type().trim().toUpperCase(Locale.ROOT);
        if (!TYPES.contains(type)) {
            throw ApiException.badRequest("type must be one of " + TYPES);
        }
        Long existing = em.createQuery("SELECT COUNT(s) FROM School s WHERE s.emisNo = :emis", Long.class)
                .setParameter("emis", req.emisNo())
                .getSingleResult();
        if (existing > 0) {
            throw ApiException.conflict("A school with EMIS number " + req.emisNo() + " already exists");
        }

        School s = new School();
        s.setName(req.name().trim());
        s.setType(type);
        s.setEmisNo(req.emisNo());
        em.persist(s);
        em.flush();

        audit.record(actor, "SCHOOL-" + s.getId(), "SCHOOL_CREATED", s.getName());
        return DtoMapper.toDTO(s);
    }
}
