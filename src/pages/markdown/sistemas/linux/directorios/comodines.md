---
title: "Uso de comodines"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Uso de comodines](#uso-de-comodines)
  - [Los comodines básicos: \*, ? y \[\]](#los-comodines-básicos---y-)
    - [\* — Coincidencia con cualquier cadena](#--coincidencia-con-cualquier-cadena)
    - [? — Coincidencia con un solo carácter](#--coincidencia-con-un-solo-carácter)
    - [\[\] — Coincidencia con un conjunto de caracteres](#--coincidencia-con-un-conjunto-de-caracteres)
  - [Combinación de comodines en operaciones reales](#combinación-de-comodines-en-operaciones-reales)
  - [Quédate con...](#quédate-con)

</div>

# Uso de comodines

En la línea de comandos, operar con múltiples archivos uno por uno sería ineficiente e impráctico. Para resolver esto, las shells de Unix y Linux ofrecen un mecanismo poderoso llamado expansión de nombre de archivo (filename expansion), comúnmente conocido como comodines (wildcards). Estos caracteres especiales permiten definir patrones que coinciden con nombres de archivos o directorios, facilitando tareas como copiar todos los archivos .txt, eliminar imágenes antiguas o listar solo ciertos tipos de documentos. Dominar los comodines no solo ahorra tiempo, sino que reduce errores al evitar escribir largas listas de nombres manualmente.

## Los comodines básicos: \*, ? y []

La shell interpreta estos símbolos antes de ejecutar el comando, reemplazándolos por los nombres reales que coincidan con el patrón. Los más usados son:

### \* — Coincidencia con cualquier cadena

El asterisco (\*) representa cero o más caracteres. Es el comodín más utilizado.

Ejemplos:

```bash
ls *.pdf          # lista todos los archivos que terminan en .pdf
rm fotos_2023*.jpg  # elimina todas las fotos cuyo nombre empieza por "fotos_2023" y termina en .jpg
cp /var/log/*.log ./backup/  # copia todos los logs al directorio backup
```

> \* no coincide con archivos ocultos (los que empiezan por .) a menos que el patrón incluya explícitamente el punto, como .\*.

### ? — Coincidencia con un solo carácter

El signo de interrogación (?) representa exactamente un carácter, cualquiera.

Ejemplos:

```bash
ls archivo?.txt   # coincide con archivo1.txt, archivoA.txt, pero no con archivo10.txt
mv imagen_??.png ./galeria/  # mueve archivos como imagen_01.png, imagen_ab.png (dos caracteres)
```

Útil cuando sabes la longitud exacta del nombre, pero no los caracteres específicos.

### [] — Coincidencia con un conjunto de caracteres

Los corchetes ([ ]) definen un conjunto o rango de caracteres aceptables en una posición específica.

Ejemplos:

```bash
ls [abc]*.txt     # archivos que empiezan por a, b o c y terminan en .txt
ls archivo[0-9].log  # archivo0.log, archivo1.log, ..., archivo9.log (solo un dígito)
ls informe[!0-9].doc # archivos que empiezan por "informe" seguido de algo que NO sea un dígito
```

Dentro de los corchetes:

- a-z → letras minúsculas.
- A-Z → mayúsculas.
- 0-9 → dígitos.
- ! al inicio niega el conjunto ([!...] = “cualquier cosa excepto…”).

## Combinación de comodines en operaciones reales

Los comodines se integran naturalmente en comandos comunes:

Búsqueda y listado:

```bash
ls -l /home/*/documentos/*.odt  # busca archivos .odt en la carpeta "documentos" de cada usuario
```

Eliminación selectiva:

```bash
rm temp_????.tmp  # borra archivos como temp_abcd.tmp o temp_1234.tmp (4 caracteres entre)
```

Copia estructurada:

```bash
cp proyecto/[Mm]odulo*.py ./backup/  # copia módulos escritos con mayúscula o minúscula inicial
```

> Si ningún archivo coincide con el patrón, la shell dejará el comodín sin expandir, lo que probablemente cause un error en el comando (por ejemplo, ls \*.xyz fallará si no hay archivos .xyz). Algunas shells (como Bash) permiten cambiar este comportamiento con opciones como shopt -s nullglob, pero el comportamiento predeterminado es útil para detectar errores tipográficos.

## Quédate con...

- \* coincide con cualquier cadena (incluida la vacía); ideal para extensiones o prefijos.
- ? coincide con un solo carácter; útil cuando conoces la longitud del nombre.
- [...] define un conjunto o rango específico de caracteres; permite selección precisa.
- Los comodines se expanden antes de que se ejecute el comando, por lo que funcionan con cualquier herramienta que reciba nombres de archivo (ls, cp, rm, mv, etc.).
- Nunca coinciden con archivos ocultos (.\*) a menos que el patrón lo incluya explícitamente.
- Usar comodines correctamente te permite manipular decenas o cientos de archivos con un solo comando, manteniendo tu flujo de trabajo ágil y seguro.

<div class="pagination">
  <a href="/markdown/sistemas/linux/directorios/edicion" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
