function obtenerUsuario(id, callback) {
  setTimeout(() => {
    callback({ id, nombre: "Unai" });
  }, 3000);
}

test("Obtener usuario con callback", (done) => {
  obtenerUsuario(1, (usuario) => {
    expect(usuario).toEqual({ id: 1, nombre: "Unai" });
    done();
  });
});
