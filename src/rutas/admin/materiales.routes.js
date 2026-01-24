const { Router } = require('express');
const auth = require('../../middlewares/auth.middleware');
const roleGuard = require('../../utils/roleGuard');
const c = require('../../controladores/admin/materiales.controller');

const r = Router();

r.use(auth, roleGuard('admin'));

r.get('/materiales/all', c.listMaterialesAll);
r.get('/subcategorias/all', c.listSubcategoriasAll);

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

r.get('/materiales', c.materialList);
r.get('/materiales/:id', c.materialGet);
r.post('/materiales', c.materialCreate);
r.put('/materiales/:id', c.materialUpdate);
r.delete('/materiales/:id', c.materialDelete);

r.get('/materiales/:id/info', c.materialInfoGet);
r.put('/materiales/:id/info', c.materialInfoUpsert);

module.exports = r;
