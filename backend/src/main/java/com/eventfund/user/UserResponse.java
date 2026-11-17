package com.eventfund.user;

/** Public view of a user. Never includes the password hash. */
public record UserResponse(Long id, String fullName, String email) {

    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getFullName(), user.getEmail());
    }
}
