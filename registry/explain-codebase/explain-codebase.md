# Explain Codebase

Provide a clear, structured walkthrough of the current project for someone new to the codebase.

## Instructions

1. **Scan the project root**: read package.json / pyproject.toml / *.csproj to identify the language, framework, and dependencies.
2. **Map the directory structure**: list top-level folders and their purpose.
3. **Identify the architecture pattern**: MVC, layered, hexagonal, microservices, monorepo, etc.
4. **Trace the entry point**: find the main file and explain the startup/boot sequence.
5. **Explain key modules**: for each major folder, describe what it contains, its responsibilities, and how it connects to other modules.
6. **Highlight conventions**: naming patterns, file organization, testing setup, configuration approach.
7. **Note external integrations**: databases, APIs, message queues, third-party services.

## Output Format

### Project Overview
- Name, language, framework, purpose (1-2 sentences).

### Directory Map
```
folder/        — description
  subfolder/   — description
```

### Architecture
- Pattern used and how data flows through the system.

### Entry Point
- File path and what happens on startup.

### Key Modules
For each major module:
- **Purpose**: What it does.
- **Key files**: The important files and what they contain.
- **Dependencies**: What it depends on and what depends on it.

### Conventions
- Patterns a new developer should know.

### Getting Started
- How to install, configure, and run the project locally.
