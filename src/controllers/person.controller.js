import { connect } from '../config/db/connect.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Obtener todas las personas
export const showApiPersona = async (req, res) => {
  try {
    const [result] = await connect.query('SELECT id, documento, nombre, edad FROM Persona');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener personas", details: error.message });
  }
};

// Obtener persona por ID
export const showApiPersonaId = async (req, res) => {
  try {
    const [result] = await connect.query('SELECT id, documento, nombre, edad FROM Persona WHERE id = ?', [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Persona no encontrada" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener persona", details: error.message });
  }
};

// Crear una persona
export const createApiPersona = async (req, res) => {
  try {
    const { documento, nombre, edad, password } = req.body;

    if (!documento || !nombre || !edad || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await connect.query(
      'INSERT INTO Persona (documento, nombre, edad, password) VALUES (?, ?, ?, ?)',
      [documento, nombre, edad, hashedPassword]
    );

    res.status(201).json({
      data: [{ id: result.insertId, documento, nombre, edad }],
      status: 201,
      message: "Persona creada exitosamente"
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear persona", details: error.message });
  }
};

// Actualizar persona
export const updateApiPersona = async (req, res) => {
  try {
    const { documento, nombre, edad, password } = req.body;
    const { id } = req.params;

    if (!documento || !nombre || !edad) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const [result] = await connect.query(
      'UPDATE Persona SET documento = ?, nombre = ?, edad = ?, password = COALESCE(?, password) WHERE id = ?',
      [documento, nombre, edad, hashedPassword, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: "Persona no encontrada" });

    res.status(200).json({
      data: [{ documento, nombre, edad }],
      status: 200,
      message: "Persona actualizada exitosamente"
    });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar persona", details: error.message });
  }
};

// Eliminar persona
export const deleteApiPersona = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await connect.query('DELETE FROM Persona WHERE id = ?', [id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Persona no encontrada" });

    res.status(200).json({
      data: [],
      status: 200,
      message: "Persona eliminada exitosamente"
    });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar persona", details: error.message });
  }
};

// Login persona
export const loginApiPersona = async (req, res) => {
  try {
    const { documento, password } = req.body;

    if (!documento || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const [rows] = await connect.query('SELECT * FROM Persona WHERE documento = ?', [documento]);
    if (rows.length === 0) return res.status(401).json({ error: "Credenciales inválidas" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = jwt.sign({ id: user.id, documento: user.documento }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error en login", details: error.message });
  }
};
