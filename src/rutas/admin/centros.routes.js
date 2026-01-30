const { Router } = require('express');
const auth = require('../../middlewares/auth.middleware');
const roleGuard = require('../../utils/roleGuard');
const c = require('../../controladores/admin/centros.controller');

const r = Router();

r.use(auth, roleGuard('admin'));

r.get('/', c.listar);
r.get('/:id', c.obtener);

r.post('/', c.crear);
r.put('/:id', c.actualizar);
r.put('/:id/estado', c.cambiarEstado);

r.put('/:id/representante', c.repUpsert);
r.delete('/:id/representante', c.repDelete);

r.delete('/:id', c.eliminar);

module.exports = r;
