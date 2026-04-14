const interactiveForm = document.getElementById("interactiveForm");
const outputDiv = document.getElementById("output");

// --- 1. Mostrar u ocultar campos según las elecciones del usuario ---
const tipoServicioSelect = document.getElementById("tipoServicio");
const seccionPersonalizado = document.getElementById("seccionPersonalizado");
const seccionPremium = document.getElementById("seccionPremium");

function toggleServiceSections() {
  const selectedValue = tipoServicioSelect.value;
  seccionPersonalizado.classList.add("hidden-field");
  seccionPremium.classList.add("hidden-field");

  if (selectedValue === "personalizado") {
    seccionPersonalizado.classList.remove("hidden-field");
  } else if (selectedValue === "premium") {
    seccionPremium.classList.remove("hidden-field");
  }
}

tipoServicioSelect.addEventListener("change", toggleServiceSections);
// Llamar al inicio para establecer el estado inicial
document.addEventListener("DOMContentLoaded", toggleServiceSections);

// --- 2. Autocompletar datos en función de la información previamente introducida ---
const paisOrigenSelect = document.getElementById("paisOrigen");
const ciudadSugeridaInput = document.getElementById("ciudadSugerida");
const nombreCompletoInput = document.getElementById("nombreCompleto");
const emailAutocompletadoInput = document.getElementById("emailAutocompletado");

const ciudadesPorPais = {
  es: "Madrid",
  mx: "Ciudad de México",
  ar: "Buenos Aires",
  "": "", // Para cuando no hay selección
};

paisOrigenSelect.addEventListener("change", () => {
  ciudadSugeridaInput.value = ciudadesPorPais[paisOrigenSelect.value] || "";
});

nombreCompletoInput.addEventListener("input", () => {
  const nombre = nombreCompletoInput.value.trim();
  if (nombre.length > 2) {
    // Genera un email simple basado en el nombre
    const emailGenerado =
      nombre.toLowerCase().replace(/\s/g, ".") + "@dominio.com";
    emailAutocompletadoInput.value = emailGenerado;
  } else {
    emailAutocompletadoInput.value = "";
  }
});

// --- 3. Formularios dinámicos: Añadir/Eliminar Habilidades ---
const habilidadesContainer = document.getElementById("habilidadesContainer");
const addHabilidadButton = document.getElementById("addHabilidad");
let habilidadCounter = 0; // Para dar IDs únicos a los campos

function addHabilidadField(initialValue = "") {
  habilidadCounter++;
  const fieldGroup = document.createElement("div");
  fieldGroup.classList.add("field-group"); // Opcional, para estilo

  const label = document.createElement("label");
  label.textContent = `Habilidad ${habilidadCounter}:`;
  label.setAttribute("for", `habilidad${habilidadCounter}`);

  const input = document.createElement("input");
  input.type = "text";
  input.id = `habilidad${habilidadCounter}`;
  input.name = `habilidad-${habilidadCounter}`; // Nombre único para el envío
  input.placeholder = "Ej. JavaScript, CSS";
  input.value = initialValue;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "X";
  removeButton.style.backgroundColor = "red";
  removeButton.style.marginLeft = "10px";
  removeButton.onclick = () => {
    habilidadesContainer.removeChild(fieldGroup);
  };

  fieldGroup.appendChild(label);
  fieldGroup.appendChild(input);
  fieldGroup.appendChild(removeButton);
  habilidadesContainer.appendChild(fieldGroup);
}

addHabilidadButton.addEventListener("click", () => addHabilidadField());

// Añadir una habilidad inicial al cargar
document.addEventListener("DOMContentLoaded", () => addHabilidadField("HTML"));

// --- 4. Accesibilidad y Usabilidad: Sugerencias y Ayudas Contextuales ---
const lenguajeProgramacionInput = document.getElementById(
  "lenguajeProgramacion"
);
const lenguajeSuggestions = document.getElementById("lenguajeSuggestions");

const sugerenciasLenguajes = [
  "JavaScript",
  "Python",
  "Java",
  "C#",
  "C++",
  "PHP",
  "Ruby",
  "Go",
  "Swift",
  "Kotlin",
  "TypeScript",
  "Rust",
];

lenguajeProgramacionInput.addEventListener("input", () => {
  const inputValue = lenguajeProgramacionInput.value.toLowerCase();
  lenguajeSuggestions.innerHTML = ""; // Limpiar sugerencias anteriores

  if (inputValue.length > 0) {
    const filteredSuggestions = sugerenciasLenguajes.filter((lang) =>
      lang.toLowerCase().startsWith(inputValue)
    );

    if (filteredSuggestions.length > 0) {
      lenguajeSuggestions.classList.remove("hidden-field");
      filteredSuggestions.forEach((suggestion) => {
        const div = document.createElement("div");
        div.classList.add("suggestion-item");
        div.textContent = suggestion;
        div.addEventListener("click", () => {
          lenguajeProgramacionInput.value = suggestion;
          lenguajeSuggestions.classList.add("hidden-field"); // Ocultar después de seleccionar
        });
        lenguajeSuggestions.appendChild(div);
      });
    } else {
      lenguajeSuggestions.classList.add("hidden-field");
    }
  } else {
    lenguajeSuggestions.classList.add("hidden-field");
  }
});

// Ocultar sugerencias cuando el input pierde el foco
lenguajeProgramacionInput.addEventListener("blur", () => {
  // Un pequeño retraso para permitir el clic en una sugerencia
  setTimeout(() => {
    lenguajeSuggestions.classList.add("hidden-field");
  }, 100);
});
// Mostrar sugerencias cuando el input gana el foco
lenguajeProgramacionInput.addEventListener("focus", () => {
  // Solo mostrar si hay valor y sugerencias filtradas
  if (
    lenguajeProgramacionInput.value.length > 0 &&
    lenguajeSuggestions.children.length > 0
  ) {
    lenguajeSuggestions.classList.remove("hidden-field");
  }
});

// --- Recopilación y Envío Final del Formulario ---
interactiveForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = {};

  // Recopilar datos de campos estáticos
  formData.tipoServicio = tipoServicioSelect.value;
  formData.paisOrigen = paisOrigenSelect.value;
  formData.ciudadSugerida = ciudadSugeridaInput.value;
  formData.nombreCompleto = nombreCompletoInput.value;
  formData.emailAutocompletado = emailAutocompletadoInput.value;
  formData.lenguajeProgramacion = lenguajeProgramacionInput.value;
  formData.password = document.getElementById("password").value; // No enviar passwords reales así! Solo para demo.

  // Recopilar datos de campos condicionales
  if (!seccionPersonalizado.classList.contains("hidden-field")) {
    formData.descripcionPersonalizada = document.getElementById(
      "descripcionPersonalizada"
    ).value;
    formData.presupuesto = document.getElementById("presupuesto").value;
  }
  if (!seccionPremium.classList.contains("hidden-field")) {
    formData.soporte = document.getElementById("soporte").value;
  }

  // Recopilar datos de campos dinámicos (habilidades)
  formData.habilidades = [];
  document
    .querySelectorAll('#habilidadesContainer input[type="text"]')
    .forEach((input) => {
      if (input.value.trim() !== "") {
        formData.habilidades.push(input.value.trim());
      }
    });

  outputDiv.textContent = JSON.stringify(formData, null, 2);
  outputDiv.style.backgroundColor = "#d4edda";
  outputDiv.style.color = "#155724";

  console.log("Datos del formulario enviados:", formData);
  // Aquí enviarías `formData` a tu servidor...
});

interactiveForm.addEventListener("reset", () => {
  outputDiv.textContent =
    "Los datos del formulario aparecerán aquí al enviarlo.";
  outputDiv.style.backgroundColor = "#e9f7ef";
  outputDiv.style.color = "#28a745";
  // Restaurar estado inicial de campos dinámicos/condicionales
  habilidadesContainer.innerHTML = "";
  habilidadCounter = 0;
  addHabilidadField("HTML"); // Re-añadir el campo inicial
  toggleServiceSections(); // Restaurar visibilidad de secciones
  lenguajeSuggestions.classList.add("hidden-field"); // Ocultar sugerencias
});
