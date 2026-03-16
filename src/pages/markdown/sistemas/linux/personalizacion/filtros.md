---
title: "Filtros"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Filtros](#filtros)
  - [grep: búsqueda de patrones](#grep-búsqueda-de-patrones)
  - [sort: ordenar contenido](#sort-ordenar-contenido)
  - [cut: extraer columnas](#cut-extraer-columnas)
  - [Quédate con...](#quédate-con)

</div>

# Filtros

En la terminal de Linux, los filtros son comandos que leen datos de la entrada estándar (stdin), los transforman o seleccionan según reglas específicas, y escriben el resultado en la salida estándar (stdout). Son herramientas esenciales para procesar texto estructurado o no estructurado, y su verdadero poder se despliega cuando se combinan mediante tuberías (|). Entre los más utilizados están grep (búsqueda de patrones), sort (ordenación), cut (extracción de columnas) y awk (procesamiento avanzado de campos). Dominar estos filtros te permite analizar logs, extraer información de archivos del sistema, formatear datos o depurar scripts con eficacia y precisión.

## grep: búsqueda de patrones

El comando grep (global regular expression print) filtra líneas que coinciden con un patrón. Es indispensable para buscar texto en archivos, procesos o salidas de comandos.

```bash
grep "error" /var/log/syslog
ps aux | grep nginx
```

Opciones comunes

- -i: ignorar mayúsculas/minúsculas.
- -v: invertir la coincidencia (mostrar líneas que no contienen el patrón).
- -r: búsqueda recursiva en directorios.
- -n: mostrar número de línea.
- -E: usar expresiones regulares extendidas (equivalente a egrep).

Expresiones regulares básicas

- . → cualquier carácter.
- \* → cero o más repeticiones del carácter anterior.
- ^ → inicio de línea.
- $ → fin de línea.
- \[0-9] → cualquier dígito.

Ejemplo:

```bash
grep "^root" /etc/passwd    # líneas que empiezan por "root"
grep "sh$" /etc/passwd      # líneas que terminan en "sh"
```

> Para patrones complejos, considera ripgrep (rg) o ack, herramientas modernas más rápidas y con mejor soporte para código fuente

## sort: ordenar contenido

sort reordena líneas de texto alfabética o numéricamente. Es especialmente útil tras filtrar datos para presentarlos de forma legible.

Uso básico

```bash
cat nombres.txt | sort
```

Opciones clave

- -n: orden numérico (en lugar de alfabético).
- -r: orden inverso (descendente).
- -u: eliminar duplicados consecutivos (similar a uniq, pero sin necesidad de preordenar).
- -k: ordenar por una columna específica (cuando hay campos delimitados).

Ejemplo:

```bash
ps aux --no-headers | sort -k3 -n -r | head -10
```

Muestra los 10 procesos que más CPU consumen, ordenados de mayor a menor.

> sort requiere que los datos estén en líneas separadas. Si trabajas con JSON u otros formatos, usa jq antes de sort.

## cut: extraer columnas

cut extrae secciones de líneas basadas en delimitadores o posiciones de caracteres. Es ideal para archivos con formato fijo o delimitado (como CSV o /etc/passwd).

Uso con delimitador

```bash
cut -d: -f1 /etc/passwd
```

- -d: → usar : como delimitador.
- -f1 → mostrar el primer campo.

Resultado: lista de nombres de usuario.

Otras opciones

- -c1-5 → extraer caracteres 1 a 5 de cada línea.
- -f1,3 → mostrar campos 1 y 3.

Ejemplo con tabuladores (común en salidas de ps):

```bash
ps -eo pid,comm --no-headers | cut -f1
```

## Quédate con...

- grep filtra líneas que coinciden con un patrón; admite expresiones regulares básicas.
- sort ordena líneas; usa -n para orden numérico y -k para columnas específicas.
- cut extrae campos delimitados; ideal para archivos como /etc/passwd.
- Combina estos filtros con tuberías para construir flujos de análisis potentes y concisos.
- Para tareas complejas (condiciones, cálculos), awk es más flexible que cut o grep.
- Los filtros no modifican los archivos originales; solo transforman flujos de datos en tiempo real.
- Dominar estos comandos te permite convertir la terminal en un entorno de análisis de datos ligero y eficaz.

<div class="pagination">
  <a href="/markdown/sistemas/linux/personalizacion/pipeline" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/personalizacion/alias" class="next">Siguiente</a>
</div>
