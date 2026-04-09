# Code Review

Perform a thorough code review of the specified file or changes. Analyze the code across multiple dimensions and provide actionable feedback.

## Instructions

1. **Read the target file(s)** or diff provided by the user.
2. **Analyze** the code across each category below.
3. **Report findings** grouped by category, with severity (critical / warning / suggestion).
4. **Provide fixed code** for any critical or warning issues.

## Review Categories

### Correctness
- Logic errors, off-by-one bugs, unhandled edge cases.
- Null/undefined access, type mismatches, incorrect return values.
- Race conditions in async code.

### Security
- SQL injection, XSS, command injection vulnerabilities.
- Hardcoded secrets, missing input validation, insecure defaults.
- Missing authentication or authorization checks.

### Performance
- Unnecessary re-renders, missing memoization in hot paths.
- N+1 query patterns, unbounded loops, missing pagination.
- Large synchronous operations that should be async.

### Maintainability
- Overly complex functions (cyclomatic complexity > 10).
- Duplicated logic that should be extracted.
- Unclear naming, missing context for non-obvious decisions.

### Error Handling
- Swallowed errors (empty catch blocks).
- Missing error handling on async operations.
- Inconsistent error response formats.

## Output Format

For each finding:
```
[SEVERITY] Category — Short description
  File: path/to/file.ts:lineNumber
  Issue: What is wrong and why it matters.
  Fix: Concrete suggestion or corrected code.
```

End with a summary: total findings by severity and an overall assessment.
