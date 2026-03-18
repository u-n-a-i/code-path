---
title: "Instalación y configuración inicial"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Instalación y configuración inicial](#instalación-y-configuración-inicial)
  - [Instalar Git](#instalar-git)
  - [Configurar nombre y correo](#configurar-nombre-y-correo)
  - [Quédate con...](#quédate-con)

</div>

# Instalación y configuración inicial

Cada acción registrada en un repositorio lleva asociada una identidad que atribuye autoría y responsabilidad sobre los cambios. A diferencia de sistemas centralizados donde el servidor puede inferir el usuario desde las credenciales de acceso, Git incrusta metadatos de autor en cada commit de forma permanente e inmutable. Esta arquitectura descentralizada exige que cada entorno de trabajo declare explícitamente quién está operando la herramienta antes de poder participar en el historial del proyecto. La instalación del software y la configuración de esta identidad son los prerrequisitos técnicos que habilitan la trazabilidad y la colaboración futura.

## Instalar Git

La disponibilidad de Git en los principales sistemas operativos refleja su estatus como herramienta estándar en la industria del desarrollo. El proceso de instalación varía según la plataforma, pero el objetivo es común: disponer del binario `git` accesible desde la línea de comandos y de las librerías necesarias para operaciones criptográficas y de red.

En distribuciones Linux basadas en Debian o Ubuntu, el gestor de paquetes APT proporciona una versión estable mediante `sudo apt install git`. Sistemas basados en RHEL o Fedora utilizan DNF (`sudo dnf install git`), mientras que Arch Linux usa Pacman (`sudo pacman -S git`). Una consideración importante en Linux es la versión del repositorio oficial: las distribuciones de lanzamiento fijo (LTS) pueden ofrecer versiones antiguas que carecen de características recientes o correcciones de seguridad. Cuando se requiere la última versión, es preferible usar repositorios adicionales mantenido por la comunidad o compilar desde el código fuente.

macOS ofrece dos vías principales. La instalación de las Command Line Tools de Xcode (`xcode-select --install`) incluye una versión básica de Git suficiente para operaciones comunes. Para gestionar versiones actualizadas y dependencias de forma consistente, muchos desarrolladores prefieren usar Homebrew (`brew install git`), un gestor de paquetes de terceros que mantiene el software al día independientemente de las actualizaciones del sistema operativo.

Windows no incluye Git de forma nativa. El proyecto oficial mantiene "Git for Windows", un instalador que proporciona las herramientas de línea de comandos, una integración con el explorador de archivos y Git Bash, un emulador de terminal que permite ejecutar comandos estilo Unix en el entorno Windows. Esta herramienta es esencial para seguir tutoriales y documentación que asumen un entorno POSIX, garantizando que los comandos funcionen de manera consistente independientemente del sistema operativo subyacente.

Tras la instalación, verificar la disponibilidad del comando confirma que el binario se agregó correctamente a la variable de entorno PATH del sistema. Ejecutar `git --version` muestra el número de versión instalado, información crítica al consultar documentación o reportar errores, ya que el comportamiento de ciertos comandos puede variar entre versiones mayores.

## Configurar nombre y correo

La configuración de identidad es el primer paso operativo tras la instalación. Git requiere saber qué nombre y dirección de correo electrónico asociar a los commits que se generen en este equipo. Esta información no sirve para autenticación o seguridad de acceso, sino exclusivamente para atribución en el historial del proyecto.

El comando `git config` gestiona las variables de configuración. La opción `--global` indica que los valores se aplicarán a todos los repositorios del usuario actual, almacenándose en el archivo `~/.gitconfig` en Linux/macOS o `%USERPROFILE%\.gitconfig` en Windows.

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

El nombre puede ser cualquier cadena de texto, típicamente el nombre real o un alias consistente. El correo electrónico, aunque no se verifica automáticamente durante el commit, debe ser accesible si se desea vincular la actividad con una cuenta en plataformas como GitHub o GitLab. Estas plataformas cruzan el email configurado en Git con el email registrado en la cuenta para atribuir contribuciones al perfil correcto. Usar un email privado proporcionado por la plataforma (como `id+username@users.noreply.github.com`) es una práctica común para proteger la dirección personal mientras se mantiene la vinculación de contribuciones.

La configuración puede verificarse en cualquier momento con `git config --list`, que muestra todas las variables activas, o `git config user.name` para consultar un valor específico. Es posible sobrescribir la configuración global a nivel de un repositorio específico omitiendo la bandera `--global`, útil cuando se requiere identidad distinta para proyectos personales y laborales en la misma máquina.

> La información configurada con `git config` se almacena en texto plano dentro del archivo de configuración del usuario. No es un almacén seguro: cualquiera con acceso al archivo puede leer el nombre y correo configurados. Nunca almacenes contraseñas, tokens o claves API en la configuración de Git usando este mecanismo; para credenciales sensibles, usa gestores de credenciales del sistema o variables de entorno.

## Quédate con...

*   Git requiere instalación explícita en Windows y macOS, mientras que en Linux suele estar disponible mediante el gestor de paquetes de la distribución.
*   Verificar la instalación con `git --version` confirma que el comando está accesible en el PATH del sistema y revela la versión instalada.
*   La configuración de `user.name` y `user.email` es obligatoria para crear commits, ya que Git incrusta esta identidad en cada registro del historial.
*   La opción `--global` aplica la configuración a todos los repositorios del usuario; omitirla limita el cambio al repositorio actual donde se ejecuta el comando.
*   El correo electrónico configurado no necesita ser real para que Git funcione, pero debe coincidir con el registrado en plataformas remotas para vincular contribuciones al perfil correcto.
*   La configuración de Git se almacena en texto plano (`~/.gitconfig`); nunca uses este mecanismo para guardar credenciales sensibles o secretos.

<div class="pagination">
  <a href="/markdown/sistemas/git/intro/historia" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
