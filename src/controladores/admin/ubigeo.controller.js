const HttpError = require('../../utils/httpError');
const s = require('../../services/ubigeo.service');

const isStr = (v) => typeof v === 'string' && v.trim().length > 0;

/* DEPARTAMENTO */
exports.departamentoList = async (_req, res, next) => {
  try {
    const out = await s.departamentoList();
    res.json({ ok: true, items: out });
  } catch (e) { next(e); }
};

exports.departamentoGet = async (req, res, next) => {
  try {
    const out = await s.departamentoGet(req.params.id);
    res.json({ ok: true, item: out });
  } catch (e) { next(e); }
};

exports.departamentoCreate = async (req, res, next) => {
  try {
    const { nombre } = req.body || {};
    if (!isStr(nombre)) throw new HttpError(400, 'nombre requerido');
    const out = await s.departamentoCreate(nombre);
    res.status(201).json({ ok: true, ...out });
  } catch (e) { next(e); }
};

exports.departamentoUpdate = async (req, res, next) => {
  try {
    const { nombre } = req.body || {};
    if (!isStr(nombre)) throw new HttpError(400, 'nombre requerido');
    const out = await s.departamentoUpdate(req.params.id, nombre);
    res.json({ ok: true, ...out });
  } catch (e) { next(e); }
};

exports.departamentoDelete = async (req, res, next) => {
  try {
    const out = await s.departamentoDelete(req.params.id);
    res.json({ ok: true, ...out });
  } catch (e) { next(e); }
};


/* PROVINCIA */
exports.provinciaList = async (req, res, next) => {
  try {
    const { departamento_id } = req.query || {};
    if (!departamento_id) throw new HttpError(400, 'departamento_id requerido');
    const out = await s.provinciaList(departamento_id);
    res.json({ ok: true, items: out });
  } catch (e) { next(e); }
};

exports.provinciaGet = async (req, res, next) => {
  try {
    const out = await s.provinciaGet(req.params.id);
    res.json({ ok: true, item: out });
  } catch (e) { next(e); }
};

exports.provinciaCreate = async (req, res, next) => {
  try {
    const { departamento_id, nombre } = req.body || {};
    if (!departamento_id) throw new HttpError(400, 'departamento_id requerido');
    if (!isStr(nombre)) throw new HttpError(400, 'nombre requerido');
    const out = await s.provinciaCreate(departamento_id, nombre);
    res.status(201).json({ ok: true, ...out });
  } catch (e) { next(e); }
};

exports.provinciaUpdate = async (req, res, next) => {
  try {
    const { departamento_id, nombre } = req.body || {};
    if (!departamento_id) throw new HttpError(400, 'departamento_id requerido');
    if (!isStr(nombre)) throw new HttpError(400, 'nombre requerido');
    const out = await s.provinciaUpdate(req.params.id, departamento_id, nombre);
    res.json({ ok: true, ...out });
  } catch (e) { next(e); }
};

exports.provinciaDelete = async (req, res, next) => {
  try {
    const out = await s.provinciaDelete(req.params.id);
    res.json({ ok: true, ...out });
  } catch (e) { next(e); }
};


/* DISTRITO */
exports.distritoList = async (req, res, next) => {
  try {
    const { provincia_id } = req.query || {};
    // permitir listar todos si no se pasa provincia_id
    const out = await s.distritoList(provincia_id);
    res.json({ ok: true, items: out });
  } catch (e) { next(e); }
};

exports.distritoGet = async (req, res, next) => {
  try {
    const out = await s.distritoGet(req.params.id);
    res.json({ ok: true, item: out });
  } catch (e) { next(e); }
};

exports.distritoCreate = async (req, res, next) => {
  try {
    const { provincia_id, nombre } = req.body || {};
    if (!provincia_id) throw new HttpError(400, 'provincia_id requerido');
    if (!isStr(nombre)) throw new HttpError(400, 'nombre requerido');
    const out = await s.distritoCreate(provincia_id, nombre);
    res.status(201).json({ ok: true, ...out });
  } catch (e) { next(e); }
};

exports.distritoUpdate = async (req, res, next) => {
  try {
    const { provincia_id, nombre } = req.body || {};
    if (!provincia_id) throw new HttpError(400, 'provincia_id requerido');
    if (!isStr(nombre)) throw new HttpError(400, 'nombre requerido');
    const out = await s.distritoUpdate(req.params.id, provincia_id, nombre);
    res.json({ ok: true, ...out });
  } catch (e) { next(e); }
};

exports.distritoDelete = async (req, res, next) => {
  try {
    const out = await s.distritoDelete(req.params.id);
    res.json({ ok: true, ...out });
  } catch (e) { next(e); }
};
