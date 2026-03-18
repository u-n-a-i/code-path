---
title: "Flujo colaborativo básico"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Flujo colaborativo básico](#flujo-colaborativo-básico)
  - [Trabajar en rama local → push → otro colaborador hace pull](#trabajar-en-rama-local--push--otro-colaborador-hace-pull)
    - [Paso 1: Trabajar en rama local](#paso-1-trabajar-en-rama-local)
    - [Paso 2: Push para compartir trabajo](#paso-2-push-para-compartir-trabajo)
    - [Paso 3: Otro colaborador hace pull](#paso-3-otro-colaborador-hace-pull)
  - [Importancia de `git fetch` para ver cambios sin fusionar](#importancia-de-git-fetch-para-ver-cambios-sin-fusionar)
  - [Mejores prácticas para flujo colaborativo](#mejores-prácticas-para-flujo-colaborativo)
  - [Quédate con...](#quédate-con)

</div>

# Flujo colaborativo básico

El desarrollo de software en equipo transforma Git de una herramienta de control de versiones personal en un sistema de coordinación distribuida. Múltiples desarrolladores trabajan en paralelo sobre el mismo código base, cada uno con su repositorio local, sincronizando cambios mediante un repositorio remoto compartido. Este flujo requiere disciplina: saber cuándo compartir trabajo, cómo integrar contribuciones ajenas y qué mecanismos usar para evitar conflictos innecesarios. Comprender la secuencia básica de colaboración —trabajar localmente, publicar cambios, recibir actualizaciones— es fundamental para participar efectivamente en cualquier proyecto colaborativo.

## Trabajar en rama local → push → otro colaborador hace pull

El flujo colaborativo estándar sigue una secuencia predecible donde cada desarrollador mantiene autonomía local mientras coordina globalmente mediante el remoto.

### Paso 1: Trabajar en rama local

Cada desarrollador crea una rama local para su tarea específica, trabajando aislado sin afectar a otros:

```bash
# Crear rama para tu funcionalidad
$ git switch -c feature-autenticacion

# Trabajar localmente: editar, añadir, commit
$ git add src/auth.py
$ git commit -m "Implementar login con JWT"

# Múltiples commits son normales en desarrollo local
$ git commit -m "Añadir validación de token"
$ git commit -m "Corregir error en logout"
```

El trabajo local es privado: los commits existen solo en tu máquina. Puedes experimentar, cometer errores, reescribir historial con `rebase` o `--amend` sin consecuencias para el equipo. Esta libertad es una ventaja clave del modelo distribuido.

### Paso 2: Push para compartir trabajo

Cuando la funcionalidad está completa y probada localmente, se publica al repositorio remoto:

```bash
# Primera vez: establecer upstream y publicar
$ git push -u origin feature-autenticacion

# Pushes posteriores en la misma rama
$ git push
```

Este paso hace visible tu trabajo para el equipo. En plataformas como GitHub o GitLab, la rama publicada puede asociarse a un *pull request* o *merge request* para revisión de código antes de integrarse a la rama principal.

### Paso 3: Otro colaborador hace pull

Los demás desarrolladores, trabajando en sus propias ramas, necesitan mantenerse actualizados con los cambios publicados:

```bash
# En la rama main de otro colaborador
$ git switch main
$ git pull origin main

# O en su propia rama de trabajo
$ git switch feature-dashboard
$ git pull origin main  # Traer cambios principales para mantenerse al día
```

El `pull` integra los cambios del remoto, asegurando que todos trabajen sobre una base actualizada. Esto reduce conflictos futuros: integrar cambios frecuentes es menos doloroso que integrar semanas de trabajo divergente.

```
Desarrollador A                    Repositorio Remoto              Desarrollador B
     |                                    |                              |
     |--- work locally ------------------|                              |
     |--- commit x3 --------------------|                              |
     |--- push feature-auth ----------->|                              |
     |                                    |<--- pull ------------------|
     |                                    |--- feature-auth visible ---|
     |                                    |                              |--- work on feature-dashboard
```

> Antes de hacer push, siempre verifica que tu rama local esté actualizada con el remoto. Si otros desarrolladores publicaron cambios en la misma rama, `git pull` primero para integrar sus trabajo, luego haz `git push`. Esto previene rechazos por divergencia de historial.

## Importancia de `git fetch` para ver cambios sin fusionar

`git fetch` es la operación de sincronización más segura en Git: descarga información del repositorio remoto (commits, ramas, tags) sin modificar tu directorio de trabajo ni integrar cambios automáticamente. Esta separación entre *descargar* y *fusionar* proporciona control y visibilidad antes de comprometerse con la integración.

```bash
# Descargar cambios del remoto sin integrar
$ git fetch origin

# Ver qué ramas remotas existen
$ git branch -r
  origin/main
  origin/feature-autenticacion
  origin/feature-dashboard

# Ver commits en remoto que no tienes localmente
$ git log HEAD..origin/main --oneline

# Ver diferencias específicas antes de integrar
$ git diff main origin/main
```

Esta inspección previa es valiosa para:

1.  **Evaluar impacto:** Ver qué cambios vienen antes de integrarlos permite anticipar conflictos o problemas de compatibilidad.
2.  **Revisar trabajo ajeno:** Examinar commits de otros desarrolladores antes de fusionar facilita detectar errores o decisiones cuestionables.
3.  **Decidir estrategia:** Conocer los cambios permite elegir entre `merge` (preservar historial de fusión) o `rebase` (historial lineal) conscientemente.
4.  **Preparar resolución de conflictos:** Si anticipas conflictos, puedes preparar mentalmente o técnicamente la resolución antes de ejecutar `pull`.

```bash
# Flujo recomendado para integración controlada
$ git fetch origin                    # Descargar sin integrar
$ git log HEAD..origin/main --oneline # Inspeccionar cambios
$ git diff main origin/main           # Ver diferencias de código
$ git merge origin/main               # Integrar cuando estés listo
# O alternativamente:
$ git rebase origin/main              # Reescribir historial local sobre remoto
```

Comparado con `git pull` que descarga e integra automáticamente, `fetch` + `merge/rebase` explícito ofrece transparencia total sobre qué se está integrando y cuándo.

> `git fetch` es siempre seguro: no modifica archivos locales, no crea conflictos, no pierde trabajo. Puede ejecutarse frecuentemente sin riesgo. En equipos grandes, algunos desarrolladores configuran alias como `git fa` para `git fetch --all` y lo ejecutan varias veces al día para mantenerse informados de cambios remotos.

## Mejores prácticas para flujo colaborativo

La colaboración efectiva requiere más que conocer comandos: exige disciplina y comunicación.

| Práctica | Descripción | Beneficio |
|----------|-------------|-----------|
| **Pull frecuente** | Hacer `git pull` (o `fetch`) varias veces al día | Reduce conflictos al integrar cambios pequeños gradualmente |
| **Push temprano** | Publicar ramas aunque estén incompletas | Permite backup remoto y visibilidad para el equipo |
| **Ramas cortas** | Mantener ramas de feature efímeras (días, no semanas) | Minimiza divergencia y complejidad de merge |
| **Comunicar cambios grandes** | Avisar al equipo antes de cambios que afectan múltiples archivos | Permite coordinación y previene conflictos sorpresivos |
| **Revisar antes de integrar** | Usar `fetch` + `log`/`diff` antes de `pull` | Anticipa problemas y facilita resolución de conflictos |

```bash
# Rutina diaria recomendada
$ git fetch origin              # Por la mañana: ver qué hay de nuevo
$ git log HEAD..origin/main --oneline  # Revisar cambios del equipo
$ # ... trabajar localmente ...
$ git push                      # Al terminar: compartir progreso
```

> En equipos que usan *pull requests*, el push no integra directamente a `main`: publica la rama para revisión. La integración ocurre tras aprobación, mediante merge en la plataforma. Este flujo añade control de calidad pero no cambia la mecánica básica de fetch/push/pull.

## Quédate con...

*   El flujo colaborativo básico es: trabajar en rama local → push para compartir → otros colaboradores hacen pull para recibir cambios.
*   El trabajo local es privado hasta que se hace push: permite experimentación y reescritura de historial sin afectar al equipo.
*   `git fetch` descarga cambios del remoto sin integrar, ofreciendo visibilidad completa antes de decidir cómo fusionar.
*   Separar `fetch` + `merge` explícito proporciona más control que `pull` automático, permitiendo inspección previa de cambios.
*   Hacer fetch/pull frecuentemente (varias veces al día) reduce conflictos al integrar cambios pequeños gradualmente en lugar de grandes divergencias.
*   Publicar ramas temprano (aunque estén incompletas) proporciona backup remoto y visibilidad para el equipo, facilitando colaboración asíncrona.
*   La comunicación sobre cambios grandes que afectan múltiples archivos previene conflictos sorpresivos y permite coordinación proactiva del equipo.

<div class="pagination">
  <a href="/markdown/sistemas/git/remotos/sincronizar" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/remotos/ramas" class="next">Siguiente</a>
</div>
