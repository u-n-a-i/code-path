console.log("--- BOM: Objeto Screen ---");

// 1. Resolución total de la pantalla
console.log("Ancho total de la pantalla (screen.width):", screen.width, "px");
console.log("Alto total de la pantalla (screen.height):", screen.height, "px");

// 2. Área disponible (excluyendo barras de tareas, etc.)
console.log(
  "Ancho disponible de la pantalla (screen.availWidth):",
  screen.availWidth,
  "px"
);
console.log(
  "Alto disponible de la pantalla (screen.availHeight):",
  screen.availHeight,
  "px"
);

// 3. Profundidad de color (bits por píxel)
console.log(
  "Profundidad de color (screen.colorDepth):",
  screen.colorDepth,
  "bits"
); // Típicamente 24 o 32

// 4. Profundidad de píxeles (resolución de color, menos común)
console.log(
  "Profundidad de píxeles (screen.pixelDepth):",
  screen.pixelDepth,
  "bits"
); // Igual o similar a colorDepth
