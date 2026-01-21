// utils/gcs.js
const { Storage } = require('@google-cloud/storage');
const path = require('path');

const projectId  = process.env.GCP_PROJECT_ID;
const bucketName = process.env.GCS_BUCKET;

if (process.env.GOOGLE_APPLICATION_CREDENTIALS &&
    !path.isAbsolute(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS =
    path.resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS);
}

const storage = new Storage({
  projectId,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

const bucket = storage.bucket(bucketName);

async function uploadBuffer({ buffer, mimeType, destPath }) {
  const file = bucket.file(destPath);

  await file.save(buffer, {
    resumable: false,
    metadata: {
      contentType: mimeType || 'image/jpeg',
      cacheControl: 'public, max-age=31536000',
    },
  });

  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: '3025-01-01'
  });

  return url;
}

async function verifyGcs() {
  const [exists] = await bucket.exists();
  if (!exists) throw new Error(`Bucket no existe o no hay acceso: ${bucket.name}`);
  console.log('✅ GCS listo (bucket accesible)');
}
module.exports = { uploadBuffer , verifyGcs};
