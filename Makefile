# Makefile — shae-typescript-cli-project-manager (shae-pm)
#
# Targets:
#   make build   — compile src/index.ts with tsc to dist/
#   make test    — compile and exercise the CLI (add/list/status/delete)
#   make release — reminder that releases are cut via GitHub Actions
#   make clean   — remove dist/
#
# Requires node/npm and the typescript devDependency.

SHELL := /usr/bin/env bash
TSC := ./node_modules/.bin/tsc
DATA_FILE := "$$HOME/.local/share/shae-pm/projects.json"

.PHONY: build test release clean

build:
	@echo "==> Installing dependencies"
	@npm install >/dev/null 2>&1 || true
	@echo "==> Compiling TypeScript"
	@$(TSC)
	@echo "ok: compiled to dist/index.js"

test: build
	@echo "==> Running CLI smoke tests"
	@rm -f $(DATA_FILE)
	@node dist/index.js add "alpha" "first project" todo >/dev/null
	@node dist/index.js add "beta" "second project" in-progress >/dev/null
	@echo "--- list ---"
	@node dist/index.js list
	@ID=$$(node dist/index.js list | awk 'NR==3{print $$1}'); \
	echo "--- status $$ID -> done ---"; \
	node dist/index.js status "$$ID" done
	@echo "--- list after status change ---"
	@node dist/index.js list
	@echo "--- delete alpha ---"
	@node dist/index.js delete alpha
	@echo "--- final list ---"
	@node dist/index.js list
	@rm -f $(DATA_FILE)
	@echo "ok: all smoke tests passed"

release: test
	@echo "==> Release"
	@echo "Create the GitHub release v0.1.0 via .github/workflows/release.yml."

clean:
	@rm -rf dist
	@echo "ok: cleaned dist/"
