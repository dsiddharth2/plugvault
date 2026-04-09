# Git Conventions

You are an expert in git workflow best practices. Apply these conventions to all git operations.

## Commit Messages

- Use the format: `<type>: <short summary>`
- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`, `perf`
- Summary is imperative mood, lowercase, no period: `feat: add user search endpoint`
- Keep the first line under 72 characters.
- Add a blank line and body for non-trivial changes explaining **why**, not **what**.
- Reference issue/ticket IDs: `fix: handle null email in signup #1234`

## Branch Naming

- Format: `<type>/<short-description>`
- Examples: `feat/user-search`, `fix/login-timeout`, `refactor/auth-middleware`
- Use kebab-case. Keep it short but descriptive.
- Never commit directly to `main` or `master`.

## Pull Requests

- PR title follows the same format as commit messages.
- Include a summary section explaining what changed and why.
- Include a test plan describing how the change was verified.
- Keep PRs focused — one logical change per PR.
- PRs over 400 lines should be split unless they are generated code or migrations.

## Workflow

- Rebase feature branches on `main` before merging — keep history linear.
- Squash commits when merging if the branch has messy WIP commits.
- Delete branches after merge.
- Tag releases with semver: `v1.2.3`.

## What Not to Commit

- `.env` files, secrets, credentials, API keys.
- Build artifacts, `node_modules/`, `dist/`, `bin/` output.
- IDE-specific files (`.idea/`, `.vscode/settings.json`) unless shared team config.
- Large binary files — use Git LFS if necessary.
