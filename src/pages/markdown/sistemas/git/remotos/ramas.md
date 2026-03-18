---
title: "Manejo de ramas remotas"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Manejo de ramas remotas](#manejo-de-ramas-remotas)
  - [Seguimiento de ramas (tracking branches)](#seguimiento-de-ramas-tracking-branches)
    - [Crear rama local desde rama remota](#crear-rama-local-desde-rama-remota)
    - [Configurar tracking en rama existente](#configurar-tracking-en-rama-existente)
    - [Ver configuración de tracking](#ver-configuración-de-tracking)
  - [Eliminar ramas remotas](#eliminar-ramas-remotas)
    - [Eliminar rama remota](#eliminar-rama-remota)
    - [Eliminar rama local después de merge](#eliminar-rama-local-después-de-merge)
    - [Limpieza de referencias remotas obsoletas](#limpieza-de-referencias-remotas-obsoletas)
  - [Flujo completo de ciclo de vida de rama remota](#flujo-completo-de-ciclo-de-vida-de-rama-remota)
  - [Quédate con...](#quédate-con)

</div>

# Manejo de ramas remotas

Las ramas remotas no son entidades separadas de las locales: son referencias que Git mantiene para rastrear el estado de las ramas en el repositorio remoto. Comprender cómo vincular ramas locales con sus contrapartes remotas, cómo crear ramas locales que sigan automáticamente ramas remotas, y cómo limpiar ramas obsoletas tanto local como remotamente, es esencial para mantener un repositorio colaborativo organizado. Esta gestión previene la acumulación de referencias huérfanas, facilita la sincronización de trabajo y asegura que el espacio de nombres de ramas refleje el estado real del desarrollo del equipo.

## Seguimiento de ramas (tracking branches)

Una rama de seguimiento (*tracking branch*) es una rama local configurada para vincularse explícitamente con una rama remota específica. Esta vinculación permite que comandos como `git push` y `git pull` funcionen sin especificar remotamente la rama destino cada vez: Git sabe automáticamente hacia dónde enviar o desde dónde recibir cambios.

### Crear rama local desde rama remota

Cuando un colaborador publica una rama nueva en el remoto, puedes crear una rama local que la siga automáticamente:

```bash
# Ver ramas remotas disponibles
$ git branch -r
  origin/main
  origin/feature-autenticacion
  origin/feature-dashboard

# Crear rama local que sigue a la remota
$ git checkout -b feature-autenticacion origin/feature-autenticacion
# O con git switch (moderno):
$ git switch -c feature-autenticacion origin/feature-autenticacion
```

Git configura automáticamente el *upstream* de la rama local. Esto significa que:

```bash
# Estos comandos funcionan sin especificar remote/branch
$ git push        # Equivale a: git push origin feature-autenticacion
$ git pull        # Equivale a: git pull origin feature-autenticacion
$ git status      # Muestra si estás adelantado/atrasado respecto a origin
```

La salida de `git status` refleja esta vinculación:

```bash
$ git status
On branch feature-autenticacion
Your branch is up to date with 'origin/feature-autenticacion'.
```

### Configurar tracking en rama existente

Si ya tienes una rama local y quieres vincularla a una remota existente:

```bash
# Establecer upstream manualmente
$ git branch -u origin/feature-autenticacion

# O durante el push inicial
$ git push -u origin feature-autenticacion
```

El flag `-u` (o `--set-upstream`) es comúnmente usado la primera vez que se publica una rama nueva, estableciendo el vínculo para operaciones futuras simplificadas.

### Ver configuración de tracking

```bash
# Ver todas las ramas con su upstream
$ git branch -vv
* feature-autenticacion  a1b2c3d [origin/feature-autenticacion] Implementar login
  main                   b2c3d4e [origin/main] Última versión estable

# Ver upstream de rama actual
$ git rev-parse --abbrev-ref @{u}
origin/feature-autenticacion
```

La opción `-vv` muestra información detallada: nombre de rama, hash del último commit, rama remota de seguimiento, y mensaje del último commit. Las ramas sin upstream no muestran referencia entre corchetes.

> Las ramas de tracking no son copias en tiempo real de las ramas remotas. Solo se actualizan cuando ejecutas `git fetch` o `git pull`. Si un colaborador actualiza la rama remota, tu referencia local `origin/feature` no cambia hasta que haces fetch. Esto es intencional: te permite trabajar offline sin que cambios remotos afecten tu entorno hasta que decidas sincronizar.

## Eliminar ramas remotas

Las ramas remotas acumuladas con el tiempo crean ruido visual, dificultan la navegación y pueden causar confusión sobre qué líneas de desarrollo están activas. La limpieza periódica es una práctica de higiene del repositorio.

### Eliminar rama remota

```bash
# Eliminar rama del repositorio remoto
$ git push origin --delete feature-autenticacion

# Verificar que se eliminó
$ git branch -r
  origin/main
  origin/feature-dashboard
  # feature-autenticacion ya no aparece
```

Este comando elimina la rama del servidor remoto (GitHub, GitLab, etc.). Los commits que solo existían en esa rama permanecen en el repositorio pero quedan huérfanos hasta que la recolección de basura los elimine.

### Eliminar rama local después de merge

Tras eliminar la rama remota, es común limpiar también la rama local correspondiente:

```bash
# Eliminar rama local (solo si ya fue fusionada)
$ git branch -d feature-autenticacion

# Forzar eliminación (incluso si no fue fusionada)
$ git branch -D feature-autenticacion
```

El flag `-d` (delete) verifica que la rama haya sido fusionada antes de eliminar, previniendo pérdida accidental de trabajo. El flag `-D` fuerza la eliminación sin verificar, útil cuando estás seguro de que el trabajo ya está integrado o puede descartarse.

### Limpieza de referencias remotas obsoletas

Cuando otros desarrolladores eliminan ramas remotas, tus referencias locales a esas ramas (`origin/feature-x`) pueden persistir, mostrando ramas que ya no existen en el servidor:

```bash
# Ver ramas remotas que ya no existen en el servidor
$ git branch -r

# Limpiar referencias locales a ramas remotas eliminadas
$ git fetch --prune
# O configurar prune automático:
$ git config --global fetch.prune true
```

El flag `--prune` elimina referencias locales a ramas que ya no existen en el remoto, manteniendo tu lista de ramas remotas sincronizada con el estado real del servidor.

> Eliminar una rama remota es una operación compartida: afecta a todos los colaboradores. Antes de eliminar, verifica que: (1) la rama ya fue fusionada a `main` o la rama principal, (2) ningún otro desarrollador está trabajando activamente en ella, (3) no hay pull requests abiertos asociados. En equipos grandes, coordinar la eliminación de ramas evita sorpresas para colegas que puedan estar usando esa rama.

## Flujo completo de ciclo de vida de rama remota

```bash
# 1. Crear rama local desde remota
$ git switch -c feature-login origin/feature-login

# 2. Trabajar localmente
$ git add .
$ git commit -m "Añadir formulario de login"

# 3. Publicar cambios
$ git push  # Usa upstream configurado

# 4. Tras merge en remoto (vía pull request)
# Eliminar rama remota
$ git push origin --delete feature-login

# 5. Limpiar rama local
$ git branch -d feature-login

# 6. Limpiar referencias obsoletas
$ git fetch --prune
```

Este ciclo mantiene el repositorio limpio: ramas activas visibles, ramas completadas eliminadas, referencias sincronizadas con el estado real del remoto.

> Plataformas como GitHub y GitLab ofrecen opciones para eliminar automáticamente la rama remota tras merge del pull request. Habilitar esta opción (`Settings → Merge button → Delete branch on merge`) automatiza la limpieza y reduce la carga manual de mantenimiento.

## Quédate con...

*   Las ramas de seguimiento (*tracking branches*) vinculan ramas locales con remotas, permitiendo `git push` y `git pull` sin especificar remote/branch explícitamente.
*   `git checkout -b <local> origin/<remota>` o `git switch -c <local> origin/<remota>` crean ramas locales que siguen automáticamente ramas remotas.
*   `git branch -vv` muestra todas las ramas locales con sus upstreams configurados, facilitando auditoría de vinculación.
*   `git push origin --delete <rama>` elimina la rama del repositorio remoto; coordinar con el equipo antes de eliminar ramas compartidas.
*   `git branch -d` elimina ramas locales solo si fueron fusionadas; `-D` fuerza eliminación sin verificación (usar con precaución).
*   `git fetch --prune` limpia referencias locales a ramas remotas que ya no existen, manteniendo sincronización con el estado real del servidor.
*   Configurar `fetch.prune true` globalmente automatiza la limpieza de referencias obsoletas en cada fetch.
*   El ciclo de vida completo de una rama incluye: crear desde remota → trabajar → push → merge → eliminar remota → eliminar local → prune.

<div class="pagination">
  <a href="/markdown/sistemas/git/remotos/flujos" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/remotos/practicas" class="next">Siguiente</a>
</div>
