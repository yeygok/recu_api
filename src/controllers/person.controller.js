export const updateApiPersona = async (req, res) => {
  try {
    const { documento, nombre, edad, password } = req.body;
    const { id } = req.params;

    if (!documento || !nombre || !edad) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    let hashedPassword;
    if (password) {
      hashedPassword = await encryptPassword(password);
    }

    let sqlQuery = "UPDATE Persona SET documento=?, nombre=?, edad=? ";
    const values = [documento, nombre, edad];
    if (password) {
      sqlQuery += ", password = ?";
      values.push(hashedPassword);
    }
    sqlQuery += " WHERE id = ?";
    values.push(id);

    const [result] = await connect.query(sqlQuery, values);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Persona no encontrada" });

    res.status(200).json({
      data: [{ documento, nombre, edad }],
      status: 200,
      message: "Persona actualizada exitosamente",
      updated: result.changedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar persona", details: error.message });
  }
};

export const deleteApiPersona = async (req, res) => {
  try {
    const { id } = req.params;
    let sqlQuery = "DELETE FROM Persona WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Persona no encontrada" });
    res.status(200).json({
      data: [],
      status: 200,
      message: "Persona eliminada exitosamente",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar persona", details: error.message });
  }
};

export const loginApiPersona = async (req, res) => {
  try {
    const { nombre, password } = req.body;
    let sqlQuery = "SELECT * FROM Persona WHERE nombre = ?";
    const [result] = await connect.query(sqlQuery, [nombre]);
    if (result.length === 0) return res.status(400).json({ error: "Persona no encontrada" });
    const persona = result[0];
    const validPassword = await comparePassword(password, persona.password);
    if (!validPassword) return res.status(400).json({ error: "Contraseña incorrecta" });
    const token = jwt.sign(
      {
        id: persona.id,
        documento: persona.documento,
        nombre: persona.nombre,
        edad: persona.edad,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error durante el login", details: error.message });
  }
};
