---
title: "Pipeline"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Pipeline](#pipeline)
  - [Concepto: encadenar comandos](#concepto-encadenar-comandos)
  - [Ejemplos comunes y prácticos](#ejemplos-comunes-y-prácticos)
  - [Limitaciones y buenas prácticas](#limitaciones-y-buenas-prácticas)
  - [Quédate con...](#quédate-con)

</div>

# Pipeline

El pipeline (o tubería), representado por el símbolo |, es uno de los pilares de la filosofía Unix y una de las características más poderosas de la línea de comandos en Linux. Permite encadenar comandos de forma que la salida estándar (stdout) de un programa se convierta en la entrada estándar (stdin) del siguiente. Esta capacidad de composición transforma herramientas simples y especializadas en flujos de procesamiento complejos, sin necesidad de archivos temporales ni scripts elaborados. En lugar de crear programas monolíticos, Unix fomenta la creación de pequeños utilitarios que “hacen una cosa y la hacen bien”, y el pipeline es el mecanismo que los une para resolver problemas reales de forma elegante y eficiente.

## Concepto: encadenar comandos

La sintaxis básica es: `comando1 | comando2 | comando3`

Cada comando se ejecuta en paralelo, y los datos fluyen de izquierda a derecha. El sistema gestiona automáticamente los buffers entre procesos, por lo que no hay necesidad de esperar a que termine el primero para iniciar el segundo.

```bash
ls -l | grep ".txt" | wc -l
```

- ls -l lista archivos en formato largo.
- grep ".txt" filtra solo las líneas que contienen “.txt”.
- wc -l cuenta cuántas líneas quedan.

El resultado: el número de archivos .txt en el directorio actual.

El pipeline solo transmite stdout. Si un comando genera errores (stderr), estos no pasan al siguiente comando a menos que se redirijan explícitamente (por ejemplo, con 2>&1).

## Ejemplos comunes y prácticos

```bash
# Filtrar procesos activos
ps aux | grep nginx # Muestra solo los procesos relacionados con Nginx. Esencial para verificar si un servicio está en ejecución.

# Ordenar y eliminar duplicados
cat /etc/passwd | cut -d: -f1 | sort | uniq # Resultado: lista limpia y ordenada de usuarios del sistema.
# cut extrae el primer campo (nombres de usuario).
# sort ordena alfabéticamente.
# uniq elimina líneas consecutivas duplicadas.

# Procesar logs en tiempo real
tail -f /var/log/nginx/access.log | grep "404" # Muestra en vivo todas las solicitudes que devuelven error 404, ideal para depuración.

# Contar palabras únicas en un archivo
cat documento.txt | tr ' ' '\n' | sort | uniq -c | sort -nr
# tr convierte espacios en saltos de línea (una palabra por línea).
# sort prepara para uniq.
# uniq -c cuenta ocurrencias.
# sort -nr ordena numéricamente de mayor a menor.
```

Este tipo de cadena demuestra cómo herramientas simples se combinan para análisis de texto avanzado.

## Limitaciones y buenas prácticas

- El pipeline no modifica los archivos originales; solo procesa flujos de datos en memoria.
- Para guardar el resultado final, combínalo con redirección.
- Si necesitas incluir stderr en el pipeline, redirígelo.

```bash
# Para guardar el resultado final, combínalo con redirección.
ps aux | grep python | sort > procesos_python.txt

# Si necesitas incluir stderr en el pipeline, redirígelo.
comando 2>&1 | grep "error"
```

## Quédate con...

- El pipeline (|) conecta la salida de un comando con la entrada del siguiente.
- Permite construir flujos de procesamiento potentes combinando herramientas simples.
- Solo transmite salida estándar (stdout); los errores (stderr) deben redirigirse si se quieren incluir.
- Es ideal para filtrar, transformar, contar y analizar datos sin archivos temporales.
- Evita el “uso inútil de cat” cuando el comando siguiente puede leer directamente de un archivo.
- El pipeline encarna la filosofía Unix: modularidad, composición y reutilización. Dominarlo te convierte en un usuario eficaz y expresivo de la terminal.

<div class="pagination">
  <a href="/markdown/sistemas/linux/personalizacion/redireccion" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/personalizacion/filtros" class="next">Siguiente</a>
</div>
