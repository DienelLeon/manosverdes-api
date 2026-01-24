const HttpError = require('../../utils/httpError');
const dao = require('../../dao/admin/materiales.dao');

const isStr = (v) => typeof v === 'string' && v.trim().length > 0;
const toId = (x, name='id') => {
  const n = Number(x);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, `${name} inválido`);
  return n;
};
const toTiny = (x) => (x === null || x === undefined ? null : (Number(x) ? 1 : 0));
const clean = (s, name='nombre') => { if (!isStr(s)) throw new HttpError(400, `${name} requerido`); return s.trim(); };

exports.categoriaList = async () => dao.categoriaList();
exports.categoriaGet = async (id) => {
  id = toId(id);
  const row = await dao.categoriaGet(id);
  if (!row) throw new HttpError(404, 'Categoría no encontrada');
  return row;
};
exports.categoriaCreate = async (b) => {
  const id = await dao.categoriaCreate(clean(b.nombre), b.icono ?? null, toTiny(b.activo) ?? 1);
  return { id };
};
exports.categoriaUpdate = async (id, b) => {
  id = toId(id);
  const affected = await dao.categoriaUpdate(id, clean(b.nombre), b.icono ?? null, toTiny(b.activo));
  if (affected < 1) throw new HttpError(404, 'Categoría no encontrada');
  return { affected };
};
exports.categoriaDelete = async (id) => {
  id = toId(id);
  const affected = await dao.categoriaDelete(id); // puede lanzar SIGNAL
  if (affected < 1) throw new HttpError(404, 'Categoría no encontrada');
  return { affected };
};

exports.subcategoriaList = async (categoria_id) => {
  categoria_id = toId(categoria_id, 'categoria_id');
  return dao.subcategoriaList(categoria_id);
};
exports.subcategoriaGet = async (id) => {
  id = toId(id);
  const row = await dao.subcategoriaGet(id);
  if (!row) throw new HttpError(404, 'Subcategoría no encontrada');
  return row;
};
exports.subcategoriaCreate = async (b) => {
  const id = await dao.subcategoriaCreate(
    toId(b.categoria_id, 'categoria_id'),
    clean(b.nombre),
    toTiny(b.activo) ?? 1
  );
  return { id };
};
exports.subcategoriaUpdate = async (id, b) => {
  id = toId(id);
  const affected = await dao.subcategoriaUpdate(
    id,
    toId(b.categoria_id, 'categoria_id'),
    clean(b.nombre),
    toTiny(b.activo)
  );
  if (affected < 1) throw new HttpError(404, 'Subcategoría no encontrada');
  return { affected };
};
exports.subcategoriaDelete = async (id) => {
  id = toId(id);
  const affected = await dao.subcategoriaDelete(id); // puede lanzar SIGNAL
  if (affected < 1) throw new HttpError(404, 'Subcategoría no encontrada');
  return { affected };
};

exports.materialList = async (q) => {
  const subcategoria_id = q.subcategoria_id ? toId(q.subcategoria_id, 'subcategoria_id') : null;
  const activo = q.activo === undefined ? null : toTiny(q.activo);
  const elegible = q.elegible === undefined ? null : toTiny(q.elegible);
  return dao.materialList(subcategoria_id, activo, elegible);
};
exports.materialGet = async (id) => {
  id = toId(id);
  const row = await dao.materialGet(id);
  if (!row) throw new HttpError(404, 'Material no encontrado');
  return row;
};
exports.materialCreate = async (b) => {
  const id = await dao.materialCreate(
    toId(b.subcategoria_id, 'subcategoria_id'),
    clean(b.nombre),
    b.icono ?? null,
    toTiny(b.elegible) ?? 1,
    toTiny(b.activo) ?? 1
  );
  return { id };
};
exports.materialUpdate = async (id, b) => {
  id = toId(id);
  const affected = await dao.materialUpdate(
    id,
    toId(b.subcategoria_id, 'subcategoria_id'),
    clean(b.nombre),
    b.icono ?? null,
    toTiny(b.elegible),
    toTiny(b.activo)
  );
  if (affected < 1) throw new HttpError(404, 'Material no encontrado');
  return { affected };
};
exports.materialDelete = async (id) => {
  id = toId(id);
  const affected = await dao.materialDelete(id); // puede lanzar SIGNAL
  if (affected < 1) throw new HttpError(404, 'Material no encontrado');
  return { affected };
};

exports.materialInfoGet = async (material_id) => {
  material_id = toId(material_id, 'material_id');
  return (await dao.materialInfoGet(material_id)) || null;
};
exports.materialInfoUpsert = async (material_id, b) => {
  material_id = toId(material_id, 'material_id');
  await dao.materialInfoUpsert(material_id, b || {});
  return { ok: true };
};



exports.listSubcategoriasAll = async () => {
  return await dao.listSubcategoriasAll();
};

exports.listMaterialesAll = async () => {
  return await dao.listMaterialesAll();
};
