const dbMod = require("../db");
const db = dbMod.pool || dbMod;

function pickFirstRow(r) {
  const rows = r?.[0];
  if (!rows) return null;
  if (Array.isArray(rows) && Array.isArray(rows[0])) return rows[0][0] || null;
  if (Array.isArray(rows)) return rows[0] || null;
  return null;
}

exports.obtenerPorId = async (id) => {
  // puedes hacerlo con SP si ya estás en modo SP
  const r = await db.query(`
    SELECT u.id, u.nombre, u.apellido_paterno, u.apellido_materno,
           u.email, u.telefono, u.fecha_nacimiento, u.avatar_key, u.estado,
           r.clave AS rol_clave
    FROM usuario u
    JOIN rol r ON r.id = u.rol_id
    WHERE u.id = ?
    LIMIT 1
  `, [id]);

  return pickFirstRow([r[0]]); // hack simple si db.query retorna [rows]
};
