---
title: "Arquitectura conceptual de Git"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Arquitectura conceptual de Git](#arquitectura-conceptual-de-git)
  - [Estados de los archivos](#estados-de-los-archivos)
  - [El ciclo de vida del archivo](#el-ciclo-de-vida-del-archivo)
  - [El árbol de objetos](#el-árbol-de-objetos)
  - [Quédate con...](#quédate-con)

</div>

# Arquitectura conceptual de Git

Git no almacena archivos como documentos estáticos sino como instantáneas de un sistema de archivos completo en momentos específicos. Esta decisión arquitectónica fundamental diferencia a Git de otros sistemas de control de versiones que registran diferencias acumulativas entre versiones. Cada operación en Git —crear un commit, cambiar de rama, restaurar un archivo— implica mover información entre tres áreas distintas que representan estados progresivos de permanencia: el directorio de trabajo donde se edita, el área de preparación donde se selecciona qué incluir, y el repositorio donde el historial se vuelve inmutable. Comprender este flujo no es opcional: cada comando de Git tiene sentido únicamente cuando se entiende hacia qué área opera y qué transformación de estado produce.

## Estados de los archivos

Git mantiene una separación deliberada entre donde se modifican los archivos, donde se preparan los cambios y donde se almacena el historial. Esta tripartición no es redundancia: es un mecanismo de control que permite composición selectiva de commits, experimentación sin compromiso inmediato y recuperación precisa de estados anteriores.

El **working directory** (directorio de trabajo) es el espacio visible donde se editan archivos. Contiene la versión actual de cada archivo tal como existe en el sistema de archivos del sistema operativo. Los cambios aquí son locales, no versionados, y pueden modificarse o descartarse sin afectar el repositorio. Este directorio refleja el estado del proyecto en un momento dado, incluyendo modificaciones no guardadas, archivos nuevos no rastreados y archivos eliminados localmente.

El **staging area** (área de preparación), también llamado *index*, es una capa intermedia que actúa como zona de selección. No es un directorio visible sino un archivo binario (`.git/index`) que registra qué archivos y qué versiones específicas se incluirán en el próximo commit. Esta separación permite construir commits atómicos: modificar diez archivos pero seleccionar solo tres para el commit actual, dejando los restantes para commits posteriores. El staging area es donde se define la granularidad del historial.

El **repository** (repositorio) es el almacén permanente donde los commits se guardan de forma inmutable. Ubicado en el directorio `.git`, contiene la base de datos completa de objetos versionados, referencias a ramas, tags y metadatos de configuración. Una vez que un cambio alcanza el repositorio mediante commit, se vuelve parte del historial permanente: puede referenciarse, compararse o restaurarse, pero no modificarse directamente. La inmutabilidad del repositorio garantiza integridad: cualquier alteración cambiaría los hashes criptográficos que identifican cada objeto, detectándose inmediatamente como inconsistencia.

> El staging area es una característica distintiva de Git que no existe en todos los sistemas de control de versiones. Sistemas como Subversion permiten commit directo desde el working directory. La capa intermedia de Git añade un paso pero proporciona control fino sobre qué cambios se agrupan juntos, facilitando commits temáticamente coherentes en lugar de snapshots de todo el trabajo pendiente.

## El ciclo de vida del archivo

Cada archivo en un proyecto Git transita entre cuatro estados posibles a lo largo de su existencia. Estos estados no son mutuamente excluyentes en el tiempo: un archivo puede moverse adelante y atrás entre ellos según las operaciones ejecutadas. Comprender estas transiciones permite predecir el efecto de cada comando y diagnosticar problemas cuando el comportamiento no coincide con lo esperado.

Un archivo **untracked** (no rastreado) es nuevo en el directorio de trabajo y Git no lo está monitoreando. Aparece cuando se crea un archivo sin haber ejecutado `git add` previamente. Git ignora su contenido para propósitos de versionado, aunque lo muestra en `git status` como recordatorio de que existe fuera del control de versiones. Los archivos en este estado no se incluyen en commits hasta que se rastrean explícitamente.

Un archivo **unmodified** (no modificado) está rastreado y su versión en el working directory coincide exactamente con la versión almacenada en el último commit del repositorio. No hay diferencias detectables entre el archivo en disco y la instantánea guardada. Este es el estado estable: el archivo está versionado y sin cambios pendientes.

Un archivo **modified** (modificado) está rastreado pero su contenido en el working directory difiere de la versión en el último commit. Git detecta el cambio mediante comparación de hashes o timestamps. El archivo está en un estado transitorio: los cambios existen pero aún no se han preparado para commit. Ejecutar `git status` muestra archivos modificados como pendientes de staging.

Un archivo **staged** (preparado) es un archivo modificado que ha sido añadido explícitamente al staging area mediante `git add`. Su versión actual está marcada para inclusión en el próximo commit. El archivo permanece en estado staged hasta que se ejecuta `git commit`, momento en el que se vuelve unmodified en el nuevo commit, o hasta que se ejecuta `git restore --staged`, que lo devuelve a modified sin afectar el working directory.

Las transiciones entre estados siguen reglas predecibles:

| De | A | Comando |
|----|---|---------|
| untracked | staged | `git add <archivo>` |
| unmodified | modified | Editar el archivo |
| modified | staged | `git add <archivo>` |
| staged | unmodified | `git commit` |
| modified | unmodified | `git restore <archivo>` |
| staged | modified | `git restore --staged <archivo>` |

> El estado de un archivo es relativo al último commit en la rama actual. Cambiar de rama con `git checkout` o `git switch` puede transformar instantáneamente archivos modified a unmodified (si la nueva rama tiene la misma versión) o generar conflictos (si ambas ramas modificaron el mismo archivo). El ciclo de vida se reinicia conceptualmente en cada commit.

## El árbol de objetos

Git no almacena archivos, commits o directorios como entidades separadas: todo son objetos identificados por hashes SHA-1 (o SHA-256 en versiones recientes). Esta uniformidad permite que el sistema trate contenido, estructura y metadatos con la misma mecánica de almacenamiento y verificación. Cuatro tipos de objetos fundamentales componen cualquier repositorio Git, cada uno con propósito específico en la representación del historial.

Los **blobs** (*binary large objects*) almacenan el contenido de archivos sin metadatos. Un blob contiene únicamente los datos crudos de un archivo en un momento específico: el texto de un script, el código binario de un ejecutable, el contenido de un documento. No incluye nombre de archivo, permisos, ni ruta de directorio. El hash del blob se calcula exclusivamente sobre su contenido: dos archivos idénticos en cualquier parte del repositorio producen el mismo hash, permitiendo deduplicación automática. Cuando un archivo cambia, se crea un nuevo blob; el anterior permanece en el repositorio como parte del historial.

Los **trees** (árboles) representan directorios: contienen referencias a blobs y otros trees, asociando cada uno con un nombre y modo de archivo (permisos, tipo). Un tree es esencialmente un listado de directorio versionado: registra qué archivos existían en un directorio específico, qué subdirectorios contenía, y qué blobs o trees representan su contenido. Los trees permiten que Git reconstruya la estructura completa del proyecto en cualquier commit: el tree raíz apunta a trees de subdirectorios y blobs de archivos, formando un árbol jerárquico que replica el sistema de archivos original.

Los **commits** son objetos que apuntan a un tree raíz e incluyen metadatos descriptivos: autor, correo electrónico, mensaje de commit, timestamp, y referencia al commit padre (o padres, en caso de merge). Un commit no contiene contenido de archivos directamente: apunta al tree que representa el estado completo del proyecto en ese momento. Esta indirección permite eficiencia: commits sucesivos que comparten archivos inalterados apuntan a los mismos blobs y trees, almacenando únicamente lo que cambió. El hash del commit se calcula sobre todo su contenido, incluyendo el hash del tree: modificar un archivo cambia el blob, que cambia el tree, que cambia el commit.

Los **tags** son referencias nombradas que apuntan directamente a commits específicos. A diferencia de las ramas, que son punteros móviles que avanzan con nuevos commits, los tags son estáticos: una vez creados, identifican permanentemente un commit particular. Los tags ligeros son simples punteros; los tags anotados son objetos independientes con metadatos propios (tagger, mensaje, firma). Se usan típicamente para marcar versiones de lanzamiento (`v1.0.0`, `v2.3.1`).

La relación entre estos objetos forma un grafo acíclico dirigido (DAG): los commits apuntan a trees y a commits padres; los trees apuntan a blobs y otros trees; los blobs no apuntan a nada. Esta estructura permite que Git navegue el historial en cualquier dirección: desde un commit hacia su tree para ver qué archivos contenía, desde un blob hacia los commits que lo incluyeron mediante búsqueda, desde una rama hacia el commit actual y sus ancestros.

>  La inmutabilidad de los objetos es fundamental: una vez creado, ningún objeto puede modificarse. "Modificar" un commit en realidad crea nuevos objetos (blob, tree, commit) con nuevos hashes, dejando los originales intactos en el repositorio. Comandos como `git rebase` o `git commit --amend` no editan objetos existentes: construyen una nueva cadena de commits que reemplaza la anterior en las referencias de rama, mientras los objetos originales permanecen accesibles hasta que la recolección de basura los elimina.

## Quédate con...

*   Git separa tres áreas distintas: working directory (edición), staging area (selección de cambios), y repository (almacenamiento permanente del historial).
*   Los archivos transitan entre cuatro estados: untracked (nuevo, no monitoreado), unmodified (rastreado, sin cambios), modified (rastreado, con cambios), y staged (preparado para commit).
*   El staging area permite composición selectiva de commits: agrupar cambios temáticamente relacionados en lugar de commitar todo el trabajo pendiente simultáneamente.
*   Git almacena cuatro tipos de objetos: blobs (contenido de archivos), trees (estructura de directorios), commits (snapshots con metadatos), y tags (referencias nombradas a commits).
*   Los objetos son inmutables e identificados por hashes criptográficos: cualquier modificación crea nuevos objetos con nuevos hashes, detectándose como cambios en el historial.
*   La arquitectura de objetos forma un grafo acíclico dirigido donde commits apuntan a trees y padres, trees apuntan a blobs y sub-trees, y blobs son hojas sin referencias salientes.



<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/fundamentos/repositorio" class="next">Siguiente</a>
</div>
