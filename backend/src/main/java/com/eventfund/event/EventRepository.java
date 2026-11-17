package com.eventfund.event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventRepository extends JpaRepository<Event, Long> {

    /**
     * Deletes the event with a direct SQL delete. The database removes its members, invitations,
     * income and expenses (ON DELETE CASCADE). A direct delete is used because loaded EventMember
     * rows still point to the event, which makes a normal JPA delete fail.
     */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("delete from Event e where e.id = :id")
    int deleteEventById(@Param("id") Long id);
}
