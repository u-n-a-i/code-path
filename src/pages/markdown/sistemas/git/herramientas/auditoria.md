---
title: "Auditoría y limpieza"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Auditoría y limpieza](#auditoría-y-limpieza)
  - [`git reflog`: recuperar commits "perdidos"](#git-reflog-recuperar-commits-perdidos)
    - [Recuperar una rama eliminada](#recuperar-una-rama-eliminada)
    - [Deshacer un reset peligroso](#deshacer-un-reset-peligroso)
  - [`git gc`: limpieza de objetos innecesarios](#git-gc-limpieza-de-objetos-innecesarios)
    - [Cuándo ejecutar manualmente](#cuándo-ejecutar-manualmente)
  - [Revisar historial sensible](#revisar-historial-sensible)
    - [Detectar secretos en el historial](#detectar-secretos-en-el-historial)
    - [Eliminar secretos del historial](#eliminar-secretos-del-historial)
  - [Quédate con...](#quédate-con)

</div>

# Auditoría y limpieza

Git mantiene un historial detallado de cada cambio, pero esta inmutabilidad implica acumulación de objetos, ramas obsoletas y potencial exposición de secretos si no se gestiona adecuadamente. La auditoría y limpieza son procesos de mantenimiento esenciales para garantizar la seguridad, optimizar el rendimiento del repositorio y recuperar estados anteriores en caso de errores críticos. Estas operaciones permiten gestionar la salud del repositorio a largo plazo sin comprometer la integridad del historial, asegurando que el control de versiones siga siendo una herramienta fiable y eficiente.

## `git reflog`: recuperar commits "perdidos"

El reflog (reference log) es un registro local que guarda el historial de movimientos de las referencias (HEAD, ramas) en tu repositorio. A diferencia de `git log`, que muestra el historial de commits alcanzables, el reflog muestra cada vez que el HEAD cambió, incluso si ese commit ya no es alcanzable desde ninguna rama. Esto lo convierte en la red de seguridad definitiva para recuperar trabajo perdido tras resets accidentales, rebases fallidos o eliminaciones de ramas.

```bash
# Ver el historial de movimientos del HEAD
$ git reflog

# Salida típica:
# a1b2c3d HEAD@{0}: commit: Añadir funcionalidad X
# e5f6g7h HEAD@{1}: reset --hard HEAD~1
# i9j0k1l HEAD@{2}: commit: Corregir bug crítico
```

### Recuperar una rama eliminada

Si eliminaste una rama por error (`git branch -D feature`), el commit punta aún existe en el reflog hasta que expire.

```bash
# Identificar el hash del último commit de la rama borrada
$ git reflog | grep "feature"

# Crear una nueva rama apuntando a ese hash
$ git branch recovered-feature a1b2c3d
```

### Deshacer un reset peligroso

Si ejecutaste un `git reset --hard` y perdiste cambios commiteados, el reflog permite volver al estado anterior.

```bash
# Volver al estado antes del reset (HEAD@{1})
$ git reset --hard HEAD@{1}
```

> El reflog es local por defecto: no se comparte con `git push` ni se clona. Los registros expiran automáticamente (default 90 días para commits alcanzables, 30 días para inalcanzables), por lo que la recuperación debe hacerse pronto tras la pérdida.

## `git gc`: limpieza de objetos innecesarios

Con el tiempo, los repositorios acumulan objetos huérfanos, paquetes sueltos y referencias obsoletas que inflan el tamaño del directorio `.git`. El comando `git gc` (garbage collection) optimiza el repositorio empaquetando objetos, eliminando referencias inutilizables y comprimiendo el historial.

```bash
# Ejecutar limpieza estándar
$ git gc

# Limpieza agresiva (mayor compresión, más tiempo de CPU)
$ git gc --aggressive

# Limpiar objetos sin empaquetar (prune)
$ git prune
```

### Cuándo ejecutar manualmente

Git ejecuta `gc` automáticamente durante operaciones como `git commit` o `git fetch`, pero en repositorios grandes o tras operaciones masivas (como limpiar secretos del historial), la ejecución manual es recomendada.

```bash
# Verificar tamaño del repositorio
$ du -sh .git

# Tras limpiar historial con filter-branch o BFG
$ git reflog expire --expire=now --all
$ git gc --prune=now --aggressive
```

> La limpieza agresiva (`--aggressive`) puede tardar significativamente más pero produce repositorios más pequeños. Úsalo en repositorios locales o durante ventanas de mantenimiento, no en servidores de producción con alto tráfico.

## Revisar historial sensible

Un error común es creer que eliminar un archivo con secretos (`git rm .env`) los borra completamente. El archivo permanece accesible en el historial de commits anteriores. Cualquier persona con acceso al repositorio puede recuperar esas credenciales navegando el historial.

### Detectar secretos en el historial

```bash
# Buscar patrones sospechosos en el historial
$ git log -p --all | grep -i "password\|api_key\|secret"

# Usar herramientas especializadas (recomendado)
$ trufflehog git file://.
$ git-secrets --scan
```

### Eliminar secretos del historial

Si se detectan secretos, la prioridad es **rotar las credenciales inmediatamente** en el servicio externo (AWS, GitHub, DB), luego limpiar el historial Git.

```bash
# Usar BFG Repo-Cleaner (más rápido que filter-branch)
$ java -jar bfg.jar --delete-files .env my-repo.git

# O con git filter-branch (nativo, más lento)
$ git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

Tras limpiar, es obligatorio forzar el push y limpiar el reflog para que los objetos sean eliminados por `gc`.

```bash
# Forzar actualización del remoto
$ git push --force --all

# Limpiar referencias locales
$ git reflog expire --expire=now --all
$ git gc --prune=now
```

> Reescribir el historial cambia los hashes de todos los commits afectados. Esto invalida los clones de otros colaboradores, que deberán clonar nuevamente desde cero. Coordina esta operación con todo el equipo antes de ejecutarla.

## Quédate con...

*   `git reflog` es la herramienta principal para recuperar commits perdidos, ramas eliminadas o deshacer resets accidentales a nivel local.
*   El reflog tiene expiration automática (30-90 días); la recuperación debe realizarse poco después del incidente para garantizar éxito.
*   `git gc` optimiza el tamaño del repositorio empaquetando objetos y eliminando huérfanos; úsalo tras limpiezas masivas de historial.
*   Eliminar un archivo con `git rm` no borra su contenido del historial; los secretos permanecen accesibles en commits anteriores.
*   Ante exposición de secretos: rota las credenciales primero, luego limpia el historial con herramientas como BFG o `git filter-branch`.
*   La limpieza de historial sensible reescribe hashes y requiere `git push --force`, lo que impacta a todos los colaboradores del repositorio.
*   Usa herramientas automatizadas (`trufflehog`, `git-secrets`) en CI/CD para prevenir que secretos lleguen al repositorio en primer lugar.
*   La auditoría regular del repositorio (`git log -p`, revisión de tamaños) mantiene la salud del proyecto y previene acumulación de basura innecesaria.

<div class="pagination">
  <a href="/markdown/sistemas/git/herramientas/cicd" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/herramientas/ssh" class="next">Siguiente</a>
</div>
