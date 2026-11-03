package za.ac.ump.edugateway.resource;

import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import za.ac.ump.edugateway.dto.AuthResponse;
import za.ac.ump.edugateway.dto.Requests;
import za.ac.ump.edugateway.dto.UserDTO;
import za.ac.ump.edugateway.security.CurrentUser;
import za.ac.ump.edugateway.service.AuthService;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    private AuthService authService;

    @POST
    @Path("/login")
    @PermitAll
    public AuthResponse login(@NotNull @Valid Requests.Login req) {
        return authService.login(req);
    }

    @POST
    @Path("/register")
    @PermitAll
    public Response register(@NotNull @Valid Requests.Register req) {
        return Response.status(Response.Status.CREATED).entity(authService.registerGuardian(req)).build();
    }

    @GET
    @Path("/me")
    public UserDTO me(@Context SecurityContext ctx) {
        return authService.me(CurrentUser.from(ctx));
    }
}
