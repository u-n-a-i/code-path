function obtenerNombre() {
  return Promise.resolve("Unai");
}

function obtenerNombreError() {
  return Promise.reject("Error");
}

test("Promesas con async/await", async () => {
  await expect(obtenerNombre()).resolves.toBe("Unai");
  await expect(obtenerNombreError()).rejects.toBe("Error");
});
