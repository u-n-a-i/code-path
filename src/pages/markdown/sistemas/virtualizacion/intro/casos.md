---
title: "Escenarios de uso inicial"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Escenarios de uso inicial](#escenarios-de-uso-inicial)
  - [Probar sistemas operativos sin particionar el disco: aislamiento experimental mediante abstracción de almacenamiento](#probar-sistemas-operativos-sin-particionar-el-disco-aislamiento-experimental-mediante-abstracción-de-almacenamiento)
  - [Ejecutar software legacy: compatibilidad mediante emulación controlada de entorno de ejecución](#ejecutar-software-legacy-compatibilidad-mediante-emulación-controlada-de-entorno-de-ejecución)
  - [Consideraciones operativas para escenarios de prueba y legacy](#consideraciones-operativas-para-escenarios-de-prueba-y-legacy)
  - [Quédate con...](#quédate-con)

</div>

# Escenarios de uso inicial

Antes de convertirse en el cimiento de los centros de datos modernos y la nube pública, la virtualización encontró su adopción masiva inicial en dos casos de uso pragmáticos y accesibles: la capacidad de probar sistemas operativos sin alterar la configuración del disco físico y la ejecución de software legacy en hardware moderno. Estos escenarios, aparentemente simples, democratizaron el acceso a la virtualización al resolver problemas cotidianos de desarrolladores, administradores de sistemas y entusiastas: la necesidad de experimentar con seguridad y la obligación de mantener compatibilidad con aplicaciones obsoletas. Comprender estos casos de uso fundacionales no es solo un ejercicio histórico; revela propiedades esenciales de la virtualización —aislamiento, portabilidad y abstracción de hardware— que posteriormente escalaron para habilitar arquitecturas empresariales complejas. Cada escenario ilustra cómo una tecnología diseñada para mainframes en los años 60 encontró nueva vida al resolver fricciones operativas en la era del commodity hardware.

## Probar sistemas operativos sin particionar el disco: aislamiento experimental mediante abstracción de almacenamiento

La capacidad de ejecutar un sistema operativo alternativo sin modificar el particionado del disco físico representa uno de los beneficios más inmediatos y tangibles de la virtualización para usuarios técnicos. En arquitecturas bare-metal, probar una nueva distribución de Linux, una versión beta de Windows o un sistema operativo exótico (FreeBSD, Haiku, etc.) requería particionar el disco, configurar gestores de arranque duales y asumir el riesgo de corrupción de datos o pérdida de acceso al sistema principal. La virtualización elimina esta fricción al convertir el disco físico en un recurso compartido y presentar a cada VM un disco virtual independiente, implementado como archivo o volumen lógico en el sistema de archivos del host.

```text
Flujo tradicional vs. virtualizado para probar un SO:

Bare-metal (riesgoso):
1. Redimensionar partición existente → riesgo de pérdida de datos
2. Crear nueva partición → espacio fijo, difícil de ajustar
3. Instalar gestor de arranque dual → posible bloqueo del boot
4. Probar SO → cualquier error afecta al hardware físico

Virtualizado (seguro):
1. Crear archivo de disco virtual (ej: 20GB qcow2) → sin tocar particiones reales
2. Adjuntar ISO de instalación a la VM → aislamiento completo
3. Instalar y probar SO invitado → fallos contenidos en la VM
4. Eliminar archivo .qcow2 si no se necesita → limpieza instantánea
```

Los discos virtuales ofrecen propiedades que facilitan la experimentación:
- **Dinámicos vs. fijos**: un disco dinámico (thin-provisioned) ocupa solo el espacio realmente escrito, permitiendo crear VMs de "100GB" que inicialmente consumen <1GB físico.
- **Snapshots**: capturar el estado pre-instalación permite revertir a un punto limpio tras pruebas destructivas.
- **Clonación rápida**: duplicar una VM configurada para probar variantes sin reinstalar desde cero.

```bash
# Crear un disco virtual dinámico con qemu-img (KVM/QEMU)
qemu-img create -f qcow2 /var/lib/libvirt/images/test-ubuntu.qcow2 20G

# Verificar tamaño real en disco (inicialmente pequeño)
ls -lh /var/lib/libvirt/images/test-ubuntu.qcow2
# Salida: -rw-r--r-- 1 root root 193K ... (solo metadatos inicialmente)

# Instalar Ubuntu en la VM, luego verificar crecimiento
du -h /var/lib/libvirt/images/test-ubuntu.qcow2
# Salida: 8.2G ... (crece según se escriben datos)
```

> Los discos dinámicos pueden fragmentarse en el sistema de archivos del host, degradando rendimiento de E/S secuencial. Para cargas intensivas en disco (bases de datos, compilaciones grandes), considerar discos pre-asignados (`qemu-img create -f raw ...`) o almacenar discos virtuales en volúmenes LVM o sistemas de archivos optimizados (XFS, ZFS) con asignación directa.

## Ejecutar software legacy: compatibilidad mediante emulación controlada de entorno de ejecución

La obsolescencia de software es un problema estructural en entornos empresariales, industriales y gubernamentales: aplicaciones críticas desarrolladas para Windows XP, DOS o versiones antiguas de Linux que no pueden migrarse fácilmente a plataformas modernas debido a dependencias de kernel, librerías deprecated o hardware específico. La virtualización resuelve este desafío al permitir ejecutar el sistema operativo original —con su kernel, drivers y entorno de ejecución exactos— como una VM aislada sobre hardware moderno, creando una cápsula del tiempo operativa que preserva la compatibilidad sin sacrificar la seguridad física del host.

```text
Arquitectura de ejecución de software legacy virtualizado:

[Aplicación legacy: Windows XP + .NET 1.1 + driver hardware antiguo]
                          ↓
[SO Invitado: Windows XP SP3 con drivers originales]
                          ↓
[Hipervisor: traduce accesos a hardware moderno]
                          ↓
[Hardware físico: CPU x86_64, SSD NVMe, NIC 10GbE]
```

Este enfoque ofrece ventajas clave frente a alternativas como emulación pura o máquinas físicas dedicadas:

| Alternativa | Limitaciones | Ventaja de virtualización |
|-------------|-------------|--------------------------|
| **Emulación (QEMU sin KVM)** | Rendimiento 10-50x menor, sin aceleración hardware | Virtualización con VT-x/AMD-V: 95-98% del rendimiento nativo |
| **Hardware físico legacy** | Fallos de hardware irreemplazables, sin soporte de seguridad | Hardware moderno con mantenimiento, snapshots para recuperación |
| **Reescritura de aplicación** | Costo prohibitivo, riesgo de regresiones funcionales | Preserva comportamiento exacto sin modificar código |

```xml
<!-- Ejemplo: configuración de VM para Windows XP en libvirt/KVM -->
<domain type='kvm'>
  <name>windows-xp-legacy-app</name>
  <memory unit='MiB'>1024</memory>
  <vcpu>1</vcpu>
  <os>
    <type arch='i686' machine='pc-i440fx-2.4'>hvm</type>
    <!-- Máquina antigua para compatibilidad con drivers XP -->
    <boot dev='hd'/>
  </os>
  <features>
    <acpi/>
    <apic/>
    <!-- Deshabilitar características modernas que XP no soporta -->
    <vmport state='off'/>
  </features>
  <devices>
    <!-- Disco con imagen pre-instalada de XP -->
    <disk type='file' device='disk'>
      <driver name='qemu' type='qcow2'/>
      <source file='/storage/legacy/win-xp-app.qcow2'/>
      <target dev='hda' bus='ide'/>  <!-- IDE para compatibilidad con drivers XP -->
    </disk>
    <!-- Red con modelo e1000 (compatible) en lugar de virtio -->
    <interface type='network'>
      <model type='e1000'/>
    </interface>
    <!-- USB para dongles de licencia hardware -->
    <hostdev mode='subsystem' type='usb'>
      <source>
        <vendor id='0x1234'/>
        <product id='0x5678'/>
      </source>
    </hostdev>
  </devices>
</domain>
```

> Ejecutar sistemas operativos sin soporte (Windows XP, Server 2003) en red conlleva riesgos de seguridad críticos: sin parches de seguridad, cualquier exposición a internet es una superficie de ataque. Aislar estas VMs en redes VLAN privadas sin acceso a internet, usar firewalls a nivel de hipervisor y considerar soluciones de "air-gap" lógico para minimizar riesgos. Para aplicaciones que requieren acceso a red, evaluar proxies de aplicación o gateways de seguridad que inspeccionen tráfico antes de permitirlo llegar a la VM legacy.

## Consideraciones operativas para escenarios de prueba y legacy

Ambos escenarios comparten requisitos operativos que, si se ignoran, pueden convertir una solución pragmática en una deuda técnica:

1. **Gestión del ciclo de vida**: Una VM de prueba o legacy no debe convertirse en "zombie". Implementar etiquetado (`env=test`, `owner=juan`, `expiry=2025-12-31`) y automatizar limpieza mediante scripts o herramientas de orquestación.

2. **Backup selectivo**: No todas las VMs requieren la misma estrategia de respaldo. Una VM de prueba efímera puede prescindir de backup; una VM legacy con datos críticos necesita replicación y snapshots regulares.

3. **Documentación del entorno**: Registrar versión exacta del SO invitado, aplicaciones instaladas, configuraciones especiales y dependencias externas. Una VM legacy sin documentación es una bomba de tiempo operativa.

```bash
# Script ejemplo: etiquetar y programar expiración para VM de prueba (libvirt)
#!/bin/bash
VM_NAME="test-ubuntu-experimental"
EXPIRY_DATE="2025-06-01"

# Añadir metadatos a la definición de la VM
virsh metadata "$VM_NAME" --uri "http://example.com/metadata/expiry" \
  --set "<expiry>$EXPIRY_DATE</expiry>" --config

# Programar tarea para notificar antes de eliminar (requiere cron/systemd timer)
echo "0 9 25 5 * /usr/local/bin/notify-vm-expiry $VM_NAME" | crontab -
```

> La portabilidad de las VMs es una ventaja, pero también un riesgo: archivos de disco virtual pueden copiarse fácilmente, exponiendo datos sensibles o licencias de software. Cifrar discos virtuales sensibles (LUKS en Linux, BitLocker en Windows guest) y controlar acceso al almacenamiento del hipervisor son medidas esenciales de seguridad.

## Quédate con...

- Probar SOs sin particionar el disco es posible gracias a **discos virtuales** (archivos qcow2/vmdk) que abstraen el almacenamiento físico, permitiendo experimentación segura con rollback inmediato mediante snapshots.
- Los **discos dinámicos** ahorran espacio inicial pero pueden fragmentarse; para cargas intensivas en E/S, considerar discos pre-asignados o sistemas de archivos optimizados.
- Ejecutar software legacy en VMs preserva **compatibilidad exacta** de kernel, drivers y entorno de ejecución, evitando costos de reescritura o mantenimiento de hardware obsoleto.
- La virtualización legacy requiere **configuración específica**: máquinas antiguas (`pc-i440fx`), controladores compatibles (IDE, e1000) y asignación de hardware antiguo (USB passthrough) para funcionar correctamente.
- Los sistemas operativos sin soporte (XP, Server 2003) son **riesgos de seguridad activos**: aislarlos en redes privadas, sin acceso a internet, y documentar exhaustivamente su propósito y dependencias.
- Implementar **gobernanza operativa**: etiquetado, fechas de expiración y backups selectivos para evitar que VMs de prueba o legacy se conviertan en deuda técnica no gestionada.
- La portabilidad de VMs facilita migración y recuperación, pero exige **cifrado y control de acceso** para proteger datos sensibles y licencias de software empaquetadas en imágenes virtuales.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/intro/componentes" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
