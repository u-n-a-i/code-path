---
title: "Plantillas y estándares"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Plantillas y estándares](#plantillas-y-estándares)
  - [README.md: la puerta de entrada del proyecto](#readmemd-la-puerta-de-entrada-del-proyecto)
    - [Estructura recomendada](#estructura-recomendada)
  - [Uso rápido](#uso-rápido)
  - [Documentación](#documentación)
  - [Contribuir](#contribuir)
  - [Licencia](#licencia)
  - [Contacto](#contacto)
    - [Beneficios de CONTRIBUTING.md](#beneficios-de-contributingmd)
  - [Carpeta `.github/`: plantillas y automatización](#carpeta-github-plantillas-y-automatización)
    - [Estructura típica](#estructura-típica)
    - [Plantillas de Issues](#plantillas-de-issues)
    - [Plantilla de Pull Requests](#plantilla-de-pull-requests)
    - [Otros archivos útiles en `.github/`](#otros-archivos-útiles-en-github)
  - [Beneficios de estandarizar con plantillas](#beneficios-de-estandarizar-con-plantillas)
  - [Quédate con...](#quédate-con)

</div>

# Plantillas y estándares

Los repositorios profesionales no son solo colecciones de código: son proyectos documentados que comunican propósito, guían a nuevos colaboradores y establecen expectativas claras sobre cómo participar. Los archivos de documentación estándar y las plantillas automatizadas transforman un repositorio de un almacén de código en un proyecto acogedor y organizado. Estos estándares reducen la carga de mantenimiento, mejoran la calidad de las contribuciones y hacen que el proyecto sea accesible tanto para usuarios como para colaboradores potenciales.

## README.md: la puerta de entrada del proyecto

El `README.md` es el primer archivo que cualquier persona ve al visitar un repositorio. GitHub lo renderiza automáticamente en la página principal, convirtiéndolo en la cara visible del proyecto. Un README efectivo responde preguntas fundamentales antes de que el visitante tenga que buscar elsewhere.

### Estructura recomendada

```markdown
# Nombre del Proyecto

Breve descripción de una o dos líneas que explica qué hace el proyecto y por qué existe.

## Características

- ✨ Característica principal 1
- 🚀 Característica principal 2
- 🔒 Característica principal 3

## Instalación

```bash
npm install mi-proyecto
# o
pip install mi-proyecto
```

## Uso rápido

```python
from mi_proyecto import funcion_principal

resultado = funcion_principal(parametro)
```

## Documentación

Ver [docs/](docs/) para documentación completa.

## Contribuir

Lee [CONTRIBUTING.md](CONTRIBUTING.md) antes de enviar PRs.

## Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

## Contacto

- Issues: [GitHub Issues](https://github.com/usuario/proyecto/issues)
- Email: maintainer@ejemplo.com
```

### Secciones esenciales

| Sección | Propósito | Cuándo incluir |
|---------|-----------|----------------|
| **Descripción** | Qué es el proyecto y qué problema resuelve | Siempre |
| **Instalación** | Cómo configurar el proyecto localmente | Siempre |
| **Uso** | Ejemplos mínimos de cómo usar el código | Siempre |
| **Documentación** | Enlace a docs más detalladas | Proyectos medianos/grandes |
| **Contribuir** | Enlace a CONTRIBUTING.md | Proyectos que aceptan contribuciones |
| **Licencia** | Términos de uso del código | Siempre (evita ambigüedad legal) |
| **Estado** | Badges de CI, versión, cobertura | Proyectos activos |

> GitHub soporta badges (insignias) que muestran estado del proyecto: ![Build Status](https://img.shields.io/badge/build-passing-green), ![Version](https://img.shields.io/npm/v/package), ![License](https://img.shields.io/badge/license-MIT-blue). Estos se generan mediante servicios como Shields.io y proporcionan información visual inmediata.

## CONTRIBUTING.md: guía para colaboradores

El archivo `CONTRIBUTING.md` establece las reglas del juego para quienes quieren contribuir al proyecto. Sin esta guía, los colaboradores potenciales adivinan cómo trabajar, enviando PRs que no siguen estándares, abren issues incompletos, o duplican trabajo existente.

### Contenido típico

```markdown
# Guía de Contribución

¡Gracias por tu interés en contribuir! Este documento explica cómo participar.

## Primeros pasos

1. Haz fork del repositorio
2. Clona tu fork localmente
3. Crea una rama: `git switch -c feature/tu-cambio`
4. Sigue las normas de código del proyecto

## Cómo reportar bugs

Antes de abrir un issue:
- [ ] Verifica que no exista un issue similar
- [ ] Prueba con la última versión del proyecto
- [ ] Reúne información: versión, SO, pasos para reproducir

Al abrir el issue, incluye:
- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs. actual
- Capturas de pantalla si aplica

## Cómo proponer funcionalidades

1. Abre un issue describiendo la funcionalidad
2. Espera feedback de los mantenedores
3. Si se aprueba, crea un PR siguiendo esta guía

## Estándares de código

- Sigue el estilo existente (ver `.editorconfig`)
- Ejecuta tests antes de commit: `npm test`
- Ejecuta linter: `npm run lint`
- Commits con mensajes descriptivos

## Proceso de Pull Request

1. Crea PR desde tu fork
2. Completa la plantilla de PR
3. Espera revisión (puede tardar varios días)
4. Atiende comentarios de los revisores
5. Tras aprobación, un maintainer hará merge

## Código de conducta

Este proyecto sigue un [Código de Conducta](CODE_OF_CONDUCT.md).
Por favor, sé respetuoso con todos los participantes.
```

### Beneficios de CONTRIBUTING.md

*   **Reduce PRs rechazados:** Los colaboradores saben qué se espera antes de codificar
*   **Ahorra tiempo de mantenedores:** Menos preguntas repetitivas sobre procesos básicos
*   **Mejora calidad de contribuciones:** Estándares claros producen código más consistente
*   **Incluye nuevos colaboradores:** Reduce la barrera de entrada para principiantes

> GitHub detecta automáticamente `CONTRIBUTING.md` y muestra un enlace a él cuando alguien abre un nuevo issue o PR. Esta visibilidad aumenta la probabilidad de que los colaboradores lean las guías antes de participar.

## Carpeta `.github/`: plantillas y automatización

La carpeta oculta `.github/` en la raíz del repositorio alberga configuraciones especiales que GitHub usa para personalizar el comportamiento de issues, PRs, acciones automatizadas y más. Esta carpeta no es requerida, pero su presencia transforma la experiencia de colaboración.

### Estructura típica

```
.github/
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   ├── feature_request.md
│   └── config.yml
├── PULL_REQUEST_TEMPLATE.md
├── workflows/
│   └── ci.yml
├── FUNDING.yml
└── CODEOWNERS
```

### Plantillas de Issues

La carpeta `.github/ISSUE_TEMPLATE/` permite definir múltiples tipos de issues con formularios estructurados. Cuando un usuario crea un nuevo issue, GitHub le ofrece elegir entre las plantillas disponibles.

**Ejemplo: `.github/ISSUE_TEMPLATE/bug_report.md`**

```markdown
---
name: Reporte de Bug
description: Reporta un error para ayudarnos a mejorar
title: "[BUG]: "
labels: ["bug"]
assignees: []
---

## Descripción del problema
<!-- Describe claramente qué está fallando -->

## Pasos para reproducir
<!-- 1. Ir a '...' -->
<!-- 2. Click en '....' -->
<!-- 3. Ver error -->

## Comportamiento esperado
<!-- Qué debería haber ocurrido -->

## Comportamiento actual
<!-- Qué ocurrió realmente -->

## Capturas de pantalla
<!-- Si aplica, añade imágenes del problema -->

## Entorno
- OS: [ej. Windows 10, macOS 12, Ubuntu 22.04]
- Versión del proyecto: [ej. v1.2.3]
- Navegador/Runtime: [ej. Chrome 120, Node 18]

## Información adicional
<!-- Cualquier otro contexto relevante -->
```

**Ejemplo: `.github/ISSUE_TEMPLATE/feature_request.md`**

```markdown
---
name: Solicitud de Funcionalidad
description: Propón una idea para este proyecto
title: "[FEATURE]: "
labels: ["enhancement"]
---

## Problema relacionado
<!-- ¿Tu solicitud está relacionada con un problema? Describe cuál -->

## Solución propuesta
<!-- Describe qué te gustaría que ocurriera -->

## Alternativas consideradas
<!-- Describe alternativas o soluciones que has considerado -->

## Contexto adicional
<!-- Cualquier otro contexto, mockups, o ejemplos relevantes -->
```

**Archivo de configuración: `.github/ISSUE_TEMPLATE/config.yml`**

```yaml
blank_issues_enabled: true
contact_links:
  - name: Documentación
    url: https://proyecto.github.io/docs
    about: Encuentra respuestas en nuestra documentación
  - name: Discusiones
    url: https://github.com/usuario/proyecto/discussions
    about: Haz preguntas en GitHub Discussions
```

> Los campos entre `---` al inicio son *front matter* en formato YAML. GitHub los usa para configurar metadata del issue (título por defecto, labels, asignados). El contenido después es el cuerpo de la plantilla que se pre-llena en el editor.

### Plantilla de Pull Requests

El archivo `.github/PULL_REQUEST_TEMPLATE.md` se pre-llena automáticamente en la descripción de cada nuevo PR.

```markdown
## Descripción
<!-- Describe tus cambios y el motivo detrás de ellos -->

## Tipo de cambio
<!-- Marca con x las opciones aplicables -->
- [ ] Bug fix (cambio no disruptivo que corrige un issue)
- [ ] Nueva funcionalidad (cambio no disruptivo que añade capacidad)
- [ ] Breaking change (arreglar o feature que causaría cambio disruptivo)
- [ ] Documentación actualizada

## Checklist
<!-- Marca con x las opciones completadas -->
- [ ] Mi código sigue el estilo del proyecto
- [ ] He comentado mi código, particularmente en áreas complejas
- [ ] He hecho auto-review de mi código
- [ ] He actualizado la documentación según corresponda
- [ ] He añadido tests que prueban mi corrección/feature
- [ ] Todos los tests pasan localmente

## Issues relacionados
<!-- Usa "Fixes #123" para cerrar issues automáticamente al merge -->
Fixes #

## Capturas de pantalla (si aplica)
<!-- Para cambios UI, muestra antes/después -->

## Información adicional
<!-- Cualquier otro contexto que los revisores deban conocer -->
```

### Otros archivos útiles en `.github/`

| Archivo | Propósito | Ejemplo de uso |
|---------|-----------|----------------|
| **`workflows/`** | Definir GitHub Actions para CI/CD | Tests automáticos en cada PR |
| **`CODEOWNERS`** | Definir quién debe revisar cambios por ruta | `src/ @equipo-backend` |
| **`FUNDING.yml`** | Configurar opciones de sponsoring | GitHub Sponsors, Patreon, OpenCollective |
| **`SECURITY.md`** | Política de reporte de vulnerabilidades | Cómo reportar bugs de seguridad responsablemente |
| **`SUPPORT.md`** | Dónde obtener ayuda | Enlaces a docs, issues, Discord, email |
| **`dependabot.yml`** | Configurar actualizaciones automáticas de dependencias | Actualizar npm/pip packages semanalmente |

**Ejemplo: `.github/CODEOWNERS`**

```
# Dueños por defecto para todo el repo
* @maintainer-principal

# Equipo específico para directorios
/docs/ @equipo-documentacion
/src/api/ @equipo-backend
/src/frontend/ @equipo-frontend
*.sql @equipo-database
```

Cuando se abre un PR que modifica archivos en `/src/api/`, GitHub automáticamente solicita review al `@equipo-backend`.

> `SECURITY.md` es crítico para proyectos que manejan datos sensibles o tienen usuarios en producción. Define un canal privado para reportar vulnerabilidades antes de disclosure público, permitiendo tiempo para parchear antes de que el exploit sea conocido.

## Beneficios de estandarizar con plantillas

| Beneficio | Impacto |
|-----------|---------|
| **Consistencia** | Todos los issues/PRs siguen la misma estructura, facilitando revisión |
| **Completitud** | Plantillas guían a usuarios a incluir información necesaria desde el inicio |
| **Automatización** | Labels y asignaciones automáticas reducen trabajo manual de triage |
| **Accesibilidad** | Nuevos colaboradores saben exactamente cómo participar sin adivinar |
| **Calidad** | PRs mejor documentados se revisan más rápido y con menos iteraciones |
| **Escalabilidad** | Proyectos grandes pueden manejar más contribuciones sin colapsar mantenedores |

> No sobrecargues las plantillas. Demasiados campos requeridos desincentivan la contribución. Equilibra entre información útil y barrera de entrada. Para proyectos pequeños, un README claro puede ser suficiente; para proyectos con comunidad activa, las plantillas valen la inversión.

## Quédate con...

*   `README.md` es la primera impresión del proyecto: debe explicar qué es, cómo instalar, cómo usar y cómo contribuir en los primeros segundos de visita.
*   `CONTRIBUTING.md` establece reglas claras para colaboradores, reduciendo PRs rechazados y preguntas repetitivas a mantenedores.
*   `.github/ISSUE_TEMPLATE/` permite múltiples tipos de issues con formularios estructurados que guían a usuarios a reportar bugs o features correctamente.
*   `.github/PULL_REQUEST_TEMPLATE.md` se pre-llena en cada PR, asegurando que los contribuidores incluyan descripción, checklist y referencias a issues.
*   `.github/CODEOWNERS` asigna automáticamente revisores según archivos modificados, acelerando el proceso de review.
*   `.github/SECURITY.md` define canal privado para reportar vulnerabilidades, esencial para proyectos en producción con usuarios.
*   Las plantillas equilibran consistencia y accesibilidad: suficiente estructura para calidad, suficiente flexibilidad para no desincentivar contribución.

<div class="pagination">
  <a href="/markdown/sistemas/git/github/contribuir" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/github/markdown" class="next">Siguiente</a>
</div>
