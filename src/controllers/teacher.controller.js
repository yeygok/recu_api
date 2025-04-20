import { connect } from '../config/db/connect.js';

// Obtener todos los profesores
export const showApiProfesor = async (req, res) => {
  try {
    let sqlQuery = "SELECT * FROM Profesor";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener profesores", details: error.message });
  }
};

// Obtener profesor por ID
export const showApiProfesorId = async (req, res) => {
  try {
    const [result] = await connect.query('SELECT * FROM Profesor WHERE id = ?', [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Profesor no encontrado" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener profesor", details: error.message });
  }
};

// Crear un nuevo profesor
export const createApiProfesor = async (req, res) => {
  try {
    const { persona_id, especialidad } = req.body;

    if (!persona_id) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    let sqlQuery = "INSERT INTO Profesor (persona_id, especialidad) VALUES (?, ?)";
    const [result] = await connect.query(sqlQuery, [persona_id, especialidad || null]);

    res.status(201).json({
      data: [{ id: result.insertId, persona_id, especialidad }],
      status: 201,
      message: "Profesor creado exitosamente"
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear profesor", details: error.message });
  }
};

// Actualizar detalles del profesor
export const updateApiProfesor = async (req, res) => {
  try {
    const { persona_id, especialidad } = req.body;
    const { id } = req.params;

    if (!persona_id) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    let sqlQuery = "UPDATE Profesor SET persona_id = ?, especialidad = ? WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [persona_id, especialidad || null, id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Profesor no encontrado" });
    res.status(200).json({
      data: [{ persona_id, especialidad }],
      status: 200,
      message: "Profesor actualizado exitosamente",
      updated: result.changedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar profesor", details: error.message });
  }
};

// Eliminar un profesor
export const deleteApiProfesor = async (req, res) => {
  try {
    const { id } = req.params;

    let sqlQuery = "DELETE FROM Profesor WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Profesor no encontrado" });
    res.status(200).json({
      data: [],
      status: 200,
      message: "Profesor eliminado exitosamente",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar profesor", details: error.message });
  }
};
