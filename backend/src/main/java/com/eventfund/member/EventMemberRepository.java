package com.eventfund.member;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventMemberRepository extends JpaRepository<EventMember, Long> {

    Optional<EventMember> findByEventIdAndUserId(Long eventId, Long userId);
}
