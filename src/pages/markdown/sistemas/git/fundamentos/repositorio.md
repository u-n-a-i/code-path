---
title: "Primer repositorio"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Primer repositorio](#primer-repositorio)
  - [`git init`: crear un repositorio local](#git-init-crear-un-repositorio-local)
  - [`git status`: ver estado de los archivos](#git-status-ver-estado-de-los-archivos)
  - [Quédate con...](#quédate-con)

</div>

# Primer repositorio

Un proyecto de software comienza como un conjunto de archivos dispersos en un directorio, sin conexión entre sus versiones ni registro de su evolución. Transformar ese directorio en un repositorio Git no es una operación cosmética: es el acto fundacional que habilita el control de versiones, convirtiendo una carpeta cualquiera en un espacio donde cada modificación queda documentada, cada estado es recuperable y cada cambio puede atribuirse a un autor específico. Esta transformación requiere únicamente dos comandos, pero sus implicaciones extienden a todo el flujo de trabajo posterior.

## `git init`: crear un repositorio local

El comando `git init` inicializa un repositorio Git en el directorio actual. No mueve archivos, no copia contenido, no modifica el working directory: crea una estructura oculta que permite a Git comenzar a rastrear cambios.

```bash
$ mkdir mi-proyecto
$ cd mi-proyecto
$ git init
Initialized empty Git repository in /home/usuario/mi-proyecto/.git/
```

La ejecución crea un directorio oculto `.git` que contiene toda la metadata del repositorio: la base de datos de objetos, las referencias a ramas, la configuración local, los hooks y el índice (staging area). Este directorio es el repositorio completo: si se pierde o corrompe, el historial de versiones se pierde con él. Por esta razón, `.git` debe excluirse de copias de seguridad convencionales que puedan restaurar versiones inconsistentes, y nunca debe compartirse directamente sin usar los mecanismos apropiados de clonado remoto.

Un repositorio inicializado está vacío: no contiene commits, no tiene ramas definidas, no rastrea archivos. Los archivos existentes en el directorio permanecen en estado *untracked* hasta que se añaden explícitamente con `git add`. Esta separación entre inicialización y seguimiento permite preparar la estructura del proyecto antes de comenzar a registrar historial.

La inicialización puede ocurrir en cualquier directorio, pero la elección del punto de partida tiene consecuencias. Inicializar en la raíz del proyecto permite versionar toda la estructura; inicializar en un subdirectorio limita el alcance de Git a ese subárbol. Cambiar posteriormente el límite del repositorio requiere reestructuración compleja, por lo que conviene decidir conscientemente dónde se ejecuta `git init`.

> `git init` puede ejecutarse múltiples veces en el mismo directorio sin efectos adversos: si el repositorio ya existe, Git lo detecta y no sobrescribe la configuración existente. Sin embargo, inicializar un repositorio dentro de otro (anidamiento) crea conflictos de rastreo que complican la gestión. Verificar con `git status` antes de inicializar evita esta situación.

## `git status`: ver estado de los archivos

El comando `git status` consulta el repositorio y muestra el estado actual del working directory y del staging area. No modifica nada: es una operación de solo lectura que revela qué archivos están siendo rastreados, cuáles han cambiado, cuáles están preparados para commit y cuáles Git ignora completamente.

```bash
$ git status
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        README.md
        src/

nothing added to commit but untracked files present (use "git add" to track)
```

La salida se organiza en secciones que reflejan el ciclo de vida de los archivos. La sección *Untracked files* lista archivos nuevos que Git ha detectado pero no está monitoreando. La sección *Changes to be committed* (tras usar `git add`) muestra archivos preparados para el próximo commit. La sección *Changes not staged for commit* (tras modificar archivos rastreados) muestra modificaciones pendientes de staging.

Esta visibilidad es fundamental para el flujo de trabajo. Antes de cada commit, `git status` permite verificar qué cambios se incluirán, detectar archivos olvidados, identificar errores de staging y confirmar que el estado del repositorio coincide con la intención del desarrollador. Ejecutarlo frecuentemente —antes de añadir, antes de commitar, antes de cambiar de rama— previene errores que requieren corrección compleja posteriormente.

La salida también indica la rama actual (`On branch main`) y si el repositorio tiene commits previos (`No commits yet` o `Your branch is up to date`). Esta información contextual es crítica al trabajar con múltiples ramas o al sincronizar con repositorios remotos.

> `git status` puede ralentizarse en repositorios muy grandes con miles de archivos no rastreados. La opción `--untracked-files=no` suprime el listado de archivos no rastreados para mejorar rendimiento. Alternativamente, configurar un archivo `.gitignore` apropiado reduce la carga al excluir directorios completos del escaneo (como `node_modules/`, `__pycache__/`, o archivos compilados).

## Quédate con...

*   `git init` crea un repositorio local al añadir un directorio `.git` oculto que contiene toda la metadata de versionado; no modifica los archivos existentes del proyecto.
*   El directorio `.git` es el repositorio completo: su pérdida implica la pérdida del historial de versiones, por lo que debe protegerse y no compartirse directamente.
*   Un repositorio recién inicializado está vacío: no tiene commits, no tiene ramas con historial, y todos los archivos aparecen como *untracked*.
*   `git status` muestra el estado del working directory y staging area sin modificar nada; es una operación de solo lectura esencial antes de cada commit.
*   La salida de `git status` se organiza por estado: untracked (nuevos), staged (preparados), modified (modificados no preparados), permitiendo verificación previa al commit.
*   Ejecutar `git status` frecuentemente previene errores de staging y confirma que el estado del repositorio coincide con la intención del desarrollador antes de registrar cambios.



<div class="pagination">
  <a href="/markdown/sistemas/git/fundamentos/funcionamiento" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/fundamentos/ciclo" class="next">Siguiente</a>
</div>
