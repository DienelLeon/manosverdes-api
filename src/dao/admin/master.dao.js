// src/dao/admin/master.dao.js
const dbMod = require("../../db");
const db = dbMod.pool || dbMod;

function pickFirstRow(callResult) {
  const rows = callResult?.[0];
  if (!rows) return null;
  if (Array.isArray(rows) && Array.isArray(rows[0])) return rows[0][0] || null;
  if (Array.isArray(rows)) return rows[0] || null;
  return null;
}

// Obtener un registro por ID
async function obtenerPorId(id) {
  const [rows] = await db.query(
    "SELECT * FROM master_table WHERE id_master_table = ?",
    [id],
  );
  return rows?.[0] || null;
}

// Obtener padres (sin parent)
async function obtenerPadres(filters = {}) {
  let query = "SELECT * FROM master_table WHERE id_master_table_parent IS NULL";
  const params = [];

  if (filters.search) {
    query += " AND (name LIKE ? OR description LIKE ?)";
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm);
  }

  if (filters.state) {
    query += " AND state = ?";
    params.push(filters.state);
  }

  query += " ORDER BY ordering ASC, id_master_table ASC";

  if (filters.limit && filters.offset !== undefined) {
    query += " LIMIT ? OFFSET ?";
    params.push(filters.limit, filters.offset);
  }

  const [rows] = await db.query(query, params);
  return rows || [];
}

// Obtener hijos de un padre
async function obtenerHijos(parentId, filters = {}) {
  let query = "SELECT * FROM master_table WHERE id_master_table_parent = ?";
  const params = [parentId];

  if (filters.search) {
    query += " AND (name LIKE ? OR description LIKE ? OR value LIKE ?)";
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (filters.state) {
    query += " AND state = ?";
    params.push(filters.state);
  }

  query += " ORDER BY ordering ASC, id_master_table ASC";

  if (filters.limit && filters.offset !== undefined) {
    query += " LIMIT ? OFFSET ?";
    params.push(filters.limit, filters.offset);
  }

  const [rows] = await db.query(query, params);
  return rows || [];
}

// Obtener todos los registros (con filtros)
async function obtenerTodos(filters = {}) {
  let query = "SELECT * FROM master_table WHERE 1=1";
  const params = [];

  if (filters.parent_id !== undefined && filters.parent_id !== null) {
    query += " AND id_master_table_parent = ?";
    params.push(filters.parent_id);
  }

  if (filters.search) {
    query += " AND (name LIKE ? OR description LIKE ? OR value LIKE ?)";
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (filters.state) {
    query += " AND state = ?";
    params.push(filters.state);
  }

  query +=
    " ORDER BY id_master_table_parent ASC, ordering ASC, id_master_table ASC";

  if (filters.limit && filters.offset !== undefined) {
    query += " LIMIT ? OFFSET ?";
    params.push(filters.limit, filters.offset);
  }

  const [rows] = await db.query(query, params);
  return rows || [];
}

// Contar registros (para paginación)
async function contar(filters = {}) {
  let query = "SELECT COUNT(*) as total FROM master_table WHERE 1=1";
  const params = [];

  if (filters.parent_id !== undefined && filters.parent_id !== null) {
    query += " AND id_master_table_parent = ?";
    params.push(filters.parent_id);
  }

  if (filters.search) {
    query += " AND (name LIKE ? OR description LIKE ? OR value LIKE ?)";
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (filters.state) {
    query += " AND state = ?";
    params.push(filters.state);
  }

  const [rows] = await db.query(query, params);
  return rows?.[0]?.total || 0;
}

// Crear un nuevo registro
async function crear(data) {
  const {
    id_master_table,
    id_master_table_parent,
    value,
    description,
    name,
    ordering,
    add_additional_one,
    add_additional_two,
    add_additional_three,
    user_now,
    state,
  } = data;

  const query = `
    INSERT INTO master_table (
      id_master_table, id_master_table_parent, value, description, name, 
      ordering, add_additional_one, add_additional_two, add_additional_three, 
      user_now, state
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await db.query(query, [
    id_master_table,
    id_master_table_parent || null,
    value,
    description || null,
    name,
    ordering || 0,
    add_additional_one || null,
    add_additional_two || null,
    add_additional_three || null,
    user_now,
    state || "activo",
  ]);

  return await obtenerPorId(id_master_table);
}

// Actualizar un registro
async function actualizar(id, data) {
  const {
    value,
    description,
    name,
    ordering,
    add_additional_one,
    add_additional_two,
    add_additional_three,
    user_edit,
    state,
  } = data;

  const query = `
    UPDATE master_table SET 
      value = ?, description = ?, name = ?, ordering = ?,
      add_additional_one = ?, add_additional_two = ?, add_additional_three = ?,
      user_edit = ?, date_edit = NOW(), state = ?
    WHERE id_master_table = ?
  `;

  await db.query(query, [
    value,
    description || null,
    name,
    ordering || 0,
    add_additional_one || null,
    add_additional_two || null,
    add_additional_three || null,
    user_edit,
    state,
    id,
  ]);

  return await obtenerPorId(id);
}

// Eliminar un registro
async function eliminar(id) {
  const [result] = await db.query(
    "DELETE FROM master_table WHERE id_master_table = ?",
    [id],
  );
  return result?.affectedRows || 0;
}

// Verificar si existe un ID
async function existeId(id) {
  const [rows] = await db.query(
    "SELECT 1 FROM master_table WHERE id_master_table = ? LIMIT 1",
    [id],
  );
  return !!rows?.[0];
}

// Obtener siguiente ID de padre (en múltiplos de 100: 100, 200, 300, etc)
async function obtenerSiguienteIdPadre() {
  const [rows] = await db.query(
    "SELECT MAX(id_master_table) as max_id FROM master_table WHERE id_master_table_parent IS NULL",
  );
  const maxId = rows?.[0]?.max_id || 0;
  // Redondear al siguiente múltiplo de 100
  return Math.ceil((maxId + 1) / 100) * 100;
}

// Obtener siguiente ID disponible dentro del rango del padre
async function obtenerSiguienteIdHijo(parentId) {
  // Calcular rango: si padre es 100, rango es 101-199; si es 200, es 201-299, etc
  const rangoInicio = parentId + 1;
  const rangoFin = parentId + 99;

  const [rows] = await db.query(
    "SELECT MAX(id_master_table) as max_id FROM master_table WHERE id_master_table BETWEEN ? AND ?",
    [rangoInicio, rangoFin],
  );

  const maxId = rows?.[0]?.max_id || rangoInicio - 1;

  // Si ya llegó al máximo del rango (ej: 199 para padre 100), lanzar error
  if (maxId >= rangoFin) {
    throw new Error(
      `Límite de hijos alcanzado para el padre ${parentId}. Máximo: 99 hijos.`,
    );
  }

  return maxId + 1;
}

module.exports = {
  obtenerPorId,
  obtenerPadres,
  obtenerHijos,
  obtenerTodos,
  contar,
  crear,
  actualizar,
  eliminar,
  existeId,
  obtenerSiguienteIdPadre,
  obtenerSiguienteIdHijo,
};
