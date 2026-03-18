---
title: "Reescritura de historial"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Reescritura de historial (con precaución)](#reescritura-de-historial-con-precaución)
  - [`git commit --amend`: corregir el último commit](#git-commit---amend-corregir-el-último-commit)
  - [`git rebase`: reordenar o combinar commits](#git-rebase-reordenar-o-combinar-commits)
  - [Advertencia: nunca reescribir historial ya compartido](#advertencia-nunca-reescribir-historial-ya-compartido)
  - [Quédate con...](#quédate-con)

</div>

# Reescritura de historial (con precaución)

El historial de commits en Git no es inmutable por imposición técnica, sino por convención de seguridad. Los comandos de reescritura existen porque el desarrollo real rara vez produce una secuencia perfecta de cambios a la primera: mensajes mal redactados, commits que deberían estar combinados, o cambios que necesitan reordenarse para contar una historia coherente. Sin embargo, modificar el historial tiene consecuencias profundas: cambia los hashes de los commits afectados y todos sus descendientes, rompiendo referencias y potencialmente desincronizando repositorios compartidos. Esta capacidad debe ejercerse con disciplina: poderosa para limpiar el trabajo local antes de compartirlo, peligrosa si se aplica sobre historia ya publicada.

## `git commit --amend`: corregir el último commit

El comando `git commit --amend` permite modificar el commit más reciente sin crear uno nuevo. Reemplaza el último commit con uno nuevo que combina su contenido con cualquier cambio actualmente staged, y opcionalmente actualiza su mensaje.

```bash
# Corregir mensaje del último commit
$ git commit --amend -m "Añadir validación de email en formulario de registro"

# Añadir archivo olvidado al último commit
$ git add src/olvidado.py
$ git commit --amend --no-edit
```

Este comando es útil para correcciones menores: mensajes mal escritos, archivos olvidados, o pequeños ajustes que no justifican un commit separado. El resultado es un único commit limpio en lugar de una secuencia "commit defectuoso" + "commit correctivo".

Internamente, `--amend` no edita el commit original: crea un nuevo commit con nuevo hash, copia el árbol de archivos modificado, y actualiza el puntero de la rama para apuntar al nuevo. El commit original permanece accesible vía `git reflog` hasta que la recolección de basura lo elimine (típicamente 30-90 días).

> `git commit --amend` solo debe usarse en commits locales no publicados. Si el commit original ya fue enviado a un repositorio compartido con `git push`, reescribirlo requerirá `git push --force`, lo que puede afectar a otros colaboradores que hayan basado trabajo en ese commit. En ramas compartidas, preferir un commit correctivo nuevo.

## `git rebase`: reordenar o combinar commits

El comando `git rebase` reescribe el historial moviendo o recombinando una secuencia de commits sobre una nueva base. A diferencia de `git merge`, que crea un commit de fusión preservando ambas líneas de desarrollo, `git rebase` reescribe los commits para que parezcan haberse hecho directamente sobre la rama destino, produciendo un historial lineal más limpio.

```bash
# Reordenar últimos 3 commits interactivamente
$ git rebase -i HEAD~3

# Mover la rama actual sobre main más reciente
$ git rebase main
```

El modo interactivo (`-i`) abre un editor con la lista de commits a reescribir, permitiendo operaciones por commit:

| Comando | Acción |
|---------|--------|
| `pick` | Usar commit tal cual |
| `reword` | Usar commit pero editar mensaje |
| `squash` | Combinar con commit anterior (fusiona mensajes) |
| `fixup` | Combinar con commit anterior (descarta mensaje) |
| `drop` | Eliminar commit completamente |
| `edit` | Detenerse para modificar el commit |

Esta flexibilidad permite limpiar el historial antes de fusionar: combinar commits de "WIP", "fix typo", "another fix" en un único commit coherente; reordenar commits para que sigan una secuencia lógica; o eliminar commits experimentales que no deben formar parte del historial final.

```bash
# Antes de rebase interactivo:
pick a1b2c3d WIP: iniciar feature login
pick b2c3d4e fix typo
pick c3d4e5f another fix

# Después de editar (squash los últimos dos):
pick a1b2c3d Implementar autenticación de usuarios
```

El resultado es un historial más legible que documenta intenciones, no el proceso de edición.

> `git rebase` reescribe hashes de todos los commits afectados y sus descendientes. Esto invalida cualquier referencia externa a esos commits: branches remotas, pull requests, o clones de otros desarrolladores. Usar solo en ramas locales antes de publicar, nunca en ramas compartidas como `main` o `develop`.

## Advertencia: nunca reescribir historial ya compartido

La regla de oro de Git es simple: **no reescribir historial que haya sido publicado a un repositorio compartido**. Una vez que otros desarrolladores han basado trabajo en tus commits, modificar esos commits crea divergencia irreconciliable.

El problema surge de cómo Git identifica commits. Cada commit tiene un hash único calculado sobre su contenido, incluyendo el hash del commit padre. Si modificas un commit (con `--amend` o `rebase`), su hash cambia. Todos los commits descendentes también cambian de hash porque su referencia al padre ya no es válida.

```
Historial original (publicado):
A --- B --- C (main en remoto)
          ^
          (otros desarrolladores tienen este commit C)

Tras rebase local:
A --- B --- C' (main local)
          ^
          (hash diferente, mismo contenido modificado)
```

Cuando intentes sincronizar, Git detectará que los historiales divergen. Forzar la sincronización con `git push --force` sobrescribe el remoto, invalidando el trabajo de otros desarrolladores que referencia el commit original. Sus clones quedarán desincronizados, requiriendo recuperación manual compleja.

Las excepciones a esta regla son limitadas:
*   **Ramas personales de feature:** Si la rama es solo tuya y nadie más ha trabajado sobre ella, reescribir es seguro hasta el momento del merge.
*   **Repositorios privados unipersonales:** Si eres el único usuario, puedes reescribir libremente.
*   **Coordinación explícita del equipo:** Si todo el equipo acuerda reescribir (raro, pero ocurre en reorganizaciones mayores de historial), puede hacerse con comunicación y sincronización cuidadosa.

Para casos donde se necesita corregir historia publicada, `git revert` es la alternativa segura: crea un nuevo commit que deshace los cambios del commit problemático, sin modificar el historial existente.

```bash
# En lugar de reescribir commit publicado:
$ git revert <hash-del-commit>

# Crea nuevo commit que revierte los cambios
# Historial permanece intacto, seguro para colaboración
```

> `git push --force` es destructivo. La variante `--force-with-lease` es más segura: verifica que el remoto no haya cambiado desde tu último fetch antes de forzar, previniendo sobrescritura accidental de trabajo de otros. Usar siempre `--force-with-lease` en lugar de `--force` cuando la reescritura sea necesaria.

## Quédate con...

*   `git commit --amend` corrige el último commit (mensaje o contenido), creando un nuevo hash; usar solo en commits locales no publicados.
*   `git rebase -i` permite reordenar, combinar o eliminar commits interactivamente, produciendo historial lineal más limpio antes de fusionar.
*   Los comandos de reescritura cambian hashes de commits, invalidando referencias externas y desincronizando clones que dependen de esos commits.
*   **Nunca reescribir historial publicado** en ramas compartidas; la regla protege la integridad del trabajo colaborativo.
*   Para corregir errores en historia publicada, usar `git revert` que crea commit correctivo sin modificar historial existente.
*   Si debes forzar push tras reescritura local, usar `--force-with-lease` en lugar de `--force` para verificar que el remoto no haya cambiado.
*   La reescritura de historial es herramienta de higiene personal antes de compartir, no de corrección después de publicar.

<div class="pagination">
  <a href="/markdown/sistemas/git/ramas/conflictos" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/ramas/etiquetas" class="next">Siguiente</a>
</div>
