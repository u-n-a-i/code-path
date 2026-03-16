---
title: "Unix y Linux"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Unix y Linux](#unix-y-linux)
  - [Origen: de Multics a Unix](#origen-de-multics-a-unix)
  - [La filosofía Unix](#la-filosofía-unix)
  - [El movimiento GNU y la brecha del kernel](#el-movimiento-gnu-y-la-brecha-del-kernel)
  - [El nacimiento de Linux](#el-nacimiento-de-linux)
  - [Quédate con...](#quédate-con)

</div>

# Unix y Linux

El conocimiento de los orígenes de los sistemas operativos modernos es fundamental para comprender no solo cómo funcionan las herramientas que usamos diariamente, sino también la cultura técnica que ha moldeado el desarrollo del software libre y de código abierto. Unix y Linux son pilares de esta historia: uno nació en los laboratorios industriales de mediados del siglo XX, y el otro surgió décadas después como respuesta a las limitaciones del primero, impulsado por una comunidad global de desarrolladores. Entender su evolución permite apreciar principios clave como la modularidad, la portabilidad y la colaboración abierta, que siguen vigentes en la ingeniería de software actual.

## Origen: de Multics a Unix

A finales de la década de 1960, varios grupos de investigación, entre ellos AT&T Bell Labs, el MIT y General Electric, colaboraron en un ambicioso proyecto llamado Multics (Multiplexed Information and Computing Service), cuyo objetivo era crear un sistema operativo avanzado, multiusuario y multitarea. Aunque Multics introdujo ideas innovadoras —como la jerarquía de archivos y la seguridad basada en accesos—, el proyecto se volvió excesivamente complejo y fue abandonado por AT&T en 1969.

Sin embargo, algunos ingenieros de Bell Labs, especialmente Ken Thompson y Dennis Ritchie, quedaron fascinados por los conceptos de Multics y decidieron crear un sistema más simple y eficiente. Así nació Unix en 1969, inicialmente escrito en ensamblador para una máquina PDP-7. Pronto, Ritchie desarrolló el lenguaje C, y en 1973 Unix fue reescrito en este lenguaje, lo que le otorgó una ventaja revolucionaria: portabilidad. Por primera vez, un sistema operativo podía ejecutarse en diferentes arquitecturas de hardware con mínimos cambios, lo que facilitó su adopción en universidades y centros de investigación.

## La filosofía Unix

Uno de los legados más duraderos de Unix es su filosofía de diseño, resumida en principios como “hacer una cosa, y hacerla bien” y “escribir programas que trabajen juntos”. Esta mentalidad promueve la creación de herramientas pequeñas, modulares y especializadas que pueden combinarse mediante mecanismos como tuberías (pipes) y redirecciones para resolver tareas complejas. Esta aproximación no solo mejora la mantenibilidad y reutilización del código, sino que también fomenta la experimentación y la composición creativa —una idea que sigue inspirando el desarrollo de software moderno.

## El movimiento GNU y la brecha del kernel

A principios de la década de 1980, el software Unix estaba sujeto a licencias restrictivas, lo que limitaba su uso y modificación. En respuesta, Richard Stallman lanzó en 1983 el proyecto GNU (GNU’s Not Unix), con el objetivo de crear un sistema operativo completamente libre y compatible con Unix. Durante los años siguientes, la comunidad GNU desarrolló muchas de las herramientas esenciales: el compilador GCC, el editor Emacs, las utilidades básicas (ls, cp, grep, etc.) y la biblioteca C (glibc).

Sin embargo, el proyecto GNU carecía de un componente crucial: un kernel funcional. Aunque se inició el desarrollo del kernel Hurd, su progreso fue lento. Esta brecha dejó al ecosistema del software libre sin un sistema operativo completo hasta principios de los años 90.

## El nacimiento de Linux

En 1991, Linus Torvalds, un estudiante finlandés de ciencias de la computación, comenzó a trabajar en un sistema operativo personal inspirado en Minix, un sistema educativo creado por Andrew Tanenbaum para enseñar los fundamentos de los sistemas operativos. Insatisfecho con las limitaciones de Minix, Torvalds decidió escribir su propio kernel, que inicialmente llamó simplemente “mi sistema operativo”, pero que pronto adoptó el nombre Linux.

Publicado bajo la Licencia Pública General de GNU (GPL) en 1992, el kernel de Linux pudo combinarse con las herramientas del proyecto GNU, dando lugar al primer sistema operativo libre, completo y funcional: lo que hoy comúnmente llamamos GNU/Linux. Esta fusión simboliza una colaboración histórica entre una visión ética del software (GNU) y una implementación técnica robusta y pragmática (Linux).

> Aunque en el lenguaje cotidiano se dice “Linux” para referirse al sistema operativo completo, técnicamente Linux es solo el kernel. El sistema incluye cientos de componentes del proyecto GNU y otras contribuciones. Reconocer esta distinción no es pedantería, sino un homenaje a los principios del software libre que hicieron posible su existencia.

## Quédate con...

- Unix nació en AT&T Bell Labs en 1969 como una alternativa ligera a Multics, y su reescritura en C lo hizo portable y ampliamente adoptado.
- La filosofía Unix prioriza herramientas pequeñas, modulares y componibles que “hacen una cosa y la hacen bien”.
- El proyecto GNU, iniciado por Richard Stallman en 1983, buscaba crear un sistema operativo libre compatible con Unix, pero le faltaba un kernel funcional.
- Linus Torvalds creó el kernel Linux en 1991, inspirado en Minix, y lo liberó bajo la GPL, permitiendo su combinación con las herramientas de GNU.
- El sistema operativo completo que usamos hoy es técnicamente GNU/Linux, resultado de la unión del kernel Linux y las utilidades del proyecto GNU.

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/introduccion/licencias" class="next">Siguiente</a>
</div>
