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
import za.ac.ump.edugateway.dto.Requests;
import za.ac.ump.edugateway.dto.SchoolDTO;
import za.ac.ump.edugateway.security.CurrentUser;
import za.ac.ump.edugateway.service.SchoolService;

import java.util.List;

@Path("/schools")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SchoolResource {

    @Inject
    private SchoolService service;

    @GET
    public List<SchoolDTO> listAll() {
        return service.listAll();
    }

    @GET
    @Path("/{id}")
    public SchoolDTO getOne(@PathParam("id") Long id) {
        return service.findById(id);
    }

    @POST
    @RolesAllowed("DISTRICT_ADMIN")
    public Response create(@Context SecurityContext ctx, @NotNull @Valid Requests.School req) {
        return Response.status(Response.Status.CREATED)
                .entity(service.create(CurrentUser.from(ctx), req))
                .build();
    }
}
