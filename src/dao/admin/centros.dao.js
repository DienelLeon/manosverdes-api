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
  let where = '';
  const params = [];
  if (q) {
    where = "WHERE (c.nombre LIKE ? OR c.direccion LIKE ? OR ct.nombre LIKE ? OR CONCAT(u.nombre,' ',u.apellido_paterno,' ',IFNULL(u.apellido_materno,'')) LIKE ? OR d.nombre LIKE ?)";
    const like = `%${q}%`;
    params.push(like, like, like, like, like);
  }
  params.push(Number(limit) || 50, Number(offset) || 0);
  const sql = `SELECT c.id, c.nombre, c.direccion, c.distrito_id, d.nombre AS distrito_nombre, c.tipo_id, ct.nombre AS tipo_nombre, c.telefono, c.horario, c.estado, c.lat, c.lng,
    CONCAT(u.nombre,' ',u.apellido_paterno,' ',IFNULL(u.apellido_materno,'')) AS usuario_nombre,
    cr.ruc AS representante_ruc, cr.razon_social AS representante_razon_social, cr.contacto_nombre AS representante_nombre, cr.contacto_tel AS representante_tel, cr.contacto_email AS representante_email
    FROM centro c
    LEFT JOIN centro_tipo ct ON ct.id = c.tipo_id
    LEFT JOIN usuario u ON u.id = c.usuario_id
    LEFT JOIN centro_representante cr ON cr.centro_id = c.id
    LEFT JOIN distrito d ON d.id = c.distrito_id
    ${where}
    ORDER BY c.nombre
    LIMIT ? OFFSET ?`;
  return pickTable(await db.query(sql, params));
};

exports.count = async (q = null) => {
  let sql = 'SELECT COUNT(*) AS total FROM centro c LEFT JOIN usuario u ON u.id = c.usuario_id LEFT JOIN distrito d ON d.id = c.distrito_id';
  const params = [];
  if (q) {
    sql += " WHERE (c.nombre LIKE ? OR c.direccion LIKE ? OR CONCAT(u.nombre,' ',u.apellido_paterno,' ',IFNULL(u.apellido_materno,'')) LIKE ? OR d.nombre LIKE ?)";
    const like = `%${q}%`;
    params.push(like, like, like, like);
  }
  const row = pickFirstRow(await db.query(sql, params));
  return Number(row?.total || 0);
};

exports.get = async (id) => pickFirstRow(await db.query(
  `SELECT c.id, c.nombre, c.direccion, c.distrito_id, d.nombre AS distrito_nombre, c.tipo_id, ct.nombre AS tipo_nombre, c.telefono, c.horario, c.estado, c.lat, c.lng,
    CONCAT(u.nombre,' ',u.apellido_paterno,' ',IFNULL(u.apellido_materno,'')) AS usuario_nombre,
    cr.ruc AS representante_ruc, cr.razon_social, cr.contacto_nombre AS representante_nombre, cr.contacto_tel, cr.contacto_email
   FROM centro c
   LEFT JOIN centro_tipo ct ON ct.id = c.tipo_id
   LEFT JOIN usuario u ON u.id = c.usuario_id
   LEFT JOIN centro_representante cr ON cr.centro_id = c.id
   LEFT JOIN distrito d ON d.id = c.distrito_id
   WHERE c.id = ? LIMIT 1`, [id]
));

exports.create = async (data) => {
  const row = pickFirstRow(await db.query(
    `INSERT INTO centro (usuario_id,nombre,direccion,distrito_id,tipo_id,telefono,horario,lat,lng,estado)
     VALUES (?,?,?,?,?,?,?,?,?,?)`, [
      data.usuario_id,
      data.nombre,
      data.direccion ?? null,
      data.distrito_id,
      data.tipo_id ?? null,
      data.telefono ?? null,
      data.horario ?? null,
      data.lat ?? null,
      data.lng ?? null,
      data.estado ?? 'activo'
    ]
  ));
  const idRow = pickFirstRow(await db.query('SELECT LAST_INSERT_ID() AS id'));
  return idRow?.id || null;
};

exports.update = async (id, data) => {
  const params = [
    data.usuario_id,
    data.nombre,
    data.direccion ?? null,
    data.distrito_id,
    data.tipo_id ?? null,
    data.telefono ?? null,
    data.horario ?? null,
    data.lat ?? null,
    data.lng ?? null,
    data.estado ?? 'activo',
    id
  ];
  const row = pickFirstRow(await db.query(
    `UPDATE centro SET usuario_id=?, nombre=?, direccion=?, distrito_id=?, tipo_id=?, telefono=?, horario=?, lat=?, lng=?, estado=? WHERE id = ?`, params
  ));
  // MySQL UPDATE with pool returns OkPacket in first element, pickFirstRow may be null; instead run SELECT ROW_COUNT()
  const affectedRow = pickFirstRow(await db.query('SELECT ROW_COUNT() AS affected'));
  return Number(affectedRow?.affected || 0);
};

exports.delete = async (id) => {
  const row = pickFirstRow(await db.query('DELETE FROM centro WHERE id = ?', [id]));
  const affectedRow = pickFirstRow(await db.query('SELECT ROW_COUNT() AS affected'));
  return Number(affectedRow?.affected || 0);
};
