// src/utils/mailer.js
const nodemailer = require('nodemailer');

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, NODE_ENV } = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 587),
  secure: Number(SMTP_PORT) === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
  tls: NODE_ENV !== 'production' ? { rejectUnauthorized: false } : undefined,
  logger: NODE_ENV !== 'production',
  debug: NODE_ENV !== 'production',
});

async function verifySmtp() {
  try {
    await transporter.verify();
    console.log('✅ SMTP listo para enviar');
  } catch (err) {
    console.error('❌ SMTP verify falló:', err.message);
  }
}

async function sendMail({ to, subject, text, html }) {
  const from = MAIL_FROM || 'Manos Verdes <noreply@manosverdes.online>';
  return transporter.sendMail({ from, to, subject, text, html });
}

function verificationEmailTemplate({ nombre, code, minutes = 30 }) {
  const text = `Hola ${nombre}, tu código de verificación es: ${code}. Vence en ${minutes} minutos.`;
  const html = `
    <div style="font-family:Arial,sans-serif">
      <h2>Verificación de cuenta</h2>
      <p>Hola <b>${nombre}</b>, tu código es:</p>
      <div style="font-size:22px;font-weight:700;letter-spacing:2px">${code}</div>
      <p>Vence en ${minutes} minutos.</p>
    </div>`;
  return { text, html };
}

function resetEmailTemplate({ nombre, code, minutes = 30 }) {
  const text = `Hola ${nombre}, tu código para cambiar contraseña es: ${code}. Vence en ${minutes} minutos.`;
  const html = `
    <div style="font-family:Arial,sans-serif">
      <h2>Recuperar contraseña</h2>
      <p>Hola <b>${nombre}</b>, tu código es:</p>
      <div style="font-size:22px;font-weight:700;letter-spacing:2px">${code}</div>
      <p>Vence en ${minutes} minutos.</p>
    </div>`;
  return { text, html };
}

module.exports = { sendMail, verifySmtp, verificationEmailTemplate, resetEmailTemplate };
