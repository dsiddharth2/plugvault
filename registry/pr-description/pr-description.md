# PR Description

Generate a well-structured pull request description from the current branch's changes.

## Instructions

1. Run `git diff main...HEAD` (or the appropriate base branch) to see all changes.
2. Run `git log main..HEAD --oneline` to see commit history on this branch.
3. Analyze the changes: what was added, modified, removed, and why.
4. Generate the PR description in the format below.

## Output Format

```markdown
## Summary
<!-- 1-3 bullet points describing what this PR does and why -->

- ...

## Changes
<!-- Grouped list of what was changed -->

### Added
- ...

### Changed
- ...

### Removed
- ...

## How to Test
<!-- Step-by-step instructions for reviewers to verify the changes -->

1. ...

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated (if applicable)
- [ ] No breaking changes (or migration guide provided)
- [ ] Reviewed for security implications
```

## Rules

- Keep the summary focused on **why**, not a file-by-file changelog.
- Group related changes together rather than listing every file.
- The test plan should be specific enough that a reviewer can follow it.
- If there are breaking changes, call them out prominently.
