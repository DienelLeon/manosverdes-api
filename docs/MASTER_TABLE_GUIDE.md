# Guía de Control - Master Table

## Introducción

Este documento es una **guía práctica y paso a paso** para controlar y usar el sistema de tabla maestra de catálogos. Aprenderás cómo crear categorías, gestionar hijos, filtrar datos y manejar estados.

---

## 🎯 Conceptos Clave

### Estructura Jerárquica

```
PADRE (Categoría)
├─ HIJO 1
├─ HIJO 2
├─ HIJO 3
└─ HIJO 4
```

- **PADRE**: Categoría principal (ej: "Tipo de Sexo", "Tipo de Documento")
- **HIJOS**: Valores específicos dentro de la categoría (ej: "Masculino", "Femenino")

### IDs Automáticos

- **Padres**: `100, 200, 300, 400...` (múltiplos de 100)
- **Hijos de padre 100**: `101-199`
- **Hijos de padre 200**: `201-299`
- **Máximo**: 99 hijos por padre

### Estados

- `activo` - Registro visible y disponible
- `inactivo` - Registro oculto pero no eliminado

---

## 📋 Guía de Operaciones

### 1️⃣ CREAR UNA NUEVA CATEGORÍA

**Objetivo**: Crear una categoría padre nueva como "Tipo de Sexo"

**Endpoint**:

```
POST /api/admin/master-table/categoria/crear
```

**Body**:

```json
{
  "name": "Tipo de Sexo",
  "description": "Clasificación de sexo/género"
}
```

**Respuesta**:

```json
{
  "ok": true,
  "data": {
    "id_master_table": 200,
    "name": "Tipo de Sexo",
    "value": null,
    "state": "activo",
    ...
  }
}
```

**Notas**:

- ✅ El `id_master_table` se autogenera (200 en este caso)
- ✅ No envíes `value` para padres
- ✅ `state` es `activo` por defecto
- ✅ Toma nota del `id_master_table` para agregar hijos

---

### 2️⃣ AGREGAR HIJOS A UNA CATEGORÍA

**Objetivo**: Agregar "Masculino" y "Femenino" a "Tipo de Sexo" (id=200)

**Endpoint**:

```
POST /api/admin/master-table/{parent_id}/hijo
```

**Ejemplo con parent_id=200**:

```
POST /api/admin/master-table/200/hijo
```

**Body**:

```json
{
  "name": "Masculino",
  "value": "MASCULINO",
  "description": "Género masculino"
}
```

**Respuesta**:

```json
{
  "ok": true,
  "data": {
    "id_master_table": 201,
    "id_master_table_parent": 200,
    "name": "Masculino",
    "value": "MASCULINO",
    "ordering": 1,
    "state": "activo",
    ...
  }
}
```

**Agregar segundo hijo**:

```json
{
  "name": "Femenino",
  "value": "FEMENINO"
}
```

Resultado: `id_master_table = 202`, `ordering = 2`

**Notas**:

- ✅ El `id_master_table` se asigna automáticamente (201, 202, 203...)
- ✅ El `ordering` se autogenera (1, 2, 3...)
- ✅ Si no envías `description`, será `null`
- ✅ `state` es `activo` por defecto

---

### 3️⃣ VER TODOS LOS CATÁLOGOS (Padres + Hijos)

**Objetivo**: Listar todas las categorías con sus hijos

**Endpoint**:

```
GET /api/admin/master-table
```

**Respuesta**:

```json
{
  "ok": true,
  "data": [
    {
      "id_master_table": 100,
      "name": "Tipo de Centro",
      "state": "activo",
      "hijos": [
        {"id_master_table": 101, "name": "Centro de acopio", "state": "activo"},
        {"id_master_table": 102, "name": "Recicladora", "state": "inactivo"}
      ]
    },
    {
      "id_master_table": 200,
      "name": "Tipo de Sexo",
      "state": "activo",
      "hijos": [
        {"id_master_table": 201, "name": "Masculino", "state": "activo"},
        {"id_master_table": 202, "name": "Femenino", "state": "activo"}
      ]
    }
  ],
  "pagination": {...}
}
```

**Variantes**:

```bash
# Todo (activo + inactivo)
GET /api/admin/master-table

# Solo categorías activas
GET /api/admin/master-table?state=activo

# Solo categorías inactivas
GET /api/admin/master-table?state=inactivo

# Buscar por nombre
GET /api/admin/master-table?search=sexo

# Con paginación
GET /api/admin/master-table?page=1&limit=20
```

---

### 4️⃣ VER UNA CATEGORÍA ESPECÍFICA CON SUS HIJOS

**Objetivo**: Ver detalles de "Tipo de Sexo" (id=200) y todos sus hijos

**Endpoint**:

```
GET /api/admin/master-table/200
```

**Respuesta**:

```json
{
  "ok": true,
  "categoria": {
    "id_master_table": 200,
    "name": "Tipo de Sexo",
    "value": null,
    "state": "activo"
  },
  "hijos": [
    { "id_master_table": 201, "name": "Masculino", "state": "activo" },
    { "id_master_table": 202, "name": "Femenino", "state": "activo" }
  ]
}
```

**Filtrar por estado**:

```bash
# Todo
GET /api/admin/master-table/200

# Solo hijos activos
GET /api/admin/master-table/200?state=activo

# Solo hijos inactivos
GET /api/admin/master-table/200?state=inactivo
```

---

### 5️⃣ BUSCAR DENTRO DE UNA CATEGORÍA

**Objetivo**: Buscar hijos dentro de "Tipo de Centro" (id=100) que coincidan con "centro"

**Endpoint**:

```
GET /api/admin/master-table/100/buscar?search=centro
```

**Respuesta**:

```json
{
  "ok": true,
  "categoria": {"id_master_table": 100, "name": "Tipo de Centro"},
  "resultados": [
    {"id_master_table": 101, "name": "Centro de acopio", "state": "activo"},
    {"id_master_table": 103, "name": "Centro municipal", "state": "activo"}
  ],
  "pagination": {...}
}
```

**Variantes**:

```bash
# Búsqueda básica
GET /api/admin/master-table/100/buscar?search=centro

# Con filtro de estado
GET /api/admin/master-table/100/buscar?search=centro&state=activo

# Con paginación
GET /api/admin/master-table/100/buscar?search=centro&page=1&limit=10
```

---

### 6️⃣ EDITAR UN REGISTRO (Padre o Hijo)

**Objetivo**: Cambiar el nombre de "Masculino" de "activo" a "inactivo"

**Endpoint**:

```
PUT /api/admin/master-table/{id}
```

**Ejemplo editando hijo (id=201)**:

```
PUT /api/admin/master-table/201
```

**Body** (solo envía lo que quieras cambiar):

```json
{
  "state": "inactivo"
}
```

**Respuesta**:

```json
{
  "ok": true,
  "data": {
    "id_master_table": 201,
    "name": "Masculino",
    "state": "inactivo",
    "user_edit": 1,
    "date_edit": "2026-02-02T10:30:00.000Z",
    ...
  }
}
```

**Otros ejemplos de edición**:

```bash
# Cambiar solo el nombre
PUT /api/admin/master-table/201
{ "name": "Hombre" }

# Cambiar nombre y descripción
PUT /api/admin/master-table/201
{ "name": "Hombre", "description": "Género masculino adulto" }

# Cambiar estado
PUT /api/admin/master-table/201
{ "state": "activo" }

# Cambiar el orden
PUT /api/admin/master-table/201
{ "ordering": 2 }
```

**Notas**:

- ✅ TODOS los campos son opcionales
- ✅ Solo envía lo que quieras cambiar
- ✅ Los campos no enviados mantienen su valor anterior
- ✅ Se actualiza automáticamente `user_edit` y `date_edit`

---

### 7️⃣ ELIMINAR UN REGISTRO

**Objetivo**: Eliminar "Femenino" (id=202)

**Endpoint**:

```
DELETE /api/admin/master-table/202
```

**Respuesta**:

```json
{
  "ok": true,
  "message": "Registro eliminado correctamente"
}
```

**Eliminar padres**:

Para eliminar una categoría padre:

1. **Primero**: Elimina todos los hijos

   ```bash
   DELETE /api/admin/master-table/201  # Masculino
   DELETE /api/admin/master-table/202  # Femenino
   ```

2. **Luego**: Elimina el padre
   ```bash
   DELETE /api/admin/master-table/200  # Tipo de Sexo
   ```

**Si intentas eliminar padre con hijos**:

```json
{
  "ok": false,
  "error": "No se puede eliminar una categoría que tiene elementos. Primero elimina sus hijos."
}
```

---

## 🎬 Casos de Uso Completos

### Caso 1: Crear "Tipo de Documento"

```bash
# 1. Crear categoría padre
POST /api/admin/master-table/categoria/crear
{
  "name": "Tipo de Documento",
  "description": "Documentos de identidad válidos"
}
# Respuesta: id = 300

# 2. Agregar DNI
POST /api/admin/master-table/300/hijo
{
  "name": "DNI",
  "value": "DNI",
  "description": "Documento Nacional de Identidad"
}
# Respuesta: id = 301

# 3. Agregar Pasaporte
POST /api/admin/master-table/300/hijo
{
  "name": "Pasaporte",
  "value": "PASAPORTE"
}
# Respuesta: id = 302

# 4. Agregar RUC
POST /api/admin/master-table/300/hijo
{
  "name": "RUC",
  "value": "RUC",
  "description": "Registro Único de Contribuyente"
}
# Respuesta: id = 303

# 5. Ver la categoría completa
GET /api/admin/master-table/300

# 6. Desactivar Pasaporte
PUT /api/admin/master-table/302
{ "state": "inactivo" }

# 7. Ver solo documentos activos
GET /api/admin/master-table/300?state=activo
```

### Caso 2: Gestionar Estados

```bash
# Ver TODOS (activo + inactivo)
GET /api/admin/master-table

# Ver solo ACTIVOS (para usar en combos de selección)
GET /api/admin/master-table?state=activo

# Ver solo INACTIVOS (para auditoría)
GET /api/admin/master-table?state=inactivo

# Desactivar un elemento
PUT /api/admin/master-table/101
{ "state": "inactivo" }

# Reactivar un elemento
PUT /api/admin/master-table/101
{ "state": "activo" }
```

### Caso 3: Búsqueda y Filtrado

```bash
# Buscar "centro" en Tipo de Centro
GET /api/admin/master-table/100/buscar?search=centro

# Buscar "centro" pero solo activos
GET /api/admin/master-table/100/buscar?search=centro&state=activo

# Buscar "recicladora" en Tipo de Centro
GET /api/admin/master-table/100/buscar?search=recicladora

# Buscar "empresa" en Tipo de Centro, página 2
GET /api/admin/master-table/100/buscar?search=empresa&page=2&limit=5
```

---

## ⚙️ Validaciones y Errores

| Error                      | Causa                    | Solución                 |
| -------------------------- | ------------------------ | ------------------------ |
| "Nombre es requerido"      | Creando sin `name`       | Agrega `"name": "..."`   |
| "Valor es requerido"       | Creando hijo sin `value` | Agrega `"value": "..."`  |
| "ID de categoría inválido" | parent_id no es número   | Asegúrate que sea número |
| "Categoría no encontrada"  | ID no existe             | Verifica el ID           |
| "No se puede eliminar..."  | Padre tiene hijos        | Elimina hijos primero    |
| 404                        | Registro no existe       | Verifica que exista      |

---

## 🎨 Estados del Registro

### Activo

- Visible en listados
- Disponible para usar
- Se muestra por defecto en búsquedas

```bash
GET /api/admin/master-table?state=activo
```

### Inactivo

- Oculto en listados normales
- No disponible para nuevas asignaciones
- Se ve solo al filtrar explícitamente

```bash
GET /api/admin/master-table?state=inactivo
```

### Cambiar Estado

```bash
# Desactivar
PUT /api/admin/master-table/101
{ "state": "inactivo" }

# Reactivar
PUT /api/admin/master-table/101
{ "state": "activo" }
```

---

## 📊 Auditoría

Todo registro mantiene un historial de cambios:

```json
{
  "user_now": 1,
  "date_now": "2026-02-02T00:28:57.000Z", // Creador
  "user_edit": 1,
  "date_edit": "2026-02-02T10:30:00.000Z" // Último editor
}
```

- **user_now**: ID del usuario que creó
- **date_now**: Cuándo se creó
- **user_edit**: ID del usuario que editó
- **date_edit**: Cuándo se editó

---

## 🚀 Tips y Trucos

### 1. Crear en Lotes

Si necesitas agregar muchos hijos, hazlo en paralelo:

```bash
# Agregar 3 documentos a la vez
POST /api/admin/master-table/300/hijo { "name": "DNI", "value": "DNI" }
POST /api/admin/master-table/300/hijo { "name": "Pasaporte", "value": "PASAPORTE" }
POST /api/admin/master-table/300/hijo { "name": "RUC", "value": "RUC" }
```

### 2. Usar para Combos

Para un dropdown de sexo:

```bash
GET /api/admin/master-table/200?state=activo
```

Response:

```json
{
  "data": [
    {
      "name": "Tipo de Sexo",
      "hijos": [
        { "id_master_table": 201, "name": "Masculino", "value": "MASCULINO" },
        { "id_master_table": 202, "name": "Femenino", "value": "FEMENINO" }
      ]
    }
  ]
}
```

Usa `hijos` para poblar el combo.

### 3. Campos Adicionales

Cada registro tiene 3 campos extra para datos customizados:

```bash
PUT /api/admin/master-table/201
{
  "name": "Masculino",
  "add_additional_one": "dato1",
  "add_additional_two": "dato2",
  "add_additional_three": "dato3"
}
```

### 4. Reordenar Elementos

Cambia el `ordering` para reordenar:

```bash
# Cambiar orden
PUT /api/admin/master-table/201
{ "ordering": 2 }

PUT /api/admin/master-table/202
{ "ordering": 1 }
```

---

## 📝 Resumen de Endpoints

| Método | Endpoint                 | Descripción                 |
| ------ | ------------------------ | --------------------------- |
| POST   | `/categoria/crear`       | Crear categoría padre       |
| POST   | `/:id/hijo`              | Agregar hijo a categoría    |
| GET    | `/`                      | Listar todas las categorías |
| GET    | `/:id`                   | Ver categoría + hijos       |
| GET    | `/:id/buscar?search=...` | Buscar dentro de categoría  |
| GET    | `/:id/detalles`          | Ver detalles de un registro |
| PUT    | `/:id`                   | Editar registro             |
| DELETE | `/:id`                   | Eliminar registro           |

---

## ✅ Checklist de Uso

- [ ] Crear categoría padre (`POST /categoria/crear`)
- [ ] Agregar hijos (`POST /:id/hijo`)
- [ ] Listar categorías (`GET /`)
- [ ] Ver categoría específica (`GET /:id`)
- [ ] Buscar dentro de categoría (`GET /:id/buscar`)
- [ ] Editar registro (`PUT /:id`)
- [ ] Cambiar estado a inactivo (`PUT /:id { "state": "inactivo" }`)
- [ ] Eliminar registro (`DELETE /:id`)

---

¡Listo para usar el sistema! 🎉
