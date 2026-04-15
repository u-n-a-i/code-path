const url = "https://www.google.com";
const error = "Fallo: la validación es incorrecta";

test("URL segura", () => {
  expect(url).toMatch("https");
  expect(error).toMatch(/^Fallo:/);
});
