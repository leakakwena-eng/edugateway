package za.ac.ump.edugateway.resource;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import za.ac.ump.edugateway.dto.LearnerDTO;
import za.ac.ump.edugateway.dto.Requests;
import za.ac.ump.edugateway.security.CurrentUser;
import za.ac.ump.edugateway.service.LearnerService;

import java.util.List;

@Path("/learners")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class LearnerResource {

    @Inject
    private LearnerService service;

    @Context
    private SecurityContext ctx;

    @GET
    public List<LearnerDTO> list() {
        return service.list(CurrentUser.from(ctx));
    }

    @GET
    @Path("/{id}")
    public LearnerDTO get(@PathParam("id") Long id) {
        return service.get(CurrentUser.from(ctx), id);
    }

    @POST
    @RolesAllowed("GUARDIAN")
    public Response create(@NotNull @Valid Requests.Learner req) {
        return Response.status(Response.Status.CREATED)
                .entity(service.create(CurrentUser.from(ctx), req))
                .build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("GUARDIAN")
    public LearnerDTO update(@PathParam("id") Long id, @NotNull @Valid Requests.Learner req) {
        return service.update(CurrentUser.from(ctx), id, req);
    }
}
