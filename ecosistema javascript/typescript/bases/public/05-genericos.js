"use strict";
// Genéricos
function getFirstElement(array) {
    return array[0];
}
const numArr = [10, 20, 30];
console.log(getFirstElement(numArr));
// console.log(getFirstElement(["Hola","esto","no es generico"])); Error -> solo es para números
function getFirstGenericElement(array) {
    return array[0];
}
console.log("###Genérico###");
console.log(getFirstGenericElement([true, false, true]));
console.log(getFirstGenericElement([44, "Es", "demasiado", "genérico", true]));
console.log(getFirstGenericElement(["Solo", "cadenas"]));
console.log(getFirstGenericElement([101, 302]));
