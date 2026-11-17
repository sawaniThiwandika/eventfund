package com.eventfund.event;

import com.eventfund.common.ApiException;
import com.eventfund.member.EventMember;
import com.eventfund.member.EventMemberRepository;
import com.eventfund.member.MemberRole;
import com.eventfund.security.EventAccessService;
import com.eventfund.user.User;
import com.eventfund.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final EventMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final EventAccessService access;

    /** Creates the event and makes the creator its OWNER. */
    @Transactional
    public EventResponse create(EventRequest request, Long userId) {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "This account no longer exists"));

        Event event = new Event();
        event.setOwner(owner);
        apply(event, request);
        eventRepository.saveAndFlush(event); // flush so createdAt is set for the response

        EventMember member = new EventMember();
        member.setEvent(event);
        member.setUser(owner);
        member.setRole(MemberRole.OWNER);
        memberRepository.save(member);

        return EventResponse.from(event, MemberRole.OWNER);
    }

    /** Events the user owns or has joined, each with the user's role. */
    @Transactional(readOnly = true)
    public List<EventResponse> listMine(Long userId) {
        return memberRepository.findAllWithEventByUserId(userId).stream()
                .map(m -> EventResponse.from(m.getEvent(), m.getRole()))
                .toList();
    }

    @Transactional(readOnly = true)
    public EventResponse get(Long eventId, Long userId) {
        EventMember member = access.requireMember(eventId, userId);
        return EventResponse.from(member.getEvent(), member.getRole());
    }

    @Transactional
    public EventResponse update(Long eventId, EventRequest request, Long userId) {
        EventMember member = access.requireRole(eventId, userId, MemberRole.OWNER);
        Event event = member.getEvent();
        apply(event, request);
        return EventResponse.from(event, member.getRole());
    }

    /** Deletes the event. Members, invitations, income and expenses go with it (ON DELETE CASCADE). */
    @Transactional
    public void delete(Long eventId, Long userId) {
        access.requireRole(eventId, userId, MemberRole.OWNER);
        eventRepository.deleteEventById(eventId);
    }

    private static void apply(Event event, EventRequest request) {
        event.setName(request.name().trim());
        event.setDescription(blankToNull(request.description()));
        event.setEventDate(request.eventDate());
        event.setLocation(blankToNull(request.location()));
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
