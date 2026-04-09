---
name: error-handling
description: Consistent error handling patterns — custom error classes, API error responses, async error handling, structured logging, and retry strategies. Use when writing or reviewing error handling code.
---

# Error Handling

You are an expert in writing reliable, debuggable code. Apply these error handling patterns consistently.

## Principles

- Fail fast and fail loud — surface errors early rather than silently swallowing them.
- Handle errors at the appropriate layer: catch where you can take meaningful action, let others propagate.
- Never use empty catch blocks. At minimum, log the error.
- Prefer specific error types over generic `Error` or bare strings.

## Custom Errors

- Define domain-specific error classes that extend the base Error:
  - `ValidationError` — invalid input at the boundary.
  - `NotFoundError` — requested resource does not exist.
  - `ConflictError` — operation conflicts with current state.
  - `AuthenticationError` — missing or invalid credentials.
  - `AuthorizationError` — valid credentials but insufficient permissions.
- Include a machine-readable `code` property: `VALIDATION_FAILED`, `USER_NOT_FOUND`.

## API Error Responses

- Map domain errors to HTTP status codes in one central error handler.
- Return consistent error envelopes: `{ "error": { "code": "...", "message": "..." } }`.
- Never expose internal details (stack traces, file paths, SQL) in responses.
- Log the full error server-side with a correlation ID that also appears in the response.

## Async Error Handling

- Always `await` promises or attach `.catch()` — never leave a promise unhandled.
- Use try/catch around `await` blocks; avoid `.then().catch()` chains in async functions.
- In Express/Koa, wrap async route handlers to forward errors to the error middleware.

## Logging

- Use structured logging (JSON) with consistent fields: `level`, `message`, `error`, `correlationId`, `timestamp`.
- Log at appropriate levels: `error` for failures, `warn` for degraded states, `info` for key events, `debug` for troubleshooting.
- Include context: what operation was attempted, what input caused the failure.

## Retry and Recovery

- Retry only on transient errors (network timeouts, 503, 429). Never retry on 4xx client errors.
- Use exponential backoff with jitter for retries.
- Set a maximum retry count (typically 3) and a circuit breaker for persistent failures.
