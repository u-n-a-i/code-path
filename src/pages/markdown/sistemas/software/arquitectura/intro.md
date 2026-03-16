---
title: "Concepto de arquitectura de software"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Concepto de arquitectura de software](#concepto-de-arquitectura-de-software)
  - [Principios de la arquitectura de software](#principios-de-la-arquitectura-de-software)
  - [La arquitectura de capas (Modelo cebolla)](#la-arquitectura-de-capas-modelo-cebolla)
    - [Estructura jerárquica del software](#estructura-jerárquica-del-software)
    - [El flujo de control y datos entre capas](#el-flujo-de-control-y-datos-entre-capas)
  - [Quédate con...](#quédate-con)

</div>

# Concepto de arquitectura de software

La arquitectura de software es la estructura fundamental de un sistema, compuesta por componentes, sus relaciones y los principios que guían su diseño y evolución. Al igual que los planos de un edificio definen cómo se distribuyen las habitaciones, los materiales y las instalaciones, la arquitectura de software establece cómo se organiza el código, cómo interactúan sus partes y cómo se gestionan aspectos críticos como rendimiento, seguridad, mantenibilidad y escalabilidad. Una buena arquitectura no garantiza que el software funcione, pero una mala arquitectura casi siempre conduce a fallos costosos, difícil mantenimiento o imposibilidad de evolucionar.

## Principios de la arquitectura de software

Tres principios fundamentales orientan la mayoría de los diseños arquitectónicos modernos: modularidad, encapsulamiento y separación de preocupaciones. Estos conceptos no son meras abstracciones teóricas; son prácticas concretas que permiten construir sistemas complejos de forma ordenada y sostenible.

La **modularidad** consiste en dividir un sistema en partes independientes (módulos) que pueden desarrollarse, probarse y modificarse por separado. Cada módulo tiene una responsabilidad clara y una interfaz bien definida. Esto facilita la colaboración en equipos grandes, reduce el riesgo de errores colaterales y permite reutilizar componentes en otros proyectos.

El **encapsulamiento** refuerza la modularidad al ocultar los detalles internos de un módulo y exponer solo lo necesario a través de una interfaz controlada. Por ejemplo, una biblioteca de autenticación puede ofrecer una función login(usuario, contraseña) sin revelar cómo almacena contraseñas ni qué algoritmos criptográficos usa. Esto protege la integridad del módulo y evita que otros componentes dependan de implementaciones internas que podrían cambiar.

La **separación de preocupaciones** (del inglés separation of concerns) propone que cada parte del sistema debe abordar un único aspecto del problema. Por ejemplo, la lógica de negocio (qué hace la aplicación) debe estar separada de la presentación (cómo se muestra al usuario) y del acceso a datos (cómo se almacenan o recuperan). Esta división reduce la complejidad cognitiva, mejora la testabilidad y permite modificar una capa sin afectar a las demás.

> Estos principios no son exclusivos del software de aplicación: también rigen el diseño del sistema operativo, los compiladores e incluso los protocolos de red. Son universales porque responden a una necesidad humana: gestionar la complejidad mediante la organización.

## La arquitectura de capas (Modelo cebolla)

Uno de los modelos arquitectónicos más intuitivos y ampliamente utilizados —especialmente para entender la pila completa de un sistema informático— es la arquitectura de capas, a menudo llamada “modelo cebolla” por su estructura concéntrica. En este modelo, cada capa se apoya en la inmediatamente inferior y ofrece servicios a la superior, creando una jerarquía clara de dependencias.

### Estructura jerárquica del software

De abajo hacia arriba, las capas típicas son:

1. Hardware: La base física del sistema (CPU, memoria, disco, red). No es software, pero es el fundamento sobre el que todo se ejecuta.
1. Firmware / BIOS / UEFI: Software embebido en chips del hardware que inicializa componentes durante el arranque y prepara el terreno para el sistema operativo.
1. Kernel: El núcleo del sistema operativo. Es la primera capa de software verdadero que interactúa directamente con el hardware. Gestiona procesos, memoria, dispositivos y llamadas del sistema (system calls).
1. Sistema operativo (capa de servicios): Sobre el kernel, el SO ofrece servicios de alto nivel: sistema de archivos, red, gestión de usuarios, drivers, etc. Aquí ya no se manejan registros de CPU, sino conceptos como “archivos” o “procesos”.
1. Shell / Interfaz de usuario: Puede ser una interfaz de línea de comandos (como Bash o PowerShell) o una interfaz gráfica (como el escritorio de Windows o GNOME en Linux). Permite al usuario interactuar con el sistema operativo.
1. Aplicaciones: Programas que resuelven tareas específicas del usuario (navegador, editor de texto, juego). Se comunican con el SO a través de APIs, nunca directamente con el hardware.

### El flujo de control y datos entre capas

En este modelo, tanto el control como los datos fluyen verticalmente entre capas adyacentes. Por ejemplo, cuando un usuario hace clic en “Guardar” en una aplicación:

- La aplicación (capa 6) llama a una función del sistema operativo (capa 5), como write().
- El SO valida la petición, gestiona permisos y delega al kernel (capa 3).
- El kernel traduce la operación en instrucciones específicas para el controlador del disco (driver, parte del firmware o del SO).
- Finalmente, el hardware (capa 1) escribe los bits en el medio de almacenamiento.

Cada capa ignora los detalles de las capas no adyacentes. La aplicación no sabe si el archivo se guarda en un SSD o en la nube; solo sabe que el SO le garantiza una operación de escritura fiable. Esta abstracción es clave: permite cambiar el hardware sin reescribir aplicaciones, o actualizar el kernel sin afectar a los usuarios finales.

Este mismo principio de capas se aplica en el desarrollo de software moderno: una aplicación web suele dividirse en capa de presentación (frontend), lógica de negocio (backend) y acceso a datos (base de datos), replicando la misma filosofía de abstracción y dependencia unidireccional.

## Quédate con...

- La arquitectura de software define la estructura esencial de un sistema y guía su evolución a largo plazo.
- Tres principios clave son: modularidad (dividir en partes), encapsulamiento (ocultar detalles internos) y separación de preocupaciones (una responsabilidad por componente).
- El modelo de capas (“cebolla”) organiza el software en niveles jerárquicos: desde el hardware hasta las aplicaciones, pasando por firmware, kernel, sistema operativo e interfaz.
- El flujo de control y datos ocurre entre capas adyacentes, con cada nivel abstrayendo la complejidad del inferior.
- Esta arquitectura no solo describe sistemas operativos, sino que inspira diseños modulares en aplicaciones, redes y sistemas distribuidos.

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/software/arquitectura/abstraccion" class="next">Siguiente</a>
</div>
