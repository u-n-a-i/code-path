---
title: "Proveedores principales y sus hipervisores"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Proveedores principales y sus hipervisores](#proveedores-principales-y-sus-hipervisores)
  - [AWS EC2: de Xen a Nitro — evolución hacia aislamiento hardware-asistido y rendimiento predecible](#aws-ec2-de-xen-a-nitro--evolución-hacia-aislamiento-hardware-asistido-y-rendimiento-predecible)
  - [Microsoft Azure: Hyper-V como cimiento integrado con el ecosistema Windows y Azure Stack](#microsoft-azure-hyper-v-como-cimiento-integrado-con-el-ecosistema-windows-y-azure-stack)
  - [Google Cloud Platform: KVM como base open source con Andromeda para red virtualizada de alto rendimiento](#google-cloud-platform-kvm-como-base-open-source-con-andromeda-para-red-virtualizada-de-alto-rendimiento)
  - [Oracle Cloud Infrastructure: estrategia híbrida con Xen para compatibilidad legacy y KVM para innovación](#oracle-cloud-infrastructure-estrategia-híbrida-con-xen-para-compatibilidad-legacy-y-kvm-para-innovación)
  - [Comparativa técnica y consideraciones de portabilidad entre proveedores](#comparativa-técnica-y-consideraciones-de-portabilidad-entre-proveedores)
  - [Quédate con...](#quédate-con)

</div>

# Proveedores principales y sus hipervisores

La elección del hipervisor subyacente en una plataforma de nube pública no es un detalle de implementación transparente para el usuario, sino una decisión arquitectónica que impacta directamente el rendimiento, las características disponibles, la compatibilidad de cargas de trabajo y la estrategia de evolución futura del servicio. Cada proveedor de nube ha tomado caminos distintos en su pila de virtualización: algunos heredaron tecnologías establecidas (Xen, Hyper-V) y las evolucionaron mediante capas de abstracción adicionales; otros adoptaron temprano soluciones open source (KVM) y construyeron ecosistemas propietarios sobre ellas. Comprender estas diferencias técnicas —desde la arquitectura Nitro de AWS hasta la integración de Hyper-V con Azure Stack— permite tomar decisiones informadas sobre portabilidad de cargas, optimización de rendimiento y mitigación de vendor lock-in. Esta sección desglosa la evolución arquitectónica, los mecanismos internos y las implicaciones operativas de los hipervisores que ejecutan las nubes públicas más relevantes del mercado.

## AWS EC2: de Xen a Nitro — evolución hacia aislamiento hardware-asistido y rendimiento predecible

Amazon Web Services inició su plataforma EC2 en 2006 utilizando **Xen** como hipervisor base, aprovechando su madurez en virtualización paravirtualizada y su modelo de aislamiento multi-tenant probado en entornos de alta densidad. Sin embargo, la arquitectura original de Xen presentaba limitaciones para los requisitos de hiperescala de AWS: overhead de E/S debido a la emulación de dispositivos, complejidad en la gestión de actualizaciones del hipervisor sin downtime, y dificultad para exponer hardware especializado (GPUs, NVMe, SmartNICs) de forma segura a tenants.

```text
Evolución arquitectónica de EC2:

Fase 1: Xen tradicional (2006-2017)
┌─────────────────────────────────┐
│  Guest OS (VM)                  │
├─────────────────────────────────┤
│  Xen Hypervisor + Dom0          │  ← Linux minimalista gestiona hardware
├─────────────────────────────────┤
│  Hardware físico (servidor)     │
└─────────────────────────────────┘
• Paravirtualización requerida para rendimiento óptimo
• Dom0 como punto único de fallo y cuello de botella de E/S
• Actualizaciones de hipervisor requerían migración manual de VMs

Fase 2: Xen con PVHVM (2014-2017)
• Soporte para virtualización asistida por hardware (HVM)
• Guests no modificados con drivers paravirtualizados opcionales
• Mejora de rendimiento, pero arquitectura fundamental sin cambios

Fase 3: AWS Nitro (2017-presente)
┌─────────────────────────────────┐
│  Guest OS (VM)                  │
├─────────────────────────────────┤
│  KVM-based Hypervisor (minimal)│  ← Solo CPU y memoria virtualizadas
├─────────────────────────────────┤
│  Nitro System (hardware dedicado)│
│  • Nitro Card: E/S virtualizada │
│  • Nitro Security Chip: aislamiento│
│  • Nitro Enclaves: confidencialidad│
├─────────────────────────────────┤
│  Hardware físico                │
└─────────────────────────────────┘
• Hipervisor minimalista: sin gestión de E/S, solo planificación de CPU/memoria
• E/S delegada a hardware dedicado (Nitro Cards): red, almacenamiento, monitoreo
• Aislamiento de seguridad mediante chip hardware (root of trust)
• Actualizaciones de hipervisor sin impacto en VMs (live patching a nivel hardware)
```

```bash
# Verificar tipo de instancia y arquitectura subyacente en EC2
# Instancias más antiguas (t2, m4) aún pueden usar Xen; nuevas (m5, c5, i3en) usan Nitro

aws ec2 describe-instances --instance-ids i-0123456789abcdef0 \
  --query 'Reservations[0].Instances[0].{Type:InstanceType,Hypervisor:Hypervisor,ENA:NetworkInfo.EnaSupport}'

# Salida típica para instancia Nitro:
# {
#   "Type": "m5.large",
#   "Hypervisor": "nitro",  ← Indica arquitectura Nitro
#   "ENA": true            ← Enhanced Networking via Elastic Network Adapter
# }

# Verificar drivers paravirtualizados dentro de la VM (Linux guest)
lsmod | grep -E 'nvme|ena|virtio'
# Nitro instances use:
# • nvme: para discos EBS (presentados como NVMe directo)
# • ena: Elastic Network Adapter para red de alta velocidad
# • virtio: no usado en Nitro (reemplazado por dispositivos dedicados)
```

```yaml
# Implicaciones de Nitro para usuarios de EC2:
nitro_implications:
  rendimiento:
    ebs_throughput: "Hasta 260,000 IOPS y 4,750 MB/s por instancia"
    network_bandwidth: "Hasta 100 Gbps con Elastic Fabric Adapter"
    latency: "Consistente, sin "noisy neighbor" gracias a aislamiento hardware"
  
  compatibilidad:
    legacy_guests: "SOs que requieren emulación de hardware legacy pueden no funcionar"
    nested_virtualization: "Soportado solo en tipos de instancia específicos (m5.metal, etc.)"
    gpu_passthrough: "GPUs presentadas vía Nitro, no vía PCI passthrough tradicional"
  
  seguridad:
    nitro_enclaves: "Aislamiento confidencial para procesamiento de datos sensibles"
    imds_v2: "Token-based metadata service obligatorio para mitigar SSRF"
    encryption: "Cifrado en reposo y tránsito habilitado por defecto en Nitro"
```

> La migración de Xen a Nitro fue transparente para la mayoría de usuarios: las APIs de EC2 no cambiaron, y las AMIs existentes continuaron funcionando. Sin embargo, cargas de trabajo que dependían de características específicas de Xen (ciertos drivers paravirtualizados, herramientas de monitoreo que accedían a Dom0) requirieron ajustes. AWS proporcionó herramientas de evaluación (EC2 Instance Readiness Check) para identificar incompatibilidades antes de migrar instancias a tipos Nitro.

## Microsoft Azure: Hyper-V como cimiento integrado con el ecosistema Windows y Azure Stack

Azure construyó su plataforma de computación sobre **Hyper-V**, la tecnología de virtualización de Microsoft, aprovechando su integración nativa con Windows Server, Active Directory y el stack de gestión empresarial (System Center). Esta elección estratégica permitió a Microsoft ofrecer una experiencia coherente entre entornos on-premises y nube, facilitando estrategias híbridas mediante Azure Arc, Azure Stack y Azure Site Recovery.

```text
Arquitectura de virtualización en Azure:

┌─────────────────────────────────┐
│  Guest OS (VM)                  │
│  • Windows, Linux, BSD         │
│  • Drivers de integración Azure│
├─────────────────────────────────┤
│  Hyper-V Hypervisor (bare-metal)│
│  • Partición padre (host management)│
│  • Particiones hijas (VMs)     │
├─────────────────────────────────┤
│  Azure Fabric Controller       │
│  • Orquestación a escala       │
│  • Gestión de almacenamiento   │
│    (Azure Storage)             │
│  • Red definida por software   │
│    (Azure Virtual Network)     │
├─────────────────────────────────┤
│  Hardware físico               │
│  • Servidores diseñados por Microsoft│
│  • Red de alta velocidad       │
└─────────────────────────────────┘
```

```powershell
# Azure utiliza una versión altamente modificada de Hyper-V optimizada para multi-tenancy
# Los usuarios no interactúan directamente con Hyper-V, sino mediante APIs de Azure

# Crear una VM en Azure mediante Azure CLI
az vm create \
  --resource-group mi-rg \
  --name web-server-01 \
  --image Ubuntu2204 \
  --size Standard_D2s_v3 \
  --admin-username azureuser \
  --generate-ssh-keys \
  --output table

# Verificar configuración de virtualización subyacente (limitado por diseño de Azure)
az vm show --resource-group mi-rg --name web-server-01 --query "{VMSize:hardwareProfile.vmSize,OSType:storageProfile.osDisk.osType}"

# Dentro de la VM Linux, verificar integración con Azure
# Azure Linux Agent (waagent) gestiona configuración dinámica
systemctl status walinuxagent

# Verificar drivers de integración (equivalente a Guest Additions)
lsmod | grep -E 'hv_|azure'
# hv_balloon: gestión dinámica de memoria
# hv_netvsc: controlador de red paravirtualizado
# hv_storvsc: controlador de almacenamiento paravirtualizado
```

```yaml
# Características distintivas de Hyper-V en Azure:
azure_hyperv_features:
  integration_services:
    heartbeat: "Monitoreo de salud de VM desde el fabric controller"
    shutdown: "Apagado limpio coordinado durante mantenimiento de host"
    time_sync: "Sincronización de tiempo con host (complementado por NTP en guest)"
    data_exchange: "Intercambio de metadatos vía KVP (Key-Value Pair)"
  
  networking:
    accelerated_networking: "SR-IOV habilitado para baja latencia y alto throughput"
    azure_cni: "Integración con red virtual de Azure, IPs asignadas del subnet"
    network_security_groups: "Firewall distribuido aplicado a nivel de hipervisor"
  
  storage:
    premium_ssd: "Discos gestionados con SLA de rendimiento y disponibilidad"
    write_accelerator: "Bypass de caché de escritura para cargas transaccionales"
    disk_encryption: "Cifrado en reposo con Azure Disk Encryption (BitLocker/DM-Crypt)"
```

> Azure extiende Hyper-V más allá de sus capacidades tradicionales mediante el "Fabric Controller", un sistema de orquestación distribuido que gestiona millones de VMs a escala global. Los usuarios no ven esta complejidad: interactúan con APIs declarativas (ARM templates, Terraform) que abstraen la ubicación física, la asignación de recursos y la gestión de fallos. Sin embargo, esta abstracción implica menor control directo: no se puede acceder a la consola del hipervisor, ajustar parámetros de scheduling o diagnosticar fallos de hardware subyacente.

## Google Cloud Platform: KVM como base open source con Andromeda para red virtualizada de alto rendimiento

Google Cloud Platform adoptó **KVM** (Kernel-based Virtual Machine) como hipervisor base desde sus inicios, aprovechando su integración upstream con el kernel de Linux, su modelo de seguridad basado en procesos y su flexibilidad para personalización a escala. Sobre KVM, Google construyó **Andromeda**, su pila de red virtualizada, y **gVisor**, un sandbox de aplicación para aislamiento reforzado, creando una arquitectura que equilibra rendimiento, seguridad y agilidad operativa.

```text
Arquitectura de virtualización en GCP:

┌─────────────────────────────────┐
│  Guest OS (VM)                  │
│  • Drivers virtio optimizados  │
│  • Guest environment (agent)   │
├─────────────────────────────────┤
│  KVM Hypervisor (kernel Linux) │
│  • Cada VM = proceso Linux     │
│  • cgroups para aislamiento de recursos│
├─────────────────────────────────┤
│  Andromeda Network Stack       │
│  • Red definida por software   │
│  • Firewalls distribuidos      │
│  • Load balancing global       │
├─────────────────────────────────┤
│  Borg / Omega (orquestadores)  │
│  • Planificación a escala planetaria│
│  • Gestión de fallos automática│
├─────────────────────────────────┤
│  Hardware físico               │
│  • Servidores custom Google    │
│  • Red Jupiter (datacenter-scale)│
└─────────────────────────────────┘
```

```bash
# Crear una instancia en GCP mediante gcloud CLI
gcloud compute instances create web-server-01 \
  --zone=us-central1-a \
  --machine-type=n2-standard-2 \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=50GB \
  --boot-disk-type=pd-balanced \
  --network-interface=network=default,subnet=default \
  --metadata=startup-script='apt update && apt install -y nginx'

# Verificar arquitectura subyacente (limitado por diseño de GCP)
gcloud compute instances describe web-server-01 --zone=us-central1-a \
  --format="value(machineType,disks.deviceName,disks.type)"

# Dentro de la VM Linux, verificar integración con GCP
# Google Guest Agent gestiona metadatos, SSH keys dinámicas, etc.
systemctl status google-guest-agent

# Verificar controladores paravirtualizados
lsmod | grep virtio
# virtio_net: red de alto rendimiento
# virtio_blk: almacenamiento optimizado
# virtio_console: comunicación con metadata service
```

```yaml
# Características técnicas de KVM en GCP:
gcp_kvm_architecture:
  performance_optimizations:
    cpu_pinning: "vCPUs mapeadas a núcleos físicos dedicados para consistencia"
    hugepages: "Memoria con hugepages habilitadas para reducir TLB misses"
    virtio_drivers: "Controladores paravirtualizados upstream, sin forks propietarios"
  
  networking_andromeda:
    distributed_firewall: "Reglas aplicadas a nivel de hipervisor, no en guest"
    global_load_balancing: "Tráfico enrutado antes de llegar a la VM, sin configuración en guest"
    packet_processing: "Offload a SmartNICs para reducir carga de CPU del host"
  
  security_innovations:
    confidential_vm: "AMD SEV-SNP para cifrado de memoria en tiempo de ejecución"
    shielded_vm: "Secure Boot, vTPM, integrity monitoring para hardening automático"
    gvisor_sandbox: "Runtime alternativo para contenedores con aislamiento de kernel reforzado"
```

> La elección de KVM por GCP refleja una filosofía de "upstream first": Google contribuye mejoras al kernel Linux y a QEMU/KVM en lugar de mantener forks propietarios. Esto beneficia a la comunidad open source y reduce la deuda técnica de mantenimiento, pero implica que las optimizaciones específicas de GCP (Andromeda, Borg integration) no están disponibles fuera de su plataforma. Para usuarios que priorizan portabilidad, esto puede representar un trade-off entre rendimiento optimizado y flexibilidad multi-cloud.

## Oracle Cloud Infrastructure: estrategia híbrida con Xen para compatibilidad legacy y KVM para innovación

Oracle Cloud Infrastructure (OCI) adoptó un enfoque pragmático y evolutivo: mantener **Xen** para cargas de trabajo heredadas y compatibilidad con migraciones desde entornos on-premises Oracle, mientras introduce **KVM** para nuevas generaciones de instancias que requieren rendimiento optimizado y características avanzadas de virtualización. Esta estrategia dual permite a Oracle servir tanto a clientes empresariales con inversiones existentes en virtualización Oracle como a nuevos usuarios que buscan la agilidad de arquitecturas cloud modernas.

```text
Estrategia de hipervisores en OCI:

┌─────────────────────────────────┐
│  Legacy Workloads (Xen-based)  │
│  • Instancias "Standard"       │
│  • Compatibilidad con Oracle VM│
│  • Migración P2V desde Oracle  │
│    Virtualization              │
├─────────────────────────────────┤
│  Modern Workloads (KVM-based)  │
│  • Instancias "BM", "GP", "HPC"│
│  • Rendimiento optimizado      │
│  • Características avanzadas:  │
│    • RDMA para HPC             │
│    • GPU passthrough           │
│    • Confidential Computing    │
├─────────────────────────────────┤
│  Oracle Cloud Infrastructure   │
│  • Gestión unificada vía APIs  │
│  • El usuario no selecciona    │
│    hipervisor directamente     │
└─────────────────────────────────┘
```

```bash
# Crear una instancia en OCI mediante OCI CLI
# El hipervisor subyacente se selecciona implícitamente por el tipo de instancia

oci compute instance launch \
  --compartment-id ocid1.compartment.oc1..aaaaaaa... \
  --shape VM.Standard.E4.Flex \
  --shape-config '{"ocpus":2,"memory-in-gbs":16}' \
  --image-id ocid1.image.oc1..aaaaaaa... \
  --subnet-id ocid1.subnet.oc1..aaaaaaa... \
  --display-name web-server-01 \
  --metadata '{"user_data": "base64-encoded-cloud-init-script"}'

# Verificar tipo de instancia y características asociadas
oci compute instance get --instance-id ocid1.instance.oc1..aaaaaaa... \
  --query 'data."shape","shape-config","metadata"'

# Dentro de la VM, identificar hipervisor subyacente (limitado por diseño)
# En Linux guest:
sudo dmidecode -t system | grep -i "product\|vendor"
# Xen-based: puede mostrar "Xen" en manufacturer
# KVM-based: puede mostrar "OracleCloud.com" o similar

# Verificar drivers disponibles
lsmod | grep -E 'xen|virtio|nvme'
# Xen: xen-blkfront, xen-netfront
# KVM: virtio_blk, virtio_net, nvme
```

```yaml
# Implicaciones de la estrategia dual de OCI:
oci_hypervisor_strategy:
  migration_path:
    xen_to_kvm: "Oracle proporciona herramientas para migrar cargas de Xen a KVM"
    compatibility_layer: "APIs de gestión unificadas ocultan diferencias de hipervisor"
    testing_recommendation: "Validar cargas críticas en ambos tipos antes de migrar"
  
  performance_characteristics:
    xen_instances: "Rendimiento consistente pero con overhead de E/S heredado"
    kvm_instances: "Menor latencia, mayor throughput, soporte para hardware especializado"
    selection_guidance: "Nuevos despliegues: preferir formas KVM-based (BM.*, GP.*, etc.)"
  
  operational_considerations:
    monitoring: "Métricas de Cloud Infrastructure unificadas, independientemente de hipervisor"
    patching: "Actualizaciones de hipervisor gestionadas por Oracle, sin downtime para usuario"
    support: "Mismo nivel de soporte para ambas arquitecturas, pero documentación específica por tipo"
```

> La transición de Xen a KVM en OCI es gradual y gestionada por Oracle: los usuarios no necesitan modificar sus workflows de aprovisionamiento, pero deben estar conscientes de que ciertas características (RDMA, GPUs específicas, confidential computing) solo están disponibles en instancias KVM-based. Para cargas de trabajo nuevas, Oracle recomienda explícitamente formas basadas en KVM para aprovechar mejoras de rendimiento y seguridad.

## Comparativa técnica y consideraciones de portabilidad entre proveedores

| Característica | AWS Nitro | Azure Hyper-V | GCP KVM | OCI Xen/KVM |
|---------------|-----------|---------------|---------|-------------|
| **Hipervisor base** | KVM minimalista + hardware dedicado | Hyper-V (modificado) | KVM upstream + personalizaciones | Xen (legacy) / KVM (moderno) |
| **Aislamiento multi-tenant** | Nitro Security Chip + hardware isolation | Hyper-V partitioning + Shielded VMs | KVM cgroups + gVisor optional | Xen domains / KVM processes |
| **Red virtualizada** | Elastic Network Adapter (ENA) | Azure Accelerated Networking (SR-IOV) | Andromeda stack + virtio-net | Oracle Virtual Cloud Network |
| **Almacenamiento** | EBS via NVMe (Nitro) | Azure Managed Disks (paravirtualized) | Persistent Disks via virtio-blk | Block Volumes via iSCSI/virtio |
| **Confidential Computing** | Nitro Enclaves, AMD SEV-SNP | Confidential VMs (AMD SEV-SNP) | Confidential VMs (AMD SEV-SNP) | Confidential Computing (AMD SEV) |
| **Nested Virtualization** | Soportado en instancias específicas (metal) | Soportado en series Dv3/Ev3 | Soportado en instancias N2/C2 | Limitado, consultar documentación |
| **Portabilidad de imágenes** | AMI (formato propietario, exportable a OVA) | VHD/VHDX (estándar, portable) | Custom Images (basadas en raw/qcow2) | Custom Images (QCOW2 compatible) |
| **APIs de gestión** | AWS CLI/SDK, CloudFormation | Azure CLI/SDK, ARM templates | gcloud CLI/SDK, Deployment Manager | OCI CLI/SDK, Terraform provider |

```bash
# Estrategia para maximizar portabilidad entre proveedores de nube
# 1. Usar formatos de imagen portables cuando sea posible
# AWS: exportar AMI a S3, convertir a OVA
aws ec2 create-instance-export-task \
  --instance-id i-0123456789abcdef0 \
  --target-environment vmware \
  --export-to-s3-task DiskImageFormat=OVA,ContainerFormat=ova,S3Bucket=my-export-bucket

# Azure: descargar VHD, convertir si es necesario
az vm image export \
  --resource-group mi-rg \
  --name web-server-01 \
  --destination-uri https://mystorage.blob.core.windows.net/images/web-server.vhd

# GCP: exportar imagen a Cloud Storage en formato raw o qcow2
gcloud compute images export web-server-image \
  --destination-uri gs://my-bucket/images/web-server.tar.gz \
  --export-format qcow2

# 2. Definir infraestructura como código con herramientas multi-cloud
# Terraform con providers múltiples permite mantener configuraciones paralelas
# pero requiere gestión cuidadosa de diferencias entre APIs

# 3. Abstract configuración específica de proveedor mediante variables
# Ejemplo: tipo de instancia mapeado por entorno
variable "instance_type_map" {
  type = map(string)
  default = {
    aws   = "t3.medium"
    azure = "Standard_D2s_v3"
    gcp   = "n2-standard-2"
    oci   = "VM.Standard.E4.Flex"
  }
}
```

> La portabilidad total entre nubes públicas es un ideal difícil de alcanzar: diferencias en APIs, servicios managed, modelos de seguridad y características de hipervisor introducen fricción operativa. En lugar de buscar compatibilidad perfecta, priorizar: (1) abstracción de configuración específica de proveedor mediante variables y módulos, (2) uso de estándares abiertos (OCI para contenedores, Kubernetes para orquestación) cuando sea posible, y (3) documentación clara de dependencias de proveedor para facilitar migraciones futuras si son necesarias.

## Quédate con...

- **AWS Nitro** representa la evolución más avanzada: hipervisor minimalista KVM + hardware dedicado (Nitro Cards) para E/S, ofreciendo rendimiento predecible y aislamiento reforzado, pero con compatibilidad limitada para cargas legacy que dependen de emulación Xen.
- **Azure Hyper-V** ofrece integración nativa con el ecosistema Microsoft y estrategias híbridas coherentes (Azure Stack, Arc), pero la abstracción del fabric controller limita el control directo sobre la capa de virtualización.
- **GCP KVM** refleja una filosofía "upstream first": optimizaciones contribuidas al kernel Linux benefician a la comunidad, pero características avanzadas (Andromeda, Borg) son exclusivas de la plataforma Google.
- **OCI Xen/KVM** adopta un enfoque pragmático dual: compatibilidad legacy con Xen para migraciones Oracle, innovación con KVM para cargas modernas; los usuarios deben seleccionar tipos de instancia apropiados para sus requisitos.
- La **elección de hipervisor impacta características disponibles**: confidential computing, nested virtualization, RDMA y GPUs especializadas pueden estar limitadas a arquitecturas específicas dentro de un mismo proveedor.
- La **portabilidad entre nubes** requiere planificación consciente: usar formatos de imagen exportables (OVA, VHD, QCOW2), infraestructura como código multi-cloud (Terraform) y abstracción de configuraciones específicas de proveedor.
- Ningún hipervisor es "mejor" en abstracto: la decisión debe basarse en requisitos de **rendimiento**, **seguridad**, **compatibilidad de cargas existentes** y **estrategia de proveedor** (single-cloud vs. multi-cloud vs. híbrido).
- La **evolución continua** de arquitecturas de virtualización en la nube significa que las características disponibles hoy pueden cambiar; mantenerse informado sobre actualizaciones de proveedores y planificar pruebas de compatibilidad antes de migrar cargas críticas.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/nube/evolucion" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/nube/caracteristicas" class="next">Siguiente</a>
</div>
