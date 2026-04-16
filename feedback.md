# Community Vault Indexing — Code Review

**Reviewer:** plug-reviewer
**Date:** 2026-04-16
**Verdict:** CHANGES NEEDED

---

## community-vaults.json

**PASS.** Correct JSON array with 3 vault entries. All URLs point to `https://github.com/dsiddharth2/...`, all branches set to `"main"`. Format is clean and consistent.

No issues found.

---

## scripts/build-community-index.js

**Mostly PASS — 2 issues to fix, 2 minor observations.**

### Issues (must fix)

1. **Hardcoded owner in API URLs (lines 153-154).** `rawBase` and `apiTreeUrl` hardcode `dsiddharth2` instead of parsing the owner/repo from `vault.url`. If a community vault from a different GitHub user is added to `community-vaults.json`, the script will silently fetch the wrong repo (or 404). Fix: parse owner and repo from `vault.url`.

2. **`VAULT_NAMES` is hardcoded (lines 84-85).** The dependency inference regex is built from a static list of vault names rather than reading from `community-vaults.json`. Adding a new vault to the JSON file won't update inference. Fix: derive `VAULT_NAMES` from the vaults array at runtime (requires restructuring so it's available before `processVault` is called, or pass it in).

### Observations (non-blocking)

- **Frontmatter parser (line 60-77):** Only handles inline YAML lists `[a, b, c]`, not multi-line `- item` syntax. Acceptable for the documented "minimal" scope, but will silently drop multi-line tags/arrays. Worth a code comment noting this limitation.

- **Frontmatter slice offset (line 57):** `text.slice(4, end)` assumes `---\n` is exactly 4 bytes. Correct for LF line endings (which GitHub raw content uses), but would misbehave on CRLF input. Since this runs on GitHub Actions (Linux) and fetches from GitHub raw URLs, this is fine in practice.

### What passed review

- Zero npm dependencies — only `https`, `fs`, `path` builtins. Confirmed.
- Entry-point detection covers all 3 structures: `SKILL.md` anywhere, `agents/*.md` direct children, `commands/*.md` direct children. Regex patterns are correct and anchored.
- GitHub Tree API used with `?recursive=1` — single call per vault. Raw content fetched only for entry points. Efficient.
- `plug-deps.json` fetched per vault with graceful 404 handling (`fetchJSON` returns `null` on 404, defaulted to `{}`).
- Frontmatter `---` delimiters parsed correctly for the supported subset.
- Entries with no `description` are skipped.
- `files` array built correctly from `dirMap`.
- Dependency two-pass: Pass A curated (`source: "curated"`), Pass B inferred (`source: "inferred"`) with deduplication via `curatedNames` set.
- Output schema complete: `name`, `type`, `vault`, `vaultUrl`, `entry`, `directory`, `files`, `rawBaseUrl`, `description`, `version`, `tags`, `dependencies`. Top-level `updatedAt` timestamp present.
- `Authorization: Bearer ${process.env.GITHUB_TOKEN}` used correctly — no secrets hardcoded.
- Vaults processed sequentially to avoid rate limits.

---

## .github/workflows/index-community.yml

**PASS with 1 bug to fix.**

### Issue (must fix)

1. **Shell operator precedence bug (lines 32-34).** The commit step reads:
   ```bash
   git diff --staged --quiet || \
     git commit -m "chore: regenerate community-index.json [skip ci]" && \
     git push
   ```
   In bash, `A || B && C` evaluates left-to-right: if `A` succeeds (no changes), `B` is skipped but `C` (`git push`) still runs. This means `git push` executes even when there's nothing to commit. While not destructive (push says "Everything up-to-date"), it's unintended. Fix with grouping:
   ```bash
   git diff --staged --quiet || { git commit -m "chore: regenerate community-index.json [skip ci]" && git push; }
   ```

### What passed review

- Triggers correct: `schedule` (0 6 * * * — daily at 06:00 UTC), `push` on main filtered to `community-vaults.json`, and `workflow_dispatch`.
- `permissions: contents: write` correctly scoped.
- Uses `actions/checkout@v4`.
- `GITHUB_TOKEN` passed via `env` (automatic, no secrets to configure).
- Git config uses `github-actions[bot]` identity.
- `git add community-index.json` targets only the generated file.
- `[skip ci]` in commit message prevents infinite trigger loops.

---

## Summary

**3 issues must be fixed before merge:**

1. Parse owner/repo from `vault.url` instead of hardcoding `dsiddharth2` in API URLs
2. Derive `VAULT_NAMES` from the vaults array at runtime instead of hardcoding
3. Fix shell operator precedence in the CI commit step (use `{ ...; }` grouping)

Core logic is solid: entry-point detection, frontmatter parsing, dependency two-pass, output schema, and CI triggers are all correct. The two hardcoding issues (#1, #2) will break as soon as a non-dsiddharth2 vault is added — fixing them now keeps the system extensible as intended.
