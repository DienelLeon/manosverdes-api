# API Manos Verdes

Backend REST para Manos Verdes (Node.js + Express + MySQL).  
Incluye autenticación JWT (whitelist con tabla `sesion`), envío de OTP por correo y subida de archivos a Google Cloud Storage.

## Documentación API

Para ejemplos de comandos curl y uso de la API, consulta [CURL_EXAMPLES.md](./CURL_EXAMPLES.md).

## Tecnologías
- Node.js + Express
- MySQL (mysql2)
- JWT (jsonwebtoken)
- Password hashing (bcryptjs)
- Email (nodemailer / Mailjet SMTP)
- Google Cloud Storage (@google-cloud/storage)
- Seguridad: helmet, cors

## Requisitos
- Node.js 18+ (recomendado)
- MySQL 8+
- Credenciales SMTP (Mailjet)
- Service Account JSON para GCP Storage

## Instalación
```bash
npm install
