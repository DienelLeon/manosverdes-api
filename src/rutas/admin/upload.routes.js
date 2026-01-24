// src/rutas/admin/upload.routes.js
const { Router } = require('express');
const auth = require('../../middlewares/auth.middleware');
const roleGuard = require('../../utils/roleGuard');
const uploadImage = require('../../utils/uploadImage');
const c = require('../../controladores/admin/upload.controller');

const r = Router();

r.use(auth, roleGuard('admin'));

r.post('/material-categoria/icono', uploadImage.single('file'), 
    c.uploadMaterialCategoriaIcono);

r.post('/material/icono', uploadImage.single('file'),
    c.uploadMaterialIcono);

r.post('/usuario/:id/avatar', uploadImage.single('file'),
     c.uploadUsuarioAvatar);

module.exports = r;