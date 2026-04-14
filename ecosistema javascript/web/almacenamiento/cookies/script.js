const cookieNameInput = document.getElementById("cookieName");
const cookieValueInput = document.getElementById("cookieValue");
const cookieDaysInput = document.getElementById("cookieDays");
const outputDiv = document.getElementById("output");

function showOutput(message) {
  outputDiv.textContent = message;
  console.log(message);
}

// --- 1. Establecer una cookie (crear/actualizar) ---
// Función para establecer una cookie con nombre, valor y días de expiración
function setCookie() {
  const name = cookieNameInput.value.trim();
  const value = cookieValueInput.value.trim();
  const days = parseInt(cookieDaysInput.value);

  if (!name || !value || isNaN(days)) {
    showOutput("Por favor, rellena todos los campos.");
    return;
  }

  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000); // Días a milisegundos
  const expires = "expires=" + d.toUTCString();
  // document.cookie se comporta como un "setter" que añade o actualiza una cookie
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`; // path=/ hace que esté disponible en todo el dominio
  showOutput(
    `Cookie '${name}' establecida con valor '${value}' para ${days} días.`
  );
}

// --- 2. Obtener todas las cookies (es una cadena de texto) ---
function getCookie() {
  const allCookies = document.cookie; // Devuelve una cadena como "key1=value1; key2=value2"
  showOutput(`Todas las cookies: \n${allCookies}`);
  console.log("Todas las cookies:", allCookies);

  // Ejemplo de cómo parsear una cookie específica (no trivial en JS puro)
  const myCookieName = cookieNameInput.value;
  const cookiesArray = allCookies.split(";");
  let foundValue = "No encontrada";
  for (let i = 0; i < cookiesArray.length; i++) {
    let cookie = cookiesArray[i].trim();
    if (cookie.startsWith(myCookieName + "=")) {
      foundValue = cookie.substring(myCookieName.length + 1);
      break;
    }
  }
  showOutput(
    `Valor de '${myCookieName}': ${foundValue}\nTodas las cookies: \n${allCookies}`
  );
}

// --- 3. Eliminar una cookie ---
// Para eliminar una cookie, se establece su fecha de expiración en el pasado.
function deleteCookie() {
  const name = cookieNameInput.value.trim();
  if (!name) {
    showOutput("Introduce el nombre de la cookie a eliminar.");
    return;
  }
  // Establece la expiración en una fecha pasada
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  showOutput(`Cookie '${name}' eliminada.`);
}

// Mostrar cookies al cargar la página
document.addEventListener("DOMContentLoaded", getCookie);
