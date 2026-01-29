const { Router } = require('express');
const c = require('../controladores/ubigeo.controller');

const r = Router();

r.get('/departamentos', c.departamentos);
r.get('/provincias', c.provincias);
r.get('/distritos', c.distritos);

module.exports = r;
