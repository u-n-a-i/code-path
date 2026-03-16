---
title: "Sistema de ayuda"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Sistema de ayuda](#sistema-de-ayuda)
  - [Ayuda rápida con --help y help](#ayuda-rápida-con---help-y-help)
  - [Las páginas de manual: man](#las-páginas-de-manual-man)
  - [Secciones del manual: organización por categorías](#secciones-del-manual-organización-por-categorías)
  - [Quédate con...](#quédate-con)

</div>

# Sistema de ayuda

En la línea de comandos, no necesitas memorizar todos los comandos ni sus opciones: el sistema te proporciona documentación integrada, precisa y siempre disponible. Aprender a usar esta documentación —ya sea mediante help, man o --help— es una habilidad fundamental que te libera de depender constantemente de búsquedas en internet y te permite explorar nuevas herramientas con autonomía. El sistema de ayuda en Unix y Linux está diseñado para ser consistente, jerárquico y accesible desde cualquier terminal, incluso sin conexión a red.

## Ayuda rápida con --help y help

La forma más inmediata de obtener información sobre un comando es usar su opción integrada --help (o a veces -h). La mayoría de los comandos modernos, especialmente los del ecosistema GNU, la admiten:

```bash
ls --help
grep --help
```

Esto muestra un resumen conciso de las opciones disponibles, ejemplos comunes y sintaxis básica. Es ideal para recordar rápidamente cómo usar una herramienta que ya conoces parcialmente.

Por otro lado, el comando help (sin argumentos) muestra una lista de comandos internos de la shell (como cd, export, read). Si lo usas con un nombre específico, obtienes ayuda sobre ese built-in:

```bash
help cd
```

> help solo funciona con comandos internos de la shell (como los de Bash). Para comandos externos (como ls o cp), debes usar --help o el sistema de páginas de manual (man).

## Las páginas de manual: man

El sistema de páginas de manual (manual pages o simplemente man) es la documentación oficial, completa y estructurada de casi todos los comandos, funciones y archivos del sistema. Se accede con el comando man seguido del nombre del tema:

```bash
man ls
man chmod
man bash
```

Las páginas de manual se muestran en un visor paginado (normalmente less), lo que permite navegar eficientemente por documentos largos. Algunos controles básicos dentro del visor son:

- Barra espaciadora: avanzar una página.
- Tecla b: retroceder una página.
- Flechas ↑/↓: desplazarse línea por línea.
- /palabra: buscar hacia adelante la palabra (presiona n para siguiente coincidencia).
- q: salir del visor.

> Si al escribir man nombre no aparece nada, es posible que el paquete de documentación no esté instalado (común en sistemas mínimos como contenedores). En distribuciones basadas en Debian/Ubuntu, puedes instalarlo con sudo apt install man-db y los paquetes \*-doc correspondientes.

## Secciones del manual: organización por categorías

El sistema de manual organiza su contenido en secciones numeradas, cada una dedicada a un tipo de recurso. Esto evita ambigüedades: por ejemplo, printf existe tanto como comando de shell como función de la biblioteca C, pero están en secciones distintas.

Las secciones principales son:

1. Sección 1: Comandos ejecutables por el usuario (ej. ls, grep, bash).
1. Sección 2: Llamadas al sistema (system calls) proporcionadas por el kernel (ej. open, fork, read).
1. Sección 3: Funciones de bibliotecas (especialmente de la biblioteca estándar C, glibc) (ej. printf, malloc).
1. Sección 4: Archivos especiales y dispositivos (ej. /dev/null, tty).
1. Sección 5: Formatos de archivos y convenciones (ej. passwd, fstab).
1. Sección 6: Juegos y programas recreativos (poco usado hoy).
1. Sección 7: Convenciones, estándares y descripciones generales (ej. ascii, utf-8, signal).
1. Sección 8: Comandos para administración del sistema (ej. mount, useradd, shutdown).

Cuando buscas una página, man muestra la primera coincidencia según el orden de prioridad (normalmente la sección 1). Si quieres ver una sección específica, indícala explícitamente:

```bash
man 2 open    # página de la llamada al sistema 'open'
man 1 printf  # comando 'printf' de la shell
man 3 printf  # función 'printf' de la biblioteca C

# Puedes listar todas las páginas disponibles para un nombre con:
man -k printf   # equivalente a apropos printf
```

## Quédate con...

- Usa comando --help para una referencia rápida de uso.
- Usa help nombre solo para comandos internos de la shell (como cd).
- El comando man proporciona documentación completa y oficial; navega con barra espaciadora, b, flechas y q para salir.
- Las páginas de manual están organizadas en secciones numeradas: 1 (comandos), 2 (llamadas al sistema), 3 (funciones de biblioteca), etc.
- Si hay ambigüedad, especifica la sección: man 2 write vs man 1 write.
- Dominar man te convierte en un usuario autónomo: toda la documentación que necesitas está siempre a un comando de distancia.

<div class="pagination">
  <a href="/markdown/sistemas/linux/cli/navegacion" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
