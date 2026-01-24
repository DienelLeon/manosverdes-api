// src/rutas/index.routes.js
const { Router } = require('express');
const router = Router();

router.get('/', (_req, res) => res.json({ message: '🌱 API Manos Verdes' }));

router.use('/auth', require('./auth.routes'));

// Admin
router.use('/admin/ubigeo', require('./admin/ubigeo.routes'));
router.use('/admin/materiales', require('./admin/materiales.routes'));
router.use('/admin/upload', require('./admin/upload.routes'));
router.use('/admin/usuarios', require('./admin/usuarios.routes'));

module.exports = router;