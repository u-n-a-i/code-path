console.log("--- Expresiones Regulares (RegExp) en JavaScript ---");

// --- 1. Creación de una RegExp ---
// Hay dos formas de crear una expresión regular en JavaScript:
// a) Literal de expresión regular (preferido para patrones fijos)
const regexLiteral = /patron/;
// b) Constructor RegExp (útil cuando el patrón es dinámico, ej. viene de una variable)
const regexConstructor = new RegExp("patron");

console.log("\n--- 1. Creación de RegExp ---");
console.log("Literal:", /abc/.test("abcdef")); // true
console.log("Constructor:", new RegExp("abc").test("abcdef")); // true

// --- 2. Caracteres Especiales y Clases de Caracteres ---
// Son la base de los patrones.
console.log("\n--- 2. Caracteres Especiales y Clases de Caracteres ---");

// . (punto): Coincide con cualquier carácter excepto nueva línea
console.log(". (punto):", /a.c/.test("abc")); // true
console.log(". (punto):", /a.c/.test("axc")); // true
console.log(". (punto):", /a.c/.test("ac")); // false

// \d: Coincide con cualquier dígito (0-9)
console.log("\\d (dígito):", /\d\d\d/.test("123")); // true
console.log("\\d (dígito):", /\d/.test("a")); // false

// \D: Coincide con cualquier carácter que NO sea un dígito
console.log("\\D (no dígito):", /\D/.test("a")); // true

// \w: Coincide con cualquier carácter alfanumérico (letras, números, guion bajo)
console.log("\\w (alfanumérico):", /\w/.test("a")); // true
console.log("\\w (alfanumérico):", /\w/.test("1")); // true
console.log("\\w (alfanumérico):", /\w/.test("_")); // true
console.log("\\w (alfanumérico):", /\w/.test(" ")); // false

// \W: Coincide con cualquier carácter que NO sea alfanumérico
console.log("\\W (no alfanumérico):", /\W/.test(" ")); // true

// \s: Coincide con cualquier carácter de espacio en blanco (espacio, tab, nueva línea)
console.log("\\s (espacio):", /\s/.test(" ")); // true

// \S: Coincide con cualquier carácter que NO sea espacio en blanco
console.log("\\S (no espacio):", /\S/.test("a")); // true

// Clases de caracteres (corchetes []): Coincide con CUALQUIER carácter dentro de los corchetes
console.log("[abc]:", /[abc]/.test("a")); // true
console.log("[abc]:", /[abc]/.test("b")); // true
console.log("[abc]:", /[abc]/.test("z")); // false
console.log("[aeiou]:", /[aeiou]/.test("pato")); // true (la 'a' coincide)

// Rango de caracteres dentro de corchetes
console.log("[a-z]:", /[a-z]/.test("hola")); // true (la 'h' o 'o' o 'l' o 'a' coinciden)
console.log("[0-9]:", /[0-9]/.test("123")); // true
console.log("[A-Za-z0-9_]:", /[A-Za-z0-9_]/.test("CamelCase_1")); // true

// Negación dentro de clases de caracteres ([^]): Coincide con CUALQUIER carácter EXCEPTO los corchetes
console.log("[^abc]:", /[^abc]/.test("d")); // true (la 'd' no es 'a', 'b' ni 'c')
console.log("[^0-9]:", /[^0-9]/.test("Hola")); // true (la 'H' no es un dígito)

// Escapar caracteres especiales (\): Para que un carácter especial coincida con sí mismo
console.log("\\. (punto literal):", /\./.test("www.example.com")); // true (coincide con el punto literal)
console.log("\\? (interrogación literal):", /\?/.test("Pregunta?")); // true
console.log("\\[ (corchete literal):", /\[/.test("[array]")); // true

// --- 3. Cuantificadores ---
// Indican cuántas veces un carácter o grupo debe aparecer.
console.log("\n--- 3. Cuantificadores ---");

// *: Cero o más veces
console.log("a*: /a*/.test('aaaaa')", /a*/.test("aaaaa")); // true
console.log("a*: /a*/.test('')", /a*/.test("")); // true (cero 'a's)

// +: Una o más veces
console.log("a+: /a+/.test('aaaaa')", /a+/.test("aaaaa")); // true
console.log("a+: /a+/.test('')", /a+/.test("")); // false (necesita al menos una 'a')

// ?: Cero o una vez (opcional)
console.log("colou?r: /colou?r/.test('color')", /colou?r/.test("color")); // true (la 'u' es opcional)
console.log("colou?r: /colou?r/.test('colour')", /colou?r/.test("colour")); // true

// {n}: Exactamente n veces
console.log("a{3}: /a{3}/.test('aaa')", /a{3}/.test("aaa")); // true
console.log("a{3}: /a{3}/.test('aa')", /a{3}/.test("aa")); // false

// {n,}: n o más veces
console.log("a{2,}: /a{2,}/.test('aa')", /a{2,}/.test("aa")); // true
console.log("a{2,}: /a{2,}/.test('aaaa')", /a{2,}/.test("aaaa")); // true

// {n,m}: Entre n y m veces (inclusive)
console.log("a{2,4}: /a{2,4}/.test('aaa')", /a{2,4}/.test("aaa")); // true
console.log("a{2,4}: /a{2,4}/.test('a')", /a{2,4}/.test("a")); // false

// --- 4. Agrupación y Referencias hacia atrás (Capturing Groups) ---
// Paréntesis `()` crean un grupo de captura. El contenido capturado se puede referenciar.
console.log("\n--- 4. Agrupación y Referencias hacia atrás ---");

// Captura de grupo: (patron)
const fechaRegex = /(\d{4})-(\d{2})-(\d{2})/; // Captura año, mes, día
const fecha = "La fecha es 2023-10-26.";
const matchFecha = fecha.match(fechaRegex);
console.log("match() para '2023-10-26':", matchFecha);
// matchFecha[0] = "2023-10-26" (coincidencia completa)
// matchFecha[1] = "2023" (primer grupo capturado)
// matchFecha[2] = "10"
// matchFecha[3] = "26"

// Referencia hacia atrás (backreferences): \n (donde n es el número del grupo)
// Busca palabras repetidas, ej. "hola hola"
const repetidoRegex = /(\w+)\s\1/; // \1 se refiere al contenido del primer grupo (\w+)
console.log("Palabra repetida 'hola hola':", repetidoRegex.test("hola hola")); // true
console.log("Palabra repetida 'adios hola':", repetidoRegex.test("adios hola")); // false

// Grupos no capturadores (Non-capturing groups): (?:patron)
// Agrupan sin capturar el contenido. Útiles si solo necesitas agrupar para un cuantificador o alternancia.
console.log("Agrupación no capturadora (?:ab)+:", /(?:ab)+/.test("ababab")); // true

// --- 5. Alternancia (OR) ---
// La barra vertical `|` actúa como un operador OR.
console.log("\n--- 5. Alternancia (|) ---");
console.log(
  "manzana|pera: /manzana|pera/.test('Quiero una pera')",
  /manzana|pera/.test("Quiero una pera")
); // true
console.log(
  "manzana|pera: /manzana|pera/.test('Quiero una uva')",
  /manzana|pera/.test("Quiero una uva")
); // false
console.log(
  "Color con OR (rojo|azul):",
  /(rojo|azul)/.test("Mi coche es azul")
); // true

// --- 6. Banderas (Flags) ---
// Modifican el comportamiento de la búsqueda. Se colocan después del literal o como segundo arg del constructor.
console.log("\n--- 6. Banderas (Flags) ---");

// g (global): Busca todas las coincidencias, no solo la primera.
const texto = "El pato y la pata se pasean con sus patitos.";
const patoGlobal = /pato/g;
let match;
while ((match = patoGlobal.exec(texto)) !== null) {
  console.log(
    `  Coincidencia 'pato' (g): ${match[0]} encontrada en índice ${match.index}`
  );
}
// Sin 'g', `exec` solo devolvería la primera coincidencia y luego null.

// i (insensitive): Ignora mayúsculas/minúsculas.
console.log("pato/i: /pato/i.test('PATO')", /pato/i.test("PATO")); // true
console.log("pato/i: /pato/i.test('pato')", /pato/i.test("pato")); // true

// m (multiline): Hace que ^ y $ coincidan con el inicio/fin de cada línea, no solo del string completo.
const multiLineaTexto = "Línea 1\nLínea 2\nLínea 3";
console.log("Inicio de línea (^/m):", /^Línea/m.test(multiLineaTexto)); // true (en Línea 2 y 3)
console.log("Fin de línea ($/m):", /3$/m.test(multiLineaTexto)); // true (en Línea 3)

// u (unicode): Habilita el soporte completo de Unicode para caracteres (ej. emojis, caracteres asiáticos).
console.log("Unicoded (🝗/u):", /\u{1F98A}/u.test("🦊")); // false sin 'u', true con 'u' (zorro)

// s (dotAll): Permite que `.` (punto) coincida también con caracteres de nueva línea. (ES2018+)
console.log("DotAll (a.b/s):", /a.b/s.test("a\nb")); // true (el punto coincide con el salto de línea)

// --- 7. Anclas ---
// Coinciden con posiciones específicas en la cadena.
console.log("\n--- 7. Anclas ---");

// ^: Inicio de la cadena (o inicio de línea con flag 'm')
console.log("^Hola: /^Hola/.test('Hola mundo')", /^Hola/.test("Hola mundo")); // true
console.log(
  "^Hola: /^Hola/.test('  Hola mundo')",
  /^Hola/.test("  Hola mundo")
); // false

// $: Fin de la cadena (o fin de línea con flag 'm')
console.log("mundo$: /mundo$/.test('Hola mundo')", /mundo$/.test("Hola mundo")); // true
console.log(
  "mundo$: /mundo$/.test('Hola mundo ')",
  /mundo$/.test("Hola mundo ")
); // false

// \b: Límite de palabra (word boundary). Posición entre un carácter \w y \W, o viceversa,
// o inicio/fin de string si el primer/último carácter es \w.
console.log(
  "\\bcat\\b: /\\bcat\\b/.test('El gato es un cat.')",
  /\bcat\b/.test("El gato es un cat.")
); // true (coincide "cat" standalone)
console.log(
  "\\bcat\\b: /\\bcat\\b/.test('categoría')",
  /\bcat\b/.test("categoría")
); // false (no es una palabra completa)

// \B: No límite de palabra (non-word boundary). Lo opuesto a \b.
console.log(
  "\\Bcat\\B: /\\Bcat\\B/.test('categoría')",
  /\Bcat\B/.test("categoría")
); // true (coincide 'cat' dentro de "categoría")

// --- 8. Métodos de RegExp y String ---
// JavaScript proporciona varios métodos para trabajar con RegExp.
console.log("\n--- 8. Métodos de RegExp y String ---");

const frase = "Visita mi sitio web en example.com o example.org.";

// `RegExp.prototype.test()`: Devuelve `true` si encuentra al menos una coincidencia, `false` de lo contrario.
console.log("test(): /example/.test(frase)", /example/.test(frase)); // true

// `RegExp.prototype.exec()`: Devuelve un array con la coincidencia y grupos capturados, o `null` si no hay.
// Con la bandera 'g', mantiene un "lastIndex" y se puede llamar repetidamente.
const regexEmail = /\b(\w+)@(\w+\.\w+)\b/g; // Captura nombre de usuario y dominio
const emailTexto =
  "Mi email es test@domain.com y el de mi amigo es user@mail.net.";
let matchEmail;
while ((matchEmail = regexEmail.exec(emailTexto)) !== null) {
  console.log(
    `  exec(): Email encontrado: ${matchEmail[0]}, Usuario: ${matchEmail[1]}, Dominio: ${matchEmail[2]}`
  );
}

// `String.prototype.match()`: Devuelve un array de todas las coincidencias o `null`.
// Con la bandera 'g', devuelve un array de todas las cadenas coincidentes (sin grupos de captura para cada una).
// Sin 'g', es similar a `RegExp.prototype.exec()`.
const todosLosExamples = frase.match(/example\.(com|org)/g); // La 'g' es clave aquí
console.log("match() (con 'g'):", todosLosExamples); // Salida: ["example.com", "example.org"]

// `String.prototype.search()`: Devuelve el índice de la primera coincidencia, o -1 si no se encuentra.
console.log("search(): frase.search(/web/)", frase.search(/web/)); // Salida: 18

// `String.prototype.replace()`: Reemplaza coincidencias con otra cadena o el resultado de una función.
console.log(
  "replace(): frase.replace(/example/g, 'dominio')",
  frase.replace(/example/g, "dominio")
);
// Salida: "Visita mi sitio web en dominio.com o dominio.org."

// `String.prototype.split()`: Divide una cadena en un array de subcadenas usando la RegExp como delimitador.
const csvData = "nombre,edad,ciudad\nAlice,30,New York\nBob,25,London";
console.log("split(): csvData.split(/\\n/)", csvData.split(/\n/)); // Divide por salto de línea
// Salida: ["nombre,edad,ciudad", "Alice,30,New York", "Bob,25,London"]

// Más ejemplos de replace con funciones (muy potente)
const plantilla = "Hoy es [dia], el mes es [mes], y el año es [año].";
const datos = { dia: "Viernes", mes: "Mayo", año: "2025" };
const plantillaProcesada = plantilla.replace(/\[(\w+)\]/g, (match, clave) => {
  return datos[clave] || match; // Si la clave existe en datos, la usa, sino, deja el patrón original
});
console.log("replace() con función:", plantillaProcesada);
// Salida: "Hoy es Viernes, el mes es Mayo, y el año es 2025."
