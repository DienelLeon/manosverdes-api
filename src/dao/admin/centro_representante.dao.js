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

exports.list = async () => pickTable(await db.query(
  `SELECT cr.centro_id, c.nombre AS centro_nombre, cr.ruc, cr.razon_social, cr.contacto_nombre, cr.contacto_tel, cr.contacto_email
   FROM centro_representante cr
   LEFT JOIN centro c ON c.id = cr.centro_id
   ORDER BY c.nombre`));

exports.getByCentro = async (centro_id) => pickFirstRow(await db.query(
  `SELECT cr.centro_id, c.nombre AS centro_nombre, cr.ruc, cr.razon_social, cr.contacto_nombre, cr.contacto_tel, cr.contacto_email
   FROM centro_representante cr
   LEFT JOIN centro c ON c.id = cr.centro_id
   WHERE cr.centro_id = ? LIMIT 1`, [centro_id]
));

exports.createOrUpdate = async (centro_id, data) => {
  // upsert-like behavior: try update else insert
  await db.query(`INSERT INTO centro_representante (centro_id, ruc, razon_social, contacto_nombre, contacto_cargo, contacto_tel, contacto_email, web_url)
    VALUES (?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE ruc=VALUES(ruc), razon_social=VALUES(razon_social), contacto_nombre=VALUES(contacto_nombre), contacto_cargo=VALUES(contacto_cargo), contacto_tel=VALUES(contacto_tel), contacto_email=VALUES(contacto_email), web_url=VALUES(web_url)`,
    [centro_id, data.ruc ?? null, data.razon_social ?? null, data.contacto_nombre ?? null, data.contacto_cargo ?? null, data.contacto_tel ?? null, data.contacto_email ?? null, data.web_url ?? null]);
  return true;
};

exports.delete = async (centro_id) => {
  await db.query('DELETE FROM centro_representante WHERE centro_id = ?', [centro_id]);
  const row = pickFirstRow(await db.query('SELECT ROW_COUNT() AS affected'));
  return Number(row?.affected || 0);
};
