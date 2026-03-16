---
title: "Componentes del proyecto"
description: ""
layout: ../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Componentes del proyecto](#componentes-del-proyecto)
  - [Componentes clave](#componentes-clave)
  - [Beneficios de componentes](#beneficios-de-componentes)
  - [Cómo crear un componente nuevo](#cómo-crear-un-componente-nuevo)
  - [Buenas prácticas](#buenas-prácticas)

</div>

# Componentes del proyecto

El proyecto usa componentes reutilizables para construir la interfaz de forma modular.

## Componentes clave

- `Accordion.astro` - desplegables de contenido y secciones.
- `ActionMenu.astro` - menú de acciones y acceso rápido.
- `BackBtn.astro` - botón de volver atrás.
- `Prompt.astro` y `Terminal.astro` - bloques estilo terminal para ejemplos.

## Beneficios de componentes

- Código más limpio y mantenible.
- Reutilización de patrones visuales.
- Facilidad para introducir cambios de estilo global.

## Cómo crear un componente nuevo

1. Crea un archivo en `src/components` (por ejemplo, `Card.astro`).
2. Define propiedades en `const { title, description } = Astro.props;`.
3. Usa el componente en una página con `<Card title="..." description="..." />`.

## Buenas prácticas

- Mantén componentes pequeños y con una sola responsabilidad.
- Pasa datos a través de propiedades, no copies datos estáticos en cada componente.
- Separa estilo (CSS) en `src/styles/globals.css` o componentes específicos.
