---
title: "Entornos de ejecución"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Introducción a entornos de ejecución (runtime environments)](#introducción-a-entornos-de-ejecución-runtime-environments)
  - [Definición](#definición)
  - [Para qué sirven](#para-qué-sirven)
  - [Tipos de runtimes](#tipos-de-runtimes)
  - [Componentes principales](#componentes-principales)
  - [Relación con el sistema operativo](#relación-con-el-sistema-operativo)
  - [Quédate con...](#quédate-con)

</div>

# Introducción a entornos de ejecución (runtime environments)

Cuando escribes un programa en un lenguaje moderno como Python, Java o JavaScript, rara vez se ejecuta directamente sobre el sistema operativo. En cambio, depende de un entorno de ejecución (runtime environment): una capa de software que gestiona aspectos críticos como la memoria, la concurrencia, la seguridad y la interacción con el sistema mientras tu código está en marcha. Este entorno actúa como un “sistema operativo dentro del sistema operativo”, adaptando las capacidades de la máquina a las necesidades específicas del lenguaje o plataforma. Comprender qué es un runtime, cómo funciona y cómo se relaciona con el SO es clave para entender por qué ciertos lenguajes se comportan como lo hacen y cómo optimizar su uso.

## Definición

Un entorno de ejecución es el conjunto de servicios, bibliotecas y procesos que están activos durante la ejecución de un programa y que proporcionan funcionalidades esenciales más allá del código fuente del propio programa. Incluye desde el cargador que pone tu aplicación en memoria hasta el recolector de basura que libera memoria no usada, pasando por intérpretes, máquinas virtuales o sistemas de gestión de hilos. A diferencia del compilador —que actúa antes de la ejecución—, el runtime está presente mientras el programa corre.

## Para qué sirven

Los entornos de ejecución resuelven problemas comunes que serían tediosos, inseguros o ineficientes si cada programador tuviera que implementarlos desde cero:

- Gestión automática de memoria: mediante recolección de basura (como en Java o Python), evitando fugas o accesos inválidos.
- Portabilidad: al ejecutar bytecode en una máquina virtual (como la JVM), el mismo programa puede correr en cualquier sistema que tenga el runtime instalado.
- Seguridad: muchos runtimes imponen sandboxes que limitan lo que el código puede hacer (por ejemplo, acceso a archivos o red).
- Abstracción de concurrencia: ofrecen modelos de hilos, corrutinas o actores que simplifican la programación paralela.
- Integración con el sistema: traducen operaciones del lenguaje (como abrir un archivo) en llamadas al sistema del SO de forma segura y eficiente.

En esencia, el runtime permite que te enfoques en la lógica de tu aplicación, no en los detalles de bajo nivel del hardware o del sistema operativo.

## Tipos de runtimes

Existen varios modelos, según el lenguaje y la arquitectura:

- Interpretado: El código fuente se lee y ejecuta línea por línea en tiempo real (por ejemplo, el intérprete de Python o Ruby). El runtime incluye el analizador léxico, el evaluador y las bibliotecas estándar.
- Basado en máquina virtual: El código se compila a un formato intermedio (bytecode) que una máquina virtual ejecuta. Ejemplo: Java Virtual Machine (JVM) para Java/Kotlin/Scala, o Common Language Runtime (CLR) para .NET (C#, F#).
- Híbrido (JIT): Combina compilación y ejecución dinámica. El runtime interpreta el código al principio, pero compila “al vuelo” (Just-In-Time) las partes críticas a código nativo para mejorar el rendimiento. Usado por V8 (motor de JavaScript en Chrome/Node.js), PyPy (para Python) y la propia JVM en modo optimizado.
- Embebido: Algunos lenguajes ligeros (como Lua o WebAssembly) tienen runtimes minimalistas diseñados para integrarse en aplicaciones más grandes (juegos, navegadores, plugins).

## Componentes principales

Aunque varían según la plataforma, los entornos de ejecución suelen incluir:

- Cargador: responsable de cargar el programa y sus dependencias en memoria.
- Gestor de memoria: asigna y libera memoria, a menudo con un recolector de basura.
- Motor de ejecución: interpreta o ejecuta bytecode/código nativo.
- Bibliotecas estándar: funciones predefinidas para E/S, cadenas, redes, etc.
- Sistema de excepciones: maneja errores y flujos de control anómalos.
- Interfaz con el SO: traduce operaciones del lenguaje en llamadas al sistema (por ejemplo, open() → syscall open).

Ejemplos

- Node.js: Entorno de ejecución para JavaScript fuera del navegador, basado en el motor V8. Incluye APIs para E/S asíncrona, red, sistema de archivos, etc.
- JVM (Java Virtual Machine): Ejecuta bytecode de Java y otros lenguajes; ofrece recolección de basura, seguridad y portabilidad multiplataforma.
- .NET Runtime (CoreCLR): Similar a la JVM, pero para el ecosistema .NET; soporta múltiples lenguajes y compila JIT a código nativo.
- Python Runtime: Incluye el intérprete CPython, el gestor de objetos, el recolector de referencias cíclicas y módulos integrados como os o sys.
- WebAssembly Runtime: Entornos como Wasmtime o el propio navegador ejecutan módulos WebAssembly de forma segura y eficiente, ideal para código de alto rendimiento en la web.

## Relación con el sistema operativo

El entorno de ejecución no reemplaza al sistema operativo; más bien, se apoya en él. El runtime delega en el SO todas las operaciones que requieren privilegios: acceso a disco, red, creación de procesos, etc., usando llamadas al sistema. Sin embargo, introduce una capa adicional de abstracción:

- El SO ve al runtime como un único proceso (con su propio espacio de memoria y hilos).
- El runtime, a su vez, multiplexa ese proceso para ejecutar múltiples tareas lógicas (hilos de usuario, corrutinas, eventos).
- Esto permite mayor control (por ejemplo, planificación cooperativa en Node.js) y aislamiento (una excepción en JavaScript no mata el navegador).

En sistemas modernos, es común ver una pila como:
Aplicación → Entorno de ejecución (ej. V8) → Sistema operativo → Kernel → Hardware.

Esta jerarquía refuerza los principios de abstracción y separación de preocupaciones: cada capa resuelve un problema específico sin sobrecargar a las demás.

## Quédate con...

- Un entorno de ejecución (runtime) es el software que da soporte a un programa mientras se está ejecutando, gestionando memoria, concurrencia, seguridad y más.
- Permite abstraer la complejidad del sistema operativo y del hardware, facilitando el desarrollo en lenguajes de alto nivel.
- Existen distintos tipos: interpretados (Python), basados en máquina virtual (JVM), híbridos con JIT (V8) y embebidos (Lua, WebAssembly).
- Siempre depende del sistema operativo para acceder a recursos reales, pero añade una capa de control y portabilidad.
- Comprender el runtime de tu lenguaje te ayuda a escribir código más eficiente, depurar mejor y tomar decisiones informadas sobre arquitectura y despliegue.

<div class="pagination">
  <a href="/markdown/sistemas/software/arquitectura/capas" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
