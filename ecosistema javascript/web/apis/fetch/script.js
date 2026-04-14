/*
fetch(URL, options) // Retorna una Promise
    .then(response => {
        // Manejar la respuesta del servidor (cabeceras, estado HTTP)
        // Verificar response.ok o response.status
        // Devolver response.json() o response.text(), etc. (que también retorna una Promise)
    })
    .then(data => {
        // Manejar los datos parseados
    })
    .catch(error => {
        // Manejar errores de red o errores lanzados
    });
*/

const getPostsBtn = document.getElementById("getPostsBtn");
const getSinglePostBtn = document.getElementById("getSinglePostBtn");
const getOutput = document.getElementById("getOutput");
const getResults = document.getElementById("getResults");

const createPostBtn = document.getElementById("createPostBtn");
const postTitleInput = document.getElementById("postTitle");
const postBodyTextarea = document.getElementById("postBody");
const postOutput = document.getElementById("postOutput");
const postResults = document.getElementById("postResults");

const BASE_URL = "https://jsonplaceholder.typicode.com";

// --- Función auxiliar para mostrar mensajes ---
function displayMessage(element, message, type) {
  element.textContent = message;
  element.className = `message ${type}`;
}

// --- Petición GET: Obtener múltiples publicaciones ---
getPostsBtn.addEventListener("click", () => {
  getResults.textContent = "Cargando publicaciones...";
  displayMessage(getOutput, "Solicitando publicaciones...", "");

  // 1. `Workspace()` devuelve una Promise.
  fetch(`${BASE_URL}/posts?_limit=5`)
    .then((response) => {
      // 2. La Promise se resuelve con el objeto Response.
      // Verificamos si la respuesta HTTP es exitosa (códigos 2xx).
      if (!response.ok) {
        // Si hay un error HTTP (ej. 404, 500), lanzamos un error para que lo capture el `.catch()`
        throw new Error(
          `Error HTTP: ${response.status} - ${response.statusText}`
        );
      }
      // Si es exitoso, parseamos el cuerpo de la respuesta como JSON.
      // response.json() también devuelve una Promise.
      return response.json();
    })
    .then((posts) => {
      // 3. La siguiente Promise se resuelve con los datos JSON parseados.
      getResults.textContent = JSON.stringify(posts, null, 2);
      displayMessage(
        getOutput,
        `Éxito: Se obtuvieron ${posts.length} publicaciones.`,
        "success"
      );
    })
    .catch((error) => {
      // 4. Capturamos cualquier error (de red o errores HTTP lanzados manualmente).
      getResults.textContent = `Error: ${error.message}`;
      displayMessage(
        getOutput,
        `Error al obtener publicaciones: ${error.message}`,
        "error"
      );
      console.error("Fetch error:", error);
    });
});

// --- Petición GET: Obtener una única publicación por ID (con async/await) ---
getSinglePostBtn.addEventListener("click", async () => {
  getResults.textContent = "Cargando publicación única...";
  displayMessage(getOutput, "Solicitando publicación con ID 1...", "");

  try {
    // `await` espera a que la Promise de `Workspace` se resuelva
    const response = await fetch(`${BASE_URL}/posts/1`);

    if (!response.ok) {
      throw new Error(
        `Error HTTP: ${response.status} - ${response.statusText}`
      );
    }

    // `await` espera a que la Promise de `response.json()` se resuelva
    const post = await response.json();

    getResults.textContent = JSON.stringify(post, null, 2);
    displayMessage(
      getOutput,
      `Éxito: Publicación con ID 1 obtenida.`,
      "success"
    );
  } catch (error) {
    // Captura errores de `Workspace` o errores HTTP lanzados
    getResults.textContent = `Error: ${error.message}`;
    displayMessage(
      getOutput,
      `Error al obtener publicación: ${error.message}`,
      "error"
    );
    console.error("Fetch error:", error);
  }
});

// --- Petición POST: Crear una nueva publicación ---
createPostBtn.addEventListener("click", () => {
  postResults.textContent = "Enviando nueva publicación...";
  displayMessage(postOutput, "Creando publicación...", "");

  const newPost = {
    title: postTitleInput.value,
    body: postBodyTextarea.value,
    userId: 1,
  };

  fetch(`${BASE_URL}/posts`, {
    method: "POST", // Método HTTP
    headers: {
      "Content-Type": "application/json;charset=UTF-8", // Tipo de contenido del cuerpo
    },
    body: JSON.stringify(newPost), // El cuerpo de la petición (objeto JS a JSON)
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Error HTTP: ${response.status} - ${response.statusText}`
        );
      }
      return response.json(); // Se espera que el servidor responda con JSON
    })
    .then((data) => {
      postResults.textContent = JSON.stringify(data, null, 2);
      displayMessage(
        postOutput,
        `Éxito: Publicación creada (ID: ${data.id || "N/A"}).`,
        "success"
      );
    })
    .catch((error) => {
      postResults.textContent = `Error: ${error.message}`;
      displayMessage(
        postOutput,
        `Error al crear publicación: ${error.message}`,
        "error"
      );
      console.error("Fetch error:", error);
    });
});
