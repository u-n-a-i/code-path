---
title: "Edición básica"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Edición básica](#edición-básica)
  - [nano: edición inmediata y sin curva de aprendizaje](#nano-edición-inmediata-y-sin-curva-de-aprendizaje)
  - [vim: eficiencia a través de modos](#vim-eficiencia-a-través-de-modos)
    - [Modos principales](#modos-principales)
    - [Flujo básico de trabajo](#flujo-básico-de-trabajo)
  - [Por qué aprender vim](#por-qué-aprender-vim)
  - [Quédate con...](#quédate-con)

</div>

# Edición básica

En entornos Linux, especialmente en servidores o sistemas sin interfaz gráfica, editar archivos de texto desde la terminal es una necesidad diaria: configuraciones, scripts, documentación o código fuente suelen requerir ajustes rápidos. Aunque existen decenas de editores, dos destacan por su ubicuidad y filosofías opuestas: nano, minimalista y accesible, ideal para principiantes y tareas puntuales; y vim, potente y eficiente, diseñado para usuarios avanzados que buscan velocidad y personalización extrema. Aprender al menos lo básico de ambos te garantiza poder modificar cualquier archivo, en cualquier sistema, sin depender de herramientas externas.

## nano: edición inmediata y sin curva de aprendizaje

nano es un editor de texto simple, amigable y presente en casi todas las distribuciones Linux. Su principal ventaja es que muestra las combinaciones de teclas más comunes en la parte inferior de la pantalla, eliminando la necesidad de memorizar comandos.

Para abrir o crear un archivo:

```bash
nano notas.txt
```

Una vez dentro:

- Escribe directamente: estás en modo de edición.
- Para guardar: presiona Ctrl+O (de write Out), luego Enter.
- Para salir: Ctrl+X.
- Buscar texto: Ctrl+W.
- Cortar/pegar líneas: Ctrl+K (corta la línea actual), Ctrl+U (pega).

> nano no tiene “modos”; todo se hace con combinaciones de teclas mientras escribes. Esto lo hace intuitivo, pero limita su eficiencia en tareas complejas o repetitivas.

Es ideal para:

- Editar archivos de configuración rápidos (/etc/hosts, .bashrc).
- Corregir errores menores en scripts.
- Situaciones donde necesitas hacer un cambio y salir sin distracciones.

## vim: eficiencia a través de modos

vim (mejora de vi) es un editor omnipresente en sistemas Unix/Linux, incluso en imágenes mínimas como contenedores. Aunque famoso por su curva de aprendizaje, su diseño basado en modos permite ediciones extremadamente rápidas una vez dominado.

### Modos principales

1. Modo normal (Normal mode):
   - Es el estado predeterminado al abrir vim. Aquí, cada tecla ejecuta un comando, no inserta texto. Por ejemplo:
   - h, j, k, l → moverse izquierda, abajo, arriba, derecha.
   - x → borrar el carácter bajo el cursor.
   - dd → borrar la línea actual.
   - :w → guardar; :q → salir; :wq → guardar y salir.
2. Modo inserción (Insert mode):
   - Se entra desde el modo normal con teclas como i (insertar antes del cursor), a (añadir después), o (nueva línea abajo). Aquí, todo lo que escribes se inserta como texto. Para volver al modo normal, presiona Esc.
3. Modo visual (Visual mode):
   - Se activa con v (selección por caracteres), V (por líneas) o Ctrl+v (bloque). Permite seleccionar texto para copiar (y), cortar (d) o aplicar comandos.

### Flujo básico de trabajo

```bash
vim script.sh      # abre el archivo
i                  # entra en modo inserción
# escribes tu código
Esc                # vuelves al modo normal
:wq                # guardas y sales
```

Si sales sin querer guardar, usa :q! para forzar la salida sin cambios.

> Muchos usuarios instalan plugins o configuraciones como Vimium o Neovim para modernizar la experiencia, pero incluso el vim básico es suficiente para emergencias o servidores remotos.

## Por qué aprender vim

Aunque nano es más fácil al principio, vim está garantizado que existirá en cualquier sistema Unix-like, incluidos routers, servidores embebidos o contenedores Docker mínimos. Además, sus comandos son tan eficientes que muchos IDEs y editores modernos (como VS Code) ofrecen extensiones para emular su comportamiento.

## Quédate con...

- Usa nano cuando necesites hacer una edición rápida sin aprender comandos: guarda con Ctrl+O, sale con Ctrl+X.
- vim opera en modos: normal (comandos), inserción (escribir texto) y visual (seleccionar).
- En vim, empieza con i para escribir, Esc para salir del modo inserción, y :wq para guardar y salir.
- vim está en todos lados; saber lo básico te salva en entornos restringidos.
- No necesitas dominar vim al instante, pero conocer cómo abrir, editar, guardar y salir es una habilidad esencial para cualquier desarrollador o administrador.

<div class="pagination">
  <a href="/markdown/sistemas/linux/directorios/visualizacion" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/directorios/comodines" class="next">Siguiente</a>
</div>
