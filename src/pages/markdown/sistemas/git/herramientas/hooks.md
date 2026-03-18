---
title: "Hooks de Git"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Hooks de Git](#hooks-de-git)
  - [Scripts que se ejecutan en eventos](#scripts-que-se-ejecutan-en-eventos)
    - [Hooks del lado del cliente](#hooks-del-lado-del-cliente)
    - [Hooks del lado del servidor](#hooks-del-lado-del-servidor)
    - [Ubicación y activación](#ubicación-y-activación)
  - [Ejemplo: formatear código antes de commit](#ejemplo-formatear-código-antes-de-commit)
    - [Hook pre-commit básico para formateo](#hook-pre-commit-básico-para-formateo)
    - [Hook para validar mensaje de commit](#hook-para-validar-mensaje-de-commit)
  - [Herramientas de gestión de hooks](#herramientas-de-gestión-de-hooks)
    - [Husky (JavaScript/Node.js)](#husky-javascriptnodejs)
    - [Pre-commit (Python)](#pre-commit-python)
    - [Comparativa de enfoques](#comparativa-de-enfoques)
  - [Mejores prácticas para hooks](#mejores-prácticas-para-hooks)
    - [Mantén los hooks rápidos](#mantén-los-hooks-rápidos)
    - [No bloquees sin necesidad](#no-bloquees-sin-necesidad)
    - [Documenta los hooks](#documenta-los-hooks)
    - [Permite bypass en emergencias](#permite-bypass-en-emergencias)
  - [Quédate con...](#quédate-con)

</div>

# Hooks de Git

Los hooks de Git son scripts automatizados que se ejecutan en momentos específicos del flujo de trabajo de versionado, permitiendo validar, modificar o rechazar operaciones antes de que se completen. Estos scripts actúan como guardianes de calidad: pueden verificar que el código sigue estándares, que los tests pasan, que los mensajes de commit cumplen convenciones, o que no se commitean secretos accidentalmente. Los hooks residen en el directorio `.git/hooks/` de cada repositorio y se activan automáticamente ante eventos como `pre-commit`, `commit-msg`, `pre-push`, entre otros. Esta capacidad de automatización transforma prácticas de calidad que dependen de disciplina humana en reglas ejecutadas consistentemente por el sistema.

## Scripts que se ejecutan en eventos

Git define múltiples puntos de extensión donde los hooks pueden interceptar operaciones. Cada hook tiene un nombre específico y se activa antes o después de un evento particular. Los hooks más comunes se organizan en dos categorías: del lado del cliente (locales) y del lado del servidor (remotos).

### Hooks del lado del cliente

Estos hooks se ejecutan en la máquina del desarrollador, antes de que los cambios se compartan con el repositorio remoto.

| Hook | Cuándo se ejecuta | Propósito típico |
|------|------------------|------------------|
| `pre-commit` | Antes de crear el commit | Validar código, ejecutar linters, formatear |
| `prepare-commit-msg` | Antes de abrir el editor de mensaje | Pre-llenar mensaje con metadata |
| `commit-msg` | Después de escribir el mensaje, antes de confirmar | Validar formato del mensaje de commit |
| `post-commit` | Después de crear el commit | Notificaciones, logs, triggers externos |
| `pre-push` | Antes de enviar cambios al remoto | Ejecutar tests, validar que no se pusha código roto |
| `post-checkout` | Después de cambiar de rama | Instalar dependencias, actualizar configuración |

### Hooks del lado del servidor

Estos hooks se ejecutan en el repositorio remoto (GitHub, GitLab, servidor propio) y controlan qué cambios se aceptan.

| Hook | Cuándo se ejecuta | Propósito típico |
|------|------------------|------------------|
| `pre-receive` | Antes de aceptar push del cliente | Validar políticas, rechazar cambios no autorizados |
| `update` | Similar a pre-receive, por rama | Validar reglas específicas por rama |
| `post-receive` | Después de aceptar push | Trigger de CI/CD, notificaciones, deploy |

### Ubicación y activación

Los hooks se almacenan en `.git/hooks/` dentro de cada repositorio local. Por defecto, Git incluye archivos de ejemplo con extensión `.sample` que no se ejecutan hasta que se renuevan sin la extensión.

```bash
# Ver hooks disponibles
$ ls .git/hooks/
applypatch-msg.sample
commit-msg.sample
pre-commit.sample
pre-push.sample
...

# Activar un hook (quitar extensión .sample)
$ mv .git/hooks/pre-commit.sample .git/hooks/pre-commit
$ chmod +x .git/hooks/pre-commit  # Asegurar que sea ejecutable
```

>  Los hooks son locales por defecto: no se comparten mediante `git clone` o `git push`. Para distribuir hooks en un equipo, almacénalos en un directorio del repositorio (ej. `.githooks/`) y configura Git para usarlos: `git config core.hooksPath .githooks`.

## Ejemplo: formatear código antes de commit

Un caso de uso común es asegurar que todo el código commiteado siga estándares de formato consistentes. Un hook `pre-commit` puede ejecutar automáticamente herramientas como Prettier (JavaScript), Black (Python), o gofmt (Go) antes de permitir el commit.

### Hook pre-commit básico para formateo

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Obtener archivos staged que son JavaScript
FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.js$')

if [ -z "$FILES" ]; then
  exit 0  # No hay archivos JS, salir sin error
fi

# Formatear archivos con Prettier
echo "$FILES" | xargs npx prettier --write

# Añadir archivos formateados de vuelta al staging
echo "$FILES" | xargs git add

echo "✓ Código formateado automáticamente"
exit 0
```

**Pasos para instalar:**

```bash
# 1. Crear el archivo hook
$ cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.js$')
if [ -z "$FILES" ]; then exit 0; fi
echo "$FILES" | xargs npx prettier --write
echo "$FILES" | xargs git add
exit 0
EOF

# 2. Hacer ejecutable
$ chmod +x .git/hooks/pre-commit

# 3. Probar con un commit
$ git add src/app.js
$ git commit -m "Añadir nueva función"
✓ Código formateado automáticamente
```

### Hook para validar mensaje de commit

Otro ejemplo útil es validar que los mensajes de commit siguen convenciones como Conventional Commits.

```bash
#!/bin/bash
# .git/hooks/commit-msg

MESSAGE_FILE=$1
MESSAGE=$(cat "$MESSAGE_FILE")

# Patrón para Conventional Commits: tipo(ámbito): descripción
PATTERN="^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+"

if ! echo "$MESSAGE" | grep -qE "$PATTERN"; then
  echo "❌ Mensaje de commit inválido"
  echo "Debe seguir el formato: tipo(ámbito): descripción"
  echo "Ejemplo: feat(auth): implementar login con JWT"
  exit 1  # Rechazar commit
fi

exit 0  # Aceptar commit
```

>  Un hook que retorna `exit 0` permite que la operación continúe. Un hook que retorna `exit 1` (o cualquier valor distinto de 0) aborta la operación. Usa esto para validar condiciones y rechazar commits que no cumplen estándares.

## Herramientas de gestión de hooks

Escribir hooks manualmente es educativo pero propenso a errores. Herramientas especializadas simplifican la creación, distribución y mantenimiento de hooks en equipos.

### Husky (JavaScript/Node.js)

Husky es la herramienta más popular para gestionar hooks en proyectos JavaScript. Se integra con `package.json` y permite definir hooks como scripts npm.

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm run test",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "pre-push": "npm run test:ci"
    }
  }
}
```

**Instalación:**

```bash
$ npm install husky --save-dev
$ npx husky install
$ npx husky add .husky/pre-commit "npm run lint"
```

### Pre-commit (Python)

Para proyectos Python o multi-lenguaje, el framework `pre-commit` permite definir hooks en un archivo `.pre-commit-config.yaml` que se comparte en el repositorio.

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files

  - repo: https://github.com/psf/black
    rev: 23.12.1
    hooks:
      - id: black

  - repo: https://github.com/pycqa/flake8
    rev: 7.0.0
    hooks:
      - id: flake8
```

**Instalación:**

```bash
$ pip install pre-commit
$ pre-commit install
$ pre-commit run --all-files  # Ejecutar en todos los archivos
```

### Comparativa de enfoques

| Enfoque | Ventajas | Desventajas | Ideal para |
|---------|----------|-------------|------------|
| **Hooks manuales** | Sin dependencias, control total | No se comparten, propenso a errores | Proyectos personales, aprendizaje |
| **Husky** | Integración npm, fácil configuración | Solo JavaScript/Node.js | Proyectos frontend/backend JS |
| **Pre-commit** | Multi-lenguaje, hooks predefinidos | Requiere Python, configuración YAML | Equipos multi-lenguaje, Python |

>  Los hooks gestionados por herramientas como Husky o pre-commit se almacenan en el repositorio y se comparten con el equipo mediante `git clone`. Esto asegura consistencia: todos los desarrolladores ejecutan las mismas validaciones antes de commit.

## Mejores prácticas para hooks

Los hooks son poderosos pero mal utilizados pueden frustrar al equipo. Sigue estas recomendaciones para implementarlos efectivamente.

### Mantén los hooks rápidos

Un hook que tarda 30 segundos en ejecutarse interrumpe el flujo de trabajo. Los hooks deben ser rápidos para no desincentivar su uso.

```bash
# ❌ Mal: Ejecutar todos los tests en pre-commit
pre-commit: npm test  # Puede tardar minutos

# ✅ Bien: Solo lint y formato en pre-commit
pre-commit: npm run lint && npm run format

# ✅ Tests completos en pre-push (se ejecuta menos frecuente)
pre-push: npm test
```

### No bloquees sin necesidad

Hooks que rechazan commits por razones triviales generan frustración. Usa hooks para validar condiciones críticas, no preferencias estilísticas menores.

```bash
# ✅ Validar: no commitear secretos
pre-commit: detect-secrets

# ✅ Validar: sintaxis correcta
pre-commit: eslint --fix

# ⚠️ Cuestionable: rechazar por longitud de mensaje
commit-msg: mensaje > 100 caracteres

# ❌ Evitar: validaciones subjetivas
commit-msg: mensaje debe ser "divertido"
```

### Documenta los hooks

Los nuevos miembros del equipo deben saber qué hooks existen y por qué. Incluye una sección en `CONTRIBUTING.md` explicando los hooks activos.

```markdown
## Hooks de Git

Este proyecto usa hooks para validar código antes de commit:

- `pre-commit`: Ejecuta ESLint y Prettier automáticamente
- `commit-msg`: Valida formato Conventional Commits
- `pre-push`: Ejecuta tests completos

Para instalar: `npm install` (Husky se configura automáticamente)
```

### Permite bypass en emergencias

A veces necesitas commitear algo rápido sin pasar por los hooks (ej. hotfix en producción). Git permite omitir hooks con `--no-verify`.

```bash
# Omitir hooks en commit
$ git commit --no-verify -m "Hotfix crítico"

# Omitir hooks en push
$ git push --no-verify
```

> Usa `--no-verify` con extrema precaución. Los hooks existen por razones válidas; omitirlos puede introducir código que rompe build o viola políticas. Documenta cuándo es aceptable usarlo y requiere aprobación posterior.

## Quédate con...

*   Los hooks de Git son scripts que se ejecutan automáticamente en eventos específicos (pre-commit, pre-push, commit-msg) para validar o modificar operaciones.
*   Los hooks del lado del cliente (`pre-commit`, `commit-msg`) validan antes de compartir código; los del servidor (`pre-receive`, `post-receive`) controlan qué se acepta en el remoto.
*   Un hook que retorna `exit 0` permite la operación; `exit 1` la aborta. Usa esto para validar condiciones y rechazar cambios que no cumplen estándares.
*   Los hooks manuales no se comparten con `git clone`; usa herramientas como Husky (JavaScript) o pre-commit (Python) para distribuir hooks en el equipo.
*   Mantén los hooks rápidos: validaciones ligeras en `pre-commit`, tests completos en `pre-push` para no interrumpir el flujo de desarrollo.
*   Documenta los hooks en `CONTRIBUTING.md` para que nuevos miembros del equipo entiendan qué validaciones se ejecutan y por qué.
*   `git commit --no-verify` permite omitir hooks en emergencias, pero úsalo con precaución para no introducir código que viola políticas establecidas.
*   Casos de uso comunes: formateo automático (Prettier, Black), validación de mensajes (Conventional Commits), detección de secretos, ejecución de tests antes de push.

<div class="pagination">
  <a href="/markdown/sistemas/git/herramientas/alias" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/herramientas/cicd" class="next">Siguiente</a>
</div>
