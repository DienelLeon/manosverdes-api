// src/services/ubigeo.service.js
const HttpError = require('../../utils/httpError');
const dao = require('../../dao/admin/ubigeo.dao');

const isStr = (v) => typeof v === 'string' && v.trim().length > 0;

function toId(x, fieldName = 'id') {
  const n = Number(x);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, `${fieldName} inválido`);
  return n;
}

function cleanNombre(nombre) {
  if (!isStr(nombre)) throw new HttpError(400, 'nombre requerido');
  return nombre.trim();
}

/* DEPARTAMENTO */
async function departamentoList() {
  return dao.departamentoList();
}
async function departamentoGet(id) {
  id = toId(id);
  const row = await dao.departamentoGet(id);
  if (!row) throw new HttpError(404, 'Departamento no encontrado');
  return row;
}
async function departamentoCreate(nombre) {
  nombre = cleanNombre(nombre);
  const id = await dao.departamentoCreate(nombre);
  return { id };
}
async function departamentoUpdate(id, nombre) {
  id = toId(id);
  nombre = cleanNombre(nombre);
  const affected = await dao.departamentoUpdate(id, nombre);
  if (affected < 1) throw new HttpError(404, 'Departamento no encontrado');
  return { affected };
}
async function departamentoDelete(id) {
  id = toId(id);
  const affected = await dao.departamentoDelete(id);
  if (affected < 1) throw new HttpError(404, 'Departamento no encontrado');
  return { affected };
}

/* PROVINCIA */
async function provinciaList(departamento_id) {
  departamento_id = toId(departamento_id, 'departamento_id');
  return dao.provinciaList(departamento_id);
}
async function provinciaGet(id) {
  id = toId(id);
  const row = await dao.provinciaGet(id);
  if (!row) throw new HttpError(404, 'Provincia no encontrada');
  return row;
}
async function provinciaCreate(departamento_id, nombre) {
  departamento_id = toId(departamento_id, 'departamento_id');
  nombre = cleanNombre(nombre);
  const id = await dao.provinciaCreate(departamento_id, nombre);
  return { id };
}
async function provinciaUpdate(id, departamento_id, nombre) {
  id = toId(id);
  departamento_id = toId(departamento_id, 'departamento_id');
  nombre = cleanNombre(nombre);
  const affected = await dao.provinciaUpdate(id, departamento_id, nombre);
  if (affected < 1) throw new HttpError(404, 'Provincia no encontrada');
  return { affected };
}
async function provinciaDelete(id) {
  id = toId(id);
  const affected = await dao.provinciaDelete(id);
  if (affected < 1) throw new HttpError(404, 'Provincia no encontrada');
  return { affected };
}

/* DISTRITO */
async function distritoList(provincia_id) {
  provincia_id = toId(provincia_id, 'provincia_id');
  return dao.distritoList(provincia_id);
}
async function distritoGet(id) {
  id = toId(id);
  const row = await dao.distritoGet(id);
  if (!row) throw new HttpError(404, 'Distrito no encontrado');
  return row;
}
async function distritoCreate(provincia_id, nombre) {
  provincia_id = toId(provincia_id, 'provincia_id');
  nombre = cleanNombre(nombre);
  const id = await dao.distritoCreate(provincia_id, nombre);
  return { id };
}
async function distritoUpdate(id, provincia_id, nombre) {
  id = toId(id);
  provincia_id = toId(provincia_id, 'provincia_id');
  nombre = cleanNombre(nombre);
  const affected = await dao.distritoUpdate(id, provincia_id, nombre);
  if (affected < 1) throw new HttpError(404, 'Distrito no encontrado');
  return { affected };
}
async function distritoDelete(id) {
  id = toId(id);
  const affected = await dao.distritoDelete(id);
  if (affected < 1) throw new HttpError(404, 'Distrito no encontrado');
  return { affected };
}

module.exports = {
  departamentoList,
  departamentoGet,
  departamentoCreate,
  departamentoUpdate,
  departamentoDelete,

  provinciaList,
  provinciaGet,
  provinciaCreate,
  provinciaUpdate,
  provinciaDelete,

  distritoList,
  distritoGet,
  distritoCreate,
  distritoUpdate,
  distritoDelete,
};
