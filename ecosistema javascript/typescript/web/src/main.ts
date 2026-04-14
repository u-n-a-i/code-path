// DOM

const encabezado = document.querySelector("h1"); // sabe el tipo HTMLHeadingElement | null
console.log(encabezado?.textContent); // Puede devolver HTMLHeadingElement | null

const encabezadoClase = document.querySelector(".title") as HTMLHeadingElement; // no sabe el tipo (Element | null) se hace un casting con as
console.log(encabezadoClase.textContent);

const username = document.querySelector("#username") as HTMLInputElement; // Pasa lo mismo con clases que con id
console.log(username.placeholder); // Si no se hace el casting no reconoce la propiedad placeholder

// Eventos
const btn = document.querySelector(".btn") as HTMLButtonElement;
const listaCompra = document.querySelector(".compra") as HTMLUListElement;
const compraArray: string[] = ["Manzanas", "Cereales", "Leche"];
let estaVisible = false;

btn.addEventListener("click", () => {
  if (!estaVisible) {
    compraArray.forEach((c) => {
      const li = document.createElement("li");
      li.textContent = c;
      listaCompra.append(li);
    });
    estaVisible = true;
  }
});
