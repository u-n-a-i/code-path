---
title: "Paquetes y repositorios"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Paquetes y repositorios](#paquetes-y-repositorios)
  - [¿Qué es un paquete?](#qué-es-un-paquete)
  - [Repositorios: oficiales y de terceros](#repositorios-oficiales-y-de-terceros)
  - [Formatos de paquetes: .deb vs .rpm](#formatos-de-paquetes-deb-vs-rpm)
    - [.deb — Familia Debian](#deb--familia-debian)
    - [.rpm — Familia Red Hat](#rpm--familia-red-hat)
  - [Quédate con...](#quédate-con)

</div>

# Paquetes y repositorios

En Linux, el software rara vez se instala copiando archivos manualmente. En su lugar, se distribuye a través de paquetes: archivos estructurados que contienen no solo los binarios ejecutables, sino también metadatos esenciales como descripciones, versiones, licencias y, crucialmente, dependencias. Estos paquetes se almacenan en repositorios, servidores remotos o locales que actúan como catálogos organizados y verificados. El sistema de gestión de paquetes del sistema operativo se encarga de descargar, verificar, instalar, actualizar y eliminar estos paquetes de forma coherente, resolviendo automáticamente las dependencias para evitar conflictos. Este modelo es uno de los pilares de la estabilidad, seguridad y facilidad de mantenimiento de las distribuciones Linux modernas.

## ¿Qué es un paquete?

Un paquete es un archivo comprimido con una estructura estandarizada que incluye:

- Archivos del programa: binarios ejecutables, bibliotecas, scripts, documentación, iconos, etc.
- Metadatos: nombre, versión, descripción, licencia, mantenedor, cambios recientes.
- Dependencias: lista de otros paquetes necesarios para que este funcione correctamente (por ejemplo, una aplicación gráfica puede depender de una biblioteca GTK).
- Scripts de instalación/desinstalación: instrucciones que se ejecutan antes o después de instalar/eliminar (como crear usuarios, habilitar servicios o actualizar cachés).

Gracias a esta información, el gestor de paquetes puede:

- Verificar la integridad del paquete (mediante firmas digitales).
- Asegurar que todas las dependencias estén presentes antes de instalar.
- Eliminar completamente todos los archivos cuando se desinstala.
- Actualizar múltiples paquetes de forma atómica y segura.

> Instalar software fuera del sistema de paquetes (por ejemplo, descargando un binario de internet) rompe esta coherencia y puede llevar a “infestación de archivos huérfanos” o conflictos de versión.

## Repositorios: oficiales y de terceros

Los repositorios son colecciones indexadas de paquetes, normalmente alojadas en servidores accesibles por HTTP o FTP. Cada distribución mantiene sus propios repositorios oficiales, que garantizan compatibilidad, seguridad y soporte.

Repositorios oficiales:

Mantenidos por el equipo de la distribución. Los paquetes están probados, firmados y actualizados regularmente.

Ejemplos:

- Ubuntu/Debian: http://archive.ubuntu.com/ubuntu
- Fedora: https://mirrors.fedoraproject.org
- Arch: https://archlinux.org/packages

Repositorios de terceros:

Ofrecidos por desarrolladores externos o comunidades para software no incluido en los repos oficiales (por licencia, novedad o política).

Ejemplos:

- Docker, Google Chrome, VS Code suelen ofrecer sus propios repositorios.
- En Ubuntu, el repositorio ppa:nombre/ppa (Personal Package Archive) permite a usuarios compartir paquetes fácilmente.

> Agregar repositorios de terceros implica confiar en su mantenedor. Un repositorio malicioso podría entregar paquetes modificados. Siempre verifica las claves GPG y la reputación del origen.

## Formatos de paquetes: .deb vs .rpm

Las distribuciones Linux se agrupan en dos grandes familias según el formato de paquete que usan:

### .deb — Familia Debian

Usado por Debian, Ubuntu, Linux Mint, Pop!\_OS, entre otros.

- Gestor de bajo nivel: dpkg (instala paquetes locales).
- Gestor de alto nivel: APT (apt, apt-get, apt-cache) — maneja repositorios y resuelve dependencias.

Comando típico:

```bash
sudo apt install nombre-paquete
```

### .rpm — Familia Red Hat

Usado por Fedora, CentOS/RHEL, openSUSE, AlmaLinux, entre otros.

- Gestor de bajo nivel: rpm (instala paquetes locales).
- Gestores de alto nivel:
  - DNF (en Fedora/RHEL 8+)
  - YUM (versión anterior, aún en uso en algunos sistemas)
  - ZYpp (en openSUSE)

Comando típico:

```bash
sudo dnf install nombre-paquete
```

> Aunque los formatos son incompatibles entre sí, ambos cumplen la misma función conceptual. Nunca intentes instalar un .deb en una distro basada en RPM (o viceversa) sin herramientas de conversión especializadas (y aun así, no es recomendable).

## Quédate con...

- Un paquete contiene binarios, metadatos y dependencias, gestionado por el sistema para garantizar coherencia.
- Los repositorios oficiales son seguros y compatibles; los de terceros deben evaluarse con cuidado.
- .deb (Debian/Ubuntu) y .rpm (Red Hat/Fedora) son los dos formatos principales, cada uno con sus propios gestores (APT vs DNF/YUM).
- El sistema de paquetes evita el “DLL hell” o conflictos de versión comunes en otros sistemas operativos.
- Siempre prefiere instalar software desde repositorios oficiales o fuentes confiables antes que desde binarios genéricos descargados de internet.

<div class="pagination">
  <a href="/sistemas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/software/gestores" class="next">Siguiente</a>
</div>
