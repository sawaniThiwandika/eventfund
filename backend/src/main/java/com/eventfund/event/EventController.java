package com.eventfund.event;

import com.eventfund.auth.AuthenticatedUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Event endpoints. Access rules are checked by EventAccessService (through EventService). */
@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EventResponse create(@Valid @RequestBody EventRequest request,
                                @AuthenticationPrincipal AuthenticatedUser user) {
        return eventService.create(request, user.id());
    }

    @GetMapping
    public List<EventResponse> listMine(@AuthenticationPrincipal AuthenticatedUser user) {
        return eventService.listMine(user.id());
    }

    @GetMapping("/{id}")
    public EventResponse get(@PathVariable Long id, @AuthenticationPrincipal AuthenticatedUser user) {
        return eventService.get(id, user.id());
    }

    @PutMapping("/{id}")
    public EventResponse update(@PathVariable Long id, @Valid @RequestBody EventRequest request,
                                @AuthenticationPrincipal AuthenticatedUser user) {
        return eventService.update(id, request, user.id());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, @AuthenticationPrincipal AuthenticatedUser user) {
        eventService.delete(id, user.id());
    }
}
