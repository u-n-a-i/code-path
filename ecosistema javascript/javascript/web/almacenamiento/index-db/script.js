const itemIdInput = document.getElementById("itemId");
const itemNameInput = document.getElementById("itemName");
const itemQuantityInput = document.getElementById("itemQuantity");
const outputDiv = document.getElementById("output");

let db; // Variable global para la conexión a la base de datos
const DB_NAME = "MiTiendaDB";
const DB_VERSION = 1; // Incrementa para actualizar el esquema de la DB
const OBJECT_STORE_NAME = "productos";

function showOutput(message, isError = false) {
  outputDiv.textContent = message;
  outputDiv.style.color = isError ? "red" : "green";
  console.log(message);
}

// --- 1. Abrir/Crear la base de datos ---
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      showOutput("Error al abrir la base de datos.", true);
      console.error("IndexedDB error:", event.target.errorCode);
      reject("Database error");
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      showOutput("Base de datos abierta con éxito.");
      console.log("IndexedDB opened:", db);
      resolve(db);
    };

    // Esto se ejecuta si la versión de la base de datos ha cambiado o si se crea por primera vez
    request.onupgradeneeded = (event) => {
      db = event.target.result;
      showOutput("Actualización de la base de datos o creación inicial.");
      console.log("IndexedDB upgrade needed:", db);

      if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        // Crea un almacén de objetos con 'id' como clave primaria auto-incrementable
        const objectStore = db.createObjectStore(OBJECT_STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        // Crea un índice para buscar por nombre
        objectStore.createIndex("nombre", "nombre", { unique: false });
        showOutput(`Almacén de objetos '${OBJECT_STORE_NAME}' creado.`);
      }
    };
  });
}

// Llamar para abrir la DB al cargar la página
document.addEventListener("DOMContentLoaded", openDatabase);

// --- 2. Añadir o Actualizar un elemento ---
async function addOrUpdateItem() {
  if (!db) {
    showOutput("La base de datos no está abierta. Intentando abrir...", true);
    await openDatabase();
    if (!db) {
      showOutput("Fallo al abrir la DB. No se puede añadir/actualizar.", true);
      return;
    }
  }

  const id = parseInt(itemIdInput.value);
  const name = itemNameInput.value.trim();
  const quantity = parseInt(itemQuantityInput.value);

  if (isNaN(id) || !name || isNaN(quantity)) {
    showOutput("Por favor, rellena ID, Nombre y Cantidad válidos.", true);
    return;
  }

  const item = {
    id: id,
    nombre: name,
    cantidad: quantity,
    timestamp: new Date(),
  };

  // Iniciar una transacción de escritura
  const transaction = db.transaction([OBJECT_STORE_NAME], "readwrite");
  const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

  const request = objectStore.put(item); // `put` para añadir o actualizar (si el id ya existe)

  request.onsuccess = () => {
    showOutput(`Elemento ${item.nombre} (ID: ${item.id}) añadido/actualizado.`);
  };

  request.onerror = (event) => {
    showOutput(
      `Error al añadir/actualizar elemento: ${event.target.error}`,
      true
    );
  };

  transaction.oncomplete = () => {
    console.log("Transacción addOrUpdateItem completada.");
  };
}

// --- 3. Obtener un elemento por ID ---
async function getItem() {
  if (!db) {
    showOutput("La base de datos no está abierta. Intentando abrir...", true);
    await openDatabase();
    if (!db) {
      showOutput("Fallo al abrir la DB. No se puede obtener.", true);
      return;
    }
  }
  const id = parseInt(itemIdInput.value);
  if (isNaN(id)) {
    showOutput("Por favor, introduce un ID válido para obtener.", true);
    return;
  }

  const transaction = db.transaction([OBJECT_STORE_NAME], "readonly");
  const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

  const request = objectStore.get(id); // Obtener por clave primaria

  request.onsuccess = (event) => {
    const item = event.target.result;
    if (item) {
      showOutput(`Elemento encontrado: ${JSON.stringify(item, null, 2)}`);
      console.log("Item found:", item);
    } else {
      showOutput(`Elemento con ID ${id} no encontrado.`, true);
    }
  };

  request.onerror = (event) => {
    showOutput(`Error al obtener elemento: ${event.target.error}`, true);
  };
}

// --- 4. Obtener todos los elementos ---
async function getAllItems() {
  if (!db) {
    showOutput("La base de datos no está abierta. Intentando abrir...", true);
    await openDatabase();
    if (!db) {
      showOutput("Fallo al abrir la DB. No se puede obtener.", true);
      return;
    }
  }

  const transaction = db.transaction([OBJECT_STORE_NAME], "readonly");
  const objectStore = transaction.objectStore(OBJECT_STORE_NAME);
  const request = objectStore.getAll(); // Obtener todos los objetos

  request.onsuccess = (event) => {
    const items = event.target.result;
    if (items.length > 0) {
      showOutput(`Todos los elementos:\n${JSON.stringify(items, null, 2)}`);
      console.log("All items:", items);
    } else {
      showOutput("No hay elementos en el almacén.", true);
    }
  };

  request.onerror = (event) => {
    showOutput(
      `Error al obtener todos los elementos: ${event.target.error}`,
      true
    );
  };
}

// --- 5. Eliminar un elemento por ID ---
async function deleteItem() {
  if (!db) {
    showOutput("La base de datos no está abierta. Intentando abrir...", true);
    await openDatabase();
    if (!db) {
      showOutput("Fallo al abrir la DB. No se puede eliminar.", true);
      return;
    }
  }
  const id = parseInt(itemIdInput.value);
  if (isNaN(id)) {
    showOutput("Por favor, introduce un ID válido para eliminar.", true);
    return;
  }

  const transaction = db.transaction([OBJECT_STORE_NAME], "readwrite");
  const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

  const request = objectStore.delete(id); // Eliminar por clave primaria

  request.onsuccess = () => {
    showOutput(`Elemento con ID ${id} eliminado.`);
  };

  request.onerror = (event) => {
    showOutput(`Error al eliminar elemento: ${event.target.error}`, true);
  };
}

// --- 6. Vaciar todo el almacén de objetos ---
async function clearStore() {
  if (!db) {
    showOutput("La base de datos no está abierta. Intentando abrir...", true);
    await openDatabase();
    if (!db) {
      showOutput("Fallo al abrir la DB. No se puede vaciar.", true);
      return;
    }
  }
  const transaction = db.transaction([OBJECT_STORE_NAME], "readwrite");
  const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

  const request = objectStore.clear();

  request.onsuccess = () => {
    showOutput(`Almacén de objetos '${OBJECT_STORE_NAME}' vaciado.`);
  };

  request.onerror = (event) => {
    showOutput(`Error al vaciar almacén: ${event.target.error}`, true);
  };
}

// --- 7. Eliminar la base de datos completa ---
function deleteDatabase() {
  const request = indexedDB.deleteDatabase(DB_NAME);

  request.onsuccess = () => {
    showOutput(`Base de datos '${DB_NAME}' eliminada por completo.`);
    db = null; // Resetear la conexión a la DB
  };

  request.onerror = (event) => {
    showOutput(
      `Error al eliminar la base de datos: ${event.target.error}`,
      true
    );
  };
}
