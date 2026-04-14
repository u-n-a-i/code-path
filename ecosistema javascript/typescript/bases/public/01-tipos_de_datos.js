"use strict";
// Tipos de datos
// let book: string = "El cuarto mono";
// No es necesario poner :string, :number...
let book = "El cuarto mono";
let pag = 321;
let available = true;
console.log(book);
// Tipo Any (Evitar usar)
let data = 9;
data = "Hola";
data = true;
console.log(data);
// Combinar datos (Union)
let ticket = 74970;
ticket = "xwr";
let userId = 77;
let validId = false;
let loading = "loading";
console.log(loading);
let serial = {
    title: "Serial",
    page: 221,
    color: true,
    pdf: false,
};
console.log(serial);
// let x: numeroCadena = "Tipo never"; -> Error se puede declarar pero no asignarle un valor.
