# shae-typescript-cli-project-manager (Deutsch)

Ein Befehlszeilen-Projektmanager in TypeScript. Projekte hinzufügen (Name,
Beschreibung, Status), tabellarisch auflisten, Status aktualisieren
(`todo` / `in-progress` / `done`) und löschen. Die Daten werden in einer
JSON-Datei gespeichert und geladen. Teil der SHAE Tier 3 Serie.

## Funktionen

- Projekt hinzufügen: Name, Beschreibung, Status
- Projekte auflisten: Tabellenformat
- Status aktualisieren: todo / in-progress / done
- Projekt löschen
- Speichern/Laden aus JSON (`~/.local/share/shae-pm/projects.json`)
- Ohne Laufzeitabhängigkeiten (nur Node.js-Eingebaute)

## Voraussetzungen

- Node.js und npm.
- TypeScript (wird als devDependency durch `./scripts/install.sh` installiert).

## Installation

```bash
./scripts/install.sh
```

Kompiliert `src/index.ts` nach `dist/` und verlinkt
`~/.local/bin/shae-pm` auf den Einstiegspunkt. Stellen Sie sicher, dass
`~/.local/bin` im `PATH` ist.

## Verwendung

```bash
shae-pm --help
shae-pm add "website redesign" "refresh the corporate site" todo
shae-pm list
shae-pm status <id> done
shae-pm delete <id>
```

## Lizenz

MIT. Siehe `LICENSE`.
