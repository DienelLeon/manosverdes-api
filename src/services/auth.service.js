// src/services/auth.service.js
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const HttpError = require('../utils/httpError');
const authDao = require('../dao/auth.dao');
const { signToken } = require('../utils/jwt');
const { sendMail, verificationEmailTemplate, resetEmailTemplate } = require('../utils/mailer');

const VERIFY_MIN = Number(process.env.VERIFY_CODE_MIN || 10);
const LOGIN_MAX_FAILS = Number(process.env.LOGIN_MAX_FAILS || 5);
const LOGIN_LOCK_MIN = Number(process.env.LOGIN_LOCK_MIN || 15);

const isDev = (process.env.NODE_ENV || 'development') === 'development';

function normEmail(email) {
  return String(email || '').trim().toLowerCase();
}
function sha256Hex(x) {
  return crypto.createHash('sha256').update(String(x)).digest('hex');
}
function code6() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
function expiraEn(mins) {
  return new Date(Date.now() + Number(mins) * 60 * 1000);
}
function validarPassword(pw) {
  const s = String(pw || '');
  if (s.length < 8) throw new HttpError(400, 'La contraseña debe tener mínimo 8 caracteres');
}

async function enviarOtp({ usuario_id, email, nombre, tipo }) {
  const code = code6();
  const codigo_hash = sha256Hex(code);
  await authDao.otpUpsert(usuario_id, tipo, codigo_hash, expiraEn(VERIFY_MIN));

  if (tipo === 'password_reset') {
    const tpl = resetEmailTemplate({ nombre: nombre || 'usuario', code, minutes: VERIFY_MIN });
    await sendMail({ to: email, subject: 'Recuperar contraseña - Manos Verdes', ...tpl }).catch(() => {});
  } else {
    const tpl = verificationEmailTemplate({ nombre: nombre || 'usuario', code, minutes: VERIFY_MIN });
    await sendMail({ to: email, subject: 'Verifica tu cuenta - Manos Verdes', ...tpl }).catch(() => {});
  }

  return isDev ? { code, expira_min: VERIFY_MIN } : { expira_min: VERIFY_MIN };
}

async function register(data) {
  const email = normEmail(data.email);
  validarPassword(data.password);

  const existe = await authDao.obtenerUsuarioPorEmail(email);
  if (existe) throw new HttpError(409, 'El email ya está registrado');

  const rol_clave = data.rol_clave || 'app';
  if (!['app', 'centro', 'admin'].includes(rol_clave)) throw new HttpError(400, 'Rol inválido');
  if (rol_clave !== 'app') throw new HttpError(403, 'No permitido registrar ese rol');

  const password_hash = await bcrypt.hash(String(data.password), 10);

  const usuario_id = await authDao.crearUsuario({
    ...data,
    email,
    password_hash,
    rol_clave,
  });

  if (!usuario_id) throw new HttpError(500, 'No se pudo registrar el usuario');

  await enviarOtp({ usuario_id, email, nombre: data.nombre, tipo: 'email_verificacion' });

  return { id: usuario_id, message: 'Registrado. Revisa tu correo para el código.' };
}

async function verifySendEmail(emailRaw) {
  const email = normEmail(emailRaw);
  const u = await authDao.obtenerUsuarioPorEmail(email);
  if (!u) throw new HttpError(404, 'Usuario no encontrado');

  if (u.estado === 'inactivo') throw new HttpError(403, 'Cuenta deshabilitada');
  if (Number(u.email_verificado) === 1) return { message: 'El correo ya está verificado' };

  const out = await enviarOtp({ usuario_id: u.id, email, nombre: u.nombre, tipo: 'email_verificacion' });
  return { message: 'Código reenviado', ...out };
}

async function verifyConfirm(emailRaw, code) {
  const email = normEmail(emailRaw);
  const u = await authDao.obtenerUsuarioPorEmail(email);
  if (!u) throw new HttpError(404, 'Usuario no encontrado');

  if (u.estado === 'inactivo') throw new HttpError(403, 'Cuenta deshabilitada');
  if (Number(u.email_verificado) === 1) return { message: 'Ya estaba verificado' };

  const ok = await authDao.otpUsarSiValido(u.id, 'email_verificacion', sha256Hex(code));
  if (!ok) throw new HttpError(400, 'Código inválido o expirado');

  const affected = await authDao.marcarEmailVerificado(u.id);
  if (affected < 1) throw new HttpError(500, 'No se pudo verificar el correo');

  return { message: 'Correo verificado ✅' };
}

async function passwordForgot(emailRaw) {
  const email = normEmail(emailRaw);
  const neutro = { message: 'Si el correo existe, te enviaremos un código.' };

  const u = await authDao.obtenerUsuarioPorEmail(email);
  if (!u) return { ...neutro, next: 'otp' };

  if (u.estado === 'inactivo') throw new HttpError(403, 'Cuenta deshabilitada');

  if (Number(u.email_verificado) === 1) {
    await enviarOtp({ usuario_id: u.id, email, nombre: u.nombre, tipo: 'password_reset' });
    return { ...neutro, next: 'reset_password' };
  }

  await enviarOtp({ usuario_id: u.id, email, nombre: u.nombre, tipo: 'email_verificacion' });
  return { ...neutro, next: 'verify_email' };
}

async function passwordReset(emailRaw, code, new_password) {
  const email = normEmail(emailRaw);
  validarPassword(new_password);

  const u = await authDao.obtenerUsuarioPorEmail(email);
  if (!u) throw new HttpError(400, 'Código inválido o expirado');

  if (u.estado === 'inactivo') throw new HttpError(403, 'Cuenta deshabilitada');
  if (Number(u.email_verificado) !== 1) throw new HttpError(403, 'Primero verifica tu correo');

  const ok = await authDao.otpUsarSiValido(u.id, 'password_reset', sha256Hex(code));
  if (!ok) throw new HttpError(400, 'Código inválido o expirado');

  const hash = await bcrypt.hash(String(new_password), 10);
  const affected = await authDao.actualizarPassword(u.id, hash);
  if (affected < 1) throw new HttpError(500, 'No se pudo actualizar la contraseña');

  return { message: 'Contraseña actualizada ✅' };
}

async function login(emailRaw, password) {
  const email = normEmail(emailRaw);
  const u = await authDao.obtenerUsuarioPorEmail(email);
  if (!u) throw new HttpError(401, 'Credenciales inválidas');

  if (u.estado === 'inactivo') throw new HttpError(403, 'Cuenta deshabilitada');
  if (u.estado === 'bloqueado') throw new HttpError(403, 'Cuenta bloqueada');

  if (u.bloqueado_hasta && new Date(u.bloqueado_hasta) > new Date()) {
    throw new HttpError(429, 'Demasiados intentos. Intenta más tarde');
  }

  const ok = await bcrypt.compare(String(password), String(u.password_hash || ''));
  if (!ok) {
    await authDao.intentoFallido(u.id, LOGIN_MAX_FAILS, LOGIN_LOCK_MIN);
    throw new HttpError(401, 'Credenciales inválidas');
  }

  if (Number(u.email_verificado) !== 1) throw new HttpError(403, 'Cuenta no verificada');

  await authDao.resetIntentos(u.id);

  const { token } = signToken({ id: u.id, rol: u.rol_clave });

  return {
    token,
    usuario: {
      id: u.id,
      nombre: u.nombre,
      apellido_paterno: u.apellido_paterno,
      apellido_materno: u.apellido_materno,
      email: u.email,
      rol: u.rol_clave,
      avatar_key: u.avatar_key,
    },
  };
}

async function logout() {
  return { message: 'Sesión cerrada' };
}

async function me(usuario_id) {
  const u = await authDao.obtenerUsuarioPorId(usuario_id);
  if (!u) throw new HttpError(404, "Usuario no encontrado");

  return {
    usuario: {
      id: u.id,
      nombre: u.nombre,
      apellido_paterno: u.apellido_paterno,
      apellido_materno: u.apellido_materno,
      email: u.email,
      telefono: u.telefono,
      avatar_key: u.avatar_key,
      estado: u.estado,
      rol: u.rol_clave,
      creado_en: u.creado_en,
    },
  };
}


 
module.exports = {
  register,
  verifySendEmail,
  verifyConfirm,
  passwordForgot,
  passwordReset,
  login,
  logout,
  me,
};
