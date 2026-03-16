---
title: "Comandos de navegación"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Comandos de navegación](#comandos-de-navegación)
  - [Saber dónde estás: pwd](#saber-dónde-estás-pwd)
  - [Listar contenido: ls y sus opciones clave](#listar-contenido-ls-y-sus-opciones-clave)
  - [Rutas: relativas vs. absolutas](#rutas-relativas-vs-absolutas)
  - [Quédate con...](#quédate-con)

</div>

# Comandos de navegación

Navegar por el sistema de archivos es una de las primeras y más frecuentes tareas que realizas en la terminal. A diferencia de los entornos gráficos, donde exploras carpetas con clics y ventanas, en la CLI debes expresar explícitamente tu ubicación y tus movimientos mediante comandos y rutas. Esta aparente rigidez se convierte rápidamente en una ventaja: al escribir rutas y comandos, ganas precisión, reproducibilidad y la capacidad de automatizar cualquier recorrido del sistema. Los comandos pwd y ls, junto con el uso correcto de rutas relativas y absolutas, forman la base de esta orientación digital en el entorno Linux.

## Saber dónde estás: pwd

El comando pwd (print working directory) muestra la ruta absoluta del directorio actual. Es una referencia esencial antes de realizar operaciones que dependen de la ubicación, como copiar archivos o ejecutar scripts.

```bash
$ pwd
/home/usuario/documentos
```

Este comando es especialmente útil cuando trabajas con múltiples terminales o después de usar enlaces simbólicos, ya que te asegura exactamente en qué parte del árbol de directorios te encuentras.

> En muchas shells modernas (como Bash o Zsh), el prompt ya muestra parte de la ruta actual, pero pwd sigue siendo indispensable en scripts o cuando necesitas la ruta completa sin ambigüedades.

## Listar contenido: ls y sus opciones clave

El comando ls (list) muestra el contenido de un directorio. Por sí solo, lista los nombres de archivos y carpetas visibles, pero su verdadero poder radica en sus opciones:

- -l (long): muestra información detallada por cada elemento: permisos, número de enlaces, propietario, grupo, tamaño, fecha de modificación y nombre.
- -a (all): incluye archivos ocultos (aquellos cuyo nombre comienza con un punto, como .bashrc).
- -h (human-readable): cuando se usa con -l, muestra los tamaños en unidades legibles (KB, MB, etc.) en lugar de bytes.

Estas opciones suelen combinarse. Por ejemplo:

```bash
ls -lah
```

Muestra un listado completo, detallado y legible de todos los archivos (incluidos los ocultos) del directorio actual.

> El orden de las letras en las opciones cortas no importa: ls -lah, ls -alh y ls -hla son equivalentes.

## Rutas: relativas vs. absolutas

Toda operación en el sistema de archivos requiere especificar una ruta. Existen dos tipos fundamentales:

- Rutas absolutas comienzan desde la raíz del sistema (/) y describen la ubicación completa del recurso.
  - Por ejemplo: /home/usuario/Descargas/archivo.txt
  - Son útiles cuando necesitas referirte a un lugar específico sin depender de tu ubicación actual.
- Rutas relativas se interpretan en relación con el directorio de trabajo actual. Usan notación especial:
  - . representa el directorio actual.
  - .. representa el directorio padre (un nivel hacia arriba).

Por ejemplo, si estás en /home/usuario/documentos, entonces:

- ls .. lista el contenido de /home/usuario.
- cat ./notas.txt lee un archivo llamado notas.txt en el mismo directorio (el ./ es opcional, pero a veces necesario para evitar ambigüedades).
- cd ../../tmp sube dos niveles (a /home) y luego entra en la carpeta tmp.

Entender esta distinción evita errores comunes, como intentar acceder a un archivo que “no existe” simplemente porque se usó una ruta relativa desde una ubicación inesperada.

> Los comandos como cd, cp, mv y rm aceptan tanto rutas absolutas como relativas. Elegir entre ellas depende del contexto: las rutas absolutas son más seguras en scripts; las relativas, más flexibles en sesiones interactivas.

## Quédate con...

- pwd muestra la ruta absoluta del directorio actual.
- ls -l da detalles de archivos; ls -a incluye los ocultos; ls -h hace los tamaños legibles; y ls -lah combina las tres.
- Las rutas absolutas empiezan con / y son independientes de tu ubicación.
- Las rutas relativas usan . (actual) y .. (padre) y dependen del directorio de trabajo.
- Dominar estas herramientas te permite moverte con confianza y precisión por cualquier sistema Linux, local o remoto.

<div class="pagination">
  <a href="/markdown/sistemas/linux/cli/comando" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/cli/ayudas" class="next">Siguiente</a>
</div>
