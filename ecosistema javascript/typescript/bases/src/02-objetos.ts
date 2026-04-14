// Objetos
let myObj: object = {
  product: "PC",
  price: 5000,
};

/*
En TypeScript, cuando defines una variable con el tipo object, el compilador no sabe qué propiedades específicas tiene ese objeto, por lo que no permite acceder a ellas directamente.

No te deja -> console.log(myObj.product);
*/

// Puedes definir un tipo más específico utilizando una interfaz o un tipo explícito
let myObject: { product: String; price: number } = {
  product: "PC",
  price: 5000,
};

console.log(myObject.product);

// Con un tipo personal
type computer = {
  product: String;
  price: number;
  available: boolean;
};

let ordenador: computer = {
  product: "Laptop",
  price: 1500,
  available: false,
};
