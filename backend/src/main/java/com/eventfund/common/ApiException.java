package com.eventfund.common;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.Map;

/**
 * An error that should be returned to the client with a given HTTP status.
 * Optional field errors point at the request fields that caused it.
 */
@Getter
public class ApiException extends RuntimeException {

    private final HttpStatus status;
    private final Map<String, String> fieldErrors;

    public ApiException(HttpStatus status, String message) {
        this(status, message, Map.of());
    }

    public ApiException(HttpStatus status, String message, Map<String, String> fieldErrors) {
        super(message);
        this.status = status;
        this.fieldErrors = fieldErrors;
    }
}
