---
title: "Subir y descargar cambios"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Subir y descargar cambios](#subir-y-descargar-cambios)
  - [`git push`: enviar commits locales al remoto](#git-push-enviar-commits-locales-al-remoto)
  - [`git clone`: descargar un repositorio remoto completo](#git-clone-descargar-un-repositorio-remoto-completo)
  - [`git pull`: traer y fusionar cambios del remoto](#git-pull-traer-y-fusionar-cambios-del-remoto)
  - [Comparación de operaciones de sincronización](#comparación-de-operaciones-de-sincronización)
  - [Quédate con...](#quédate-con)

</div>

# Subir y descargar cambios

La conexión con un repositorio remoto habilita la sincronización bidireccional de trabajo: enviar commits locales para compartirlos con el equipo y recibir cambios de otros desarrolladores para mantenerse actualizado. Estas operaciones —push, clone, pull— son los mecanismos fundamentales de colaboración en Git. Cada una tiene un propósito específico, consecuencias distintas sobre el historial y consideraciones de seguridad que deben comprenderse para evitar pérdida de trabajo, conflictos innecesarios o sobrescrituras accidentales. Dominar estos comandos transforma el repositorio local de un archivo personal en un nodo activo dentro de una red colaborativa.

## `git push`: enviar commits locales al remoto

El comando `git push` transfiere commits desde el repositorio local hacia un repositorio remoto, actualizando las referencias de ramas en el servidor. Esta operación es fundamental para compartir trabajo: hasta que los commits se hacen push, existen solo en tu máquina y son invisibles para colaboradores.

```bash
# Enviar la rama actual al remoto 'origin'
$ git push origin main

# Enviar una rama específica
$ git push origin feature-login

# Enviar todas las ramas locales que tengan contraparte remota
$ git push --all origin

# Enviar etiquetas
$ git push --tags origin
```

La sintaxis básica es `git push <remote> <branch>`. Si la rama ya está vinculada a una remota (tracking branch), puede simplificarse a `git push` sin argumentos, usando la configuración predeterminada.

La primera vez que se pusha una rama nueva, Git requiere establecer el vínculo explícitamente:

```bash
# Establecer upstream y hacer push en un solo comando
$ git push -u origin feature-login
# Futuros pushes pueden ser solo: git push
```

El flag `-u` (o `--set-upstream`) configura la rama remota como referencia de seguimiento, permitiendo que comandos futuros como `git push` y `git pull` funcionen sin especificar remote y branch.

> `git push` puede fallar si el remoto tiene commits que no existen localmente. Esto protege contra sobrescritura accidental de trabajo de otros. El error típico "rejected because the remote contains work that you do not have" se resuelve con `git pull` primero para integrar cambios remotos, o `git push --force` solo si estás seguro de que quieres sobrescribir (peligroso en ramas compartidas).

## `git clone`: descargar un repositorio remoto completo

El comando `git clone` es la puerta de entrada a un proyecto existente: crea una copia local completa de un repositorio remoto, incluyendo todo el historial de commits, ramas, tags y configuración. No es una descarga parcial: obtienes el proyecto entero tal como existe en el servidor.

```bash
# Clonar repositorio HTTPS
$ git clone https://github.com/usuario/proyecto.git

# Clonar repositorio SSH
$ git clone git@github.com:usuario/proyecto.git

# Clonar en un directorio con nombre específico
$ git clone https://github.com/usuario/proyecto.git mi-carpeta

# Clonar solo una rama específica
$ git clone -b develop https://github.com/usuario/proyecto.git
```

Tras el clonado, Git configura automáticamente:
*   Un repositorio local completo con todo el historial
*   Un remote llamado `origin` apuntando a la URL de origen
*   La rama principal checkoutada (típicamente `main` o `master`)
*   Configuración de tracking entre rama local y remota

```bash
$ cd proyecto
$ git remote -v
origin  https://github.com/usuario/proyecto.git (fetch)
origin  https://github.com/usuario/proyecto.git (push)

$ git branch -a
* main
  remotes/origin/HEAD -> origin/main
  remotes/origin/main
```

El clonado es la operación más común para comenzar a trabajar en un proyecto existente. A diferencia de `git init` que crea un repositorio vacío, `git clone` trae historial completo desde el primer momento.

> `git clone` descarga todo el historial, no solo la última versión. Para repositorios muy grandes con años de historial, esto puede ser lento y ocupar espacio significativo. En tales casos, `git clone --depth 1` crea un "shallow clone" con solo el commit más reciente, útil para CI/CD o pruebas rápidas donde el historial completo no es necesario.

## `git pull`: traer y fusionar cambios del remoto

El comando `git pull` descarga cambios desde el repositorio remoto y los integra automáticamente en la rama actual. Es una operación compuesta: equivale a ejecutar `git fetch` seguido de `git merge` en un solo paso.

```bash
# Pull desde el remote y rama configurada
$ git pull

# Pull desde remote y rama específicos
$ git pull origin main

# Pull con rebase en lugar de merge
$ git pull --rebase origin main
```

El flujo interno de `git pull` es:

1.  **Fetch:** Descarga commits, ramas y tags del remoto sin modificar el working directory
2.  **Merge:** Integra los cambios descargados en la rama actual, creando un merge commit si hay divergencia

```bash
# git pull es equivalente a:
$ git fetch origin
$ git merge origin/main
```

Esta composición es conveniente pero puede generar conflictos inesperados. Si hay cambios locales no commiteados, `git pull` fallará para proteger trabajo no guardado. Si hay divergencia entre local y remoto, se creará un merge commit (o se aplicará rebase si se configuró).

La alternativa más controlada es separar las operaciones:

```bash
# En lugar de pull automático, hacer fetch + merge explícitos
$ git fetch origin          # Ver qué hay en el remoto
$ git log HEAD..origin/main # Inspeccionar cambios antes de integrar
$ git merge origin/main     # Integrar cuando estés listo
```

Este enfoque permite revisar qué cambios vienen del remoto antes de integrarlos, facilitando detección temprana de conflictos o cambios problemáticos.

> `git pull --rebase` cambia la estrategia de integración: en lugar de crear un merge commit, reescribe los commits locales para que parezcan haberse hecho después de los commits remotos, produciendo historial lineal. Esto es más limpio pero reescribe historial local, lo que puede complicar la recuperación si algo sale mal.

## Comparación de operaciones de sincronización

| Comando | Dirección | Efecto en local | Efecto en remoto | Uso típico |
|---------|-----------|-----------------|------------------|------------|
| `git clone` | Remoto → Local | Crea repositorio nuevo | Ninguno | Primera descarga de proyecto |
| `git fetch` | Remoto → Local | Actualiza refs remotas, no integra | Ninguno | Ver cambios sin integrar |
| `git pull` | Remoto → Local | Descarga e integra cambios | Ninguno | Actualizar rama con trabajo remoto |
| `git push` | Local → Remoto | Ninguno | Actualiza ramas remotas | Compartir trabajo con equipo |

Esta distinción es crucial: `fetch` es seguro (solo lectura), `pull` integra automáticamente (puede generar conflictos), `push` escribe en el remoto (puede ser rechazado si hay divergencia).

> Las operaciones de push y pull requieren autenticación válida. HTTPS usa credenciales almacenadas o tokens; SSH usa claves en `~/.ssh`. Errores de autenticación ("Permission denied", "Authentication failed") indican problemas de credenciales, no de Git. Verificar configuración de SSH (`ssh -T git@github.com`) o tokens HTTPS antes de diagnosticar problemas de red.

## Quédate con...

*   `git push` envía commits locales al remoto, requiriendo que la rama remota esté actualizada o usar `--force` con precaución extrema.
*   `git clone` descarga un repositorio completo con todo su historial, configurando automáticamente el remote `origin` y la rama principal.
*   `git pull` es una operación compuesta: `fetch` (descargar) + `merge` (integrar); puede generar conflictos si hay divergencia entre local y remoto.
*   Separar `fetch` + `merge` permite inspeccionar cambios remotos antes de integrarlos, ofreciendo más control que `pull` automático.
*   `git push -u origin <rama>` establece el vínculo de tracking para futuros pushes sin especificar remote y branch explícitamente.
*   `git pull --rebase` produce historial lineal al reescribir commits locales sobre los remotos, pero es más riesgoso que merge tradicional.
*   La autenticación (HTTPS tokens o SSH keys) debe estar configurada correctamente antes de push/pull; errores de permisos son típicamente de credenciales, no de Git.

<div class="pagination">
  <a href="/markdown/sistemas/git/remotos/conectar" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/remotos/flujos" class="next">Siguiente</a>
</div>
