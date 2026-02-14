# API Curl Examples - Manos Verdes

Este documento contiene ejemplos de comandos curl para interactuar con la API de Manos Verdes.

## Autenticación

Para acceder a los endpoints de administración, necesitas obtener un token JWT primero:

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@manosverdes.online",
    "password": "Admin123"
  }'
```

Guarda el `token` que recibes en la respuesta para usarlo en los siguientes comandos.

## Tabla Maestra de Materiales

### GET /api/admin/materiales/master

Obtiene todos los materiales en formato jerárquico (categorías -> subcategorías -> materiales).

**Curl Command:**

```bash
curl -X GET http://localhost:3000/api/admin/materiales/master \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Respuesta esperada:**

```json
{
  "ok": true,
  "items": [
    {
      "id": 1,
      "nombre": "Plásticos",
      "icono": "https://...",
      "activo": 1,
      "subcategorias": [
        {
          "id": 1,
          "nombre": "PET",
          "activo": 1,
          "materiales": [
            {
              "id": 1,
              "nombre": "Botellas PET",
              "icono": "https://...",
              "elegible": 1,
              "activo": 1
            }
          ]
        }
      ]
    }
  ]
}
```

## Otros Endpoints de Materiales

### Listar Categorías

```bash
curl -X GET http://localhost:3000/api/admin/materiales/categorias \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Obtener una Categoría

```bash
curl -X GET http://localhost:3000/api/admin/materiales/categorias/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Listar Subcategorías de una Categoría

```bash
curl -X GET "http://localhost:3000/api/admin/materiales/subcategorias?categoria_id=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Listar Materiales

```bash
# Todos los materiales
curl -X GET http://localhost:3000/api/admin/materiales/materiales \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"

# Materiales de una subcategoría específica
curl -X GET "http://localhost:3000/api/admin/materiales/materiales?subcategoria_id=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"

# Materiales activos
curl -X GET "http://localhost:3000/api/admin/materiales/materiales?activo=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"

# Materiales elegibles
curl -X GET "http://localhost:3000/api/admin/materiales/materiales?elegible=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Crear una Categoría

```bash
curl -X POST http://localhost:3000/api/admin/materiales/categorias \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Metales",
    "icono": "https://example.com/icono.png",
    "activo": 1
  }'
```

### Crear una Subcategoría

```bash
curl -X POST http://localhost:3000/api/admin/materiales/subcategorias \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "categoria_id": 1,
    "nombre": "Aluminio",
    "activo": 1
  }'
```

### Crear un Material

```bash
curl -X POST http://localhost:3000/api/admin/materiales/materiales \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "subcategoria_id": 1,
    "nombre": "Latas de aluminio",
    "icono": "https://example.com/lata.png",
    "elegible": 1,
    "activo": 1
  }'
```

## Health Check

Verifica que la API esté en funcionamiento:

```bash
curl http://localhost:3000/health
```

## Notas

- Reemplaza `YOUR_JWT_TOKEN_HERE` con el token JWT que obtienes del endpoint de login
- Reemplaza `http://localhost:3000` con la URL de tu servidor si es diferente
- Los tokens JWT tienen una expiración, si recibes un error 401, obtén un nuevo token
