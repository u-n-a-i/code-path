---
title: "BIOS y UEFI"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [BIOS y UEFI](#bios-y-uefi)
  - [Función](#función)
  - [Diferencias entre BIOS y UEFI](#diferencias-entre-bios-y-uefi)
  - [Proceso de arranque](#proceso-de-arranque)
  - [Configuración básica](#configuración-básica)
  - [CMOS y pila](#cmos-y-pila)
  - [Seguridad](#seguridad)
    - [Secure Boot](#secure-boot)
    - [TPM / firmware TPM](#tpm--firmware-tpm)
    - [Contraseñas de arranque y de BIOS](#contraseñas-de-arranque-y-de-bios)
    - [Protección contra malware en el arranque](#protección-contra-malware-en-el-arranque)
  - [Herramientas avanzadas (según placa)](#herramientas-avanzadas-según-placa)
    - [Monitorización de voltajes y temperaturas](#monitorización-de-voltajes-y-temperaturas)
    - [Control de ventiladores](#control-de-ventiladores)
    - [Actualización de BIOS](#actualización-de-bios)
    - [Opciones de overclock](#opciones-de-overclock)
  - [Quédate con...](#quédate-con)

</div>

# BIOS y UEFI

El firmware de arranque —ya sea en su forma clásica (BIOS) o moderna (UEFI)— es el primer software que se ejecuta al encender una computadora. Reside en un chip de memoria no volátil en la placa base y tiene como misión inicializar el hardware, verificar su integridad y cargar el sistema operativo. Aunque su interfaz puede parecer arcaica o irrelevante para el desarrollo de aplicaciones de alto nivel, su correcta configuración es esencial para la estabilidad del sistema, la compatibilidad con dispositivos y, sobre todo, la seguridad del arranque. En un mundo donde los ataques a firmware son cada vez más comunes, comprender BIOS y UEFI no es solo útil: es una responsabilidad técnica.

## Función

Tanto BIOS como UEFI cumplen funciones críticas en las primeras fases del arranque:

- Inicialización del hardware: al encenderse, el firmware detecta y configura componentes esenciales: CPU, memoria, controladores de almacenamiento, GPU, etc.
- POST (Power-On Self-Test): realiza pruebas básicas para asegurar que el hardware mínimo funcione (RAM, CPU, teclado). Si falla, emite códigos de error (pitidos o mensajes en pantalla).
- Carga del sistema operativo: identifica dispositivos de arranque (SSD, USB, red) y transfiere el control al bootloader (como GRUB, Windows Boot Manager o systemd-boot).
- Interfaz de configuración: permite al usuario ajustar parámetros de bajo nivel: orden de arranque, voltajes, frecuencias, estado de periféricos, etc.

Este firmware actúa como puente entre el hardware desnudo y el sistema operativo, estableciendo las condiciones mínimas para que el software pueda ejecutarse.

## Diferencias entre BIOS y UEFI

Aunque ambos cumplen funciones similares, UEFI (Unified Extensible Firmware Interface) es una evolución radical de la BIOS heredada:

| Característica           | BIOS (heredada)                     | UEFI (moderna)                                           |
| ------------------------ | ----------------------------------- | -------------------------------------------------------- |
| Modo de ejecución        | 16 bits, limitado a 1 MB de memoria | 32 o 64 bits, acceso a varios GB de RAM                  |
| Interfaz                 | Texto en modo texto, teclado solo   | Gráfica, con soporte para ratón y múltiples idiomas      |
| Dispositivos de arranque | Usa tabla MBR (máx. 2 TB por disco) | Usa tabla GPT (soporta discos > 2 TB, hasta 9.4 ZB)      |
| Velocidad de arranque    | Lenta (inicialización secuencial)   | Rápida (inicialización paralela, drivers integrados)     |
| Extensibilidad           | Casi nula                           | Soporta drivers, aplicaciones y actualizaciones firmadas |
| Seguridad                | Muy limitada                        | Incluye Secure Boot, soporte para TPM, firmas de código  |

UEFI no solo es más rápido y flexible, sino que introduce un modelo de seguridad desde el firmware, esencial en la era de los ataques persistentes y el malware de bajo nivel.

## Proceso de arranque

El arranque en un sistema UEFI moderno sigue estos pasos clave:

1. Alimentación: la CPU se reinicia y salta a la dirección del firmware (UEFI).
1. Inicialización del firmware: UEFI carga sus drivers, activa la memoria y configura buses.
1. Detección de dispositivos: identifica SSDs, USBs, tarjetas de red, etc.
1. Secure Boot (si está activo): verifica la firma digital del bootloader contra claves almacenadas en el firmware. Si no es válido, se niega el arranque.
1. Carga del bootloader: UEFI transfiere el control al bootloader en el dispositivo de arranque seleccionado.
1. Arranque del sistema operativo: el bootloader carga el kernel y comienza la ejecución del SO.

Este proceso, que puede tomar menos de un segundo en sistemas modernos, es crucial para la integridad del sistema: cualquier compromiso en estas etapas permite al atacante persistir incluso tras reinstalar el sistema operativo.

## Configuración básica

Al acceder al firmware (normalmente pulsando Supr, F2 o Esc durante el arranque), el usuario puede configurar:

- Orden de arranque: qué dispositivo intentar primero (SSD, USB, PXE).
- Estado de componentes: activar/desactivar puertos USB, SATA, audio integrado, etc.
- Fecha y hora: almacenadas en la memoria CMOS.
- Modo de arranque: Legacy (BIOS) vs. UEFI (importante al instalar SO).
- Virtualización: activar Intel VT-x o AMD-V, necesario para Docker, VirtualBox o WSL2.

Muchas de estas opciones son invisibles para el sistema operativo, pero su configuración incorrecta puede hacer que un dispositivo no sea detectado o que una máquina virtual falle.

## CMOS y pila

La CMOS (Complementary Metal-Oxide-Semiconductor) es una pequeña memoria volátil (típicamente 256 bytes) que almacena la configuración del firmware: fecha, hora, orden de arranque, voltajes, etc. Para que esta memoria no se borre al apagar el equipo, la placa base incluye una pila de botón (CR2032) que la alimenta continuamente.

- Si la pila se agota, la CMOS pierde su configuración: el sistema vuelve a valores predeterminados, la hora se restablece y, en algunos casos, el equipo no arranca hasta que se configura de nuevo.
- En sistemas modernos, parte de la configuración crítica (como claves de Secure Boot) se almacena en memoria no volátil separada (flash), por lo que no se pierde al cambiar la pila.

## Seguridad

La seguridad del firmware ha ganado protagonismo debido a ataques como LoJax o MoonBounce, que infectan el BIOS/UEFI para persistir indefinidamente.

### Secure Boot

Mecanismo de UEFI que verifica la firma digital de cada componente del arranque (bootloader, controladores). Solo se ejecutan binarios firmados por entidades de confianza (Microsoft, distribuciones Linux certificadas). Impide que rootkits o bootkits se carguen antes del sistema operativo.

### TPM / firmware TPM

El Trusted Platform Module (TPM) es un chip (o su equivalente en firmware, fTPM) que almacena claves criptográficas de forma segura. Se usa para:

- Cifrado de disco (BitLocker, LUKS).
- Attestation remota (verificar que el firmware no ha sido modificado).
- Protección de credenciales (Windows Hello, certificados SSL).

UEFI moderno integra fTPM 2.0 directamente en la CPU o el chipset.

### Contraseñas de arranque y de BIOS

- Contraseña de supervisor: impide acceder o modificar la configuración del firmware.
- Contraseña de usuario/arranque: exige una clave antes de iniciar el sistema operativo.

Estas contraseñas se almacenan en la CMOS o en memoria protegida, y suelen requerir restablecimiento físico (puente de limpieza o extracción de pila) si se olvidan.

### Protección contra malware en el arranque

Además de Secure Boot, muchas placas incluyen:

- Intel Boot Guard o AMD Hardware Validated Boot: verifican la integridad del firmware mismo antes de ejecutarlo.
- Firmware TPM y medición de hashes del bootloader.
- Actualizaciones firmadas: solo se aceptan actualizaciones de BIOS con firma digital del fabricante.

Estas capas forman parte del modelo de confianza desde la raíz (root of trust), esencial en sistemas seguros.

## Herramientas avanzadas (según placa)

Las placas de gama media y alta ofrecen funciones avanzadas en su firmware:

### Monitorización de voltajes y temperaturas

Muestra en tiempo real:

- Temperatura de CPU, VRM (reguladores de voltaje), chipset.
- Voltajes de +12V, +5V, +3.3V, VCORE, VDIMM.
- Velocidad de ventiladores.

Útil para diagnosticar inestabilidad o sobrecalentamiento.

### Control de ventiladores

Permite definir curvas de refrigeración: a qué temperatura se activa cada ventilador y a qué velocidad gira. Algunas placas permiten perfiles automáticos (Silencioso, Rendimiento, Personalizado).

### Actualización de BIOS

Métodos modernos evitan tener que arrancar un SO para actualizar el firmware:

- Flash BIOS Button (ASUS): actualiza desde una USB con un botón físico.
- Q-Flash Plus (Gigabyte): actualiza sin CPU, RAM ni GPU instalados.
- EZ Flash (ASUS), M-Flash (MSI): desde el propio menú UEFI.

Esto es crucial para soportar nuevas CPUs que requieren versiones más recientes de firmware.

### Opciones de overclock

En placas con chipsets desbloqueados (Z790, B650, etc.), el UEFI permite:

- Ajustar frecuencias de CPU y RAM.
- Controlar voltajes (VCORE, VDDCR).
- Configurar perfiles XMP/EXPO para memoria.
- Monitorear estabilidad con pruebas integradas.

Estas herramientas permiten exprimir el rendimiento del hardware, aunque conllevan riesgos si no se hacen con cuidado.

> Modificar la configuración del firmware puede hacer que el sistema deje de arrancar. Siempre anota los valores originales antes de experimentar, y usa perfiles de respaldo si la placa lo permite.

## Quédate con...

- BIOS es un firmware heredado de 16 bits; UEFI es su sucesor moderno, más rápido, seguro y flexible.
- El proceso de arranque comienza en el firmware y termina con la carga del sistema operativo; cualquier fallo en esta cadena compromete la seguridad.
- Secure Boot, TPM/fTPM y las contraseñas de firmware son defensas esenciales contra malware persistente.
- La CMOS almacena la configuración y depende de una pila para mantenerse al apagar el equipo.
- Las placas modernas ofrecen herramientas avanzadas: monitorización, control de fans, actualización sin SO y overclocking desde el UEFI.
- El firmware no es “solo hardware”: es la primera capa de software del sistema, y su integridad es la base de toda la cadena de confianza.

<div class="pagination">
  <a href="/markdown/sistemas/hardware/placa_base/zocalos" class="prev">Anterior</a>
  <a href="/markdown/sistemas/hardware/placa_base/circuiteria" class="next">Siguiente</a>
</div>
