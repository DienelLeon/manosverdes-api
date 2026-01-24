const HttpError = require('../../utils/httpError');
const service = require('../../services/admin/upload.service');

exports.uploadMaterialCategoriaIcono = async (req, res, next) => {
  try {
    if (!req.file) throw new HttpError(400, 'Archivo requerido (field: file)');
    const out = await service.uploadCategoriaIcono(req.file);
    res.json({ ok: true, ...out });
  } catch (e) { next(e); }
};

exports.uploadMaterialIcono = async (req, res, next) => {
  try {
    if (!req.file) throw new HttpError(400, 'Archivo requerido (field: file)');
    const out = await service.uploadMaterialIcono(req.file);
    res.json({ ok: true, ...out });
  } catch (e) { next(e); }
};

exports.uploadUsuarioAvatar = async (req, res, next) => {
  try {
    const usuarioId = Number(req.params.id);
    if (!usuarioId) throw new HttpError(400, 'id inválido');
    if (!req.file) throw new HttpError(400, 'Archivo requerido (field: file)');

    const out = await service.uploadUsuarioAvatar(usuarioId, req.file);
    res.json({ ok: true, usuario_id: usuarioId, ...out });
  } catch (e) { next(e); }
};
