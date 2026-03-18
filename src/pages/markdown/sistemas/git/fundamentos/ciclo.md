---
title: "Ciclo básico de trabajo"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Ciclo básico de trabajo](#ciclo-básico-de-trabajo)
  - [`git add <archivo>`: preparar cambios](#git-add-archivo-preparar-cambios)
  - [`git commit -m "mensaje"`: registrar una instantánea](#git-commit--m-mensaje-registrar-una-instantánea)
  - [`git log`: ver el historial de commits](#git-log-ver-el-historial-de-commits)
  - [Quédate con...](#quédate-con)

</div>

# Ciclo básico de trabajo

El control de versiones no es un estado pasivo: requiere acción deliberada para capturar cambios, documentar intenciones y construir historial. Cada modificación en el directorio de trabajo existe en un limbo temporal hasta que se registra explícitamente en el repositorio. Este registro no es automático ni implícito: Git exige que el desarrollador seleccione qué cambios incluir, describa el propósito de la modificación y confirme la creación de un nuevo punto en el historial. Esta intervención consciente transforma el trabajo disperso en una narrativa coherente donde cada commit representa una decisión documentada, no un accidente de edición.

## `git add <archivo>`: preparar cambios

El comando `git add` mueve archivos modificados desde el working directory hacia el staging area, marcándolos para inclusión en el próximo commit. Esta operación no guarda cambios permanentemente: solo los prepara. Los archivos añadidos permanecen en estado *staged* hasta que se ejecuta `git commit` o se revierte la preparación con `git restore --staged`.

```bash
$ git add README.md
$ git add src/main.py src/utils.py
$ git add .
```

La sintaxis permite especificar archivos individuales, múltiples archivos separados por espacio, o directorios completos. El punto (`.`) añade todos los archivos modificados o nuevos en el directorio actual y subdirectorios, respetando las reglas de `.gitignore`. Esta selectividad es fundamental: permite construir commits atómicos que agrupan cambios temáticamente relacionados en lugar de snapshot de todo el trabajo pendiente.

Un archivo puede añadirse al staging múltiples veces antes del commit. Si se modifica después de `git add`, la versión staged no se actualiza automáticamente: requiere un nuevo `git add` para capturar las modificaciones adicionales. Esta característica permite preparar una versión específica para commit mientras se continúa editando el archivo para trabajo futuro.

`git status` muestra qué archivos están staged bajo la sección "Changes to be committed". Esta verificación previa al commit es esencial: confirma que solo los cambios intencionados se incluirán, detecta archivos olvidados y previene commits accidentales con contenido incompleto o sensible.

> El staging area es una capa de control que no existe en todos los sistemas de versionado. Sistemas como Subversion permiten commit directo desde el working directory. Git separa preparación de confirmación para permitir composición fina de commits, pero esta separación requiere disciplina: añadir frecuentemente y verificar con `git status` antes de commit.

## `git commit -m "mensaje"`: registrar una instantánea

El comando `git commit` crea un snapshot permanente del contenido staged, registrándolo en el historial del repositorio. Esta operación es el acto fundacional del versionado: transforma cambios preparados en un objeto inmutable con identificador único, metadatos de autoría y mensaje descriptivo.

```bash
$ git commit -m "Añadir validación de entrada en formulario de login"
```

La bandera `-m` permite especificar el mensaje de commit en línea. Sin esta bandera, Git abre el editor de texto configurado (por defecto `vim` o el definido en `core.editor`) para redactar mensajes multilínea. Los mensajes de commit no son notas personales: son documentación ejecutiva que explica el *porqué* del cambio, no solo el *qué*. Un mensaje efectivo describe el propósito, contexto y consecuencias de la modificación.

Cada commit genera un hash SHA-1 único (40 caracteres hexadecimales, típicamente abreviado a 7) que lo identifica permanentemente. Este hash se calcula sobre el contenido del tree, metadatos del commit y referencia al commit padre: cualquier alteración modificaría el hash, detectándose como inconsistencia. El commit incluye autor, email, timestamp, mensaje y referencia al tree que representa el estado completo del proyecto en ese momento.

Tras el commit, los archivos staged vuelven a estado *unmodified*: su versión en el working directory coincide con la versión en el último commit. El staging area se vacía, listo para preparar el siguiente conjunto de cambios. Esta transición de estado es inmediata y automática: no requiere acción adicional.

> Los commits son inmutables: una vez creados, no pueden modificarse. Comandos como `git commit --amend` no editan el commit original: crean un nuevo commit con contenido modificado y actualizan la referencia de rama para apuntar al nuevo, dejando el original accesible vía `git reflog` hasta garbage collection. Esta inmutabilidad preserva integridad del historial.

## `git log`: ver el historial de commits

El comando `git log` consulta el historial de commits y lo muestra en orden cronológico inverso (más reciente primero). Esta visualización permite navegar la trayectoria del proyecto, identificar cuándo se introdujeron cambios, quién los authored y bajo qué descripción.

```bash
$ git log
commit a1b2c3d4e5f6789012345678901234567890abcd (HEAD -> main)
Author: Tu Nombre <tu@email.com>
Date:   Lun Ene 15 10:23:45 2025 +0100

    Añadir validación de entrada en formulario de login

commit b2c3d4e5f67890123456789012345678901abcde
Author: Tu Nombre <tu@email.com>
Date:   Dom Ene 14 16:45:12 2025 +0100

    Corregir cálculo de total en carrito de compras
```

La salida predeterminada muestra hash completo, autor, fecha y mensaje completo. Para repositorios con historial extenso, esta información puede ser verbosa. Opciones de formato permiten adaptar la visualización: `--oneline` comprime cada commit a una línea con hash abreviado y mensaje; `--graph` dibuja la estructura de ramas visualmente; `--stat` añade resumen de archivos modificados por commit.

```bash
$ git log --oneline
a1b2c3d (HEAD -> main) Añadir validación de entrada en formulario de login
b2c3d4e Corregir cálculo de total en carrito de compras
c3d4e5f Implementar autenticación de usuarios
```

El historial no es solo registro: es herramienta de diagnóstico. Cuando un bug aparece, `git log` permite identificar qué commit introdujo el cambio problemático. Combinado con `git diff` o `git show`, se puede examinar exactamente qué líneas se modificaron. La capacidad de navegar historial transforma la depuración de "¿qué está mal?" a "¿cuándo se rompió y por qué?".

> `git log` muestra commits accesibles desde la rama actual. Commits en otras ramas no aparecen a menos que se especifiquen explícitamente (`git log feature-branch`). Commits "huérfanos" (sin referencia de rama) solo son accesibles vía `git reflog` hasta que garbage collection los elimina típicamente tras 30-90 días.

## Quédate con...

*   `git add` mueve cambios del working directory al staging area, preparando archivos para inclusión en el próximo commit sin guardarlos permanentemente.
*   El staging area permite composición selectiva de commits: añadir archivos específicos para agrupar cambios temáticamente relacionados en lugar de commitar todo el trabajo pendiente.
*   `git commit` crea un snapshot inmutable del contenido staged, registrándolo en el historial con hash único, metadatos de autoría y mensaje descriptivo.
*   Los mensajes de commit son documentación ejecutiva: deben explicar el propósito del cambio, no solo describir qué archivos se modificaron.
*   Tras el commit, los archivos vuelven a estado *unmodified* y el staging area se vacía, listo para preparar el siguiente conjunto de cambios.
*   `git log` muestra el historial de commits en orden cronológico inverso; opciones como `--oneline`, `--graph` y `--stat` adaptan la visualización según necesidades de navegación y diagnóstico.

<div class="pagination">
  <a href="/markdown/sistemas/git/fundamentos/repositorio" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/fundamentos/ignorar" class="next">Siguiente</a>
</div>
