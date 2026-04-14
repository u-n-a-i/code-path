console.log("--- BOM: Objeto Window ---");

// 1. Acceso al objeto window
console.log("window === this:", window === this); // true en el ámbito global

// 2. Propiedades comunes de Window
console.log("Ancho de la ventana (innerWidth):", window.innerWidth, "px");
console.log("Alto de la ventana (innerHeight):", window.innerHeight, "px");
console.log("Nombre de la ventana (name):", window.name);
window.name = "MiVentanaPrincipal";
console.log("Nuevo nombre de la ventana (name):", window.name);

// 3. Métodos comunes de Window
function mostrarAlert() {
  window.alert("¡Hola desde una alerta de Window!");
}

function abrirVentana() {
  // Abre una nueva ventana/pestaña
  // window.open(URL, windowName, windowFeatures);
  const nuevaVentana = window.open(
    "https://www.google.com",
    "_blank",
    "width=800,height=600"
  );
  if (nuevaVentana) {
    console.log("Nueva ventana abierta con éxito.");
    // Puedes interactuar con la nueva ventana si no es de otro origen (Same-Origin Policy)
    // nuevaVentana.focus();
  } else {
    console.warn("La ventana emergente fue bloqueada por el navegador.");
  }
}

let ventanaEmergente = null;
function cerrarVentana() {
  // window.close() solo puede cerrar ventanas que fueron abiertas por script.
  // Si la ventana no fue abierta por script, esto no funcionará.
  if (window.opener) {
    // Comprueba si fue abierta por otra ventana
    window.close();
    console.log("Intentando cerrar esta ventana...");
  } else {
    console.warn(
      "No se puede cerrar esta ventana programáticamente a menos que haya sido abierta por un script."
    );
  }
}

function redimensionarVentana() {
  // Redimensiona la ventana. Puede tener restricciones del navegador.
  window.resizeTo(600, 400); // ancho, alto
  console.log("Intentando redimensionar la ventana a 600x400px.");
}

function desplazarVentana() {
  // Desplaza la ventana a una posición absoluta
  window.scrollTo(0, 0); // x, y (superior izquierda)
  console.log("Desplazando la ventana a la parte superior izquierda.");
}

function establecerTimeout() {
  // Ejecuta una función después de un retraso (asíncrono)
  window.setTimeout(() => {
    console.log("Mensaje después de 3 segundos (desde setTimeout).");
  }, 3000);
  console.log("Temporizador de 3 segundos establecido.");
}

// Otros ejemplos comunes:
// window.location (ver objeto Location)
// window.history (ver objeto History)
// window.navigator (ver objeto Navigator)
// window.document (el objeto DOM)
// window.alert(), window.confirm(), window.prompt()
