package za.ac.ump.edugateway.resource;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.SecurityContext;
import za.ac.ump.edugateway.dto.GuardianDTO;
import za.ac.ump.edugateway.dto.Requests;
import za.ac.ump.edugateway.dto.UserDTO;
import za.ac.ump.edugateway.security.CurrentUser;
import za.ac.ump.edugateway.service.GuardianService;

import java.util.List;

@Path("/guardians")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class GuardianResource {

    @Inject
    private GuardianService service;

    @GET
    @RolesAllowed("DISTRICT_ADMIN")
    public List<GuardianDTO> listAll() {
        return service.listAll();
    }

    @PUT
    @Path("/me")
    @RolesAllowed("GUARDIAN")
    public UserDTO updateProfile(@Context SecurityContext ctx, @NotNull @Valid Requests.Profile req) {
        return service.updateProfile(CurrentUser.from(ctx), req);
    }
}
