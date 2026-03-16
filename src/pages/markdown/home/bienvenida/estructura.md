---
title: "Estructura del proyecto"
description: ""
layout: ../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Estructura del proyecto](#estructura-del-proyecto)
  - [Rutas principales](#rutas-principales)
  - [Carpeta de contenido](#carpeta-de-contenido)
  - [Flujo de datos](#flujo-de-datos)
  - [Cómo leer los apuntes](#cómo-leer-los-apuntes)

</div>

# Estructura del proyecto

La página está organizada para que el estudiante encuentre lo que necesita rápido y sin complicaciones.

## Rutas principales

- `/` → Home principal con introducción, propósito y navegación.
- `/sistemas` → Sección de sistemas con teoría de hardware y software.
- `/web` → Sección de desarrollo web.
- `/datos` → Sección de bases de datos y datos.

## Carpeta de contenido

- `src/pages` contiene las páginas de Astro.
- `src/pages/markdown` almacena los archivos Markdown que se renderizan como artículos.
- `src/components` guarda componentes reutilizables (acordeón, terminal, etc.).

## Flujo de datos

1. El usuario navega en el menú.
2. Astro carga la ruta y renderiza el contenido usando el markdown correspondiente.
3. Los componentes y datos en `src/data` generan tarjetas y listas dinámicas.

## Cómo leer los apuntes

- Usa la navegación por temas en el menú.
- Entra a un tema (por ejemplo, `hardware/cpu`) y consulta los artículos relacionados.
- Cada tema está pensado en orden: conceptos generales → ejemplos → referencias.
