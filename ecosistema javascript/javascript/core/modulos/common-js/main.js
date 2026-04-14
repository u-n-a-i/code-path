// main.js

// Importando un módulo que exporta múltiples cosas (como un objeto)
const calculator = require("./calculator.js");

// Importando un módulo que exporta una sola cosa (una clase en este caso)
const User = require("./userUtils.js");

console.log("\n--- Using imported CommonJS modules ---");

// Usando las funciones de calculator
console.log("5 + 3 =", calculator.add(5, 3));
console.log("10 - 4 =", calculator.subtract(10, 4));
console.log("20 * 5 =", calculator.multiply(20, 5));
console.log("PI value:", calculator.PI);

try {
  console.log("10 / 0 =", calculator.divide(10, 0));
} catch (error) {
  console.error("Division error:", error.message);
}

// Usando la clase User
const newUser = new User("Alice", "alice@example.com");
console.log(newUser.getInfo());

console.log("\n--- End of main.js execution ---");
