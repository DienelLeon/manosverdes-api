# 📡 APIs BACKEND - MANOS VERDES COMPLETO

**Base URL:** `http://localhost:3000/api`
**Port:** 3000
**Database:** MySQL manosverdes

---

## 🔓 PÚBLICOS (Sin Autenticación)

### Health Check
```
GET /health
Response: { "ok": true, "service": "api-manosverdes" }
```

### Home
```
GET /
Response: { "message": "🌱 API Manos Verdes" }
```

---

## 🔐 AUTENTICACIÓN - `/auth`

### Registrar Usuario
```
POST /auth/register
Body: {
  "nombre": "Juan",
  "apellido_paterno": "Pérez",
  "apellido_materno": "García",
  "email": "juan@example.com",
  "password": "MiPass123456",
  "telefono": "987654321",
  "fecha_nacimiento": "1990-01-15",
  "rol_clave": "app"  // solo "app" permitido para usuarios
}
Response: {
  "ok": true,
  "usuario_id": 1,
  "email": "juan@example.com",
  "requiere_verificacion": true
}
```

### Enviar OTP Verificación Email
```
POST /auth/verify/send-email
Body: { "email": "juan@example.com" }
Response: {
  "ok": true,
  "expira_min": 10,
  "code": "123456"  // solo en development
}
```

### Confirmar OTP
```
POST /auth/verify/confirm
Body: {
  "email": "juan@example.com",
  "code": "123456"
}
Response: {
  "ok": true,
  "mensaje": "Email verificado"
}
```

### Solicitar Reset Contraseña
```
POST /auth/password/forgot
Body: { "email": "juan@example.com" }
Response: {
  "ok": true,
  "expira_min": 10
}
```

### Resetear Contraseña
```
POST /auth/password/reset
Body: {
  "email": "juan@example.com",
  "code": "123456",
  "password": "NuevaPass123456"
}
Response: {
  "ok": true,
  "mensaje": "Contraseña actualizada"
}
```

### Login
```
POST /auth/login
Body: {
  "email": "admin@manosverdes.test",
  "password": "Test123456"
}
Response: {
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": 1,
    "nombre": "Admin",
    "email": "admin@manosverdes.test",
    "rol_id": 1,
    "rol_clave": "admin"
  },
  "expirado_en": "2026-01-29"
}
```

### Logout
```
POST /auth/logout
Headers: { "Authorization": "Bearer <token>" }
Response: { "ok": true, "mensaje": "Sesión cerrada" }
```

### Obtener perfil del usuario autenticado
```
GET /auth/me
Headers: { "Authorization": "Bearer <token_jwt>" }
Response:
{
  "ok": true,
  "id": 1,
  "nombre": "Admin",
  "apellido_paterno": "Manos",
  "apellido_materno": "Verdes",
  "email": "admin@manosverdes.test",
  "telefono": "987654321",
  "avatar_url": "https://storage.googleapis.com/.../avatar.png",
  "rol_id": 1,
  "rol_clave": "admin",
  "rol": "admin",
  "estado": "activo",
  "email_verificado": 1
}
```

---

## 🛠️ ADMIN - MATERIALES - `/admin/materiales`
**Requiere:** Autenticación + Rol Admin

### CATEGORÍAS

#### Listar Categorías
```
GET /admin/materiales/categorias
Response: {
  "ok": true,
  "items": [
    { "id": 1, "nombre": "Plásticos", "icono": "plastic.png", "activo": 1 },
    { "id": 2, "nombre": "Vidrio", "icono": "glass.png", "activo": 1 }
  ]
}
```

#### Obtener Categoría
```
GET /admin/materiales/categorias/1
Response: {
  "ok": true,
  "item": { "id": 1, "nombre": "Plásticos", "icono": "plastic.png", "activo": 1 }
}
```

#### Crear Categoría
```
POST /admin/materiales/categorias
Body: {
  "nombre": "Plásticos",
  "icono": "plastic.png",
  "activo": 1
}
Response: {
  "ok": true,
  "id": 1
}
```

#### Actualizar Categoría
```
PUT /admin/materiales/categorias/1
Body: {
  "nombre": "Plásticos Reciclables",
  "icono": "plastic-new.png",
  "activo": 1
}
Response: {
  "ok": true,
  "affected": 1
}
```

#### Eliminar Categoría
```
DELETE /admin/materiales/categorias/1
Response: {
  "ok": true,
  "affected": 1
}
```

---

### SUBCATEGORÍAS

#### Listar Subcategorías
```
GET /admin/materiales/subcategorias?categoria_id=1
Response: {
  "ok": true,
  "items": [
    { "id": 1, "categoria_id": 1, "nombre": "PET (botellas)", "activo": 1 },
    { "id": 2, "categoria_id": 1, "nombre": "HDPE (bolsas)", "activo": 1 }
  ]
}
```

#### Obtener Subcategoría
```
GET /admin/materiales/subcategorias/1
Response: {
  "ok": true,
  "item": { "id": 1, "categoria_id": 1, "nombre": "PET (botellas)", "activo": 1 }
}
```

#### Crear Subcategoría
```
POST /admin/materiales/subcategorias
Body: {
  "categoria_id": 1,
  "nombre": "PET (botellas)",
  "activo": 1
}
Response: {
  "ok": true,
  "id": 1
}
```

#### Actualizar Subcategoría
```
PUT /admin/materiales/subcategorias/1
Body: {
  "categoria_id": 1,
  "nombre": "PET transparente",
  "activo": 1
}
Response: {
  "ok": true,
  "affected": 1
}
```

#### Eliminar Subcategoría
```
DELETE /admin/materiales/subcategorias/1
Response: {
  "ok": true,
  "affected": 1
}
```

---

### MATERIALES

#### Listar Materiales
```
GET /admin/materiales/materiales
Query params opcionales: ?subcategoria_id=1&activo=1&elegible=1
Response: {
  "ok": true,
  "items": [
    {
      "id": 1,
      "subcategoria_id": 1,
      "nombre": "Botella PET transparente",
      "icono": "bottle.png",
      "elegible": 1,
      "activo": 1
    }
  ]
}
```

#### Obtener Material
```
GET /admin/materiales/materiales/1
Response: {
  "ok": true,
  "item": {
    "id": 1,
    "subcategoria_id": 1,
    "nombre": "Botella PET transparente",
    "icono": "bottle.png",
    "elegible": 1,
    "activo": 1
  }
}
```

#### Crear Material
```
POST /admin/materiales/materiales
Body: {
  "subcategoria_id": 1,
  "nombre": "Botella PET transparente",
  "icono": "bottle.png",
  "elegible": 1,
  "activo": 1
}
Response: {
  "ok": true,
  "id": 1
}
```

#### Actualizar Material
```
PUT /admin/materiales/materiales/1
Body: {
  "subcategoria_id": 1,
  "nombre": "Botella PET azul",
  "icono": "bottle-blue.png",
  "elegible": 1,
  "activo": 1
}
Response: {
  "ok": true,
  "affected": 1
}
```

#### Eliminar Material
```
DELETE /admin/materiales/materiales/1
Response: {
  "ok": true,
  "affected": 1
}
```

#### Obtener Info Detallada Material
```
GET /admin/materiales/materiales/1/info
Response: {
  "ok": true,
  "item": {
    "material_id": 1,
    "descripcion": "Botella de plástico PET...",
    "beneficios": "Reciclable, reutilizable...",
    "proceso": "Se tritura y se procesa...",
    "ideas": "Bolsas, ropa, etc...",
    "contaminacion": "Tarda 500 años en descomponerse..."
  }
}
```

#### Actualizar Info Detallada Material
```
PUT /admin/materiales/materiales/1/info
Body: {
  "descripcion": "Botella de plástico PET...",
  "beneficios": "Reciclable, reutilizable...",
  "proceso": "Se tritura y se procesa...",
  "ideas": "Bolsas, ropa, etc...",
  "contaminacion": "Tarda 500 años en descomponerse..."
}
Response: {
  "ok": true,
  "affected": 1
}
```

---

## 📍 ADMIN - GEOGRAFÍA PERÚ - `/admin/ubigeo`
**Requiere:** Autenticación + Rol Admin

### DEPARTAMENTOS

#### Listar Departamentos
```
GET /admin/ubigeo/departamento
Response: {
  "ok": true,
  "items": [
    { "id": 1, "nombre": "Lima" },
    { "id": 2, "nombre": "Arequipa" }
  ]
}
```

#### Obtener Departamento
```
GET /admin/ubigeo/departamento/1
Response: {
  "ok": true,
  "item": { "id": 1, "nombre": "Lima" }
}
```

#### Crear Departamento
```
POST /admin/ubigeo/departamento
Body: { "nombre": "Cusco" }
Response: {
  "ok": true,
  "id": 3
}
```

#### Actualizar Departamento
```
PUT /admin/ubigeo/departamento/1
Body: { "nombre": "Lima (actualizado)" }
Response: {
  "ok": true,
  "affected": 1
}
```

#### Eliminar Departamento
```
DELETE /admin/ubigeo/departamento/1
Response: {
  "ok": true,
  "affected": 1
}
```

---

### PROVINCIAS

#### Listar Provincias
```
GET /admin/ubigeo/provincia?departamento_id=1
Response: {
  "ok": true,
  "items": [
    { "id": 1, "departamento_id": 1, "nombre": "Lima" },
    { "id": 2, "departamento_id": 1, "nombre": "Barranca" }
  ]
}
```

#### Obtener Provincia
```
GET /admin/ubigeo/provincia/1
Response: {
  "ok": true,
  "item": { "id": 1, "departamento_id": 1, "nombre": "Lima" }
}
```

#### Crear Provincia
```
POST /admin/ubigeo/provincia
Body: {
  "departamento_id": 1,
  "nombre": "Huaral"
}
Response: {
  "ok": true,
  "id": 3
}
```

#### Actualizar Provincia
```
PUT /admin/ubigeo/provincia/1
Body: {
  "departamento_id": 1,
  "nombre": "Lima Metropolitana"
}
Response: {
  "ok": true,
  "affected": 1
}
```

#### Eliminar Provincia
```
DELETE /admin/ubigeo/provincia/1
Response: {
  "ok": true,
  "affected": 1
}
```

---

### DISTRITOS

#### Listar Distritos
```
GET /admin/ubigeo/distrito?provincia_id=1
Response: {
  "ok": true,
  "items": [
    { "id": 1, "provincia_id": 1, "nombre": "Lima" },
    { "id": 2, "provincia_id": 1, "nombre": "Barranco" },
    { "id": 3, "provincia_id": 1, "nombre": "La Molina" }
  ]
}
```

#### Obtener Distrito
```
GET /admin/ubigeo/distrito/1
Response: {
  "ok": true,
  "item": { "id": 1, "provincia_id": 1, "nombre": "Lima" }
}
```

#### Crear Distrito
```
POST /admin/ubigeo/distrito
Body: {
  "provincia_id": 1,
  "nombre": "Miraflores"
}
Response: {
  "ok": true,
  "id": 4
}
```

#### Actualizar Distrito
```
PUT /admin/ubigeo/distrito/1
Body: {
  "provincia_id": 1,
  "nombre": "Lima Centro"
}
Response: {
  "ok": true,
  "affected": 1
}
```

#### Eliminar Distrito
```
DELETE /admin/ubigeo/distrito/1
Response: {
  "ok": true,
  "affected": 1
}
```

---

## 📝 NOTAS IMPORTANTES

### Headers Requeridos
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

### Credenciales de Prueba
- **Admin:** admin@manosverdes.test / Test123456
- **Centro:** centro@manosverdes.test / Test123456
- **Usuario:** usuario@manosverdes.test / Test123456

### Códigos de Error
- 400: Bad Request (validación)
- 401: No autenticado
- 403: No autorizado (rol insuficiente)
- 404: No encontrado
- 409: Conflicto (duplicado)
- 500: Error servidor

---

## 🚀 PRÓXIMAS IMPLEMENTACIONES

- [ ] CRUD Centros de Reciclaje
- [ ] CRUD Representantes de Centros
- [ ] CRUD Precios de Materiales
- [ ] Comentarios y Ratings
- [ ] Fotos de Centros
- [ ] Restricción de Materiales Peligrosos
