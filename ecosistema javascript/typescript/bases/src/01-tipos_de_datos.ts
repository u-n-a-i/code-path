// Tipos de datos
// let book: string = "El cuarto mono";
// No es necesario poner :string, :number...
let book = "El cuarto mono";
let pag = 321;
let available = true;

console.log(book);

// Tipo Any (Evitar usar)
let data: any = 9;
data = "Hola";
data = true;

console.log(data);

// Combinar datos (Union)
let ticket: number | string = 74970;
ticket = "xwr";
// ticket = false; -> Error

// Tipo de dato personal
type id = number | boolean;

let userId: id = 77;
let validId = false;
// let srtId: id = "Hola"; -> Error

// Tipo literal
type stateLoading = "loading";
let loading: stateLoading = "loading";

console.log(loading);

// Intersecciones
type book = {
  title: string;
  page: number;
  pdf: boolean;
};

type comic = {
  title: string;
  page: number;
  color: true;
};

type read = book & comic;

let serial: read = {
  title: "Serial",
  page: 221,
  color: true,
  pdf: false,
};

console.log(serial);

// Never
type numeroCadena = number & string;
// let x: numeroCadena = "Tipo never"; -> Error se puede declarar pero no asignarle un valor.
