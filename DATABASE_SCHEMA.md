# 🗄️ DIAGRAMA DE RELACIONES - BASE DE DATOS MANOSVERDES

## 📊 Estructura Completa de Tablas

---

## 🔗 DIAGRAMA ER (Entity-Relationship)

```
┌─────────────────────────────────────────────────────────────────┐
│                         ROL                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ id (TINYINT) PRIMARY KEY                                   │ │
│  │ clave (VARCHAR) UNIQUE                                     │ │
│  │ nombre (VARCHAR)                                           │ │
│  │ descripcion (VARCHAR)                                      │ │
│  │ creado_en (DATETIME)                                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              △                                   │
│                              │ 1:N                              │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               │ rol_id FK
                               │
┌──────────────────────────────┴──────────────────────────────────┐
│                          USUARIO                                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ id (INT) PRIMARY KEY                                       │ │
│  │ nombre, apellido_paterno, apellido_materno                │ │
│  │ email (VARCHAR) UNIQUE                                     │ │
│  │ telefono, fecha_nacimiento                                │ │
│  │ avatar_key                                                 │ │
│  │ estado (ENUM: activo, inactivo, bloqueado)                │ │
│  │ rol_id (FK → rol.id)                                      │ │
│  │ creado_en, actualizado_en                                 │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────┬────────────────┬────────────────┬────────────────────────┘
      │                │                │
      │ 1:1            │ 1:N            │ 1:N
      │                │                │
      │                │                │
┌─────▼─────┐  ┌──────▼──────┐  ┌──────▼──────────┐
│ usuario_   │  │ codigo_     │  │ centro          │
│   auth     │  │   otp       │  │ (usuario_id FK) │
└───────────┘  └─────────────┘  └─────┬───────────┘
                                       │
                                       │ 1:N
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
            ┌───────▼────────┐  ┌──────▼──────┐  ┌───────▼─────────┐
            │centro_         │  │centro_foto  │  │centro_material_ │
            │representante   │  │             │  │precio           │
            └────────────────┘  └─────────────┘  └──────┬──────────┘
                                                        │
                                                        │ material_id FK
                                                        │
                                          ┌─────────────▼────────────┐
                                          │      MATERIAL            │
                                          │  (subcategoria_id FK)    │
                                          └──────────┬───────────────┘
                                                     │
                                      ┌──────────────┴──────────────┐
                                      │                             │
                                      │ 1:1                        │
                                      │                             │
                        ┌─────────────▼────────────┐    ┌──────────▼────────┐
                        │   MATERIAL_INFO          │    │MATERIAL_          │
                        │ (material_id PK/FK)      │    │SUBCATEGORIA       │
                        └──────────────────────────┘    │(categoria_id FK)  │
                                                        └────────┬──────────┘
                                                                 │
                                                                 │ 1:N
                                                                 │
                                              ┌──────────────────▼────────┐
                                              │  MATERIAL_CATEGORIA       │
                                              │  (Categoría de Material)  │
                                              └───────────────────────────┘
```

---

## 📋 DESCRIPCIÓN DETALLADA DE TABLAS Y RELACIONES

### **1. ROL** (Tabla Maestra)
**Propósito:** Definir tipos de usuarios en el sistema

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | TINYINT | PK, valores: 1=admin, 2=centro, 3=app |
| `clave` | VARCHAR(20) | UNIQUE, código sistema |
| `nombre` | VARCHAR(60) | Nombre legible |
| `descripcion` | VARCHAR(255) | Descripción del rol |
| `creado_en` | DATETIME | Timestamp creación |

**Datos iniciales:**
```
1 | admin  | Administrador
2 | centro | Centro
3 | app    | Usuario
```

**Relaciones:** 
- `1:N → USUARIO` (un rol tiene muchos usuarios)

---

### **2. USUARIO** (Tabla Core - Usuarios del Sistema)
**Propósito:** Almacenar información de todos los usuarios

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | PK, autoincrement |
| `nombre` | VARCHAR(120) | Nombre del usuario |
| `apellido_paterno` | VARCHAR(120) | Apellido paterno |
| `apellido_materno` | VARCHAR(120) | Nullable |
| `email` | VARCHAR(180) | UNIQUE, identificador login |
| `telefono` | VARCHAR(32) | Nullable |
| `fecha_nacimiento` | DATE | Nullable |
| `avatar_key` | VARCHAR(600) | Ruta en GCP Storage |
| `estado` | ENUM | activo/inactivo/bloqueado |
| `rol_id` | FK | Referencia a `rol.id` |
| `creado_en` | DATETIME | Timestamp |
| `actualizado_en` | DATETIME | On update |

**Relaciones:**
- `N:1 ← ROL` (cada usuario tiene un rol)
- `1:1 → USUARIO_AUTH` (datos de autenticación)
- `1:N → CODIGO_OTP` (códigos de verificación)
- `1:N → CENTRO` (un usuario = un centro)
- `1:N → CENTRO_COMENTARIO` (comentarios que hace)
- `1:N → CENTRO_RATING` (ratings que da)

---

### **3. USUARIO_AUTH** (Tabla de Seguridad)
**Propósito:** Guardar credenciales y estado de autenticación

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `usuario_id` | INT | PK/FK hacia `usuario.id` (ON DELETE CASCADE) |
| `password_hash` | VARCHAR(255) | Hash bcryptjs (10 rounds) |
| `email_verificado` | TINYINT | 0 o 1 (booleano) |
| `email_verificado_en` | DATETIME | Timestamp de verificación |
| `intentos_fallidos` | TINYINT | Contador para bloqueo |
| `bloqueado_hasta` | DATETIME | Timestamp de desbloqueo |
| `actualizado_en` | DATETIME | On update |

**Relaciones:**
- `1:1 ← USUARIO` (relación de 1:1)

---

### **4. CODIGO_OTP** (Tabla de Verificación)
**Propósito:** Almacenar códigos de verificación (email, reset contraseña)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | BIGINT | PK, autoincrement |
| `usuario_id` | INT | FK hacia `usuario.id` (ON DELETE CASCADE) |
| `tipo` | ENUM | email_verificacion o password_reset |
| `codigo_hash` | CHAR(64) | SHA256 del código (6 dígitos) |
| `expira_en` | DATETIME | Tiempo máximo para usar |
| `usado` | TINYINT | 0 o 1 (booleano) |
| `creado_en` | DATETIME | Timestamp creación |

**Constrains:**
- `UNIQUE (usuario_id, tipo)` - Solo 1 OTP activo por usuario por tipo

**Relaciones:**
- `N:1 ← USUARIO` (muchos OTP por usuario)

---

## 🌍 GEOGRAFÍA PERÚ (Tablas Jerárquicas)

### **5. DEPARTAMENTO** (Nivel 1)
**Propósito:** Departamentos de Perú

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | PK |
| `nombre` | VARCHAR(120) | UNIQUE |

**Relaciones:**
- `1:N → PROVINCIA`

---

### **6. PROVINCIA** (Nivel 2)
**Propósito:** Provincias dentro de departamentos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | PK |
| `departamento_id` | INT | FK hacia `departamento.id` |
| `nombre` | VARCHAR(120) | Nombre provincia |

**Constrains:**
- `UNIQUE (departamento_id, nombre)` - No duplicados por dpto

**Relaciones:**
- `N:1 ← DEPARTAMENTO`
- `1:N → DISTRITO`

---

### **7. DISTRITO** (Nivel 3)
**Propósito:** Distritos dentro de provincias

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | PK |
| `provincia_id` | INT | FK hacia `provincia.id` |
| `nombre` | VARCHAR(120) | Nombre distrito |

**Constrains:**
- `UNIQUE (provincia_id, nombre)` - No duplicados por provincia

**Relaciones:**
- `N:1 ← PROVINCIA`
- `1:N → CENTRO` (ubicación del centro)

---

## 📦 CATÁLOGO DE MATERIALES (Jerárquico)

### **8. MATERIAL_CATEGORIA** (Nivel 1)
**Propósito:** Categorías principales de materiales

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | PK |
| `nombre` | VARCHAR(80) | UNIQUE (ej: Plásticos, Vidrio) |
| `icono` | VARCHAR(600) | URL/path ícono |
| `activo` | TINYINT | 0 o 1 |

**Relaciones:**
- `1:N → MATERIAL_SUBCATEGORIA`

---

### **9. MATERIAL_SUBCATEGORIA** (Nivel 2)
**Propósito:** Subcategorías de materiales

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | PK |
| `categoria_id` | INT | FK hacia `material_categoria.id` |
| `nombre` | VARCHAR(120) | (ej: PET botellas) |
| `activo` | TINYINT | 0 o 1 |

**Constrains:**
- `UNIQUE (categoria_id, nombre)` - No duplicados por categoría

**Relaciones:**
- `N:1 ← MATERIAL_CATEGORIA`
- `1:N → MATERIAL`

---

### **10. MATERIAL** (Nivel 3 - Materiales específicos)
**Propósito:** Materiales individuales para acopio

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | PK |
| `subcategoria_id` | INT | FK hacia `material_subcategoria.id` |
| `nombre` | VARCHAR(120) | (ej: Botella PET transparente) |
| `icono` | VARCHAR(1000) | URL/path ícono |
| `elegible` | TINYINT | **0=NO se puede acopiar (peligroso)** |
| `activo` | TINYINT | 0 o 1 |

**Constrains:**
- `UNIQUE (subcategoria_id, nombre)` - No duplicados

**Relaciones:**
- `N:1 ← MATERIAL_SUBCATEGORIA`
- `1:1 → MATERIAL_INFO` (información detallada)
- `1:N → CENTRO_MATERIAL_PRECIO` (precios en centros)

---

### **11. MATERIAL_INFO** (Tabla de Detalles)
**Propósito:** Información extendida de materiales

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `material_id` | INT | PK/FK hacia `material.id` (ON DELETE CASCADE) |
| `descripcion` | TEXT | Descripción larga |
| `beneficios` | TEXT | Beneficios de reciclar |
| `proceso` | TEXT | Cómo se procesa |
| `ideas` | TEXT | Qué se puede hacer con |
| `contaminacion` | TEXT | Impacto ambiental |

**Relaciones:**
- `1:1 ← MATERIAL` (relación de 1:1)

---

## 🏢 CENTROS DE RECICLAJE

### **12. CENTRO_TIPO** (Tabla Maestra)
**Propósito:** Tipos de centros

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | PK |
| `nombre` | VARCHAR(80) | UNIQUE |

**Datos iniciales:**
```
1 | Centro de acopio
2 | Recicladora industrial
3 | Municipal
4 | Empresa privada
5 | Asociación / ONG
```

**Relaciones:**
- `1:N → CENTRO`

---

### **13. CENTRO** (Tabla Core - Centros)
**Propósito:** Información de centros de reciclaje

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | PK |
| `usuario_id` | INT | FK hacia `usuario.id` (UNIQUE) |
| `nombre` | VARCHAR(150) | Nombre del centro |
| `direccion` | VARCHAR(255) | Dirección física |
| `distrito_id` | INT | FK hacia `distrito.id` (ubicación) |
| `tipo_id` | INT | FK hacia `centro_tipo.id` |
| `telefono` | VARCHAR(32) | Contacto telefónico |
| `horario` | VARCHAR(255) | Horario de atención |
| `lat` | DECIMAL(10,6) | Latitud GPS |
| `lng` | DECIMAL(10,6) | Longitud GPS |
| `estado` | ENUM | activo o inactivo |

**Relaciones:**
- `N:1 ← USUARIO` (cada centro = 1 usuario)
- `N:1 ← DISTRITO` (ubicación)
- `N:1 ← CENTRO_TIPO` (tipo de centro)
- `1:1 → CENTRO_REPRESENTANTE` (datos legales)
- `1:N → CENTRO_FOTO` (galería)
- `1:N → CENTRO_MATERIAL_PRECIO` (precios de materiales)
- `1:N → CENTRO_COMENTARIO` (comentarios)
- `1:N → CENTRO_RATING` (ratings)

---

### **14. CENTRO_REPRESENTANTE** (Tabla de Info Legal)
**Propósito:** Datos legales y contacto del representante

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `centro_id` | INT | PK/FK hacia `centro.id` (ON DELETE CASCADE) |
| `ruc` | CHAR(11) | RUC de la empresa (11 dígitos) |
| `razon_social` | VARCHAR(180) | Razón social legal |
| `contacto_nombre` | VARCHAR(120) | Nombre del representante |
| `contacto_cargo` | VARCHAR(80) | Cargo (Gerente, etc) |
| `contacto_tel` | VARCHAR(32) | Teléfono directo |
| `contacto_email` | VARCHAR(180) | Email contacto |
| `web_url` | VARCHAR(255) | Sitio web |

**Relaciones:**
- `1:1 ← CENTRO`

---

### **15. CENTRO_FOTO** (Tabla de Galería)
**Propósito:** Fotos del centro en Google Cloud Storage

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | BIGINT | PK |
| `centro_id` | INT | FK hacia `centro.id` (ON DELETE CASCADE) |
| `foto_key` | VARCHAR(600) | Ruta en GCS |
| `creado_en` | DATETIME | Timestamp |

**Relaciones:**
- `N:1 ← CENTRO`

---

### **16. CENTRO_MATERIAL_PRECIO** (Tabla de Precios)
**Propósito:** Precios que ofrece cada centro por material

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | BIGINT | PK |
| `centro_id` | INT | FK hacia `centro.id` |
| `material_id` | INT | FK hacia `material.id` |
| `precio_kg` | DECIMAL(10,2) | Precio por kilogramo |
| `moneda` | CHAR(3) | Código moneda (PEN, USD, etc) |

**Constrains:**
- `UNIQUE (centro_id, material_id)` - Un precio por centro-material

**Validación importante:**
- ⚠️ `material_id` debe tener `material.elegible = 1`
- ❌ NO se permite registrar materiales con `elegible = 0` (peligrosos)

**Relaciones:**
- `N:1 ← CENTRO`
- `N:1 ← MATERIAL`

---

### **17. CENTRO_COMENTARIO** (Tabla de Reviews)
**Propósito:** Comentarios/reviews de usuarios sobre centros

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | BIGINT | PK |
| `centro_id` | INT | FK hacia `centro.id` |
| `usuario_id` | INT | FK hacia `usuario.id` |
| `texto` | VARCHAR(600) | Comentario |
| `creado_en` | DATETIME | Timestamp |

**Relaciones:**
- `N:1 ← CENTRO`
- `N:1 ← USUARIO`

---

### **18. CENTRO_RATING** (Tabla de Calificaciones)
**Propósito:** Calificaciones (1-5 estrellas) de usuarios

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `centro_id` | INT | PK (parte 1) FK hacia `centro.id` |
| `usuario_id` | INT | PK (parte 2) FK hacia `usuario.id` |
| `estrellas` | TINYINT | 1-5 (CHECK constraint) |

**Constrains:**
- `PRIMARY KEY (centro_id, usuario_id)` - Un rating por usuario por centro
- `CHECK (estrellas BETWEEN 1 AND 5)`

**Relaciones:**
- `N:1 ← CENTRO`
- `N:1 ← USUARIO`

---

## 🔄 FLUJOS DE DATOS PRINCIPALES

### **Flujo 1: Registro y Autenticación**
```
1. Usuario se registra
   → INSERT usuario (rol_id=3)
   → INSERT usuario_auth (password_hash, email_verificado=0)
   
2. Sistema envía email de verificación
   → INSERT codigo_otp (tipo=email_verificacion)
   
3. Usuario confirma código
   → UPDATE usuario_auth (email_verificado=1)
   → DELETE codigo_otp
   
4. Usuario hace login
   → SELECT usuario + usuario_auth
   → Generar JWT token
```

### **Flujo 2: Registro de Centro**
```
1. Usuario (rol=centro) crea un centro
   → INSERT centro (usuario_id FK, distrito_id FK, tipo_id FK)
   
2. Admin registra representante del centro
   → INSERT centro_representante (centro_id FK)
   
3. Centro registra precios de materiales
   → INSERT centro_material_precio (centro_id FK, material_id FK)
   → ⚠️ VALIDAR material.elegible = 1
```

### **Flujo 3: Búsqueda de Materiales**
```
1. Usuario busca categoría
   → SELECT material_categoria WHERE activo=1
   
2. Usuario ve subcategorías
   → SELECT material_subcategoria WHERE categoria_id=X AND activo=1
   
3. Usuario ve materiales
   → SELECT material WHERE subcategoria_id=Y AND activo=1 AND elegible=1
   
4. Usuario ve detalles + precios
   → SELECT material_info
   → SELECT centro_material_precio con centros cercanos
```

### **Flujo 4: Rating y Comentarios**
```
1. Usuario comenta en un centro
   → INSERT centro_comentario
   
2. Usuario califica centro
   → INSERT/UPDATE centro_rating (estrellas)
```

---

## 📊 ESTADÍSTICAS Y QUERIES ÚTILES

### Materiales peligrosos (no acopiables)
```sql
SELECT * FROM material WHERE elegible = 0;
```

### Precios por centro
```sql
SELECT c.nombre, m.nombre, cmp.precio_kg
FROM centro_material_precio cmp
JOIN centro c ON cmp.centro_id = c.id
JOIN material m ON cmp.material_id = m.id
WHERE c.id = ?;
```

### Rating promedio por centro
```sql
SELECT centro_id, AVG(estrellas) as promedio
FROM centro_rating
GROUP BY centro_id;
```

---

## ⚠️ CASCADAS Y RESTRICCIONES IMPORTANTES

| Tabla | FK | ON DELETE | Impacto |
|-------|----|---------|----|
| usuario_auth | usuario.id | CASCADE | Se elimina auth con usuario |
| codigo_otp | usuario.id | CASCADE | Se eliminan OTP con usuario |
| centro | usuario.id | (RESTRICT) | No se puede eliminar usuario si tiene centro |
| centro_representante | centro.id | CASCADE | Se elimina representante con centro |
| centro_foto | centro.id | CASCADE | Se eliminan fotos con centro |
| centro_material_precio | centro.id | (RESTRICT) | No se puede eliminar centro si tiene precios |
| centro_comentario | centro.id/usuario.id | (RESTRICT) | No se pueden eliminar si hay comentarios |
| centro_rating | centro.id/usuario.id | (RESTRICT) | No se pueden eliminar si hay ratings |
| material_info | material.id | CASCADE | Se elimina info con material |

---

## 🚀 ÍNDICES PRINCIPALES

```sql
-- Búsquedas frecuentes
INDEX idx_usuario_rol (rol_id)
INDEX idx_usuario_estado (estado)
INDEX idx_centro_foto (centro_id)
UNIQUE (usuario_id, tipo) -- en codigo_otp
```

---

## 📝 NOTAS DE DISEÑO

1. **Materiales peligrosos**: Campo `material.elegible` = 0 para quirúrgicos, hospitalarios, químicos tóxicos
2. **Validación**: No permitir registrar `centro_material_precio` si material no es elegible
3. **Geografía**: Estructura jerárquica (Dpto → Provincia → Distrito)
4. **Seguridad**: Todos los passwords hasheados con bcryptjs, intentos fallidos trackeados
5. **Storage**: Fotos en Google Cloud Storage (rutas en gcs_key)
6. **Transacciones**: Creación de usuario + usuario_auth dentro de transacción
