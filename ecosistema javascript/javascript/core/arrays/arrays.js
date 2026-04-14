console.log("--- Arrays en JavaScript ---");

// --- 1. Creación de Arrays ---
// La forma más común es usar literales de array `[]`. También puedes usar el constructor `Array()`.

console.log("\n--- Creación de Arrays ---");

const miArrayVacio = [];
const frutas = ["Manzana", "Plátano", "Cereza", "Naranja"]; // Array de strings
const numeros = [1, 5, 10, 15, 20]; // Array de números
const mix = [1, "Hola", true, { nombre: "Ana" }, [1, 2]]; // Arrays pueden contener diferentes tipos de datos

console.log("Array de frutas:", frutas);
console.log("Longitud del array de frutas:", frutas.length); // La propiedad `length`

// Usando el constructor Array (menos común, especialmente para arrays conocidos)
const otroArray = new Array("Rojo", "Verde", "Azul");
console.log("Otro array (constructor):", otroArray);

// Array con longitud predefinida (elementos inicializados como `empty` o `undefined`)
const arrayConLongitud = new Array(3); // Crea un array con 3 ranuras vacías
console.log("Array con longitud 3:", arrayConLongitud); // Salida: [empty × 3]

// --- 2. Métodos de Acceso (No modifican el array original) ---
// Te permiten obtener elementos o subconjuntos del array.

console.log("\n--- Métodos de Acceso (No Modificadores) ---");
const animales = ["Perro", "Gato", "Pájaro", "Conejo", "Perro"];

// `at(indice)`: Accede a un elemento por índice, soporta índices negativos (ES2022+)
console.log("Elemento en índice 1 (.at(1)):", animales.at(1)); // Salida: Gato
console.log("Elemento último (.at(-1)):", animales.at(-1)); // Salida: Perro

// `concat()`: Combina dos o más arrays, o añade elementos, y devuelve un nuevo array.
const masAnimales = ["Caballo", "Vaca"];
const todosAnimales = animales.concat(masAnimales, ["Ratón"]);
console.log("Arrays concatenados (.concat()):", todosAnimales); // Salida: ["Perro", "Gato", "Pájaro", "Conejo", "Perro", "Caballo", "Vaca", "Ratón"]
console.log("Original `animales` no modificado:", animales); // Salida: ["Perro", "Gato", "Pájaro", "Conejo", "Perro"]

// `slice(inicio, fin)`: Extrae una parte del array y devuelve un nuevo array.
// El `fin` es exclusivo. Admite índices negativos.
console.log("Slice del índice 1 al 4 (.slice(1, 4)):", animales.slice(1, 4)); // Salida: ["Gato", "Pájaro", "Conejo"]
console.log("Slice desde índice 2 (.slice(2)):", animales.slice(2)); // Salida: ["Pájaro", "Conejo", "Perro"]
console.log("Slice de los últimos 2 (.slice(-2)):", animales.slice(-2)); // Salida: ["Conejo", "Perro"]

// --- 3. Métodos Modificadores (Cambian el array original) ---
// Estos métodos alteran el array sobre el que se llaman.

console.log("\n--- Métodos Modificadores ---");
const coches = ["Ford", "BMW", "Audi"];

// `push()`: Añade uno o más elementos al final del array y devuelve la nueva longitud.
coches.push("Mercedes");
console.log("Después de push('Mercedes'):", coches); // Salida: ["Ford", "BMW", "Audi", "Mercedes"]

// `pop()`: Elimina el último elemento del array y lo devuelve.
const ultimoCoche = coches.pop();
console.log("Después de pop():", coches, "Elemento eliminado:", ultimoCoche); // Salida: ["Ford", "BMW", "Audi"], "Mercedes"

// `shift()`: Elimina el primer elemento del array y lo devuelve.
const primerCoche = coches.shift();
console.log("Después de shift():", coches, "Elemento eliminado:", primerCoche); // Salida: ["BMW", "Audi"], "Ford"

// `unshift()`: Añade uno o más elementos al principio del array y devuelve la nueva longitud.
coches.unshift("Nissan", "Toyota");
console.log("Después de unshift():", coches); // Salida: ["Nissan", "Toyota", "BMW", "Audi"]

// `splice(inicio, cantidadEliminar, elemento1, ...)`: Un método muy potente.
// Elimina/reemplaza elementos existentes y/o añade nuevos.
// `splice(2, 1, "Honda")`: En el índice 2, elimina 1 elemento y añade "Honda".
coches.splice(2, 1, "Honda");
console.log("Después de splice(2, 1, 'Honda'):", coches); // Salida: ["Nissan", "Toyota", "Honda", "Audi"]

// `splice(1, 0, "Volvo")`: En el índice 1, elimina 0 elementos y añade "Volvo".
coches.splice(1, 0, "Volvo");
console.log("Después de splice(1, 0, 'Volvo'):", coches); // Salida: ["Nissan", "Volvo", "Toyota", "Honda", "Audi"]

// `reverse()`: Invierte el orden de los elementos en el array (modifica el original).
coches.reverse();
console.log("Después de reverse():", coches); // Salida: ["Audi", "Honda", "Toyota", "Volvo", "Nissan"]

// `sort()`: Ordena los elementos del array (modifica el original). Por defecto, ordena como strings.
const desordenados = [3, 1, 10, 5, 2];
desordenados.sort(); // Ordena lexicográficamente: [1, 10, 2, 3, 5]
console.log("Números desordenados (sort por defecto):", desordenados);

// Para ordenar números correctamente, se necesita una función de comparación.
desordenados.sort((a, b) => a - b); // Orden ascendente
console.log("Números ordenados (sort con función):", desordenados); // Salida: [1, 2, 3, 5, 10]

// --- 4. Métodos Iteradores (Recorren el array, a menudo con callbacks) ---
// Estos métodos no modifican el array original (a menos que el callback lo haga explícitamente).

console.log("\n--- Métodos Iteradores ---");
const productos = [
  { id: 1, nombre: "Laptop", precio: 1200 },
  { id: 2, nombre: "Mouse", precio: 25 },
  { id: 3, nombre: "Teclado", precio: 75 },
];

// `forEach()`: Ejecuta una función para cada elemento. No devuelve un nuevo array.
console.log("`forEach()`:");
productos.forEach((producto) => {
  console.log(`  Producto: ${producto.nombre}, Precio: ${producto.precio}`);
});

// `map()`: Crea un NUEVO array aplicando una función a cada elemento del original.
const nombresProductos = productos.map((producto) =>
  producto.nombre.toUpperCase()
);
console.log("Nombres de productos en mayúsculas (.map()):", nombresProductos); // Salida: ["LAPTOP", "MOUSE", "TECLADO"]

// `filter()`: Crea un NUEVO array con todos los elementos que pasen una prueba.
const productosCaros = productos.filter((producto) => producto.precio > 50);
console.log("Productos caros (.filter()):", productosCaros); // Salida: [{id:1, nombre:"Laptop", precio:1200}, {id:3, nombre:"Teclado", precio:75}]

// `reduce()`: Ejecuta una función reductora en cada elemento, resultando en un único valor.
const precioTotal = productos.reduce(
  (acumulador, producto) => acumulador + producto.precio,
  0
); // 0 es el valor inicial
console.log("Precio total de productos (.reduce()):", precioTotal); // Salida: 1300 (1200 + 25 + 75)

// `some()`: Comprueba si AL MENOS UN elemento del array satisface una condición. Devuelve un booleano.
const hayProductosBaratos = productos.some((producto) => producto.precio < 30);
console.log("¿Hay productos baratos? (.some()):", hayProductosBaratos); // Salida: true

// `every()`: Comprueba si TODOS los elementos del array satisfacen una condición. Devuelve un booleano.
const todosSonCaros = productos.every((producto) => producto.precio > 20);
console.log("¿Todos los productos son caros? (.every()):", todosSonCaros); // Salida: true

// --- 5. Métodos de Búsqueda ---
// Para encontrar elementos o sus índices.

console.log("\n--- Métodos de Búsqueda ---");
const colores = ["azul", "verde", "rojo", "azul", "amarillo"];

// `indexOf()`: Devuelve el primer índice en el que se encuentra un elemento dado.
console.log("Índice de 'azul' (.indexOf()):", colores.indexOf("azul")); // Salida: 0
console.log("Índice de 'naranja' (.indexOf()):", colores.indexOf("naranja")); // Salida: -1 (no encontrado)

// `lastIndexOf()`: Devuelve el último índice en el que se encuentra un elemento dado.
console.log(
  "Último índice de 'azul' (.lastIndexOf()):",
  colores.lastIndexOf("azul")
); // Salida: 3

// `find()`: Devuelve el PRIMER elemento del array que satisface la función de prueba.
const libro = [
  { id: 101, titulo: "Cien Años de Soledad" },
  { id: 102, titulo: "El Quijote" },
  { id: 103, titulo: "Cien Años de Soledad" },
];
const libroBuscado = libro.find((item) => item.titulo === "El Quijote");
console.log("Libro encontrado por título (.find()):", libroBuscado); // Salida: {id: 102, titulo: "El Quijote"}

// `findIndex()`: Devuelve el ÍNDICE del primer elemento que satisface la función de prueba.
const indiceLibro = libro.findIndex(
  (item) => item.titulo === "Cien Años de Soledad"
);
console.log("Índice del primer libro por título (.findIndex()):", indiceLibro); // Salida: 0

// `includes()`: Comprueba si un array incluye un determinado elemento. Devuelve true/false.
console.log("¿Incluye 'rojo'? (.includes('rojo')):", colores.includes("rojo")); // Salida: true
console.log(
  "¿Incluye 'blanco'? (.includes('blanco')):",
  colores.includes("blanco")
); // Salida: false

// --- 6. Métodos de Combinación/Conversión ---
// Para convertir arrays a strings o viceversa, o unir elementos.

console.log("\n--- Métodos de Combinación/Conversión ---");
const palabras = ["Hola", "Mundo", "JavaScript"];

// `join()`: Une todos los elementos de un array en una cadena.
console.log("Array unido con espacio (.join(' ')):", palabras.join(" ")); // Salida: "Hola Mundo JavaScript"
console.log("Array unido con guión (.join('-')):", palabras.join("-")); // Salida: "Hola-Mundo-JavaScript"

// `toString()`: Convierte el array en una cadena, separando los elementos con comas.
console.log("Array a string (.toString()):", palabras.toString()); // Salida: "Hola,Mundo,JavaScript"

// `Array.isArray()`: Verifica si una variable es un array.
console.log(
  "¿`palabras` es un array? (Array.isArray(palabras)):",
  Array.isArray(palabras)
); // Salida: true
console.log(
  "¿`'string'` es un array? (Array.isArray('string')):",
  Array.isArray("string")
); // Salida: false
