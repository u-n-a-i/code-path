---
title: "Estrategias de ramificación"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Estrategias de ramificación](#estrategias-de-ramificación)
  - [Feature branches (una rama por funcionalidad)](#feature-branches-una-rama-por-funcionalidad)
  - [Git Flow (main, develop, feature, release, hotfix)](#git-flow-main-develop-feature-release-hotfix)
  - [Trunk-Based Development (menos ramas, más integración continua)](#trunk-based-development-menos-ramas-más-integración-continua)
  - [Quédate con...](#quédate-con)

</div>

# Estrategias de ramificación

Las ramas en Git no son solo una herramienta técnica para aislar cambios: son el mecanismo central mediante el cual los equipos coordinan trabajo paralelo, gestionan riesgos de despliegue y definen su cadencia de entrega de software. Una estrategia de ramificación establece las reglas del juego: cuándo se crea una rama, cuánto tiempo vive, hacia dónde se fusiona y qué representa cada línea de desarrollo en el contexto del ciclo de vida del producto. No existe una estrategia universalmente óptima: la elección depende del tamaño del equipo, la frecuencia de releases, la madurez de la automatización de pruebas y la tolerancia al riesgo de integración. Comprender estos modelos permite seleccionar el flujo de trabajo que equilibra estabilidad operativa con velocidad de desarrollo.

## Feature branches (una rama por funcionalidad)

El modelo de feature branches es la unidad fundamental de aislamiento en Git. Cada nueva funcionalidad, corrección de bug o experimento se desarrolla en una rama temporal creada desde la rama principal (típicamente `main` o `develop`). Esta rama vive únicamente mientras dura el desarrollo de esa tarea específica: puede horas, días o semanas, pero nunca se convierte en una línea de desarrollo permanente.

El flujo de trabajo es directo: se crea la rama (`git switch -c feature/login`), se realizan commits aislados, se prueba localmente, y finalmente se fusiona de vuelta a la rama principal mediante un pull request o merge directo. Una vez integrada, la rama temporal se elimina, manteniendo el espacio de nombres limpio. Esta práctica permite que múltiples desarrolladores trabajen en paralelo sin bloquearse mutuamente: el desarrollador A puede estar en `feature/pagos` mientras el desarrollador B está en `feature/usuarios`, sin que sus cambios incompletos se interfieran hasta que estén listos para integración.

La ventaja principal es el aislamiento de riesgo: si una funcionalidad resulta defectuosa o se cancela, la rama se descarta sin afectar la estabilidad del proyecto principal. Sin embargo, ramas de larga duración (vivir semanas o meses sin integrarse) generan "deuda de integración": cuanto más diverge la rama de la principal, más complejos serán los conflictos de merge al momento de fusionar. Por esta razón, las feature branches deben ser efímeras: crear, desarrollar, integrar, eliminar.

> El nombre de las ramas sigue convenciones que facilitan la organización: `feature/`, `bugfix/`, `hotfix/`, `experiment/`. Estos prefijos no tienen significado técnico para Git, pero permiten a los equipos filtrar ramas en herramientas visuales y entender el propósito de cada línea de desarrollo de un vistazo.

## Git Flow (main, develop, feature, release, hotfix)

Git Flow, popularizado por Vincent Driessen en 2010, es un modelo estricto que define roles específicos para cada tipo de rama. Fue diseñado en una era donde los releases de software eran eventos planificados con semanas de anticipación, no despliegues continuos. Su estructura jerárquica proporciona claridad sobre el estado de cada cambio pero introduce complejidad operativa que puede ser excesiva para equipos modernos.

El modelo define dos ramas de larga duración: `main` (o `master`) representa el historial de versiones en producción, siempre estable y etiquetada con números de versión (`v1.0.0`, `v1.1.0`). `develop` es la rama de integración principal donde se consolidan las funcionalidades completadas antes de llegar a producción.

Sobre estas bases, se crean ramas temporales con propósitos específicos:
- **Feature branches:** Se crean desde `develop`, se desarrollan aisladas, y se fusionan de vuelta a `develop`. Nunca tocan `main` directamente.
- **Release branches:** Cuando `develop` tiene suficientes funcionalidades para un release, se crea una rama `release/v1.1`. Aquí se realizan ajustes finales, correcciones menores y preparación de documentación. Una vez lista, se fusiona tanto a `main` (con tag de versión) como a `develop` (para sincronizar cambios de preparación).
- **Hotfix branches:** Se crean desde `main` para corregir bugs críticos en producción. Se fusionan tanto a `main` (con nuevo tag) como a `develop` para asegurar que la corrección esté en la siguiente versión.

Esta estructura proporciona trazabilidad clara: se sabe exactamente qué está en producción, qué está en preparación y qué está en desarrollo. Sin embargo, la complejidad de mantener sincronizadas `main` y `develop`, junto con la proliferación de ramas de release, puede ralentizar la entrega continua. Equipos que despliegan múltiples veces al día encuentran en Git Flow una burocracia innecesaria.

> Git Flow asume que `main` es sagrada y solo recibe merges desde release o hotfix. En la práctica, muchas variantes modernas simplifican el modelo eliminando la rama `develop` permanente y fusionando features directamente a `main` tras revisión, acercándose más a GitHub Flow.

## Trunk-Based Development (menos ramas, más integración continua)

Trunk-Based Development (TBD) es la estrategia predominante en equipos que practican integración y despliegue continuos (CI/CD). En lugar de ramas de larga duración que viven aisladas, los desarrolladores trabajan en ramas muy cortas (menos de un día) o directamente sobre la rama principal (`trunk`, típicamente `main`). El objetivo es minimizar la divergencia: los cambios se integran frecuentemente, idealmente varias veces al día, reduciendo drásticamente los conflictos de merge.

En su forma más pura, los desarrolladores hacen commit directamente a `main`. En formas más comunes, usan ramas temporales que viven horas, no días, y se fusionan tras revisión de código automatizada y manual. La clave es que ninguna rama permanece aislada lo suficiente como para divergir significativamente del trunk.

Para manejar funcionalidades incompletas sin romper la rama principal, TBD utiliza *feature flags* (banderas de funcionalidad): código condicional que permite mergear lógica incompleta pero desactivada en producción. Esto desacopla el despliegue (llevar código a producción) del release (activar funcionalidad para usuarios). El código viaja integrado, pero la experiencia de usuario se controla mediante configuración.

La ventaja de TBD es la velocidad de feedback: los errores de integración se detectan minutos después del commit, no semanas después. La rama principal está siempre lista para desplegar. La desventaja es la exigencia cultural y técnica: requiere pruebas automatizadas robustas, disciplina de commits pequeños y madurez en gestión de feature flags. Sin estas bases, TBD puede resultar en una rama principal inestable que rompe producción frecuentemente.

> Trunk-Based no significa "sin ramas": significa ramas de vida extremadamente corta. La distinción clave es temporal: una rama que vive horas es TBD; una rama que vive semanas es feature branching tradicional. La herramienta no cambia, pero la disciplina de integración sí.

## Quédate con...

*   Las estrategias de ramificación definen reglas de coordinación: cuándo crear ramas, cuánto viven, hacia dónde se fusionan y qué representa cada línea en el ciclo de release.
*   Feature branches aíslan trabajo por tarea, permitiendo desarrollo paralelo sin interferencias, pero requieren integración frecuente para evitar deuda de merge y conflictos complejos.
*   Git Flow estructura el desarrollo con ramas permanentes (`main`, `develop`) y temporales (feature, release, hotfix), ideal para releases planificados pero complejo para despliegue continuo.
*   Trunk-Based Development prioriza integración frecuente (varias veces al día) con ramas de vida corta o commit directo a `main`, habilitando CI/CD pero exigiendo pruebas automatizadas robustas.
*   Los feature flags permiten mergear código incompleto en Trunk-Based, desacoplando despliegue técnico de release funcional para usuarios finales.
*   La elección de estrategia depende del contexto: Git Flow para ciclos de release tradicionales con ventanas de mantenimiento; Trunk-Based para equipos maduros en automatización que buscan velocidad de entrega máxima.


<div class="pagination">
  <a href="/markdown/sistemas/git/ramas/trabajo" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/ramas/conflictos" class="next">Siguiente</a>
</div>
