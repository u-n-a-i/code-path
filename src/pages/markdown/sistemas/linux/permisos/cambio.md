---
title: "Cambio de permisos"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Cambio de permisos](#cambio-de-permisos)
  - [Notación octal: precisión numérica](#notación-octal-precisión-numérica)
  - [Notación simbólica: cambios incrementales](#notación-simbólica-cambios-incrementales)
  - [Qué queda con...](#qué-queda-con)

</div>

# Cambio de permisos

Una vez que comprendes qué significan los permisos de archivo en Linux, el siguiente paso lógico es aprender a modificarlos según tus necesidades. El comando chmod (change mode) es la herramienta estándar para ajustar quién puede leer, escribir o ejecutar un archivo o directorio. Ofrece dos formas de hacerlo: la notación simbólica, más legible e intuitiva para cambios puntuales, y la notación octal, más concisa y precisa para establecer permisos completos de forma rápida. Dominar ambas te permitirá gestionar el acceso a tus archivos con flexibilidad, ya sea en scripts automatizados o en tareas interactivas de administración.

## Notación octal: precisión numérica

La notación octal representa los tres conjuntos de permisos (usuario, grupo, otros) como tres dígitos, donde cada dígito es la suma de los valores de los permisos individuales:

- r (lectura) = 4
- w (escritura) = 2
- x (ejecución) = 1

Algunos ejemplos comunes:

- 755 → rwxr-xr-x
  - Usuario: 4+2+1 = 7 → lectura, escritura, ejecución.
  - Grupo y otros: 4+0+1 = 5 → lectura y ejecución, pero no escritura.
  - Uso típico: scripts ejecutables o directorios públicos.
- 644 → rw-r--r--
  - Usuario: 4+2+0 = 6 → lectura y escritura.
  - Grupo y otros: 4+0+0 = 4 → solo lectura.
  - Uso típico: archivos de configuración o documentos compartidos.
- 700 → rwx------
  - Solo el propietario tiene acceso total; grupo y otros no pueden hacer nada.
  - Uso típico: archivos sensibles como claves SSH (~/.ssh/id_rsa).

Ejemplo de uso:

```bash
chmod 644 documento.txt
chmod 755 script.sh
```

> La notación octal sobrescribe todos los permisos existentes. Si solo quieres añadir o quitar un permiso específico, la notación simbólica es más segura.

## Notación simbólica: cambios incrementales

La notación simbólica permite modificar permisos de forma selectiva, sin reemplazar todo el conjunto.

Su sintaxis es: `[quién][operador][permisos]`

- Quién:
  - u = usuario (propietario)
  - g = grupo
  - o = otros
  - a = todos (equivalente a ugo)
- Operador:
  - \+ = añadir permiso
  - \- = quitar permiso
  - = = establecer permiso exacto (reemplaza)
- Permisos: r, w, x

Ejemplos prácticos:

```bash
chmod u+x script.sh        # permite al propietario ejecutar el script
chmod g-w,o-r informe.txt  # quita escritura al grupo y lectura a otros
chmod a+r archivo          # permite a todos leer el archivo
chmod g=rx carpeta/        # establece exactamente "rx" para el grupo (elimina otros permisos del grupo)
```

Esta notación es ideal cuando:

- Quieres hacer un cambio pequeño sin afectar el resto.
- Estás escribiendo un script y deseas expresar la intención de forma clara.
- No recuerdas el valor octal exacto, pero sabes qué permiso necesitas ajustar.

> A diferencia de la notación octal, la simbólica no afecta los bits que no mencionas. Por ejemplo, chmod u+x deja intactos los permisos de grupo y otros, y no modifica r ni w del usuario.

## Qué queda con...

- Usa notación octal (chmod 755) cuando quieras definir todos los permisos de una vez, especialmente en scripts o configuraciones estándar.
- Usa notación simbólica (chmod u+x) para ajustes puntuales, seguros e intuitivos.
- Los valores más comunes:
  - 644 para archivos regulares (lectura/escritura para el dueño, solo lectura para los demás).
  - 755 para directorios y scripts ejecutables (acceso total al dueño, lectura/ejecución para los demás).
- chmod solo puede ser usado por el propietario del archivo o por el superusuario (root).
- Cambiar permisos incorrectamente puede comprometer la seguridad o funcionalidad del sistema; siempre verifica con ls -l después de modificarlos.

<div class="pagination">
  <a href="/markdown/sistemas/linux/permisos/permisos" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/permisos/propiedad" class="next">Siguiente</a>
</div>
