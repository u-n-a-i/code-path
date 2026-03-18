---
title: "Trabajo con ramas"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Trabajo con ramas](#trabajo-con-ramas)
  - [`git branch`: listar y gestionar ramas](#git-branch-listar-y-gestionar-ramas)
  - [Crear e ir a una rama: `git checkout -b` vs `git switch -c`](#crear-e-ir-a-una-rama-git-checkout--b-vs-git-switch--c)
  - [`git merge`: integrar cambios de una rama en otra](#git-merge-integrar-cambios-de-una-rama-en-otra)
  - [Cómo unir ramas: Fast-forward vs. 3-way merge](#cómo-unir-ramas-fast-forward-vs-3-way-merge)
    - [Fast-forward merge](#fast-forward-merge)
    - [3-way merge](#3-way-merge)
  - [Quédate con...](#quédate-con)

</div>

# Trabajo con ramas

Las ramas no son solo líneas de desarrollo aisladas: son contextos de trabajo que requieren navegación, creación y fusión deliberada. Dominar los comandos que manipulan ramas transforma el repositorio de un almacén estático en un entorno dinámico donde múltiples versiones coexisten, experimentan y convergen. Cada operación —listar, crear, cambiar, fusionar— modifica punteros internos que definen qué commit representa el estado actual del proyecto. Comprender estos mecanismos permite trabajar con confianza, sabiendo exactamente dónde se está, hacia dónde se va y cómo se integran los cambios sin perder historial ni introducir inconsistencias.

## `git branch`: listar y gestionar ramas

El comando `git branch` sin argumentos muestra todas las ramas locales existentes en el repositorio, indicando cuál está activa actualmente mediante un asterisco (`*`). Esta lista no es solo inventario: revela la estructura de desarrollo del proyecto, qué funcionalidades están en progreso, qué líneas de trabajo están abandonadas y cuál es el punto de referencia actual.

```bash
$ git branch
  feature-autenticacion
* main
  fix-error-login
```

La rama marcada con `*` es la rama actual: los nuevos commits se añadirán a esta línea, y los archivos del directorio de trabajo reflejan el estado de esta rama. Las ramas listadas sin asterisco existen en el repositorio pero no están activas: sus commits son accesibles pero no afectan el working directory hasta que se cambie a ellas.

El comando acepta opciones para gestión adicional. `git branch -d <rama>` elimina una rama local que ya fue fusionada, limpiando el espacio de nombres. `git branch -D <rama>` fuerza la eliminación incluso si hay cambios no fusionados (peligroso, puede perder trabajo). `git branch -a` incluye ramas remotas trackeadas, mostrando la sincronización con el repositorio central.

> Eliminar una rama no elimina sus commits inmediatamente. Los commits permanecen accesibles vía `git reflog` hasta que la recolección de basura los elimine. Sin embargo, tratar `git branch -D` como reversible es riesgoso: la recuperación requiere conocimiento avanzado de hashes y reflog.

## Crear e ir a una rama: `git checkout -b` vs `git switch -c`

Crear una rama y cambiar a ella son dos operaciones distintas que frecuentemente se ejecutan juntas. Git ofrece dos enfoques: el comando histórico `git checkout` y el comando moderno `git switch`, introducido en Git 2.23 para separar responsabilidades y reducir ambigüedad.

La forma tradicional usa `git checkout -b <nombre>`:

```bash
$ git checkout -b feature-nueva
Switched to a new branch 'feature-nueva'
```

El flag `-b` crea la rama basada en el commit actual (HEAD) y cambia el working directory a esa rama inmediatamente. Es conciso pero sobrecargado: `git checkout` también sirve para restaurar archivos, crear ramas, cambiar de ramas, y más, lo que puede generar confusión.

La forma moderna separa las preocupaciones con `git switch -c <nombre>`:

```bash
$ git switch -c feature-nueva
Switched to a new branch 'feature-nueva'
```

El flag `-c` (create) es equivalente a `-b` de checkout. La ventaja de `git switch` es la claridad semántica: solo sirve para cambiar de rama, no para restaurar archivos. Esto reduce errores accidentales y hace los scripts más legibles. Ambos comandos actualizan el directorio de trabajo para reflejar el estado del commit al que apunta la nueva rama.

> `git switch` no puede usarse para checkout de archivos individuales ni para entrar en estado "detached HEAD" sin flags adicionales. Para esos casos, `git checkout` sigue siendo necesario. En flujos modernos, preferir `git switch` para navegación de ramas y `git restore` para descarte de cambios.

## `git merge`: integrar cambios de una rama en otra

El comando `git merge` fusiona el historial de una rama en la rama actual. No copia archivos manualmente: integra commits, preservando la trayectoria de desarrollo de ambas líneas. La operación requiere estar en la rama destino (típicamente `main` o `develop`) y especificar la rama fuente como argumento.

```bash
# Estar en la rama destino
$ git switch main

# Fusionar la rama fuente
$ git merge feature-nueva
```

Git identifica el ancestro común entre las dos ramas (el commit desde el cual divergieron) y calcula las diferencias. Si no hay conflictos —modificaciones incompatibles en las mismas líneas—, la fusión es automática. Si hay conflictos, Git pausa el proceso, marca los archivos conflictivos en el working directory, y requiere resolución manual antes de completar el merge con un commit final.

El merge crea un nuevo commit (excepto en fast-forward) con dos padres: el último commit de la rama destino y el último commit de la rama fuente. Esta estructura de múltiples padres es visible en `git log --graph` y documenta explícitamente cuándo y cómo se integraron las líneas de desarrollo.

> Antes de hacer merge, verificar que la rama destino esté actualizada con el remoto (`git pull`). Fusionar sobre una base desactualizada aumenta la probabilidad de conflictos. Algunos flujos de trabajo requieren rebase previo (`git rebase main`) para linearizar el historial antes del merge, aunque esto reescribe historial y requiere precaución en ramas compartidas.

## Cómo unir ramas: Fast-forward vs. 3-way merge

Git emplea dos estrategias de fusión según la topología del historial. Comprender la diferencia es esencial para interpretar el resultado visual en `git log` y para decidir cuándo forzar una estrategia u otra.

### Fast-forward merge

Ocurre cuando la rama destino no ha avanzado desde el punto de divergencia. Es decir, todos los commits de la rama fuente son descendientes directos del último commit de la rama destino. En este caso, Git no crea un commit de fusión: simplemente mueve el puntero de la rama destino hacia adelante hasta alcanzar el último commit de la fuente.

```
Antes del merge:
main: A --- B
feature:      \
               C --- D

Después del merge (fast-forward):
main: A --- B --- C --- D
feature:                  ^
```

El historial resultante es lineal, como si los commits de la rama feature se hubieran hecho directamente sobre main. Esto mantiene el historial limpio pero oculta la información de que existió una rama temporal. Se puede desactivar con `git merge --no-ff` para forzar un commit de fusión incluso cuando fast-forward es posible, preservando la evidencia estructural del trabajo en rama.

### 3-way merge

Ocurre cuando ambas ramas han avanzado independientemente desde el punto de divergencia. Git debe combinar cambios de ambas líneas, lo que requiere crear un nuevo commit de fusión con dos padres.

```
Antes del merge:
main: A --- B --- E
feature:      \
               C --- D

Después del merge (3-way):
main: A --- B --- E --- F (merge commit)
feature:      \       /
               C --- D
```

El commit `F` es el merge commit: no introduce cambios de código propios (típicamente), pero registra la integración. El historial muestra explícitamente la bifurcación y convergencia, preservando el contexto de qué trabajo se desarrolló en paralelo. Esta estrategia es preferida en flujos colaborativos donde la trazabilidad de ramas temporales es importante para auditoría o reversión selectiva.

> Los conflictos de merge ocurren exclusivamente en 3-way merges donde ambas ramas modificaron las mismas líneas de código de forma incompatible. Fast-forward nunca genera conflictos porque no hay divergencia real: la rama destino simplemente avanza sobre la fuente.

## Quédate con...

*   `git branch` lista ramas locales indicando la activa con `*`; opciones como `-d` eliminan ramas fusionadas, `-D` fuerza eliminación sin fusionar.
*   `git checkout -b` y `git switch -c` crean y cambian a una nueva rama simultáneamente; `switch` es moderno y semánticamente más claro para navegación.
*   `git merge` integra commits de una rama fuente en la rama actual, requiriendo resolución manual si hay conflictos en las mismas líneas de código.
*   Fast-forward mueve el puntero de rama sin crear commit de fusión, resultando en historial lineal; ocurre cuando la rama destino no ha avanzado desde la divergencia.
*   3-way merge crea un commit de fusión con dos padres, preservando la evidencia estructural de trabajo paralelo; ocurre cuando ambas ramas tienen commits nuevos.
*   Forzar `--no-ff` en merges fast-forward preserva la historia de ramas temporales, útil para auditoría y reversión de funcionalidades completas como unidad.

<div class="pagination">
  <a href="/markdown/sistemas/git/ramas/intro" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/ramas/estrategia" class="next">Siguiente</a>
</div>
