package za.ac.ump.edugateway.service;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import za.ac.ump.edugateway.dto.GuardianDTO;
import za.ac.ump.edugateway.dto.Requests;
import za.ac.ump.edugateway.dto.UserDTO;
import za.ac.ump.edugateway.entity.Guardian;
import za.ac.ump.edugateway.exception.ApiException;
import za.ac.ump.edugateway.mapper.DtoMapper;
import za.ac.ump.edugateway.security.AuthUser;

import java.util.List;

@Stateless
public class GuardianService {

    @PersistenceContext(unitName = "EduGatewayPU")
    private EntityManager em;

    public List<GuardianDTO> listAll() {
        return em.createQuery("SELECT g FROM Guardian g ORDER BY g.name", Guardian.class)
                .getResultStream()
                .map(DtoMapper::toDTO)
                .toList();
    }

    public UserDTO updateProfile(AuthUser user, Requests.Profile req) {
        Guardian g = em.find(Guardian.class, user.id());
        if (g == null) throw ApiException.notFound("Guardian");
        g.setName(req.name().trim());
        g.setPhone(Parse.trimToNull(req.phone()));
        return DtoMapper.toUser(g);
    }
}
