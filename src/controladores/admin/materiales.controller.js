const HttpError = require('../../utils/httpError');
const s = require('../../services/admin/materiales.service');

const isObj = (v) => v && typeof v === 'object';

exports.categoriaList = async (_req, res, next) => {
  try { res.json({ ok:true, items: await s.categoriaList() }); } catch(e){ next(e); }
};
exports.categoriaGet = async (req, res, next) => {
  try { res.json({ ok:true, item: await s.categoriaGet(req.params.id) }); } catch(e){ next(e); }
};
exports.categoriaCreate = async (req, res, next) => {
  try {
    if (!isObj(req.body)) throw new HttpError(400, 'Body requerido');
    const out = await s.categoriaCreate(req.body);
    res.status(201).json({ ok:true, ...out });
  } catch(e){ next(e); }
};
exports.categoriaUpdate = async (req, res, next) => {
  try {
    if (!isObj(req.body)) throw new HttpError(400, 'Body requerido');
    const out = await s.categoriaUpdate(req.params.id, req.body);
    res.json({ ok:true, ...out });
  } catch(e){ next(e); }
};
exports.categoriaDelete = async (req, res, next) => {
  try { res.json({ ok:true, ...(await s.categoriaDelete(req.params.id)) }); } catch(e){ next(e); }
};

exports.subcategoriaList = async (req, res, next) => {
  try {
    const { categoria_id } = req.query || {};
    if (!categoria_id) throw new HttpError(400, 'categoria_id requerido');
    res.json({ ok:true, items: await s.subcategoriaList(categoria_id) });
  } catch(e){ next(e); }
};
exports.subcategoriaGet = async (req, res, next) => {
  try { res.json({ ok:true, item: await s.subcategoriaGet(req.params.id) }); } catch(e){ next(e); }
};
exports.subcategoriaCreate = async (req, res, next) => {
  try {
    if (!isObj(req.body)) throw new HttpError(400, 'Body requerido');
    const out = await s.subcategoriaCreate(req.body);
    res.status(201).json({ ok:true, ...out });
  } catch(e){ next(e); }
};
exports.subcategoriaUpdate = async (req, res, next) => {
  try {
    if (!isObj(req.body)) throw new HttpError(400, 'Body requerido');
    const out = await s.subcategoriaUpdate(req.params.id, req.body);
    res.json({ ok:true, ...out });
  } catch(e){ next(e); }
};
exports.subcategoriaDelete = async (req, res, next) => {
  try { res.json({ ok:true, ...(await s.subcategoriaDelete(req.params.id)) }); } catch(e){ next(e); }
};

exports.materialList = async (req, res, next) => {
  try { res.json({ ok:true, items: await s.materialList(req.query || {}) }); } catch(e){ next(e); }
};
exports.materialGet = async (req, res, next) => {
  try { res.json({ ok:true, item: await s.materialGet(req.params.id) }); } catch(e){ next(e); }
};
exports.materialCreate = async (req, res, next) => {
  try {
    if (!isObj(req.body)) throw new HttpError(400, 'Body requerido');
    const out = await s.materialCreate(req.body);
    res.status(201).json({ ok:true, ...out });
  } catch(e){ next(e); }
};
exports.materialUpdate = async (req, res, next) => {
  try {
    if (!isObj(req.body)) throw new HttpError(400, 'Body requerido');
    const out = await s.materialUpdate(req.params.id, req.body);
    res.json({ ok:true, ...out });
  } catch(e){ next(e); }
};
exports.materialDelete = async (req, res, next) => {
  try { res.json({ ok:true, ...(await s.materialDelete(req.params.id)) }); } catch(e){ next(e); }
};

exports.materialInfoGet = async (req, res, next) => {
  try { res.json({ ok:true, item: await s.materialInfoGet(req.params.id) }); } catch(e){ next(e); }
};
exports.materialInfoUpsert = async (req, res, next) => {
  try {
    const out = await s.materialInfoUpsert(req.params.id, req.body || {});
    res.json({ ok:true, ...out });
  } catch(e){ next(e); }
};

exports.listSubcategoriasAll = async (_req, res, next) => {
  try {
    res.json({ ok: true, items: await s.listSubcategoriasAll() });
  } catch (e) { next(e); }
};

exports.listMaterialesAll = async (_req, res, next) => {
  try {
    res.json({ ok: true, items: await s.listMaterialesAll() });
  } catch (e) { next(e); }
};
