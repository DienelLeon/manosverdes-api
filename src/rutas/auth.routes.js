const { Router } = require('express');
const c = require('../controladores/auth.controller');
const auth = require('../middlewares/auth.middleware');

const r = Router();

r.post('/register', c.register);

r.post('/verify/send-email', c.verifySendEmail);
r.post('/verify/confirm', c.verifyConfirm);

r.post('/password/forgot', c.passwordForgot);
r.post('/password/reset', c.passwordReset);

r.post('/login', c.login);
r.post('/logout', auth, c.logout);

r.get('/me', auth, c.me);

module.exports = r;