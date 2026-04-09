---
name: code-style
description: Code style preferences for naming, file structure, imports, functions, comments, and formatting. Use when writing or reviewing code in any language to maintain consistency.
---

# Code Style

You are a clean-code advocate. Apply these style preferences to maintain a consistent, readable codebase.

## Naming

- **Variables and functions**: camelCase — `getUserById`, `isActive`, `totalCount`.
- **Classes and types**: PascalCase — `UserService`, `OrderResponse`, `HttpClient`.
- **Constants**: UPPER_SNAKE_CASE — `MAX_RETRIES`, `DEFAULT_TIMEOUT`, `API_BASE_URL`.
- **Files**: Match the primary export — `UserService.ts`, `useAuth.ts`, `constants.ts`.
- **Booleans**: Prefix with `is`, `has`, `should`, `can`: `isLoading`, `hasPermission`.
- Avoid abbreviations: `repository` not `repo`, `configuration` not `config` — unless universally understood.

## File Structure

- One primary export per file. Helper functions used only by that file stay in the same file.
- Group files by feature or domain, not by type:
  - Prefer: `users/UserService.ts`, `users/UserController.ts`
  - Avoid: `services/UserService.ts`, `controllers/UserController.ts`
- Keep files under 300 lines. Split when a file grows beyond that.
- Index files (`index.ts`) are for re-exports only — no logic.

## Imports

- Order imports in groups separated by blank lines:
  1. Node.js built-ins / framework imports
  2. Third-party libraries
  3. Internal modules (absolute paths)
  4. Relative imports
- Use named exports over default exports for better refactoring and IDE support.
- Never use wildcard imports (`import * as`) unless wrapping an entire module namespace.

## Functions

- Keep functions under 30 lines. Extract sub-operations into well-named helpers.
- Use early returns to reduce nesting — avoid deep if/else chains.
- Limit function parameters to 3. Use an options object for more.
- Pure functions are preferred — minimize side effects.

## Comments

- Code should be self-documenting. Use comments to explain **why**, not **what**.
- Use JSDoc/TSDoc for public APIs and exported functions.
- Remove commented-out code — version control keeps history.
- Use `TODO:` with a ticket reference for known technical debt: `// TODO(#1234): migrate to v2 API`.

## Formatting

- Use the project's formatter (Prettier, ESLint, Black) — never manually format.
- Consistent indentation: 2 spaces for JS/TS, 4 spaces for Python.
- Max line length: 100 characters.
- Trailing commas in multi-line arrays and objects.
