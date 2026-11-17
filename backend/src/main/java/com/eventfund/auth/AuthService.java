package com.eventfund.auth;

import com.eventfund.common.ApiException;
import com.eventfund.user.User;
import com.eventfund.user.UserRepository;
import com.eventfund.user.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Validation failed",
                    Map.of("confirmPassword", "Passwords do not match"));
        }

        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmail(email)) {
            throw emailTaken();
        }

        User user = new User();
        user.setFullName(request.fullName().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));

        try {
            return UserResponse.from(userRepository.saveAndFlush(user));
        } catch (DataIntegrityViolationException e) {
            // Two registrations with the same email at the same moment: the database unique key wins.
            throw emailTaken();
        }
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        // Same message for "no such email" and "wrong password", so attackers cannot find out which emails exist.
        User user = userRepository.findByEmail(normalizeEmail(request.email()))
                .filter(u -> passwordEncoder.matches(request.password(), u.getPasswordHash()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        JwtService.IssuedToken token = jwtService.issue(user);
        return new LoginResponse(token.token(), "Bearer", token.expiresAt(), UserResponse.from(user));
    }

    /** Emails are stored in lower case so "A@x.com" and "a@x.com" are the same account. */
    private static String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private static ApiException emailTaken() {
        return new ApiException(HttpStatus.CONFLICT, "Email is already registered",
                Map.of("email", "Email is already registered"));
    }
}
