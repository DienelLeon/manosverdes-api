const dbMod = require('../../db');
const db = dbMod.pool || dbMod;

function pickFirstRow(callResult) {
  const rows = callResult?.[0];
  if (!rows) return null;
  if (Array.isArray(rows) && Array.isArray(rows[0])) return rows[0][0] || null;
  if (Array.isArray(rows)) return rows[0] || null;
  return null;
}

function pickTable(callResult) {
  const rows = callResult?.[0];
  if (!rows) return [];
  if (Array.isArray(rows) && Array.isArray(rows[0])) return rows[0] || [];
  if (Array.isArray(rows)) return rows || [];
  return [];
}

/* DEPARTAMENTO */
async function departamentoList() {
  const r = await db.query('CALL sp_ubigeo_departamento_list()');
  return pickTable(r);
}
async function departamentoGet(id) {
  const r = await db.query('CALL sp_ubigeo_departamento_get(?)', [id]);
  return pickFirstRow(r);
}
async function departamentoCreate(nombre) {
  const r = await db.query('CALL sp_ubigeo_departamento_create(?)', [nombre]);
  const row = pickFirstRow(r);
  return row?.id || null;
}
async function departamentoUpdate(id, nombre) {
  const r = await db.query('CALL sp_ubigeo_departamento_update(?,?)', [id, nombre]);
  const row = pickFirstRow(r);
  return Number(row?.affected || 0);
}
async function departamentoDelete(id) {
  const r = await db.query('CALL sp_ubigeo_departamento_delete(?)', [id]);
  const row = pickFirstRow(r);
  return Number(row?.affected || 0);
}

/* PROVINCIA */
async function provinciaList(departamento_id) {
  const r = await db.query('CALL sp_ubigeo_provincia_list(?)', [departamento_id]);
  return pickTable(r);
}
async function provinciaGet(id) {
  const r = await db.query('CALL sp_ubigeo_provincia_get(?)', [id]);
  return pickFirstRow(r);
}
async function provinciaCreate(departamento_id, nombre) {
  const r = await db.query('CALL sp_ubigeo_provincia_create(?,?)', [departamento_id, nombre]);
  const row = pickFirstRow(r);
  return row?.id || null;
}
async function provinciaUpdate(id, departamento_id, nombre) {
  const r = await db.query('CALL sp_ubigeo_provincia_update(?,?,?)', [id, departamento_id, nombre]);
  const row = pickFirstRow(r);
  return Number(row?.affected || 0);
}
async function provinciaDelete(id) {
  const r = await db.query('CALL sp_ubigeo_provincia_delete(?)', [id]);
  const row = pickFirstRow(r);
  return Number(row?.affected || 0);
}

/* DISTRITO */
async function distritoList(provincia_id) {
  const r = await db.query('CALL sp_ubigeo_distrito_list(?)', [provincia_id]);
  return pickTable(r);
}
async function distritoGet(id) {
  const r = await db.query('CALL sp_ubigeo_distrito_get(?)', [id]);
  return pickFirstRow(r);
}
async function distritoCreate(provincia_id, nombre) {
  const r = await db.query('CALL sp_ubigeo_distrito_create(?,?)', [provincia_id, nombre]);
  const row = pickFirstRow(r);
  return row?.id || null;
}
async function distritoUpdate(id, provincia_id, nombre) {
  const r = await db.query('CALL sp_ubigeo_distrito_update(?,?,?)', [id, provincia_id, nombre]);
  const row = pickFirstRow(r);
  return Number(row?.affected || 0);
}
async function distritoDelete(id) {
  const r = await db.query('CALL sp_ubigeo_distrito_delete(?)', [id]);
  const row = pickFirstRow(r);
  return Number(row?.affected || 0);
}

module.exports = {
  departamentoList,
  departamentoGet,
  departamentoCreate,
  departamentoUpdate,
  departamentoDelete,

  provinciaList,
  provinciaGet,
  provinciaCreate,
  provinciaUpdate,
  provinciaDelete,

  distritoList,
  distritoGet,
  distritoCreate,
  distritoUpdate,
  distritoDelete,
};
