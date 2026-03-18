---
title: "Ignorar archivos innecesarios"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Ignorar archivos innecesarios](#ignorar-archivos-innecesarios)
  - [Archivo `.gitignore`](#archivo-gitignore)
  - [Patrones y sintaxis](#patrones-y-sintaxis)
  - [Ejemplos comunes por contexto](#ejemplos-comunes-por-contexto)
  - [Quédate con...](#quédate-con)

</div>

# Ignorar archivos innecesarios

Un directorio de proyecto acumula inevitables artefactos que no constituyen código fuente: registros de ejecución, dependencias descargadas, archivos compilados, configuraciones locales con secretos y metadatos del sistema operativo. Incluir estos elementos en el repositorio infla el historial sin aportar valor, expone información sensible y genera ruido que dificulta la revisión de cambios reales. La higiene del repositorio requiere distinguir explícitamente entre lo que debe versionarse y lo que debe excluirse, estableciendo reglas que automaticen esta separación antes de que los archivos lleguen al área de preparación.

## Archivo `.gitignore`

El archivo `.gitignore` es un archivo de texto plano ubicado en la raíz del repositorio (o en subdirectorios específicos) que define patrones de nombres de archivo que Git debe ignorar completamente. Cuando Git escanea el directorio de trabajo en busca de cambios, consulta este archivo antes de mostrar cualquier archivo como *untracked*. Si un archivo coincide con algún patrón listado, Git lo omite: no aparece en `git status`, no puede añadirse con `git add` (a menos que se fuerce explícitamente) y nunca se incluye en commits.

La existencia de `.gitignore` es una declaración de intenciones sobre qué constituye el proyecto. Un repositorio limpio contiene solo lo necesario para reconstruir el entorno de ejecución: código fuente, configuración estructural y documentación. Los artefactos generados automáticamente —como binarios compilados o paquetes instalados— deben poder regenerarse desde cero mediante scripts de construcción o gestores de dependencias. Excluirlos reduce el tamaño del repositorio, acelera las operaciones de clonado y previene conflictos de fusión en archivos que cambian constantemente pero cuyo contenido es derivado.

## Patrones y sintaxis

La sintaxis de `.gitignore` utiliza comodines estándar para definir reglas flexibles que cubran múltiples archivos con una sola línea. Un asterisco (`*`) coincide con cualquier cadena de caracteres dentro de un nombre de archivo, mientras que dos asteriscos (`**`) coinciden con directorios en cualquier nivel de profundidad. El signo de interrogación (`?`) coincide con un solo carácter, y la barra inclinada (`/`) especifica límites de directorio.

Las reglas siguen un orden de evaluación donde la última coincidencia prevalece. Esto permite excepciones: se puede ignorar un directorio completo pero permitir explícitamente un archivo específico dentro de él usando el signo de exclamación (`!`). Los comentarios comienzan con almohadilla (`#`), permitiendo documentar el propósito de cada regla directamente en el archivo. Esta legibilidad es crucial cuando múltiples desarrolladores mantienen el archivo a lo largo del tiempo.

```gitignore
# Ignorar todos los archivos .log
*.log

# Ignorar el directorio build en cualquier nivel
**/build/

# Ignorar .env pero permitir .env.example
.env
!.env.example

# Ignorar archivos temporales del sistema operativo
.DS_Store
Thumbs.db
```

## Ejemplos comunes por contexto

Cada lenguaje y sistema operativo genera archivos específicos que rara vez deben versionarse. En proyectos de Python, los directorios `__pycache__/` y archivos `.pyc` contienen bytecode compilado que varía según la versión del intérprete. En Node.js, el directorio `node_modules/` almacena dependencias externas que pueden reconstruirse mediante `package-lock.json` y `npm install`. En Java, los directorios `target/` o `build/` contienen clases compiladas y paquetes JAR.

La seguridad exige exclusión estricta de archivos que contengan credenciales. Archivos `.env`, claves privadas (`id_rsa`, `.pem`), y configuraciones de base de datos con contraseñas en texto plano nunca deben formar parte del historial. Un solo commit accidental con una clave API puede comprometer servicios completos, incluso si el archivo se elimina en el commit siguiente, pues el historial permanece accesible. Los sistemas operativos también generan metadatos invisibles: `.DS_Store` en macOS, `Thumbs.db` en Windows, o `~` al final de nombres en editores como Vim, todos candidatos naturales para exclusión global.

> `.gitignore` solo afecta archivos que no están siendo rastreados. Si un archivo ya fue commitado anteriormente, añadirlo a `.gitignore` no lo eliminará del repositorio automáticamente. Para dejar de rastrear un archivo ya versionado sin borrarlo del sistema local, se debe ejecutar `git rm --cached <archivo>` tras actualizar `.gitignore`.

## Quédate con...

*   El archivo `.gitignore` define patrones de nombres que Git ignora completamente, evitando que archivos innecesarios aparezcan como *untracked* o se incluyan en commits.
*   Los patrones usan comodines (`*`, `**`, `?`) y permiten excepciones con `!`, evaluándose en orden donde la última coincidencia prevalece.
*   Excluir artefactos generados (binarios, caché, dependencias) reduce el tamaño del repositorio y previene conflictos innecesarios en archivos derivados.
*   Archivos con secretos (`.env`, claves privadas) deben excluirse estrictamente para evitar exposición de credenciales en el historial público.
*   `.gitignore` no afecta archivos ya rastreados; para dejar de versionar un archivo existente se requiere `git rm --cached` tras actualizar las reglas.
*   Cada lenguaje tiene convenciones estándar de exclusión (Python: `__pycache__`, Node: `node_modules`, Java: `target/`) que deben respetarse para interoperabilidad.

<div class="pagination">
  <a href="/markdown/sistemas/git/fundamentos/ciclo" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/fundamentos/comparar" class="next">Siguiente</a>
</div>
