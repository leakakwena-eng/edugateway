package za.ac.ump.edugateway.service;

import za.ac.ump.edugateway.exception.ApiException;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Locale;

/** Input parsing that reports bad values as 400 Bad Request. */
final class Parse {

    private Parse() {}

    static LocalDate date(String field, String value) {
        if (value == null || value.isBlank()) return null;
        try {
            return LocalDate.parse(value.trim());
        } catch (DateTimeParseException e) {
            throw ApiException.badRequest(field + " must be a date in yyyy-MM-dd format");
        }
    }

    static <E extends Enum<E>> E enumValue(Class<E> type, String field, String value) {
        try {
            return Enum.valueOf(type, value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException | NullPointerException e) {
            throw ApiException.badRequest("Invalid " + field + ": " + value);
        }
    }

    static String trimToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    static String email(String value) {
        return value.trim().toLowerCase(Locale.ROOT);
    }
}
