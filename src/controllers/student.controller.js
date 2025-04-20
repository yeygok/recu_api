import { connect } from '../config/db/connect.js';

// Obtener todos los estudiantes
export const showApiEstudiante = async (req, res) => {
  try {
    let sqlQuery = "SELECT * FROM Estudiante";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estudiantes", details: error.message });
  }
};

// Obtener estudiante por ID
export const showApiEstudianteId = async (req, res) => {
  try {
    const [result] = await connect.query('SELECT * FROM Estudiante WHERE id = ?', [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Estudiante no encontrado" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estudiante", details: error.message });
  }
};

// Crear un nuevo estudiante
export const createApiEstudiante = async (req, res) => {
  try {
    const { persona_id, curso_id } = req.body;

    if (!persona_id) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    let sqlQuery = "INSERT INTO Estudiante (persona_id, curso_id) VALUES (?, ?)";
    const [result] = await connect.query(sqlQuery, [persona_id, curso_id || null]);

    res.status(201).json({
      data: [{ id: result.insertId, persona_id, curso_id }],
      status: 201,
      message: "Estudiante creado exitosamente"
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear estudiante", details: error.message });
  }
};

// Actualizar detalles del estudiante
export const updateApiEstudiante = async (req, res) => {
  try {
    const { persona_id, curso_id } = req.body;
    const { id } = req.params;

    if (!persona_id) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    let sqlQuery = "UPDATE Estudiante SET persona_id = ?, curso_id = ? WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [persona_id, curso_id || null, id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Estudiante no encontrado" });
    res.status(200).json({
      data: [{ persona_id, curso_id }],
      status: 200,
      message: "Estudiante actualizado exitosamente",
      updated: result.changedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar estudiante", details: error.message });
  }
};

// Eliminar un estudiante
export const deleteApiEstudiante = async (req, res) => {
  try {
    const { id } = req.params;

    let sqlQuery = "DELETE FROM Estudiante WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Estudiante no encontrado" });
    res.status(200).json({
      data: [],
      status: 200,
      message: "Estudiante eliminado exitosamente",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar estudiante", details: error.message });
  }
};
