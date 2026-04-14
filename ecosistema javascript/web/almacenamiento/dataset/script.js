const outputDiv = document.getElementById("output");
const productCards = document.querySelectorAll(".producto-card");

function showOutput(message) {
  outputDiv.textContent = message;
  console.log(message);
}

productCards.forEach((card) => {
  card.addEventListener("click", function () {
    // --- 1. Acceder a los atributos de datos a través de `dataset` ---
    // `data-id` -> `dataset.id`
    // `data-nombre-producto` -> `dataset.nombreProducto` (camelCase)
    const id = this.dataset.id;
    const nombreProducto = this.dataset.nombreProducto;
    const precio = parseFloat(this.dataset.precio); // Convertir a número
    const disponible = this.dataset.disponible === "true"; // Convertir a booleano
    const categoria = this.dataset.categoria;
    const sku = this.dataset.sku;
    const ofertaEspecial = "ofertaEspecial" in this.dataset; // Para atributos sin valor (booleanos)

    let details = `Detalles del Producto (ID: ${id}):\n`;
    details += `  Nombre: ${nombreProducto}\n`;
    details += `  Precio: ${precio}€\n`;
    details += `  Disponible: ${disponible ? "Sí" : "No"}\n`;
    details += `  Categoría: ${categoria}\n`;
    details += `  SKU: ${sku}\n`;
    details += `  Oferta Especial: ${ofertaEspecial ? "Sí" : "No"}\n`;

    showOutput(details);

    // --- 2. Modificar un atributo de datos ---
    // Por ejemplo, marcar que el producto ha sido clicado
    this.dataset.lastClicked = new Date().toLocaleString();
    console.log(
      `Atributo data-last-clicked añadido: ${this.dataset.lastClicked}`
    );

    // --- 3. Eliminar un atributo de datos ---
    // Por ejemplo, eliminar el SKU si ya no es relevante
    // this.dataset.removeProperty('sku'); // No existe directamente para dataset
    // delete this.dataset.sku; // Esta es la forma correcta de eliminar
    // console.log(`Atributo data-sku eliminado.`);

    // O simplemente usar setAttribute para eliminar
    // this.removeAttribute('data-sku');
  });
});

// Modificar un atributo de datos directamente en el HTML al cargar la página (ejemplo)
document.addEventListener("DOMContentLoaded", () => {
  const firstCard = document.querySelector(".producto-card");
  if (firstCard) {
    firstCard.dataset.color = "blue"; // Añade data-color="blue"
    console.log(
      "data-color añadido al primer producto:",
      firstCard.dataset.color
    );
  }
});
