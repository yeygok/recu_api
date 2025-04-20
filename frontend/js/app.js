const apiBaseUrl = 'http://localhost:3000';

let token = null;

// Elementos DOM
const loginSection = document.getElementById('login-section');
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');

const crudSection = document.getElementById('crud-section');
const personaForm = document.getElementById('persona-form');
const personasTableBody = document.querySelector('#personas-table tbody');
const cancelEditBtn = document.getElementById('cancel-edit');

let editId = null;

// Función para mostrar mensaje de error o éxito en login
function showLoginMessage(message, isError = true) {
  loginMessage.textContent = message;
  loginMessage.style.color = isError ? 'red' : 'green';
}

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const documento = loginForm.documento.value.trim();
  const password = loginForm.password.value.trim();

  if (!documento || !password) {
    showLoginMessage('Por favor ingresa documento y contraseña.');
    return;
  }

  try {
    const res = await fetch(`${apiBaseUrl}/personaLogin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documento, password })
    });

    if (!res.ok) {
      const errorData = await res.json();
      showLoginMessage(errorData.error || 'Error en login');
      return;
    }

    const data = await res.json();
    token = data.token;
    loginSection.style.display = 'none';
    crudSection.style.display = 'block';
    showLoginMessage('');
    loadPersonas();
  } catch (error) {
    showLoginMessage('Error de conexión');
  }
});

// Cargar personas
async function loadPersonas() {
  try {
    const res = await fetch(`${apiBaseUrl}/persona`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al cargar personas');
    const personas = await res.json();
    renderPersonas(personas);
  } catch (error) {
    alert(error.message);
  }
}

// Renderizar tabla de personas
function renderPersonas(personas) {
  personasTableBody.innerHTML = '';
  personas.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.documento}</td>
      <td>${p.nombre}</td>
      <td>${p.edad}</td>
      <td>
        <button data-id="${p.id}" class="edit-btn">Editar</button>
        <button data-id="${p.id}" class="delete-btn">Eliminar</button>
      </td>
    `;
    personasTableBody.appendChild(tr);
  });
}

// Manejar formulario para crear o actualizar persona
personaForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const documento = personaForm.documento.value.trim();
  const nombre = personaForm.nombre.value.trim();
  const edad = parseInt(personaForm.edad.value.trim());
  const password = personaForm.password.value.trim();

  if (!documento || !nombre || !edad || (editId === null && !password)) {
    alert('Por favor completa todos los campos obligatorios.');
    return;
  }

  const body = { documento, nombre, edad };
  if (password) body.password = password;

  try {
    let res;
    if (editId === null) {
      // Crear
      res = await fetch(`${apiBaseUrl}/persona`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } else {
      // Actualizar
      res = await fetch(`${apiBaseUrl}/persona/${editId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
    }

    if (!res.ok) {
      const errorData = await res.json();
      alert(errorData.error || 'Error en la operación');
      return;
    }

    personaForm.reset();
    editId = null;
    cancelEditBtn.style.display = 'none';
    loadPersonas();
  } catch (error) {
    alert('Error de conexión');
  }
});

// Manejar botones de editar y eliminar
personasTableBody.addEventListener('click', async (e) => {
  if (e.target.classList.contains('edit-btn')) {
    const id = e.target.dataset.id;
    try {
      const res = await fetch(`${apiBaseUrl}/persona/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al obtener persona');
      const persona = await res.json();
      personaForm.documento.value = persona.documento;
      personaForm.nombre.value = persona.nombre;
      personaForm.edad.value = persona.edad;
      editId = id;
      cancelEditBtn.style.display = 'inline';
    } catch (error) {
      alert(error.message);
    }
  } else if (e.target.classList.contains('delete-btn')) {
    const id = e.target.dataset.id;
    if (!confirm('¿Estás seguro de eliminar esta persona?')) return;
    try {
      const res = await fetch(`${apiBaseUrl}/persona/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || 'Error al eliminar persona');
        return;
      }
      loadPersonas();
    } catch (error) {
      alert('Error de conexión');
    }
  }
});

// Cancelar edición
cancelEditBtn.addEventListener('click', () => {
  personaForm.reset();
  editId = null;
  cancelEditBtn.style.display = 'none';
});
