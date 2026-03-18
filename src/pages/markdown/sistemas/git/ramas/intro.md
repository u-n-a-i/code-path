---
title: "¿Qué es una rama (branch)?"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [¿Qué es una rama (branch)?](#qué-es-una-rama-branch)
  - [Línea independiente de desarrollo](#línea-independiente-de-desarrollo)
  - [Por defecto: rama main o master](#por-defecto-rama-main-o-master)
  - [Quédate con...](#quédate-con)

</div>

# ¿Qué es una rama (branch)?

El desarrollo de software rara vez ocurre en una línea recta única. Múltiples funcionalidades se construyen simultáneamente, errores críticos deben corregirse sin detener el trabajo en curso, y experimentos arriesgados necesitan un espacio seguro donde fallar sin consecuencias. Las ramas en Git son el mecanismo que hace posible este paralelismo: permiten crear líneas de desarrollo independientes que coexisten dentro del mismo repositorio, aisladas entre sí hasta que deciden fusionarse. Esta capacidad de bifurcación transforma el control de versiones de un simple historial de cambios en un entorno de trabajo flexible donde la estabilidad del proyecto principal se preserva mientras ocurre innovación en los márgenes.

## Línea independiente de desarrollo

Una rama representa una secuencia independiente de commits que diverge desde un punto específico del historial. Cuando se crea una rama, Git no copia los archivos ni duplica el proyecto: simplemente crea un puntero móvil que apunta a un commit existente. A partir de ese momento, los nuevos commits realizados en esa rama no afectan a otras ramas, permitiendo trabajar en una nueva funcionalidad, corregir un bug o probar una idea sin alterar el código estable.

Este aislamiento es fundamental para el flujo de trabajo profesional. Una rama `feature/login` puede contener código incompleto o inestable mientras la rama principal permanece limpia y desplegable. Si el experimento falla, la rama se descarta sin dejar rastro en el historial principal. Si tiene éxito, se fusiona (*merge*) de vuelta a la línea principal, incorporando los cambios de forma controlada. Esta práctica permite integración continua, revisión de código específica por funcionalidad y despliegues selectivos.

La creación de ramas es extremadamente ligera en Git. Dado que una rama es esencialmente un archivo de 41 bytes (un puntero SHA-1), crear, cambiar o eliminar ramas es una operación casi instantánea, independientemente del tamaño del proyecto. Esta eficiencia incentiva su uso frecuente: una rama por tarea, una rama por bug, una rama por experimento.

> Las ramas son locales por defecto. Crear una rama con `git branch feature-x` solo existe en tu repositorio local hasta que la subes explícitamente con `git push -u origin feature-x`. Esta separación permite trabajar offline con múltiples líneas de desarrollo antes de sincronizar con el remoto.

## Por defecto: rama main o master

Al inicializar un repositorio con `git init`, Git crea automáticamente una rama inicial que sirve como línea base del proyecto. Históricamente, esta rama se llamaba `master`, reflejando la terminología original de Git donde una rama principal controlaba a las demás. Sin embargo, desde 2020, la comunidad y plataformas como GitHub, GitLab y Bitbucket han adoptado mayoritariamente el nombre `main` por ser más inclusivo y descriptivo.

Esta rama por defecto representa típicamente el estado estable del proyecto: el código que está en producción, que ha pasado pruebas de calidad y que está listo para uso general. Las convenciones de flujo de trabajo (como Git Flow o GitHub Flow) establecen reglas sobre cómo interactuar con esta rama: generalmente prohibiendo commits directos y requiriendo que los cambios lleguen mediante *pull requests* o *merge requests* desde ramas temporales.

El nombre de la rama por defecto es configurable. En versiones recientes de Git, se puede establecer globalmente con `git config --global init.defaultBranch main`, asegurando que todos los nuevos repositorios usen la convención moderna. En repositorios existentes, la rama puede renombrarse con `git branch -M main`, aunque esto requiere actualizar las referencias en el remoto y en las máquinas de los colaboradores.

> La rama por defecto no tiene privilegios técnicos especiales sobre otras ramas: es una convención social y operativa, no una restrucción de Git. Técnicamente, cualquier rama puede ser la fuente de verdad, pero mantener una rama `main` estable facilita la coordinación del equipo y la automatización de despliegues.

## Quédate con...

*   Una rama es una línea independiente de desarrollo que permite trabajar aislado sin afectar el código estable del proyecto.
*   Las ramas en Git son ligeras: son punteros a commits, no copias de archivos, lo que hace su creación y cambio casi instantáneo.
*   La rama por defecto tras `git init` es `main` (moderno) o `master` (histórico), representando típicamente el estado estable o de producción.
*   El aislamiento de ramas permite experimentar, desarrollar funcionalidades y corregir errores en paralelo antes de fusionarlos mediante `git merge`.
*   Las ramas son locales por defecto; requieren `git push` explícito para compartirse con repositorios remotos y colaboradores.
*   El nombre de la rama principal es una convención configurable, no una restricción técnica, pero mantener una rama estable es crucial para flujos de trabajo profesionales.

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/ramas/trabajo" class="next">Siguiente</a>
</div>
