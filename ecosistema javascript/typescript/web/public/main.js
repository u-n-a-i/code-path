"use strict";
// DOM
const encabezado = document.querySelector("h1"); // sabe el tipo HTMLHeadingElement | null
console.log(encabezado === null || encabezado === void 0 ? void 0 : encabezado.textContent); // Puede devolver HTMLHeadingElement | null
const encabezadoClase = document.querySelector(".title"); // no sabe el tipo (Element | null) se hace un casting con as
console.log(encabezadoClase.textContent);
const username = document.querySelector("#username"); // Pasa lo mismo con clases que con id
console.log(username.placeholder); // Si no se hace el casting no reconoce la propiedad placeholder
// Eventos
const btn = document.querySelector(".btn");
const listaCompra = document.querySelector(".compra");
const compraArray = ["Manzanas", "Cereales", "Leche"];
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
