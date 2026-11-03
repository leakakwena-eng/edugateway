package za.ac.ump.edugateway.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import za.ac.ump.edugateway.dto.NotificationDTO;
import za.ac.ump.edugateway.security.CurrentUser;
import za.ac.ump.edugateway.service.NotificationService;

import java.util.List;

@Path("/notifications")
@Produces(MediaType.APPLICATION_JSON)
public class NotificationResource {

    @Inject
    private NotificationService service;

    @Context
    private SecurityContext ctx;

    @GET
    public List<NotificationDTO> list() {
        return service.listFor(CurrentUser.from(ctx));
    }

    @POST
    @Path("/{id}/read")
    public Response markRead(@PathParam("id") Long id) {
        service.markRead(CurrentUser.from(ctx), id);
        return Response.noContent().build();
    }

    @POST
    @Path("/read-all")
    public Response markAllRead() {
        service.markAllRead(CurrentUser.from(ctx));
        return Response.noContent().build();
    }
}
