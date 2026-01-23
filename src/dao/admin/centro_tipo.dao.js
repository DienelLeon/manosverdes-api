const dbMod = require('../../db');
const db = dbMod.pool || dbMod;

function pickTable(r) {
  const rows = r?.[0];
  if (!rows) return [];
  if (Array.isArray(rows) && Array.isArray(rows[0])) return rows[0] || [];
  if (Array.isArray(rows)) return rows || [];
  return [];
}
function pickFirstRow(r) {
  const rows = r?.[0];
  if (!rows) return null;
  if (Array.isArray(rows) && Array.isArray(rows[0])) return rows[0][0] || null;
  if (Array.isArray(rows)) return rows[0] || null;
  return null;
}

exports.list = async () => pickTable(await db.query('SELECT id, nombre FROM centro_tipo ORDER BY nombre'));
exports.get = async (id) => pickFirstRow(await db.query('SELECT id, nombre FROM centro_tipo WHERE id = ? LIMIT 1', [id]));
exports.create = async (nombre) => {
  await db.query('INSERT INTO centro_tipo (nombre) VALUES (?)', [nombre]);
  const r = await db.query('SELECT LAST_INSERT_ID() AS id');
  return r?.[0]?.[0]?.id || null;
};
exports.update = async (id, nombre) => {
  await db.query('UPDATE centro_tipo SET nombre = ? WHERE id = ?', [nombre, id]);
  const r = await db.query('SELECT ROW_COUNT() AS affected');
  return Number(r?.[0]?.[0]?.affected || 0);
};
exports.delete = async (id) => {
  await db.query('DELETE FROM centro_tipo WHERE id = ?', [id]);
  const r = await db.query('SELECT ROW_COUNT() AS affected');
  return Number(r?.[0]?.[0]?.affected || 0);
};
