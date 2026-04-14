const log = (message) => {
  console.log(message);
  const eventLog = document.getElementById("eventLog");
  const p = document.createElement("p");
  p.textContent = message;
  eventLog.prepend(p); // Añadir al principio del log
  // Limitar el número de entradas para no saturar
  if (eventLog.children.length > 10) {
    eventLog.removeChild(eventLog.lastChild);
  }
};

const miBoton = document.getElementById("miBoton");
const miInput = document.getElementById("miInput");
const miContenedorHijo = document.getElementById("miContenedorHijo");
const miContenedorPadre = document.getElementById("miContenedorPadre");
const miFormulario = document.getElementById("miFormulario");
const feedbackForm = document.getElementById("feedbackForm");
const listaElementos = document.getElementById("listaElementos");
const addListItemButton = document.getElementById("addListItem");
const feedbackDelegacion = document.getElementById("feedbackDelegacion");

log("--- Eventos en JavaScript ---");

// --- 1. Manejar Eventos y Controladores de Eventos ---

// Método 1: Usando `addEventListener()` (Recomendado)
// Permite añadir múltiples controladores al mismo evento y elemento.
miBoton.addEventListener("click", function (e) {
  log(`[Boton]: Clic detectado. Objeto Evento: ${e.type}`);
});

// Podemos añadir otro controlador al mismo botón para el mismo evento
miBoton.addEventListener("click", () => {
  log("[Boton]: ¡Otro controlador para el clic del botón!");
});

// Eventos de teclado en el input
miInput.addEventListener("keydown", (e) => {
  log(`[Input]: Tecla presionada: ${e.key} (Código: ${e.keyCode})`);
});
miInput.addEventListener("keyup", (e) => {
  log(`[Input]: Tecla liberada: ${e.key}`);
});
miInput.addEventListener("change", (e) => {
  log(
    `[Input]: Contenido cambiado y foco perdido. Nuevo valor: ${e.target.value}`
  );
});
miInput.addEventListener("input", (e) => {
  // Se dispara cada vez que el valor del input cambia.
  // log(`[Input]: Contenido escribiéndose... Actual: ${e.target.value}`);
});

// --- 2. Objeto de Eventos (`Event Object`) ---
// El primer argumento de un controlador de eventos es siempre el objeto de evento.
miBoton.addEventListener("mouseover", function (e) {
  log(
    `[Boton]: Ratón sobre el botón. Tipo de evento: ${e.type}, Coordenadas: (${e.clientX}, ${e.clientY})`
  );
  // `e.target`: El elemento que disparó el evento (el botón)
  log(`[Boton]: Target del evento (e.target.id): ${e.target.id}`);
  // `this`: En funciones tradicionales, `this` también se refiere al elemento que escuchó el evento.
  log(`[Boton]: 'this' en el evento (this.id): ${this.id}`);
});

// --- 3. Propagación de Eventos (`Bubbling` y `Capturing`) ---
// Por defecto, los eventos se propagan de dentro hacia afuera (Bubbling).
// Podemos detenerla con `e.stopPropagation()`.
// Podemos cambiar la fase de escucha a "captura" con el tercer argumento de `addEventListener`.

// Fase de Burbujeo (Bubbling - por defecto)
miContenedorPadre.addEventListener("click", (e) => {
  log(`[Padre]: Clic en el Padre. Target: ${e.target.id || e.target.tagName}`);
});

miContenedorHijo.addEventListener("click", (e) => {
  log(`[Hijo]: Clic en el Hijo. Target: ${e.target.id || e.target.tagName}`);
  // Para detener la propagación a los padres:
  // e.stopPropagation();
  // log("[Hijo]: Propagación detenida con e.stopPropagation().");
});

// Fase de Captura (Capturing - el tercer argumento `true`)
miContenedorPadre.addEventListener(
  "click",
  (e) => {
    log(
      `[Padre - Captura]: Clic en el Padre (fase de captura). Target: ${
        e.target.id || e.target.tagName
      }`
    );
  },
  true
); // El 'true' indica fase de captura

miContenedorHijo.addEventListener(
  "click",
  (e) => {
    log(
      `[Hijo - Captura]: Clic en el Hijo (fase de captura). Target: ${
        e.target.id || e.target.tagName
      }`
    );
  },
  true
); // El 'true' indica fase de captura

// --- 4. Propiedad `e.target` ---
// Siempre se refiere al elemento **más profundo** en el DOM que originó el evento.
// Incluso si el controlador está en un padre, `e.target` apunta al elemento clicado.
document.body.addEventListener("click", (e) => {
  // log(`[Body]: Clic en cualquier parte del body. El elemento clicado fue: ${e.target.tagName} (ID: ${e.target.id || 'N/A'})`);
});

// --- 5. Acciones Predeterminadas (`e.preventDefault()`) ---
// Algunos eventos tienen un comportamiento predeterminado del navegador (ej. un enlace navega, un formulario se envía).
// `e.preventDefault()` previene este comportamiento.
miFormulario.addEventListener("submit", (e) => {
  log("[Formulario]: Evento 'submit' detectado.");
  e.preventDefault(); // ¡Esto detiene el envío real del formulario!
  log(
    "[Formulario]: Acción predeterminada (envío) prevenida con `e.preventDefault()`."
  );

  const nombreInput = document.getElementById("nombre");
  if (nombreInput.value.trim() === "") {
    feedbackForm.textContent = "El nombre no puede estar vacío.";
    feedbackForm.style.color = "red";
  } else {
    feedbackForm.textContent = `Formulario simulado enviado con nombre: ${nombreInput.value}`;
    feedbackForm.style.color = "green";
    // Aquí iría tu lógica de envío de datos (ej. fetch API)
  }
});

// --- 6. Debouncing (Técnica de Optimización) ---
// Retrasa la ejecución de una función hasta que ha pasado un cierto tiempo sin que el evento se dispare de nuevo.
// Común para eventos como `resize`, `scroll`, `input`, `mousemove`.
let timeoutId;
miInput.addEventListener("input", (e) => {
  clearTimeout(timeoutId); // Limpia el temporizador anterior
  timeoutId = setTimeout(() => {
    log(`[Debounce]: Input finalizado. Valor: ${e.target.value}`);
  }, 500); // Espera 500ms sin nueva entrada antes de ejecutar
});

// --- 7. Carga de Eventos (cuando el documento está listo) ---
// Asegúrate de que el DOM esté completamente cargado antes de manipularlo.
// `DOMContentLoaded` es preferido sobre `window.onload` porque no espera a las imágenes, etc.
document.addEventListener("DOMContentLoaded", () => {
  log("[DOMContentLoaded]: El DOM está completamente cargado.");
  // Aquí es un buen lugar para iniciar la lógica de tu aplicación
});

window.addEventListener("load", () => {
  log("[Window Load]: Toda la página (incluyendo imágenes, etc.) ha cargado.");
});

// --- 8. Delegación de Eventos ---
// Adjuntar un único controlador de eventos a un elemento padre,
// en lugar de a cada uno de sus hijos. Esto es eficiente, especialmente con listas dinámicas.
listaElementos.addEventListener("click", (e) => {
  // Verificamos si el clic fue en un elemento de lista (`li`)
  if (e.target.tagName === "LI" && e.target.classList.contains("tarjeta")) {
    const itemId = e.target.dataset.id; // Acceder a `data-id`
    feedbackDelegacion.textContent = `Clic en el elemento con ID: ${itemId} y contenido: ${e.target.textContent}`;
    log(`[Delegación]: Clic en tarjeta #${itemId}`);
    e.target.style.backgroundColor = "#dff0d8"; // Cambiar estilo al hacer clic
  }
});

addListItemButton.addEventListener("click", () => {
  const nuevoLi = document.createElement("li");
  const newId = listaElementos.children.length + 1;
  nuevoLi.textContent = `Elemento de lista ${newId} (Nuevo)`;
  nuevoLi.classList.add("tarjeta");
  nuevoLi.dataset.id = newId; // Añadir un atributo de datos
  listaElementos.appendChild(nuevoLi);
  log(
    `[Delegación]: Añadido nuevo elemento: ${newId}. El controlador de eventos del padre lo capturará.`
  );
});
