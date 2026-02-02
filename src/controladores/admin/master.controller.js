// src/controladores/admin/master.controller.js
const HttpError = require("../../utils/httpError");
const masterService = require("../../services/admin/master.service");

const isNum = (v) => !isNaN(v) && Number(v) > 0;

/**
 * GET /api/admin/master-table
 * Obtener todas las categorías (padres) con sus hijos
 * Query params: ?page=1&limit=10&search=texto&state=activo
 */
async function listarCategorias(req, res, next) {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      state: req.query.state,
    };

    const resultado = await masterService.obtenerCategorias(filters);
    res.json({ ok: true, ...resultado });
  } catch (e) {
    next(e);
  }
}

/**
 * GET /api/admin/master-table/:id
 * Obtener una categoría con sus hijos
 * Query params (opcional): ?state=activo|inactivo
 */
async function obtenerCategoria(req, res, next) {
  try {
    const { id } = req.params;
    const { state } = req.query;

    if (!isNum(id)) {
      throw new HttpError(400, "ID inválido");
    }

    const resultado = await masterService.obtenerCategoria(Number(id), {
      state,
    });
    res.json({ ok: true, ...resultado });
  } catch (e) {
    next(e);
  }
}

/**
 * GET /api/admin/master-table/:id/buscar
 * Buscar dentro de una mini tabla (categoría específica)
 * Query params: ?search=texto&page=1&limit=10&state=activo
 */
async function buscarEnCategoria(req, res, next) {
  try {
    const { id } = req.params;
    const { search, page, limit, state } = req.query;

    if (!isNum(id)) {
      throw new HttpError(400, "ID de categoría inválido");
    }

    if (!search || search.trim().length < 1) {
      throw new HttpError(400, "Parámetro de búsqueda requerido");
    }

    const resultado = await masterService.buscarEnCategoria(
      Number(id),
      search,
      {
        page,
        limit,
        state,
      },
    );

    res.json({ ok: true, ...resultado });
  } catch (e) {
    next(e);
  }
}

/**
 * GET /api/admin/master-table/:id/detalles
 * Obtener un registro específico
 */
async function obtenerDetalles(req, res, next) {
  try {
    const { id } = req.params;

    if (!isNum(id)) {
      throw new HttpError(400, "ID inválido");
    }

    const registro = await masterService.obtenerPorId(Number(id));
    res.json({ ok: true, data: registro });
  } catch (e) {
    next(e);
  }
}

/**
 * POST /api/admin/master-table/categoria/crear
 * Crear una nueva categoría padre
 */
async function crearCategoria(req, res, next) {
  try {
    const usuario_id = req.user?.id;
    const body = req.body || {};

    const categoria = await masterService.crearCategoria(body, usuario_id);
    res.status(201).json({ ok: true, data: categoria });
  } catch (e) {
    next(e);
  }
}

/**
 * POST /api/admin/master-table/:id/hijo
 * Crear un hijo en una categoría
 */
async function crearHijo(req, res, next) {
  try {
    const { id } = req.params;
    const usuario_id = req.user?.id;
    const body = req.body || {};

    if (!isNum(id)) {
      throw new HttpError(400, "ID de categoría inválido");
    }

    const hijo = await masterService.crearHijo(Number(id), body, usuario_id);
    res.status(201).json({ ok: true, data: hijo });
  } catch (e) {
    next(e);
  }
}

/**
 * PUT /api/admin/master-table/:id
 * Actualizar un registro
 */
async function actualizar(req, res, next) {
  try {
    const { id } = req.params;
    const usuario_id = req.user?.id;
    const body = req.body || {};

    if (!isNum(id)) {
      throw new HttpError(400, "ID inválido");
    }

    const actualizado = await masterService.actualizar(
      Number(id),
      body,
      usuario_id,
    );
    res.json({ ok: true, data: actualizado });
  } catch (e) {
    next(e);
  }
}

/**
 * DELETE /api/admin/master-table/:id
 * Eliminar un registro
 */
async function eliminar(req, res, next) {
  try {
    const { id } = req.params;

    if (!isNum(id)) {
      throw new HttpError(400, "ID inválido");
    }

    const eliminado = await masterService.eliminar(Number(id));

    if (!eliminado) {
      throw new HttpError(500, "Error al eliminar el registro");
    }

    res.json({ ok: true, message: "Registro eliminado correctamente" });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  listarCategorias,
  obtenerCategoria,
  buscarEnCategoria,
  obtenerDetalles,
  crearCategoria,
  crearHijo,
  actualizar,
  eliminar,
};
