const HttpError = require("../utils/httpError");
const usuarioDao = require("../dao/usuarios.dao");

exports.getMe = async (id) => {
  const u = await usuarioDao.obtenerPorId(id);
  if (!u) throw new HttpError(404, "Usuario no encontrado");

  // devuelve lo básico nomás
  return {
    id: u.id,
    nombre: u.nombre,
    apellido_paterno: u.apellido_paterno,
    apellido_materno: u.apellido_materno,
    email: u.email,
    telefono: u.telefono,
    fecha_nacimiento: u.fecha_nacimiento,
    avatar_key: u.avatar_key,
    rol: u.rol_clave,
    estado: u.estado,
  };
};
