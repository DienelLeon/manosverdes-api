const { Router } = require('express');
const auth = require('../../middlewares/auth.middleware');
const roleGuard = require('../../utils/roleGuard');
const c = require('../../controladores/admin/centro_representante.controller');

const r = Router();

r.use(auth, roleGuard('admin'));

r.get('/', c.list);
r.get('/:centro_id', c.get);
r.post('/:centro_id', c.createOrUpdate);
r.put('/:centro_id', c.createOrUpdate);
r.delete('/:centro_id', c.delete);

module.exports = r;
