// js/operaciones.js

// Exportación por nombre de variables y funciones
export const PI = 3.14159;

export function sumar(a, b) {
  return a + b;
}

export function restar(a, b) {
  return a - b;
}

// Una función interna que no se exporta, por lo tanto, es privada de este módulo
function multiplicarInterno(a, b) {
  return a * b;
}

// También podemos exportar directamente al declarar
export const dividir = (a, b) => {
  if (b === 0) {
    throw new Error("No se puede dividir por cero.");
  }
  return a / b;
};

// Podemos exportar con un nombre diferente (renombrado)
const modulo = (a, b) => a % b;
export { modulo as obtenerResto };

console.log("Módulo 'operaciones.js' cargado.");
