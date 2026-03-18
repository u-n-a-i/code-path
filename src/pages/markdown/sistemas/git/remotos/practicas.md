---
title: "Colisiones y buenas prácticas"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Colisiones y buenas prácticas](#colisiones-y-buenas-prácticas)
  - [Actualizar antes de subir (`pull` antes de `push`)](#actualizar-antes-de-subir-pull-antes-de-push)
    - [Por qué ocurre el rechazo](#por-qué-ocurre-el-rechazo)
    - [El flujo correcto: integrar antes de publicar](#el-flujo-correcto-integrar-antes-de-publicar)
  - [Evitar `force push` en ramas compartidas](#evitar-force-push-en-ramas-compartidas)
    - [Por qué es peligroso en ramas compartidas](#por-qué-es-peligroso-en-ramas-compartidas)
    - [Cuándo es aceptable usar `force push`](#cuándo-es-aceptable-usar-force-push)
    - [La alternativa segura: `--force-with-lease`](#la-alternativa-segura---force-with-lease)
  - [Quédate con...](#quédate-con)

</div>

# Colisiones y buenas prácticas

La colaboración en Git no es solo un ejercicio técnico de comandos: es un acuerdo social sobre cómo compartir espacio y historial sin interferir destructivamente con el trabajo ajeno. Cuando múltiples desarrolladores operan sobre el mismo código base, las colisiones de cambios son inevitables, pero el caos es opcional. Las buenas prácticas de sincronización y respeto por el historial compartido minimizan conflictos, previenen pérdida de trabajo y mantienen la confianza del equipo en la integridad del repositorio. Ignorar estas convenciones puede convertir una herramienta de colaboración en una fuente constante de frustración y errores costosos.

## Actualizar antes de subir (`pull` antes de `push`)

Una regla fundamental del trabajo colaborativo es: **nunca asumas que tu rama local está actualizada**. Mientras trabajas en tu máquina, otros desarrolladores pueden estar publicando cambios en el repositorio remoto. Intentar hacer `push` sin integrar primero esos cambios remotos resultará casi siempre en un rechazo del servidor.

### Por qué ocurre el rechazo

Git protege el historial remoto contra sobrescrituras accidentales. Si el remoto tiene commits que no existen en tu local, Git rechaza el push con un error "non-fast-forward". Esto te obliga a integrar los cambios remotos antes de enviar los tuyos.

```bash
# Intento de push sin actualizar
$ git push origin main
To https://github.com/equipo/proyecto.git
 ! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs to '...'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally.
```

### El flujo correcto: integrar antes de publicar

La solución es traer los cambios remotos, resolver cualquier conflicto localmente, y luego hacer push. Esto asegura que tu commit se construye sobre la base más reciente.

```bash
# 1. Traer e integrar cambios remotos
$ git pull origin main

# 2. (Opcional) Resolver conflictos si los hay
# Editar archivos, git add, git commit

# 3. Ahora el push funcionará
$ git push origin main
```

Este enfoque tiene ventajas adicionales:
*   **Conflictos tempranos:** Resuelves conflictos en tu máquina donde puedes probar el código, no en el remoto donde podrías romper la build del equipo.
*   **Historial coherente:** Tu commit se aplica sobre el estado actual real, no sobre una versión obsoleta.
*   **Menos sorpresas:** Verificas que tu trabajo sigue funcionando con los cambios más recientes de tus colegas.

> Algunos equipos prefieren `git fetch` + `git rebase` en lugar de `git pull` (que hace merge). El rebase reescribe tus commits locales para que parezcan hechos después de los remotos, produciendo un historial lineal más limpio. Sin embargo, requiere cuidado: nunca hagas rebase de commits ya publicados.

## Evitar `force push` en ramas compartidas

El comando `git push --force` (o `git push -f`) obliga al repositorio remoto a aceptar tu historial local, incluso si eso significa descartar commits que existen en el remoto pero no en tu local. Esta operación reescribe el historial público.

### Por qué es peligroso en ramas compartidas

En ramas principales (`main`, `develop`) o ramas de feature donde otros colaboran, los commits son referencias compartidas. Si un colega ha basado su trabajo en el commit `C` del remoto, y tú haces force push reemplazando `C` por `C'`, su historial local diverge irreconciliablemente del remoto.

```
Situación inicial (Remoto):
A --- B --- C (main)

Tu local (tras rebase/amend):
A --- B --- C' (main)

Otro desarrollador (basado en C):
A --- B --- C --- D (su trabajo)

Tras tu force push:
El remoto ahora tiene C', el colega tiene C.
Sus commits (D) parecen huérfanos. Su push fallará.
Requiere recuperación manual compleja.
```

Las consecuencias incluyen:
*   **Pérdida de trabajo:** Commits de otros pueden quedar inaccesibles si no saben recuperarlos.
*   **Confusión generalizada:** El historial cambia abruptamente, rompiendo referencias en pull requests, CI/CD, y clones locales.
*   **Desconfianza:** El equipo deja de confiar en la estabilidad de la rama principal.

### Cuándo es aceptable usar `force push`

Hay escenarios donde reescribir historial es útil y seguro:

1.  **Ramas de feature personales:** Si la rama es solo tuya y nadie más ha hecho pull de ella, puedes limpiar commits (squash, reorder) antes del merge final.
2.  **Antes del primer push:** Si acabas de crear la rama local y aún no la has publicado, puedes modificarla libremente.
3.  **Recuperación de errores propios:** Si tú mismo publicaste algo incorrecto y eres el único trabajando en esa rama.

### La alternativa segura: `--force-with-lease`

Si debes hacer force push, usa `--force-with-lease` en lugar de `--force`. Esta variante verifica que el remoto no haya cambiado desde tu último `fetch`. Si alguien más publicó cambios mientras trabajabas, el push falla en lugar de sobrescribir su trabajo.

```bash
# Peligroso: sobrescribe sin verificar
$ git push --force origin feature-x

# Seguro: verifica que no hay cambios nuevos en remoto
$ git push --force-with-lease origin feature-x
```

> La mejor práctica es configurar políticas de rama protegida en plataformas como GitHub o GitLab. Estas políticas pueden bloquear force push en ramas principales (`main`, `production`) a nivel de servidor, previniendo errores humanos incluso si alguien intenta ejecutar el comando.

## Quédate con...

*   **Actualiza antes de publicar:** Ejecuta `git pull` (o `fetch` + `merge/rebase`) antes de `git push` para integrar cambios remotos y evitar rechazos por historial divergente.
*   **El rechazo de push es protección:** Git evita sobrescribir trabajo ajeno; integrar cambios remotos primero resuelve conflictos localmente donde puedes probarlos.
*   **Nunca `force push` en ramas compartidas:** Reescribir historial en `main` o ramas colaborativas rompe el trabajo de otros desarrolladores y desestabiliza el repositorio.
*   **`force push` es válido en ramas personales:** Limpiar el historial de una feature branch propia antes del merge es aceptable si nadie más depende de esa rama.
*   **Usa `--force-with-lease`:** Si debes forzar push, esta opción verifica que el remoto no haya cambiado, previniendo sobrescritura accidental de trabajo nuevo de colegas.
*   **Protege ramas principales:** Configura reglas en el servidor (GitHub/GitLab) para bloquear force push en ramas críticas, añadiendo una capa de seguridad institucional.
*   **Comunica cambios destructivos:** Si debes reescribir historial compartido (caso excepcional), avisa al equipo explícitamente para que puedan sincronizar sus repositorios correctamente.

<div class="pagination">
  <a href="/markdown/sistemas/git/remotos/ramas" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
