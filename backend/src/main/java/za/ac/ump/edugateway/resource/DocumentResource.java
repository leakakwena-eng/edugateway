package za.ac.ump.edugateway.resource;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import za.ac.ump.edugateway.dto.DocumentDTO;
import za.ac.ump.edugateway.dto.Requests;
import za.ac.ump.edugateway.security.CurrentUser;
import za.ac.ump.edugateway.service.DocumentService;

import java.util.List;

/** Uploads go through {@code POST /applications/{id}/documents}; this resource lists, reviews and serves files. */
@Path("/documents")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class DocumentResource {

    @Inject
    private DocumentService service;

    @Context
    private SecurityContext ctx;

    @GET
    public List<DocumentDTO> list() {
        return service.list(CurrentUser.from(ctx));
    }

    @PATCH
    @Path("/{id}")
    @RolesAllowed("SCHOOL_ADMIN")
    public DocumentDTO review(@PathParam("id") Long id, @NotNull @Valid Requests.DocumentReview req) {
        return service.review(CurrentUser.from(ctx), id, req);
    }

    @GET
    @Path("/{id}/file")
    @Produces(MediaType.WILDCARD)
    public Response download(@PathParam("id") Long id) {
        DocumentService.StoredFile file = service.open(CurrentUser.from(ctx), id);
        return Response.ok(file.path().toFile(), file.contentType())
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + file.fileName().replace("\"", "") + "\"")
                .header("X-Content-Type-Options", "nosniff")
                .build();
    }
}
