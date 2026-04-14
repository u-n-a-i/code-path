// Genéricos

function getFirstElement(array: number[]): number {
  return array[0];
}

const numArr = [10, 20, 30];

console.log(getFirstElement(numArr));
// console.log(getFirstElement(["Hola","esto","no es generico"])); Error -> solo es para números

function getFirstGenericElement<T>(array: T[]) {
  return array[0];
}

console.log("###Genérico###");
console.log(getFirstGenericElement([true, false, true]));
console.log(getFirstGenericElement([44, "Es", "demasiado", "genérico", true]));
console.log(getFirstGenericElement<string>(["Solo", "cadenas"]));
console.log(getFirstGenericElement<number>([101, 302]));
