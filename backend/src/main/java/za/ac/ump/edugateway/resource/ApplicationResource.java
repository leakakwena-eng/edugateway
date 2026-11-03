package za.ac.ump.edugateway.resource;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.EntityPart;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import za.ac.ump.edugateway.dto.ApplicationDTO;
import za.ac.ump.edugateway.dto.ApplicationDetailDTO;
import za.ac.ump.edugateway.dto.Requests;
import za.ac.ump.edugateway.exception.ApiException;
import za.ac.ump.edugateway.security.CurrentUser;
import za.ac.ump.edugateway.service.ApplicationService;
import za.ac.ump.edugateway.service.DocumentService;

import java.io.IOException;
import java.util.List;

@Path("/applications")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ApplicationResource {

    @Inject
    private ApplicationService service;

    @Inject
    private DocumentService documents;

    @Context
    private SecurityContext ctx;

    /** Scoped to the caller: own learners, own school, or everything for the district. */
    @GET
    public List<ApplicationDTO> list(@QueryParam("status") String status) {
        return service.list(CurrentUser.from(ctx), status);
    }

    @GET
    @Path("/{id}")
    public ApplicationDetailDTO get(@PathParam("id") Long id) {
        return service.detail(CurrentUser.from(ctx), id);
    }

    @POST
    @RolesAllowed("GUARDIAN")
    public Response submit(@NotNull @Valid Requests.NewApplication req) {
        return Response.status(Response.Status.CREATED)
                .entity(service.submit(CurrentUser.from(ctx), req))
                .build();
    }

    @POST
    @Path("/{id}/review")
    @RolesAllowed("SCHOOL_ADMIN")
    public ApplicationDetailDTO startReview(@PathParam("id") Long id) {
        return service.startReview(CurrentUser.from(ctx), id);
    }

    @POST
    @Path("/{id}/decision")
    @RolesAllowed("SCHOOL_ADMIN")
    public ApplicationDetailDTO decide(@PathParam("id") Long id, @NotNull @Valid Requests.Decision req) {
        return service.decide(CurrentUser.from(ctx), id, req);
    }

    @POST
    @Path("/{id}/enrol")
    @RolesAllowed("SCHOOL_ADMIN")
    public ApplicationDetailDTO enrol(@PathParam("id") Long id) {
        return service.enrol(CurrentUser.from(ctx), id);
    }

    @PUT
    @Path("/{id}/notes")
    @RolesAllowed("SCHOOL_ADMIN")
    public ApplicationDetailDTO saveNotes(@PathParam("id") Long id, @NotNull @Valid Requests.Notes req) {
        return service.saveNotes(CurrentUser.from(ctx), id, req);
    }

    /** Multipart upload with fields {@code type} (document kind) and {@code file}. */
    @POST
    @Path("/{id}/documents")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @RolesAllowed("GUARDIAN")
    public Response upload(@PathParam("id") Long id,
                           @FormParam("type") String type,
                           @FormParam("file") EntityPart file) throws IOException {
        if (file == null) throw ApiException.badRequest("file is required");
        String contentType = file.getMediaType() != null ? file.getMediaType().toString() : null;
        var dto = documents.upload(CurrentUser.from(ctx), id, type,
                file.getFileName().orElse(null), contentType, file.getContent());
        return Response.status(Response.Status.CREATED).entity(dto).build();
    }
}
