// src/services/admin/master.service.js
const HttpError = require("../../utils/httpError");
const masterDao = require("../../dao/admin/master.dao");

const isStr = (v) => typeof v === "string" && v.trim().length > 0;
const isNum = (v) => typeof v === "number" && v > 0;

/**
 * Obtener todas las categorías (padres) con sus hijos
 */
async function obtenerCategorias(filters = {}) {
  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(100, Number(filters.limit) || 10);
  const offset = (page - 1) * limit;

  // Validar state: solo 'activo' o 'inactivo'
  let state = null;
  const stateParam = filters.state?.trim?.();
  if (stateParam === "activo") {
    state = "activo";
  } else if (stateParam === "inactivo") {
    state = "inactivo";
  }

  const padres = await masterDao.obtenerPadres({
    search: filters.search,
    state,
    limit,
    offset,
  });

  const total = await masterDao.contar({
    parent_id: null,
    search: filters.search,
    state,
  });

  // Enriquecer cada padre con sus hijos (sin filtro de state en hijos)
  const categorias = await Promise.all(
    padres.map(async (padre) => ({
      ...padre,
      hijos: await masterDao.obtenerHijos(padre.id_master_table),
    })),
  );

  return {
    data: categorias,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Obtener una categoría específica con sus hijos
 */
async function obtenerCategoria(parentId, filters = {}) {
  if (!isNum(parentId)) {
    throw new HttpError(400, "ID de categoría inválido");
  }

  const padre = await masterDao.obtenerPorId(parentId);
  if (!padre) {
    throw new HttpError(404, "Categoría no encontrada");
  }

  // Validar state: solo 'activo' o 'inactivo'
  let state = null;
  const stateParam = filters.state?.trim?.();
  if (stateParam === "activo") {
    state = "activo";
  } else if (stateParam === "inactivo") {
    state = "inactivo";
  }

  const hijos = await masterDao.obtenerHijos(parentId, { state });

  return {
    categoria: padre,
    hijos,
  };
}

/**
 * Buscar dentro de una mini tabla (categoría específica)
 */
async function buscarEnCategoria(parentId, search, filters = {}) {
  if (!isNum(parentId)) {
    throw new HttpError(400, "ID de categoría inválido");
  }

  const padre = await masterDao.obtenerPorId(parentId);
  if (!padre) {
    throw new HttpError(404, "Categoría no encontrada");
  }

  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(100, Number(filters.limit) || 10);
  const offset = (page - 1) * limit;

  // Validar state: solo 'activo' o 'inactivo'
  let state = null;
  const stateParam = filters.state?.trim?.();
  if (stateParam === "activo") {
    state = "activo";
  } else if (stateParam === "inactivo") {
    state = "inactivo";
  }

  const hijos = await masterDao.obtenerHijos(parentId, {
    search,
    state,
    limit,
    offset,
  });

  const total = await masterDao.contar({
    parent_id: parentId,
    search,
    state,
  });

  return {
    categoria: padre,
    resultados: hijos,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Obtener un registro específico
 */
async function obtenerPorId(id) {
  if (!isNum(id)) {
    throw new HttpError(400, "ID inválido");
  }

  const registro = await masterDao.obtenerPorId(id);
  if (!registro) {
    throw new HttpError(404, "Registro no encontrado");
  }

  return registro;
}

/**
 * Crear una nueva categoría padre
 */
async function crearCategoria(data, userNow) {
  if (!isNum(userNow)) {
    throw new HttpError(401, "Usuario no autenticado");
  }

  if (!isStr(data.name)) {
    throw new HttpError(400, "Nombre es requerido");
  }

  // Si no proporciona id_master_table, autogenerar (100, 200, 300, etc)
  let idMasterTable = null;
  if (data.id_master_table) {
    if (!isNum(data.id_master_table)) {
      throw new HttpError(400, "ID maestro debe ser un número");
    }
    const existe = await masterDao.existeId(data.id_master_table);
    if (existe) {
      throw new HttpError(409, "Este ID ya existe");
    }
    idMasterTable = data.id_master_table;
  } else {
    // Autogenerar siguiente ID padre (100, 200, 300, etc)
    idMasterTable = await masterDao.obtenerSiguienteIdPadre();
  }

  const categoria = await masterDao.crear({
    id_master_table: idMasterTable,
    id_master_table_parent: null,
    value: null,
    description: data.description?.trim() || null,
    name: data.name.trim(),
    ordering: 0,
    user_now: userNow,
    state: "activo",
  });

  return categoria;
}

/**
 * Crear un hijo en una categoría
 */
async function crearHijo(parentId, data, userNow) {
  if (!isNum(userNow)) {
    throw new HttpError(401, "Usuario no autenticado");
  }

  if (!isNum(parentId)) {
    throw new HttpError(400, "ID de categoría inválido");
  }

  const padre = await masterDao.obtenerPorId(parentId);
  if (!padre) {
    throw new HttpError(404, "Categoría padre no encontrada");
  }

  if (!isStr(data.name)) {
    throw new HttpError(400, "Nombre es requerido");
  }

  if (!isStr(data.value)) {
    throw new HttpError(400, "Valor es requerido");
  }

  // Si no proporciona id_master_table, autogenerar dentro del rango del padre
  let idMasterTable = null;
  if (data.id_master_table) {
    if (!isNum(data.id_master_table)) {
      throw new HttpError(400, "ID maestro debe ser un número");
    }
    const existe = await masterDao.existeId(data.id_master_table);
    if (existe) {
      throw new HttpError(409, "Este ID ya existe");
    }
    idMasterTable = data.id_master_table;
  } else {
    // Autogenerar siguiente ID dentro del rango del padre
    try {
      idMasterTable = await masterDao.obtenerSiguienteIdHijo(parentId);
    } catch (e) {
      throw new HttpError(409, e.message);
    }
  }

  // Autogenerar ordering si no lo proporciona
  let ordering = 1;
  if (data.ordering) {
    ordering = data.ordering;
  } else {
    // Obtener máximo ordering actual de los hijos
    const hijos = await masterDao.obtenerHijos(parentId);
    ordering =
      (hijos.length > 0 ? Math.max(...hijos.map((h) => h.ordering)) : 0) + 1;
  }

  const hijo = await masterDao.crear({
    id_master_table: idMasterTable,
    id_master_table_parent: parentId,
    value: data.value.trim(),
    description: data.description?.trim() || null,
    name: data.name.trim(),
    ordering: ordering,
    add_additional_one: data.add_additional_one?.trim() || null,
    add_additional_two: data.add_additional_two?.trim() || null,
    add_additional_three: data.add_additional_three?.trim() || null,
    user_now: userNow,
    state: "activo",
  });

  return hijo;
}

/**
 * Actualizar un registro
 */
async function actualizar(id, data, userEdit) {
  if (!isNum(userEdit)) {
    throw new HttpError(401, "Usuario no autenticado");
  }

  if (!isNum(id)) {
    throw new HttpError(400, "ID inválido");
  }

  const registro = await masterDao.obtenerPorId(id);
  if (!registro) {
    throw new HttpError(404, "Registro no encontrado");
  }

  // Todos los campos son opcionales en actualización
  const actualizado = await masterDao.actualizar(id, {
    value: data.value !== undefined ? data.value.trim() : registro.value,
    description:
      data.description !== undefined
        ? data.description.trim() || null
        : registro.description,
    name: data.name !== undefined ? data.name.trim() : registro.name,
    ordering: data.ordering !== undefined ? data.ordering : registro.ordering,
    add_additional_one:
      data.add_additional_one !== undefined
        ? data.add_additional_one.trim() || null
        : registro.add_additional_one,
    add_additional_two:
      data.add_additional_two !== undefined
        ? data.add_additional_two.trim() || null
        : registro.add_additional_two,
    add_additional_three:
      data.add_additional_three !== undefined
        ? data.add_additional_three.trim() || null
        : registro.add_additional_three,
    user_edit: userEdit,
    state: data.state !== undefined ? data.state : registro.state,
  });

  return actualizado;
}

/**
 * Eliminar un registro
 */
async function eliminar(id) {
  if (!isNum(id)) {
    throw new HttpError(400, "ID inválido");
  }

  const registro = await masterDao.obtenerPorId(id);
  if (!registro) {
    throw new HttpError(404, "Registro no encontrada");
  }

  // Verificar si tiene hijos
  const hijos = await masterDao.obtenerHijos(id);
  if (hijos.length > 0) {
    throw new HttpError(
      409,
      "No se puede eliminar una categoría que tiene elementos. Primero elimina sus hijos.",
    );
  }

  const affectedRows = await masterDao.eliminar(id);
  return affectedRows > 0;
}

module.exports = {
  obtenerCategorias,
  obtenerCategoria,
  buscarEnCategoria,
  obtenerPorId,
  crearCategoria,
  crearHijo,
  actualizar,
  eliminar,
};
