---
title: "Comando"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Comando](#comando)
  - [¿Qué es un comando?](#qué-es-un-comando)
  - [Estructura básica de un comando](#estructura-básica-de-un-comando)
  - [Comandos internos vs. externos](#comandos-internos-vs-externos)
  - [Opciones cortas y largas](#opciones-cortas-y-largas)
  - [Quédate con...](#quédate-con)

</div>

# Comando

En la interfaz de línea de comandos (CLI), todo lo que haces se expresa mediante comandos: instrucciones textuales que le pides al sistema que ejecute. Dominar su sintaxis y funcionamiento es el primer paso para interactuar con eficacia en entornos Linux. Un comando puede ser tan simple como listar los archivos de un directorio o tan complejo como orquestar una cadena de procesamiento de datos. Lo que los hace poderosos no es su complejidad individual, sino su capacidad de combinarse entre sí siguiendo reglas claras y consistentes. Entender qué es un comando, cómo se estructura y cómo el sistema lo interpreta te permitirá leer, escribir y depurar cualquier operación en la terminal con confianza.

## ¿Qué es un comando?

Un comando es una instrucción que el usuario introduce en la shell para realizar una acción específica. Puede tratarse de:

- Un programa ejecutable almacenado en el sistema (como ls, cp o git);
- Una función definida por el usuario;
- Un alias (abreviatura personalizada);
- O un comando interno de la propia shell (como cd o export).

Cuando escribes un comando y presionas Enter, la shell lo analiza, busca su implementación y lo ejecuta, ya sea directamente (si es interno) o lanzando un nuevo proceso (si es externo).

## Estructura básica de un comando

La forma estándar de un comando en Unix y Linux sigue esta estructura:

`comando [opciones] [argumentos]`

- comando: el nombre del programa o función a ejecutar (por ejemplo, grep, mkdir, python3).
- [opciones] (también llamadas flags o switches): modifican el comportamiento del comando. Son opcionales y suelen comenzar con uno o dos guiones (- o --).
- [argumentos]: son los datos sobre los que actúa el comando, como nombres de archivos, rutas, cadenas de texto, etc.

Por ejemplo, en el comando:

```bash
ls -l /home/usuario
```

- ls es el comando (lista archivos),
- -l es una opción (muestra el listado en formato largo),
- /home/usuario es un argumento (la ruta cuyo contenido se quiere listar).
- El orden suele ser flexible, pero la convención general es: comando → opciones → argumentos.

> Algunos comandos requieren argumentos obligatorios (como cp origen destino), mientras que otros funcionan sin ninguno (como date). Siempre consulta la documentación si no estás seguro.

## Comandos internos vs. externos

No todos los comandos son iguales desde el punto de vista del sistema:

Comandos internos (built-ins) están integrados directamente en la shell. Se ejecutan dentro del propio proceso de la shell, sin crear uno nuevo. Ejemplos comunes: cd, pwd, export, echo (en Bash, echo es un built-in, aunque también existe como binario externo).
Su ventaja es la velocidad y el acceso directo al estado interno de la shell (por ejemplo, cd debe ser interno porque cambiar el directorio de trabajo afecta a la propia shell).

Comandos externos son programas independientes almacenados en el disco, generalmente en directorios como /bin, /usr/bin o /usr/local/bin. Cuando los ejecutas, la shell crea un nuevo proceso hijo. Ejemplos: ls, grep, nano, python3.

Puedes verificar si un comando es interno o externo usando type:

```bash
type cd      # → cd is a shell builtin
type ls      # → ls is /usr/bin/ls
```

## Opciones cortas y largas

Las opciones permiten ajustar el comportamiento de un comando. Existen dos formatos principales, establecidos por la convención POSIX y ampliadas por GNU:

- Opciones cortas: usan un solo guion y una letra, como -l, -a, -r. Pueden agruparse: -la equivale a -l -a.
- Opciones largas: usan dos guiones y palabras completas, como --list, --all, --recursive. Son más legibles y autoexplicativas, especialmente en scripts.

Por ejemplo, estos dos comandos son equivalentes:

```bash
ls -l -a /tmp
ls --long --all /tmp
```

Muchos comandos modernos (especialmente los del ecosistema GNU) admiten ambos formatos. Las opciones largas son preferibles en scripts por su claridad; las cortas, en uso interactivo por su brevedad.

> No todas las opciones tienen equivalente largo o corto. Además, algunas herramientas no POSIX (como docker o kubectl) usan convenciones propias, aunque suelen seguir el mismo espíritu de -f vs --file.

## Quédate con...

- Un comando es una instrucción que la shell interpreta y ejecuta, ya sea como programa externo o función interna.
- La estructura estándar es: comando [opciones] [argumentos].
- Los comandos internos (como cd) forman parte de la shell; los externos (como ls) son programas independientes.
- Las opciones cortas (-l) son breves y agrupables; las largas (--list) son descriptivas y legibles.
- Usar type nombre_comando te permite identificar si un comando es interno o externo, lo que ayuda a entender su comportamiento y alcance.

<div class="pagination">
  <a href="/markdown/sistemas/linux/cli/cli" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/cli/navegacion" class="next">Siguiente</a>
</div>
