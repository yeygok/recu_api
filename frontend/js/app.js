// URL base de la API
const apiBaseUrl = 'http://localhost:3000';

let token = null;

// Elementos DOM para Estudiante
const estudianteSection = document.getElementById('estudiante-section');
const estudianteForm = document.getElementById('estudiante-form');
const estudiantesTableBody = document.querySelector('#estudiantes-table tbody');
const cancelEstudianteEditBtn = document.getElementById('cancel-estudiante-edit');

let editEstudianteId = null;

// Función para cargar estudiantes
async function loadEstudiantes() {
  try {
    const res = await fetch(`${apiBaseUrl}/estudiante`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al cargar estudiantes');
    const estudiantes = await res.json();
    renderEstudiantes(estudiantes);
  } catch (error) {
    alert(error.message);
  }
}

// Función para renderizar tabla de estudiantes
function renderEstudiantes(estudiantes) {
  estudiantesTableBody.innerHTML = '';
  estudiantes.forEach(e => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${e.id}</td>
      <td>${e.nombre}</td>
      <td>${e.documento}</td>
      <td>
        <button data-id="${e.id}" class="edit-estudiante-btn">Editar</button>
        <button data-id="${e.id}" class="delete-estudiante-btn">Eliminar</button>
      </td>
    `;
    estudiantesTableBody.appendChild(tr);
  });
}

// Manejar submit del formulario de estudiante
estudianteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = estudianteForm['nombre'].value.trim();
  const documento = estudianteForm['documento'].value.trim();

  if (!nombre || !documento) {
    alert('Por favor completa todos los campos obligatorios.');
    return;
  }

  const body = { nombre, documento };

  try {
    let res;
    if (editEstudianteId === null) {
      res = await fetch(`${apiBaseUrl}/estudiante`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } else {
      res = await fetch(`${apiBaseUrl}/estudiante/${editEstudianteId}`, {
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

    estudianteForm.reset();
    editEstudianteId = null;
    cancelEstudianteEditBtn.style.display = 'none';
    loadEstudiantes();
  } catch (error) {
    alert('Error de conexión');
  }
});

// Manejar eventos de la tabla de estudiantes (editar, eliminar)
estudiantesTableBody.addEventListener('click', async (e) => {
  if (e.target.classList.contains('edit-estudiante-btn')) {
    const id = e.target.dataset.id;
    try {
      const res = await fetch(`${apiBaseUrl}/estudiante/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al obtener estudiante');
      const estudiante = await res.json();
      estudianteForm['nombre'].value = estudiante.nombre;
      estudianteForm['documento'].value = estudiante.documento;
      editEstudianteId = id;
      cancelEstudianteEditBtn.style.display = 'inline';
    } catch (error) {
      alert(error.message);
    }
  } else if (e.target.classList.contains('delete-estudiante-btn')) {
    const id = e.target.dataset.id;
    if (!confirm('¿Estás seguro de eliminar este estudiante?')) return;
    try {
      const res = await fetch(`${apiBaseUrl}/estudiante/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || 'Error al eliminar estudiante');
        return;
      }
      loadEstudiantes();
    } catch (error) {
      alert('Error de conexión');
    }
  }
});

// Cancelar edición de estudiante
cancelEstudianteEditBtn.addEventListener('click', () => {
  estudianteForm.reset();
  editEstudianteId = null;
  cancelEstudianteEditBtn.style.display = 'none';
});

// Inicializar carga de estudiantes al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  loadEstudiantes();
});
