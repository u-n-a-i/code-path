const registroForm = document.getElementById("registroForm");
const outputDiv = document.getElementById("output");

// Referencias a los campos de input para un acceso más fácil
const nombreInput = document.getElementById("nombre");
const emailInput = document.getElementById("email");
const edadInput = document.getElementById("edad");
const mensajeTextarea = document.getElementById("mensaje");
const paisSelect = document.getElementById("pais");

// Referencias a los contenedores de errores
const errorNombre = document.getElementById("errorNombre");
const errorEmail = document.getElementById("errorEmail");
const errorEdad = document.getElementById("errorEdad");
const errorIntereses = document.getElementById("errorIntereses");
const errorGenero = document.getElementById("errorGenero");
const errorPais = document.getElementById("errorPais");

// Función para mostrar un mensaje de error
function displayError(element, message) {
  element.textContent = message;
}

// Función para limpiar todos los mensajes de error
function clearErrors() {
  document
    .querySelectorAll(".error-message")
    .forEach((span) => (span.textContent = ""));
}

// --- 1. Escuchar el evento 'submit' del formulario ---
registroForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Detener el envío predeterminado del formulario

  clearErrors(); // Limpiar errores previos

  let isValid = true; // Bandera para la validación

  // --- 2. Recopilar y Validar Datos de Input ---

  // a) Campo de texto (nombre)
  const nombre = nombreInput.value.trim(); // .trim() elimina espacios en blanco al inicio/final
  if (nombre === "") {
    displayError(errorNombre, "El nombre es obligatorio.");
    isValid = false;
  } else if (nombre.length < 3) {
    displayError(errorNombre, "El nombre debe tener al menos 3 caracteres.");
    isValid = false;
  }

  // b) Campo de email
  const email = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex simple para email
  if (email === "") {
    displayError(errorEmail, "El email es obligatorio.");
    isValid = false;
  } else if (!emailRegex.test(email)) {
    displayError(errorEmail, "Introduce un email válido.");
    isValid = false;
  }

  // c) Campo numérico (edad)
  const edad = parseInt(edadInput.value); // Convertir a número entero
  if (isNaN(edad) || edad < 18 || edad > 120) {
    displayError(errorEdad, "La edad debe ser un número entre 18 y 120.");
    isValid = false;
  }

  // d) Campo de texto multi-línea (textarea)
  const mensaje = mensajeTextarea.value.trim(); // Opcional, no validamos longitud mínima aquí

  // e) Checkboxes (múltiples selecciones)
  const interesesSeleccionados = [];
  document
    .querySelectorAll('input[name="intereses"]:checked')
    .forEach((checkbox) => {
      interesesSeleccionados.push(checkbox.value);
    });
  if (interesesSeleccionados.length === 0) {
    displayError(errorIntereses, "Selecciona al menos un interés.");
    isValid = false;
  }

  // f) Radio buttons (una única selección)
  const generoSeleccionado = document.querySelector(
    'input[name="genero"]:checked'
  );
  const genero = generoSeleccionado ? generoSeleccionado.value : "";
  if (genero === "") {
    displayError(errorGenero, "Selecciona un género.");
    isValid = false;
  }

  // g) Select / Dropdown (una única selección)
  const pais = paisSelect.value;
  if (pais === "") {
    displayError(errorPais, "Selecciona un país.");
    isValid = false;
  }

  // --- 3. Procesar los datos si la validación es exitosa ---
  if (isValid) {
    const formData = {
      nombre: nombre,
      email: email,
      edad: edad,
      mensaje: mensaje,
      intereses: interesesSeleccionados,
      genero: genero,
      pais: pais,
    };

    // Mostrar los datos recopilados (en un entorno real, los enviarías a un servidor)
    outputDiv.textContent = `
                    Datos del Formulario Enviados:
                    --------------------------------
                    Nombre: ${formData.nombre}
                    Email: ${formData.email}
                    Edad: ${formData.edad}
                    Mensaje: ${formData.mensaje || "No especificado"}
                    Intereses: ${formData.intereses.join(", ") || "Ninguno"}
                    Género: ${formData.genero}
                    País: ${formData.pais}
                `;
    outputDiv.style.backgroundColor = "#d4edda";
    outputDiv.style.color = "#155724";

    // Simulación de envío a un servidor (descomentar para probar)
    // enviarDatosAlServidor(formData);

    // Limpiar el formulario después del envío exitoso
    registroForm.reset();
    displayError(errorNombre, "Formulario enviado con éxito!");
    errorNombre.style.color = "green";
  } else {
    outputDiv.textContent = "Por favor, corrige los errores del formulario.";
    outputDiv.style.backgroundColor = "#f8d7da";
    outputDiv.style.color = "#721c24";
  }
});

// --- Función de ejemplo para enviar datos a un servidor (simulado) ---
function enviarDatosAlServidor(data) {
  console.log("Enviando datos al servidor (simulado):", data);
  // Aquí usarías Fetch API o Axios para enviar los datos a tu backend
  /*
            fetch('/api/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                console.log('Respuesta del servidor:', result);
                alert('Registro exitoso!');
            })
            .catch(error => {
                console.error('Error al enviar datos:', error);
                alert('Hubo un error al registrar. Inténtalo de nuevo.');
            });
            */
}

// --- Limpiar formulario al hacer clic en el botón de reset ---
registroForm.addEventListener("reset", function () {
  outputDiv.textContent = "No hay datos enviados aún.";
  outputDiv.style.backgroundColor = "#e9f7ef";
  outputDiv.style.color = "#28a745";
  clearErrors(); // Limpiar errores al resetear
  console.log("Formulario reseteado.");
});
