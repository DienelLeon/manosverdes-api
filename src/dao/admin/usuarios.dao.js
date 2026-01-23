const dbMod = require('../../db');
const db = dbMod.pool || dbMod;

function pickFirstRow(r) {
  const rows = r?.[0];
  if (!rows) return null;
  if (Array.isArray(rows) && Array.isArray(rows[0])) return rows[0][0] || null;
  if (Array.isArray(rows)) return rows[0] || null;
  return null;
}
function pickTable(r) {
  const rows = r?.[0];
  if (!rows) return [];
  if (Array.isArray(rows) && Array.isArray(rows[0])) return rows[0] || [];
  if (Array.isArray(rows)) return rows || [];
  return [];
}

exports.list = async (limit = 50, offset = 0, q = null) => {
  const params = [];
  let where = '';
  if (q) {
    where = "WHERE (u.nombre LIKE ? OR u.apellido_paterno LIKE ? OR u.apellido_materno LIKE ? OR u.email LIKE ?)";
    const like = `%${q}%`;
    params.push(like, like, like, like);
  }
  params.push(Number(limit) || 50, Number(offset) || 0);
  const sql = `SELECT u.id, u.nombre, u.apellido_paterno, u.apellido_materno, u.email, u.telefono, u.estado, u.rol_id, r.clave AS rol_clave, ua.email_verificado, u.avatar_key, u.creado_en, u.actualizado_en
    FROM usuario u
    LEFT JOIN rol r ON r.id = u.rol_id
    LEFT JOIN usuario_auth ua ON ua.usuario_id = u.id
    ${where}
    ORDER BY u.nombre
    LIMIT ? OFFSET ?`;
  return pickTable(await db.query(sql, params));
};

exports.count = async (q = null) => {
  let sql = 'SELECT COUNT(*) AS total FROM usuario u';
  const params = [];
  if (q) {
    sql += " WHERE (u.nombre LIKE ? OR u.apellido_paterno LIKE ? OR u.apellido_materno LIKE ? OR u.email LIKE ?)";
    const like = `%${q}%`;
    params.push(like, like, like, like);
  }
  const row = pickFirstRow(await db.query(sql, params));
  return Number(row?.total || 0);
};

exports.get = async (id) => pickFirstRow(await db.query(
  `SELECT u.id, u.nombre, u.apellido_paterno, u.apellido_materno, u.email, u.telefono, u.estado, u.rol_id, r.clave AS rol_clave, ua.email_verificado, u.avatar_key, u.creado_en, u.actualizado_en
   FROM usuario u
   LEFT JOIN rol r ON r.id = u.rol_id
   LEFT JOIN usuario_auth ua ON ua.usuario_id = u.id
   WHERE u.id = ? LIMIT 1`, [id]
));

exports.update = async (id, data) => {
  const params = [
    data.nombre,
    data.apellido_paterno,
    data.apellido_materno ?? null,
    data.email,
    data.telefono ?? null,
    data.rol_id,
    data.estado ?? 'activo',
    id
  ];
  await db.query(
    `UPDATE usuario SET nombre=?, apellido_paterno=?, apellido_materno=?, email=?, telefono=?, rol_id=?, estado=? WHERE id = ?`, params
  );
  const row = pickFirstRow(await db.query('SELECT ROW_COUNT() AS affected'));
  return Number(row?.affected || 0);
};

exports.delete = async (id) => {
  await db.query('DELETE FROM usuario WHERE id = ?', [id]);
  const row = pickFirstRow(await db.query('SELECT ROW_COUNT() AS affected'));
  return Number(row?.affected || 0);
};
