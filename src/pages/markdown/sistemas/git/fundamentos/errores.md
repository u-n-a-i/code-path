---
title: "Primeros errores comunes y cómo corregirlos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Primeros errores comunes y cómo corregirlos](#primeros-errores-comunes-y-cómo-corregirlos)
  - [Commit con mensaje vacío o poco descriptivo](#commit-con-mensaje-vacío-o-poco-descriptivo)
  - [Archivos olvidados en el commit](#archivos-olvidados-en-el-commit)
  - [Cambios no deseados en el commit](#cambios-no-deseados-en-el-commit)
  - [Quédate con...](#quédate-con)

</div>

# Primeros errores comunes y cómo corregirlos

El aprendizaje de Git implica inevitablemente cometer errores durante las primeras semanas de uso. Un commit con mensaje vacío, un archivo olvidado que debía incluirse, cambios no deseados que se consolidaron en el historial: estas situaciones no son fallos catastróficos sino oportunidades para comprender la arquitectura de Git. La buena noticia es que la mayoría de los errores comunes tienen corrección establecida, siempre que se actúe con conocimiento del estado actual del repositorio y las herramientas disponibles para modificar el historial reciente.

## Commit con mensaje vacío o poco descriptivo

Git no permite técnicamente commits con mensaje completamente vacío: el comando `git commit` fallará si no se proporciona texto mediante `-m` o el editor. Sin embargo, es común crear commits con mensajes insuficientes como "fix", "update", o "cambios", que no documentan el propósito real de la modificación.

```bash
# Problemático: mensaje no descriptivo
$ git commit -m "fix"

# Preferible: mensaje que explica el qué y por qué
$ git commit -m "Corregir validación de email en formulario de registro"
```

Un mensaje efectivo sigue convenciones establecidas: comienza con verbo en imperativo ("Añadir", "Corregir", "Eliminar"), describe el cambio en presente, y opcionalmente incluye contexto en líneas adicionales. La primera línea no debe exceder 50 caracteres; líneas posteriores, separadas por línea en blanco, pueden detallar razonamiento, referencias a tickets, o consecuencias del cambio.

Para corregir un commit reciente con mensaje deficiente, `git commit --amend` permite modificar el último commit sin crear uno nuevo:

```bash
$ git commit --amend -m "Corregir validación de email en formulario de registro"
```

Este comando reescribe el último commit, reemplazando su mensaje (y opcionalmente su contenido si hay cambios staged adicionales). El hash del commit cambiará, reflejando la modificación.

> `git commit --amend` solo debe usarse en commits locales no publicados. Si el commit ya se hizo push a un repositorio compartido, reescribirlo requerirá `git push --force`, lo que puede afectar a otros colaboradores. En ramas compartidas, es preferible crear un nuevo commit correctivo.

## Archivos olvidados en el commit

Es frecuente ejecutar `git commit` y descubrir inmediatamente después que un archivo relevante quedó fuera: una migración de base de datos, un test unitario, un archivo de configuración necesario. El commit ya existe en el historial, pero está incompleto.

Si el commit aún no se ha publicado, `git commit --amend` permite añadir archivos olvidados al commit anterior:

```bash
# Añadir archivo olvidado al staging
$ git add src/migration.sql

# Incorporarlo al último commit
$ git commit --amend --no-edit
```

La bandera `--no-edit` preserva el mensaje de commit original sin abrir el editor. El resultado es un único commit que incluye tanto los cambios originales como el archivo olvidado, manteniendo el historial limpio.

Si el commit ya se publicó o se prefiere no reescribir historial, crear un commit correctivo es la alternativa apropiada:

```bash
$ git add src/migration.sql
$ git commit -m "Añadir migración de base de datos olvidada en commit anterior"
```

Este enfoque es transparente en el historial: queda registro de que algo se olvidó y se corrigió. En proyectos colaborativos, esta transparencia puede ser preferible a reescribir commits compartidos.

> Antes de usar `--amend`, verificar con `git log --oneline -1` que el commit a modificar es efectivamente el último y no se ha compartido. Una vez publicado, el amend requiere coordinación con el equipo para evitar conflictos de historial.

## Cambios no deseados en el commit

Un escenario común es incluir accidentalmente archivos que no deberían formar parte del commit: archivos de log, credenciales, código de depuración, o modificaciones en archivos no relacionados con el propósito del commit.

Si el commit aún no se ha hecho, la corrección es preventiva:

```bash
# Ver qué está staged
$ git status

# Remover archivo no deseado del staging
$ git restore --staged archivo-no-deseado.txt

# Confirmar que solo los archivos correctos permanecen staged
$ git status

# Proceder con commit
$ git commit -m "Mensaje descriptivo"
```

El comando `git restore --staged` mueve el archivo del staging area al working directory sin descartar los cambios. El archivo permanece modificado localmente pero no se incluirá en el commit.

Si el commit ya se ejecutó con cambios no deseados, las opciones dependen de si se publicó:

**Commit local (no publicado):**

```bash
# Deshacer último commit, manteniendo cambios en working directory
$ git reset --soft HEAD~1

# Remover archivos no deseados del staging
$ git restore --staged archivo-no-deseado.txt

# Re-commit con solo los archivos correctos
$ git commit -m "Mensaje corregido"
```

El flag `--soft` preserva todos los cambios en staging; `--mixed` (predeterminado) los mantiene en working directory pero no staged; `--hard` descarta cambios completamente (peligroso).

**Commit publicado:**

```bash
# Crear commit que revierte los cambios no deseados
$ git revert HEAD
```

`git revert` crea un nuevo commit que deshace los cambios del commit especificado, sin reescribir historial. Es seguro para ramas compartidas porque no modifica commits existentes.

> `git reset --hard` es irreversible: los cambios no commiteados se pierden permanentemente. Usar solo cuando se está seguro de que los cambios pueden descartarse. Para recuperación de emergencia, `git reflog` muestra el historial de movimientos de HEAD, permitiendo restaurar estados anteriores incluso tras reset destructivos.

## Quédate con...

*   Los commits con mensajes vacíos o poco descriptivos pueden corregirse con `git commit --amend -m "mensaje"` siempre que no se hayan publicado.
*   Los archivos olvidados pueden añadirse al commit anterior mediante `git add` seguido de `git commit --amend --no-edit`, manteniendo el historial limpio.
*   Los cambios no deseados en staging se remueven con `git restore --staged <archivo>` antes del commit, o con `git reset --soft HEAD~1` después.
*   `git reset` reescribe historial y es peligroso en ramas compartidas; `git revert` crea commit correctivo seguro para colaboración.
*   `git reflog` permite recuperar estados anteriores incluso tras operaciones destructivas, actuando como red de seguridad para errores de principiante.
*   La prevención es más eficiente que la corrección: verificar `git status` y `git diff --staged` antes de cada commit reduce errores significativamente.


<div class="pagination">
  <a href="/markdown/sistemas/git/fundamentos/comparar" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
