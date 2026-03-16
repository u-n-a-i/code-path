---
title: "Filosofía open source y licencias"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Filosofía open source y licencias](#filosofía-open-source-y-licencias)
  - [Software libre: una cuestión de libertad, no de precio](#software-libre-una-cuestión-de-libertad-no-de-precio)
  - [Código abierto: pragmatismo y calidad técnica](#código-abierto-pragmatismo-y-calidad-técnica)
  - [Licencias: el marco legal que hace posible la colaboración](#licencias-el-marco-legal-que-hace-posible-la-colaboración)
  - [La GPL y su impacto histórico](#la-gpl-y-su-impacto-histórico)
  - [Quédate con...](#quédate-con)

</div>

# Filosofía open source y licencias

Comprender la filosofía detrás del software libre y del código abierto no es solo una cuestión legal o técnica: es adentrarse en una visión ética y colaborativa sobre cómo debe construirse, compartirse y evolucionar el conocimiento en la era digital. Estas ideas han moldeado herramientas fundamentales del desarrollo moderno —desde sistemas operativos como Linux hasta lenguajes de programación, editores de código y servidores web— y continúan influyendo en cómo los desarrolladores trabajan, aprenden y contribuyen a la comunidad global. Distinguir entre “software libre” y “código abierto”, así como entender las licencias que los regulan, es esencial para participar de forma consciente y responsable en este ecosistema.

## Software libre: una cuestión de libertad, no de precio

El concepto de software libre fue formalizado por Richard Stallman en la década de 1980 como parte del proyecto GNU. Es crucial entender que “libre” aquí se refiere a libertad, no a gratuidad (aunque muchos programas libres sí son gratuitos). Según la Free Software Foundation (FSF), un programa es libre si garantiza al usuario cuatro libertades esenciales:

1. Libertad 0: usar el programa para cualquier propósito.
1. Libertad 1: estudiar cómo funciona el programa y modificarlo.
1. Libertad 2: redistribuir copias del programa.
1. Libertad 3: distribuir versiones modificadas del programa.

Estas libertades están diseñadas para proteger al usuario frente al control ejercido por los desarrolladores propietarios, promoviendo la transparencia, la autonomía y la cooperación. La filosofía del software libre es, en esencia, ética y social: defiende que el software debe servir a sus usuarios, no someterlos.

> A menudo se confunde “software libre” con “gratuito”. Un programa puede ser gratuito pero no libre (por ejemplo, muchas aplicaciones móviles), y un software libre puede tener un costo (por ejemplo, soporte técnico o distribución física). Lo que importa son las libertades que otorga, no el precio.

## Código abierto: pragmatismo y calidad técnica

A finales de la década de 1990, algunos miembros de la comunidad del software libre consideraron que el enfoque ético de Stallman dificultaba la adopción empresarial. Así surgió el término código abierto (open source), promovido por la Open Source Initiative (OSI). Aunque comparte gran parte del mismo conjunto de licencias y prácticas, el movimiento de código abierto enfatiza los beneficios prácticos: mayor calidad, seguridad, innovación y eficiencia gracias a la revisión pública del código y la colaboración distribuida.

Mientras que el software libre plantea una cuestión de derechos humanos digitales, el código abierto se presenta como una estrategia de desarrollo superior. En la práctica, la mayoría de los proyectos caen en ambas categorías, pero la diferencia radica en la motivación: libertad vs. eficacia.

## Licencias: el marco legal que hace posible la colaboración

Las licencias son los instrumentos legales que otorgan las libertades mencionadas. Sin una licencia explícita, todo software está sujeto al copyright automático, lo que prohíbe su uso, modificación o redistribución. Las licencias de software libre y código abierto relajan estas restricciones bajo ciertas condiciones.

Existen decenas de licencias reconocidas, pero pueden agruparse en dos grandes familias:

- Licencias permisivas (como MIT, BSD, Apache): permiten casi cualquier uso, incluido el incorporar el código en software propietario, siempre que se dé crédito al autor original.
- Licencias copyleft (como la GPL): también permiten el uso, modificación y redistribución, pero exigen que cualquier obra derivada se distribuya bajo los mismos términos. Esto asegura que las mejoras o adaptaciones también permanezcan libres.

## La GPL y su impacto histórico

La GNU General Public License (GPL), creada por Richard Stallman y publicada por primera vez en 1989, es la licencia copyleft más influyente. Su versión 2 (1991) fue adoptada por el kernel Linux, y la versión 3 (2007) introdujo protecciones adicionales contra tecnologías restrictivas como el tivoization (uso de hardware que impide ejecutar versiones modificadas del software).

La GPL ha sido fundamental para preservar la libertad del software en un entorno comercial. Al exigir que las derivadas también sean libres, actúa como un “efecto dominó” de libertad: una vez que el código entra en el ecosistema GPL, permanece allí. Este mecanismo ha permitido que proyectos como Linux, GCC o GIMP crezcan sin ser absorbidos por empresas que podrían cerrar su código.

> La compatibilidad entre licencias es un tema técnico importante. Por ejemplo, el código bajo licencia GPLv2 no siempre puede combinarse con código GPLv3 o con licencias permisivas, dependiendo de las cláusulas específicas. Los desarrolladores deben revisar cuidadosamente las licencias al integrar componentes externos.

## Quédate con...

- El software libre se centra en la ética y las libertades del usuario; el código abierto, en los beneficios prácticos del desarrollo colaborativo.
- “Libre” no significa “gratis”: se refiere a libertades, no a precio.
- Las licencias son esenciales para otorgar legalmente esas libertades; sin licencia, el software está restringido por defecto.
- La GPL es una licencia copyleft que garantiza que las obras derivadas también permanezcan libres, y ha sido clave en la protección del ecosistema del software libre.
- Comprender las diferencias entre licencias (permisivas vs. copyleft) y su compatibilidad es crucial al contribuir o construir sobre software existente.

<div class="pagination">
  <a href="/markdown/sistemas/linux/introduccion/intro" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/introduccion/distribucion" class="next">Siguiente</a>
</div>
