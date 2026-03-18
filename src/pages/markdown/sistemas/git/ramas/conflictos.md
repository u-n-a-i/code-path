---
title: "Resolver conflictos de fusión"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Resolver conflictos de fusión](#resolver-conflictos-de-fusión)
  - [¿Por qué ocurren?](#por-qué-ocurren)
  - [Cómo identificar y editar archivos en conflicto](#cómo-identificar-y-editar-archivos-en-conflicto)
  - [Solución manual cuando dos personas tocan la misma línea](#solución-manual-cuando-dos-personas-tocan-la-misma-línea)
  - [Completar la fusión tras resolver](#completar-la-fusión-tras-resolver)
  - [Quédate con...](#quédate-con)

</div>

# Resolver conflictos de fusión

Los conflictos de fusión no son errores: son señales de que Git ha detectado cambios incompatibles que requieren intervención humana. Ocurren cuando el sistema automático de fusión no puede determinar con certeza qué versión del código debe prevalecer. Lejos de ser un obstáculo, los conflictos son una oportunidad para revisar críticamente cómo se integran líneas de desarrollo divergentes. Resolverlos exige comprender qué cambió en cada rama, decidir qué código mantener y registrar esa decisión explícitamente en el historial.

## ¿Por qué ocurren?

Un conflicto de fusión surge cuando dos ramas modifican la **misma línea** de un **mismo archivo** de maneras incompatibles, y Git no puede determinar automáticamente cuál cambio es el correcto. Si las ramas modifican archivos distintos, o regiones distintas del mismo archivo, Git fusiona automáticamente sin intervención. El conflicto aparece únicamente cuando la lógica de fusión de tres vías (*three-way merge*) encuentra ambigüedad irreconciliable.

Escenarios típicos incluyen:
*   Dos desarrolladores editan la misma función en archivos paralelos.
*   Una rama refactoriza un bloque de código mientras otra corrige un bug en ese mismo bloque.
*   Se modifica la misma línea de configuración en ramas distintas.

Git protege la integridad del código deteniendo la fusión y solicitando resolución manual. Esto previene que cambios válidos se sobrescriban silenciosamente por cambios concurrentes.

> Los conflictos también pueden ocurrir por problemas de codificación de caracteres, finales de línea (CRLF vs LF) o permisos de archivo, aunque lo más común es la divergencia de contenido en líneas específicas.

## Cómo identificar y editar archivos en conflicto

Cuando ocurre un conflicto durante `git merge`, Git interrumpe el proceso y deja el repositorio en estado de "fusió en progreso". El comando `git status` revela qué archivos requieren atención, listándolos bajo la sección *unmerged paths* con el estado `both modified`.

```bash
$ git status
On branch main
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   src/login.py
```

Para editar, abre el archivo conflictivo en tu editor de código. Git inserta **marcadores de conflicto** que delimitan las versiones en disputa. Estos marcadores deben ser eliminados manualmente tras decidir qué código conservar.

```python
<<<<<<< HEAD
def validar_usuario(usuario):
    return usuario.is_active()
=======
def validar_usuario(usuario):
    return usuario.is_active() and usuario.is_verified()
>>>>>>> feature-autenticacion
```

La estructura de los marcadores es estándar:
*   `<<<<<<< HEAD`: Inicio del contenido de tu rama actual (donde estás parado).
*   `=======`: Separador entre ambas versiones.
*   `>>>>>>> feature-autenticacion`: Fin del contenido de la rama que estás fusionando.

## Solución manual cuando dos personas tocan la misma línea

Resolver el conflicto implica editar el archivo para dejar únicamente el código final deseado, eliminando todos los marcadores. No existe una solución automática: debes entender el contexto de ambos cambios.

Opciones de resolución:
1.  **Aceptar tu cambio (HEAD):** Borra desde `=======` hasta `>>>>>>>`, incluyendo los marcadores. Conservas tu versión.
2.  **Aceptar el cambio incoming:** Borra desde `<<<<<<<` hasta `=======`, incluyendo los marcadores. Conservas la versión de la otra rama.
3.  **Combinar ambos:** Edita el código para integrar la lógica de ambas versiones. Por ejemplo, mantener la verificación `is_active` y añadir `is_verified`.
4.  **Reescribir completamente:** Si ambos cambios son obsoletos, escribe una nueva implementación desde cero.

Tras editar, el archivo debe quedar limpio, sin marcadores, con sintaxis válida y funcionalidad probada. Guardar el archivo no resuelve el conflicto para Git: solo prepara el contenido para ser staged.

```python
# Archivo resuelto (marcadores eliminados, lógica combinada)
def validar_usuario(usuario):
    return usuario.is_active() and usuario.is_verified()
```

> Algunos editores modernos (VS Code, IntelliJ, PyCharm) detectan conflictos visualmente y ofrecen botones para aceptar "Current Change", "Incoming Change" o "Both". Estas herramientas facilitan la edición pero no eliminan la necesidad de revisar que el código resultante tenga sentido lógico.

## Completar la fusión tras resolver

Una vez editados todos los archivos conflictivos, Git no finaliza la fusión automáticamente. Debes indicar explícitamente que los conflictos están resueltos mediante `git add`. Esto marca los archivos como *staged* y señala a Git que la resolución está completa.

```bash
# Marcar archivo como resuelto
$ git add src/login.py

# Verificar que no quedan conflictos
$ git status
# Debería mostrar: "All conflicts fixed but you are still merging"
```

Finalmente, ejecuta `git commit` para crear el *commit de fusión*. Git pre-popula el mensaje de commit con información estándar indicando qué ramas se fusionaron, pero puedes editarlo para añadir contexto sobre cómo se resolvieron los conflictos.

```bash
$ git commit
# Se abre el editor con mensaje por defecto, guarda y cierra
```

Tras el commit, la rama actual contiene el historial combinado. La fusión está completa y la rama temporal (si era una feature branch) puede eliminarse. Si necesitas abortar la fusión en cualquier punto antes del commit, `git merge --abort` restaura el estado anterior al inicio del merge.

> El commit de fusión es especial: tiene dos padres (el último commit de cada rama fusionada). Esto preserva la topología del historial. Si usas `git rebase` en lugar de `merge`, los conflictos se resuelven commit por commit durante la reescritura del historial, no en un único commit de fusión.

## Quédate con...

*   Los conflictos ocurren cuando cambios incompatibles afectan las mismas líneas en ramas diferentes; Git pausa la fusión para solicitar intervención humana.
*   `git status` identifica archivos en conflicto bajo "unmerged paths"; los marcadores `<<<<<<<`, `=======`, `>>>>>>>` delimitan las versiones en disputa dentro del archivo.
*   Resolver manualmente implica editar el archivo para conservar el código deseado y eliminar todos los marcadores de conflicto, asegurando que el código sea válido.
*   Tras editar, usa `git add <archivo>` para marcar la resolución como staged; el conflicto no se considera resuelto hasta que el archivo se añade al índice.
*   Finaliza con `git commit` para crear el commit de fusión que integra oficialmente ambas líneas de desarrollo en el historial.
*   Usa `git merge --abort` si la resolución se complica demasiado y necesitas volver al estado previo al inicio de la fusión sin cambios permanentes.

<div class="pagination">
  <a href="/markdown/sistemas/git/ramas/estrategia" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/ramas/reescribir" class="next">Siguiente</a>
</div>
