---
title: "GitHub CLI y herramientas integradas"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [GitHub CLI y herramientas integradas](#github-cli-y-herramientas-integradas)
  - [Instalar `gh` para interactuar desde terminal](#instalar-gh-para-interactuar-desde-terminal)
    - [Instalación por plataforma](#instalación-por-plataforma)
    - [Verificar instalación](#verificar-instalación)
    - [Autenticación](#autenticación)
  - [Crear PRs desde la CLI](#crear-prs-desde-la-cli)
    - [Crear un Pull Request](#crear-un-pull-request)
    - [Ver estado de PRs](#ver-estado-de-prs)
    - [Ejemplo de salida de `gh pr view`](#ejemplo-de-salida-de-gh-pr-view)
  - [Gestionar Issues desde la CLI](#gestionar-issues-desde-la-cli)
    - [Crear Issues](#crear-issues)
    - [Listar y ver Issues](#listar-y-ver-issues)
    - [Comentar en Issues](#comentar-en-issues)
  - [Revisar PRs sin salir de la CLI](#revisar-prs-sin-salir-de-la-cli)
    - [Checkout de PR localmente](#checkout-de-pr-localmente)
    - [Revisar diffs y comentarios](#revisar-diffs-y-comentarios)
    - [Merge de PRs](#merge-de-prs)
  - [GitHub Actions desde la CLI](#github-actions-desde-la-cli)
    - [Gestionar Workflows](#gestionar-workflows)
    - [Cancelar o Re-run](#cancelar-o-re-run)
  - [Alias y personalización](#alias-y-personalización)
  - [Integración con scripts y automatización](#integración-con-scripts-y-automatización)
    - [Salida JSON para parsing](#salida-json-para-parsing)
    - [Códigos de salida](#códigos-de-salida)
    - [Ejemplo de script de automatización](#ejemplo-de-script-de-automatización)
  - [Quédate con...](#quédate-con)

</div>

# GitHub CLI y herramientas integradas

GitHub CLI (`gh`) es una herramienta de línea de comandos oficial que extiende Git con capacidades nativas de GitHub. Mientras Git gestiona el control de versiones local, `gh` permite interactuar con la plataforma GitHub directamente desde la terminal: crear pull requests, gestionar issues, revisar código, ejecutar workflows de Actions, y más, sin necesidad de abrir el navegador. Esta integración transforma el flujo de trabajo: desarrolladores que prefieren la terminal pueden completar todo el ciclo de colaboración sin cambiar de contexto, automatizar tareas repetitivas mediante scripts, y mantener la productividad en entornos remotos o con recursos limitados.

## Instalar `gh` para interactuar desde terminal

GitHub CLI está disponible para los principales sistemas operativos y gestores de paquetes. La instalación es sencilla y una vez configurado, `gh` se integra naturalmente con tu flujo de Git existente.

### Instalación por plataforma

| Sistema | Comando de instalación |
|---------|----------------------|
| **macOS (Homebrew)** | `brew install gh` |
| **Windows (winget)** | `winget install --id GitHub.cli` |
| **Windows (Chocolatey)** | `choco install gh` |
| **Ubuntu/Debian** | `sudo apt install gh` |
| **Fedora/RHEL** | `sudo dnf install gh` |
| **Arch Linux** | `sudo pacman -S gh` |
| **Multi-plataforma** | Descargar desde [cli.github.com](https://cli.github.com) |

### Verificar instalación

```bash
# Verificar versión instalada
$ gh --version
gh version 2.40.1 (2024-01-15)
https://github.com/cli/cli/releases/tag/v2.40.1
```

### Autenticación

Tras instalar, debes autenticarte con tu cuenta de GitHub:

```bash
# Iniciar proceso de autenticación
$ gh auth login

# Sigue las instrucciones:
# 1. Selecciona GitHub.com o GitHub Enterprise
# 2. Elige método: HTTPS o SSH
# 3. Abre navegador para autorizar
# 4. Copia código de verificación
# 5. Confirma en terminal
```

La autenticación guarda un token en tu sistema (keychain en macOS, credential manager en Windows, archivo seguro en Linux). Este token se usa para todas las operaciones posteriores sin requerir login repetido.

```bash
# Verificar estado de autenticación
$ gh auth status
github.com
  ✓ Logged in to github.com as tu-usuario (~/.config/gh/hosts.yml)
  ✓ Git operations for github.com configured to use https protocol.
  ✓ Token: *******************
```

> `gh` no reemplaza a Git: lo complementa. Los comandos `git clone`, `git push`, `git pull` siguen funcionando normalmente. `gh` añade capacidades específicas de GitHub que Git no tiene nativamente.

## Crear PRs desde la CLI

Una de las funciones más útiles de `gh` es crear y gestionar pull requests sin salir de la terminal. Esto es especialmente valioso en flujos de trabajo automatizados, servidores CI/CD, o cuando trabajas en entornos sin interfaz gráfica.

### Crear un Pull Request

```bash
# Crear PR desde la rama actual
$ gh pr create

# Con título y cuerpo explícitos
$ gh pr create --title "Corregir validación de email" --body "Fixes #123"

# Especificar rama base y comparada
$ gh pr create --base main --head feature/validacion-email

# Abrir en navegador después de crear
$ gh pr create --web
```

El comando interactivo (`gh pr create` sin flags) abre un editor para título y cuerpo, permitiendo revisar el diff antes de enviar:

```bash
$ gh pr create

Creating pull request for tu-usuario:feature/validacion-email into main

? Title Corregir validación de email para dominios .io
? Body <skip>
? Choose a template Bug Fix
? What's next? Submit
```

### Ver estado de PRs

```bash
# Listar PRs abiertos en el repositorio actual
$ gh pr list

# Listar PRs con filtros
$ gh pr list --state all          # Todos los estados
$ gh pr list --author @me         # Solo mis PRs
$ gh pr list --label bug          # Por etiqueta
$ gh pr list --search "validation" # Por término en título/body

# Ver detalles de un PR específico
$ gh pr view 123
$ gh pr view feature/validacion-email
```

### Ejemplo de salida de `gh pr view`

```
$ gh pr view 123
Corregir validación de email para dominios .io
Open • tu-usuario wants to merge 1 commit into main from feature/validacion-email
+15 -3 • Opened 2 days ago by tu-usuario

  Fix #123 - El regex anterior rechazaba dominios válidos

View this pull request on GitHub: https://github.com/org/repo/pull/123
```

> Los números de PR en `gh pr view 123` son relativos al repositorio actual. Si trabajas en múltiples repositorios, verifica estar en el directorio correcto o usa `--repo owner/name` para especificar.

## Gestionar Issues desde la CLI

Los issues pueden crearse, listarse y gestionarse completamente desde la terminal, facilitando reporte rápido de bugs o seguimiento de tareas sin contexto switching.

### Crear Issues

```bash
# Crear issue interactivo
$ gh issue create

# Con título y cuerpo explícitos
$ gh issue create --title "Bug: login falla con emails .io" --body "Pasos para reproducir..."

# Asignar labels y responsables
$ gh issue create --label bug,priority-high --assignee @me

# Vincular a proyecto
$ gh issue create --project "Sprint 23"
```

### Listar y ver Issues

```bash
# Listar issues abiertos
$ gh issue list

# Filtrar por estado, label, autor
$ gh issue list --state closed
$ gh issue list --label enhancement
$ gh issue list --author @me

# Ver detalles de issue específico
$ gh issue view 456
```

### Comentar en Issues

```bash
# Añadir comentario a un issue
$ gh issue comment 456 --body "Pude reproducir el bug, trabajando en fix"

# Adjuntar archivo al comentario
$ gh issue comment 456 --body "Log adjunto" --editor

# Reaccionar con emoji
$ gh issue react 456 --reaction +1
```

> `gh issue comment` es útil para actualizar el estado de un issue sin abrir el navegador. En flujos de trabajo remotos o por SSH, esto permite mantener comunicación asíncrona con el equipo completamente desde terminal.

## Revisar PRs sin salir de la CLI

La revisión de código puede hacerse parcialmente desde `gh`, aunque la experiencia completa de diff interactivo sigue siendo mejor en la interfaz web.

### Checkout de PR localmente

```bash
# Descargar y checkout de un PR para revisión local
$ gh pr checkout 123

# Esto crea una rama local temporal
$ git branch
* pr-123
  main

# Tras revisar, volver a main
$ git switch main
$ git branch -D pr-123
```

### Revisar diffs y comentarios

```bash
# Ver diff completo del PR
$ gh pr diff 123

# Ver comentarios existentes en el PR
$ gh pr view 123 --comments

# Aprobar un PR
$ gh pr review 123 --approve

# Solicitar cambios
$ gh pr review 123 --request-changes --body "Necesita tests adicionales"

# Comentar sin aprobación formal
$ gh pr review 123 --comment --body "Pregunta sobre esta implementación"
```

### Merge de PRs

```bash
# Merge con merge commit
$ gh pr merge 123 --merge

# Squash and merge
$ gh pr merge 123 --squash

# Rebase and merge
$ gh pr merge 123 --rebase

# Eliminar rama tras merge
$ gh pr merge 123 --delete-branch

# Merge interactivo (pregunta opciones)
$ gh pr merge 123
```

> `gh pr merge` verifica automáticamente si el PR es mergeable (sin conflictos, checks passing, aprobaciones requeridas). Si hay bloqueos, el comando falla con mensaje explicativo en lugar de intentar merge forzado.

## GitHub Actions desde la CLI

`gh` permite interactuar con GitHub Actions: ejecutar workflows manualmente, ver runs, descargar logs, y más.

### Gestionar Workflows

```bash
# Listar workflows del repositorio
$ gh workflow list

# Ejecutar workflow manualmente (si tiene workflow_dispatch)
$ gh workflow run ci.yml
$ gh workflow run "Deploy Production"

# Ver runs de workflows
$ gh run list
$ gh run list --workflow ci.yml
$ gh run list --branch main

# Ver detalles de un run específico
$ gh run view 1234567890

# Descargar logs de un run
$ gh run download 1234567890

# Ver logs en tiempo real (para runs en progreso)
$ gh run watch 1234567890
```

### Cancelar o Re-run

```bash
# Cancelar un run en progreso
$ gh run cancel 1234567890

# Re-ejecutar un run fallido
$ gh run rerun 1234567890

# Re-ejecutar jobs específicos
$ gh run rerun 1234567890 --job tests
```

> Los workflows con trigger `workflow_dispatch` pueden ejecutarse manualmente desde CLI o web. Workflows con triggers automáticos (push, pull_request) no pueden invocarse manualmente con `gh workflow run`.

## Alias y personalización

`gh` permite crear alias para comandos frecuentes, similar a los alias de shell pero específicos de GitHub CLI.

```bash
# Crear alias personalizado
$ gh alias set prl "pr list"
$ gh alias set prc "pr checkout"
$ gh alias set prv "pr view"

# Usar alias
$ gh prl
$ gh prc 123

# Listar alias configurados
$ gh alias list

# Eliminar alias
$ gh alias delete prl
```

Los alias pueden incluir argumentos posicionales:

```bash
# Alias con argumento posicional
$ gh alias set prmerge "pr merge $1 --delete-branch"

# Uso: gh prmerge 123
# Equivale a: gh pr merge 123 --delete-branch
```

> Los alias de `gh` se almacenan en `~/.config/gh/config.yml`. Pueden sincronizarse entre máquinas copiando este archivo o usando dotfiles management.

## Integración con scripts y automatización

`gh` está diseñado para scripting: salida en formato JSON, códigos de salida estándar, y soporte para pipes lo hacen ideal para automatización.

### Salida JSON para parsing

```bash
# Obtener PRs en formato JSON
$ gh pr list --json number,title,author,state

# Ejemplo de salida:
[
  {"number":123,"title":"Fix bug","author":{"login":"user1"},"state":"OPEN"},
  {"number":124,"title":"Add feature","author":{"login":"user2"},"state":"MERGED"}
]

# Usar con jq para filtrar
$ gh pr list --json number,title | jq '.[] | select(.state == "OPEN")'
```

### Códigos de salida

```bash
# Verificar si un PR existe (exit code 0 si existe, 1 si no)
$ gh pr view 123 > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "PR existe"
else
  echo "PR no encontrado"
fi
```

### Ejemplo de script de automatización

```bash
#!/bin/bash
# Script para listar PRs pendientes de review

echo "PRs pendientes de mi review:"
gh pr list --search "review:required" --json number,title,author \
  | jq -r '.[] | "#\(.number): \(.title) por @\(.author.login)"'
```

> La salida JSON de `gh` es estable y documentada, ideal para scripts de producción. Evita hacer parseo de salida humana (la que ves en terminal sin `--json`), ya que el formato puede cambiar entre versiones.

## Quédate con...

*   GitHub CLI (`gh`) complementa Git añadiendo capacidades nativas de GitHub directamente desde la terminal.
*   La instalación varía por sistema operativo; la autenticación con `gh auth login` es requerida una vez y se mantiene persistente.
*   `gh pr create`, `gh pr list`, `gh pr view`, y `gh pr merge` permiten gestionar todo el ciclo de pull requests sin navegador.
*   `gh issue create`, `gh issue list`, y `gh issue comment` facilitan reporte y seguimiento de issues desde terminal.
*   `gh pr checkout` descarga un PR localmente para revisión y testing antes de aprobar o merge.
*   `gh workflow run`, `gh run list`, y `gh run watch` permiten gestionar GitHub Actions completamente desde CLI.
*   Los alias de `gh` (`gh alias set`) personalizan comandos frecuentes para mayor productividad.
*   La salida JSON (`--json`) y códigos de salida estándar hacen `gh` ideal para scripting y automatización CI/CD.
*   `gh` no reemplaza Git: coexiste con comandos git tradicionales, añadiendo capacidades específicas de plataforma GitHub.

<div class="pagination">
  <a href="/markdown/sistemas/git/github/markdown" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/github/licencias" class="next">Siguiente</a>
</div>
