package com.eventfund.event;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/** Body for creating or updating an event. */
public record EventRequest(
        @NotBlank(message = "Event name is required")
        @Size(max = 200, message = "Event name must be at most 200 characters")
        String name,

        @Size(max = 2000, message = "Description must be at most 2000 characters")
        String description,

        @NotNull(message = "Event date is required")
        LocalDate eventDate,

        @Size(max = 255, message = "Location must be at most 255 characters")
        String location) {
}
