package com.eventfund.member;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EventMemberRepository extends JpaRepository<EventMember, Long> {

    Optional<EventMember> findByEventIdAndUserId(Long eventId, Long userId);

    /** The user's membership in one event, with the event and its owner loaded. */
    @Query("""
            select m from EventMember m
            join fetch m.event e
            join fetch e.owner
            where e.id = :eventId and m.user.id = :userId
            """)
    Optional<EventMember> findWithEvent(@Param("eventId") Long eventId, @Param("userId") Long userId);

    /** All events the user owns or has joined, with the event and its owner loaded. Soonest date first. */
    @Query("""
            select m from EventMember m
            join fetch m.event e
            join fetch e.owner
            where m.user.id = :userId
            order by e.eventDate asc, e.id asc
            """)
    List<EventMember> findAllWithEventByUserId(@Param("userId") Long userId);
}
