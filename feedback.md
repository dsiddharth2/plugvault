# Community Vault Indexing — Code Review (Re-review)

**Reviewer:** plug-reviewer
**Date:** 2026-04-16
**Verdict:** APPROVED

---

## Fix Verification

### 1. Dynamic owner — FIXED

`processVault` (line 149-150) now parses `owner`/`repoName` from `vault.url` via `new URL()`. All API calls use the parsed values:
- `rawBase` (line 152): `https://raw.githubusercontent.com/${owner}/${repoName}/main/`
- `apiTreeUrl` (line 153): `https://api.github.com/repos/${owner}/${repoName}/git/trees/main?recursive=1`
- `vaultUrl` output field (line 219): `${urlParts.origin}/${owner}/${repoName}`
- `depsUrl` in `main()` (line 255): `https://raw.githubusercontent.com/${owner}/${repoName}/main/plug-deps.json`

No hardcoded `dsiddharth2` remains in the script.

### 2. Dynamic vault names — FIXED

`main()` (lines 244-246) derives vault names at runtime:
```js
const vaultNames = vaults.map(v => v.name);
const vaultNamesPattern = vaultNames.join('|');
const depPattern = new RegExp(`(${vaultNamesPattern}):[\\w-]+`, 'g');
```
`depPattern` is passed through `processVault` and into `inferDependencies` as a parameter. No static `VAULT_NAMES` or `DEP_PATTERN` constants exist.

### 3. CI shell precedence — FIXED

Line 31 of `index-community.yml`:
```bash
git diff --staged --quiet || { git commit -m "chore: regenerate community-index.json [skip ci]" && git push; }
```
Correct `{ ...; }` grouping ensures `git push` only runs when `git commit` succeeds.

---

## Regression Check

No regressions introduced. All items that passed initial review remain intact:

- Zero npm dependencies (https, fs, path builtins only)
- Entry-point detection for all 3 structures (SKILL.md, agents/*.md, commands/*.md)
- GitHub Tree API single call per vault, raw content fetched only for entry points
- Graceful 404 handling for plug-deps.json
- Frontmatter parsing correct for supported subset
- Entries without description skipped
- Dependency two-pass (curated + inferred) with deduplication
- Output schema complete with top-level `updatedAt`
- Auth header uses `GITHUB_TOKEN` env var, no hardcoded secrets
- Sequential vault processing to avoid rate limits
- CI triggers (schedule, push, workflow_dispatch), permissions, checkout, git config, `[skip ci]` all correct

---

## Summary

All 3 issues from the initial review have been correctly fixed. The script now fully supports vaults from any GitHub owner, derives dependency patterns dynamically, and the CI commit step has correct shell grouping. No regressions found. Ready to merge.
