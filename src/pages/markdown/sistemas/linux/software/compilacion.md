---
title: "Compilación desde código fuente"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Compilación desde código fuente](#compilación-desde-código-fuente)
  - [El flujo clásico: ./configure, make, make install](#el-flujo-clásico-configure-make-make-install)
    - [./configure](#configure)
    - [make](#make)
    - [make install](#make-install)
  - [Riesgos de la instalación manual](#riesgos-de-la-instalación-manual)
  - [Buenas prácticas: checkinstall y entornos aislados](#buenas-prácticas-checkinstall-y-entornos-aislados)
    - [Usa checkinstall para crear paquetes locales](#usa-checkinstall-para-crear-paquetes-locales)
    - [Alternativas modernas](#alternativas-modernas)
  - [Manejo de problemas comunes](#manejo-de-problemas-comunes)
    - [Dependencias faltantes](#dependencias-faltantes)
    - [Sistema roto tras instalación manual](#sistema-roto-tras-instalación-manual)
  - [Quédate con...](#quédate-con)

</div>

# Compilación desde código fuente

Aunque la mayoría del software en Linux se instala mediante paquetes precompilados, hay situaciones en las que necesitas compilar desde el código fuente: para obtener la versión más reciente (antes de que esté en los repositorios), aplicar parches personalizados, optimizar para tu hardware o simplemente aprender cómo funciona el software. Este proceso implica transformar código legible por humanos en binarios ejecutables mediante herramientas como gcc, make y scripts de configuración. Sin embargo, instalar software compilado manualmente conlleva riesgos importantes: puede sobrescribir archivos del sistema, no registrar sus componentes en el gestor de paquetes y dificultar futuras actualizaciones o desinstalaciones. Por eso, es esencial seguir buenas prácticas que preserven la integridad de tu sistema.

## El flujo clásico: ./configure, make, make install

Muchos proyectos de código abierto siguen un estándar establecido por Autotools, que proporciona un flujo de tres pasos:

### ./configure

Este script analiza tu sistema para:

- Detectar bibliotecas y herramientas instaladas.
- Verificar que se cumplan las dependencias.
- Generar un Makefile personalizado para tu entorno.

Ejemplo:

```bash
./configure --prefix=/usr/local
```

La opción --prefix define dónde se instalará el software (por defecto, suele ser /usr/local).

Si falla: normalmente indica qué dependencia falta (por ejemplo, libssl-dev). En distribuciones basadas en Debian, instala los paquetes -dev o -devel correspondientes:

```bash
sudo apt install build-essential libssl-dev
```

### make

Compila el código fuente usando las instrucciones del Makefile generado. Puede tardar desde segundos hasta horas, según la complejidad.

```bash
make

# Opcional: usar múltiples núcleos para acelerar:
make -j$(nproc)
```

### make install

Copia los binarios, bibliotecas y archivos de configuración a sus ubicaciones finales (según --prefix).

```bash
sudo make install
```

Problema clave: este paso no registra el software en el gestor de paquetes. Si más tarde intentas actualizar o eliminarlo con apt o dnf, el sistema no sabrá que existe.

## Riesgos de la instalación manual

- Archivos huérfanos: al desinstalar, no hay forma automática de saber qué archivos eliminó el software.
- Conflictos con paquetes del sistema: si instalas en /usr en lugar de /usr/local, podrías sobrescribir archivos gestionados por apt.
- Dependencias no gestionadas: si una biblioteca del sistema se actualiza y rompe compatibilidad, tu programa compilado podría fallar sin advertencia.
- Dificultad para actualizar: debes repetir todo el proceso manualmente cada vez.

## Buenas prácticas: checkinstall y entornos aislados

### Usa checkinstall para crear paquetes locales

checkinstall intercepta make install y genera un paquete .deb o .rpm que sí se registra en el gestor de paquetes, permitiendo desinstalación limpia.

Instalación:

```bash
sudo apt install checkinstall    # en Debian/Ubuntu

# Uso:
./configure --prefix=/usr/local
make
sudo checkinstall
```

Durante la ejecución, te pedirá metadatos (nombre, versión, etc.). Al final, tendrás un paquete instalado que puedes gestionar con dpkg -r nombre.

Ventaja: combina la flexibilidad de la compilación con la seguridad del sistema de paquetes.

### Alternativas modernas

- Entornos aislados: instala en tu directorio personal (--prefix=$HOME/.local) para evitar tocar el sistema.
- Contenedores: compila dentro de un contenedor Docker efímero y extrae solo los binarios necesarios.
- Gestores de versiones: herramientas como asdf o pyenv gestionan compilaciones de lenguajes en aislamiento.

## Manejo de problemas comunes

### Dependencias faltantes

Si ./configure falla, busca los paquetes de desarrollo:

- En Debian/Ubuntu: nombre-dev o nombre-devel → libssl-dev, zlib1g-dev.
- En Fedora/RHEL: nombre-devel → openssl-devel, zlib-devel.

Usa:

```bash
apt search ssl | grep dev
# o
dnf search openssl | grep devel
```

### Sistema roto tras instalación manual

Si sobrescribes archivos críticos, usa:

```bash
sudo apt --fix-broken install
```

Esto intentará reinstalar paquetes del sistema cuyos archivos fueron modificados externamente.

También puedes verificar qué paquetes poseen un archivo específico:

```bash
dpkg -S /usr/bin/nombre   # en Debian/Ubuntu
rpm -qf /usr/bin/nombre   # en RHEL/Fedora
```

## Quédate con...

- El flujo clásico es: ./configure → make → sudo make install.
- Nunca uses make install directamente en producción sin considerar las consecuencias.
- checkinstall es la mejor práctica para convertir compilaciones manuales en paquetes gestionables.
- Instala en /usr/local o en tu home para minimizar riesgos.
- Las dependencias de compilación suelen requerir paquetes -dev o -devel.
- Si algo falla, apt --fix-broken install puede ayudar a restaurar la coherencia del sistema.
- Compilar desde fuente es poderoso, pero debe hacerse con responsabilidad: el sistema de paquetes existe para protegerte.

<div class="pagination">
  <a href="/markdown/sistemas/linux/software/conflictos" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
