package com.eventfund.common;

import java.time.Instant;
import java.util.Map;

/** JSON body for every error response. */
public record ErrorResponse(
        Instant timestamp,
        int status,
        String error,
        String message,
        Map<String, String> fieldErrors) {
}
