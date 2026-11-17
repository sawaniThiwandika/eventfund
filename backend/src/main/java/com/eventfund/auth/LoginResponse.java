package com.eventfund.auth;

import com.eventfund.user.UserResponse;

import java.time.Instant;

/** Returned after a successful login. Send the token as "Authorization: Bearer <token>". */
public record LoginResponse(String token, String tokenType, Instant expiresAt, UserResponse user) {
}
