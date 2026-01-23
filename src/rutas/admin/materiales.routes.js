const { Router } = require('express');
const auth = require('../../middlewares/auth.middleware');
const roleGuard = require('../../utils/roleGuard');
const c = require('../../controladores/admin/materiales.controller');

const r = Router();

r.use(auth, roleGuard('admin'));

r.get('/categorias', c.categoriaList);
r.get('/categorias/:id', c.categoriaGet);
r.post('/categorias', c.categoriaCreate);
r.put('/categorias/:id', c.categoriaUpdate);
r.delete('/categorias/:id', c.categoriaDelete);

r.get('/subcategorias', c.subcategoriaList); 
r.get('/subcategorias/:id', c.subcategoriaGet);
r.post('/subcategorias', c.subcategoriaCreate);
r.put('/subcategorias/:id', c.subcategoriaUpdate);
r.delete('/subcategorias/:id', c.subcategoriaDelete);

r.get('/', c.materialList);
r.get('/info', c.materialInfoList);
r.get('/:id', c.materialGet);
r.post('/', c.materialCreate);
r.put('/:id', c.materialUpdate);
r.delete('/:id', c.materialDelete);

r.get('/:id/info', c.materialInfoGet);
r.put('/:id/info', c.materialInfoUpsert);

module.exports = r;
