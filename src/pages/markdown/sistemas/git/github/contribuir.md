---
title: "Forks y contribución a proyectos ajenos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Forks y contribución a proyectos ajenos](#forks-y-contribución-a-proyectos-ajenos)
  - [Hacer fork del repositorio original](#hacer-fork-del-repositorio-original)
    - [Pasos para crear un fork](#pasos-para-crear-un-fork)
  - [Clonar tu fork, crear rama, hacer cambios](#clonar-tu-fork-crear-rama-hacer-cambios)
    - [Paso 1: Clonar tu fork localmente](#paso-1-clonar-tu-fork-localmente)
    - [Paso 2: Configurar remote upstream](#paso-2-configurar-remote-upstream)
    - [Paso 3: Sincronizar con upstream antes de trabajar](#paso-3-sincronizar-con-upstream-antes-de-trabajar)
    - [Paso 4: Crear rama de trabajo](#paso-4-crear-rama-de-trabajo)
  - [Abrir PR al repositorio original](#abrir-pr-al-repositorio-original)
    - [Pasos para crear el PR](#pasos-para-crear-el-pr)
    - [Plantilla recomendada para PR de contribución](#plantilla-recomendada-para-pr-de-contribución)
  - [Mantener el fork sincronizado](#mantener-el-fork-sincronizado)
  - [Mejores prácticas para contribución open source](#mejores-prácticas-para-contribución-open-source)
  - [Flujo completo resumido](#flujo-completo-resumido)
  - [Quédate con...](#quédate-con)

</div>

# Forks y contribución a proyectos ajenos

Contribuir a proyectos de código abierto o colaborar en repositorios donde no tienes permisos de escritura requiere un flujo de trabajo específico: el modelo de *fork and pull*. En lugar de trabajar directamente sobre el repositorio original, creas una copia personal bajo tu cuenta, desarrollas cambios en esa copia, y luego solicitas formalmente que los mantenedores del proyecto original integren tu trabajo. Este modelo protege el repositorio principal de cambios no revisados mientras permite que cualquiera en el mundo pueda proponer mejoras. Comprender este flujo es esencial para participar en comunidades open source, contribuir a librerías de terceros o colaborar en proyectos organizacionales con permisos restringidos.

## Hacer fork del repositorio original

Un *fork* es una copia completa de un repositorio de GitHub que se crea bajo tu cuenta de usuario. No es un clon local: es un repositorio remoto independiente que vive en los servidores de GitHub, vinculado al original pero bajo tu control total.

### Pasos para crear un fork

1.  **Navega al repositorio original** en GitHub (ej. `github.com/proyecto-original/libreria`)
2.  **Click en "Fork"** (esquina superior derecha)
3.  **Selecciona tu cuenta** como destino del fork
4.  **GitHub crea la copia** en `github.com/tu-usuario/libreria`

```
Repositorio Original (upstream)        Tu Fork
github.com/proyecto/libreria    →    github.com/tu-usuario/libreria
       (sin permisos de write)          (control total)
```

El fork incluye:
*   Todo el historial de commits
*   Todas las ramas y tags
*   Issues y wikis (opcional, configurable al crear fork)
*   **Vínculo al upstream:** GitHub registra la relación entre tu fork y el original

> Hacer fork es gratuito para repositorios públicos. Para repositorios privados, necesitas permisos explícitos del propietario. El fork de un repo privado permanece privado bajo tu cuenta.

## Clonar tu fork, crear rama, hacer cambios

Una vez creado el fork, trabajas sobre él como cualquier repositorio Git, pero con una configuración especial de remotos para mantener sincronización con el original.

### Paso 1: Clonar tu fork localmente

```bash
# Clonar TU fork, no el original
$ git clone https://github.com/tu-usuario/libreria.git
$ cd libreria

# Verificar remotos configurados
$ git remote -v
origin  https://github.com/tu-usuario/libreria.git (fetch)
origin  https://github.com/tu-usuario/libreria.git (push)
```

Por defecto, `origin` apunta a tu fork. Esto es correcto: harás push a tu fork, no al repositorio original.

### Paso 2: Configurar remote upstream

Añade una referencia al repositorio original para poder sincronizar cambios:

```bash
# Añadir upstream como remote adicional
$ git remote add upstream https://github.com/proyecto-original/libreria.git

# Verificar configuración
$ git remote -v
origin  https://github.com/tu-usuario/libreria.git (fetch)
origin  https://github.com/tu-usuario/libreria.git (push)
upstream  https://github.com/proyecto-original/libreria.git (fetch)
upstream  https://github.com/proyecto-original/libreria.git (push)
```

Esta configuración es crítica:
*   `origin` → Tu fork (donde haces push)
*   `upstream` → Repositorio original (donde haces fetch para actualizar)

> Nunca tendrás permisos de push a `upstream`. Solo puedes leer desde él. Todo tu trabajo se publica en `origin` (tu fork), y desde ahí abres PR al original.

### Paso 3: Sincronizar con upstream antes de trabajar

Antes de crear una rama de trabajo, asegura que tu fork esté actualizado con el original:

```bash
# Fetch desde upstream
$ git fetch upstream

# Checkout a rama main local
$ git switch main

# Merge de cambios de upstream a tu main local
$ git merge upstream/main

# Push a tu fork para sincronizar origin también
$ git push origin main
```

Esto previene conflictos futuros: trabajas sobre la base más reciente del proyecto original.

### Paso 4: Crear rama de trabajo

```bash
# Crear rama para tu contribución
$ git switch -c fix/correctir-error-validacion

# Trabajar localmente
$ git add src/validator.py
$ git commit -m "Corregir regex de validación de email"

# Push a TU fork (origin)
$ git push -u origin fix/correctir-error-validacion
```

## Abrir PR al repositorio original

Una vez publicados los cambios en tu fork, solicitas que los mantenedores del proyecto original los integren mediante un Pull Request.

### Pasos para crear el PR

1.  **Navega a tu fork** en GitHub (`github.com/tu-usuario/libreria`)
2.  **GitHub muestra banner** comparando con el original: "This branch is 1 commit ahead of proyecto-original:main"
3.  **Click en "Compare & pull request"**
4.  **Verifica dirección del PR:**
    *   **Base repository:** `proyecto-original/libreria` (el original)
    *   **Base branch:** `main` (o la rama donde quieren recibir contribuciones)
    *   **Head repository:** `tu-usuario/libreria` (tu fork)
    *   **Compare branch:** `fix/correctir-error-validacion` (tu rama)

```
Dirección del Pull Request:
[proyecto-original/libreria:main] ← [tu-usuario/libreria:fix/correctir-error-validacion]
         (destino)                              (origen)
```

5.  **Completa la descripción del PR:**
    *   Título claro y descriptivo
    *   Explicación del problema que resuelve
    *   Pasos para reproducir/verificar
    *   Referencia a issues relacionados (`Fixes #123`)

6.  **Submit Pull Request**

### Plantilla recomendada para PR de contribución

```markdown
## Descripción
Corrige el regex de validación de email que rechazaba dominios válidos como .io y .dev

## Cambios
- Actualiza patrón regex en src/validator.py
- Añade tests para nuevos dominios

## Issue relacionado
Fixes #456

## Checklist
- [ ] Tests locales pasan
- [ ] Seguí la guía de contribución del proyecto
- [ ] Documentación actualizada si aplica
```

> Muchos proyectos tienen plantillas de PR automáticas (`.github/PULL_REQUEST_TEMPLATE.md`). Completa todas las secciones requeridas: PRs incompletos pueden ser cerrados sin revisión.

## Mantener el fork sincronizado

Mientras tu PR está bajo revisión, el repositorio original puede avanzar. Mantener tu fork actualizado previene conflictos y muestra profesionalismo.

```bash
# Rutina de sincronización periódica
$ git fetch upstream              # Obtener cambios del original
$ git switch main                 # Ir a rama principal
$ git merge upstream/main         # Integrar cambios
$ git push origin main            # Actualizar tu fork remoto

# Actualizar tu rama de trabajo
$ git switch fix/correctir-error-validacion
$ git rebase main                 # Reescribir sobre main actualizado
$ git push --force-with-lease     # Actualizar PR (force necesario tras rebase)
```

El rebase mantiene el PR limpio: tus commits aparecen como si se hubieran hecho sobre la última versión del original, no sobre una versión obsoleta.

> Si hay conflictos durante el rebase, resuélvelos localmente, continúa con `git rebase --continue`, y luego haz push forzado. El PR en GitHub se actualiza automáticamente mostrando los nuevos commits.

## Mejores prácticas para contribución open source

Contribuir a proyectos ajenos requiere sensibilidad hacia las normas de la comunidad y el tiempo de los mantenedores.

| Práctica | Descripción | Razón |
|----------|-------------|-------|
| **Leer CONTRIBUTING.md** | Muchos proyectos tienen guías de contribución | Evita PRs rechazados por no seguir normas |
| **Issues antes de PRs** | Abrir issue discutiendo el cambio antes de codificar | Previene trabajo en cambios que no serán aceptados |
| **PRs pequeños** | Cambios enfocados en un solo problema | Más fácil de revisar, más rápido de merge |
| **Tests incluidos** | PRs con código nuevo incluyen tests correspondientes | Demuestra que el cambio funciona y previene regresiones |
| **Seguir estilo del proyecto** | Linting, formato, convenciones de nombres existentes | Mantiene coherencia del código base |
| **Responder feedback** | Atender comentarios de revisores rápidamente | Mantiene momentum, muestra compromiso |
| **Ser paciente** | Mantenedores son voluntarios, pueden tardar en responder | Evita follow-ups agresivos o múltiples pings |

```bash
# ❌ Mal: PR sin contexto
Título: "fix stuff"
Descripción: (vacía)
Cambios: 50 archivos modificados sin explicación

# ✅ Bien: PR profesional
Título: "Corregir validación de email para dominios .io y .dev"
Descripción: Explica problema, solución, cómo probar
Cambios: 2 archivos, 30 líneas, tests incluidos
Issue: Referencia #456 con discusión previa
```

> Algunos proyectos requieren que firmes un CLA (*Contributor License Agreement*) antes de que tu PR pueda ser mergeado. Esto es común en proyectos corporativos (Google, Microsoft, Facebook). El bot del proyecto te notificará si es necesario.

## Flujo completo resumido

```bash
# 1. Hacer fork en GitHub (interfaz web)

# 2. Clonar tu fork
$ git clone https://github.com/tu-usuario/proyecto.git
$ cd proyecto

# 3. Configurar upstream
$ git remote add upstream https://github.com/original/proyecto.git

# 4. Sincronizar con original
$ git fetch upstream
$ git merge upstream/main

# 5. Crear rama de trabajo
$ git switch -c fix/mi-contribucion

# 6. Trabajar y commit
$ git add .
$ git commit -m "Descripción clara del cambio"

# 7. Push a tu fork
$ git push -u origin fix/mi-contribucion

# 8. Abrir PR en GitHub hacia repositorio original

# 9. Atender feedback, hacer commits adicionales si necesario
$ git add .
$ git commit -m "Atender comentarios de revisión"
$ git push  # Actualiza PR automáticamente

# 10. Tras merge: limpiar ramas
$ git switch main
$ git pull upstream main
$ git branch -d fix/mi-contribucion
```

## Quédate con...

*   Un fork es una copia remota del repositorio bajo tu cuenta de GitHub, que te permite trabajar sin permisos en el original.
*   Configurar dos remotos es esencial: `origin` (tu fork, para push) y `upstream` (original, para fetch y sincronización).
*   El PR se abre desde tu fork hacia el repositorio original, no al revés.
*   Sincronizar periódicamente con `upstream` previene conflictos y mantiene tu contribución relevante.
*   Leer `CONTRIBUTING.md` y abrir issues antes de PRs grandes demuestra respeto por las normas del proyecto.
*   PRs pequeños, bien documentados y con tests tienen mayor probabilidad de ser aceptados por mantenedores.
*   La paciencia y comunicación profesional son clave: mantenedores de open source suelen ser voluntarios con tiempo limitado.

<div class="pagination">
  <a href="/markdown/sistemas/git/github/pull_requests" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/github/plantillas" class="next">Siguiente</a>
</div>
