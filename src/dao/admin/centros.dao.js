const dbMod = require('../../db');
const db = dbMod.pool || dbMod;

function pickFirstRow(callResult, setIndex = 0) {
  const sets = callResult?.[0];
  if (!sets) return null;

  // cuando hay varios SELECTs, mysql2 devuelve: [ [rowsSet1], [rowsSet2], ... ]
  const table = Array.isArray(sets[0]) ? sets[setIndex] : sets;
  return table?.[0] || null;
}

function pickTable(callResult, setIndex = 0) {
  const sets = callResult?.[0];
  if (!sets) return [];
  const table = Array.isArray(sets[0]) ? sets[setIndex] : sets;
  return table || [];
}

async function listar({ limit, offset, estado, distrito_id, tipo_id, q }) {
  const r = await db.query('CALL sp_admin_centro_list(?,?,?,?,?,?)', [
    Number(limit || 20),
    Number(offset || 0),
    estado ?? null,
    distrito_id ?? null,
    tipo_id ?? null,
    q ?? null,
  ]);
  return pickTable(r, 0);
}

async function obtenerDetalle(id) {
  const r = await db.query('CALL sp_admin_centro_get(?)', [id]);

  const centro = pickFirstRow(r, 0);
  const usuario = pickFirstRow(r, 1);
  const representante = pickFirstRow(r, 2); // puede ser null

  return { centro, usuario, representante };
}

async function crearForUsuario({ usuario_id, centro, representante }) {
  const r = await db.query('CALL sp_admin_centro_create_for_usuario(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
    usuario_id,
    centro.nombre,
    centro.direccion ?? null,
    centro.distrito_id,
    centro.tipo_id ?? null,
    centro.telefono ?? null,
    centro.horario ?? null,
    centro.lat ?? null,
    centro.lng ?? null,
    centro.estado ?? 'activo',

    representante?.ruc ?? null,
    representante?.razon_social ?? null,
    representante?.contacto_nombre ?? null,
    representante?.contacto_cargo ?? null,
    representante?.contacto_tel ?? null,
    representante?.contacto_email ?? null,
    representante?.web_url ?? null,
  ]);
  const row = pickFirstRow(r, 0);
  return row?.centro_id || null;
}

async function crearFull({ usuario, centro, representante }) {
  const r = await db.query('CALL sp_admin_centro_create_full(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
    usuario.nombre,
    usuario.apellido_paterno,
    usuario.apellido_materno ?? '',
    usuario.email,
    usuario.telefono ?? null,
    usuario.fecha_nacimiento ?? null,
    usuario.estado ?? 'activo',
    usuario.password_hash ?? null,
    Number(usuario.email_verificado) ? 1 : 0,

    centro.nombre,
    centro.direccion ?? null,
    centro.distrito_id,
    centro.tipo_id ?? null,
    centro.telefono ?? null,
    centro.horario ?? null,
    centro.lat ?? null,
    centro.lng ?? null,
    centro.estado ?? 'activo',

    representante?.ruc ?? null,
    representante?.razon_social ?? null,
    representante?.contacto_nombre ?? null,
    representante?.contacto_cargo ?? null,
    representante?.contacto_tel ?? null,
    representante?.contacto_email ?? null,
    representante?.web_url ?? null,
  ]);
  const row = pickFirstRow(r, 0);
  return { usuario_id: row?.usuario_id || null, centro_id: row?.centro_id || null };
}

async function actualizar(id, data) {
  const r = await db.query('CALL sp_admin_centro_update(?,?,?,?,?,?,?,?,?)', [
    id,
    data.nombre ?? null,
    data.direccion ?? null,
    data.distrito_id ?? null,
    data.tipo_id ?? null,
    data.telefono ?? null,
    data.horario ?? null,
    data.lat ?? null,
    data.lng ?? null,
  ]);
  const row = pickFirstRow(r, 0);
  return Number(row?.affected || 0);
}

async function cambiarEstado(id, estado) {
  const r = await db.query('CALL sp_admin_centro_set_estado(?,?)', [id, estado]);
  const row = pickFirstRow(r, 0);
  return Number(row?.affected || 0);
}

async function repUpsert(centro_id, rep) {
  const r = await db.query('CALL sp_admin_centro_rep_upsert(?,?,?,?,?,?,?,?)', [
    centro_id,
    rep.ruc ?? null,
    rep.razon_social ?? null,
    rep.contacto_nombre ?? null,
    rep.contacto_cargo ?? null,
    rep.contacto_tel ?? null,
    rep.contacto_email ?? null,
    rep.web_url ?? null,
  ]);
  const row = pickFirstRow(r, 0);
  return Number(row?.affected || 0) || 1;
}

async function repDelete(centro_id) {
  const r = await db.query('CALL sp_admin_centro_rep_delete(?)', [centro_id]);
  const row = pickFirstRow(r, 0);
  return Number(row?.affected || 0);
}

async function eliminar(id) {
  const r = await db.query('CALL sp_admin_centro_delete(?)', [id]);
  const row = pickFirstRow(r, 0);
  return Number(row?.affected || 0);
}

module.exports = {
  listar,
  obtenerDetalle,
  crearForUsuario,
  crearFull,
  actualizar,
  cambiarEstado,
  repUpsert,
  repDelete,
  eliminar,
};
