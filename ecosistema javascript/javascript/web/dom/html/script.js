console.log(
  "--- DOM: HTML (Cambiar Contenido y Atributos, Creación y Eliminación) ---"
);

const miDiv = document.getElementById("miDiv");
const miEnlace = document.getElementById("miEnlace");

// --- 1. Cambiar Contenido HTML ---
function cambiarContenido() {
  // `innerHTML`: Permite cambiar el contenido HTML completo de un elemento.
  // ¡Cuidado! Es vulnerable a ataques XSS si se usa con contenido no confiable.
  miDiv.innerHTML = `
                <h2>Contenido Cambiado Dinámicamente</h2>
                <p>Este es un <strong>nuevo párrafo</strong>.</p>
                <img src="https://picsum.photos/id/237/200/300" alt="Imagen de placeholder">
            `;
  console.log("Contenido de #miDiv cambiado con innerHTML.");

  // `textContent`: Solo cambia el texto plano, ignorando cualquier HTML. Más seguro.
  // miDiv.textContent = "Solo texto plano aquí.";
  // console.log("Contenido de #miDiv cambiado con textContent.");
}

// --- 2. Cambiar Atributos HTML ---
function cambiarAtributos() {
  // `element.attribute = value`: Forma directa para atributos comunes.
  miEnlace.href = "https://developer.mozilla.org";
  miEnlace.textContent = "Visitar MDN Web Docs";
  miEnlace.title = "Documentación de JavaScript en MDN"; // Añade un atributo title

  // `element.setAttribute(name, value)`: General para cualquier atributo.
  miEnlace.setAttribute("data-info", "enlace-modificado");
  // `element.removeAttribute(name)`: Elimina un atributo.
  miEnlace.removeAttribute("target"); // Elimina _blank
  console.log("Atributos de #miEnlace cambiados.");
}

// --- 3. Creación y Adición de Elementos Dinámicamente ---
function crearYAnadirElemento() {
  // a) Crear un nuevo elemento HTML
  const nuevoParrafo = document.createElement("p");

  // b) Añadir contenido al nuevo elemento
  nuevoParrafo.textContent = "Este párrafo fue creado y añadido dinámicamente.";

  // c) Añadir atributos o clases
  nuevoParrafo.id = "parrafo-dinamico";
  nuevoParrafo.className = "nuevo-elemento"; // O nuevoParrafo.classList.add('nuevo-elemento');

  // d) Añadir el nuevo elemento al DOM (como hijo de #miDiv)
  miDiv.appendChild(nuevoParrafo);
  console.log("Nuevo párrafo creado y añadido al #miDiv.");
}

// --- 4. Eliminación de Elementos Dinámicamente ---
function eliminarElemento() {
  const ultimoParrafo = miDiv.querySelector("p:last-of-type"); // Selecciona el último párrafo dentro de miDiv
  if (ultimoParrafo) {
    // Se elimina un nodo hijo de su nodo padre.
    miDiv.removeChild(ultimoParrafo);
    console.log("Último párrafo eliminado de #miDiv.");
  } else {
    console.warn("No hay párrafos para eliminar en #miDiv.");
  }
}
