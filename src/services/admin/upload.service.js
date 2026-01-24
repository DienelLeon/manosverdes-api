// src/services/admin/upload.service.js
const crypto = require('crypto');
const { uploadPublic, uploadPrivate, getSignedUrl } = require('../../utils/gcs');

function extFromMime(mimetype) {
  if (mimetype === 'image/jpeg') return '.jpg';
  if (mimetype === 'image/png') return '.png';
  if (mimetype === 'image/webp') return '.webp';
  return '';
}

function makeKey(prefix, mimetype) {
  const rand = crypto.randomBytes(8).toString('hex');
  const ext = extFromMime(mimetype);
  return `${prefix}/${Date.now()}_${rand}${ext}`;
}

exports.uploadCategoriaIcono = async (file) => {
  if (!file?.buffer) throw new Error('Archivo inválido');
  const key = makeKey('materiales/categorias', file.mimetype);
  const url = await uploadPublic(file.buffer, key, file.mimetype);
  return { key, url };
};

exports.uploadMaterialIcono = async (file) => {
  if (!file?.buffer) throw new Error('Archivo inválido');
  const key = makeKey('materiales/materiales', file.mimetype);
  const url = await uploadPublic(file.buffer, key, file.mimetype);
  return { key, url };
};

exports.uploadUsuarioAvatar = async (usuarioId, file) => {
  if (!file?.buffer) throw new Error('Archivo inválido');
  const key = makeKey(`avatars/usuarios/u_${usuarioId}`, file.mimetype);

  await uploadPrivate(file.buffer, key, file.mimetype);

  const url = await getSignedUrl(key, 10);

  return { avatar_key: key, avatar_url: url };
};
