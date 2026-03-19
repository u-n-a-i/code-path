---
title: "Instalación básica"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Instalación básica](#instalación-básica)
  - [Instalación como sistema operativo ligero: flujo típico y decisiones arquitectónicas tempranas](#instalación-como-sistema-operativo-ligero-flujo-típico-y-decisiones-arquitectónicas-tempranas)
  - [Acceso y gestión remota: interfaz web, CLI y APIs como único punto de entrada](#acceso-y-gestión-remota-interfaz-web-cli-y-apis-como-único-punto-de-entrada)
  - [Configuración inicial de almacenamiento: creación y montaje de datastores](#configuración-inicial-de-almacenamiento-creación-y-montaje-de-datastores)
  - [Configuración inicial de redes virtuales: segmentación, bridges y políticas de tráfico](#configuración-inicial-de-redes-virtuales-segmentación-bridges-y-políticas-de-tráfico)
  - [Quédate con...](#quédate-con)

</div>

# Instalación básica

La instalación de un hipervisor de Tipo 1 no sigue el flujo convencional de un sistema operativo de propósito general: no se trata de instalar controladores para periféricos de usuario o configurar un entorno de escritorio, sino de preparar una plataforma minimalista cuya única función es orquestar el acceso seguro y eficiente al hardware subyacente. Este proceso, aparentemente sencillo en su superficie (ISO → boot → configuración inicial), encierra decisiones arquitectónicas críticas que determinan la estabilidad, seguridad y escalabilidad futura del entorno virtualizado: desde la selección del almacenamiento raíz del hipervisor hasta la segmentación temprana de redes de gestión, migración y producción. Comprender cada paso de esta instalación básica —más allá de seguir un asistente gráfico— es fundamental para evitar deuda técnica operativa, como redes mal segmentadas que saturan el tráfico de migración, o datastores configurados sin políticas de redundancia que exponen a pérdida de datos. Esta sección desglosa el flujo de instalación típico, los mecanismos subyacentes de configuración inicial y las mejores prácticas para sentar una base sólida sobre la que construir capacidades avanzadas de virtualización empresarial.

## Instalación como sistema operativo ligero: flujo típico y decisiones arquitectónicas tempranas

La instalación de un hipervisor de Tipo 1 sigue un patrón similar al de un SO embebido: una imagen ISO minimalista que se despliega directamente sobre el hardware físico, inicializando únicamente los componentes esenciales para la virtualización y la gestión remota. El proceso típico incluye:

1.  **Preparación del hardware**: verificar compatibilidad (HCL), habilitar extensiones de virtualización (VT-x/AMD-V) y configuración de RAID/NIC en firmware.
2.  **Boot desde medio de instalación**: ISO grabada en USB/DVD o montaje vía iDRAC/iLO/IPMI.
3.  **Selección de disco de instalación**: el hipervisor se instala en una partición pequeña (típicamente 8-32 GB), dejando el resto del almacenamiento para datastores de VMs.
4.  **Configuración inicial de red**: asignación de IP estática para gestión, máscara, gateway y DNS.
5.  **Establecimiento de credenciales**: contraseña de root/admin y, opcionalmente, configuración de SSH o acceso basado en directorio.
6.  **Finalización y reinicio**: el sistema arranca en modo "headless", exponiendo únicamente servicios de gestión remota.

```bash
# Ejemplo: particionado típico en instalación de ESXi (esquema simplificado)
# Disk: /dev/sda (128 GB SSD para hipervisor)

# Particiones creadas automáticamente por el instalador:
/dev/sda1: 4GB   → EFI System Partition (bootloader)
/dev/sda2: 110GB → VMware Hypervisor (vmkernel, tools, logs)
/dev/sda3: 2.5GB → VMware Tools partition (optional)
/dev/sda4: ~10GB → Scratch partition (logs temporales, core dumps)
/dev/sda5: Resto → Reservado para future updates/overprovisioning

# El almacenamiento para VMs se configura posteriormente en datastores
# separados (NFS, iSCSI, vSAN, o discos locales formateados como VMFS)
```

```bash
# Ejemplo: instalación automatizada de KVM sobre Debian/Ubuntu (preseed/cloud-init)
# Script de instalación mínima para hipervisor Tipo 1

#!/bin/bash
# 1. Instalar kernel con soporte KVM y herramientas de virtualización
apt-get install -y qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils virtinst

# 2. Habilitar y verificar módulo KVM
modprobe kvm_intel  # o kvm_amd
lsmod | grep kvm     # Verificar carga

# 3. Configurar red bridge para VMs (puente sobre interfaz física)
cat > /etc/netplan/01-netcfg.yaml << 'EOF'
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: no
  bridges:
    br0:
      interfaces: [eth0]
      dhcp4: yes
      parameters:
        stp: false
        forward-delay: 0
EOF
netplan apply

# 4. Habilitar servicio libvirtd y añadir usuario al grupo
systemctl enable --now libvirtd
usermod -aG libvirt $USER
```

> El disco de instalación del hipervisor debe ser resistente pero no necesariamente de alto rendimiento: las operaciones de E/S intensivas las realizan las VMs desde sus datastores, no el hipervisor en sí. Por esto, es común usar SSDs económicos o incluso dispositivos SATADOM para alojar el hipervisor, reservando NVMe de alta gama para los datastores de producción.

## Acceso y gestión remota: interfaz web, CLI y APIs como único punto de entrada

Una vez instalado, un hipervisor de Tipo 1 no ofrece interfaz gráfica local convencional. La gestión se realiza exclusivamente mediante canales remotos, lo que refuerza el principio de operación "headless" típico de centros de datos. Los métodos de acceso varían según la plataforma, pero comparten objetivos comunes: autenticación segura, auditoría de acciones y exposición de APIs para automatización.

| Método | VMware ESXi | Microsoft Hyper-V | KVM (Proxmox/oVirt) |
|--------|-------------|-------------------|---------------------|
| **Interfaz Web** | Host Client (https://<ip>/ui) | Windows Admin Center (gateway externo) | Proxmox VE UI (https://<ip>:8006) |
| **CLI Nativa** | ESXi Shell (SSH, DCUI) | PowerShell Remoting (WinRM) | `virsh`, `qm`, `pvesh` sobre SSH |
| **API Principal** | vSphere API (REST/SOAP) | System Center API / WMI | libvirt API / oVirt REST |
| **CLI de Automatización** | PowerCLI (PowerShell) | PowerShell DSC / Az CLI | Ansible modules / terraform provider |

```bash
# Habilitar SSH en ESXi para acceso CLI avanzado (no recomendado permanente)
# Desde DCUI: Troubleshooting Options → Enable ESXi Shell / Enable SSH

# Una vez habilitado, conectar y ejecutar comandos de diagnóstico
ssh root@esxi-host.local

# Comandos útiles en ESXi Shell:
esxcli system settings advanced list -o /Misc/HostName  # Ver hostname
esxcli storage filesystem list                          # Listar datastores montados
esxcli network ip interface list                        # Interfaces de red configuradas
esxtop                                                  # Monitor de rendimiento interactivo
```

```powershell
# Gestión remota de Hyper-V mediante PowerShell Remoting (WinRM)
# Requiere habilitar WinRM en el host Hyper-V y configurar TrustedHosts si no hay dominio

Enable-PSRemoting -Force
Set-Item WSMan:\localhost\Client\TrustedHosts -Value "hyper-v-host.local" -Concatenate

# Conectar sesión remota y consultar VMs
$session = New-PSSession -ComputerName "hyper-v-host.local" -Credential (Get-Credential)
Invoke-Command -Session $session -ScriptBlock { Get-VM | Select Name, State, CPUUsage, MemoryAssigned }
Remove-PSSession $session
```

> El acceso SSH o PowerShell Remota debe restringirse mediante firewall a direcciones IP de gestión autorizadas y, idealmente, combinarse con autenticación multifactor o integración con directorio activo (LDAP/AD). Exponer estos servicios directamente a internet sin VPN o bastion host es una práctica de alto riesgo.

## Configuración inicial de almacenamiento: creación y montaje de datastores

El almacenamiento en virtualización empresarial se gestiona mediante el concepto de **datastore**: un contenedor lógico de alto nivel que abstrae el backend físico (discos locales, NFS, iSCSI, SAN) y expone una interfaz uniforme para alojar discos virtuales, snapshots, plantillas y archivos de configuración de VMs. La configuración inicial de datastores es crítica porque define la resiliencia, rendimiento y capacidades de migración del entorno.

Tipos comunes de datastores y sus características:

| Tipo | Backend físico | Ventajas | Limitaciones | Casos de uso |
|------|---------------|----------|-------------|-------------|
| **VMFS (VMware)** | Discos locales o LUNs SAN | Cluster-aware, soporte nativo para vMotion, snapshots | Solo VMware, requiere bloqueo SCSI | Producción empresarial VMware |
| **NFS** | Servidor NAS exportando volumen | Simple de configurar, accesible por múltiples hosts, barato | Latencia ligeramente mayor, depende de red | Homelabs, PYMEs, backups |
| **iSCSI** | Target SAN o software (LIO, TrueNAS) | Bloque-level, alto rendimiento, estándar abierto | Requiere configuración de initiator, CHAP para seguridad | Bases de datos, cargas transaccionales |
| **Ceph/RBD** | Clúster Ceph distribuido | Escalabilidad horizontal, auto-reparación, snapshots nativos | Complejidad operativa, requiere red dedicada | Nubes privadas, entornos open source |
| **ZFS Local** | Pool ZFS en discos locales | Compresión, deduplicación, snapshots, checksums | No compartido por defecto (requiere replicación) | Proxmox VE, homelabs avanzados |

```bash
# Ejemplo: crear datastore NFS en ESXi mediante esxcli
# 1. Habilitar cliente NFS en el host
esxcli storage nfs client load

# 2. Montar volumen NFS como datastore
esxcli storage nfs add \
  --host=nfs-server.local \
  --share=/export/vm-datastore \
  --volume-name=NFS-Prod-01 \
  --readonly=false

# 3. Verificar montaje
esxcli storage nfs list
# Salida: NFS-Prod-01  nfs-server.local:/export/vm-datastore  mounted
```

```bash
# Ejemplo: configurar almacenamiento ZFS en Proxmox VE para datastores locales
# 1. Crear pool ZFS con mirror (redundancia)
zpool create -o ashift=12 vm-pool mirror /dev/sdb /dev/sdc

# 2. Crear dataset con compresión y snapshots automáticos
zfs create -o compression=lz4 -o com.sun:auto-snapshot=true vm-pool/vms

# 3. Registrar en Proxmox como almacenamiento para discos de VM
# Editar /etc/pve/storage.cfg o usar UI:
# Content: Disk image, ISO, Backup
# Sparse: Yes (para thin provisioning)
# Max volumes: 0 (ilimitado)
```

> Los datastores compartidos (NFS, iSCSI, vSAN) son requisito para funciones avanzadas como migración en vivo (vMotion) y alta disponibilidad (HA). Si se usan discos locales, las VMs quedan "atadas" al host físico, limitando la flexibilidad operativa. Para entornos pequeños, considerar replicación asíncrona (Proxmox Backup Server, rsync) como alternativa de bajo costo para DR.

## Configuración inicial de redes virtuales: segmentación, bridges y políticas de tráfico

La red en virtualización no es simplemente conectar una VM a una interfaz física: requiere diseñar una topología lógica que aísle tráfico de gestión, migración, almacenamiento y producción, mientras expone servicios de forma segura al exterior. La configuración inicial típicamente implica crear switches virtuales (vSwitches), bridges o redes definidas por software que mapeen VLANs físicas a segmentos lógicos para las VMs.

Componentes clave de la red virtualizada:

- **vSwitch / Linux Bridge**: conmutador virtual que interconecta vNICs de VMs con interfaces físicas (uplinks).
- **Port Groups / VLANs**: segmentación lógica dentro del mismo vSwitch para aislar tráfico por aplicación o tenant.
- **Uplinks**: interfaces físicas que conectan el vSwitch a la red física; pueden configurarse en teaming para redundancia.
- **MTU y Jumbo Frames**: configuración de tamaño de paquete para optimizar tráfico de almacenamiento o migración.

```bash
# Ejemplo: configurar red en KVM/libvirt con bridges múltiples
# Archivo: /etc/network/interfaces o Netplan (Ubuntu)

# Bridge para gestión del host (acceso SSH, monitoreo)
auto br-mgmt
iface br-mgmt inet static
    address 192.168.1.10/24
    gateway 192.168.1.1
    bridge_ports eth0
    bridge_stp off
    bridge_fd 0

# Bridge para tráfico de VMs (producción)
auto br-vm
iface br-vm inet manual
    bridge_ports eth1
    bridge_stp off
    bridge_fd 0

# Bridge dedicado para migración en vivo (aislado, jumbo frames)
auto br-migration
iface br-migration inet static
    address 10.10.10.1/24
    bridge_ports eth2
    bridge_stp off
    bridge_fd 0
    mtu 9000  # Jumbo frames para eficiencia en vMotion
```

```xml
<!-- Definir red virtual en libvirt (XML) para aislamiento por VLAN -->
<network>
  <name>prod-vlan-100</name>
  <forward mode='bridge'/>
  <bridge name='br-vlan100' stp='on' delay='0'/>
  <vlan>
    <tag id='100'/>
  </vlan>
</network>

<!-- Asignar interfaz de VM a esta red -->
<interface type='network'>
  <source network='prod-vlan-100'/>
  <model type='virtio'/>
  <mac address='52:54:00:ab:cd:ef'/>
</interface>
```

> La red de migración en vivo (vMotion/Live Migration) debe estar aislada físicamente o mediante VLAN dedicada, con ancho de banda suficiente (10GbE recomendado) y MTU configurado para jumbo frames (9000 bytes). Mezclar este tráfico con la red de gestión o producción puede causar timeouts durante migraciones, provocando fallos en cascada o degradación del servicio.

## Quédate con...

- La instalación de un hipervisor Tipo 1 es un proceso **minimalista y orientado a gestión remota**: no hay interfaz gráfica local, solo configuración inicial de red y credenciales para acceso posterior vía web/CLI/API.
- El **disco de instalación del hipervisor** puede ser de capacidad modesta (8-32 GB); el rendimiento crítico reside en los datastores que alojan las VMs, no en el sistema base.
- El **acceso remoto** (web UI, SSH, PowerShell, APIs) es el único punto de entrada: debe protegerse mediante firewall, autenticación robusta y, idealmente, MFA o integración con directorio.
- Los **datastores** abstraen el almacenamiento físico (local, NFS, iSCSI, Ceph) y son requisito para funciones avanzadas como migración en vivo; elegir el tipo adecuado impacta resiliencia, rendimiento y costos.
- La **segmentación de red inicial** (gestión, migración, almacenamiento, producción) no es opcional: mezclar tráfico puede saturar enlaces críticos y comprometer la estabilidad durante operaciones de mantenimiento.
- Las **VLANs y bridges virtuales** permiten aislar lógicamente cargas de trabajo sobre la misma infraestructura física, pero requieren planificación cuidadosa de tagging y uplinks para evitar fugas de tráfico o conflictos de direccionamiento.
- La configuración inicial sienta las bases para capacidades avanzadas: una red o almacenamiento mal diseñados en esta fase limitarán severamente la escalabilidad y resiliencia futura, incluso con funciones empresariales habilitadas posteriormente.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/tipo1/ventajas" class="prev">Anterior</a>
  <a href="/sistemas" class="next">Siguiente</a>
</div>
