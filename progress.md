# Fix: Indexer Child Skill Bundling

**Branch:** `fix/indexer-child-skill-bundling`  
**File:** `scripts/build-community-index.js`  
**Date:** 2026-04-18

## Problem

When installing a parent skill like `agenthub`, sub-skills (board, eval, init, merge, run, spawn, status) were **not** included in the install. The TUI showed them as "Dependencies: not installed" which was confusing.

Two bugs in the indexer caused this:

### Bug 1: File exclusion in `resolveFileOwnership`

Category B (dedicated directory) deliberately excluded files owned by child entry points:

```js
const ownedByChild = childEpDirs.some(childDir =>
  dir === childDir || dir.startsWith(childDir + '/')
);
if (!ownedByChild) {
  filesInDir.push(...files);
}
```

This meant agenthub's `files` array excluded sub-skill files like `engineering/agenthub/skills/board/SKILL.md`. When plug-doer installed agenthub, only the parent files were downloaded.

### Bug 2: Pass C — auto-child dependency generation

The indexer auto-generated dependencies from child entry points:

```js
// Dependencies — Pass C (auto-child entry points)
for (const childName of ownership.childEntryPoints) {
  dependencies.push({
    name: childName,
    type: 'skill',
    vault: vaultName,
    required: false,
    source: 'auto-child',
  });
}
```

This created bogus dependencies with generic names that collided with unrelated packages:
- `eval` matched a legacy shim from `everything-claude-code`
- `init` matched a Playwright skill from `playwright-pro`
- `status` matched a memory dashboard from `self-improving-agent`

## Fix Applied

1. **Removed file exclusion** — Category B now includes ALL files under the parent directory (including sub-skill subdirectories)
2. **Removed Pass C** — no more `auto-child` dependency generation
3. **Removed `childEntryPoints`** tracking and `entryPointDirSet` (no longer needed)

## Result

- Installing `agenthub` now includes all sub-skill files
- Sub-skills still indexed as standalone packages for individual install
- No more misleading "not installed" dependencies in the TUI

## Status

- [x] Code changes applied to `scripts/build-community-index.js`
- [x] Rebuild `community-index.json` (665 packages, 0 auto-child deps)
- [ ] Commit and push
- [ ] Create PR
