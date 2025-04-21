// URL base de la API
const apiBaseUrl = 'http://localhost:3000';

let token = null;

// Elementos DOM para estudiantes
const estudianteSection = document.getElementById('estudiante-section');
const estudianteForm = document.getElementById('estudiante-form');
const estudiantesTableBody = document.querySelector('#estudiantes-table tbody');
const cancelEstudianteEditBtn = document.getElementById('cancel-estudiante-edit');

let editEstudianteId = null;

// Elementos DOM para cursos
const cursoSection = document.getElementById('curso-section');
const cursoForm = document.getElementById('curso-form');
const cursosTableBody = document.querySelector('#cursos-table tbody');
const cancelCursoEditBtn = document.getElementById('cancel-curso-edit');

let editCursoId = null;

// Función genérica para hacer llamadas a la API con token y manejo de errores
async function apiRequest(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const options = {
    method,
    headers,
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(`${apiBaseUrl}${endpoint}`, options);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error en la operación');
  }
  return response.json();
}

// Funciones para estudiantes

// Cargar estudiantes y renderizar tabla
async function loadEstudiantes() {
  try {
    const estudiantes = await apiRequest('/estudiante');
    renderEstudiantes(estudiantes);
  } catch (error) {
    alert(error.message);
  }
}

// Renderizar tabla de estudiantes
function renderEstudiantes(estudiantes) {
  estudiantesTableBody.innerHTML = '';
  estudiantes.forEach(({ id, persona_id, curso_id }) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${id}</td>
      <td>${persona_id}</td>
      <td>${curso_id || ''}</td>
      <td>
        <button data-id="${id}" class="edit-btn">Editar</button>
        <button data-id="${id}" class="delete-btn">Eliminar</button>
      </td>
    `;
    estudiantesTableBody.appendChild(tr);
  });
}

// Manejar submit del formulario para crear o actualizar estudiante
estudianteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const persona_id = parseInt(estudianteForm.persona_id.value.trim());
  const curso_id_raw = estudianteForm.curso_id.value.trim();
  const curso_id = curso_id_raw === '' ? null : parseInt(curso_id_raw);

  if (!persona_id) {
    alert('El campo ID Persona es obligatorio.');
    return;
  }

  const body = { persona_id, curso_id };

  try {
    if (editEstudianteId === null) {
      await apiRequest('/estudiante', 'POST', body);
    } else {
      await apiRequest(`/estudiante/${editEstudianteId}`, 'PUT', body);
    }
    resetEstudianteForm();
    loadEstudiantes();
  } catch (error) {
    alert(error.message);
  }
});

// Manejar eventos de la tabla de estudiantes (editar, eliminar)
estudiantesTableBody.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains('edit-btn')) {
    try {
      const estudiante = await apiRequest(`/estudiante/${id}`);
      estudianteForm.persona_id.value = estudiante.persona_id;
      estudianteForm.curso_id.value = estudiante.curso_id || '';
      editEstudianteId = id;
      cancelEstudianteEditBtn.style.display = 'inline';
    } catch (error) {
      alert(error.message);
    }
  } else if (e.target.classList.contains('delete-btn')) {
    if (!confirm('¿Estás seguro de eliminar este estudiante?')) return;
    try {
      await apiRequest(`/estudiante/${id}`, 'DELETE');
      loadEstudiantes();
    } catch (error) {
      alert(error.message);
    }
  }
});

// Cancelar edición estudiante
cancelEstudianteEditBtn.addEventListener('click', () => {
  resetEstudianteForm();
});

// Función para resetear formulario estudiante
function resetEstudianteForm() {
  estudianteForm.reset();
  editEstudianteId = null;
  cancelEstudianteEditBtn.style.display = 'none';
}

// Funciones para cursos

// Cargar cursos y renderizar tabla
async function loadCursos() {
  try {
    const cursos = await apiRequest('/curso');
    renderCursos(cursos);
  } catch (error) {
    alert(error.message);
  }
}

// Renderizar tabla de cursos
function renderCursos(cursos) {
  cursosTableBody.innerHTML = '';
  cursos.forEach(({ id, nombre, profesor_id }) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${id}</td>
      <td>${nombre}</td>
      <td>${profesor_id}</td>
      <td>
        <button data-id="${id}" class="edit-btn curso-edit-btn">Editar</button>
        <button data-id="${id}" class="delete-btn curso-delete-btn">Eliminar</button>
      </td>
    `;
    cursosTableBody.appendChild(tr);
  });
}

// Manejar submit del formulario para crear o actualizar curso
cursoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = cursoForm.nombre.value.trim();
  const profesor_id = parseInt(cursoForm.profesor_id.value.trim());

  if (!nombre || !profesor_id) {
    alert('Los campos Nombre y ID Profesor son obligatorios.');
    return;
  }

  const body = { nombre, profesor_id };

  try {
    if (editCursoId === null) {
      await apiRequest('/curso', 'POST', body);
    } else {
      await apiRequest(`/curso/${editCursoId}`, 'PUT', body);
    }
    resetCursoForm();
    loadCursos();
  } catch (error) {
    alert(error.message);
  }
});

// Manejar eventos de la tabla de cursos (editar, eliminar)
cursosTableBody.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains('curso-edit-btn')) {
    try {
      const curso = await apiRequest(`/curso/${id}`);
      cursoForm.nombre.value = curso.nombre;
      cursoForm.profesor_id.value = curso.profesor_id;
      editCursoId = id;
      cancelCursoEditBtn.style.display = 'inline';
    } catch (error) {
      alert(error.message);
    }
  } else if (e.target.classList.contains('curso-delete-btn')) {
    if (!confirm('¿Estás seguro de eliminar este curso?')) return;
    try {
      await apiRequest(`/curso/${id}`, 'DELETE');
      loadCursos();
    } catch (error) {
      alert(error.message);
    }
  }
});

// Cancelar edición curso
cancelCursoEditBtn.addEventListener('click', () => {
  resetCursoForm();
});

// Función para resetear formulario curso
function resetCursoForm() {
  cursoForm.reset();
  editCursoId = null;
  cancelCursoEditBtn.style.display = 'none';
}

// Inicializar carga de estudiantes y cursos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  loadEstudiantes();
  loadCursos();
});
