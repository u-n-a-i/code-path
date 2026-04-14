// calculator.js

// Exportación por nombre (añadiendo propiedades al objeto exports)
exports.add = (a, b) => a + b;
exports.subtract = (a, b) => a - b;

// Exportación como un objeto completo a través de module.exports
// Esto sobrescribe cualquier cosa que se haya asignado a 'exports' antes.
// Aquí exportamos un objeto con las funciones, que es un patrón común.
module.exports.multiply = (a, b) => a * b; // También se puede hacer así

// O, si quieres exportar un solo objeto con todo (común para exportación "por defecto" en CJS)
const divide = (a, b) => {
  if (b === 0) {
    throw new Error("Cannot divide by zero.");
  }
  return a / b;
};

// Esta es la forma más clara de exportar un único objeto o función como el "módulo principal"
module.exports = {
  add: exports.add, // Reutilizamos lo que ya definimos
  subtract: exports.subtract,
  multiply: module.exports.multiply,
  divide: divide, // Añadimos la función divide
  PI: 3.14159, // También podemos exportar variables
};

console.log("CommonJS module 'calculator.js' loaded.");
