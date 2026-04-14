console.log("--- BOM: Objeto Location ---");

// 1. Propiedades de Location
function mostrarUrlCompleta() {
  console.log("URL Completa (location.href):", location.href);
}

function mostrarPartesUrl() {
  console.log("Protocolo (location.protocol):", location.protocol); // Ej. "http:", "https:"
  console.log("Hostname (location.hostname):", location.hostname); // Ej. "www.example.com"
  console.log("Puerto (location.port):", location.port); // Ej. "8080" (si está especificado)
  console.log("Path (location.pathname):", location.pathname); // Ej. "/ejemplo/pagina.html"
  console.log("Query String (location.search):", location.search); // Ej. "?param=valor"
  console.log("Hash (location.hash):", location.hash); // Ej. "#seccion"
  console.log("Origen (location.origin):", location.origin); // Ej. "http://www.example.com:8080"
}

// 2. Métodos de Location
function recargarPagina() {
  console.log("Recargando la página...");
  location.reload(); // Recarga la página actual
  // location.reload(true); // Fuerza recarga desde el servidor (obsoleto, no usar)
}

function irANuevaPagina() {
  console.log("Redirigiendo a Google...");
  location.href = "https://www.google.com"; // Navega a una nueva URL
  // location.assign("https://www.google.com"); // Similar a href, añade a history
  // location.replace("https://www.google.com"); // Reemplaza la entrada actual en history
}

function establecerHash() {
  console.log("Estableciendo un hash en la URL...");
  location.hash = "#seccion-info"; // Cambia el hash de la URL, no recarga la página
  console.log("Nuevo hash:", location.hash);
  // Puedes usar este hash para navegar a una sección específica de la página
  // o para manejar rutas en aplicaciones de una sola página (SPA)
}

// Puedes acceder directamente a la URL actual al cargar la página
mostrarUrlCompleta(); // Se ejecuta al cargar el script
