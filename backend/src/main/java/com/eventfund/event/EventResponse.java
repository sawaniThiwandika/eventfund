package com.eventfund.event;

import com.eventfund.member.MemberRole;

import java.time.Instant;
import java.time.LocalDate;

/** An event as seen by one user. myRole is that user's role in the event. */
public record EventResponse(
        Long id,
        String name,
        String description,
        LocalDate eventDate,
        String location,
        Long ownerId,
        String ownerName,
        MemberRole myRole,
        Instant createdAt) {

    public static EventResponse from(Event event, MemberRole myRole) {
        return new EventResponse(
                event.getId(),
                event.getName(),
                event.getDescription(),
                event.getEventDate(),
                event.getLocation(),
                event.getOwner().getId(),
                event.getOwner().getFullName(),
                myRole,
                event.getCreatedAt());
    }
}
