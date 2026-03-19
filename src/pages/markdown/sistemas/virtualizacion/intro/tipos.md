---
title: "Tipos de virtualización"
description: ""
layout: ../../../../../layouts/MarkdownLayout.astro
---

<div class="glosario">

- [Tipos de virtualización](#tipos-de-virtualización)
  - [Virtualización de hardware: máquinas virtuales completas con aislamiento de kernel](#virtualización-de-hardware-máquinas-virtuales-completas-con-aislamiento-de-kernel)
  - [Virtualización de red: segmentación lógica sobre infraestructura física compartida](#virtualización-de-red-segmentación-lógica-sobre-infraestructura-física-compartida)
  - [Virtualización de almacenamiento: pools lógicos, aprovisionamiento dinámico y gestión unificada](#virtualización-de-almacenamiento-pools-lógicos-aprovisionamiento-dinámico-y-gestión-unificada)
  - [Virtualización de escritorio (VDI): entrega segura y centralizada de entornos de usuario](#virtualización-de-escritorio-vdi-entrega-segura-y-centralizada-de-entornos-de-usuario)
  - [Virtualización de aplicaciones y la evolución hacia contenedores](#virtualización-de-aplicaciones-y-la-evolución-hacia-contenedores)
  - [Quédate con...](#quédate-con)

</div>

# Tipos de virtualización

La virtualización no es un concepto monolítico, sino un principio arquitectónico aplicable en múltiples capas de la pila tecnológica: desde el hardware físico hasta la aplicación final. Cada tipo de virtualización responde a un problema específico —aislamiento de cargas de trabajo, segmentación lógica de red, gestión flexible de almacenamiento, entrega segura de escritorios o portabilidad de aplicaciones— pero todos comparten un mecanismo común: interponer una capa de abstracción que desacopla la interfaz lógica de su implementación física. Comprender esta taxonomía es esencial para diseñar infraestructuras coherentes: elegir virtualización de hardware cuando se requiere aislamiento de kernel, virtualización de red para segmentación multi-tenant, o contenedores cuando la agilidad de despliegue prima sobre el aislamiento fuerte. La evolución histórica muestra una tendencia clara hacia abstracciones más granulares y ligeras, pero la elección adecuada depende siempre de los requisitos de seguridad, rendimiento y operatividad de cada caso de uso.

## Virtualización de hardware: máquinas virtuales completas con aislamiento de kernel

La virtualización de hardware —también llamada virtualización de plataforma— es la forma más conocida y consiste en emular un sistema computacional completo (CPU, memoria, dispositivos de E/S) sobre el cual se ejecuta un sistema operativo invitado sin modificaciones. Cada máquina virtual (VM) posee su propio kernel, controladores y pila de red, lo que proporciona el máximo nivel de aislamiento: un fallo o compromiso en una VM no propaga a otras ni al host.

```text
Arquitectura típica de virtualización de hardware:

┌─────────────────┬─────────────────┐
│  SO Invitado A  │  SO Invitado B  │  ← Kernels independientes
├─────────────────┼─────────────────┤
│  Drivers virt.  │  Drivers virt.  │
├─────────────────┴─────────────────┤
│        Hipervisor (Tipo 1/2)      │  ← Capa de abstracción
├───────────────────────────────────┤
│        Hardware físico            │  ← CPU, RAM, disco, NIC
└───────────────────────────────────┘
```

Este enfoque es ideal para:
- Ejecutar sistemas operativos heterogéneos (Windows, Linux, BSD) en el mismo hardware.
- Aislar cargas de trabajo críticas o sensibles a seguridad.
- Migrar servidores físicos legacy a entornos virtualizados (P2V).

```bash
# Ejemplo: definir una VM básica en libvirt/KVM (XML simplificado)
<domain type='kvm'>
  <name>web-server-01</name>
  <memory unit='GiB'>4</memory>
  <vcpu>2</vcpu>
  <os>
    <type arch='x86_64'>hvm</type>
    <boot dev='hd'/>
  </os>
  <devices>
    <disk type='file' device='disk'>
      <source file='/var/lib/libvirt/images/web-server-01.qcow2'/>
      <target dev='vda' bus='virtio'/>
    </disk>
    <interface type='network'>
      <source network='default'/>
      <model type='virtio'/>
    </interface>
  </devices>
</domain>
```

> La virtualización de hardware introduce una sobrecarga mínima (2-8%) debido a la traducción de instrucciones y gestión de recursos. Para cargas sensibles a latencia extrema (HPC, bases de datos transaccionales), evaluar el uso de asignación directa de dispositivos (PCI passthrough) o considerar alternativas como contenedores con aislamiento reforzado (Kata Containers).

## Virtualización de red: segmentación lógica sobre infraestructura física compartida

La virtualización de red desacopla la topología lógica de la conectividad física, permitiendo crear redes aisladas, políticas de tráfico personalizadas y servicios de red programables sin modificar el cableado subyacente. Sus implementaciones abarcan desde tecnologías tradicionales hasta arquitecturas definidas por software:

| Tecnología | Nivel de abstracción | Caso de uso típico |
|-----------|---------------------|-------------------|
| **VLAN (802.1Q)** | Capa 2 (enlace) | Segmentar tráfico entre departamentos en un mismo switch |
| **VXLAN / Geneve** | Overlay (Capa 2 sobre UDP) | Extender L2 entre centros de datos o nubes híbridas |
| **SDN (OpenFlow, OVS)** | Control plano separado del dato | Orquestación dinámica de redes multi-tenant en nube |
| **Network Functions Virtualization (NFV)** | Servicios de red como software | Firewalls, balanceadores o routers como VMs/contenedores |

```bash
# Crear una red overlay con VXLAN en Linux (ejemplo simplificado)
ip link add vxlan0 type vxlan id 42 \
  remote 192.168.1.10 local 192.168.1.20 \
  dstport 4789 dev eth0

ip link set vxlan0 up
ip addr add 10.0.0.1/24 dev vxlan0

# Las VMs conectadas a vxlan0 pueden comunicarse como si estuvieran en la misma LAN física,
# incluso si están en hosts diferentes separados por routers.
```

> Las redes virtualizadas introducen complejidad operativa: troubleshooting requiere correlacionar capas físicas y lógicas. Herramientas como `tcpdump` en el vSwitch, monitoreo de flujos (sFlow/IPFIX) y documentación automatizada (NetBox, Nautobot) son esenciales para mantener la visibilidad.

## Virtualización de almacenamiento: pools lógicos, aprovisionamiento dinámico y gestión unificada

La virtualización de almacenamiento abstrae discos físicos heterogéneos (HDD, SSD, SAN, NAS) en pools lógicos gestionados centralizadamente, permitiendo asignar capacidad bajo demanda, replicar datos entre sitios y aplicar políticas de rendimiento o protección de forma consistente.

Componentes clave:
- **Thin provisioning**: asignar capacidad lógica mayor que la física disponible, consumiendo espacio real solo cuando se escribe.
- **Snapshots y clones**: capturar estados puntuales o duplicar volúmenes sin copiar datos completos (copy-on-write).
- **Tiering automático**: migrar bloques "calientes" a SSD y "fríos" a HDD según patrones de acceso.
- **Replicación síncrona/asíncrona**: mantener copias consistentes entre sitios para DR o balanceo de carga.

```bash
# Ejemplo: crear un volumen con thin provisioning en LVM (Linux)
pvcreate /dev/sdb /dev/sdc
vgcreate --alloc thin vg_pool /dev/sdb /dev/sdc

lvcreate --type thin-pool --size 100G --name thin_pool vg_pool
lvcreate --virtualsize 50G --thin --name web_data vg_pool/thin_pool

# El volumen web_data aparece como 50GB, pero consume espacio físico solo al escribir
```

> El thin provisioning requiere monitorización proactiva: si el pool físico se llena, las VMs pueden fallar abruptamente al intentar escribir. Implementar alertas de uso (>80%) y políticas de expansión automática o limpieza de snapshots obsoletos es crítico para evitar interrupciones.

## Virtualización de escritorio (VDI): entrega segura y centralizada de entornos de usuario

La virtualización de infraestructura de escritorios (VDI) desacopla el entorno de usuario (SO, aplicaciones, datos) del dispositivo físico, ejecutando sesiones de escritorio en VMs o contenedores alojados en el datacenter y transmitiendo la interfaz gráfica mediante protocolos remotos optimizados (PCoIP, Blast Extreme, SPICE, RDP).

Arquitectura típica:
```
[Dispositivo cliente] ←(protocolo gráfico)→ [Connection Broker] → [Pool de VMs/Contenedores]
                                                        ↓
                                              [Almacenamiento compartido]
                                              [Perfiles de usuario (FSLogix, etc.)]
```

Ventajas operativas:
- **Seguridad**: los datos nunca salen del datacenter; ideal para entornos regulados o trabajo remoto.
- **Gestión centralizada**: parchear, actualizar o recuperar un "golden image" afecta a todos los usuarios derivados.
- **Continuidad**: el usuario puede reconectar su sesión desde cualquier dispositivo sin pérdida de estado.

```yaml
# Ejemplo: configuración simplificada de pool VDI en formato YAML (conceptual)
vdi_pool:
  name: engineering-desktops
  base_image: windows-10-enterprise-golden
  instance_type: vCPU:4, RAM:8GB, GPU:virtualizada
  protocol: blast-extreme
  persistence: non-persistent  # Descarta cambios al cerrar sesión
  profile_management: fslogix  # Separa perfil de usuario del SO base
  auto_scale:
    min_instances: 10
    max_instances: 100
    trigger_metric: session_queue_length
```

> VDI no es adecuado para todas las cargas: aplicaciones con alta demanda gráfica (CAD, edición de video) o baja latencia (juegos) pueden sufrir con la compresión/remuestreo de píxeles. Evaluar siempre el perfil de usuario y considerar alternativas como DaaS (Desktop as a Service) gestionado o escritorios locales con gestión centralizada (Intune, Jamf) según el caso.

## Virtualización de aplicaciones y la evolución hacia contenedores

La virtualización de aplicaciones empaqueta una aplicación con sus dependencias (librerías, runtime, configuración) para ejecutarla de forma aislada sin modificar el SO anfitrión. Históricamente, soluciones como Microsoft App-V o VMware ThinApp lograban esto mediante sandboxing a nivel de sistema de archivos y registro.

Sin embargo, esta aproximación ha evolucionado hacia los **contenedores**, que comparten el kernel del host pero aíslan procesos, red y sistema de archivos mediante namespaces y cgroups del kernel Linux:

```text
Comparación conceptual:

Virtualización de apps tradicional:
[App A + dependencias empaquetadas] → [Capa de sandbox] → [SO Host]

Contenedores (Docker, Podman):
[App A + libs] → [Namespace de procesos/red/mount] + [Cgroups] → [Kernel Linux] → [Hardware]
```

Ventajas de los contenedores sobre la virtualización tradicional de aplicaciones:
- **Menor overhead**: sin SO invitado, arranque en segundos vs. minutos.
- **Portabilidad reforzada**: la misma imagen ejecuta en desarrollo, pruebas y producción.
- **Orquestación nativa**: herramientas como Kubernetes gestionan escalado, salud y despliegue continuo.

```dockerfile
# Ejemplo: Dockerfile que empaqueta una aplicación web con sus dependencias
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000"]
```

> Los contenedores no reemplazan a las VMs: comparten kernel, por lo que un compromiso del kernel afecta a todos los contenedores del host. Para cargas que requieren aislamiento fuerte (multi-tenant público, cargas no confiables), considerar tecnologías híbridas como **Kata Containers** (contenedores con aislamiento de VM ligera) o **gVisor** (kernel en espacio de usuario).

## Quédate con...

- La **virtualización de hardware** proporciona aislamiento completo de kernel y es ideal para cargas heterogéneas o críticas, pero con mayor overhead que alternativas más ligeras.
- La **virtualización de red** (VLANs, VXLAN, SDN) permite segmentación lógica y políticas programables, esencial para multi-tenancy y nubes híbridas.
- La **virtualización de almacenamiento** habilita thin provisioning, snapshots y replicación, pero requiere monitorización proactiva para evitar agotamiento de pools físicos.
- **VDI** centraliza la gestión y seguridad de escritorios, pero su viabilidad depende del perfil de aplicación y la calidad de la conectividad de red.
- La **virtualización de aplicaciones** evolucionó hacia contenedores: más ligeros y portables, pero con aislamiento basado en kernel compartido.
- No existe una tecnología "mejor" en abstracto: la elección depende de los requisitos de **aislamiento**, **rendimiento**, **portabilidad** y **complejidad operativa** de cada caso de uso.

<div class="pagination">
  <a href="/markdown/sistemas/virtualizacion/intro/ventajas" class="prev">Anterior</a>
  <a href="/markdown/sistemas/virtualizacion/intro/componentes" class="next">Siguiente</a>
</div>
