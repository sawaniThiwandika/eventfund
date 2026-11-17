package com.eventfund.security;

import com.eventfund.common.ApiException;
import com.eventfund.member.EventMember;
import com.eventfund.member.EventMemberRepository;
import com.eventfund.member.MemberRole;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

/**
 * The one place that decides who may access an event.
 * Every event endpoint must go through this service.
 *
 * Non-members get 404 (not 403), so they cannot even find out that the event exists.
 * Members without the needed role get 403.
 */
@Service
@RequiredArgsConstructor
public class EventAccessService {

    private final EventMemberRepository memberRepository;

    /** Returns the user's membership (with the event loaded), or 404 if the user is not a member. */
    @Transactional(readOnly = true)
    public EventMember requireMember(Long eventId, Long userId) {
        return memberRepository.findWithEvent(eventId, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found"));
    }

    /** Like requireMember, but the user must also have one of the given roles (403 otherwise). */
    @Transactional(readOnly = true)
    public EventMember requireRole(Long eventId, Long userId, MemberRole... allowedRoles) {
        EventMember member = requireMember(eventId, userId);
        if (!Arrays.asList(allowedRoles).contains(member.getRole())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You do not have permission to do this");
        }
        return member;
    }
}
