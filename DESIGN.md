# DESIGN.md — shae-typescript-cli-project-manager

This document records how the SHAE field manual design system is applied to
`shae-typescript-cli-project-manager` (`shae-pm`), a command-line project
manager written in TypeScript.

## Applied principles

### Precise over decorative

The CLI prints only what is needed: a table for `list`, a single confirmation
line for `add`/`status`/`delete`, and a concise usage block for `--help`.
No decorative banners, spinners, or ornamental output. Error messages are a
single line prefixed with `error:`.

### Flat and physical

Terminal output is flat by nature: no radius, no borders, no shadows. The
list table is plain aligned text — border-defined in spirit through aligned
columns and a separator rule — on the terminal ground.

### Type does the work

- **Display:** the program name `shae-pm` and the usage heading act as the
  display type.
- **Body:** table rows and confirmation lines are clear, legible terminal
  type.
- **Labels / code:** commands (`add`, `list`, `status`, `delete`) and
  statuses (`todo`, `in-progress`, `done`) are short, lowercase keywords
  presented in monospaced form in documentation.

The single oxide-red signal (`#B3341B`) is reserved for errors:

```
error: project not found: alpha
error: invalid status: frozen
```

In a terminal this is the one accent colour per view; everything else is ink
on warm paper.

### Confident restraint

Palette: warm paper `#F2EEE5`, ink `#191712`, oxide signal `#B3341B`.
No gradients, glows, pills, glass cards, or shadows. One oxide signal per
view — the error message.

### Motion

A batch CLI performs no animation. Output is instant.

### Accessibility

- WCAG AA contrast: errors are clearly distinguished.
- Complete keyboard path: driven entirely by command-line arguments.
- No horizontal overflow: table columns are padded but kept compact; error
  and usage lines are short.

## Color palette

| Role      | Hex     | Use                                       |
|-----------|---------|-------------------------------------------|
| Warm paper| #F2EEE5 | ground (terminal background analogue)     |
| Ink       | #191712 | table output, confirmations, usage        |
| Oxide     | #B3341B | error messages (one signal per view)      |

## Files

- `src/index.ts` — command dispatch, JSON storage, table formatting
- `DESIGN.md` — this document
