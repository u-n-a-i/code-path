---
title: "Servidores locales (homelab)"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Servidores locales (homelab)](#servidores-locales-homelab)
  - [Proxmox VE: plataforma de virtualización open source para homelabs](#proxmox-ve-plataforma-de-virtualización-open-source-para-homelabs)
    - [Arquitectura y componentes de Proxmox VE](#arquitectura-y-componentes-de-proxmox-ve)
    - [Gestión de almacenamiento: ZFS, LVM-Thin y opciones para homelabs](#gestión-de-almacenamiento-zfs-lvm-thin-y-opciones-para-homelabs)
  - [Ejecutar servicios esenciales: NAS, firewall y servidor web en el homelab](#ejecutar-servicios-esenciales-nas-firewall-y-servidor-web-en-el-homelab)
    - [TrueNAS como VM: almacenamiento en red con ZFS nativo](#truenas-como-vm-almacenamiento-en-red-con-zfs-nativo)
    - [OPNsense como firewall virtual: perímetro de red seguro y flexible](#opnsense-como-firewall-virtual-perímetro-de-red-seguro-y-flexible)
    - [Servidor web en contenedor LXC: eficiencia para cargas ligeras](#servidor-web-en-contenedor-lxc-eficiencia-para-cargas-ligeras)
  - [Gestión operativa del homelab: backups, actualizaciones y monitoreo](#gestión-operativa-del-homelab-backups-actualizaciones-y-monitoreo)
  - [Quédate con...](#quédate-con)

</div>

# Servidores locales (homelab)

Los servidores locales o "homelabs" representan la aplicación práctica de principios de virtualización empresarial en entornos personales o de pequeña escala: consolidar múltiples servicios —almacenamiento, red, aplicaciones web, automatización— sobre un único hardware físico mediante hipervisores de Tipo 1, logrando aislamiento entre cargas, eficiencia de recursos y resiliencia operativa sin la inversión de un centro de datos corporativo. Esta aproximación no es simplemente un ejercicio de aficionado; es un entorno de aprendizaje invaluable donde se pueden experimentar con arquitecturas cloud, validar configuraciones de seguridad, desarrollar habilidades de operaciones IT y probar flujos de trabajo de infraestructura como código sin riesgo para sistemas de producción. Proxmox VE emerge como la plataforma preferida para homelabs debido a su modelo open source, integración nativa de virtualización y contenedores, y herramientas de gestión web que democratizan el acceso a capacidades empresariales. Comprender cómo diseñar, implementar y operar un homelab con Proxmox —desde la selección de hardware hasta la orquestación de servicios como TrueNAS, OPNsense y servidores web— permite construir infraestructuras personales que equilibran funcionalidad, seguridad y mantenibilidad, evitando errores comunes como sobrecargar hardware limitado, exponer servicios críticos sin protección adecuada, o acumular configuraciones no documentadas que se convierten en deuda técnica operativa.

## Proxmox VE: plataforma de virtualización open source para homelabs

Proxmox Virtual Environment (VE) es una distribución Linux basada en Debian que integra KVM para virtualización de máquinas completas y LXC para contenedores ligeros, gestionados mediante una interfaz web unificada y APIs REST. Diseñado para ser funcional desde la instalación inicial sin configuración compleja, Proxmox VE proporciona capacidades empresariales —clústeres, migración en vivo, backups programados, almacenamiento flexible— en un paquete accesible para entusiastas, desarrolladores y pequeñas organizaciones.

### Arquitectura y componentes de Proxmox VE

```text
Arquitectura de Proxmox VE:

┌─────────────────────────────────┐
│  Interfaz de Gestión Web       │
│  • Acceso HTTPS:8006           │
│  • Gestión de VMs/CTs          │
│  • Monitorización integrada    │
│  • API REST para automatización│
├─────────────────────────────────┤
│  Capa de Virtualización        │
│  • KVM: máquinas virtuales     │
│    completas con aislamiento   │
│  • LXC: contenedores Linux     │
│    ligeros, bajo overhead      │
│  • QEMU: emulación de hardware │
├─────────────────────────────────┤
│  Gestión de Almacenamiento     │
│  • Local: LVM-Thin, ZFS        │
│  • Compartido: NFS, Ceph, iSCSI│
│  • Backups: vzdump integrado   │
├─────────────────────────────────┤
│  Gestión de Red                │
│  • Linux Bridge, OVS           │
│  • VLANs, bonds, firewall      │
│  • SDN (Software Defined Net)  │
├─────────────────────────────────┤
│  Clúster y Alta Disponibilidad │
│  • Corosync para comunicación  │
│  • HA: reinicio automático     │
│  • Migración en vivo sin downtime│
├─────────────────────────────────┤
│  Sistema Base: Debian Linux    │
│  • Actualizaciones vía apt     │
│  • Amplia compatibilidad HW    │
└─────────────────────────────────┘
```

```bash
# Instalación de Proxmox VE en hardware dedicado
# 1. Descargar ISO desde https://www.proxmox.com/en/downloads
# 2. Grabar en USB y bootear el servidor

# Durante la instalación:
# - Seleccionar disco objetivo (se formateará completamente)
# - Configurar país, zona horaria, teclado
# - Establecer contraseña de root y email para notificaciones
# - Configurar red: IP estática recomendada para gestión
#   Ej: 192.168.1.100/24, gateway 192.168.1.1

# Post-instalación: configuración inicial vía web
# Acceder a https://192.168.1.100:8006
# Usuario: root, contraseña: la establecida en instalación
# Ignorar advertencia de certificado SSL autofirmado (o importar propio)
```

```bash
# Configuración inicial vía CLI (alternativa o complemento a web UI)
# Actualizar repositorios y sistema
apt update && apt dist-upgrade -y

# Configurar repositorio enterprise (opcional, requiere suscripción)
# Para uso sin suscripción, habilitar repositorio no-subscription:
cat > /etc/apt/sources.list.d/pve-no-subscription.list << 'EOF'
deb http://download.proxmox.com/debian/pve bookworm pve-no-subscription
EOF

# Eliminar repositorio enterprise por defecto (evita errores sin suscripción)
sed -i 's|deb https://enterprise.proxmox.com|deb http://download.proxmox.com|' /etc/apt/sources.list.d/pve-enterprise.list

# Actualizar nuevamente con repositorios correctos
apt update

# Configurar red estática si no se hizo en instalación
cat > /etc/network/interfaces << 'EOF'
auto lo
iface lo inet loopback

auto enp1s0
iface enp1s0 inet static
    address 192.168.1.100/24
    gateway 192.168.1.1
    dns-nameservers 1.1.1.1 8.8.8.8
EOF

# Aplicar cambios de red
ifreload -a

# Habilitar acceso SSH para gestión remota (recomendado)
systemctl enable --now ssh
```

> Proxmox VE requiere hardware con soporte de virtualización (VT-x/AMD-V) y preferiblemente múltiples discos para separar sistema operativo, almacenamiento de VMs y backups. Para homelabs, un mini-PC con CPU de 4+ núcleos, 16-32 GB RAM y 2+ discos (SSD para sistema, HDD para datos) proporciona un excelente punto de partida.

### Gestión de almacenamiento: ZFS, LVM-Thin y opciones para homelabs

Proxmox VE soporta múltiples backends de almacenamiento, cada uno con trade-offs de rendimiento, resiliencia y complejidad. Para homelabs, ZFS y LVM-Thin son las opciones más populares por su equilibrio entre funcionalidad y facilidad de gestión.

```text
Comparativa de opciones de almacenamiento en Proxmox:

┌─────────────────────────────────┐
│  ZFS (recomendado para homelab)│
│  • Copy-on-write con checksums │
│  • Snapshots automáticos       │
│  • Compresión inline (lz4)     │
│  • RAID por software (mirror,  │
│    raidz1/2/3)                 │
│  • Requiere RAM: ~1GB/1TB      │
│  • Ideal: SSDs para sistema +  │
│    HDDs en mirror para datos   │
├─────────────────────────────────┤
│  LVM-Thin                      │
│  • Thin provisioning nativo    │
│  • Snapshots eficientes        │
│  • Menor overhead que ZFS      │
│  • Sin checksums ni compresión │
│  • Requiere volumen lógico     │
│  • Ideal: hardware limitado    │
├─────────────────────────────────┤
│  Directory (ext4/xfs)          │
│  • Simple, compatible          │
│  • Sin snapshots nativos       │
│  • Requiere herramientas       │
│    externas para backup        │
│  • Ideal: almacenamiento       │
│    secundario o pruebas        │
├─────────────────────────────────┤
│  NFS/Ceph/iSCSI                │
│  • Almacenamiento compartido   │
│  • Requiere infraestructura    │
│    adicional                   │
│  • Ideal: clústeres multi-nodo │
└─────────────────────────────────┘
```

```bash
# Configurar ZFS en Proxmox para almacenamiento de VMs
# 1. Identificar discos disponibles
lsblk
# Ej: /dev/sdb y /dev/sdc son dos HDD de 4TB para datos

# 2. Crear pool ZFS en mirror (RAID 1)
zpool create -o ashift=12 \
  -O compression=lz4 \
  -O atime=off \
  tank mirror /dev/sdb /dev/sdc

# 3. Crear datasets para diferentes propósitos
zfs create tank/vms        # Discos de máquinas virtuales
zfs create tank/containers # Discos de contenedores LXC
zfs create tank/backups    # Backups de vzdump
zfs create tank/isos       # Imágenes ISO para instalación

# 4. Configurar propiedades de datasets
zfs set quota=2T tank/vms           # Límite de 2TB para VMs
zfs set reservation=500G tank/backups # Reservar 500GB para backups

# 5. Registrar almacenamiento en Proxmox vía CLI
pvesm add zfspool tank/vms \
  --content images,rootdir \
  --sparse 1 \
  --is_mountpoint 1

pvesm add zfspool tank/backups \
  --content backup \
  --is_mountpoint 1

# 6. Verificar almacenamiento disponible
pvesm status
```

```yaml
# Configuración de snapshots automáticos con ZFS
# Script para snapshots diarios de datasets críticos

#!/bin/bash
# /usr/local/bin/zfs-snapshot-daily.sh

DATE=$(date +%Y-%m-%d)
DATASETS=("tank/vms" "tank/containers" "tank/backups")

for dataset in "${DATASETS[@]}"; do
  # Crear snapshot con fecha
  zfs snapshot "${dataset}@daily-${DATE}"
  
  # Eliminar snapshots antiguos (>7 días)
  zfs list -t snapshot -H -o name "${dataset}" | \
    grep "daily-" | \
    grep -v "daily-${DATE}" | \
    while read snap; do
      # Calcular antigüedad en días
      snap_date=$(echo $snap | grep -oP 'daily-\K[0-9-]+')
      snap_epoch=$(date -d "$snap_date" +%s)
      now_epoch=$(date +%s)
      age_days=$(( (now_epoch - snap_epoch) / 86400 ))
      
      # Eliminar si tiene más de 7 días
      if [ "$age_days" -gt 7 ]; then
        zfs destroy "$snap"
        echo "Eliminado snapshot antiguo: $snap"
      fi
    done
done

# Registrar en log
echo "Snapshots diarios completados: $(date)" >> /var/log/zfs-snapshots.log
```

> ZFS consume RAM para caching (ARC): asignar ~1GB de RAM por cada 1TB de almacenamiento ZFS para rendimiento óptimo. En hardware con RAM limitada (<16GB), considerar LVM-Thin o reducir el tamaño del pool ZFS.

## Ejecutar servicios esenciales: NAS, firewall y servidor web en el homelab

Un homelab típico consolida múltiples servicios de infraestructura que tradicionalmente requerirían hardware dedicado: almacenamiento en red (NAS), firewall/perímetro de red, y servidores de aplicaciones. Proxmox VE permite ejecutar cada servicio en su propia VM o contenedor, proporcionando aislamiento, gestión centralizada y capacidad de backup/restore individual.

### TrueNAS como VM: almacenamiento en red con ZFS nativo

TrueNAS (anteriormente FreeNAS) es una distribución basada en FreeBSD especializada en almacenamiento en red mediante protocolos SMB/CIFS, NFS, AFP y iSCSI, con gestión web y soporte nativo para ZFS. Ejecutar TrueNAS como VM en Proxmox permite aprovechar ZFS dos veces: en el nivel de Proxmox para gestión de VMs, y dentro de TrueNAS para gestión de datos compartidos.

```text
Arquitectura recomendada: TrueNAS como VM en Proxmox

┌─────────────────────────────────┐
│  Proxmox VE Host                │
│  • ZFS pool: tank              │
│  • VM: TrueNAS                 │
├─────────────────────────────────┤
│  TrueNAS VM (FreeBSD)          │
│  • ZFS pool interno: nas-pool  │
│  • Servicios: SMB, NFS, iSCSI  │
│  • Snapshots, replicación      │
├─────────────────────────────────┤
│  Passthrough de discos físicos │
│  • Discos de datos asignados   │
│    directamente a TrueNAS      │
│  • Evita doble virtualización  │
│    de E/S de disco             │
└─────────────────────────────────┘
```

```bash
# Configurar TrueNAS como VM en Proxmox
# 1. Descargar ISO de TrueNAS Scale (basado en Linux) o Core (FreeBSD)
#    https://www.truenas.com/download-truenas-scale/

# 2. Subir ISO a almacenamiento de Proxmox
#    Datacenter → Storage → local (pve) → ISO Images → Upload

# 3. Crear VM para TrueNAS
#    Via web UI o CLI:

qm create 200 \
  --name truenas-scale \
  --memory 8192 \
  --cores 4 \
  --net0 virtio,bridge=vmbr0 \
  --ostype l26 \
  --machine q35

# 4. Adjuntar disco de sistema (pequeño, en almacenamiento ZFS de Proxmox)
qm set 200 \
  --scsihw virtio-scsi-pci \
  --scsi0 local-zfs:vm-200-disk-0,size=32G

# 5. Adjuntar discos de datos mediante passthrough (recomendado)
#    Identificar IDs de disco con: ls -l /dev/disk/by-id/
qm set 200 \
  --scsi1 /dev/disk/by-id/ata-WDC_WD40EFRX-68N32N0_WD-WX41D94ABCDE \
  --scsi2 /dev/disk/by-id/ata-WDC_WD40EFRX-68N32N0_WD-WX41D94FGHIJ

# 6. Adjuntar ISO de instalación y bootear
qm set 200 \
  --ide2 local:iso/TrueNAS-SCALE-24.04.iso,media=cdrom \
  --boot order=ide2

# 7. Iniciar VM y completar instalación de TrueNAS
qm start 200
# Conectar vía consola web de Proxmox para instalación
```

```yaml
# Configuración de TrueNAS post-instalación
truenas_initial_setup:
  red:
    - "Configurar IP estática en interfaz de gestión"
    - "Habilitar SSH para administración remota"
    - "Configurar DNS y gateway por defecto"
  
  almacenamiento:
    - "Crear pool ZFS con discos passthrough"
    - "Configurar datasets para diferentes propósitos:"
      - "media/: para archivos multimedia (SMB)"
      - "backups/: para backups de equipos (SMB/NFS)"
      - "isos/: para imágenes de instalación (NFS)"
    - "Habilitar compresión lz4 para ahorro de espacio"
    - "Configurar snapshots automáticos diarios/semanales"
  
  servicios:
    - "Habilitar servicio SMB para Windows/macOS"
    - "Configurar usuarios y permisos por dataset"
    - "Habilitar servicio NFS para Linux/Proxmox"
    - "Opcional: configurar iSCSI para LUNs block-level"
  
  seguridad:
    - "Cambiar contraseña de admin por defecto"
    - "Habilitar autenticación de dos factores"
    - "Restringir acceso a interfaz web por IP"
    - "Configurar alertas por email para fallos de disco"
```

> El passthrough de discos físicos a TrueNAS evita la doble virtualización de E/S (Proxmox → ZFS → TrueNAS → ZFS), mejorando rendimiento y simplificando la gestión de discos. Sin embargo, los discos passthrough no son gestionados por Proxmox: backups, migraciones y snapshots de la VM no incluyen estos discos. Documentar claramente qué discos son gestionados por TrueNAS directamente.

### OPNsense como firewall virtual: perímetro de red seguro y flexible

OPNsense es una distribución de firewall basada en FreeBSD que proporciona capacidades empresariales —firewall stateful, VPN, IDS/IPS, reporting— en una interfaz web accesible. Ejecutar OPNsense como VM en Proxmox permite consolidar el perímetro de red del homelab junto con otros servicios, con la flexibilidad de snapshots, backups y migración.

```text
Arquitectura de red con OPNsense en Proxmox:

┌─────────────────────────────────┐
│  Internet                      │
├─────────────────────────────────┤
│  Router/Módem del ISP          │
│  (modo bridge recomendado)     │
├─────────────────────────────────┤
│  Proxmox Host                  │
│  • vmbr0: WAN (conectado a ISP)│
│  • vmbr1: LAN (red interna)    │
│  • VM: OPNsense                │
├─────────────────────────────────┤
│  OPNsense VM                   │
│  • WAN: vmbr0 (192.168.1.2/24) │
│  • LAN: vmbr1 (10.0.0.1/24)    │
│  • Servicios: DHCP, DNS, VPN   │
├─────────────────────────────────┤
│  Red Interna (10.0.0.0/24)     │
│  • Otras VMs: TrueNAS, web, etc│
│  • Dispositivos físicos vía    │
│    switch conectado a Proxmox  │
└─────────────────────────────────┘
```

```bash
# Configurar interfaces de red en Proxmox para OPNsense
# Editar /etc/network/interfaces

# vmbr0: WAN (conectado a router del ISP)
auto vmbr0
iface vmbr0 inet manual
    bridge-ports enp1s0
    bridge-stp off
    bridge-fd 0

# vmbr1: LAN (red interna aislada)
auto vmbr1
iface vmbr1 inet manual
    bridge-ports enp2s0
    bridge-stp off
    bridge-fd 0
    # Sin IP en el bridge: OPNsense gestiona la LAN

# Aplicar cambios
ifreload -a
```

```bash
# Crear VM para OPNsense
qm create 100 \
  --name opnsense-firewall \
  --memory 2048 \
  --cores 2 \
  --net0 virtio,bridge=vmbr0,firewall=1 \
  --net1 virtio,bridge=vmbr1,firewall=1 \
  --ostype freebsd \
  --machine q35

# Disco de sistema
qm set 100 \
  --scsihw virtio-scsi-pci \
  --scsi0 local-zfs:vm-100-disk-0,size=20G

# Adjuntar ISO de OPNsense
qm set 100 \
  --ide2 local:iso/OPNsense-24.1-OpenSSL-dvd-amd64.iso,media=cdrom \
  --boot order=ide2

# Iniciar e instalar
qm start 100
```

```yaml
# Configuración inicial de OPNsense post-instalación
opnsense_initial_setup:
  interfaces:
    wan:
      type: "DHCP (desde router ISP)"
      description: "Conexión a internet"
    lan:
      type: "Static: 10.0.0.1/24"
      description: "Red interna del homelab"
  
  servicios_esenciales:
    dhcp_server:
      enabled: true
      range: "10.0.0.100-10.0.0.200"
      dns: "10.0.0.1, 1.1.1.1"
    
    dns_resolver:
      enabled: true
      dnssec: true
      forwarding: false  # Resolver directamente, no reenviar
    
    firewall_rules:
      lan_to_wan: "Allow all (salida a internet)"
      wan_to_lan: "Deny all por defecto"
      lan_to_opnsense: "Allow SSH/HTTPS para administración"
  
  servicios_avanzados:
    openvpn_wireguard:
      description: "VPN para acceso remoto seguro"
      recommendation: "WireGuard por rendimiento y simplicidad"
    
    ids_ips:
      description: "Suricata para detección/prevención de intrusos"
      recommendation: "Habilitar solo reglas esenciales para evitar falsos positivos"
    
    reporting:
      description: "Logs y métricas de tráfico"
      recommendation: "Configurar rotación de logs para evitar llenar disco"
```

> Configurar el firewall de Proxmox para permitir tráfico de gestión (SSH, web UI) solo desde la red LAN (10.0.0.0/24), no desde WAN. OPNsense protege la red interna, pero Proxmox mismo también necesita protección: habilitar el firewall integrado de Proxmox en las interfaces de gestión.

### Servidor web en contenedor LXC: eficiencia para cargas ligeras

Para servicios que no requieren kernel completo —servidores web, proxies, aplicaciones stateless—, los contenedores LXC de Proxmox proporcionan una alternativa más ligera que las VMs: menor consumo de memoria, arranque en segundos, y overhead de CPU casi nulo, manteniendo aislamiento mediante namespaces del kernel.

```bash
# Crear contenedor LXC para servidor web (Ubuntu 22.04)
# Via CLI de Proxmox (más reproducible que web UI)

pct create 201 \
  local:vztmpl/ubuntu-22.04-standard_22.04-1_amd64.tar.zst \
  --rootfs local-zfs:8 \
  --cores 2 \
  --memory 1024 \
  --swap 512 \
  --hostname web01 \
  --net0 name=eth0,bridge=vmbr1,ip=10.0.0.50/24,gw=10.0.0.1 \
  --password 'StrongPassword123!' \
  --unprivileged 1 \
  --features nesting=1,keyctl=1

# Explicación de flags:
# --unprivileged 1: contenedor sin privilegios root en host (más seguro)
# --features nesting=1: permite ejecutar Docker dentro del contenedor
# --rootfs local-zfs:8: disco de 8GB en almacenamiento ZFS
```

```bash
# Iniciar y configurar contenedor
pct start 201

# Conectar por consola
pct enter 201

# Dentro del contenedor: instalar nginx
apt update && apt install -y nginx

# Configurar sitio web básico
cat > /var/www/html/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head><title>Homelab Web Server</title></head>
<body>
  <h1>Servidor Web en Homelab</h1>
  <p>Hostname: $(hostname)</p>
  <p>IP: $(hostname -I)</p>
</body>
</html>
EOF

# Habilitar y iniciar nginx
systemctl enable --now nginx

# Salir del contenedor
exit
```

```yaml
# Backup automatizado de contenedores LXC
# Configurar vzdump en Proxmox para backups nocturnos

# /etc/vzdump.conf
storage: tank/backups
mode: snapshot
compress: zstd
ionice: 7
mailto: admin@homelab.local
prune-backups: keep-last=7,keep-weekly=4,keep-monthly=12

# Programar backup diario a las 2 AM
# /etc/cron.d/vzdump-backup
0 2 * * * root /usr/sbin/vzdump --all --storage tank/backups

# Verificar backups disponibles
ls -lh /tank/backups/dump/

# Restaurar contenedor desde backup
pct restore 201 /tank/backups/dump/vzdump-lxc-201-2025_01_15-02_00_00.tar.zst \
  --storage local-zfs \
  --hostname web01-restored
```

> Los contenedores LXC no privilegiados (`--unprivileged 1`) son más seguros porque mapean el usuario root del contenedor a un UID no privilegiado en el host, limitando el impacto de un escape de contenedor. Sin embargo, algunas aplicaciones (Docker, systemd) requieren configuración adicional o privilegios; evaluar necesidades antes de elegir modo privilegiado vs. no privilegiado.

## Gestión operativa del homelab: backups, actualizaciones y monitoreo

Un homelab bien operado requiere disciplina en mantenimiento: backups programados y probados, actualizaciones controladas que no rompan servicios, y monitoreo que alerte sobre problemas antes de que afecten la disponibilidad. Proxmox VE proporciona herramientas integradas para estas tareas, pero su configuración efectiva requiere planificación.

```yaml
# Estrategia de backups para homelab
backup_strategy:
  frecuencia:
    vm_critical: "Diario (TrueNAS, OPNsense config)"
    vm_standard: "Semanal (servidores web, apps)"
    containers: "Semanal o mediante snapshots ZFS"
  
  retencion:
    diarios: 7      # Mantener últimos 7 backups diarios
    semanales: 4    # Mantener últimos 4 backups semanales
    mensuales: 12   # Mantener últimos 12 backups mensuales
  
  destino:
    local: "tank/backups (rápido para restore)"
    remoto: "Rsync a disco USB externo o servidor remoto"
    offsite: "Backup a nube (Backblaze B2, Wasabi) para DR"
  
  verificacion:
    - "Probar restore trimestralmente en VM aislada"
    - "Verificar integridad de backups con checksums"
    - "Documentar procedimiento de recuperación"
```

```bash
# Script para backup remoto con rsync (ejemplo)
#!/bin/bash
# /usr/local/bin/backup-remote.sh

BACKUP_SOURCE="/tank/backups"
BACKUP_DEST="user@backup-server:/backups/homelab"
SSH_KEY="/root/.ssh/backup_key"
LOG_FILE="/var/log/backup-remote.log"

echo "=== Iniciando backup remoto: $(date) ===" >> "$LOG_FILE"

# Sincronizar backups locales a remoto
rsync -avz --delete \
  -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=yes" \
  "$BACKUP_SOURCE/" \
  "$BACKUP_DEST/" \
  >> "$LOG_FILE" 2>&1

if [ $? -eq 0 ]; then
  echo "Backup remoto completado exitosamente" >> "$LOG_FILE"
else
  echo "ERROR: Backup remoto fallido" >> "$LOG_FILE"
  # Enviar alerta por email
  echo "Backup remoto fallido en $(hostname)" | \
    mail -s "ALERTA: Backup Homelab" admin@homelab.local
fi
```

```yaml
# Estrategia de actualizaciones controladas
update_strategy:
  enfoque: "Staged updates con rollback plan"
  
  pasos:
    1. "Revisar changelogs de Proxmox y paquetes críticos"
    2. "Crear snapshot de VMs críticas antes de actualizar"
    3. "Actualizar en ventana de mantenimiento programada"
    4. "Verificar servicios post-actualización"
    5. "Eliminar snapshots tras confirmar estabilidad (24-48h)"
  
  comandos:
    # Actualizar Proxmox VE
    apt update && apt dist-upgrade -y
    
    # Actualizar templates de contenedores
    pveam update
    
    # Reiniciar si se actualizó kernel
    [ -f /var/run/reboot-required ] && reboot
  
  rollback:
    - "Usar snapshot de VM para revertir si hay problemas"
    - "Mantener versión anterior de paquetes críticos en cache"
    - "Documentar problemas encontrados para futura referencia"
```

```yaml
# Monitoreo básico con herramientas integradas
monitoring_setup:
  integrado_proxmox:
    - "Datacenter → Summary: vista general de recursos"
    - "Node → System Log: logs del sistema"
    - "VM/CT → Monitor: métricas en tiempo real"
  
  alertas_configuradas:
    - "Email notifications para fallos de disco ZFS"
    - "Alertas de uso de almacenamiento >80%"
    - "Notificaciones de fallos de backup"
  
  herramientas_adicionales:
    prometheus_grafana:
      descripcion: "Monitoreo avanzado con dashboards personalizados"
      instalacion: "VM dedicada o contenedor LXC"
      metricas_clave: "CPU, memoria, disco, red por VM/CT"
    
    uptime_kuma:
      descripcion: "Monitoreo de disponibilidad de servicios"
      uso: "Alertas si servicios web, NAS, VPN no responden"
    
    netdata:
      descripcion: "Monitoreo en tiempo real con interfaz web"
      ventaja: "Instalación simple, métricas detalladas"
```

> Probar procedimientos de recuperación antes de necesitarlos: un backup no verificado es una ilusión de seguridad. Programar ejercicios trimestrales de restore de una VM crítica en un entorno aislado para validar que los backups son funcionales y que el equipo conoce el procedimiento.

## Quédate con...

- **Proxmox VE** es la plataforma ideal para homelabs: integra KVM y LXC, gestión web unificada, y capacidades empresariales (clúster, HA, backups) en un paquete open source accesible.
- **ZFS es recomendado para almacenamiento** en homelabs: proporciona snapshots, compresión y resiliencia mediante mirror/raidz; asignar ~1GB RAM por 1TB de almacenamiento ZFS para rendimiento óptimo.
- **TrueNAS como VM con passthrough de discos** permite gestión avanzada de almacenamiento compartido sin doble virtualización de E/S; documentar claramente qué discos gestiona TrueNAS directamente.
- **OPNsense como firewall virtual** consolida el perímetro de red del homelab; configurar interfaces WAN/LAN separadas y habilitar el firewall de Proxmox para proteger la interfaz de gestión.
- **Contenedores LXC no privilegiados** son ideales para cargas ligeras (web servers, proxies): menor overhead que VMs, pero evaluar necesidades de privilegios antes de elegir modo unprivileged.
- **Backups programados y verificados** son críticos: usar vzdump integrado, retención escalonada (7/4/12), y probar restores trimestralmente; un backup no probado no es confiable.
- **Actualizaciones controladas** requieren snapshots previos de VMs críticas, ventanas de mantenimiento planificadas y procedimiento de rollback documentado; no actualizar en producción sin testing.
- **Monitoreo integrado y adicional** (Prometheus, Uptime Kuma, Netdata) proporciona visibilidad proactiva; configurar alertas para uso de recursos, fallos de backup y disponibilidad de servicios.
- **Documentación operativa** es esencial: registrar configuraciones de red, procedimientos de recuperación, y contactos de emergencia; un homelab no documentado se convierte en deuda técnica.
- El **principio fundamental del homelab**: experimentar con seguridad, aprender de fallos controlados, y construir habilidades que se transfieren a entornos de producción; el valor no es solo la infraestructura, sino el conocimiento adquirido.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/casos/desarrollo" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/casos/heredados" class="next">Siguiente</a>
</div>
