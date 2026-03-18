---
title: "Markdown"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Markdown](#markdown)
  - [Encabezados y estructura](#encabezados-y-estructura)
  - [Formato de texto](#formato-de-texto)
  - [Enlaces e imágenes](#enlaces-e-imágenes)
  - [Listas y tareas](#listas-y-tareas)
  - [Bloques de código](#bloques-de-código)
  - [Citas y alertas](#citas-y-alertas)
  - [HTML incrustado](#html-incrustado)
  - [Quédate con...](#quédate-con)

</div>

# Markdown

Markdown es un lenguaje de marcado ligero diseñado para ser fácil de leer y escribir, mientras permite la conversión sencilla a HTML y otros formatos de presentación. Fue creado por John Gruber y Aaron Swartz en 2004 y se ha convertido en el estándar *de facto* para documentación técnica, archivos `README`, comentarios en código y plataformas de colaboración como GitHub. Su filosofía central es la legibilidad: un documento Markdown debe ser comprensible incluso en su forma raw (sin renderizar), sin depender de etiquetas complejas.

En el contexto del desarrollo moderno, Markdown no es solo texto plano: es la interfaz de documentación de tus proyectos. Desde la descripción de un repositorio hasta la especificación de una API, la calidad del Markdown impacta directamente en la usabilidad y adopción del software. GitHub Flavored Markdown (GFM) extiende la sintaxis original con tablas, listas de tareas, alertas y resaltado de sintaxis, convirtiéndolo en una herramienta poderosa para ingenieros.

## Encabezados y estructura

Los encabezados definen la jerarquía del documento, permitiendo navegación rápida y generación automática de índices (table of contents) en plataformas como GitHub. Se definen mediante el carácter `#` seguido de un espacio. Cuantos más `#`, menor nivel jerárquico.

```markdown
# Encabezado 1 (H1)
## Encabezado 2 (H2)
### Encabezado 3 (H3)
#### Encabezado 4 (H4)
##### Encabezado 5 (H5)
###### Encabezado 6 (H6)
```

Cada repositorio debería tener un único `H1` (título del documento), seguido de `H2` para secciones principales y `H3` para subsecciones. Esta estructura no es solo estética: herramientas de accesibilidad y lectores de pantalla dependen de ella para navegar el contenido.

> Evita saltar niveles de encabezado (ej. pasar de `H2` a `H4` sin `H3`). Mantener una jerarquía lógica mejora la accesibilidad y la generación automática de índices en plataformas como GitHub o GitLab.

## Formato de texto

Markdown permite énfasis visual mediante caracteres especiales alrededor del texto. Estas convenciones son intuitivas y se mantienen legibles incluso sin renderizar.

```markdown
Texto normal
*Texto en cursiva* o _Texto en cursiva_
**Texto en negrita** o __Texto en negrita__
***Texto en negrita y cursiva***
~~Texto tachado~~ (Strikethrough, específico de GFM)
```

El uso consistente de negrita para términos clave y cursiva para énfasis o términos extranjeros mejora la escaneabilidad del documento. El tachado es útil para indicar cambios depreciados en changelogs o documentación de versiones.

> La consistencia es clave. Elige un estilo (asteriscos `*` o guiones bajos `_`) y manténlo en todo el proyecto. GitHub prefiere asteriscos, pero ambos son válidos en Markdown estándar.

## Enlaces e imágenes

Los enlaces permiten navegación entre documentos y recursos externos. Las imágenes siguen una sintaxis similar pero precedida por un signo de exclamación. Ambos soportan texto alternativo (alt text) crucial para accesibilidad.

```markdown
[Texto del enlace](https://ejemplo.com "Título opcional")

![Texto alternativo descriptivo](https://ejemplo.com/imagen.png "Título opcional")
```

Los enlaces relativos son fundamentales para documentación dentro del mismo repositorio:

```markdown
[Ver documentación de API](./docs/api.md)
[Volver al inicio](#introducción)  # Ancla a encabezado
```

El texto alternativo en imágenes no es opcional: describe el contenido para usuarios con lectores de pantalla y se muestra si la imagen falla al cargar.

> Evita enlaces rotos. Herramientas como `markdown-link-check` pueden validar URLs automáticamente en tu pipeline de CI. Para anclas internas, GitHub convierte los encabezados a lowercase con guiones (ej. `## Mi Título` → `#mi-título`).

## Listas y tareas

Las listas organizan información secuencial o jerárquica. GitHub Flavored Markdown añade listas de tareas (checkboxes) útiles para roadmaps, seguimiento de bugs o listas de verificación.

```markdown
## Lista desordenada
- Elemento 1
- Elemento 2
  - Subelemento 2.1 (indentación con 2 espacios)
  - Subelemento 2.2

## Lista ordenada
1. Primer paso
2. Segundo paso
3. Tercer paso

## Lista de tareas (GFM)
- [x] Tarea completada
- [ ] Tarea pendiente
- [ ] Tarea futura
```

La indentación en listas anidadas requiere consistencia (típicamente 2 o 4 espacios). Las listas de tareas se renderizan como checkboxes interactivos en GitHub Issues y READMEs, permitiendo seguimiento visual de progreso.

> En listas ordenadas, el número real en el archivo no importa para el renderizado (GitHub los secuenciará automáticamente), pero mantener el orden numérico correcto mejora la legibilidad del archivo raw.

## Bloques de código

Documentar código es una de las funciones principales de Markdown en entornos técnicos. Se puede usar código en línea para referencias breves o bloques para ejemplos completos con resaltado de sintaxis.

```markdown
Código en línea: `comando` o `función()`

```bash
# Script de ejemplo
ping 8.8.8.8
```

```javascript
const saludo = "Hola";
console.log(saludo);
```
```

El identificador de lenguaje después de los tres acentos invertidos (```bash, ```python, ```json) activa el resaltado de sintaxis, mejorando drásticamente la legibilidad. Para mostrar los acentos invertidos literalmente, usa múltiples acentos: ```` ``` ````.

> **Nota:** Incluye siempre el identificador de lenguaje. Un bloque sin lenguaje (` ``` `) se renderiza como texto plano sin colores, dificultando la lectura de código complejo.

## Tablas

Las tablas permiten estructurar datos tabulares, aunque su sintaxis es más verbose. Son exclusivas de GitHub Flavored Markdown y no todos los renderizadores las soportan.

```markdown
| Id  | Nombre   | Tel       | E-Mail           |
| :-: | -------- | --------- | ---------------- |
|  1  | User 1   | 123456789 | User1@mail.com   |
|  2  | User 2   | 987654321 | User2@mail.com   |
```

Los signos de dos puntos en la fila de separación definen la alineación:
*   `:---` Izquierda (default)
*   `:---:` Centro
*   `---:` Derecha

Las celdas deben estar alineadas visualmente en el archivo raw para facilitar la edición manual, aunque el renderizado final no lo requiere.

> Las tablas complejas son difíciles de mantener en Markdown puro. Para datos muy complejos, considera usar archivos CSV enlazados o documentación generada automáticamente desde código.

## Citas y alertas

Las citas bloque (`blockquotes`) se usan para destacar información o citar fuentes. GitHub ha introducido recientemente alertas estilizadas para documentación oficial.

```markdown
> Texto remarcado en cita básica
>
> > Cita anidada

> [!TIP]
> Consejo útil para el usuario

> [!WARNING]
> Advertencia sobre riesgos potenciales

> [!CAUTION]
> Precaución crítica que requiere atención
```

Las alertas (`[!TIP]`, `[!WARNING]`, etc.) son específicas de GitHub Docs y se renderizan con colores y iconos distintivos. En Markdown estándar, usa citas con negrita para énfasis similar.

> **Nota:** Las alertas de GitHub (`[!NOTE]`, etc.) son una extensión propietaria. Si tu documentación se renderiza en otras plataformas (GitLab, Bitbucket, sitios estáticos), puede que no se vean correctamente. Para portabilidad máxima, usa `> **Nota:**` tradicional.

## HTML incrustado

Markdown es un superconjunto de HTML en muchas implementaciones, permitiendo incrustar etiquetas HTML cuando la sintaxis de Markdown es insuficiente.

```html
<details>
  <summary>Haz click para expandir</summary>
  Contenido oculto que se muestra al expandir
</details>

<span style="color: red">Texto con estilo personalizado</span>
```

Esta capacidad permite elementos interactivos (como `<details>`) o estilos específicos, pero rompe la portabilidad. El uso excesivo de HTML dificulta la edición y puede ser bloqueado por razones de seguridad en algunas plataformas.

> Evita HTML siempre que sea posible. Si necesitas funcionalidad avanzada (pestañas, acordeones), considera generar documentación estática con herramientas como MkDocs, Docusaurus o Hugo en lugar de depender de HTML incrustado en Markdown.

## Quédate con...

*   Markdown prioriza legibilidad: el documento raw debe ser comprensible sin renderizar, evitando HTML innecesario.
*   Usa encabezados jerárquicos correctamente (H1 → H2 → H3) para accesibilidad y generación automática de índices.
*   Los bloques de código deben incluir siempre el identificador de lenguaje (```python, ```bash) para resaltado de sintaxis.
*   Las tablas son específicas de GitHub Flavored Markdown; alínea visualmente las columnas en el archivo raw para facilitar edición.
*   Las listas de tareas (`- [ ]`) son útiles para roadmaps y checklists en READMEs e Issues de GitHub.
*   El texto alternativo en imágenes es obligatorio para accesibilidad, no opcional.
*   Las alertas de GitHub (`[!WARNING]`) son útiles pero no portables; para documentación multi-plataforma, usa citas estándar con negrita.
*   Mantén consistencia en sintaxis (asteriscos vs guiones para énfasis) para facilitar el mantenimiento del proyecto a largo plazo.

<div class="pagination">
  <a href="/markdown/sistemas/git/github/plantillas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/git/github/cli" class="next">Siguiente</a>
</div>
