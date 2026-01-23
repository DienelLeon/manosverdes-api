const s = require('../../services/admin/centro_representante.service');

exports.list = async (_req, res, next) => { try { res.json({ ok: true, items: await s.list() }); } catch (e) { next(e); } };
exports.get = async (req, res, next) => { try { res.json({ ok: true, item: await s.get(req.params.centro_id) }); } catch (e) { next(e); } };
exports.createOrUpdate = async (req, res, next) => { try { const out = await s.createOrUpdate(req.params.centro_id, req.body || {}); res.json({ ok: true, ...out }); } catch (e) { next(e); } };
exports.delete = async (req, res, next) => { try { const out = await s.delete(req.params.centro_id); res.json({ ok: true, ...out }); } catch (e) { next(e); } };
