---
title: "Licencias y modelos de distribución"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Licencias y modelos de distribución](#licencias-y-modelos-de-distribución)
  - [Licencias y su propósito](#licencias-y-su-propósito)
  - [Modelos de distribución](#modelos-de-distribución)
  - [Software propietario vs. código abierto](#software-propietario-vs-código-abierto)
  - [Tipos de licencias](#tipos-de-licencias)
  - [La ética y legalidad en el uso del software](#la-ética-y-legalidad-en-el-uso-del-software)
  - [Quédate con...](#quédate-con)

</div>

# Licencias y modelos de distribución

El software no solo se define por su funcionalidad técnica, sino también por las condiciones bajo las cuales se puede usar, modificar y redistribuir. Estas condiciones están establecidas en licencias, que son acuerdos legales entre el titular de los derechos (normalmente el creador o la empresa) y el usuario. Comprender los distintos modelos de distribución y los tipos de licencias es fundamental no solo para cumplir con la ley, sino también para tomar decisiones éticas e informadas como desarrollador, ya sea al elegir herramientas, contribuir a proyectos o publicar tu propio código.

## Licencias y su propósito

Una licencia de software otorga permisos específicos sobre lo que se puede —y no se puede— hacer con un programa. A diferencia de otros bienes, el software está protegido por derechos de autor (copyright) desde el momento de su creación, lo que significa que, sin una licencia explícita, cualquier uso, copia o modificación está prohibido por defecto. Las licencias eliminan esa barrera legal de forma controlada, definiendo claramente los derechos del usuario y las obligaciones que debe cumplir.

## Modelos de distribución

Existen varios modelos para entregar software al público, cada uno con implicaciones técnicas, económicas y legales:

- Software propietario: Se distribuye en forma binaria (ejecutable), sin acceso al código fuente. El usuario adquiere una licencia de uso, no la propiedad del software. Ejemplos: Microsoft Windows, Adobe Photoshop.
- Código abierto (Open Source): El código fuente está disponible públicamente, y la licencia permite estudiarlo, modificarlo y redistribuirlo, a menudo con ciertas condiciones. Ejemplos: Linux, VS Code, Firefox.
- Freeware: Software gratuito, pero usualmente propietario y sin permiso para modificarlo (por ejemplo, muchas apps móviles).
- Shareware: Versión de prueba gratuita con funcionalidades limitadas o tiempo restringido; requiere pago para uso completo.
- SaaS (Software as a Service): El software no se instala, sino que se consume a través de internet; el modelo de licencia suele estar vinculado a suscripciones.

> “Gratis” no es lo mismo que “libre”. Un software puede ser gratuito (gratis) pero restrictivo en cuanto a modificación o redistribución. Por el contrario, el software libre (según la Free Software Foundation) garantiza cuatro libertades esenciales: usar, estudiar, compartir y mejorar el programa.

## Software propietario vs. código abierto

La diferencia clave radica en el acceso al código fuente y en los derechos asociados:

El software propietario prioriza el control del proveedor: el código es un activo comercial protegido, y el usuario confía ciegamente en que el software funciona como se promete, sin poder verificarlo.

El software de código abierto fomenta la transparencia, la colaboración y la mejora colectiva. Cualquiera puede auditar el código en busca de fallos o vulnerabilidades, adaptarlo a sus necesidades o contribuir mejoras al proyecto original.

Ambos modelos tienen ventajas: el propietario puede ofrecer soporte profesional y experiencia de usuario pulida; el código abierto promueve innovación, evita el vendor lock-in y suele ser más seguro a largo plazo gracias a la revisión comunitaria.

## Tipos de licencias

Las licencias varían en permisividad y requisitos. Algunas de las más relevantes son:

- MIT: Una de las más permisivas. Permite usar, copiar, modificar y redistribuir el software, incluso en productos propietarios, siempre que se incluya el aviso de copyright original. Muy popular en proyectos modernos.
- GPL (General Public License): Licencia copyleft. Permite todas las libertades del software libre, pero exige que cualquier obra derivada también se distribuya bajo GPL. Esto asegura que las mejoras permanezcan libres. Existen versiones como GPLv2 y GPLv3, con diferencias en protección contra patentes y tivoización.
- Apache 2.0: Similar a MIT, pero incluye una cláusula explícita de concesión de patentes, lo que la hace preferida en entornos corporativos.
- Licencias comerciales/proprietarias: No estandarizadas; definen términos específicos de uso, prohibiendo casi siempre la modificación o redistribución. Suelen incluir cláusulas de responsabilidad limitada y soporte técnico pagado.

Es crucial leer y entender la licencia antes de usar o integrar una biblioteca en tu proyecto, especialmente si planeas distribuirlo comercialmente.

## La ética y legalidad en el uso del software

Usar software sin una licencia válida —por ejemplo, pirateando programas o ignorando los términos de una licencia de código abierto— no solo es ilegal, sino que socava el trabajo de quienes lo crean. En el ámbito profesional, incumplir licencias puede acarrear sanciones legales, multas o daño reputacional. Más allá de la legalidad, existe una dimensión ética: el respeto por el esfuerzo intelectual ajeno y la contribución a un ecosistema sostenible.

Como desarrollador, también tienes responsabilidades al publicar tu propio código. Elegir una licencia clara y adecuada no solo protege tus derechos, sino que facilita que otros usen tu trabajo de forma correcta y colaborativa.

## Quédate con...

- Las licencias definen legalmente qué puedes hacer con un software; sin ellas, todo uso está prohibido por defecto.
- El software propietario restringe el acceso al código y su modificación; el código abierto lo permite, fomentando transparencia y colaboración.
- Licencias como MIT son muy permisivas; GPL impone que las derivadas también sean libres (copyleft); las comerciales suelen ser restrictivas.
- Los modelos de distribución (SaaS, freeware, shareware, etc.) influyen en cómo accedes al software y qué derechos obtienes.
- Usar software de forma legal y ética es una responsabilidad profesional esencial, tanto al consumir como al crear software.

<div class="pagination">
  <a href="/markdown/sistemas/software/conceptos/hibrido" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
