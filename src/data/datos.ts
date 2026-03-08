export const datos = {

  // #### Bases de datos relacionales ####
  bd_relacionales: [
    {
      title: "Sistemas de gestión de bases de datos",
      meta: "X temas",
      lessons: [
        { title: "📖 ¿Qué es un DBMS?", url: "/markdown/datos/intro/dbms" },
        { title: "📖 Arquitecturas de tres niveles", url: "/markdown/datos/intro/arquitecturas" },
        { title: "📖 Conceptos fundamentales de bases de datos", url: "/markdown/datos/intro/conceptos" },
        { title: "📖 Componentes de un sistema de gestión", url: "/markdown/datos/intro/componentes" },
        { title: "📖 Tipos de datos y su clasificación", url: "/markdown/datos/intro/tipos_datos" },
        { title: "📖 Lenguajes de bases de datos", url: "/markdown/datos/intro/lenguajes" },
      ],
    },
    {
      title: "Modelo entidad-relación",
      meta: "X temas",
      lessons: [
        { title: "📖 Entidades, atributos y relaciones", url: "/markdown/datos/er/fundamentos" },
        { title: "📖 El modelo entidad-relación extendido", url: "/markdown/datos/er/extendido" },
        { title: "📖 Simplificación de diagramas", url: "/markdown/datos/er/simplificacion" },
        { title: "📖 Generalización y especialización", url: "/markdown/datos/er/jerarquias" },
        { title: "📖 Relaciones recursivas", url: "/markdown/datos/er/recursivas" },
      ],
    },
    {
      title: "El modelo relacional y las dependencias funcionales",
      meta: "X temas",
      lessons: [
        { title: "📖 Fundamentos del modelo relacional", url: "/markdown/datos/relacional/fundamentos" },
        { title: "📖 Tipos de claves en el modelo relacional", url: "/markdown/datos/relacional/claves" },
        { title: "📖 Dependencias funcionales", url: "/markdown/datos/relacional/dependencias" },
        { title: "📖 Cálculo de clausuras y claves candidatas", url: "/markdown/datos/relacional/clausuras" },
        { title: "📖 Axiomas de Armstrong", url: "/markdown/datos/relacional/armstrong" },
        { title: "📖 Equivalencia entre conjuntos de dependencias", url: "/markdown/datos/relacional/equivalencia" },
        { title: "📖 Cómo obtener la cubierta canónica", url: "/markdown/datos/relacional/canonica" },
        { title: "📖 Anomalías de actualización", url: "/markdown/datos/relacional/anomalias" },
        { title: "📖 De entidad-relación a tablas", url: "/markdown/datos/relacional/mapeo" },
        { title: "📖 Estrategias para diseñar esquemas", url: "/markdown/datos/relacional/estrategias" },
      ],
    },
    {
      title: "Normalización de bases de datos",
      meta: "X temas",
      lessons: [
        { title: "📖 ¿Por qué normalizar?", url: "/markdown/datos/normalizacion/intro" },
        { title: "📖 Primera, segunda y tercera forma normal", url: "/markdown/datos/normalizacion/formas_normales" },
        { title: "📖 Atomicidad y la primera forma normal", url: "/markdown/datos/normalizacion/atomicidad" },
        { title: "📖 Redundancia y sus problemas", url: "/markdown/datos/normalizacion/redundancia" },
        { title: "📖 Preservar dependencias en la descomposición", url: "/markdown/datos/normalizacion/preservar" },
        { title: "📖 Unión sin pérdida de información", url: "/markdown/datos/normalizacion/perdida" },
        { title: "📖 Identificar la forma normal más alta", url: "/markdown/datos/normalizacion/identificar" },
        { title: "📖 Cuarta y quinta forma normal", url: "/markdown/datos/normalizacion/4nf_5nf" },
        { title: "📖 Forma normal dominio-clave", url: "/markdown/datos/normalizacion/dk" },
        { title: "📖 Cuándo desnormalizar", url: "/markdown/datos/normalizacion/desnormalizar" },
        { title: "📖 Replicación de datos", url: "/markdown/datos/normalizacion/replicacion" },
      ],
    },
    {
      title: "Álgebra y cálculo relacional",
      meta: "X temas",
      lessons: [
        { title: "📖 Operaciones básicas del álgebra relacional", url: "/markdown/datos/algebra/basicas" },
        { title: "📖 Operaciones extendidas", url: "/markdown/datos/algebra/extendidas" },
        { title: "📖 Tipos de join y sus diferencias", url: "/markdown/datos/algebra/joins" },
        { title: "📖 Join frente a subconsultas", url: "/markdown/datos/algebra/subconsultas" },
        { title: "📖 Cálculo relacional de tuplas", url: "/markdown/datos/algebra/calculo" },
        { title: "📖 Orientado a filas vs. orientado a columnas", url: "/markdown/datos/algebra/almacenamiento" },
      ],
    },
    {
      title: "Transacciones y control de concurrencia",
      meta: "X temas",
      lessons: [
        { title: "📖 Conceptos de transacción", url: "/markdown/datos/transacciones/conceptos" },
        { title: "📖 Propiedades ACID", url: "/markdown/datos/transacciones/acid" },
        { title: "📖 Control mediante bloqueos", url: "/markdown/datos/transacciones/bloqueos" },
        { title: "📖 Protocolos basados en grafos", url: "/markdown/datos/transacciones/grafos" },
        { title: "📖 Granularidad de los bloqueos", url: "/markdown/datos/transacciones/granularidad" },
        { title: "📖 Ordenamiento por marcas de tiempo", url: "/markdown/datos/transacciones/timestamp" },
        { title: "📖 La regla de escritura de Thomas", url: "/markdown/datos/transacciones/thomas" },
        { title: "📖 Detección y prevención de interbloqueos", url: "/markdown/datos/transacciones/deadlocks" },
        { title: "📖 Recuperación mediante logs", url: "/markdown/datos/transacciones/logs" },
        { title: "📖 Procesamiento analítico en línea (OLAP)", url: "/markdown/datos/transacciones/olap" },
      ],
    },
    {
      title: "Organización de archivos e indexación",
      meta: "X temas",
      lessons: [
        { title: "📖 Estructuras de almacenamiento", url: "/markdown/datos/archivos/estructuras" },
        { title: "📖 Conceptos de indexación", url: "/markdown/datos/archivos/indexacion" },
        { title: "📖 Índices agrupados y no agrupados", url: "/markdown/datos/archivos/agrupados" },
        { title: "📖 Árboles B", url: "/markdown/datos/archivos/arbol_b" },
        { title: "📖 Árboles B+", url: "/markdown/datos/archivos/arbol_bplus" },
        { title: "📖 Índices de mapa de bits", url: "/markdown/datos/archivos/bitmap" },
        { title: "📖 Índices invertidos", url: "/markdown/datos/archivos/invertidos" },
        { title: "📖 Ejercicios prácticos con árboles", url: "/markdown/datos/archivos/practica" },
      ],
    },
    {
      title: "Temas avanzados de bases de datos",
      meta: "X temas",
      lessons: [
        { title: "📖 Niveles de RAID", url: "/markdown/datos/avanzado/raid" },
        { title: "📖 Bases de datos distribuidas", url: "/markdown/datos/avanzado/distribuidas" },
        { title: "📖 Cómo optimizar consultas", url: "/markdown/datos/avanzado/optimizar" },
        { title: "📖 Comparativa: relacional frente a HBase", url: "/markdown/datos/avanzado/comparativa" },
        { title: "📖 Seguridad en el acceso a datos", url: "/markdown/datos/avanzado/seguridad" },
        { title: "📖 Bases de datos en dispositivos móviles", url: "/markdown/datos/avanzado/moviles" },
        { title: "📖 Sistemas de información geográfica", url: "/markdown/datos/avanzado/gis" },
        { title: "📖 Recuperación de información en la web", url: "/markdown/datos/avanzado/recuperacion" },
      ],
    },
    {
      title: "PostgreSQL en profundidad",
      meta: "X temas",
      lessons: [
        { title: "📖 Introducción a PostgreSQL", url: "/markdown/datos/postgresql/intro" },
        { title: "📖 Instalación y configuración inicial", url: "/markdown/datos/postgresql/instalacion" },
        { title: "📖 Cómo funciona internamente", url: "/markdown/datos/postgresql/arquitectura" },
        { title: "📖 SQL con PostgreSQL", url: "/markdown/datos/postgresql/sql" },
        { title: "📖 Estrategias de indexación", url: "/markdown/datos/postgresql/indexacion" },
        { title: "📖 Análisis y mejora de consultas", url: "/markdown/datos/postgresql/optimizacion" },
        { title: "📖 Tareas administrativas comunes", url: "/markdown/datos/postgresql/admin" },
        { title: "📖 Extensiones útiles", url: "/markdown/datos/postgresql/extensiones" },
        { title: "📖 Consideraciones para entornos reales", url: "/markdown/datos/postgresql/produccion" },
      ],
    },
    {
      title: "Supabase: backend como servicio",
      meta: "X temas",
      lessons: [
        { title: "📖 Qué es Supabase", url: "/markdown/datos/supabase/intro" },
        { title: "📖 Componentes de la plataforma", url: "/markdown/datos/supabase/arquitectura" },
        { title: "📖 La base de datos en Supabase", url: "/markdown/datos/supabase/base_datos" },
        { title: "📖 Gestión de usuarios y permisos", url: "/markdown/datos/supabase/auth" },
        { title: "📖 API REST automática", url: "/markdown/datos/supabase/api" },
        { title: "📖 Sincronización en tiempo real", url: "/markdown/datos/supabase/realtime" },
        { title: "📖 Almacenamiento de archivos", url: "/markdown/datos/supabase/storage" },
        { title: "📖 Funciones en el borde (edge)", url: "/markdown/datos/supabase/edge" },
        { title: "📖 Despliegue en producción", url: "/markdown/datos/supabase/produccion" },
      ],
    },
  ],

  // #### Bases de datos no relacionales ####
  bd_nosql: [
    {
      title: "Introducción a las bases de datos no relacionales",
      meta: "X temas",
      lessons: [
        { title: "📖 Conceptos de NoSQL", url: "/markdown/datos/nosql/conceptos" },
        { title: "📖 Origen y evolución", url: "/markdown/datos/nosql/origen" },
        { title: "📖 Comparativa con el modelo relacional", url: "/markdown/datos/nosql/comparativa" },
        { title: "📖 Ventajas e inconvenientes", url: "/markdown/datos/nosql/ventajas" },
        { title: "📖 El teorema CAP", url: "/markdown/datos/nosql/cap" },
      ],
    },
    {
      title: "Tipos de sistemas NoSQL",
      meta: "X temas",
      lessons: [
        { title: "📖 Bases de datos documentales", url: "/markdown/datos/nosql/documentales" },
        { title: "📖 Almacenes clave-valor", url: "/markdown/datos/nosql/clave_valor" },
        { title: "📖 Familias de columnas", url: "/markdown/datos/nosql/columnas" },
        { title: "📖 Bases de datos de grafos", url: "/markdown/datos/nosql/grafos" },
      ],
    },
    {
      title: "Arquitectura de sistemas distribuidos",
      meta: "X temas",
      lessons: [
        { title: "📖 Fragmentación horizontal", url: "/markdown/datos/nosql/sharding" },
        { title: "📖 Estrategias de replicación", url: "/markdown/datos/nosql/replicacion" },
        { title: "📖 Consistencia eventual", url: "/markdown/datos/nosql/eventual" },
        { title: "📖 Niveles de consistencia", url: "/markdown/datos/nosql/consistencia" },
        { title: "📖 Almacenamiento distribuido", url: "/markdown/datos/nosql/distribuido" },
        { title: "📖 Tolerancia a fallos", url: "/markdown/datos/nosql/fallos" },
      ],
    },
    {
      title: "Modelado de datos para NoSQL",
      meta: "X temas",
      lessons: [
        { title: "📖 Diferencias con el modelo relacional", url: "/markdown/datos/nosql/diferencias" },
        { title: "📖 Diseño orientado a consultas", url: "/markdown/datos/nosql/consultas" },
        { title: "📖 Desnormalización deliberada", url: "/markdown/datos/nosql/desnormalizar" },
        { title: "📖 Embebido frente a referenciado", url: "/markdown/datos/nosql/embebido" },
        { title: "📖 Diseño de claves", url: "/markdown/datos/nosql/claves" },
        { title: "📖 Diseño de familias de columnas", url: "/markdown/datos/nosql/familias" },
      ],
    },
    {
      title: "MongoDB: la base de datos documental",
      meta: "X temas",
      lessons: [
        { title: "📖 Introducción a MongoDB", url: "/markdown/datos/mongodb/intro" },
        { title: "📖 Instalación y primeros pasos", url: "/markdown/datos/mongodb/instalacion" },
        { title: "📖 Arquitectura interna", url: "/markdown/datos/mongodb/arquitectura" },
        { title: "📖 Operaciones CRUD", url: "/markdown/datos/mongodb/crud" },
        { title: "📖 Creación y uso de índices", url: "/markdown/datos/mongodb/indexacion" },
        { title: "📖 Framework de agregación", url: "/markdown/datos/mongodb/agregacion" },
        { title: "📖 Seguridad y mantenimiento", url: "/markdown/datos/mongodb/seguridad" },
        { title: "📖 Uso en entornos de producción", url: "/markdown/datos/mongodb/produccion" },
      ],
    },
  ],

  // #### APIs y comunicación entre sistemas ####
  apis: [
    {
      title: "Fundamentos de las interfaces de programación",
      meta: "X temas",
      lessons: [
        { title: "📖 ¿Qué es una API?", url: "/markdown/datos/apis/intro" },
      ],
    },
    {
      title: "El protocolo HTTP",
      meta: "X temas",
      lessons: [
        { title: "📖 Métodos de petición", url: "/markdown/datos/apis/metodos" },
        { title: "📖 Códigos de estado", url: "/markdown/datos/apis/codigos" },
        { title: "📖 Cabeceras HTTP", url: "/markdown/datos/apis/cabeceras" },
        { title: "📖 Cuerpo de los mensajes", url: "/markdown/datos/apis/cuerpo" },
        { title: "📖 Diseño de endpoints", url: "/markdown/datos/apis/endpoints" },
      ],
    },
    {
      title: "Arquitecturas de APIs",
      meta: "X temas",
      lessons: [
        { title: "📖 REST", url: "/markdown/datos/apis/rest" },
        { title: "📖 GraphQL", url: "/markdown/datos/apis/graphql" },
        { title: "📖 gRPC", url: "/markdown/datos/apis/grpc" },
      ],
    },
    {
      title: "Formatos de intercambio",
      meta: "X temas",
      lessons: [
        { title: "📖 JSON", url: "/markdown/datos/apis/json" },
        { title: "📖 XML", url: "/markdown/datos/apis/xml" },
        { title: "📖 Protocol Buffers", url: "/markdown/datos/apis/protobuf" },
      ],
    },
    {
      title: "Seguridad en APIs",
      meta: "X temas",
      lessons: [
        { title: "📖 Mecanismos de autenticación", url: "/markdown/datos/apis/autenticacion" },
        { title: "📖 Control de acceso", url: "/markdown/datos/apis/autorizacion" },
      ],
    },
  ],

  // #### Análisis de datos ####
  analisis: [
    // Pendiente de definir temas
  ],
};