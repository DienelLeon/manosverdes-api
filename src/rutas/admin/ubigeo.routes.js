const { Router } = require('express');
const auth = require('../../middlewares/auth.middleware');
const roleGuard = require('../../utils/roleGuard');
const c = require('../../controladores/admin/ubigeo.controller.js');

const r = Router();

r.use(auth, roleGuard('admin'));

// Departamento
r.get('/departamento', c.departamentoList);
r.get('/departamento/:id', c.departamentoGet);
r.post('/departamento', c.departamentoCreate);
r.put('/departamento/:id', c.departamentoUpdate);
r.delete('/departamento/:id', c.departamentoDelete);

// Provincia
r.get('/provincia', c.provinciaList); // ?departamento_id=
r.get('/provincia/:id', c.provinciaGet);
r.post('/provincia', c.provinciaCreate);
r.put('/provincia/:id', c.provinciaUpdate);
r.delete('/provincia/:id', c.provinciaDelete);

// Distrito
r.get('/distrito', c.distritoList); // ?provincia_id=
r.get('/distrito/:id', c.distritoGet);
r.post('/distrito', c.distritoCreate);
r.put('/distrito/:id', c.distritoUpdate);
r.delete('/distrito/:id', c.distritoDelete);

module.exports = r;
