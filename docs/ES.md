# shae-typescript-cli-project-manager (Español)

Un gestor de proyectos de línea de comandos en TypeScript. Agrega proyectos
(nombre, descripción, estado), listalos en formato tabla, actualiza su
estado (`todo` / `in-progress` / `done`) y bórralos. Los datos se guardan y
cargan desde un archivo JSON. Parte de la serie SHAE Tier 3.

## Características

- Agregar proyecto: nombre, descripción, estado
- Listar proyectos: formato tabla
- Actualizar estado: todo / in-progress / done
- Eliminar proyecto
- Guardar/cargar desde JSON (`~/.local/share/shae-pm/projects.json`)
- Sin dependencias de ejecución (solo Node.js built-ins)

## Requisitos

- Node.js y npm.
- TypeScript (instalado como devDependency por `./scripts/install.sh`).

## Instalación

```bash
./scripts/install.sh
```

Compila `src/index.ts` a `dist/` y crea un symlink de
`~/.local/bin/shae-pm` al punto de entrada compilado. Asegúrate de que
`~/.local/bin` esté en tu `PATH`.

## Uso

```bash
shae-pm --help
shae-pm add "website redesign" "refresh the corporate site" todo
shae-pm list
shae-pm status <id> done
shae-pm delete <id>
```

## Licencia

MIT. Véase `LICENSE`.
