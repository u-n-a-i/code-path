---
title: "Gestores de paquetes por distribución"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Gestores de paquetes por distribución](#gestores-de-paquetes-por-distribución)
  - [Debian/Ubuntu: apt y dpkg](#debianubuntu-apt-y-dpkg)
    - [Archivo de fuentes: /etc/apt/sources.list](#archivo-de-fuentes-etcaptsourceslist)
    - [Comandos esenciales de APT](#comandos-esenciales-de-apt)
  - [RHEL/Fedora: dnf / yum y rpm](#rhelfedora-dnf--yum-y-rpm)
    - [Comandos comunes](#comandos-comunes)
  - [Arch Linux: pacman](#arch-linux-pacman)
    - [Comandos clave](#comandos-clave)
  - [Alpine Linux: apk](#alpine-linux-apk)
    - [Operaciones básicas](#operaciones-básicas)
  - [Herramientas modernas: Snap, Flatpak y AppImage](#herramientas-modernas-snap-flatpak-y-appimage)
    - [Snap (desarrollado por Canonical)](#snap-desarrollado-por-canonical)
    - [Flatpak](#flatpak)
    - [AppImage](#appimage)
  - [Quédate con...](#quédate-con)

</div>

# Gestores de paquetes por distribución

Cada familia de distribuciones Linux ha desarrollado su propio ecosistema de gestión de software, con herramientas y convenciones específicas. Aunque todas comparten el mismo objetivo —instalar, actualizar y eliminar software de forma segura y coherente—, difieren en sintaxis, rendimiento y filosofía. Además, en los últimos años han surgido sistemas universales como Snap y Flatpak, que ofrecen aplicaciones autocontenidas independientes de la distribución subyacente. Conocer las herramientas nativas de tu sistema y las alternativas modernas te permite elegir la mejor estrategia para cada tipo de software: desde componentes del sistema hasta aplicaciones de escritorio complejas.

## Debian/Ubuntu: apt y dpkg

La familia Debian (incluyendo Ubuntu) utiliza el formato .deb y el gestor de alto nivel APT (Advanced Package Tool), que resuelve dependencias y se comunica con repositorios remotos.

### Archivo de fuentes: /etc/apt/sources.list

Este archivo (y los en /etc/apt/sources.list.d/) define qué repositorios usa el sistema. Una línea típica:

```
deb http://archive.ubuntu.com/ubuntu jammy main restricted
```

- deb: paquetes binarios.
- URL: servidor del repositorio.
- jammy: nombre de la versión (codename).
- main restricted: componentes (software libre, propietario, etc.).

> Al añadir repositorios de terceros (como los de Docker o VS Code), se crea un archivo .list en /etc/apt/sources.list.d/.

### Comandos esenciales de APT

```bash
sudo apt update                # actualiza la lista de paquetes disponibles
sudo apt upgrade               # actualiza los paquetes instalados (sin eliminar)
sudo apt full-upgrade          # actualización completa (puede eliminar paquetes conflictivos)
sudo apt install nombre        # instala un paquete
sudo apt remove nombre         # elimina el paquete, pero conserva archivos de configuración
sudo apt purge nombre          # elimina el paquete y todos sus archivos de configuración
sudo apt search palabra        # busca paquetes por nombre o descripción
sudo apt show nombre           # muestra detalles de un paquete
sudo apt autoremove            # elimina paquetes huérfanos (dependencias ya no necesarias)
```

Siempre ejecuta apt update antes de instalar o buscar, para asegurarte de usar la información más reciente.

## RHEL/Fedora: dnf / yum y rpm

Las distribuciones basadas en Red Hat usan el formato .rpm. Históricamente se usaba yum, pero desde Fedora 22 y RHEL 8, dnf es el gestor predeterminado (más rápido y con mejor resolución de dependencias).

### Comandos comunes

```bash
sudo dnf check-update          # equivalente a "apt update" + listado de actualizaciones
sudo dnf upgrade               # actualiza todos los paquetes
sudo dnf install nombre        # instala un paquete
sudo dnf remove nombre         # elimina un paquete
sudo dnf search palabra        # busca paquetes
sudo dnf info nombre           # muestra información detallada
sudo dnf autoremove            # elimina dependencias innecesarias
```

En sistemas antiguos (CentOS 7, RHEL 7), reemplaza dnf por yum.

## Arch Linux: pacman

Arch usa su propio gestor, pacman, conocido por su simplicidad y velocidad. Combina funciones de instalación, actualización y consulta en una sola herramienta.

### Comandos clave

```bash
sudo pacman -Syu               # sincroniza repositorios y actualiza todo el sistema
sudo pacman -S nombre          # instala un paquete
sudo pacman -R nombre          # elimina un paquete
sudo pacman -Rs nombre         # elimina paquete y dependencias no usadas
sudo pacman -Qs palabra        # busca paquetes instalados
sudo pacman -Ss palabra        # busca en repositorios
sudo pacman -Si nombre         # muestra información del paquete
```

En Arch, no hay distinción entre actualización parcial y completa: siempre se debe hacer -Syu para mantener la coherencia del sistema.

## Alpine Linux: apk

Alpine, diseñada para ser ultraligera (usada en contenedores), emplea apk (Alpine Package Keeper), optimizado para velocidad y bajo consumo.

### Operaciones básicas

```bash
sudo apk update                # actualiza índices
sudo apk upgrade               # actualiza paquetes
sudo apk add nombre            # instala
sudo apk del nombre            # elimina
sudo apk search palabra        # busca
sudo apk info nombre           # muestra detalles
```

apk es extremadamente rápido y consume poca memoria, ideal para entornos con recursos limitados.

## Herramientas modernas: Snap, Flatpak y AppImage

Además de los gestores nativos, han surgido sistemas de distribución universal que empaquetan aplicaciones con todas sus dependencias, logrando portabilidad entre distribuciones.

### Snap (desarrollado por Canonical)

- Formato: paquetes autocontenidos con sandboxing.
- Repositorio central: Snap Store.

```bash
sudo snap install nombre
```

- Ventajas:
  - Actualizaciones automáticas.
  - Aislamiento seguro (mediante interfaces de snapd).
  - Disponible en múltiples distros (aunque integrado por defecto en Ubuntu).
- Desventajas:
  - Mayor uso de disco (dependencias duplicadas).
  - Latencia al inicio (por montaje de squashfs).
  - Control centralizado por Canonical.

### Flatpak

- Formato: aplicaciones en tiempo de ejecución compartidas (runtimes).
- Repositorios: Flathub (comunidad), repos privados.

```bash
flatpak install flathub org.mozilla.firefox
```

- Ventajas:
  - Menor duplicación (los runtimes se comparten entre apps).
  - Más control para el usuario sobre permisos.
  - Neutral respecto a distribuciones.
- Desventajas:
  - Requiere instalación previa de soporte (flatpak y repositorios).
  - Las aplicaciones pueden ser más grandes que las nativas.

### AppImage

- Formato: un solo archivo ejecutable autocontenido (sin instalación).
- Uso: descargar, dar permiso de ejecución y lanzar.

```bash
chmod +x app.AppImage
./app.AppImage
```

- Ventajas:
  - Máxima portabilidad (“descarga y ejecuta”).
  - Sin privilegios de root necesarios.
  - Sin instalación ni rastros en el sistema.
- Desventajas:
  - No hay actualizaciones automáticas (aunque algunas apps lo integran).
  - No hay integración con el sistema (menús, iconos, MIME types requieren configuración manual).
  - Sin aislamiento de seguridad por defecto.

> Estas tecnologías no reemplazan a los gestores nativos, sino que complementan para aplicaciones de escritorio complejas (como IDEs, navegadores o suites multimedia). Para bibliotecas del sistema, servidores o herramientas CLI, sigue siendo preferible el gestor nativo.

## Quédate con...

- Cada distribución tiene su gestor nativo:
  - Debian/Ubuntu → apt
  - RHEL/Fedora → dnf
  - Arch → pacman
  - Alpine → apk
- Los gestores nativos ofrecen integración total, eficiencia y coherencia con el sistema.
- Snap, Flatpak y AppImage priorizan portabilidad y aislamiento, ideales para aplicaciones de usuario final.
- Usa el gestor nativo para software del sistema; considera formatos universales para aplicaciones complejas que no están en los repos oficiales.
- Nunca mezcles fuentes sin entender sus implicaciones: la estabilidad de tu sistema depende de la coherencia del ecosistema de paquetes.

<div class="pagination">
  <a href="/markdown/sistemas/linux/software/paquetes" class="prev">Anterior</a>
  <a href="/markdown/sistemas/linux/software/conflictos" class="next">Siguiente</a>
</div>
