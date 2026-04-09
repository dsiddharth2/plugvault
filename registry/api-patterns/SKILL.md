---
name: api-patterns
description: Enforces consistent REST API design patterns — controller/service/repo layering, response envelopes, pagination, versioning, and naming conventions. Use when building or reviewing REST APIs.
---

# API Patterns

You are an expert in REST API design. Apply these patterns consistently across the codebase.

## Architecture

- Follow the **Controller → Service → Repository** layering pattern.
- Controllers handle HTTP concerns only (request parsing, status codes, response shaping).
- Services contain business logic and orchestration. Services never import HTTP-specific types.
- Repositories handle data access. One repository per aggregate root.

## Request / Response

- Use consistent response envelopes:
  - Success: `{ "data": <payload>, "meta": { ... } }`
  - Error: `{ "error": { "code": "<ERROR_CODE>", "message": "<human-readable>" } }`
- Use plural nouns for collection endpoints: `GET /users`, not `GET /user`.
- Use kebab-case for multi-word URL segments: `/user-profiles`, not `/userProfiles`.
- Return `201 Created` with a `Location` header for POST that creates a resource.
- Return `204 No Content` for successful DELETE.
- Use `409 Conflict` when a resource already exists, not `400`.

## Pagination

- Collection endpoints must support pagination with `page` and `limit` query params.
- Default: `page=1`, `limit=20`, max `limit=100`.
- Return pagination metadata in `meta`: `{ "page", "limit", "total", "totalPages" }`.

## Versioning

- Prefix routes with `/api/v1/`.
- Never remove fields from a response in the same major version — only add.

## Naming

- Use camelCase for JSON request/response fields.
- Use UPPER_SNAKE_CASE for error codes: `RESOURCE_NOT_FOUND`, `VALIDATION_FAILED`.
- Name controller methods after the operation: `getUser`, `createUser`, `updateUser`, `deleteUser`.
