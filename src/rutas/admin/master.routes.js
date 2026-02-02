// src/rutas/admin/master.routes.js
const { Router } = require('express');
const c = require('../../controladores/admin/master.controller');
const auth = require('../../middlewares/auth.middleware');
const roleGuard = require('../../utils/roleGuard');

const r = Router();

// Middleware de autenticación y autorización (solo admin)
r.use(auth, roleGuard('admin'));

/**
 * GET /api/admin/master-table
 * Listar todas las categorías (padres) con sus hijos
 * Query params: ?page=1&limit=10&search=texto&state=activo
 */
r.get('/', c.listarCategorias);

/**
 * POST /api/admin/master-table/categoria/crear
 * Crear una nueva categoría padre
 * Body: { id_master_table, name, value, description }
 */
r.post('/categoria/crear', c.crearCategoria);

/**
 * GET /api/admin/master-table/:id
 * Obtener una categoría específica con sus hijos
 */
r.get('/:id', c.obtenerCategoria);

/**
 * GET /api/admin/master-table/:id/detalles
 * Obtener detalles de un registro específico
 */
r.get('/:id/detalles', c.obtenerDetalles);

/**
 * GET /api/admin/master-table/:id/buscar
 * Buscar dentro de una mini tabla (categoría específica)
 * Query params: ?search=texto&page=1&limit=10&state=activo
 */
r.get('/:id/buscar', c.buscarEnCategoria);

/**
 * POST /api/admin/master-table/:id/hijo
 * Crear un hijo en una categoría
 * Body: { id_master_table, name, value, description, ordering, add_additional_one, etc }
 */
r.post('/:id/hijo', c.crearHijo);

/**
 * PUT /api/admin/master-table/:id
 * Actualizar un registro
 * Body: { name, value, description, ordering, state, add_additional_one, etc }
 */
r.put('/:id', c.actualizar);

/**
 * DELETE /api/admin/master-table/:id
 * Eliminar un registro
 */
r.delete('/:id', c.eliminar);

module.exports = r;
