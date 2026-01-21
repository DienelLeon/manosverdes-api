// server.js
require('dotenv').config();

const { initDb } = require('./src/db');
const app = require('./src/app');
const { verifySmtp } = require('./src/utils/mailer');

let verifyGcs = null;
try {
  ({ verifyGcs } = require('./src/utils/gcs'));
} catch {
}

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await initDb();

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      await verifySmtp();
    } else {
      console.log('ℹ️ SMTP no configurado (saltando verify)');
    }

    if (verifyGcs && process.env.GOOGLE_APPLICATION_CREDENTIALS && process.env.GCS_BUCKET) {
      try {
        await verifyGcs();
      } catch (e) {
        console.log('⚠️ GCS no verificado:', e.message);
      }
    } else {
      console.log('ℹ️ GCS no configurado (saltando verify)');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ API en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ No se pudo iniciar el servidor:', err.message);
    process.exit(1);
  }
})();
