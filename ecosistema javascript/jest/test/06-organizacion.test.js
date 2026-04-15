afterAll(() => {
  console.log("Después de todas las pruebas");
});

function suma(a, b) {
  return a + b;
}

function resta(a, b) {
  return a - b;
}

// Agrupar
describe("Operaciones matemáticas", () => {
  test("Suma de números", () => {
    expect(suma(2, 3)).toBe(5);
  });

  test("Resta de números", () => {
    expect(resta(8, 4)).toBe(4);
  });
});

// Ganchos

beforeAll(() => {
  console.log("Antes de todas las pruebas");
});

beforeEach(() => {
  console.log("Antes de cada prueba individual");
});
