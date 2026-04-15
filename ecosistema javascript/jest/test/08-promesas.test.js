function obtenerNombre() {
  return Promise.resolve("Unai");
}

function obtenerNombreError() {
  return Promise.reject("Error");
}

test("Promesas", () => {
  return Promise.all([
    expect(obtenerNombre()).resolves.toBe("Unai"),
    expect(obtenerNombreError()).rejects.toBe("Error"),
  ]);
});
