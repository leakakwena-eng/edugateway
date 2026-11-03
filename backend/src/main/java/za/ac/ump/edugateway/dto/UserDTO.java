package za.ac.ump.edugateway.dto;

/** The signed-in user, whichever account type they are. */
public record UserDTO(
        Long id,
        String name,
        String email,
        String phone,
        String role,
        Long schoolId,
        String schoolName) {
}
