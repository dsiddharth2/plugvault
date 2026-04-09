---
name: gen-tests
description: Generate comprehensive tests for a file or function. Detects the testing framework, creates happy path, edge case, and error tests. Use when you need test coverage for a module.
argument-hint: <file-path> [--type <unit|integration>]
allowed-tools: Read, Grep, Glob, Write, Bash
---

Generate comprehensive tests for the specified file or function.

## Instructions

1. **Read the target file** to understand its exports, dependencies, and behavior.
2. **Identify the testing framework** already in use (Jest, Mocha, Vitest, pytest, xUnit, etc.). If none exists, default to the most common for the language.
3. **Generate test cases** covering:
   - Happy path for each public function/method.
   - Edge cases: empty input, null/undefined, boundary values.
   - Error cases: invalid input, thrown exceptions, rejected promises.
   - Integration points: verify correct calls to dependencies (mocked).
4. **Write the test file** following project conventions.

## Test Structure

- Mirror the source file path: `src/services/UserService.ts` → `tests/services/UserService.test.ts`.
- Use `describe` blocks per function/method.
- Use clear test names: `should return user when id is valid`.
- Follow Arrange → Act → Assert pattern.

## Mocking Rules

- Mock external dependencies (HTTP clients, databases, file system).
- Do not mock the unit under test.
- Use dependency injection where available.
- Reset mocks between tests.

## Output

- Write the complete test file.
- List the test cases generated with a brief description of each.
- Note any untestable code and suggest refactoring to improve testability.
