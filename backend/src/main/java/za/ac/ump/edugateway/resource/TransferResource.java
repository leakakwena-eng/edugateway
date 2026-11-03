package za.ac.ump.edugateway.resource;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.SecurityContext;
import za.ac.ump.edugateway.dto.TransferDTO;
import za.ac.ump.edugateway.security.CurrentUser;
import za.ac.ump.edugateway.service.TransferService;

import java.util.List;

/** Transfers are started by submitting an application for an already-enrolled learner. */
@Path("/transfers")
@Produces(MediaType.APPLICATION_JSON)
public class TransferResource {

    @Inject
    private TransferService service;

    @Context
    private SecurityContext ctx;

    @GET
    public List<TransferDTO> list() {
        return service.list(CurrentUser.from(ctx));
    }

    @GET
    @Path("/{id}")
    public TransferDTO get(@PathParam("id") Long id) {
        return service.get(CurrentUser.from(ctx), id);
    }

    @POST
    @Path("/{id}/release")
    @RolesAllowed("SCHOOL_ADMIN")
    public TransferDTO release(@PathParam("id") Long id) {
        return service.releaseRecords(CurrentUser.from(ctx), id);
    }
}
