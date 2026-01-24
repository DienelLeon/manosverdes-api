// src/utils/gcs.js
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();

const BUCKET_PUBLIC = process.env.GCS_BUCKET_PUBLIC;
const BUCKET_PRIVATE = process.env.GCS_BUCKET_PRIVATE;

const PUBLIC_BASE = process.env.GCS_PUBLIC_BASE || 'https://storage.googleapis.com';
const SIGNED_URL_MIN = Number(process.env.SIGNED_URL_MIN || 10);

if (!BUCKET_PUBLIC) throw new Error('❌ GCS_BUCKET_PUBLIC no definido en .env');
if (!BUCKET_PRIVATE) throw new Error('❌ GCS_BUCKET_PRIVATE no definido en .env');

const bucketPublic = storage.bucket(BUCKET_PUBLIC);
const bucketPrivate = storage.bucket(BUCKET_PRIVATE);

async function uploadPublic(buffer, key, mimetype) {
  if (!key) throw new Error('Key requerido para uploadPublic');

  const file = bucketPublic.file(key);

  await file.save(buffer, {
    resumable: false,
    contentType: mimetype,
    metadata: { cacheControl: 'public, max-age=31536000' },
  });

  // OJO: esto SOLO funcionará si el bucket PUBLIC es realmente público
  return `${PUBLIC_BASE}/${BUCKET_PUBLIC}/${key}`;
}

async function uploadPrivate(buffer, key, mimetype) {
  if (!key) throw new Error('Key requerido para uploadPrivate');

  const file = bucketPrivate.file(key);

  await file.save(buffer, {
    resumable: false,
    contentType: mimetype,
    metadata: { cacheControl: 'private, max-age=0' },
  });

  return key;
}

async function getSignedUrl(key, minutes = SIGNED_URL_MIN) {
  if (!key) throw new Error('Key requerido para getSignedUrl');

  const file = bucketPrivate.file(key);

  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + minutes * 60 * 1000,
  });

  return url;
}

module.exports = {
  uploadPublic,
  uploadPrivate,
  getSignedUrl,
};
