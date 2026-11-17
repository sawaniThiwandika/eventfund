package com.eventfund.auth;

/**
 * The logged-in user, taken from a valid JWT.
 * Use it in controllers with {@code @AuthenticationPrincipal AuthenticatedUser user}.
 */
public record AuthenticatedUser(Long id, String email) {
}
