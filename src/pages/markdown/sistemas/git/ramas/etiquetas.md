---
title: "Etiquetas (tags)"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Etiquetas (tags)](#etiquetas-tags)
  - [Marcar versiones estables](#marcar-versiones-estables)
  - [Ligeros vs. anotados](#ligeros-vs-anotados)
    - [Etiquetas ligeras (lightweight)](#etiquetas-ligeras-lightweight)
    - [Etiquetas anotadas (annotated)](#etiquetas-anotadas-annotated)
  - [Gestión y mejores prácticas](#gestión-y-mejores-prácticas)
  - [Quédate con...](#quédate-con)

</div>

# Etiquetas (tags)

Las ramas en Git son punteros móviles que avanzan con cada nuevo commit, pero los proyectos de software requieren puntos de referencia estables que permanezcan fijos en el tiempo. Las versiones de lanzamiento, los hitos de desarrollo y los estados de producción necesitan identificadores permanentes que no se muevan cuando el código evoluciona. Las etiquetas (tags) cumplen esta función: son marcadores inmutables que apuntan a commits específicos, proporcionando nombres legibles para instantáneas históricas. A diferencia de las ramas, las etiquetas no son líneas de trabajo: son señales en el camino que permiten regresar exactamente a donde estaba el proyecto cuando se publicó la versión 1.0.0, 2.3.1 o cualquier otro hito significativo.

## Marcar versiones estables

El comando `git tag` crea una etiqueta que apunta permanentemente a un commit específico. Por defecto, etiqueta el commit actual (HEAD), pero puede especificarse cualquier hash de commit.

```bash
# Etiquetar el commit actual
$ git tag v1.0.0

# Etiquetar un commit específico
$ git tag v1.0.0 a1b2c3d

# Listar todas las etiquetas
$ git tag
v1.0.0
v1.1.0
v2.0.0

# Buscar etiquetas por patrón
$ git tag -l "v1.*"
v1.0.0
v1.1.0
```

Las etiquetas siguen convenciones de versionado semántico (*Semantic Versioning*): `v<mayor>.<menor>.<parche>`. Un incremento en `mayor` indica cambios incompatibles, `menor` indica funcionalidades nuevas compatibles, y `parche` indica correcciones de bugs. Esta convención comunica a los usuarios qué esperar al actualizar entre versiones.

Una vez creada, una etiqueta puede consultarse para ver el estado exacto del proyecto en ese momento:

```bash
# Ver información de la etiqueta
$ git show v1.0.0

# Cambiar el working directory a esa versión
$ git checkout v1.0.0
# Nota: esto pone el repositorio en estado "detached HEAD"
```

Las etiquetas no se comparten automáticamente con `git push`. Para enviar etiquetas a un repositorio remoto:

```bash
# Enviar una etiqueta específica
$ git push origin v1.0.0

# Enviar todas las etiquetas locales
$ git push origin --tags
```

> Las etiquetas son inmutables por convención. Una vez publicada una versión, no debe modificarse. Si hay un error en v1.0.0, se publica v1.0.1 en lugar de reescribir v1.0.0. Esta práctica preserva la integridad del versionado y previene confusiones en equipos que puedan haber descargado la versión original.

## Ligeros vs. anotados

Git soporta dos tipos de etiquetas que difieren en la cantidad de metadatos que almacenan y su caso de uso recomendado.

### Etiquetas ligeras (lightweight)

Una etiqueta ligera es esencialmente un puntero directo a un commit, sin metadatos adicionales. Se crea sin flags especiales:

```bash
$ git tag v1.0.0
```

Internamente, es similar a una rama que no se mueve: contiene solo el hash del commit referenciado. No almacena información sobre quién creó la etiqueta, cuándo, o por qué.

**Cuándo usar:** Para etiquetas temporales, marcas personales de desarrollo, o versiones que no requieren trazabilidad formal.

### Etiquetas anotadas (annotated)

Una etiqueta anotada es un objeto completo de Git con metadatos ricos: nombre del etiquetador, email, fecha, mensaje descriptivo, y opcionalmente firma GPG para verificación criptográfica.

```bash
# Crear etiqueta anotada con mensaje
$ git tag -a v1.0.0 -m "Versión estable inicial - funcionalidad completa de autenticación"

# Ver detalles de etiqueta anotada
$ git tag -v v1.0.0
```

Los metadatos incluyen:
*   **Tagger:** Quién creó la etiqueta
*   **Date:** Cuándo se creó
*   **Message:** Descripción del release
*   **Signature:** Firma GPG opcional para verificación de integridad

**Cuándo usar:** Para versiones de producción, releases públicos, o cualquier etiqueta que requiera trazabilidad y documentación formal.

| Característica | Ligera | Anotada |
|---------------|--------|---------|
| Metadatos | Ninguno | Tagger, fecha, mensaje, firma |
| Comando | `git tag <nombre>` | `git tag -a <nombre> -m "mensaje"` |
| Objeto Git | Puntero directo | Objeto tag independiente |
| Recomendación | Uso personal/temporal | Releases de producción |

> Las plataformas como GitHub, GitLab y Bitbucket muestran etiquetas anotadas con su mensaje completo en las páginas de releases, mientras que las etiquetas ligeras aparecen sin contexto. Para releases públicos, las etiquetas anotadas proporcionan mejor documentación automática.

## Gestión y mejores prácticas

Las etiquetas requieren gestión deliberada para mantener el repositorio organizado:

```bash
# Eliminar etiqueta local
$ git tag -d v1.0.0

# Eliminar etiqueta remota
$ git push origin --delete v1.0.0

# Ver etiquetas con sus commits
$ git tag -n
v1.0.0    Versión estable inicial
v1.1.0    Añade soporte para pagos
v2.0.0    Rediseño completo de API
```

Las mejores prácticas para versionado incluyen:

1.  **Usar versionado semántico:** `v<mayor>.<menor>.<parche>` comunica claramente el tipo de cambios.
2.  **Etiquetar solo releases estables:** No etiquetar commits intermedios o work-in-progress.
3.  **Usar etiquetas anotadas para producción:** Proporcionan trazabilidad y documentación.
4.  **Firmar etiquetas críticas:** Para releases de seguridad o distribuciones públicas, usar firma GPG (`git tag -s`).
5.  **No reutilizar nombres:** Una vez publicada v1.0.0, ese nombre está ocupado permanentemente.

> Las etiquetas no previenen modificaciones del código referenciado. Un commit etiquetado puede seguir siendo parte de una rama que recibe nuevos commits. La etiqueta solo marca un punto específico, no congela el desarrollo futuro. Para branches de mantenimiento de versiones antiguas, crear ramas dedicadas (`release/1.x`) además de etiquetas.

## Quédate con...

*   Las etiquetas son marcadores inmutables que apuntan a commits específicos, ideales para marcar versiones de lanzamiento y hitos de proyecto.
*   `git tag <nombre>` crea una etiqueta ligera; `git tag -a <nombre> -m "mensaje"` crea una etiqueta anotada con metadatos completos.
*   Las etiquetas anotadas almacenan tagger, fecha, mensaje y opcionalmente firma GPG; son preferibles para releases de producción.
*   Las etiquetas no se comparten automáticamente: usar `git push origin --tags` para enviarlas al repositorio remoto.
*   El versionado semántico (`v<mayor>.<menor>.<parche>`) comunica el tipo de cambios entre versiones y facilita la gestión de dependencias.
*   Las etiquetas son inmutables por convención: si hay un error en una versión publicada, crear v1.0.1 en lugar de modificar v1.0.0.
*   Usar `git tag -n` para listar etiquetas con sus mensajes, facilitando la identificación de versiones y sus cambios principales.

<div class="pagination">
  <a href="/markdown/sistemas/git/ramas/reescribir" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
