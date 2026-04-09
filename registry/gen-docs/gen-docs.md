---
name: gen-docs
description: Generate clear, accurate documentation for code — JSDoc, TSDoc, docstrings, XML comments, or standalone markdown. Use when you need API docs or inline documentation for a module.
argument-hint: <file-path> [--format <inline|markdown>]
allowed-tools: Read, Grep, Glob, Write, Edit
---

Generate clear, accurate documentation for the specified code.

## Instructions

1. **Read the target file(s)** provided by the user.
2. **Identify all public exports**: functions, classes, types, constants.
3. **Generate documentation** for each export following the rules below.
4. **Write inline docs** (JSDoc, TSDoc, docstrings, XML comments) directly into the source file.
5. Optionally generate a standalone markdown reference if the user requests it.

## Documentation Rules

### Functions / Methods
- **Summary**: One sentence describing what it does (not how).
- **Parameters**: Name, type, description, whether optional, default value.
- **Returns**: Type and description of the return value.
- **Throws**: List exceptions that callers should handle.
- **Example**: A short usage example for non-trivial functions.

### Classes / Interfaces
- **Summary**: Purpose and responsibility of the class.
- **Properties**: Type and description for each public property.
- **Methods**: Document each public method as above.

### Types / Enums
- **Summary**: What the type represents.
- **Members**: Description of each field or enum value.

### Constants
- **Summary**: What the constant represents and where it is used.

## Style

- Write for the reader who will use the API, not the one who implements it.
- Be concise — one sentence per description unless the behavior is complex.
- Use the documentation format native to the language (JSDoc for JS/TS, docstrings for Python, XML comments for C#).
- Do not document obvious getters/setters or trivial one-liners.
