# PlugVault — Official Skills Registry

The official registry of reusable [Claude Code](https://claude.ai/code) skills and commands, installable via the [`plug`](https://github.com/dsiddharth2/plug) CLI.

```bash
npm install -g plugvault
plug install -i code-review
```

## What's Inside

### Skills (always active in `.claude/skills/`)

Skills are background instructions that Claude follows automatically whenever they're relevant.

| Name | Description |
|------|-------------|
| `api-patterns` | REST API design — controller/service/repo layering, response envelopes, pagination, versioning |
| `security-rules` | Security guardrails — no hardcoded secrets, input validation, parameterized queries, auth checks |
| `testing-standards` | Testing conventions — Arrange-Act-Assert, naming, coverage targets, mock hygiene |
| `git-conventions` | Git workflow — conventional commits, branch naming, PR standards |
| `react-patterns` | React best practices — component structure, hooks, state management, effects |
| `error-handling` | Error patterns — custom error classes, API error responses, structured logging, retries |
| `code-style` | Code style — naming conventions, file structure, imports, function design, comments |

### Commands (invoked with `/command-name`)

Commands are on-demand workflows you trigger explicitly.

| Name | Description |
|------|-------------|
| `code-review` | Deep code review across correctness, security, performance, maintainability |
| `gen-tests` | Generate comprehensive tests — happy path, edge cases, error cases |
| `refactor` | Analyze and refactor code — extract, simplify, rename, restructure |
| `explain-codebase` | Walk through project structure, architecture, entry points, conventions |
| `gen-docs` | Generate inline docs (JSDoc/TSDoc/docstrings) or markdown API references |
| `pr-description` | Generate a structured PR description from the current branch's changes |
| `debug-help` | Analyze an error/stack trace and provide diagnosis with fix |

## How It Works

Each entry in the registry is a folder containing:

```
registry/<name>/
├── meta.json       # Name, type, version, description, tags, entry filename
└── SKILL.md        # The actual skill file (for skills)
└── <name>.md       # The actual command file (for commands)
```

The `plug` CLI reads `registry.json` to discover available packages, then downloads the entry file and copies it to the correct location:

- **Skills** → `.claude/skills/<name>/SKILL.md` (or `~/.claude/skills/` with `-g`)
- **Commands** → `.claude/commands/<name>.md` (or `~/.claude/commands/` with `-g`)

## File Formats

### registry.json

Top-level index of all available packages:

```json
{
  "name": "plugvault-official",
  "version": "1.0.0",
  "packages": {
    "api-patterns": {
      "type": "skill",
      "version": "1.0.0",
      "path": "registry/api-patterns",
      "description": "Enforces consistent REST API design patterns"
    }
  }
}
```

### meta.json

Per-package metadata:

```json
{
  "name": "api-patterns",
  "type": "skill",
  "version": "1.0.0",
  "description": "Enforces consistent REST API design patterns",
  "author": "plugvault",
  "tags": ["api", "rest", "architecture", "patterns"],
  "entry": "SKILL.md"
}
```

### Skill/Command Files

All skill and command files use Claude Code's standard format with YAML frontmatter:

```yaml
---
name: api-patterns
description: Enforces consistent REST API design patterns...
allowed-tools: Read, Grep, Glob
---

Your skill instructions here...
```

See [Claude Code Skills Documentation](https://docs.anthropic.com/en/docs/claude-code/skills) for the full specification.

## Contributing

### Adding a New Skill

1. Create a folder under `registry/` with your skill name (kebab-case).
2. Add `meta.json` with name, type (`"skill"`), version, description, author, tags, and entry (`"SKILL.md"`).
3. Add `SKILL.md` with YAML frontmatter (`name`, `description`) and your skill instructions.
4. Add your skill to `registry.json` under `packages`.
5. Open a PR.

### Adding a New Command

1. Create a folder under `registry/` with your command name (kebab-case).
2. Add `meta.json` with name, type (`"command"`), version, description, author, tags, and entry.
3. Add `<name>.md` with YAML frontmatter (`name`, `description`, `argument-hint`, `allowed-tools`) and your command instructions.
4. Add your command to `registry.json` under `packages`.
5. Open a PR.

### Guidelines

- **Skills** should be general enough to apply to most projects in their domain.
- **Commands** should produce structured, actionable output.
- Keep descriptions concise — front-load the key use case.
- Include practical, specific rules — not vague advice.
- Test your skill/command in a real project before submitting.

## Using a Private Vault

You can host your own registry with the same structure and register it with `plug`:

```bash
plug vault add company https://github.com/myorg/company-vault --token ghp_xxx
plug install -i company/deploy-checklist
```

## License

MIT
