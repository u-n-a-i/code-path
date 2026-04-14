console.log(
  "--- Desestructuración (Destructuring Assignment) en JavaScript ---"
);

// --- 1. Desestructuración de Arrays ---
// Permite extraer valores de un array y asignarlos a variables basadas en su posición.

console.log("\n--- Desestructuración de Arrays ---");

const colores = ["rojo", "verde", "azul", "amarillo"];

// Asignación básica
const [primerColor, segundoColor] = colores;
console.log("Primer color:", primerColor); // Salida: rojo
console.log("Segundo color:", segundoColor); // Salida: verde

// Saltar elementos
const [, , tercerColor] = colores; // Saltamos los dos primeros elementos
console.log("Tercer color (saltando):", tercerColor); // Salida: azul

// Resto de elementos (usando el operador Rest `...`)
const [principal, ...restoColores] = colores; // 'principal' toma el primero, 'restoColores' un array con el resto
console.log("Color principal:", principal); // Salida: rojo
console.log("Resto de colores:", restoColores); // Salida: ["verde", "azul", "amarillo"]

// Asignación a variables ya declaradas
let a = 10,
  b = 20;
[a, b] = [b, a]; // Útil para intercambiar valores
console.log("Valores intercambiados (a, b):", a, b); // Salida: 20 10

// Valores por defecto: Si un elemento no existe, se usa un valor predeterminado
const [nombre1, nombre2, nombre3 = "Desconocido"] = ["Ana", "Luis"];
console.log("Nombres con valor por defecto:", nombre1, nombre2, nombre3); // Salida: Ana Luis Desconocido

// Desestructuración anidada
const matriz = [
  [1, 2],
  [3, 4],
];
const [fila1, [, elementoFila2Col2]] = matriz;
console.log("Primera fila:", fila1); // Salida: [1, 2]
console.log("Elemento de fila 2, columna 2:", elementoFila2Col2); // Salida: 4

// --- 2. Desestructuración de Objetos ---
// Permite extraer propiedades de un objeto y asignarlas a variables basadas en el nombre de la propiedad.

console.log("\n--- Desestructuración de Objetos ---");

const usuario = {
  id: 1,
  nombre: "María",
  email: "maria@example.com",
  detalles: {
    ciudad: "Barcelona",
    profesion: "Diseñadora",
  },
  roles: ["admin", "editor"],
};

// Asignación básica (el nombre de la variable debe coincidir con el nombre de la propiedad)
const { nombre, email } = usuario;
console.log("Nombre del usuario:", nombre); // Salida: María
console.log("Email del usuario:", email); // Salida: maria@example.com

// Renombrar propiedades: Si la variable ya existe o quieres otro nombre
const { nombre: nombreCompleto, email: correoElectronico } = usuario;
console.log("Nombre completo (renombrado):", nombreCompleto); // Salida: María
console.log("Correo electrónico (renombrado):", correoElectronico); // Salida: maria@example.com

// Valores por defecto: Si la propiedad no existe, se usa un valor predeterminado
const { edad = 30, profesion } = usuario; // 'edad' no existe en 'usuario'
console.log("Edad (con valor por defecto):", edad); // Salida: 30
console.log("Profesión (existe en el objeto):", profesion); // Salida: undefined (porque profesion está anidada, veremos eso)

// Resto de propiedades (usando el operador Rest `...`)
const { id, ...restoUsuario } = usuario;
console.log("ID del usuario:", id); // Salida: 1
console.log("Resto de propiedades:", restoUsuario); // Salida: {nombre: "María", email: "maria@example.com", detalles: {...}, roles: [...]}

// Desestructuración anidada
const {
  detalles: { ciudad, profesion: ocupacion },
} = usuario; // Extrae y renombra 'profesion'
console.log("Ciudad del usuario:", ciudad); // Salida: Barcelona
console.log("Ocupación del usuario:", ocupacion); // Salida: Diseñadora

// Desestructuración anidada con valores por defecto
const {
  detalles: { pais = "España", codigoPostal = "08001" },
} = usuario;
console.log("País del usuario (por defecto):", pais);
console.log("Código Postal (por defecto):", codigoPostal);

// Desestructuración con un array dentro de un objeto
const {
  roles: [rolPrincipal, rolSecundario],
} = usuario;
console.log("Rol principal:", rolPrincipal); // Salida: admin
console.log("Rol secundario:", rolSecundario); // Salida: editor

// --- 3. Desestructuración en Parámetros de Funciones ---
// Muy común para funciones que esperan objetos de configuración o arrays.

console.log("\n--- Desestructuración en Parámetros de Funciones ---");

// Ejemplo 1: Con objetos
function mostrarProducto({ nombreProducto, precio, stock = 0 }) {
  console.log(
    `  Producto: ${nombreProducto}, Precio: ${precio}€, Stock: ${stock}`
  );
}

const producto1 = { nombreProducto: "Tablet", precio: 300, stock: 10 };
const producto2 = { nombreProducto: "Auriculares", precio: 50 }; // Sin stock

console.log("Mostrando Producto 1:");
mostrarProducto(producto1);
console.log("Mostrando Producto 2:");
mostrarProducto(producto2); // 'stock' usará su valor por defecto (0)

// Ejemplo 2: Con arrays
function obtenerCoordenadas([x, y]) {
  console.log(`  Coordenada X: ${x}, Coordenada Y: ${y}`);
}
obtenerCoordenadas([10, 20]);

// --- 4. Casos de Uso y Beneficios ---
console.log("\n--- Casos de Uso y Beneficios ---");

// Reduce el código repetitivo
// Antes:
// const nombre = usuario.nombre;
// const email = usuario.email;
// Ahora:
// const { nombre, email } = usuario;
console.log("Beneficio: Código más conciso y legible.");

// Hace que el código sea más claro sobre qué propiedades o elementos se están utilizando.
console.log("Beneficio: Claridad sobre las propiedades/elementos usados.");

// Facilita el trabajo con APIs que devuelven objetos o arrays complejos.
console.log("Beneficio: Simplifica el manejo de datos de APIs.");

// Simplifica la firma de funciones.
console.log("Beneficio: Firmas de funciones más limpias y flexibles.");
