const usernameInput = document.getElementById("username");
const outputDiv = document.getElementById("output");

// Función para mostrar mensajes en el div de salida
function showOutput(message) {
  outputDiv.textContent = message;
  console.log(message);
}

// --- 1. Guardar un dato simple (cadena de texto) ---
function guardarNombre() {
  const nombre = usernameInput.value;
  if (nombre) {
    localStorage.setItem("nombreUsuario", nombre);
    showOutput(`Nombre '${nombre}' guardado en localStorage.`);
    usernameInput.value = ""; // Limpiar input
  } else {
    showOutput("Por favor, introduce un nombre.");
  }
}

// --- 2. Cargar un dato simple ---
function cargarNombre() {
  const nombreGuardado = localStorage.getItem("nombreUsuario");
  if (nombreGuardado) {
    usernameInput.value = nombreGuardado;
    showOutput(`Nombre '${nombreGuardado}' cargado desde localStorage.`);
  } else {
    showOutput("No hay nombre de usuario guardado.");
  }
}

// --- 3. Guardar un objeto o array (necesita JSON.stringify) ---
function guardarObjeto() {
  const usuario = {
    id: 101,
    nombre: "Alice",
    email: "alice@example.com",
    preferencias: ["oscuro", "notificaciones"],
  };
  // JSON.stringify convierte el objeto JS en una cadena JSON
  localStorage.setItem("configUsuario", JSON.stringify(usuario));
  showOutput("Objeto 'configUsuario' guardado en localStorage.");
}

// --- 4. Cargar un objeto o array (necesita JSON.parse) ---
function cargarObjeto() {
  const configUsuarioJSON = localStorage.getItem("configUsuario");
  if (configUsuarioJSON) {
    // JSON.parse convierte la cadena JSON de vuelta a un objeto JS
    const usuario = JSON.parse(configUsuarioJSON);
    showOutput(
      `Objeto 'configUsuario' cargado: ${JSON.stringify(usuario, null, 2)}`
    );
    console.log("Objeto cargado:", usuario);
  } else {
    showOutput("No hay objeto 'configUsuario' guardado.");
  }
}

// --- 5. Eliminar un elemento específico por clave ---
function eliminarNombre() {
  localStorage.removeItem("nombreUsuario");
  showOutput("Clave 'nombreUsuario' eliminada de localStorage.");
  usernameInput.value = "";
}

// --- 6. Eliminar todos los elementos del localStorage para el origen actual ---
function limpiarTodo() {
  localStorage.clear();
  showOutput("Todo el localStorage ha sido limpiado para este origen.");
  usernameInput.value = "";
}

// Cargar el nombre al iniciar la página para ver si hay algo guardado
document.addEventListener("DOMContentLoaded", cargarNombre);
