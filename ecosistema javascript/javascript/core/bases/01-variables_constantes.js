// --- Ejemplo Unificado de var, let y const ---

// 1. Usando 'var' (ámbito de función y hoisting)
var comidaFavorita = "Pizza";
console.log("Inicial con var:", comidaFavorita); // Salida: Inicial con var: Pizza

if (true) {
  var comidaFavorita = "Hamburguesa"; // Esto redeclara la misma variable global/de función
  console.log("Dentro del bloque con var:", comidaFavorita); // Salida: Dentro del bloque con var: Hamburguesa
}
console.log("Fuera del bloque con var (afectada):", comidaFavorita); // Salida: Fuera del bloque con var (afectada): Hamburguesa (¡cambió globalmente!)

console.log("---"); // Separador

// 2. Usando 'let' (ámbito de bloque y no redeclaración)
let colorFavorito = "Azul";
console.log("Inicial con let:", colorFavorito); // Salida: Inicial con let: Azul

if (true) {
  let colorFavorito = "Rojo"; // Esto crea una NUEVA variable 'colorFavorito' solo para este bloque
  console.log("Dentro del bloque con let:", colorFavorito); // Salida: Dentro del bloque con let: Rojo
}
console.log("Fuera del bloque con let (no afectada):", colorFavorito); // Salida: Fuera del bloque con let (no afectada): Azul (¡mantuvo su valor original!)

// let colorFavorito = "Verde"; // Esto causaría un error: Identifier 'colorFavorito' has already been declared

console.log("---"); // Separador

// 3. Usando 'const' (ámbito de bloque y no reasignación)
const numeroSuerte = 7;
console.log("Inicial con const:", numeroSuerte); // Salida: Inicial con const: 7

// numeroSuerte = 8; // Esto causaría un error: Assignment to constant variable.

if (true) {
  const numeroSuerteBloque = 13; // 'const' también tiene ámbito de bloque
  console.log("Dentro del bloque con const:", numeroSuerteBloque); // Salida: Dentro del bloque con const: 13
}
// console.log(numeroSuerteBloque); // Esto causaría un error: numeroSuerteBloque is not defined (fuera del ámbito del bloque)

// Un ejemplo de 'const' con objeto, para entender su "constancia"
const usuario = {
  nombre: "Alice",
  edad: 30,
};
console.log("Usuario inicial:", usuario.nombre); // Salida: Usuario inicial: Alice

usuario.edad = 31; // Podemos cambiar propiedades de un objeto declarado con const
console.log("Usuario edad modificada:", usuario.edad); // Salida: Usuario edad modificada: 31

// usuario = { nombre: "Bob", edad: 25 }; // PERO, no podemos reasignar la variable 'usuario' a un nuevo objeto
