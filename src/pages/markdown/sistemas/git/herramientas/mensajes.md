---
title: "Mensajes de commit efectivos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Mensajes de commit efectivos](#mensajes-de-commit-efectivos)
  - [Estructura: línea corta + cuerpo explicativo](#estructura-línea-corta--cuerpo-explicativo)
    - [Línea de asunto (Subject)](#línea-de-asunto-subject)
    - [Cuerpo explicativo (Body)](#cuerpo-explicativo-body)
  - [Convenciones: Conventional Commits](#convenciones-conventional-commits)
    - [Estructura del tipo](#estructura-del-tipo)
    - [Ámbito (Scope) opcional](#ámbito-scope-opcional)
    - [Pie de página (Footer)](#pie-de-página-footer)
  - [Uso de verbos en imperativo](#uso-de-verbos-en-imperativo)
  - [Ejemplos comparativos](#ejemplos-comparativos)
  - [Quédate con...](#quédate-con)

</div>

# Mensajes de commit efectivos

El historial de Git no es solo un registro de cambios técnicos: es la narrativa documental del proyecto. Cada commit representa una decisión, una corrección o una evolución en el código. Mensajes de commit vagos como "fix" o "update" convierten el historial en ruido inútil, dificultando la depuración, la revisión de código y la generación automática de changelogs. Un mensaje efectivo comunica el *propósito* del cambio, no solo el archivo modificado, permitiendo que cualquier desarrollador (incluido tu yo del futuro) comprenda el contexto sin necesidad de analizar el diff línea por línea. Esta disciplina transforma el control de versiones de un mecanismo de backup en una herramienta de comunicación técnica.

## Estructura: línea corta + cuerpo explicativo

Un commit bien formado sigue una estructura estándar que optimiza la legibilidad tanto en vistas resumidas (`git log --oneline`) como en vistas detalladas (`git show`). Esta estructura separa el resumen ejecutivo del contexto técnico.

```
<tipo>(<ámbito>): <asunto breve>

<cuerpo explicativo>

<pie de página opcional>
```

### Línea de asunto (Subject)

La primera línea es el resumen del cambio. Debe ser concisa y significativa.

*   **Longitud máxima:** 50 caracteres. Esto asegura que no se trunque en herramientas que muestran vistas compactas.
*   **Sin punto final:** No es una oración completa, es un título.
*   **Separación:** Debe haber una línea en blanco entre el asunto y el cuerpo. Git trata esta línea en blanco como el delimitador entre resumen y detalle.

```bash
# ❌ Mal: Demasiado largo, sin contexto
$ git commit -m "Arreglando el bug que había en el formulario de login porque no validaba bien el email"

# ✅ Bien: Conciso y directo
$ git commit -m "fix: validar formato de email en login"
```

### Cuerpo explicativo (Body)

El cuerpo proporciona el contexto necesario que el asunto no puede cubrir. Comienza después de la línea en blanco y se recomienda ajustar las líneas a 72 caracteres para facilitar la lectura en terminales y diffs.

*   **Qué y Por qué:** Explica *qué* cambió y *por qué* se hizo ese cambio, no solo *cómo* (el código ya muestra el cómo).
*   **Contexto:** Menciona problemas previos, decisiones de diseño o referencias a issues.
*   **Opcional pero recomendado:** Para cambios complejos, el cuerpo es esencial. Para correcciones triviales de typo, puede omitirse.

```bash
# Ejemplo con cuerpo
$ git commit -m "feat: añadir reintentos automáticos en API

El cliente fallaba silenciosamente cuando el servidor respondía 503.
Se implementa exponential backoff con máximo 3 intentos.

Fixes #123"
```

> La línea en blanco entre el asunto y el cuerpo es crítica. Sin ella, Git concatena todo como una sola línea larga, rompiendo la visualización en `git log` y herramientas de revisión.

## Convenciones: Conventional Commits

Conventional Commits es una especificación ligera que estandariza la estructura del mensaje para facilitar la automatización. Al seguir un formato predecible, herramientas externas pueden generar changelogs automáticos, determinar versiones semánticas (SemVer) y notificar cambios relevantes.

### Estructura del tipo

El mensaje comienza con un tipo que categoriza el cambio:

| Tipo | Descripción | Impacto en Versión |
|------|-------------|-------------------|
| `feat` | Nueva funcionalidad | Minor (1.1.0) |
| `fix` | Corrección de bug | Patch (1.0.1) |
| `docs` | Solo cambios en documentación | None |
| `style` | Formato, punto y coma, espacios (sin lógica) | None |
| `refactor` | Cambio de código que no arregla bug ni añade feature | None |
| `test` | Añadir o corregir tests | None |
| `chore` | Cambios en build, herramientas, libs (no src) | None |

```bash
# Ejemplos por tipo
feat(auth): implementar login con OAuth2
fix(api): corregir timeout en endpoint /users
docs(readme): actualizar instrucciones de instalación
refactor(db): optimizar consulta de usuarios activos
```

### Ámbito (Scope) opcional

El ámbito indica la sección del código afectada, entre paréntesis después del tipo. Ayuda a identificar rápidamente qué módulo toca el commit.

```bash
feat(api): ...
feat(ui): ...
feat(db): ...
```

### Pie de página (Footer)

El pie de página contiene metadatos adicionales, típicamente referencias a issues o notas de cambios importantes (BREAKING CHANGE).

```bash
# Referencia a issue
Fixes #456
Closes #789

# Cambio disruptivo
BREAKING CHANGE: la API de autenticación ahora requiere token JWT
```

## Uso de verbos en imperativo

Una regla fundamental de Git es escribir el asunto en **modo imperativo presente**. El mensaje debe leerse como una orden que se le da al código base.

*   **Correcto:** "Add feature", "Fix bug", "Refactor module"
*   **Incorrecto:** "Added feature", "Fixed bug", "Refactoring module"

Esta convención existe porque Git genera mensajes automáticos basados en tu commit. Por ejemplo, `git merge` crea un commit con el mensaje "Merge branch 'feature'". Si tu commit dice "Added feature", el historial leería "Merge branch 'feature' Added feature", lo cual es gramaticalmente inconsistente. En imperativo, lee: "Merge branch 'feature' Add feature", que tiene sentido como instrucción.

```bash
# ❌ Mal: Pasado o gerundio
$ git commit -m "Fixed validation error"
$ git commit -m "Fixing validation error"

# ✅ Bien: Imperativo
$ git commit -m "Fix validation error"
```

> Piensa en el commit como un comando: "Si se aplica este commit, debe [verbo en imperativo]". Ejemplo: "If applied, this commit will **fix validation error**".

## Ejemplos comparativos

La diferencia entre un mensaje útil y uno descartable radica en la capacidad de entender el cambio meses después sin ver el código.

| Escenario | Mensaje Débil | Mensaje Efectivo |
|-----------|--------------|------------------|
| **Corrección de bug** | "fix bug" | "fix: prevenir crash en carrito vacío" |
| **Nueva feature** | "add login" | "feat(auth): implementar login con JWT" |
| **Refactorización** | "change code" | "refactor: simplificar lógica de validación de email" |
| **Documentación** | "update readme" | "docs: añadir ejemplos de uso en README" |
| **Sin contexto** | "wip" | "feat: trabajar en estructura de base de datos (incompleto)" |

> Evita mensajes como "WIP" (Work In Progress) en la rama principal. Si el trabajo está incompleto, no hagas commit a `main`. Usa ramas temporales para trabajo en progreso y solo mergea commits completos y significativos.

## Quédate con...

*   Un mensaje de commit efectivo tiene una línea de asunto breve (≤50 chars), una línea en blanco, y un cuerpo explicativo (≤72 chars por línea).
*   Usa el modo imperativo ("Add", "Fix") en lugar de pasado ("Added", "Fixed") para mantener consistencia con los mensajes automáticos de Git.
*   Conventional Commits (`feat`, `fix`, `docs`, etc.) estandariza los mensajes para permitir automatización de changelogs y versionado semántico.
*   El cuerpo del commit debe explicar el *porqué* del cambio, no solo el *qué*, ya que el código muestra la implementación técnica.
*   La línea en blanco entre asunto y cuerpo es obligatoria para que Git separe correctamente el resumen del detalle en herramientas de visualización.
*   Referencia issues en el pie de página (`Fixes #123`) para cerrar tickets automáticamente y vincular código con requisitos.
*   Evita commits genéricos ("fix", "update"): un mensaje claro reduce el tiempo de diagnóstico y revisión de código en el futuro.

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/herramientas/graficas" class="next">Siguiente</a>
</div>
