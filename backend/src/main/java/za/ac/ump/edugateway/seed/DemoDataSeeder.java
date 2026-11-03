package za.ac.ump.edugateway.seed;

import jakarta.annotation.PostConstruct;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.mindrot.jbcrypt.BCrypt;
import za.ac.ump.edugateway.config.AppSettings;
import za.ac.ump.edugateway.entity.*;
import za.ac.ump.edugateway.enums.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

/**
 * Loads demo schools, accounts and applications on startup so the app can be tried out
 * straight away. Every record is matched by a natural key (EMIS number, email, name) first,
 * so running it against an existing database only adds what is missing.
 * Disable with EDUGATEWAY_SEED_DEMO=false.
 */
@Singleton
@Startup
public class DemoDataSeeder {

    private static final Logger LOG = Logger.getLogger(DemoDataSeeder.class.getName());

    public static final String DEMO_PASSWORD = "demo123";

    private static final String BIRTH_CERT = "Birth Certificate";
    private static final String RESIDENCE = "Proof of Residence";
    private static final String IMMUNISATION = "Immunisation Record";
    private static final String TRANSFER_LETTER = "Transfer Letter";
    private static final String REPORT_CARD = "Report Card";

    @PersistenceContext(unitName = "EduGatewayPU")
    private EntityManager em;

    private final Map<String, School> schools = new HashMap<>();
    private final Map<String, StaffUser> admins = new HashMap<>();
    private String passwordHash;

    @PostConstruct
    void seed() {
        if (!AppSettings.seedDemoData()) {
            LOG.info("Demo data seeding disabled");
            return;
        }
        passwordHash = BCrypt.hashpw(DEMO_PASSWORD, BCrypt.gensalt(10));

        school("kwena", "Kwena Primary School", "PRIMARY", "123456", "Mr. Sithole", "sithole@kwena.edu");
        school("mpuma", "Mpumalanga Academy", "HIGH", "234567", "Mrs. Dlamini", "dlamini@mpuma.edu");
        school("lydenburg", "Lydenburg High School", "HIGH", "345678", "Mr. Nkosi", "nkosi@lydenburg.edu");
        school("thuto", "Thuto Chweu Primary", "PRIMARY", "456789", "Mrs. Van Wyk", "vanwyk@thuto.edu");
        school("mphahlele", "Mphahlele High School", "HIGH", "567890", "Mr. Zulu", "zulu@mphahlele.edu");
        school("emalahleni", "Emalahleni Primary", "PRIMARY", "678901", "Ms. Khumalo", "khumalo@emalahleni.edu");
        staff("Dr. Nomvete", "nomvete@edugateway.edu", Role.DISTRICT_ADMIN, null);

        int year = LocalDate.now().getYear() + 1;
        Intake kwenaGr1 = intake("kwena", "Grade 1", year, 60, BIRTH_CERT, RESIDENCE, IMMUNISATION);
        Intake mpumaGr9 = intake("mpuma", "Grade 9", year, 90, BIRTH_CERT, RESIDENCE, TRANSFER_LETTER, REPORT_CARD);
        Intake thutoGr6 = intake("thuto", "Grade 6", year, 40, BIRTH_CERT, RESIDENCE, REPORT_CARD);
        intake("lydenburg", "Grade 8", year, 120, BIRTH_CERT, RESIDENCE, REPORT_CARD);
        intake("mphahlele", "Grade 8", year, 100, BIRTH_CERT, RESIDENCE, REPORT_CARD);
        intake("emalahleni", "Grade R", year, 50, BIRTH_CERT, RESIDENCE, IMMUNISATION);

        Guardian thandi = guardian("Thandi Mokoena", "thandi.mokoena@example.com", "+27 82 123 4567");

        Learner lindiwe = learner(thandi, "Lindiwe Mokoena", LocalDate.of(year - 7, 3, 14), "Female");
        if (lindiwe != null) seedEnrolledApplication(lindiwe, kwenaGr1);

        Learner karabo = learner(thandi, "Karabo Mokoena", LocalDate.of(year - 15, 11, 12), "Male");
        if (karabo != null) {
            karabo.setCurrentSchool(schools.get("lydenburg"));
            karabo.setCurrentGrade("Grade 8");
            seedAcceptedTransfer(karabo, mpumaGr9);
        }

        Learner thabo = learner(thandi, "Thabo Mokoena", LocalDate.of(year - 12, 8, 20), "Male");
        if (thabo != null) seedSubmittedApplication(thabo, thutoGr6);

        LOG.info("Demo data ready (password for all demo accounts: " + DEMO_PASSWORD + ")");
    }

    // ---- reference data ------------------------------------------------------------------

    private void school(String key, String name, String type, String emis, String adminName, String adminEmail) {
        School s = em.createQuery("SELECT s FROM School s WHERE s.emisNo = :emis", School.class)
                .setParameter("emis", emis)
                .getResultStream().findFirst().orElse(null);
        if (s == null) {
            s = new School();
            s.setName(name);
            s.setType(type);
            s.setEmisNo(emis);
            em.persist(s);
        }
        schools.put(key, s);
        admins.put(key, staff(adminName, adminEmail, Role.SCHOOL_ADMIN, s));
    }

    private StaffUser staff(String name, String email, Role role, School school) {
        StaffUser u = em.createQuery("SELECT u FROM StaffUser u WHERE u.email = :email", StaffUser.class)
                .setParameter("email", email)
                .getResultStream().findFirst().orElse(null);
        if (u == null) {
            u = new StaffUser();
            u.setName(name);
            u.setEmail(email);
            u.setPasswordHash(passwordHash);
            u.setRole(role);
            u.setSchool(school);
            em.persist(u);
        }
        return u;
    }

    private Intake intake(String schoolKey, String grade, int year, int capacity, String... docs) {
        School school = schools.get(schoolKey);
        Intake i = em.createQuery("SELECT i FROM Intake i WHERE i.school = :s AND i.grade = :g AND i.year = :y",
                        Intake.class)
                .setParameter("s", school).setParameter("g", grade).setParameter("y", year)
                .getResultStream().findFirst().orElse(null);
        if (i == null) {
            i = new Intake();
            i.setSchool(school);
            i.setGrade(grade);
            i.setYear(year);
            i.setOpenDate(LocalDate.now().minusDays(30));
            i.setCloseDate(LocalDate.now().plusDays(120));
            i.setCapacity(capacity);
            i.setRequiredDocuments(new ArrayList<>(List.of(docs)));
            em.persist(i);
        } else if (i.getRequiredDocuments().isEmpty()) {
            i.setRequiredDocuments(new ArrayList<>(List.of(docs)));
        }
        return i;
    }

    private Guardian guardian(String name, String email, String phone) {
        Guardian g = em.createQuery("SELECT g FROM Guardian g WHERE g.email = :email", Guardian.class)
                .setParameter("email", email)
                .getResultStream().findFirst().orElse(null);
        if (g == null) {
            g = new Guardian();
            g.setName(name);
            g.setEmail(email);
            g.setPhone(phone);
            g.setPasswordHash(passwordHash);
            em.persist(g);
        } else if (!g.getPasswordHash().startsWith("$2")) {
            // Existing demo account without a usable BCrypt hash: give it the demo password.
            g.setPasswordHash(passwordHash);
        }
        return g;
    }

    /** Returns the new learner, or null if they already exist (so their history isn't seeded twice). */
    private Learner learner(Guardian guardian, String name, LocalDate dob, String gender) {
        boolean exists = em.createQuery(
                        "SELECT COUNT(l) FROM Learner l WHERE l.guardian = :g AND l.name = :n", Long.class)
                .setParameter("g", guardian).setParameter("n", name)
                .getSingleResult() > 0;
        if (exists) return null;
        Learner l = new Learner();
        l.setGuardian(guardian);
        l.setName(name);
        l.setDateOfBirth(dob);
        l.setGender(gender);
        em.persist(l);
        return l;
    }

    // ---- sample applications -------------------------------------------------------------

    private void seedEnrolledApplication(Learner learner, Intake intake) {
        Application a = application(learner, intake, ApplicationType.NEW, ApplicationStatus.ENROLLED, 21);
        a.setDecidedAt(LocalDateTime.now().minusDays(18));
        for (String doc : intake.getRequiredDocuments()) {
            document(a, doc, DocumentStatus.VERIFIED, 21);
        }
        learner.setCurrentSchool(intake.getSchool());
        learner.setCurrentGrade(intake.getGrade());

        StaffUser admin = admins.get("kwena");
        audit(guardianActor(learner), a, "APPLICATION_SUBMITTED", intake.getSchool().getName(), 21);
        audit(admin, a, "DOCUMENT_VERIFIED", BIRTH_CERT, 19);
        audit(admin, a, "DECISION_ACCEPTED", null, 18);
        audit(admin, a, "LEARNER_ENROLLED", intake.getSchool().getName() + ", " + intake.getGrade(), 18);
        notify(RecipientType.GUARDIAN, learner.getGuardian().getId(), "Enrolment confirmed",
                learner.getName() + " is now enrolled at " + intake.getSchool().getName() + ".", a, 18, true);
    }

    private void seedAcceptedTransfer(Learner learner, Intake intake) {
        School sending = learner.getCurrentSchool();
        Application a = application(learner, intake, ApplicationType.TRANSFER, ApplicationStatus.ACCEPTED, 10);
        a.setDecidedAt(LocalDateTime.now().minusDays(6));
        document(a, BIRTH_CERT, DocumentStatus.VERIFIED, 10);
        document(a, RESIDENCE, DocumentStatus.VERIFIED, 10);
        document(a, TRANSFER_LETTER, DocumentStatus.PENDING, 9);

        TransferRecord t = new TransferRecord();
        t.setApplication(a);
        t.setSendingSchool(sending);
        t.setReleaseStatus(TransferReleaseStatus.PENDING);
        em.persist(t);

        StaffUser admin = admins.get("mpuma");
        audit(guardianActor(learner), a, "TRANSFER_REQUESTED", sending.getName() + " → " + intake.getSchool().getName(), 10);
        audit(admin, a, "DECISION_ACCEPTED", null, 6);
        notify(RecipientType.GUARDIAN, learner.getGuardian().getId(), "Application accepted",
                learner.getName() + " has been offered a place at " + intake.getSchool().getName() + ".", a, 6, false);
        notify(RecipientType.SCHOOL, sending.getId(), "Records release needed",
                intake.getSchool().getName() + " accepted " + learner.getName()
                        + "'s transfer. Please release their academic records.", a, 6, false);
    }

    private void seedSubmittedApplication(Learner learner, Intake intake) {
        Application a = application(learner, intake, ApplicationType.NEW, ApplicationStatus.SUBMITTED, 2);
        document(a, BIRTH_CERT, DocumentStatus.PENDING, 2);
        audit(guardianActor(learner), a, "APPLICATION_SUBMITTED", intake.getSchool().getName(), 2);
        notify(RecipientType.SCHOOL, intake.getSchool().getId(), "New application",
                learner.getName() + " applied for " + intake.getGrade() + " " + intake.getYear() + ".", a, 2, false);
        notify(RecipientType.DISTRICT, null, "New school onboarded",
                "Emalahleni Primary joined the EduGateway network.", null, 3, false);
    }

    private Application application(Learner learner, Intake intake, ApplicationType type,
                                    ApplicationStatus status, int daysAgo) {
        Application a = new Application();
        a.setLearner(learner);
        a.setIntake(intake);
        a.setType(type);
        a.setStatus(status);
        a.setSubmittedAt(LocalDateTime.now().minusDays(daysAgo));
        em.persist(a);
        em.flush();
        return a;
    }

    private void document(Application a, String type, DocumentStatus status, int daysAgo) {
        Document d = new Document();
        d.setApplication(a);
        d.setType(type);
        d.setStatus(status);
        d.setContentType("application/pdf");
        d.setOriginalFileName(type.toLowerCase().replace(' ', '-') + ".pdf");
        d.setUploadedAt(LocalDateTime.now().minusDays(daysAgo));
        d.setFilePath(writePlaceholderPdf(a, type));
        d.setSizeBytes(placeholderPdf(type).length + 0L);
        em.persist(d);
        a.getDocuments().add(d);
    }

    private void audit(Object actor, Application a, String action, String details, int daysAgo) {
        AuditEvent e = new AuditEvent();
        if (actor instanceof StaffUser s) {
            e.setActorId(s.getId());
            e.setActorName(s.getName() + (s.getRole() == Role.DISTRICT_ADMIN ? " (District Admin)" : " (School Admin)"));
            e.setActorRole(s.getRole());
        } else if (actor instanceof Guardian g) {
            e.setActorId(g.getId());
            e.setActorName(g.getName() + " (Guardian)");
            e.setActorRole(Role.GUARDIAN);
        }
        e.setEntityRef(a.getReference());
        e.setAction(action);
        e.setDetails(details);
        e.setTimestamp(LocalDateTime.now().minusDays(daysAgo));
        em.persist(e);
    }

    private void notify(RecipientType type, Long recipientId, String title, String body,
                        Application a, int daysAgo, boolean read) {
        Notification n = new Notification();
        n.setRecipientType(type);
        n.setRecipientId(recipientId);
        n.setTitle(title);
        n.setBody(body);
        n.setApplicationId(a != null ? a.getId() : null);
        n.setCreatedAt(LocalDateTime.now().minusDays(daysAgo));
        n.setRead(read);
        em.persist(n);
    }

    private Guardian guardianActor(Learner learner) {
        return learner.getGuardian();
    }

    // ---- placeholder files so demo documents can be opened ---------------------------------

    private String writePlaceholderPdf(Application a, String type) {
        String relative = "application-" + a.getId() + "/demo-" + type.toLowerCase().replace(' ', '-') + ".pdf";
        Path target = AppSettings.uploadDir().resolve(relative);
        try {
            Files.createDirectories(target.getParent());
            Files.write(target, placeholderPdf(type));
        } catch (IOException e) {
            LOG.warning("Could not write demo file " + target + ": " + e.getMessage());
        }
        return relative;
    }

    /** A minimal one-page PDF showing the document type. */
    private static byte[] placeholderPdf(String title) {
        String text = "EduGateway demo document: " + title.replace("(", "").replace(")", "");
        String stream = "BT /F1 18 Tf 72 720 Td (" + text + ") Tj ET";
        String[] objects = {
                "<< /Type /Catalog /Pages 2 0 R >>",
                "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
                "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R "
                        + "/Resources << /Font << /F1 5 0 R >> >> >>",
                "<< /Length " + stream.length() + " >>\nstream\n" + stream + "\nendstream",
                "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
        };
        StringBuilder pdf = new StringBuilder("%PDF-1.4\n");
        List<Integer> offsets = new ArrayList<>();
        for (int i = 0; i < objects.length; i++) {
            offsets.add(pdf.length());
            pdf.append(i + 1).append(" 0 obj\n").append(objects[i]).append("\nendobj\n");
        }
        int xref = pdf.length();
        pdf.append("xref\n0 ").append(objects.length + 1).append("\n0000000000 65535 f \n");
        for (int offset : offsets) {
            pdf.append(String.format("%010d 00000 n \n", offset));
        }
        pdf.append("trailer\n<< /Size ").append(objects.length + 1).append(" /Root 1 0 R >>\n")
                .append("startxref\n").append(xref).append("\n%%EOF\n");
        return pdf.toString().getBytes(StandardCharsets.US_ASCII);
    }
}
