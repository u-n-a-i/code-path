---
title: "Visualización y comparación"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Visualización y comparación](#visualización-y-comparación)
  - [Git diff: ver cambios no preparados](#git-diff-ver-cambios-no-preparados)
  - [Git diff --staged: ver cambios preparados](#git-diff---staged-ver-cambios-preparados)
  - [Interpretación de la salida](#interpretación-de-la-salida)
  - [Quédate con...](#quédate-con)

</div>

# Visualización y comparación

La certeza sobre el estado del código no proviene de confiar en la memoria de las ediciones recientes, sino de inspeccionar las diferencias exactas entre versiones. Antes de consolidar un cambio en el historial, es fundamental auditar qué líneas se han añadido, modificado o eliminado. Esta revisión preventiva evita commits accidentales con código de depuración, credenciales expuestas o lógica incompleta. La herramienta que permite esta inspección quirúrgica compara el estado actual de los archivos contra las instantáneas guardadas, revelando la delta precisa que define el trabajo pendiente.

## Git diff: ver cambios no preparados

El comando `git diff` sin argumentos compara el directorio de trabajo con el área de preparación (staging area). Muestra las modificaciones que existen en los archivos locales pero que aún no se han añadido con `git add`. Esta salida representa el trabajo que se perdería si se descartaran los cambios ahora mismo, o el trabajo que está pendiente de ser staged para el próximo commit.

La utilidad de esta vista radica en la validación antes de la preparación. Permite identificar archivos modificados por error, cambios experimentales que no deben formar parte del commit principal, o errores de sintaxis introducidos durante la edición. Al ejecutar `git diff`, Git muestra únicamente los archivos rastreados que tienen diferencias; los archivos no rastreados (untracked) no aparecen aquí, ya que no hay una versión anterior en el repositorio contra la cual comparar.

```bash
$ git diff
diff --git a/src/main.py b/src/main.py
index 1234abc..5678def 100644
--- a/src/main.py
+++ b/src/main.py
@@ -10,7 +10,7 @@ def calcular_total(precio, cantidad):
-    return precio * cantidad
+    return precio * cantidad * 1.21  # Añadir IVA
```

Esta comparación es dinámica: a medida que se editan los archivos, la salida de `git diff` cambia para reflejar el estado actual del directorio de trabajo. Si se ejecuta `git add` sobre un archivo modificado, ese archivo desaparece de la salida de `git diff` simple, porque sus cambios ya han pasado al staging area. Esta transición visual confirma que el archivo ha sido preparado correctamente.

## Git diff --staged: ver cambios preparados

Una vez que los cambios se han añadido al staging area, `git diff` simple deja de mostrarlos. Para revisar qué se incluirá exactamente en el próximo commit, se utiliza `git diff --staged` (o su alias `git diff --cached`). Este comando compara el área de preparación contra el último commit (HEAD), mostrando la diferencia que se convertirá en historial permanente al ejecutar `git commit`.

Esta verificación es el último control de calidad antes de hacer el cambio inmutable. Permite confirmar que solo los archivos intencionados están staged, que no se ha incluido accidentalmente código sensible o archivos de log, y que el mensaje de commit planned corresponderá realmente al contenido mostrado. Es una práctica recomendada ejecutar este comando antes de cada commit para asegurar la atomicidad y coherencia del historial.

```bash
$ git diff --staged
diff --git a/src/main.py b/src/main.py
index 1234abc..5678def 100644
--- a/src/main.py
+++ b/src/main.py
@@ -10,7 +10,7 @@ def calcular_total(precio, cantidad):
-    return precio * cantidad
+    return precio * cantidad * 1.21  # Añadir IVA
```

La distinción entre `git diff` y `git diff --staged` es crucial para entender el flujo de tres estados de Git. El primero muestra la diferencia entre *working directory* y *staging area*; el segundo muestra la diferencia entre *staging area* y *repository* (HEAD). Si un archivo se modifica después de haber hecho `git add`, aparecerá en ambos comandos: en `--staged` la versión que se añadió, y en el diff simple los cambios adicionales aún no preparados.

## Interpretación de la salida

El formato de salida se denomina *unified diff* (diff unificado). Cada bloque de cambio comienza con una cabecera que indica los nombres de los archivos y los hashes de los objetos involucrados. Las líneas de contexto muestran el entorno del cambio, precedidas por un espacio. Las líneas eliminadas comienzan con un signo menos (`-`) y color rojo típico; las líneas añadidas comienzan con un signo más (`+`) y color verde.

Los encabezados de hunk (`@@ -10,7 +10,7 @@`) indican las líneas afectadas. El primer grupo (`-10,7`) se refiere al archivo original (comienza en línea 10, longitud 7 líneas); el segundo grupo (`+10,7`) se refiere al nuevo archivo. Esta información permite localizar el cambio rápidamente en el editor de código. La capacidad de leer e interpretar este formato es esencial para revisar contribuciones ajenas en proyectos colaborativos o para entender cambios complejos sin abrir cada archivo individualmente.

> Por defecto, `git diff` muestra todos los cambios entre working directory y HEAD si no hay nada en el staging area. Si hay cambios staged, `git diff` muestra solo los no staged. Para ver absolutamente todas las diferencias (staged y no staged) respecto al último commit, se usa `git diff HEAD`. La configuración `color.diff = always` en Git asegura que los signos `+` y `-` se muestren coloreados incluso cuando la salida se redirige a un archivo o tubería.

## Quédate con...

*   `git diff` muestra las diferencias entre el directorio de trabajo y el staging area, revelando cambios modificados pero no yet preparados.
*   `git diff --staged` compara el staging area contra el último commit (HEAD), mostrando exactamente qué se incluirá en el próximo commit.
*   La salida usa formato unified diff: líneas con `-` indican contenido eliminado, líneas con `+` indican contenido añadido.
*   Los encabezados de hunk (`@@`) especifican los números de línea afectados en el archivo original y en el nuevo, facilitando la localización del cambio.
*   Un archivo modificado después de `git add` aparecerá en ambos diffs: la versión staged en `--staged` y los cambios adicionales en el diff simple.
*   Revisar `git diff --staged` antes de commitar es una práctica de control de calidad que previene errores y mantiene la coherencia del historial.

<div class="pagination">
  <a href="/markdown/sistemas/git/fundamentos/ignorar" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/fundamentos/errores" class="next">Siguiente</a>
</div>
