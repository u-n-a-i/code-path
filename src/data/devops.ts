export const devops = {
  // #### Linux ####
  linux: [
    {
      title: "Introducción a los sistemas Unix y Linux",
      meta: "X temas",
      lessons: [
        { title: "📖 Unix y Linux", url: "/markdown/devops/linux/introduccion/historia" },
        { title: "📖 Filosofía open source y licencias", url: "/markdown/devops/linux/introduccion/licencias" },
        { title: "📖 Concepto de distribución", url: "/markdown/devops/linux/introduccion/distribuciones" },
        { title: "📖 La arquitectura del kernel y la capa shell", url: "/markdown/devops/linux/introduccion/arquitectura" },
        { title: "📖 Sistema de archivos", url: "/markdown/devops/linux/introduccion/filesystem" },
      ],
    },
    {
      title: "Interfaz de línea de comandos",
      meta: "X temas",
      lessons: [
        { title: "📖 CLI", url: "/markdown/devops/linux/cli/conceptos" },
        { title: "📖 Comando", url: "/markdown/devops/linux/cli/estructura" },
        { title: "📖 Comandos de navegación", url: "/markdown/devops/linux/cli/navegacion" },
        { title: "📖 Sistema de ayuda", url: "/markdown/devops/linux/cli/ayuda" },
      ],
    },
    {
      title: "Manipulación de archivos y directorios",
      meta: "X temas",
      lessons: [
        { title: "📖 Creación y eliminación", url: "/markdown/devops/linux/archivos/creacion" },
        { title: "📖 Copia, movimiento y renombrado", url: "/markdown/devops/linux/archivos/movimiento" },
        { title: "📖 Visualización del contenido", url: "/markdown/devops/linux/archivos/visualizacion" },
        { title: "📖 Edición básica", url: "/markdown/devops/linux/archivos/edicion" },
        { title: "📖 Uso de comodines", url: "/markdown/devops/linux/archivos/comodines" },
      ],
    },
    {
      title: "Sistema de archivos y permisos",
      meta: "X temas",
      lessons: [
        { title: "📖 Estructura del sistema de archivo", url: "/markdown/devops/linux/permisos/estructura" },
        { title: "📖 Montaje de sistemas de archivos", url: "/markdown/devops/linux/permisos/montaje" },
        { title: "📖 Permisos de archivos", url: "/markdown/devops/linux/permisos/permisos" },
        { title: "📖 Cambio de permisos", url: "/markdown/devops/linux/permisos/chmod" },
        { title: "📖 Propiedad de archivos y directorios", url: "/markdown/devops/linux/permisos/propiedad" },
      ],
    },
    {
      title: "Administración de usuarios y grupos",
      meta: "X temas",
      lessons: [
        { title: "📖 Usuarios", url: "/markdown/devops/linux/usuarios/gestion" },
        { title: "📖 Administración de contraseña", url: "/markdown/devops/linux/usuarios/contrasenas" },
        { title: "📖 Grupos", url: "/markdown/devops/linux/usuarios/grupos" },
        { title: "📖 Usuario root", url: "/markdown/devops/linux/usuarios/root" },
        { title: "📖 Información", url: "/markdown/devops/linux/usuarios/informacion" },
      ],
    },
    {
      title: "Gestión de procesos y servicios",
      meta: "X temas",
      lessons: [
        { title: "📖 Definición y estados de un proceso", url: "/markdown/devops/linux/procesos/estados" },
        { title: "📖 Monitoreo", url: "/markdown/devops/linux/procesos/monitoreo" },
        { title: "📖 Envío de señales a procesos", url: "/markdown/devops/linux/procesos/senales" },
        { title: "📖 Trabajos en segundo plano", url: "/markdown/devops/linux/procesos/background" },
        { title: "📖 Servicios", url: "/markdown/devops/linux/procesos/systemd" },
      ],
    },
    {
      title: "Gestión de software y paquetes",
      meta: "X temas",
      lessons: [
        { title: "📖 Paquetes y repositorios", url: "/markdown/devops/linux/paquetes/conceptos" },
        { title: "📖 Gestores de paquetes por distribución", url: "/markdown/devops/linux/paquetes/gestores" },
        { title: "📖 Resolución de dependencias y conflictos", url: "/markdown/devops/linux/paquetes/dependencias" },
        { title: "📖 Compilación desde código fuente", url: "/markdown/devops/linux/paquetes/compilacion" },
      ],
    },
    {
      title: "Redes básicas en Linux",
      meta: "X temas",
      lessons: [
        { title: "📖 Comandos de diagnósticos de red", url: "/markdown/devops/linux/redes/diagnostico" },
        { title: "📖 Comandos de monitoreo de conexiones", url: "/markdown/devops/linux/redes/conexiones" },
        { title: "📖 Conexión remota: uso de SSH", url: "/markdown/devops/linux/redes/ssh" },
        { title: "📖 Firewall", url: "/markdown/devops/linux/redes/firewall" },
      ],
    },
    {
      title: "Personalización y producción",
      meta: "X temas",
      lessons: [
        { title: "📖 Redirección", url: "/markdown/devops/linux/produccion/redireccion" },
        { title: "📖 Pipeline", url: "/markdown/devops/linux/produccion/pipeline" },
        { title: "📖 Filtros", url: "/markdown/devops/linux/produccion/filtros" },
        { title: "📖 Alias", url: "/markdown/devops/linux/produccion/alias" },
      ],
    },
    {
      title: "Shell Scripting",
      meta: "X temas",
      lessons: [
        { title: "📖 Introducción", url: "/markdown/devops/linux/scripting/introduccion" },
        { title: "📖 Navegación y manipulación del sistema", url: "/markdown/devops/linux/scripting/navegacion" },
        { title: "📖 Redirecciones y tuberias", url: "/markdown/devops/linux/scripting/redirecciones" },
        { title: "📖 Tu primer script", url: "/markdown/devops/linux/scripting/primer-script" },
        { title: "📖 Variables y tipos de datos", url: "/markdown/devops/linux/scripting/variables" },
        { title: "📖 Entrada del usuario y argumentos", url: "/markdown/devops/linux/scripting/entrada" },
        { title: "📖 Operadores y expresiones", url: "/markdown/devops/linux/scripting/operadores" },
        { title: "📖 Condicionales", url: "/markdown/devops/linux/scripting/condicionales" },
        { title: "📖 Bucles", url: "/markdown/devops/linux/scripting/bucles" },
        { title: "📖 Funciones", url: "/markdown/devops/linux/scripting/funciones" },
        { title: "📖 Manejo de archivos y texto", url: "/markdown/devops/linux/scripting/archivos" },
        { title: "📖 Expresiones regulares y grep", url: "/markdown/devops/linux/scripting/regex" },
        { title: "📖 Sed: edición de texto en flujo", url: "/markdown/devops/linux/scripting/sed" },
        { title: "📖 Awk: análisis y procesamiento de datos", url: "/markdown/devops/linux/scripting/awk" },
      ],
    },
  ],

  // #### Redes ####
  redes: [
    {
      title: "Fundamentos de red",
      meta: "X temas",
      lessons: [
        { title: "📖 Concepto de red y tipos", url: "/markdown/devops/redes/fundamentos/conceptos" },
        { title: "📖 Topologías de red", url: "/markdown/devops/redes/fundamentos/topologias" },
        { title: "📖 Medios de transmisión", url: "/markdown/devops/redes/fundamentos/medios" },
        { title: "📖 Modos de transmisión", url: "/markdown/devops/redes/fundamentos/modos" },
      ],
    },
    {
      title: "Modelos de capas",
      meta: "X temas",
      lessons: [
        { title: "📖 Necesidad de modelos en red", url: "/markdown/devops/redes/capas/necesidad" },
        { title: "📖 El modelo OSI de 7 capas", url: "/markdown/devops/redes/capas/osi" },
        { title: "📖 El modelo TCP/IP", url: "/markdown/devops/redes/capas/tcpip" },
        { title: "📖 Encapsulamiento de datos", url: "/markdown/devops/redes/capas/encapsulamiento" },
        { title: "📖 Concepto de PDU", url: "/markdown/devops/redes/capas/pdu" },
        { title: "📖 Analogía práctica", url: "/markdown/devops/redes/capas/analogia" },
      ],
    },
    {
      title: "Capa física",
      meta: "X temas",
      lessons: [
        { title: "📖 Función de la capa física", url: "/markdown/devops/redes/fisica/funcion" },
        { title: "📖 Señales, medios y codificación", url: "/markdown/devops/redes/fisica/senales" },
        { title: "📖 Tipos de cables y conectores", url: "/markdown/devops/redes/fisica/cables" },
        { title: "📖 Estándares relevantes", url: "/markdown/devops/redes/fisica/estandares" },
      ],
    },
    {
      title: "Enlace de datos",
      meta: "X temas",
      lessons: [
        { title: "📖 Tramas y control de acceso al medio", url: "/markdown/devops/redes/enlace/tramas" },
        { title: "📖 MAC, LLC", url: "/markdown/devops/redes/enlace/subcapas" },
        { title: "📖 Detección y corrección de errores", url: "/markdown/devops/redes/enlace/errores" },
        { title: "📖 Protocolos: Ethernet, PPP, HDLC", url: "/markdown/devops/redes/enlace/protocolos" },
        { title: "📖 Switches y su funcionamiento", url: "/markdown/devops/redes/enlace/switches" },
      ],
    },
    {
      title: "Capa de red",
      meta: "X temas",
      lessons: [
        { title: "📖 Función de la capa de red", url: "/markdown/devops/redes/red/funcion" },
        { title: "📖 IPv4", url: "/markdown/devops/redes/red/ipv4" },
        { title: "📖 Subnetting básico", url: "/markdown/devops/redes/red/subnetting" },
        { title: "📖 IPv6", url: "/markdown/devops/redes/red/ipv6" },
        { title: "📖 Protocolos auxiliares", url: "/markdown/devops/redes/red/protocolos" },
        { title: "📖 Enrutamiento", url: "/markdown/devops/redes/red/enrutamiento" },
      ],
    },
    {
      title: "Capa de trasporte",
      meta: "X temas",
      lessons: [
        { title: "📖 Función de la capa de trasporte", url: "/markdown/devops/redes/transporte/funcion" },
        { title: "📖 Puertos y sockets", url: "/markdown/devops/redes/transporte/puertos" },
        { title: "📖 TCP", url: "/markdown/devops/redes/transporte/tcp" },
        { title: "📖 UDP", url: "/markdown/devops/redes/transporte/udp" },
        { title: "📖 Comparación directa", url: "/markdown/devops/redes/transporte/comparacion" },
        { title: "📖 Herramientas de diagnostico", url: "/markdown/devops/redes/transporte/diagnostico" },
        { title: "📖 Segmentación y Reensamblado", url: "/markdown/devops/redes/transporte/segmentacion" },
      ],
    },
    {
      title: "Capa de sesión",
      meta: "X temas",
      lessons: [
        { title: "📖 Establecimiento, mantenimiento y cierre de sesión", url: "/markdown/devops/redes/sesion/establecimiento" },
        { title: "📖 Sincronización", url: "/markdown/devops/redes/sesion/sincronizacion" },
        { title: "📖 Ejemplos", url: "/markdown/devops/redes/sesion/ejemplos" },
      ],
    },
    {
      title: "Capa de presentación",
      meta: "X temas",
      lessons: [
        { title: "📖 Formatos de datos", url: "/markdown/devops/redes/presentacion/formatos" },
        { title: "📖 Compresión y cifrado", url: "/markdown/devops/redes/presentacion/compresion" },
        { title: "📖 Codificaciones comunes", url: "/markdown/devops/redes/presentacion/codificaciones" },
      ],
    },
    {
      title: "Capa de aplicación",
      meta: "X temas",
      lessons: [
        { title: "📖 Función de la capa de aplicación", url: "/markdown/devops/redes/aplicacion/funcion" },
        { title: "📖 Protocolos esenciales", url: "/markdown/devops/redes/aplicacion/protocolos" },
        { title: "📖 Seguridad en la capa de aplicación", url: "/markdown/devops/redes/aplicacion/seguridad" },
        { title: "📖 APIs de herramientas CLI", url: "/markdown/devops/redes/aplicacion/apis" },
        { title: "📖 Uso de herramientas CLI", url: "/markdown/devops/redes/aplicacion/herramientas" },
      ],
    },
    {
      title: "Infraestructura de red básica",
      meta: "X temas",
      lessons: [
        { title: "📖 Dispositivos de red", url: "/markdown/devops/redes/infraestructura/dispositivos" },
        { title: "📖 Roles domésticas y pequeñas oficinas", url: "/markdown/devops/redes/infraestructura/soho" },
        { title: "📖 Segmentación de red", url: "/markdown/devops/redes/infraestructura/segmentacion" },
        { title: "📖 Cableado y estándares", url: "/markdown/devops/redes/infraestructura/cableado" },
        { title: "📖 WI-FI básico", url: "/markdown/devops/redes/infraestructura/wifi" },
        { title: "📖 Monitoreo y resolución de problemas", url: "/markdown/devops/redes/infraestructura/monitoreo" },
      ],
    },
    {
      title: "Redes en la practica",
      meta: "X temas",
      lessons: [
        { title: "📖 Interfaces de la red en Linux", url: "/markdown/devops/redes/practica/interfaces" },
        { title: "📖 Configuración de red", url: "/markdown/devops/redes/practica/configuracion" },
        { title: "📖 Diagnostico de conectividad", url: "/markdown/devops/redes/practica/conectividad" },
        { title: "📖 Resolución DNS", url: "/markdown/devops/redes/practica/dns" },
        { title: "📖 Pruebas de servicios", url: "/markdown/devops/redes/practica/servicios" },
        { title: "📖 Configuración de firewall básico", url: "/markdown/devops/redes/practica/firewall" },
        { title: "📖 Escenarios prácticos", url: "/markdown/devops/redes/practica/escenarios" },
        { title: "📖 Análisis de puertos y tráfico", url: "/markdown/devops/redes/practica/analisis" },
      ],
    },
  ],

  // #### Control de versiones ####
  git: [
    {
      title: "Introducción al Control de Versiones",
      meta: "X temas",
      lessons: [
        { title: "📖 ¿Qué es el control de versiones?", url: "/markdown/devops/git/introduccion/definicion" },
        { title: "📖 Tipos de sistemas de control de versiones", url: "/markdown/devops/git/introduccion/tipos" },
        { title: "📖 Problemas que resuelve", url: "/markdown/devops/git/introduccion/problemas" },
        { title: "📖 Casos de uso más allá del código", url: "/markdown/devops/git/introduccion/casos" },
        { title: "📖 Breve historia de Git", url: "/markdown/devops/git/introduccion/historia" },
        { title: "📖 Instalación y configuración inicial", url: "/markdown/devops/git/introduccion/instalacion" },
      ],
    },
    {
      title: "Fundamentos de Git",
      meta: "X temas",
      lessons: [
        { title: "📖 Arquitectura conceptual de Git", url: "/markdown/devops/git/fundamentos/arquitectura" },
        { title: "📖 Primer repositorio", url: "/markdown/devops/git/fundamentos/repositorio" },
        { title: "📖 Ciclo básico de trabajo", url: "/markdown/devops/git/fundamentos/ciclo" },
        { title: "📖 Ignorar archivos innecesarios", url: "/markdown/devops/git/fundamentos/gitignore" },
        { title: "📖 Visualización y comparación", url: "/markdown/devops/git/fundamentos/diff" },
        { title: "📖 Primeros errores comunes y cómo corregirlos", url: "/markdown/devops/git/fundamentos/errores" },
      ],
    },
    {
      title: "Gestión de Historial y Ramas",
      meta: "X temas",
      lessons: [
        { title: "📖 ¿Qué es una rama?", url: "/markdown/devops/git/ramas/concepto" },
        { title: "📖 Trabajo con ramas", url: "/markdown/devops/git/ramas/operaciones" },
        { title: "📖 Estrategias de ramificación", url: "/markdown/devops/git/ramas/estrategias" },
        { title: "📖 Resolver conflictos de fusión", url: "/markdown/devops/git/ramas/conflictos" },
        { title: "📖 Reescritura de historial", url: "/markdown/devops/git/ramas/reescritura" },
        { title: "📖 Etiquetas", url: "/markdown/devops/git/ramas/tags" },
      ],
    },
    {
      title: "Colaboración con Repositorios Remotos",
      meta: "X temas",
      lessons: [
        { title: "📖 Concepto de repositorio remoto", url: "/markdown/devops/git/remotos/concepto" },
        { title: "📖 Conectar con un remoto", url: "/markdown/devops/git/remotos/conexion" },
        { title: "📖 Subir y descargar cambios", url: "/markdown/devops/git/remotos/sincronizacion" },
        { title: "📖 Flujo colaborativo básico", url: "/markdown/devops/git/remotos/flujo" },
        { title: "📖 Manejo de ramas remotas", url: "/markdown/devops/git/remotos/ramas" },
        { title: "📖 Colisiones y buenas prácticas", url: "/markdown/devops/git/remotos/colisiones" },
      ],
    },
    {
      title: "Plataformas de Colaboración: GitHub",
      meta: "X temas",
      lessons: [
        { title: "📖 ¿Qué ofrece GitHub más allá de Git?", url: "/markdown/devops/git/github/features" },
        { title: "📖 Flujo de trabajo con Pull Requests", url: "/markdown/devops/git/github/pull-requests" },
        { title: "📖 Forks y contribución a proyectos ajenos", url: "/markdown/devops/git/github/forks" },
        { title: "📖 Plantillas y estándares", url: "/markdown/devops/git/github/plantillas" },
        { title: "📖 Markdown", url: "/markdown/devops/git/github/markdown" },
        { title: "📖 GitHub CLI y herramientas integradas", url: "/markdown/devops/git/github/cli" },
        { title: "📖 Privacidad y licencias", url: "/markdown/devops/git/github/licencias" },
      ],
    },
    {
      title: "Herramientas y Buenas Prácticas",
      meta: "X temas",
      lessons: [
        { title: "📖 Mensajes de commit efectivos", url: "/markdown/devops/git/herramientas/mensajes" },
        { title: "📖 Herramientas gráficas", url: "/markdown/devops/git/herramientas/gui" },
        { title: "📖 Alias y configuración avanzada", url: "/markdown/devops/git/herramientas/alias" },
        { title: "📖 Hooks de Git", url: "/markdown/devops/git/herramientas/hooks" },
        { title: "📖 Integración con CI/CD", url: "/markdown/devops/git/herramientas/cicd" },
        { title: "📖 Auditoría y limpieza", url: "/markdown/devops/git/herramientas/auditoria" },
        { title: "📖 Autenticación Segura con SSH", url: "/markdown/devops/git/herramientas/ssh" },
      ],
    },
  ],

  // #### Contenedores {Docker} ####
  docker: [
    {
      title: "Introducción a los Contenedores y Docker",
      meta: "X temas",
      lessons: [
        { title: "📖 ¿Qué es un contenedor?", url: "/markdown/devops/docker/introduccion/contenedores" },
        { title: "📖 Problemas que resuelven los contenedores", url: "/markdown/devops/docker/introduccion/problemas" },
        { title: "📖 Contenedores vs. Máquinas Virtuales", url: "/markdown/devops/docker/introduccion/vs-vm" },
        { title: "📖 Historia de Docker", url: "/markdown/devops/docker/introduccion/historia" },
        { title: "📖 Beneficios clave de Docker", url: "/markdown/devops/docker/introduccion/beneficios" },
        { title: "📖 Conceptos clave", url: "/markdown/devops/docker/introduccion/glosario" },
        { title: "📖 Instalación inicial", url: "/markdown/devops/docker/introduccion/instalacion" },
      ],
    },
    {
      title: "Arquitectura Básica de Docker",
      meta: "X temas",
      lessons: [
        { title: "📖 Componentes del motor Docker", url: "/markdown/devops/docker/arquitectura/componentes" },
        { title: "📖 Tecnologías subyacentes en Linux", url: "/markdown/devops/docker/arquitectura/linux" },
        { title: "📖 Arquitectura cliente-servidor", url: "/markdown/devops/docker/arquitectura/cliente-servidor" },
        { title: "📖 Contenedores como procesos", url: "/markdown/devops/docker/arquitectura/procesos" },
        { title: "📖 Docker y otros sistemas operativos", url: "/markdown/devops/docker/arquitectura/sistemas" },
        { title: "📖 Seguridad básica", url: "/markdown/devops/docker/arquitectura/seguridad" },
      ],
    },
    {
      title: "Gestión de Imágenes",
      meta: "X temas",
      lessons: [
        { title: "📖 ¿Qué es una imagen de Docker?", url: "/markdown/devops/docker/imagenes/concepto" },
        { title: "📖 Registro público: Docker Hub", url: "/markdown/devops/docker/imagenes/hub" },
        { title: "📖 Operaciones básicas con imágenes", url: "/markdown/devops/docker/imagenes/operaciones" },
        { title: "📖 Etiquetas y versiones", url: "/markdown/devops/docker/imagenes/tags" },
        { title: "📖 Inspección de imágenes", url: "/markdown/devops/docker/imagenes/inspeccion" },
        { title: "📖 Buenas prácticas", url: "/markdown/devops/docker/imagenes/tips" },
      ],
    },
    {
      title: "Ejecución y Gestión de Contenedores",
      meta: "X temas",
      lessons: [
        { title: "📖 Ejecutar un contenedor", url: "/markdown/devops/docker/contenedores/ejecucion" },
        { title: "📖 Ciclo de vida de un contenedor", url: "/markdown/devops/docker/contenedores/ciclo" },
        { title: "📖 Gestión básica", url: "/markdown/devops/docker/contenedores/gestion" },
        { title: "📖 Acceso al contenedor", url: "/markdown/devops/docker/contenedores/acceso" },
        { title: "📖 Recursos y límites", url: "/markdown/devops/docker/contenedores/recursos" },
        { title: "📖 Eliminación automática", url: "/markdown/devops/docker/contenedores/auto-remove" },
      ],
    },
    {
      title: "Dockerfile: Construcción de Imágenes Personalizadas",
      meta: "X temas",
      lessons: [
        { title: "📖 ¿Qué es un Dockerfile?", url: "/markdown/devops/docker/dockerfile/concepto" },
        { title: "📖 Instrucciones clave", url: "/markdown/devops/docker/dockerfile/instrucciones" },
        { title: "📖 Construcción de la imagen", url: "/markdown/devops/docker/dockerfile/build" },
        { title: "📖 Optimización del Dockerfile", url: "/markdown/devops/docker/dockerfile/optimizacion" },
        { title: "📖 Ejemplo práctico", url: "/markdown/devops/docker/dockerfile/ejemplo" },
        { title: "📖 Errores comunes", url: "/markdown/devops/docker/dockerfile/errores" },
      ],
    },
    {
      title: "Almacenamiento Persistente: Volúmenes",
      meta: "X temas",
      lessons: [
        { title: "📖 El problema de la efimeridad", url: "/markdown/devops/docker/volumenes/efimeridad" },
        { title: "📖 Tipos de almacenamiento en Docker", url: "/markdown/devops/docker/volumenes/tipos" },
        { title: "📖 Gestión de volúmenes", url: "/markdown/devops/docker/volumenes/gestion" },
        { title: "📖 Volúmenes con Docker Compose", url: "/markdown/devops/docker/volumenes/compose" },
        { title: "📖 Buenas prácticas", url: "/markdown/devops/docker/volumenes/tips" },
        { title: "📖 Copias de seguridad", url: "/markdown/devops/docker/volumenes/backup" },
      ],
    },
    {
      title: "Redes en Docker",
      meta: "X temas",
      lessons: [
        { title: "📖 Redes por defecto", url: "/markdown/devops/docker/redes/default" },
        { title: "📖 Tipos de redes en Docker", url: "/markdown/devops/docker/redes/tipos" },
        { title: "📖 Redes definidas por el usuario", url: "/markdown/devops/docker/redes/custom" },
        { title: "📖 Publicación de puertos", url: "/markdown/devops/docker/redes/puertos" },
        { title: "📖 Inspección y resolución", url: "/markdown/devops/docker/redes/inspeccion" },
        { title: "📖 Seguridad de red", url: "/markdown/devops/docker/redes/seguridad" },
      ],
    },
    {
      title: "Docker Compose: Orquestación Básica",
      meta: "X temas",
      lessons: [
        { title: "📖 ¿Qué es Docker Compose?", url: "/markdown/devops/docker/compose/concepto" },
        { title: "📖 Estructura del archivo", url: "/markdown/devops/docker/compose/estructura" },
        { title: "📖 Comandos esenciales", url: "/markdown/devops/docker/compose/comandos" },
        { title: "📖 Dependencias y orden de inicio", url: "/markdown/devops/docker/compose/dependencias" },
        { title: "📖 Variables de entorno y archivos .env", url: "/markdown/devops/docker/compose/variables" },
        { title: "📖 Proyecto", url: "/markdown/devops/docker/compose/proyecto" },
      ],
    },
    {
      title: "Registro y Distribución de Imágenes",
      meta: "X temas",
      lessons: [
        { title: "📖 Registro de imágenes", url: "/markdown/devops/docker/registro/concepto" },
        { title: "📖 Subir una imagen a Docker Hub", url: "/markdown/devops/docker/registro/push" },
        { title: "📖 Registros privados", url: "/markdown/devops/docker/registro/privados" },
        { title: "📖 Seguridad en la distribución", url: "/markdown/devops/docker/registro/seguridad" },
        { title: "📖 Políticas de etiquetado y versionado", url: "/markdown/devops/docker/registro/versionado" },
        { title: "📖 CI/CD y registros", url: "/markdown/devops/docker/registro/cicd" },
      ],
    },
    {
      title: "Docker en el Flujo de Trabajo Profesional",
      meta: "X temas",
      lessons: [
        { title: "📖 Desarrollo local con Docker", url: "/markdown/devops/docker/profesional/desarrollo" },
        { title: "📖 Integración continua", url: "/markdown/devops/docker/profesional/ci" },
        { title: "📖 Despliegue en producción", url: "/markdown/devops/docker/profesional/produccion" },
        { title: "📖 Monitoreo y logging", url: "/markdown/devops/docker/profesional/monitoreo" },
        { title: "📖 Seguridad en producción", url: "/markdown/devops/docker/profesional/seguridad" },
        { title: "📖 Límites de Docker y el siguiente paso", url: "/markdown/devops/docker/profesional/limites" },
      ],
    },
  ],

  // #### Orquestadores {Kubernetes} ####
  kubernetes: [
    {
      title: "Introducción a la Orquestación de Contenedores",
      meta: "X temas",
      lessons: [
        { title: "📖 ¿Por qué necesitamos orquestación?", url: "/markdown/devops/kubernetes/introduccion/necesidad" },
        { title: "📖 ¿Qué es Kubernetes?", url: "/markdown/devops/kubernetes/introduccion/concepto" },
        { title: "📖 Conceptos clave", url: "/markdown/devops/kubernetes/introduccion/glosario" },
      ],
    },
    {
      title: "Arquitectura de Kubernetes",
      meta: "X temas",
      lessons: [
        { title: "📖 Componentes del Nodo Master", url: "/markdown/devops/kubernetes/arquitectura/master" },
        { title: "📖 Componentes de los Nodos Workers", url: "/markdown/devops/kubernetes/arquitectura/workers" },
        { title: "📖 Arquitectura cliente-servidor", url: "/markdown/devops/kubernetes/arquitectura/cliente-servidor" },
      ],
    },
    {
      title: "Primeros Pasos con kubectl",
      meta: "X temas",
      lessons: [
        { title: "📖 Instalación y configuración", url: "/markdown/devops/kubernetes/kubectl/instalacion" },
        { title: "📖 Comandos esenciales", url: "/markdown/devops/kubernetes/kubectl/comandos" },
        { title: "📖 Contextos y namespaces", url: "/markdown/devops/kubernetes/kubectl/contextos" },
      ],
    },
    {
      title: "Trabajando con Pods y Deployments",
      meta: "X temas",
      lessons: [
        { title: "📖 Creación de Pods", url: "/markdown/devops/kubernetes/pods/creacion" },
        { title: "📖 Deployments", url: "/markdown/devops/kubernetes/pods/deployments" },
        { title: "📖 Servicios", url: "/markdown/devops/kubernetes/pods/servicios" },
        { title: "📖 Health Checks", url: "/markdown/devops/kubernetes/pods/health" },
      ],
    },
    {
      title: "Configuración y Almacenamiento",
      meta: "X temas",
      lessons: [
        { title: "📖 ConfigMaps", url: "/markdown/devops/kubernetes/configuracion/configmaps" },
        { title: "📖 Secrets", url: "/markdown/devops/kubernetes/configuracion/secrets" },
        { title: "📖 Volúmenes", url: "/markdown/devops/kubernetes/configuracion/volumenes" },
      ],
    },
    {
      title: "Redes en Kubernetes",
      meta: "X temas",
      lessons: [
        { title: "📖 Modelo de red", url: "/markdown/devops/kubernetes/redes/modelo" },
        { title: "📖 Services y DNS", url: "/markdown/devops/kubernetes/redes/services" },
        { title: "📖 Ingress", url: "/markdown/devops/kubernetes/redes/ingress" },
        { title: "📖 Network Policies", url: "/markdown/devops/kubernetes/redes/policies" },
      ],
    },
    {
      title: "Escalado y Gestión Avanzada",
      meta: "X temas",
      lessons: [
        { title: "📖 Horizontal Pod Autoscaler", url: "/markdown/devops/kubernetes/escalado/hpa" },
        { title: "📖 Vertical Pod Autoscaler", url: "/markdown/devops/kubernetes/escalado/vpa" },
        { title: "📖 Rolling Updates y Rollbacks", url: "/markdown/devops/kubernetes/escalado/updates" },
        { title: "📖 DaemonSets y StatefulSets", url: "/markdown/devops/kubernetes/escalado/avanzados" },
      ],
    },
    {
      title: "Entornos Locales y Cloud",
      meta: "X temas",
      lessons: [
        { title: "📖 Minikube", url: "/markdown/devops/kubernetes/entornos/minikube" },
        { title: "📖 Kind", url: "/markdown/devops/kubernetes/entornos/kind" },
        { title: "📖 Servicios gestionados en Cloud", url: "/markdown/devops/kubernetes/entornos/cloud" },
      ],
    },
    {
      title: "Buenas Prácticas y Seguridad",
      meta: "X temas",
      lessons: [
        { title: "📖 Security Context", url: "/markdown/devops/kubernetes/seguridad/context" },
        { title: "📖 RBAC", url: "/markdown/devops/kubernetes/seguridad/rbac" },
        { title: "📖 Pod Security Standards", url: "/markdown/devops/kubernetes/seguridad/pss" },
        { title: "📖 Resource Limits", url: "/markdown/devops/kubernetes/seguridad/limits" },
      ],
    },
  ],

  // #### Infraestructura como código {Terraform} ####
  terraform: [
    {
      title: "Fundamentos de Infraestructura como Código",
      meta: "X temas",
      lessons: [
        { title: "📖 ¿Qué es la Infraestructura como Código?", url: "/markdown/devops/terraform/fundamentos/concepto" },
        { title: "📖 Enfoques: Imperativo vs Declarativo", url: "/markdown/devops/terraform/fundamentos/enfoques" },
        { title: "📖 Beneficios de IaC", url: "/markdown/devops/terraform/fundamentos/beneficios" },
      ],
    },
    {
      title: "Introducción a Terraform",
      meta: "X temas",
      lessons: [
        { title: "📖 ¿Qué es Terraform?", url: "/markdown/devops/terraform/introduccion/concepto" },
        { title: "📖 Arquitectura de Terraform", url: "/markdown/devops/terraform/introduccion/arquitectura" },
        { title: "📖 Conceptos clave", url: "/markdown/devops/terraform/introduccion/glosario" },
      ],
    },
    {
      title: "Flujo de Trabajo Básico",
      meta: "X temas",
      lessons: [
        { title: "📖 Inicialización del proyecto", url: "/markdown/devops/terraform/flujo/init" },
        { title: "📖 Escribir configuración", url: "/markdown/devops/terraform/flujo/configuracion" },
        { title: "📖 Planificación", url: "/markdown/devops/terraform/flujo/plan" },
        { title: "📖 Aplicación", url: "/markdown/devops/terraform/flujo/apply" },
        { title: "📖 Destrucción", url: "/markdown/devops/terraform/flujo/destroy" },
      ],
    },
    {
      title: "Lenguaje HCL",
      meta: "X temas",
      lessons: [
        { title: "📖 Sintaxis básica", url: "/markdown/devops/terraform/hcl/sintaxis" },
        { title: "📖 Variables", url: "/markdown/devops/terraform/hcl/variables" },
        { title: "📖 Outputs", url: "/markdown/devops/terraform/hcl/outputs" },
        { title: "📖 Data Sources", url: "/markdown/devops/terraform/hcl/data" },
      ],
    },
    {
      title: "Estado y Backend",
      meta: "X temas",
      lessons: [
        { title: "📖 Importancia del estado", url: "/markdown/devops/terraform/estado/importancia" },
        { title: "📖 Backend local vs remoto", url: "/markdown/devops/terraform/estado/backend" },
        { title: "📖 State locking", url: "/markdown/devops/terraform/estado/locking" },
        { title: "📖 Comandos de gestión de estado", url: "/markdown/devops/terraform/estado/comandos" },
      ],
    },
    {
      title: "Módulos y Reutilización",
      meta: "X temas",
      lessons: [
        { title: "📖 ¿Qué es un módulo?", url: "/markdown/devops/terraform/modulos/concepto" },
        { title: "📖 Estructura de un módulo", url: "/markdown/devops/terraform/modulos/estructura" },
        { title: "📖 Uso de módulos", url: "/markdown/devops/terraform/modulos/uso" },
        { title: "📖 Buenas prácticas de módulos", url: "/markdown/devops/terraform/modulos/tips" },
      ],
    },
    {
      title: "Gestión de Dependencias y Recursos",
      meta: "X temas",
      lessons: [
        { title: "📖 Dependencias implícitas", url: "/markdown/devops/terraform/dependencias/implicitas" },
        { title: "📖 Dependencias explícitas", url: "/markdown/devops/terraform/dependencias/explicitas" },
        { title: "📖 Gráfico de dependencias", url: "/markdown/devops/terraform/dependencias/grafico" },
        { title: "📖 Ciclo de vida de recursos", url: "/markdown/devops/terraform/dependencias/ciclo" },
      ],
    },
    {
      title: "Provisionamiento y Configuración",
      meta: "X temas",
      lessons: [
        { title: "📖 User data / Cloud-init", url: "/markdown/devops/terraform/provisionamiento/userdata" },
        { title: "📖 Connection y provisioners", url: "/markdown/devops/terraform/provisionamiento/provisioners" },
        { title: "📖 Integración con Ansible/Chef", url: "/markdown/devops/terraform/provisionamiento/ansible" },
      ],
    },
    {
      title: "Workspaces y Multi-Entorno",
      meta: "X temas",
      lessons: [
        { title: "📖 Concepto de Workspaces", url: "/markdown/devops/terraform/workspaces/concepto" },
        { title: "📖 Estrategias de multi-entorno", url: "/markdown/devops/terraform/workspaces/estrategias" },
        { title: "📖 Variables por entorno", url: "/markdown/devops/terraform/workspaces/variables" },
      ],
    },
    {
      title: "Terraform Cloud y CI/CD",
      meta: "X temas",
      lessons: [
        { title: "📖 Terraform Cloud", url: "/markdown/devops/terraform/cicd/cloud" },
        { title: "📖 Integración con CI/CD", url: "/markdown/devops/terraform/cicd/integracion" },
        { title: "📖 Buenas prácticas en pipelines", url: "/markdown/devops/terraform/cicd/tips" },
      ],
    },
    {
      title: "Seguridad y Buenas Prácticas",
      meta: "X temas",
      lessons: [
        { title: "📖 Gestión de secretos", url: "/markdown/devops/terraform/seguridad/secretos" },
        { title: "📖 State remoto seguro", url: "/markdown/devops/terraform/seguridad/estado" },
        { title: "📖 Principio de mínimo privilegio", url: "/markdown/devops/terraform/seguridad/privilegios" },
        { title: "📖 Validación y testing", url: "/markdown/devops/terraform/seguridad/testing" },
      ],
    },
  ],

  // #### Gestión y despliegue de servidores ####
  servidores: [
    {
      title: "Introducción a los Servidores",
      meta: "X temas",
      lessons: [
        { title: "📖 ¿Qué es un servidor?", url: "/markdown/devops/servidores/introduccion/concepto" },
        { title: "📖 Tipos comunes de servidores", url: "/markdown/devops/servidores/introduccion/tipos" },
        { title: "📖 Diferencias: servidor vs. estación de trabajo", url: "/markdown/devops/servidores/introduccion/diferencias" },
        { title: "📖 Modelos de implementación", url: "/markdown/devops/servidores/introduccion/modelos" },
        { title: "📖 Conceptos clave", url: "/markdown/devops/servidores/introduccion/conceptos" },
        { title: "📖 Herramientas de acceso remoto", url: "/markdown/devops/servidores/introduccion/acceso" },
      ],
    },
    {
      title: "Preparación del Sistema Operativo",
      meta: "X temas",
      lessons: [
        { title: "📖 Elección del sistema operativo", url: "/markdown/devops/servidores/preparacion/so" },
        { title: "📖 Instalación mínima", url: "/markdown/devops/servidores/preparacion/instalacion" },
        { title: "📖 Configuración inicial", url: "/markdown/devops/servidores/preparacion/configuracion" },
        { title: "📖 Usuarios y privilegios", url: "/markdown/devops/servidores/preparacion/usuarios" },
        { title: "📖 Configuración de red", url: "/markdown/devops/servidores/preparacion/red" },
        { title: "📖 Herramientas esenciales", url: "/markdown/devops/servidores/preparacion/herramientas" },
      ],
    },
    {
      title: "Gestión de Servicios y Procesos",
      meta: "X temas",
      lessons: [
        { title: "📖 Sistema de inicio moderno: systemd", url: "/markdown/devops/servidores/gestion/systemd" },
        { title: "📖 Servicios comunes", url: "/markdown/devops/servidores/gestion/servicios" },
        { title: "📖 Gestión de procesos", url: "/markdown/devops/servidores/gestion/procesos" },
        { title: "📖 Tareas programadas", url: "/markdown/devops/servidores/gestion/tareas" },
        { title: "📖 Logs del sistema", url: "/markdown/devops/servidores/gestion/logs" },
        { title: "📖 Dependencias y conflictos", url: "/markdown/devops/servidores/gestion/dependencias" },
      ],
    },
    {
      title: "Seguridad Básica del Servidor",
      meta: "X temas",
      lessons: [
        { title: "📖 Firewall", url: "/markdown/devops/servidores/seguridad/firewall" },
        { title: "📖 SSH seguro", url: "/markdown/devops/servidores/seguridad/ssh" },
        { title: "📖 Actualizaciones automáticas", url: "/markdown/devops/servidores/seguridad/actualizaciones" },
        { title: "📖 Gestión de usuarios y permisos", url: "/markdown/devops/servidores/seguridad/usuarios" },
        { title: "📖 Herramientas de seguridad", url: "/markdown/devops/servidores/seguridad/herramientas" },
        { title: "📖 Auditoría básica", url: "/markdown/devops/servidores/seguridad/auditoria" },
      ],
    },
    {
      title: "Automatización del Despliegue",
      meta: "X temas",
      lessons: [
        { title: "📖 Scripts de shell", url: "/markdown/devops/servidores/automatizacion/scripts" },
        { title: "📖 Gestión de configuración", url: "/markdown/devops/servidores/automatizacion/configuracion" },
        { title: "📖 Ansible básico", url: "/markdown/devops/servidores/automatizacion/ansible" },
        { title: "📖 Infrastructure as Code", url: "/markdown/devops/servidores/automatizacion/iac" },
        { title: "📖 CI/CD integrado", url: "/markdown/devops/servidores/automatizacion/cicd" },
        { title: "📖 Buenas prácticas", url: "/markdown/devops/servidores/automatizacion/tips" },
      ],
    },
    {
      title: "Monitoreo y Mantenimiento",
      meta: "X temas",
      lessons: [
        { title: "📖 Monitoreo básico", url: "/markdown/devops/servidores/mantenimiento/monitoreo" },
        { title: "📖 Herramientas de monitoreo", url: "/markdown/devops/servidores/mantenimiento/herramientas" },
        { title: "📖 Logs y alertas", url: "/markdown/devops/servidores/mantenimiento/alertas" },
        { title: "📖 Copias de seguridad", url: "/markdown/devops/servidores/mantenimiento/backup" },
        { title: "📖 Mantenimiento rutinario", url: "/markdown/devops/servidores/mantenimiento/rutina" },
        { title: "📖 Actualización con cuidado", url: "/markdown/devops/servidores/mantenimiento/actualizacion" },
      ],
    },
    {
      title: "Servidores en la Nube",
      meta: "X temas",
      lessons: [
        { title: "📖 Modelo IaaS", url: "/markdown/devops/servidores/nube/iaas" },
        { title: "📖 Provisionamiento", url: "/markdown/devops/servidores/nube/provisionamiento" },
        { title: "📖 Red y seguridad en la nube", url: "/markdown/devops/servidores/nube/red" },
        { title: "📖 Acceso al servidor", url: "/markdown/devops/servidores/nube/acceso" },
        { title: "📖 Almacenamiento en la nube", url: "/markdown/devops/servidores/nube/almacenamiento" },
        { title: "📖 Ventajas y desafíos", url: "/markdown/devops/servidores/nube/comparacion" },
      ],
    },
    {
      title: "Buenas Práticas",
      meta: "X temas",
      lessons: [
        { title: "📖 Documentación", url: "/markdown/devops/servidores/practicas/documentacion" },
        { title: "📖 Principios de diseño", url: "/markdown/devops/servidores/practicas/diseno" },
        { title: "📖 Gestión de secretos", url: "/markdown/devops/servidores/practicas/secretos" },
        { title: "📖 Pruebas y entornos", url: "/markdown/devops/servidores/practicas/pruebas" },
        { title: "📖 Cumplimiento y ética", url: "/markdown/devops/servidores/practicas/cumplimiento" },
        { title: "📖 Cultura DevOps", url: "/markdown/devops/servidores/practicas/devops" },
      ],
    },
  ],
};