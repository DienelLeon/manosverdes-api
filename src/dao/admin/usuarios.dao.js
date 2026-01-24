const dbMod = require('../../db');
const db = dbMod.pool || dbMod;

function pickRows(r) {
  return r?.[0] || [];
}

exports.obtenerPorEmail = async (email) => {
  const [rows] = await db.query('SELECT id, email FROM usuario WHERE email = ? LIMIT 1', [email]);
  return rows?.[0] || null;
};

exports.listar = async ({ limit, offset }) => {
  const [rows] = await db.query(
    `SELECT 
      u.id,
      u.nombre,
      u.apellido_paterno,
      u.apellido_materno,
      u.email,
      u.telefono,
      u.fecha_nacimiento,
      u.avatar_key,
      u.estado,
      r.clave AS rol_clave,
      ua.email_verificado,
      ua.intentos_fallidos,
      ua.bloqueado_hasta,
      u.creado_en,
      u.actualizado_en
     FROM usuario u
     JOIN rol r ON r.id = u.rol_id
     LEFT JOIN usuario_auth ua ON ua.usuario_id = u.id
     ORDER BY u.id DESC
     LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );

  return rows;
};

exports.obtenerPorId = async (id) => {
  const [rows] = await db.query(
    `SELECT 
      u.id,
      u.nombre,
      u.apellido_paterno,
      u.apellido_materno,
      u.email,
      u.telefono,
      u.fecha_nacimiento,
      u.avatar_key,
      u.estado,
      r.clave AS rol_clave,
      ua.email_verificado,
      ua.intentos_fallidos,
      ua.bloqueado_hasta,
      u.creado_en,
      u.actualizado_en
     FROM usuario u
     JOIN rol r ON r.id = u.rol_id
     LEFT JOIN usuario_auth ua ON ua.usuario_id = u.id
     WHERE u.id = ?
     LIMIT 1`,
    [id]
  );

  return rows?.[0] || null;
};

exports.crearUsuarioConAuth = async (data) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // rol_id por clave
    const [rrows] = await conn.query('SELECT id FROM rol WHERE clave = ? LIMIT 1', [data.rol_clave]);
    const rol_id = rrows?.[0]?.id;
    if (!rol_id) throw new Error('Rol inválido');

    const [res] = await conn.query(
      `INSERT INTO usuario
       (nombre, apellido_paterno, apellido_materno, email, telefono, fecha_nacimiento, avatar_key, estado, rol_id)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        data.nombre,
        data.apellido_paterno,
        data.apellido_materno,
        data.email,
        data.telefono,
        data.fecha_nacimiento,
        null,
        data.estado,
        rol_id,
      ]
    );

    const usuario_id = res.insertId;

    await conn.query(
      `INSERT INTO usuario_auth
       (usuario_id, password_hash, email_verificado, email_verificado_en, intentos_fallidos, bloqueado_hasta)
       VALUES (?,?,?,?,?,?)`,
      [
        usuario_id,
        data.password_hash,
        data.email_verificado,
        data.email_verificado ? new Date() : null,
        0,
        null,
      ]
    );

    await conn.commit();
    return usuario_id;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
};

exports.actualizar = async (id, data) => {
  // Campos editables
  const fields = [];
  const vals = [];

  const push = (k, v) => {
    if (v === undefined) return;
    fields.push(`${k} = ?`);
    vals.push(v);
  };

  push('nombre', data.nombre);
  push('apellido_paterno', data.apellido_paterno);
  push('apellido_materno', data.apellido_materno);
  push('telefono', data.telefono);
  push('fecha_nacimiento', data.fecha_nacimiento);
  push('estado', data.estado);

  if (data.rol_clave !== undefined) {
    const [rrows] = await db.query('SELECT id FROM rol WHERE clave = ? LIMIT 1', [data.rol_clave]);
    const rol_id = rrows?.[0]?.id;
    if (!rol_id) throw new Error('Rol inválido');
    push('rol_id', rol_id);
  }

  if (!fields.length) return 0;

  vals.push(id);

  const [res] = await db.query(
    `UPDATE usuario SET ${fields.join(', ')} WHERE id = ?`,
    vals
  );

  return Number(res.affectedRows || 0);
};

exports.cambiarEstado = async (id, estado) => {
  const [res] = await db.query('UPDATE usuario SET estado = ? WHERE id = ?', [estado, id]);
  return Number(res.affectedRows || 0);
};

exports.setAvatarKey = async (id, avatar_key) => {
  const [res] = await db.query('UPDATE usuario SET avatar_key = ? WHERE id = ?', [avatar_key, id]);
  return Number(res.affectedRows || 0);
};
