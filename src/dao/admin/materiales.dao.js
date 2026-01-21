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

/* CATEGORIA */
exports.categoriaList = async () => pickTable(await db.query('CALL sp_admin_categoria_list()'));
exports.categoriaGet = async (id) => pickFirstRow(await db.query('CALL sp_admin_categoria_get(?)', [id]));
exports.categoriaCreate = async (nombre, icono, activo) => {
  const row = pickFirstRow(await db.query('CALL sp_admin_categoria_create(?,?,?)', [nombre, icono, activo]));
  return row?.id || null;
};
exports.categoriaUpdate = async (id, nombre, icono, activo) => {
  const row = pickFirstRow(await db.query('CALL sp_admin_categoria_update(?,?,?,?)', [id, nombre, icono, activo]));
  return Number(row?.affected || 0);
};
exports.categoriaDelete = async (id) => {
  const row = pickFirstRow(await db.query('CALL sp_admin_categoria_delete(?)', [id]));
  return Number(row?.affected || 0);
};

/* SUBCATEGORIA */
exports.subcategoriaList = async (categoria_id) =>
  pickTable(await db.query('CALL sp_admin_subcategoria_list(?)', [categoria_id]));
exports.subcategoriaGet = async (id) =>
  pickFirstRow(await db.query('CALL sp_admin_subcategoria_get(?)', [id]));
exports.subcategoriaCreate = async (categoria_id, nombre, activo) => {
  const row = pickFirstRow(await db.query('CALL sp_admin_subcategoria_create(?,?,?)', [categoria_id, nombre, activo]));
  return row?.id || null;
};
exports.subcategoriaUpdate = async (id, categoria_id, nombre, activo) => {
  const row = pickFirstRow(await db.query('CALL sp_admin_subcategoria_update(?,?,?,?)', [id, categoria_id, nombre, activo]));
  return Number(row?.affected || 0);
};
exports.subcategoriaDelete = async (id) => {
  const row = pickFirstRow(await db.query('CALL sp_admin_subcategoria_delete(?)', [id]));
  return Number(row?.affected || 0);
};

/* MATERIAL */
exports.materialList = async (subcategoria_id, activo, elegible) =>
  pickTable(await db.query('CALL sp_admin_material_list(?,?,?)', [subcategoria_id, activo, elegible]));
exports.materialGet = async (id) =>
  pickFirstRow(await db.query('CALL sp_admin_material_get(?)', [id]));
exports.materialCreate = async (subcategoria_id, nombre, icono, elegible, activo) => {
  const row = pickFirstRow(await db.query('CALL sp_admin_material_create(?,?,?,?,?)', [subcategoria_id, nombre, icono, elegible, activo]));
  return row?.id || null;
};
exports.materialUpdate = async (id, subcategoria_id, nombre, icono, elegible, activo) => {
  const row = pickFirstRow(await db.query('CALL sp_admin_material_update(?,?,?,?,?,?)', [id, subcategoria_id, nombre, icono, elegible, activo]));
  return Number(row?.affected || 0);
};
exports.materialDelete = async (id) => {
  const row = pickFirstRow(await db.query('CALL sp_admin_material_delete(?)', [id]));
  return Number(row?.affected || 0);
};

/* MATERIAL INFO */
exports.materialInfoGet = async (material_id) =>
  pickFirstRow(await db.query('CALL sp_admin_material_info_get(?)', [material_id]));
exports.materialInfoUpsert = async (material_id, info) => {
  await db.query('CALL sp_admin_material_info_upsert(?,?,?,?,?,?)', [
    material_id,
    info.descripcion ?? null,
    info.beneficios ?? null,
    info.proceso ?? null,
    info.ideas ?? null,
    info.contaminacion ?? null,
  ]);
  return true;
};
