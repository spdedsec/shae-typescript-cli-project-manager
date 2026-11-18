# shae-typescript-cli-project-manager (shae-pm)

A command-line project manager written in TypeScript. Add projects (name,
description, status), list them in a table, update their status
(`todo` / `in-progress` / `done`), and delete them. Data is saved to and
loaded from a JSON file. Part of the SHAE Tier 3 series.

## Features

- add project: name, description, status
- list projects: table format
- update status: todo / in-progress / done
- delete project
- save/load to JSON file (`~/.local/share/shae-pm/projects.json`)
- Zero runtime dependencies (Node.js built-ins only)

## Requirements

- Node.js and npm.
- TypeScript (installed as a devDependency by `./scripts/install.sh`).

## Install

```bash
./scripts/install.sh
```

This compiles `src/index.ts` to `dist/` and symlinks
`~/.local/bin/shae-pm` to the compiled entry point. Make sure
`~/.local/bin` is on your `PATH`.

## Usage

```bash
shae-pm --help

shae-pm add "website redesign" "refresh the corporate site" todo
# added <id>  website redesign

shae-pm add "docs" "write API docs" in-progress
# added <id>  docs

shae-pm list
# id   name             description           status
# --   ----             -----------           ------
# <id> website redesign refresh the corporate site  todo
# <id> docs             write API docs         in-progress

shae-pm status <id> done
# updated <id>  docs -> done

shae-pm delete <id>
# deleted <id>  docs
```

## Project structure

```
src/index.ts          # CLI: lexer-free command dispatch, JSON storage
tsconfig.json         # TypeScript configuration
package.json          # npm manifest (typescript devDependency)
scripts/install.sh    # compile + symlink to ~/.local/bin/shae-pm
Makefile              # build / test / release targets
DESIGN.md             # design system applied
README.md             # this file
.github/workflows/release.yml
LICENSE               # MIT
docs/DE.md            # German
docs/ES.md            # Spanish
```

## Data

Projects are stored in JSON at:
`~/.local/share/shae-pm/projects.json`

## Design

See `DESIGN.md` for how the SHAE field manual design system is applied to
this command-line tool.

## License

MIT. See `LICENSE`.
