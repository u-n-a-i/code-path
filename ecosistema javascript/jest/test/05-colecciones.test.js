const fruits = ["Manzana", "Pera", "Melon", "Fresas"];

test("Tiene que contener estas frutas", () => {
  expect(fruits).toContain("Pera");
  expect(fruits).toContain("Fresas");
  //   expect(fruits).toContain("manzana"); Error es sensible a mayúsculas y minúsculas
});

test("Longitud", () => {
  expect(fruits).toHaveLength(4);
  expect("Unai").toHaveLength(4);
});
