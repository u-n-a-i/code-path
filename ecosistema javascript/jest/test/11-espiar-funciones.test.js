const utils = {
  saludar(nombre) {
    return `Hola ${nombre}`;
  },
};

test("Espiar función saludar", () => {
  const spy = jest.spyOn(utils, "saludar");

  utils.saludar("Unai");

  expect(spy).toHaveBeenCalled();
  expect(spy).toHaveBeenCalledWith("Unai");

  spy.mockRestore(); // opcional
});
