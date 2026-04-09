# Refactor

Analyze the specified code and apply targeted refactoring to improve readability, maintainability, and correctness without changing behavior.

## Instructions

1. **Read the target file(s)** provided by the user.
2. **Identify refactoring opportunities** from the checklist below.
3. **Apply refactorings** one at a time, explaining each change.
4. **Verify** that the refactored code preserves the original behavior.

## Refactoring Checklist

### Extract
- Long functions (> 30 lines) → extract into well-named helpers.
- Repeated logic (3+ occurrences) → extract into a shared utility.
- Complex conditionals → extract into descriptively named boolean functions.

### Simplify
- Deep nesting → use early returns and guard clauses.
- Long parameter lists (> 3) → use an options/config object.
- Switch/if chains on type → use polymorphism or a strategy map.

### Rename
- Ambiguous names → rename to reveal intent (`data` → `userProfiles`, `handle` → `handleFormSubmit`).
- Boolean variables → prefix with `is`, `has`, `should`.

### Restructure
- God classes → split by single responsibility.
- Circular dependencies → extract shared interface or invert the dependency.
- Mixed abstraction levels → separate high-level orchestration from low-level details.

### Clean Up
- Remove dead code (unused imports, unreachable branches, commented-out blocks).
- Replace magic numbers/strings with named constants.
- Standardize error handling patterns.

## Output

For each refactoring applied:
- **What**: The specific change made.
- **Why**: The code smell or issue it addresses.
- **Before/After**: Show the relevant code before and after.

End with the complete refactored file.
