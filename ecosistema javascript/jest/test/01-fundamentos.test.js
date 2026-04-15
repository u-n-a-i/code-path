// Igualdad toBe
test("Comprobar que es 4", () => {
  expect(4).toBe(4);
});

// Comprobar una función
function sumar(a, b) {
  return a + b;
}

test("Comprobar la suma", () => {
  expect(sumar(2, 3)).toBe(5);
});

// toEqual
test("Comparar obj", () => {
  const obj1 = { name: "Unai" };
  const obj2 = { name: "Unai" };

  expect(obj1).toEqual(obj2);
});

// Negación not
test("Negación", () => {
  expect(true).not.toBe(false);
  expect(40).not.toBe(20);
});
