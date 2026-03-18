---
title: "Tipos de sistemas de control de versiones"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Tipos de sistemas de control de versiones](#tipos-de-sistemas-de-control-de-versiones)
  - [Control de versiones local](#control-de-versiones-local)
  - [Control de versiones centralizado (CVS, Subversion)](#control-de-versiones-centralizado-cvs-subversion)
  - [Control de versiones distribuido (Git, Mercurial)](#control-de-versiones-distribuido-git-mercurial)
  - [Comparación de modelos](#comparación-de-modelos)
  - [Quédate con...](#quédate-con)

</div>

# Tipos de sistemas de control de versiones

La evolución de los sistemas de control de versiones refleja un cambio profundo en cómo se concibe la colaboración y la gestión del historial en el desarrollo de software. Cada modelo arquitectónico —local, centralizado o distribuido— responde a distintas necesidades de coordinación, resiliencia y flujo de trabajo. Comprender estas diferencias no es un ejercicio histórico: determina qué herramientas elegir, cómo estructurar equipos y qué garantías se obtienen sobre integridad, disponibilidad y recuperación ante fallos. La transición desde enfoques locales hasta modelos distribuidos marca la madurez de una disciplina que transformó la manera en que se construye software colectivo.

## Control de versiones local

El enfoque más elemental consiste en mantener copias manuales de archivos en el sistema local, típicamente nombradas con fechas o versiones: `script.py`, `script_v2.py`, `script_final.py`, `script_final_v2.py`. Esta práctica, aunque intuitiva, introduce problemas operativos inmediatos: la proliferación de archivos duplicados dificulta identificar cuál representa el estado actual, los cambios entre versiones no están documentados de forma estructurada, y la recuperación de un estado anterior requiere búsqueda manual y comparación visual.

Algunas herramientas locales automatizan parcialmente este proceso. RCS (*Revision Control System*), disponible desde los años 80, almacena diferencias entre versiones de un archivo individual en un archivo especial (`,v`), permitiendo recuperar estados anteriores y consultar quién modificó qué y cuándo. Sin embargo, RCS opera archivo por archivo: no gestiona cambios atómicos en múltiples archivos, no soporta colaboración, y carece de metadatos ricos como mensajes descriptivos o identificación de autor más allá del nombre de usuario del sistema.

El control local es adecuado para trabajo individual en proyectos pequeños donde el historial completo reside en una sola máquina. Su limitación fundamental es la fragilidad: si el disco falla, el historial se pierde. No hay redundancia inherente, ni mecanismo para sincronizar trabajo entre múltiples desarrolladores. Por esta razón, este modelo ha sido ampliamente reemplazado por sistemas que incorporan colaboración y resiliencia.

> Las copias manuales con fechas no constituyen un sistema de control de versiones real: carecen de atomicidad, metadatos estructurados y mecanismos de fusión. Su uso persiste en contextos informales, pero introduce riesgos de inconsistencia que herramientas dedicadas eliminan.

## Control de versiones centralizado (CVS, Subversion)

Los sistemas centralizados introducen un repositorio único que actúa como fuente de verdad para todo el equipo. Desarrolladores extraen (*checkout*) una copia de trabajo del servidor, realizan modificaciones localmente, y envían cambios (*commit*) de vuelta al repositorio central. Cada commit recibe un número de revisión secuencial global, y el historial se almacena exclusivamente en el servidor.

CVS (*Concurrent Versions System*), pionero en este modelo, permitía edición concurrente de archivos: múltiples desarrolladores podían modificar el mismo archivo simultáneamente, y el sistema intentaba fusionar cambios al momento del commit. Cuando la fusión automática fallaba —modificaciones en la misma línea—, se generaba un conflicto que requería resolución manual. Esta capacidad de colaboración fue revolucionaria, pero CVS presentaba limitaciones: no rastreaba movimientos de archivos, carecía de atomicidad en commits múltiples, y el historial se almacenaba de forma ineficiente.

Subversion (SVN) corrigió muchas de estas deficiencias. Introduce commits atómicos: cambios en múltiples archivos se registran como una unidad indivisible, garantizando que el repositorio nunca quede en estado inconsistente. Soporta renombrado y movimiento de archivos preservando historial, y almacena diferencias de forma más eficiente. Sin embargo, mantiene la arquitectura centralizada: el historial completo reside en el servidor, y los clientes solo poseen la versión actual de los archivos.

Esta dependencia del servidor tiene consecuencias operativas. Sin conectividad de red, los desarrolladores no pueden consultar historial, crear ramas o realizar commits. Si el servidor falla o se corrompe, el historial completo puede perderse salvo que existan backups externos. La colaboración escala bien para equipos pequeños o medianos, pero la centralización introduce un punto único de fallo y un cuello de botella potencial en operaciones de escritura.

>  Subversion sigue siendo utilizado en entornos enterprise donde el control centralizado se alinea con políticas de auditoría y gobernanza. Su modelo de "checkout-edit-commit" es intuitivo para usuarios que provienen de sistemas de archivos tradicionales, aunque limita la flexibilidad de flujo de trabajo comparado con modelos distribuidos.

## Control de versiones distribuido (Git, Mercurial)

Los sistemas distribuidos eliminan la distinción entre cliente y servidor: cada clon del repositorio contiene el historial completo, incluyendo todas las ramas, tags y metadatos. No hay una fuente de verdad única por diseño; cualquier repositorio puede sincronizar cambios con cualquier otro, habilitando flujos de trabajo descentralizados y resilientes.

Git, desarrollado por Linus Torvalds en 2005 para la gestión del kernel de Linux, ejemplifica este modelo. Cada commit es un objeto inmutable identificado por un hash SHA-1 (o SHA-256 en versiones recientes) que incluye el contenido del árbol de archivos, metadatos del autor, mensaje descriptivo y referencia al commit padre. Esta estructura de grafo acíclico dirigido (DAG) permite ramificaciones, fusiones y reescrituras de historial con integridad criptográfica: cualquier alteración modificaría el hash, detectándose inmediatamente como inconsistencia.

La arquitectura distribuida habilita escenarios imposibles en modelos centralizados. Desarrolladores pueden trabajar offline: crear commits, consultar historial, crear ramas y fusionar cambios sin conectividad de red. La sincronización ocurre selectivamente mediante operaciones explícitas: `push` envía commits locales a un repositorio remoto, `pull` integra cambios remotos al repositorio local. Esta separación entre commit local y publicación remota permite experimentar, reorganizar historial y validar cambios antes de compartirlos.

Mercurial (hg) ofrece una filosofía similar con diferencias de diseño: comandos más consistentes, metadatos explícitos en archivos de configuración, y énfasis en rendimiento para repositorios muy grandes. Ambos sistemas comparten principios fundamentales: integridad mediante hashing, historial completo local, y sincronización peer-to-peer.

>  La distribución no elimina la necesidad de repositorios compartidos para colaboración. Plataformas como GitHub, GitLab o Bitbucket actúan como puntos de coordinación convenidos, pero su rol es opcional: el sistema funciona incluso si desaparecen, ya que cada clon contiene el historial completo.

## Comparación de modelos

La elección entre modelos responde a criterios de colaboración, resiliencia y flujo de trabajo, no a superioridad técnica absoluta.

| Criterio | Local | Centralizado (SVN) | Distribuido (Git) |
|----------|-------|-------------------|-------------------|
| Historial completo | Solo en máquina local | Solo en servidor | En cada clon |
| Trabajo offline | Limitado a archivos actuales | Sin commits, sin historial | Completo: commit, branch, merge |
| Resiliencia ante fallo de servidor | Pérdida total si no hay backup | Pérdida del historial central | Cada clon es backup completo |
| Colaboración | Manual, propensa a conflictos | Coordinada vía servidor central | Flexible: múltiples remotos, flujos descentralizados |
| Atomicidad de commits múltiples | No soportada (RCS) | Sí (SVN) | Sí (Git, Mercurial) |
| Curva de aprendizaje | Baja | Media | Alta (conceptos: staging, rebase, reflog) |

El modelo distribuido domina el desarrollo moderno de software por su flexibilidad y resiliencia. Sin embargo, sistemas centralizados siguen siendo válidos en contextos donde el control centralizado se alinea con requisitos regulatorios, o donde equipos pequeños priorizan simplicidad operativa sobre flexibilidad avanzada.

>  La transición de SVN a Git no es meramente técnica: requiere adaptación cultural. Flujos de trabajo como *feature branches*, *pull requests* y *rebase* son nativos en Git pero inexistentes o diferentes en SVN. La capacitación en conceptos distribuidos es tan importante como la instalación de la herramienta.

## Quédate con...

*   El control de versiones local (copias manuales, RCS) es adecuado para trabajo individual pero frágil: sin redundancia ni colaboración, el historial se pierde si falla el disco local.
*   Los sistemas centralizados (CVS, SVN) introducen un repositorio único como fuente de verdad, habilitando colaboración coordinada pero creando dependencia de conectividad y un punto único de fallo.
*   Los sistemas distribuidos (Git, Mercurial) replican el historial completo en cada clon, permitiendo trabajo offline, resiliencia ante fallos y flujos de trabajo descentralizados.
*   La integridad en Git se garantiza mediante hashes criptográficos: cada commit es inmutable y cualquier alteración se detecta como inconsistencia en el grafo de historial.
*   La elección de modelo depende de requisitos de colaboración, resiliencia y flujo de trabajo; no existe una opción universalmente superior, solo adecuación al contexto operativo.
*   La transición a modelos distribuidos requiere adaptación conceptual: operaciones como `push`, `pull`, `rebase` y `reflog` reflejan una filosofía de trabajo distinta a la edición centralizada tradicional.



<div class="pagination">
  <a href="/markdown/sistemas/git/intro/intro" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/intro/problemas" class="next">Siguiente</a>
</div>
