# Debug Help

Analyze an error message, stack trace, or unexpected behavior and provide a diagnosis with actionable fixes.

## Instructions

1. **Read the error** provided by the user (error message, stack trace, log output, or description of unexpected behavior).
2. **Identify the error source**: parse the stack trace to find the originating file and line.
3. **Read the relevant source code** around the error location.
4. **Diagnose the root cause** — not just the symptom.
5. **Provide a fix** with the corrected code.
6. **Suggest prevention** — how to avoid this class of error in the future.

## Analysis Framework

### Step 1: Classify the Error
- **Syntax error**: Typo, missing bracket, invalid token.
- **Runtime error**: Null reference, type error, index out of bounds.
- **Logic error**: Code runs but produces wrong results.
- **Environment error**: Missing dependency, wrong version, misconfiguration.
- **Async error**: Unhandled promise, race condition, deadlock.

### Step 2: Trace the Cause
- Read the file and line from the stack trace.
- Check the inputs to the failing function — are they what you expect?
- Check recent changes to the file (`git log -5 <file>`).
- Check if the error is intermittent (suggests race condition or external dependency).

### Step 3: Fix and Verify
- Provide the minimal code change that fixes the issue.
- Explain why the fix works.
- Suggest a test case that would catch this regression.

## Output Format

```
Diagnosis: <one-sentence summary of the root cause>

Source: <file:line>

Root Cause:
<detailed explanation>

Fix:
<corrected code>

Prevention:
<how to avoid this in the future>

Regression Test:
<test case description>
```
