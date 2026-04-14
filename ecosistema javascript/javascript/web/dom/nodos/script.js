console.log("--- DOM: Nodos (Recorrer, Modificar, Relación) ---");

// --- 1. Acceder a Nodos ---
const contenedor = document.getElementById("miContenedor");
console.log("\n1. Acceder a Nodos:");
console.log("Nodo contenedor:", contenedor);

// --- 2. Recorrer Nodos y Relaciones ---
console.log("\n2. Recorrer Nodos y Relaciones:");

// a) Hijos (Children)
// `childNodes` incluye nodos de texto y comentarios, además de elementos.
console.log("  Hijos de miContenedor (childNodes):", contenedor.childNodes);
// `children` solo incluye nodos de elementos.
console.log(
  "  Elementos hijos de miContenedor (children):",
  contenedor.children
);

const lista = document.getElementById("miLista");
console.log("  Primer hijo de la lista (firstChild):", lista.firstChild); // Probablemente un nodo de texto (salto de línea)
console.log(
  "  Primer elemento hijo de la lista (firstElementChild):",
  lista.firstElementChild
); // El <li> "Elemento 1"
console.log("  Último hijo de la lista (lastChild):", lista.lastChild); // Probablemente un nodo de texto
console.log(
  "  Último elemento hijo de la lista (lastElementChild):",
  lista.lastElementChild
); // El <li> "Elemento 3"

// b) Padre (Parent)
const elemento2 = document.querySelector("#miLista .item:nth-child(2)");
console.log("  Nodo padre de 'Elemento 2' (parentNode):", elemento2.parentNode); // El <ul> miLista

// c) Hermanos (Siblings)
console.log(
  "  Hermano anterior de 'Elemento 2' (previousSibling):",
  elemento2.previousSibling
); // Nodo de texto (salto de línea)
console.log(
  "  Elemento hermano anterior de 'Elemento 2' (previousElementSibling):",
  elemento2.previousElementSibling
); // El <li> "Elemento 1"
console.log(
  "  Hermano siguiente de 'Elemento 2' (nextSibling):",
  elemento2.nextSibling
); // Nodo de texto
console.log(
  "  Elemento hermano siguiente de 'Elemento 2' (nextElementSibling):",
  elemento2.nextElementSibling
); // El <li> "Elemento 3"

// --- 3. Tipos de Nodos ---
// nodeType: 1 (ELEMENT_NODE), 3 (TEXT_NODE), 8 (COMMENT_NODE), 9 (DOCUMENT_NODE)
console.log("\n3. Tipos de Nodos:");
console.log(
  "  Tipo de nodo de miContenedor:",
  contenedor.nodeType,
  "(ELEMENT_NODE)"
);
console.log(
  "  Tipo de nodo del primer hijo de la lista (texto):",
  lista.firstChild.nodeType,
  "(TEXT_NODE)"
);
console.log(
  "  Tipo de nodo del comentario:",
  contenedor.childNodes[5].nodeType,
  "(COMMENT_NODE)"
); // Ajusta el índice si hay cambios

// --- 4. Modificar Nodos (contenido y estructura) ---
console.log("\n4. Modificar Nodos:");

// a) Modificar contenido de texto (solo nodos de texto o innerText/textContent)
if (lista.firstElementChild) {
  lista.firstElementChild.textContent = "¡Primer Elemento Actualizado!";
  console.log("  Contenido del primer elemento de la lista modificado.");
}

// b) Añadir un nuevo hijo
const nuevoLi = document.createElement("li");
nuevoLi.textContent = "Elemento 4 (Añadido)";
nuevoLi.classList.add("item"); // Añadir clase CSS
lista.appendChild(nuevoLi); // Añade al final de la lista
console.log("  Nuevo elemento añadido a la lista.");

// c) Insertar antes de un hermano existente
const nuevoLiAntes = document.createElement("li");
nuevoLiAntes.textContent = "Elemento 0 (Insertado)";
nuevoLiAntes.classList.add("item");
lista.insertBefore(nuevoLiAntes, lista.firstElementChild); // Inserta antes del primer elemento
console.log("  Elemento insertado al principio de la lista.");

// d) Reemplazar un hijo
const reemplazoLi = document.createElement("li");
reemplazoLi.textContent = "Elemento Reemplazado";
reemplazoLi.classList.add("item");
lista.replaceChild(reemplazoLi, elemento2); // Reemplaza "Elemento 2"
console.log("  'Elemento 2' ha sido reemplazado.");

// e) Eliminar un hijo
const elementoAEliminar = lista.lastElementChild; // El último elemento que añadimos
if (elementoAEliminar) {
  lista.removeChild(elementoAEliminar);
  console.log(
    "  El último elemento ('Elemento 4 (Añadido)') ha sido eliminado."
  );
}
