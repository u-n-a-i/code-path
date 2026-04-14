console.log("--- BOM: Objeto Navigator ---");

// 1. Información General del Navegador
console.log(
  "Nombre del código del navegador (navigator.appCodeName):",
  navigator.appCodeName
); // Siempre "Mozilla" para compatibilidad
console.log("Nombre del navegador (navigator.appName):", navigator.appName); // "Netscape" para navegadores modernos
console.log(
  "Versión del navegador (navigator.appVersion):",
  navigator.appVersion
); // Información detallada de versión
console.log("Agente de usuario (navigator.userAgent):", navigator.userAgent); // Cadena completa del agente de usuario

// 2. Información del Sistema Operativo/Plataforma
console.log("Plataforma (navigator.platform):", navigator.platform); // Ej. "Win32", "MacIntel", "Linux armv7l"
console.log("Sistema operativo (navigator.oscpu):", navigator.oscpu); // Información del SO (puede no estar siempre disponible)

// 3. Información de Idioma
console.log("Idioma del navegador (navigator.language):", navigator.language); // Ej. "es-ES", "en-US"
console.log("Idiomas preferidos (navigator.languages):", navigator.languages); // Array de idiomas preferidos (ES6+)

// 4. Estado Online
function checkOnlineStatus() {
  // true si el navegador está online, false si está offline.
  console.log(
    "¿Está el navegador online (navigator.onLine)?",
    navigator.onLine
  );
}
checkOnlineStatus(); // Comprobar al cargar

// Escuchar cambios en el estado online/offline
window.addEventListener("online", () =>
  console.log("¡El navegador está ahora ONLINE!")
);
window.addEventListener("offline", () =>
  console.log("¡El navegador está ahora OFFLINE!")
);

// 5. Soporte de Cookies
console.log(
  "¿Cookies habilitadas (navigator.cookieEnabled)?",
  navigator.cookieEnabled
);

// 6. Geolocation (Requiere permiso del usuario)
// if (navigator.geolocation) {
//   console.log("Geolocation API soportada.");
//   navigator.geolocation.getCurrentPosition(position => {
//     console.log("Latitud:", position.coords.latitude);
//     console.log("Longitud:", position.coords.longitude);
//   }, error => {
//     console.error("Error de Geolocation:", error.message);
//   });
// } else {
//   console.log("Geolocation API no soportada en este navegador.");
// }

// 7. Clipboard API (Requiere permiso del usuario)
// if (navigator.clipboard) {
//   console.log("Clipboard API soportada.");
//   // Ejemplo: copiar texto al portapapeles
//   // navigator.clipboard.writeText("Texto para copiar").then(() => {
//   //   console.log("Texto copiado al portapapeles.");
//   // }).catch(err => {
//   //   console.error("Error al copiar texto:", err);
//   // });
// } else {
//   console.log("Clipboard API no soportada en este navegador.");
// }

// 8. User Media (Acceso a cámara/micrófono - Requiere permiso)
// if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//   console.log("getUserMedia API soportada.");
// } else {
//   console.log("getUserMedia API no soportada en este navegador.");
// }

// 9. Otras propiedades y métodos útiles (algunos más modernos):
// navigator.hardwareConcurrency (número de núcleos lógicos del CPU)
// navigator.connection (información de red)
// navigator.vibrate()
// navigator.share() (Web Share API)
// navigator.bluetooth (Web Bluetooth API)
