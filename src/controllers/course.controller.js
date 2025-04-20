// Crear un nuevo curso
export const createApiCurso = async (req, res) => {
  try {
    const { nombre, profesor_id } = req.body;

    if (!nombre || !profesor_id) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    let sqlQuery = "INSERT INTO Curso (nombre, profesor_id) VALUES (?, ?)";
    const [result] = await connect.query(sqlQuery, [nombre, profesor_id]);

    res.status(201).json({
      data: [{ id: result.insertId, nombre, profesor_id }],
      status: 201,
      message: "Curso creado exitosamente"
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear curso", details: error.message });
  }
};

// Actualizar detalles del curso
export const updateApiCurso = async (req, res) => {
  try {
    const { nombre, profesor_id } = req.body;
    const { id } = req.params;

    if (!nombre || !profesor_id) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    let sqlQuery = "UPDATE Curso SET nombre = ?, profesor_id = ? WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [nombre, profesor_id, id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Curso no encontrado" });
    res.status(200).json({
      data: [{ nombre, profesor_id }],
      status: 200,
      message: "Curso actualizado exitosamente",
      updated: result.changedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar curso", details: error.message });
  }
};

// Eliminar un curso
export const deleteApiCurso = async (req, res) => {
  try {
    const { id } = req.params;

    let sqlQuery = "DELETE FROM Curso WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Curso no encontrado" });
    res.status(200).json({
      data: [],
      status: 200,
      message: "Curso eliminado exitosamente",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar curso", details: error.message });
  }
};
