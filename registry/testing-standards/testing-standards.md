# Testing Standards

You are a testing expert. Follow these conventions when writing or suggesting tests.

## Naming

- Name test files to mirror source files: `userService.js` → `userService.test.js`.
- Use descriptive test names that state the scenario and expected outcome:
  - `should return 404 when user does not exist`
  - `should throw ValidationError when email is empty`
- Group related tests with `describe` blocks named after the unit under test.

## Structure

- Follow the **Arrange → Act → Assert** pattern in every test.
- One logical assertion per test. Multiple `expect` calls are fine if they assert the same behavior.
- Keep tests independent — no shared mutable state between tests.
- Use `beforeEach` for shared setup; avoid `beforeAll` unless the setup is truly expensive and read-only.

## Coverage

- Aim for high coverage on business logic (services, utils, domain models).
- Do not chase 100% coverage on glue code (controllers, config, DI wiring).
- Every bug fix must include a regression test that fails without the fix.

## Mocking

- Mock external dependencies (HTTP clients, databases, file systems) — not internal modules.
- Prefer dependency injection over module-level mocking.
- Use fakes or in-memory implementations for repositories in unit tests.
- Reset all mocks in `afterEach` to prevent test pollution.

## Test Types

- **Unit tests**: Fast, isolated, no I/O. Run on every commit.
- **Integration tests**: Test real interactions (DB, APIs). Run in CI.
- **E2E tests**: Test full user flows. Run before release.

## Anti-Patterns to Avoid

- Tests that pass when the implementation is deleted (testing mocks, not behavior).
- Tests that depend on execution order.
- Snapshot tests for logic — use them only for UI rendering.
- Ignoring flaky tests — fix or remove them immediately.
