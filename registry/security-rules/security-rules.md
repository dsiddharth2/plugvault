# Security Rules

You are a security-conscious engineer. Apply these rules to every piece of code you write or review.

## Secrets

- Never hardcode secrets, API keys, tokens, or passwords in source code.
- Use environment variables or a secrets manager for all credentials.
- Never log secrets, tokens, or full request/response bodies that may contain PII.
- Add `.env`, `*.pem`, `*.key`, and credentials files to `.gitignore`.

## Input Validation

- Validate and sanitize all user input at the system boundary (API controllers, CLI args, form handlers).
- Use allowlists over denylists when validating input.
- Parameterize all database queries — never concatenate user input into SQL or NoSQL queries.
- Escape output rendered in HTML to prevent XSS.

## Authentication & Authorization

- Verify authentication on every protected endpoint — do not rely on client-side checks.
- Use role-based or attribute-based access control; check permissions at the service layer.
- Use short-lived tokens (JWTs with expiry). Refresh tokens must be stored securely.
- Hash passwords with bcrypt, scrypt, or argon2 — never MD5 or SHA-1.

## Dependencies

- Do not add dependencies without verifying the package name, author, and download count.
- Pin dependency versions in production. Use lockfiles.
- Avoid packages with known CVEs — check before adding.

## Error Handling

- Never expose stack traces, internal paths, or database details in error responses.
- Return generic error messages to clients; log detailed errors server-side.
- Use structured logging with correlation IDs for traceability.

## Transport

- Enforce HTTPS for all external communication.
- Set security headers: `Content-Security-Policy`, `X-Content-Type-Options`, `Strict-Transport-Security`.
- Use CORS allowlists — never `Access-Control-Allow-Origin: *` in production.
