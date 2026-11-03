package za.ac.ump.edugateway.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "learner")
public class Learner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "learner_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "guardian_id", nullable = false)
    private Guardian guardian;

    @Column(nullable = false)
    private String name;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "id_number")
    private String idNumber;

    private String gender;

    /** School the learner is currently enrolled at; set when an application reaches ENROLLED. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_school_id")
    private School currentSchool;

    @Column(name = "current_grade")
    private String currentGrade;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Guardian getGuardian() { return guardian; }
    public void setGuardian(Guardian guardian) { this.guardian = guardian; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getIdNumber() { return idNumber; }
    public void setIdNumber(String idNumber) { this.idNumber = idNumber; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public School getCurrentSchool() { return currentSchool; }
    public void setCurrentSchool(School currentSchool) { this.currentSchool = currentSchool; }
    public String getCurrentGrade() { return currentGrade; }
    public void setCurrentGrade(String currentGrade) { this.currentGrade = currentGrade; }
}
