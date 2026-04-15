// toBeNull => verificar si el valor es null
function buscarPorId(id) {
  if (id > 10) {
    return null;
  }
  return { fruta: "Manzanas" };
}

test("Devolver null si es mayor que 10", () => {
  expect(buscarPorId(11)).toBeNull();
});

// toBeUndefined => comprobar si es undefined
let conf;

function procesar(data) {}

test("La variable no asignada es undefined", () => {
  expect(conf).toBeUndefined();
  expect(procesar("datos")).toBeUndefined();
});

// Truthy y Falsy
const coche = "Mercedes";
const nan = NaN;

test("Valores Truthy y Falsy", () => {
  expect(coche).toBeTruthy();
  expect(nan).toBeFalsy();
});
