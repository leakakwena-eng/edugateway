package za.ac.ump.edugateway.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "intake")
public class Intake {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "intake_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @Column(nullable = false)
    private String grade;

    @Column(name = "intake_year", nullable = false)
    private int year;

    @Column(name = "open_date")
    private LocalDate openDate;

    @Column(name = "close_date")
    private LocalDate closeDate;

    @Column(nullable = false)
    private int capacity;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "intake_required_document", joinColumns = @JoinColumn(name = "intake_id"))
    @Column(name = "document_type", nullable = false)
    @OrderColumn(name = "position")
    private List<String> requiredDocuments = new ArrayList<>();

    /** Applications are accepted on dates between open and close (inclusive); missing bounds are unrestricted. */
    public boolean isOpenOn(LocalDate date) {
        return (openDate == null || !date.isBefore(openDate))
                && (closeDate == null || !date.isAfter(closeDate));
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public School getSchool() { return school; }
    public void setSchool(School school) { this.school = school; }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }
    public LocalDate getOpenDate() { return openDate; }
    public void setOpenDate(LocalDate openDate) { this.openDate = openDate; }
    public LocalDate getCloseDate() { return closeDate; }
    public void setCloseDate(LocalDate closeDate) { this.closeDate = closeDate; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public List<String> getRequiredDocuments() { return requiredDocuments; }
    public void setRequiredDocuments(List<String> requiredDocuments) { this.requiredDocuments = requiredDocuments; }
}
