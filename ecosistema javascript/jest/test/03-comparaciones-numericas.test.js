const executionTime = 45;
const limit = 50;

test("Tiempo de ejecución menor a 50 y mayor a 0", () => {
  expect(executionTime).toBeLessThan(limit);
  expect(executionTime).toBeGreaterThan(0);
});

test("decimales", () => {
  // expect(0.1 + 0.3).toBe(0.3); Esto falla por la precisión
  expect(0.1 + 0.2).toBeCloseTo(0.3);
});
