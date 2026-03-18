---
title: "¿Qué ofrece GitHub más allá de Git?"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [¿Qué ofrece GitHub más allá de Git?](#qué-ofrece-github-más-allá-de-git)
  - [Issues: seguimiento de tareas y bugs](#issues-seguimiento-de-tareas-y-bugs)
  - [Pull Requests: revisión de código antes de fusionar](#pull-requests-revisión-de-código-antes-de-fusionar)
  - [Wikis, Projects y Actions](#wikis-projects-y-actions)
    - [Wikis](#wikis)
    - [Projects](#projects)
    - [GitHub Actions: CI/CD nativo](#github-actions-cicd-nativo)
  - [Quédate con...](#quédate-con)

</div>

# ¿Qué ofrece GitHub más allá de Git?

Git es una herramienta de control de versiones distribuida que opera localmente en tu máquina. GitHub es una plataforma de alojamiento y colaboración que construye servicios adicionales sobre la infraestructura de Git. Esta distinción es fundamental: puedes usar Git sin GitHub (con repositorios locales o servidores propios), pero no puedes usar GitHub sin Git. GitHub transforma el control de versiones de una utilidad técnica en un ecosistema completo de gestión de proyectos, donde el código se convierte en el centro de flujos de trabajo que incluyen seguimiento de tareas, revisión de calidad, documentación colaborativa y automatización de procesos. Comprender qué capa corresponde a cada herramienta permite aprovechar ambas efectivamente.

## Issues: seguimiento de tareas y bugs

Los Issues son el sistema nativo de GitHub para gestionar trabajo pendiente: bugs reportados, funcionalidades solicitadas, tareas de mantenimiento o discusiones sobre el proyecto. Cada issue es un registro independiente con título, descripción, estado (abierto/cerrado), asignados, etiquetas y comentarios.

```
# Estructura típica de un Issue
Título: "Error al validar email con dominios personalizados"
Estado: Open
Asignado: @desarrollador-a
Labels: bug, priority-high, authentication
Comentarios: 5 participantes discutiendo la causa raíz
```

Los issues permiten:
*   **Centralizar reportes:** Usuarios y equipos reportan problemas en un lugar visible, no mediante correos o mensajes dispersos.
*   **Priorizar trabajo:** Etiquetas como `priority-high`, `good-first-issue` o `help-wanted` facilitan la triage y asignación.
*   **Vincular con código:** Los commits y pull requests pueden referenciar issues (`Fixes #123`), cerrándolos automáticamente al fusionarse.
*   **Documentar decisiones:** Los comentarios en issues capturan el razonamiento detrás de correcciones o rechazos de funcionalidades.

```markdown
# Ejemplo de plantilla de Issue (bug report)
**Descripción:** El formulario de login no acepta emails con dominios .io
**Pasos para reproducir:**
1. Ir a /login
2. Ingresar user@example.io
3. Click en "Iniciar sesión"
**Comportamiento esperado:** Login exitoso
**Comportamiento actual:** Error "Email inválido"
**Versión:** v2.3.1
```

> Los issues no son exclusivos de bugs. Equipos ágiles los usan como historias de usuario, tareas de sprint o epic tracking. GitHub Projects (tableros tipo Kanban) pueden organizarse alrededor de issues para gestión visual de flujo de trabajo.

## Pull Requests: revisión de código antes de fusionar

Los Pull Requests (PRs) son el mecanismo central de colaboración en GitHub. Un PR no es un commit ni un merge: es una solicitud formal para integrar cambios de una rama a otra, acompañada de revisión, discusión y validación antes de la fusión definitiva.

El flujo típico de un PR:

```bash
# 1. Crear rama local para tu cambio
$ git switch -c feature/nueva-funcionalidad

# 2. Trabajar y hacer commit
$ git add .
$ git commit -m "Añadir validación de email"

# 3. Publicar rama en GitHub
$ git push -u origin feature/nueva-funcionalidad

# 4. En GitHub: crear Pull Request desde la interfaz web
# Seleccionar rama base (main) y rama comparada (feature/nueva-funcionalidad)
```

Una vez creado, el PR habilita:

*   **Revisión de código:** Otros desarrolladores comentan líneas específicas, sugieren cambios y aprueban explícitamente antes del merge.
*   **Discusión contextual:** Conversaciones sobre el *porqué* del cambio, no solo el *qué*, quedan registradas junto al código.
*   **Validación automatizada:** GitHub Actions puede ejecutar tests, linting y builds en cada commit del PR, bloqueando merge si fallan.
*   **Historial auditado:** Queda registro de quién aprobó, cuándo se fusionó, y qué discusión precedió la decisión.

```
Estado de Pull Request:
- ✅ 2 approvals de revisores
- ✅ Todos los checks de CI pasaron (tests, lint, build)
- ✅ Sin conflictos de merge
- ⏳ Listo para fusionar
```

Las opciones de merge incluyen:
*   **Merge commit:** Preserva historial completo de la rama feature.
*   **Squash and merge:** Combina todos los commits de la rama en uno solo antes de fusionar.
*   **Rebase and merge:** Reescribe commits sobre la rama base para historial lineal.

> Los Pull Requests son una convención de GitHub, no una característica de Git. Git solo tiene `merge` y `rebase`. Los PRs añaden una capa de gobernanza: código que no puede fusionarse sin aprobación, validación automática y discusión documentada. GitLab y BitBucket tienen equivalentes llamados "Merge Requests".

## Wikis, Projects y Actions

GitHub extiende su utilidad más allá del código con herramientas complementarias que cubren documentación, planificación y automatización.

### Wikis

Cada repositorio puede tener una wiki integrada: un espacio de documentación colaborativa versionada, separada del código principal pero accesible desde la interfaz del repositorio.

*   **Uso típico:** Documentación de API, guías de contribución, procedimientos de despliegue, decisiones arquitectónicas (ADRs).
*   **Ventaja:** Editable desde la web sin necesidad de clonar repositorio, aunque también puede clonarse y editarse como repo git independiente.
*   **Limitación:** Menos estructurada que documentación en el repositorio principal (como `/docs` en Markdown), que viaja versionada con el código.

> Muchos proyectos modernos prefieren documentación en el repositorio principal (`/docs` o `README.md`) en lugar de wikis separadas, porque la documentación versionada con el código garantiza que docs y código estén sincronizados en cada tag/release.

### Projects

GitHub Projects son tableros de gestión de trabajo tipo Kanban o tablas personalizables que organizan issues y PRs en flujos visuales.

*   **Vistas disponibles:** Tablero (columnas como "To Do", "In Progress", "Done"), tabla (filas/columnas personalizadas), roadmap (timeline con fechas).
*   **Automatización:** Las tarjetas pueden moverse automáticamente entre columnas según estado de issues/PRs (ej. PR abierto → "In Review", PR mergeado → "Done").
*   **Integración:** Los items del proyecto son issues o PRs existentes, no entidades separadas, manteniendo trazabilidad completa.

```
Ejemplo de tablero Projects:
| Backlog | In Progress | In Review | Done |
|---------|-------------|-----------|------|
| #45     | #42, #48    | #40       | #38  |
| #46     |             | #41       | #39  |
```

### GitHub Actions: CI/CD nativo

GitHub Actions es el sistema de automatización integrado que permite definir flujos de trabajo (workflows) que se ejecutan en respuesta a eventos del repositorio: push, pull request, issue creado, release publicado, o incluso eventos externos vía webhooks.

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npm test
      - run: npm run lint
```

Casos de uso comunes:

| Tipo | Ejemplo | Trigger |
|------|---------|---------|
| **CI** | Ejecutar tests en cada PR | `pull_request` |
| **CD** | Desplegar a producción tras merge a `main` | `push` a `main` |
| **Automatización** | Etiquetar issues, asignar revisores | `issues.opened` |
| **Seguridad** | Escanear dependencias vulnerables | `push`, `schedule` |
| **Release** | Compilar binarios y publicar tag | `release.published` |

> GitHub Actions tiene un modelo de precios basado en minutos de ejecución para repositorios públicos (gratis ilimitado) y privados (minutos mensuales incluidos según plan). Para CI/CD intensivo, evaluar costos o considerar runners auto-alojados.

## Quédate con...

*   Git es la herramienta de control de versiones; GitHub es la plataforma que añade colaboración, gestión y automatización sobre Git.
*   Issues permiten seguimiento estructurado de tareas, bugs y mejoras, con etiquetas, asignación y vinculación automática a commits/PRs.
*   Pull Requests habilitan revisión de código formal antes de fusionar, con aprobaciones, comentarios por línea y validación automatizada.
*   Wikis ofrecen documentación colaborativa, aunque muchos proyectos prefieren docs versionados en el repositorio principal para sincronía con el código.
*   GitHub Projects organizan issues y PRs en tableros visuales (Kanban, tablas, roadmaps) con automatización de flujo según estados.
*   GitHub Actions permite CI/CD nativo: workflows definidos en YAML que se ejecutan ante eventos como push, PR, releases o schedules.
*   La combinación de Git (control de versiones) + GitHub (colaboración y automatización) crea un ecosistema completo para desarrollo moderno de software.


<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/github/pull_requests" class="next">Siguiente</a>
</div>
