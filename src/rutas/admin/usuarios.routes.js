// src/rutas/admin/usuarios.routes.js
const { Router } = require('express');
const auth = require('../../middlewares/auth.middleware');
const roleGuard = require('../../utils/roleGuard');
const c = require('../../controladores/admin/usuarios.controller');

const r = Router();

r.use(auth, roleGuard('admin'));

r.get('/', c.listar);
r.get('/:id', c.obtener);
r.post('/', c.crear);
r.put('/:id', c.actualizar);

r.patch('/:id/estado', c.cambiarEstado);

module.exports = r;
