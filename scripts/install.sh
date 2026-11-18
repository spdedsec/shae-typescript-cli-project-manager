#!/usr/bin/env bash
# scripts/install.sh — shae-typescript-cli-project-manager (shae-pm)
#
# Installs the TypeScript compiler, compiles src/index.ts to dist/, and
# symlinks ~/.local/bin/shae-pm to the compiled entry point.
#
# Usage:
#   ./scripts/install.sh
#   shae-pm add "website redesign" "refresh the corporate site" todo
#   shae-pm list
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> shae-pm installer"
echo

if ! command -v npm >/dev/null 2>&1; then
  echo "error: npm is required but was not found"
  exit 1
fi

echo "==> Installing dependencies (typescript)"
npm install

echo "==> Compiling TypeScript"
./node_modules/.bin/tsc

BIN_DIR="$HOME/.local/bin"
mkdir -p "$BIN_DIR"
LINK="$BIN_DIR/shae-pm"

cat > "$LINK" <<SH
#!/usr/bin/env bash
exec node "$ROOT/dist/index.js" "\$@"
SH
chmod +x "$LINK"

echo
echo "ok: compiled to $ROOT/dist/index.js"
echo "ok: installed shae-pm to $LINK"
echo
echo "==> Quick start"
echo "  shae-pm --help"
echo "  shae-pm add 'website redesign' 'refresh the corporate site' todo"
echo "  shae-pm list"
echo "  shae-pm status <id> in-progress"
echo "  shae-pm delete <id>"
