const s = require('../../services/admin/centro_tipo.service');

exports.list = async (_req, res, next) => {
  try { res.json({ ok: true, items: await s.list() }); } catch (e) { next(e); }
};
exports.get = async (req, res, next) => {
  try { res.json({ ok: true, item: await s.get(req.params.id) }); } catch (e) { next(e); }
};
exports.create = async (req, res, next) => {
  try { const out = await s.create(req.body || {}); res.status(201).json({ ok: true, ...out }); } catch (e) { next(e); }
};
exports.update = async (req, res, next) => {
  try { const out = await s.update(req.params.id, req.body || {}); res.json({ ok: true, ...out }); } catch (e) { next(e); }
};
exports.delete = async (req, res, next) => {
  try { const out = await s.delete(req.params.id); res.json({ ok: true, ...out }); } catch (e) { next(e); }
};
