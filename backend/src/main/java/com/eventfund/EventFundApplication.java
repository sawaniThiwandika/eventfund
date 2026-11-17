package com.eventfund;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

// Users log in with JWT, so Spring's default in-memory user (and its generated password) is not needed.
@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
public class EventFundApplication {

    public static void main(String[] args) {
        SpringApplication.run(EventFundApplication.class, args);
    }
}
