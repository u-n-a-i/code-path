---
title: "Redirección"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Redirección](#redirección)
  - [Guardar la salida en un archivo (\>)](#guardar-la-salida-en-un-archivo-)
  - [Añadir salida al final de un archivo (\>\>)](#añadir-salida-al-final-de-un-archivo-)
  - [Redirigir entrada desde un archivo (\<)](#redirigir-entrada-desde-un-archivo-)
  - [Combinación con otros operadores](#combinación-con-otros-operadores)
  - [Quédate con...](#quédate-con)

</div>

# Redirección

En la terminal de Linux, todo programa interactúa con tres flujos estándar: entrada estándar (stdin), salida estándar (stdout) y error estándar (stderr). Por defecto, stdin proviene del teclado, mientras que stdout y stderr se muestran en la pantalla. Sin embargo, el verdadero poder de la CLI radica en la capacidad de redirigir estos flujos hacia o desde archivos, lo que permite capturar resultados, alimentar programas con datos preexistentes o construir cadenas de procesamiento sin intervención manual. La redirección es una de las ideas fundamentales de la filosofía Unix: tratar los datos como flujos que pueden canalizarse entre herramientas simples.

## Guardar la salida en un archivo (>)

El operador > redirige la salida estándar (stdout) de un comando a un archivo. Si el archivo ya existe, se sobrescribe completamente; si no existe, se crea.

```bash
ls -l /home > listado.txt
```

Este comando guarda el listado de /home en listado.txt, reemplazando cualquier contenido anterior.

\> borra el contenido previo del archivo. Un error común es escribir \> archivo por accidente y perder datos. Algunas shells (como Bash) ofrecen la opción set -o noclobber para evitar sobrescrituras accidentales.

## Añadir salida al final de un archivo (\>\>)

El operador \>\> también redirige stdout, pero añade la salida al final del archivo, preservando su contenido existente.

```bash
date >> registro.log
echo "Proceso completado" >> registro.log
```

Esto es ideal para archivos de registro (logs), donde se acumulan entradas secuenciales sin perder el historial.

Tanto \> como \>\> solo afectan a stdout. Los mensajes de error (stderr) seguirán apareciendo en la terminal a menos que se redirijan explícitamente (por ejemplo, 2\> o &\>).

## Redirigir entrada desde un archivo (<)

El operador < toma el contenido de un archivo y lo envía como entrada estándar (stdin) a un comando, simulando que el usuario lo ha escrito.

```bash
wc -l < documento.txt
```

Esto cuenta las líneas de documento.txt sin necesidad de que wc abra el archivo directamente. Es equivalente a wc -l documento.txt, pero útil cuando un programa solo lee de stdin.

Ejemplo con un editor interactivo:

```bash
mail usuario@dominio < cuerpo_del_mensaje.txt
```

Aquí, el contenido de cuerpo_del_mensaje.txt se envía como cuerpo del correo.

La redirección de entrada es especialmente útil con comandos que no aceptan nombres de archivo como argumento, como tr, sort o grep en ciertos contextos.

## Combinación con otros operadores

La redirección se combina frecuentemente con tuberías (|) y comodines:

```bash
grep "error" /var/log/syslog | tail -n 20 > errores_recientes.log
```

Este comando filtra líneas con “error”, toma las últimas 20 y las guarda en un archivo nuevo.

## Quédate con...

- \> sobrescribe un archivo con la salida de un comando.
- \>\> añade la salida al final del archivo, conservando el contenido existente.
- < alimenta un comando con el contenido de un archivo como si fuera entrada del teclado.
- Estos operadores manipulan los flujos estándar (stdin, stdout), no los archivos directamente.
- La redirección es esencial para automatización, generación de logs y construcción de flujos de datos complejos.
- Dominar la redirección te permite transformar la terminal en una fábrica de procesamiento de texto eficiente y reproducible.

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/personalizacion/pipeline" class="next">Siguiente</a>
</div>
