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
import za.ac.ump.edugateway.dto.IntakeDTO;
import za.ac.ump.edugateway.dto.Requests;
import za.ac.ump.edugateway.security.CurrentUser;
import za.ac.ump.edugateway.service.IntakeService;

import java.util.List;

@Path("/intakes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class IntakeResource {

    @Inject
    private IntakeService service;

    @Context
    private SecurityContext ctx;

    /** {@code ?schoolId=3&open=true} — guardians use open=true when choosing where to apply. */
    @GET
    public List<IntakeDTO> list(@QueryParam("schoolId") Long schoolId,
                                @QueryParam("open") @DefaultValue("false") boolean openOnly) {
        return service.list(schoolId, openOnly);
    }

    @GET
    @Path("/{id}")
    public IntakeDTO get(@PathParam("id") Long id) {
        return service.get(id);
    }

    @POST
    @RolesAllowed("SCHOOL_ADMIN")
    public Response create(@NotNull @Valid Requests.Intake req) {
        return Response.status(Response.Status.CREATED)
                .entity(service.create(CurrentUser.from(ctx), req))
                .build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("SCHOOL_ADMIN")
    public IntakeDTO update(@PathParam("id") Long id, @NotNull @Valid Requests.Intake req) {
        return service.update(CurrentUser.from(ctx), id, req);
    }
}
