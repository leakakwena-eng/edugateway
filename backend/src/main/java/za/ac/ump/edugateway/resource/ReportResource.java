package za.ac.ump.edugateway.resource;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.SecurityContext;
import za.ac.ump.edugateway.dto.AuditEntryDTO;
import za.ac.ump.edugateway.dto.ReportSummaryDTO;
import za.ac.ump.edugateway.dto.SchoolStatsDTO;
import za.ac.ump.edugateway.security.CurrentUser;
import za.ac.ump.edugateway.service.AuditService;
import za.ac.ump.edugateway.service.ReportService;

import java.util.List;

@Path("/reports")
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed({"SCHOOL_ADMIN", "DISTRICT_ADMIN"})
public class ReportResource {

    @Inject
    private ReportService reports;

    @Inject
    private AuditService audit;

    @Context
    private SecurityContext ctx;

    @GET
    @Path("/summary")
    public ReportSummaryDTO summary(@QueryParam("year") Integer year) {
        return reports.summary(CurrentUser.from(ctx), year);
    }

    @GET
    @Path("/schools")
    @RolesAllowed("DISTRICT_ADMIN")
    public List<SchoolStatsDTO> schools() {
        return reports.schoolStats();
    }

    @GET
    @Path("/audit")
    @RolesAllowed("DISTRICT_ADMIN")
    public List<AuditEntryDTO> audit(@QueryParam("limit") @DefaultValue("100") int limit) {
        return audit.recent(limit);
    }
}
