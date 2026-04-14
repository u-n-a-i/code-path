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

  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${BASE_URL}/posts?_limit=5`, true); // true para asíncrono

  xhr.onload = function () {
    // `onload` se dispara cuando la petición se completa exitosamente
    // (readyState es 4 y el servidor respondió)
    if (xhr.status >= 200 && xhr.status < 300) {
      // Códigos de éxito (2xx)
      const posts = JSON.parse(xhr.responseText);
      getResults.textContent = JSON.stringify(posts, null, 2);
      displayMessage(
        getOutput,
        `Éxito: Se obtuvieron ${posts.length} publicaciones.`,
        "success"
      );
    } else {
      getResults.textContent = `Error: ${xhr.status} - ${xhr.statusText}`;
      displayMessage(
        getOutput,
        `Error al obtener publicaciones. Código: ${xhr.status}`,
        "error"
      );
    }
  };

  xhr.onerror = function () {
    // `onerror` se dispara por errores de red u otros problemas de conexión
    displayMessage(
      getOutput,
      "Error de red o conexión al obtener publicaciones.",
      "error"
    );
    getResults.textContent = "No se pudo conectar al servidor.";
  };

  xhr.send(); // Enviar la petición GET (sin cuerpo)
});

// --- Petición GET: Obtener una única publicación por ID ---
getSinglePostBtn.addEventListener("click", () => {
  getResults.textContent = "Cargando publicación única...";
  displayMessage(getOutput, "Solicitando publicación con ID 1...", "");

  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${BASE_URL}/posts/1`, true);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      const post = JSON.parse(xhr.responseText);
      getResults.textContent = JSON.stringify(post, null, 2);
      displayMessage(
        getOutput,
        `Éxito: Publicación con ID 1 obtenida.`,
        "success"
      );
    } else {
      getResults.textContent = `Error: ${xhr.status} - ${xhr.statusText}`;
      displayMessage(
        getOutput,
        `Error al obtener publicación. Código: ${xhr.status}`,
        "error"
      );
    }
  };

  xhr.onerror = function () {
    displayMessage(
      getOutput,
      "Error de red o conexión al obtener la publicación única.",
      "error"
    );
    getResults.textContent = "No se pudo conectar al servidor.";
  };

  xhr.send();
});

// --- Petición POST: Crear una nueva publicación ---
createPostBtn.addEventListener("click", () => {
  postResults.textContent = "Enviando nueva publicación...";
  displayMessage(postOutput, "Creando publicación...", "");

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${BASE_URL}/posts`, true);

  // Importante: Configurar la cabecera Content-Type para peticiones POST con JSON
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  const newPost = {
    title: postTitleInput.value,
    body: postBodyTextarea.value,
    userId: 1, // ID de usuario de ejemplo
  };

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      const response = JSON.parse(xhr.responseText);
      postResults.textContent = JSON.stringify(response, null, 2);
      displayMessage(
        postOutput,
        `Éxito: Publicación creada (ID: ${response.id || "N/A"}).`,
        "success"
      );
    } else {
      postResults.textContent = `Error: ${xhr.status} - ${xhr.statusText}`;
      displayMessage(
        postOutput,
        `Error al crear publicación. Código: ${xhr.status}`,
        "error"
      );
    }
  };

  xhr.onerror = function () {
    displayMessage(
      postOutput,
      "Error de red o conexión al crear la publicación.",
      "error"
    );
    postResults.textContent = "No se pudo conectar al servidor.";
  };

  // Enviar el objeto JavaScript convertido a cadena JSON
  xhr.send(JSON.stringify(newPost));
});

// --- Uso de onreadystatechange (alternativa a onload) ---
// Este evento se dispara cada vez que cambia el readyState.
// Es más granular pero requiere más lógica para manejar los estados.
// No se recomienda para casos simples, `onload` es más directo.
/*
        getPostsBtn.addEventListener('click', () => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `${BASE_URL}/posts?_limit=2`, true);

            xhr.onreadystatechange = function() {
                console.log(`ReadyState: ${xhr.readyState}, Status: ${xhr.status}`);
                if (xhr.readyState === XMLHttpRequest.DONE) { // Cuando la petición ha finalizado (estado 4)
                    if (xhr.status >= 200 && xhr.status < 300) {
                        const posts = JSON.parse(xhr.responseText);
                        getResults.textContent = JSON.stringify(posts, null, 2);
                        displayMessage(getOutput, `Éxito: Se obtuvieron ${posts.length} publicaciones (via onreadystatechange).`, 'success');
                    } else {
                        getResults.textContent = `Error: ${xhr.status} - ${xhr.statusText}`;
                        displayMessage(getOutput, `Error al obtener publicaciones (via onreadystatechange).`, 'error');
                    }
                }
            };
            xhr.send();
        });
        */
