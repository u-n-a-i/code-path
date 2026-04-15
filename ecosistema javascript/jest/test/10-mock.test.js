test("Simular función", () => {
  const mockFn = jest.fn();
  mockFn(1, 2);
  mockFn(3, 4);
  expect(mockFn).toHaveBeenCalledTimes(2);
});
