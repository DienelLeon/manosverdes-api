// src/controladores/auth.controller.js
const HttpError = require('../utils/httpError');
const authService = require('../services/auth.service');

const isStr = (v) => typeof v === 'string' && v.trim().length > 0;

async function register(req, res, next) {
  try {
    const b = req.body || {};
    if (!isStr(b.nombre) || !isStr(b.apellido_paterno) || !isStr(b.email) || !isStr(b.password)) {
      throw new HttpError(400, 'Faltan campos obligatorios');
    }
    const out = await authService.register(b);
    res.status(201).json({ ok: true, ...out });
  } catch (e) { next(e); }
}

async function verifySendEmail(req, res, next) {
  try {
    const b = req.body || {};
    if (!isStr(b.email)) throw new HttpError(400, 'Email requerido');
    const out = await authService.verifySendEmail(b.email);
    res.json({ ok: true, ...out });
  } catch (e) { next(e); }
}

async function verifyConfirm(req, res, next) {
  try {
    const b = req.body || {};
    if (!isStr(b.email) || !isStr(b.code)) throw new HttpError(400, 'Email y code son requeridos');
    const out = await authService.verifyConfirm(b.email, b.code);
    res.json({ ok: true, ...out });
  } catch (e) { next(e); }
}

async function passwordForgot(req, res, next) {
  try {
    const b = req.body || {};
    if (!isStr(b.email)) throw new HttpError(400, 'Email requerido');
    const out = await authService.passwordForgot(b.email);
    res.json({ ok: true, ...out });
  } catch (e) { next(e); }
}

async function passwordReset(req, res, next) {
  try {
    const b = req.body || {};
    if (!isStr(b.email) || !isStr(b.code) || !isStr(b.new_password)) {
      throw new HttpError(400, 'Email, code y new_password requeridos');
    }
    const out = await authService.passwordReset(b.email, b.code, b.new_password);
    res.json({ ok: true, ...out });
  } catch (e) { next(e); }
}

async function login(req, res, next) {
  try {
    const b = req.body || {};
    if (!isStr(b.email) || !isStr(b.password)) throw new HttpError(400, 'Email y password requeridos');
    const out = await authService.login(b.email, b.password);
    res.json({ ok: true, ...out });
  } catch (e) { next(e); }
}

async function logout(req, res, next) {
  try {
    const out = await authService.logout(req);
    res.json({ ok: true, ...out });
  } catch (e) { next(e); }
}

async function me(req, res, next) {
  try {
    const usuario_id = req.user?.id;
    if (!usuario_id) throw new HttpError(401, "Token inválido");

    const out = await authService.me(usuario_id);
    res.json({ ok: true, ...out });
  } catch (e) {
    next(e);
  }
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
