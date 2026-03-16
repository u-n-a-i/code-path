---
title: "Creación y eliminación"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Creación y eliminación](#creación-y-eliminación)
  - [Crear directorios: mkdir](#crear-directorios-mkdir)
  - [Crear archivos vacíos: touch](#crear-archivos-vacíos-touch)
  - [Eliminar directorios: rmdir vs rm -r](#eliminar-directorios-rmdir-vs-rm--r)
  - [La opción -f (force) y sus riesgos](#la-opción--f-force-y-sus-riesgos)
  - [Quédate con...](#quédate-con)

</div>

# Creación y eliminación

Crear y eliminar archivos y directorios es una operación cotidiana en la terminal, pero requiere comprensión y cuidado: a diferencia de las interfaces gráficas, donde los archivos eliminados suelen ir a una “papelera”, en la CLI las eliminaciones son inmediatas e irreversibles. Por eso, dominar los comandos adecuados —y sus opciones— no solo mejora tu eficiencia, sino que previene errores costosos. Linux ofrece herramientas precisas para estas tareas: mkdir y touch para crear, rmdir y rm para eliminar, cada una con un propósito específico y reglas claras de uso.

## Crear directorios: mkdir

El comando mkdir (make directory) crea uno o más directorios. Por defecto, solo puede crear un nivel a la vez:

```bash
mkdir documentos
```

Si intentas crear una ruta anidada como proyectos/web/css y los directorios intermedios no existen, el comando fallará. Aquí entra en juego la opción -p (parents), que crea todos los directorios necesarios en la ruta, sin error si alguno ya existe:

```bash
mkdir -p proyectos/web/css
```

Esta opción es esencial en scripts o al configurar estructuras de proyecto desde cero, ya que evita tener que escribir múltiples comandos mkdir en cadena.

## Crear archivos vacíos: touch

Aunque su nombre sugiere “tocar”, touch se usa principalmente para crear archivos vacíos o actualizar la marca de tiempo (timestamp) de un archivo existente. Para crear un nuevo archivo:

```bash
touch notas.txt
```

Si notas.txt no existe, se crea vacío (0 bytes). Si ya existe, su fecha de modificación se actualiza, pero su contenido permanece intacto. Esto es útil en sistemas de construcción (build systems) o para inicializar archivos de registro (logs).

> Aunque puedes crear archivos con editores (nano, vim) o redirecciones (echo "" > archivo), touch es la forma más ligera y directa de generar un archivo vacío.

## Eliminar directorios: rmdir vs rm -r

Linux distingue claramente entre eliminar directorios vacíos y no vacíos:

rmdir (remove directory) solo elimina directorios vacíos. Es seguro por diseño: si el directorio contiene algo, el comando falla y no hace nada.

```bash
rmdir documentos  # solo funciona si "documentos" está vacío
```

rm -r (remove recursive) elimina directorios y todo su contenido recursivamente, incluidos subdirectorios y archivos. Es poderoso, pero peligroso:

```bash
rm -r proyectos   # borra "proyectos" y todo lo que contenga
```

La opción -r es obligatoria para eliminar directorios con rm; sin ella, rm solo actúa sobre archivos.

## La opción -f (force) y sus riesgos

La opción -f (force) suprime advertencias y errores, forzando la eliminación incluso si:

- El archivo no existe,
- No tienes permisos de lectura (pero sí de escritura en el directorio),
- El archivo está protegido contra escritura.

Por ejemplo:

```bash
rm -f archivo_inexistente   # no muestra error
rm -rf /tmp/datos           # elimina sin preguntar, incluso si hay archivos de solo lectura
```

Cuando se combina con -r (rm -rf), se convierte en uno de los comandos más peligrosos del sistema. Un error tipográfico como rm -rf / (con espacio antes de la barra) puede borrar todo el sistema. Por esta razón:

> Nunca uses rm -rf con rutas absolutas a menos que estés completamente seguro. Muchos administradores configuran alias como alias rm='rm -i' (modo interactivo) para evitar borrados accidentales, aunque esto no es recomendable en scripts automatizados.

## Quédate con...

- Usa mkdir -p para crear estructuras de directorios anidadas de forma segura.
- touch crea archivos vacíos o actualiza marcas de tiempo.
- rmdir solo elimina directorios vacíos; es seguro por naturaleza.
- rm -r elimina directorios con contenido; úsalo con precaución.
- La opción -f fuerza la eliminación y silencia errores: extremadamente útil en scripts, pero peligrosa si se usa descuidadamente.
- En la CLI, no hay papelera: lo que borras con rm desaparece para siempre, salvo que uses herramientas externas de recuperación.

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/directorios/copia" class="next">Siguiente</a>
</div>
