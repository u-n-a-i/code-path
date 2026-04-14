console.log(
  "--- DOM: CSS (Clases, Estilos en Línea, Animaciones/Transiciones) ---"
);

const cajaEstilos = document.getElementById("cajaEstilos");

// --- 1. Manejo de Clases CSS (`classList`) ---
// `classList` es la forma preferida y moderna de manipular clases.
function toggleClaseResaltado() {
  cajaEstilos.classList.toggle("resaltado"); // Añade si no está, quita si está
  console.log(
    "Clase 'resaltado' toggled. Clases actuales:",
    cajaEstilos.classList
  );
}

function toggleClaseRedondo() {
  cajaEstilos.classList.toggle("redondo"); // Añade si no está, quita si está
  console.log(
    "Clase 'redondo' toggled. Clases actuales:",
    cajaEstilos.classList
  );
}

// Otros métodos de classList:
// cajaEstilos.classList.add('nueva-clase');
// cajaEstilos.classList.remove('otra-clase');
// cajaEstilos.classList.contains('alguna-clase'); // true/false

// --- 2. Manejo de Estilos en Línea (`style`) ---
// Modifica directamente la propiedad `style` del elemento.
// Las propiedades CSS con guiones (ej. `background-color`) se convierten a camelCase (ej. `backgroundColor`).
function cambiarEstiloEnLinea() {
  if (cajaEstilos.style.backgroundColor === "lightcoral") {
    cajaEstilos.style.backgroundColor = "lightblue";
    cajaEstilos.style.width = "150px";
    cajaEstilos.style.height = "150px";
    cajaEstilos.style.border = "2px solid steelblue";
    console.log("Estilos en línea revertidos.");
  } else {
    cajaEstilos.style.backgroundColor = "lightcoral";
    cajaEstilos.style.width = "200px";
    cajaEstilos.style.height = "200px";
    cajaEstilos.style.border = "4px dashed darkred";
    console.log("Estilos en línea cambiados.");
  }
}

// --- 3. Manejo de Animaciones y Transiciones (a través de clases) ---
// La mejor práctica es definir animaciones/transiciones en CSS
// y usar JavaScript para añadir/quitar las clases que las activan.
function toggleAnimacion() {
  cajaEstilos.classList.toggle("rotar-animacion");
  if (cajaEstilos.classList.contains("rotar-animacion")) {
    console.log("Animación de rotación activada.");
  } else {
    console.log("Animación de rotación desactivada.");
  }
}

// También puedes escuchar eventos de transición/animación:
cajaEstilos.addEventListener("transitionend", () => {
  console.log("Transición de estilo finalizada.");
});

cajaEstilos.addEventListener("animationend", () => {
  // Este evento se dispara al final de cada iteración de una animación `infinite`
  console.log("Una iteración de animación ha terminado.");
});
