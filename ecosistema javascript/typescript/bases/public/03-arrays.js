"use strict";
// Array
let miArray = [10, 20, 30];
// miArray[0] = "Hola"; -> Error
console.log(miArray);
console.log(miArray[0]);
miArray.map((n) => {
    console.log(n - 1);
});
// Array varios tipos
let mixArray = [404, "Hola", true];
console.log(mixArray);
