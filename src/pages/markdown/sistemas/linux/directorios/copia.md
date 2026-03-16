---
title: "Copia, movimiento y renombrado"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Copia, movimiento y renombrado](#copia-movimiento-y-renombrado)
  - [Copiar archivos y directorios con cp](#copiar-archivos-y-directorios-con-cp)
  - [Copiar directorios: la opción -r](#copiar-directorios-la-opción--r)
  - [Mover y renombrar con mv](#mover-y-renombrar-con-mv)
    - [Renombrado](#renombrado)
    - [Movimiento](#movimiento)
  - [Comportamiento entre sistemas de archivos](#comportamiento-entre-sistemas-de-archivos)
  - [Quédate con...](#quédate-con)

</div>

# Copia, movimiento y renombrado

En la línea de comandos, copiar, mover o renombrar archivos y directorios se realiza con dos comandos fundamentales: cp (copy) y mv (move). Aunque su propósito parece simple, dominar sus matices —especialmente al trabajar con directorios, rutas relativas o nombres conflictivos— es clave para manipular el sistema de archivos de forma eficiente y segura. Estas operaciones son tan frecuentes en el desarrollo y la administración de sistemas que entender cómo funcionan internamente (por ejemplo, que renombrar es técnicamente un “movimiento” dentro del mismo sistema de archivos) te permitirá anticipar comportamientos y evitar errores costosos.

## Copiar archivos y directorios con cp

El comando cp duplica uno o varios archivos o directorios en una ubicación destino. Su sintaxis básica es:

```bash
cp origen destino
```

- Si el destino es un archivo, cp sobrescribe su contenido (si existe) o lo crea.
- Si el destino es un directorio, el archivo se copia dentro de ese directorio, conservando su nombre original.

Ejemplos:

```bash
cp informe.txt respaldo/          # copia "informe.txt" dentro de la carpeta "respaldo"
cp carta.txt carta_copia.txt      # crea una copia con nombre diferente en el mismo lugar
```

## Copiar directorios: la opción -r

Los directorios no se pueden copiar como si fueran archivos simples, porque contienen otros elementos. Para copiar un directorio y todo su contenido recursivamente, debes usar la opción -r (recursive):

```bash
cp -r proyecto/ copia_proyecto/
```

Sin -r, cp fallará con un error como “omitted directory”. La opción -r asegura que todos los subdirectorios y archivos se incluyan en la copia.

> Algunas versiones de cp (especialmente en sistemas GNU/Linux) también aceptan -R o --recursive. Además, opciones como -v (verbose) muestran cada archivo copiado, y -i (interactive) pregunta antes de sobrescribir, lo cual es útil para evitar pérdidas accidentales.

## Mover y renombrar con mv

El comando mv tiene dos usos aparentemente distintos, pero técnicamente equivalentes desde el punto de vista del sistema de archivos:

1. Renombrar un archivo o directorio.
1. Mover un archivo o directorio a otra ubicación.

La diferencia radica solo en si el origen y el destino están en el mismo directorio o no.

### Renombrado

Si origen y destino comparten la misma ruta padre, mv simplemente cambia el nombre:

```bash
mv viejo_nombre.txt nuevo_nombre.txt
mv proyecto/ proyecto_final/   # renombra el directorio
```

### Movimiento

Si el destino es otro directorio, el archivo o directorio se traslada allí:

```bash
mv documento.txt /home/usuario/archivos/
mv fotos/ /backup/            # mueve toda la carpeta "fotos" dentro de "/backup"
```

> A diferencia de cp, mv no necesita opción recursiva para directorios. El sistema de archivos trata el movimiento de un directorio como una operación atómica sobre su entrada en la tabla de directorios, por lo que todo su contenido se “mueve” implícitamente sin necesidad de copiar datos.

## Comportamiento entre sistemas de archivos

Cuando mv opera dentro del mismo sistema de archivos, solo actualiza metadatos (es instantáneo). Pero si intentas mover un archivo a un dispositivo distinto (por ejemplo, de tu disco duro a una memoria USB), mv copia los datos y luego elimina el original, comportándose como cp + rm. En ese caso, si la operación falla a mitad, podrías quedarte sin el archivo original ni la copia completa —una situación crítica que refuerza la importancia de verificar rutas antes de ejecutar.

## Quédate con...

- Usa cp archivo destino para copiar archivos; usa cp -r directorio destino para copiar directorios completos.
- mv sirve tanto para renombrar (mismo directorio) como para mover (directorio distinto).
- El movimiento de directorios con mv no requiere opción recursiva; se maneja automáticamente.
- Cuando mv cruza límites de sistemas de archivos, realiza una copia física seguida de una eliminación: no es atómico ni reversible.
- Ambos comandos sobrescriben silenciosamente por defecto; considera usar -i (interactivo) en sesiones manuales para mayor seguridad.

<div class="pagination">
  <a href="/markdown/sistemas/linux/directorios/creacion" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/directorios/visualizacion" class="next">Siguiente</a>
</div>
