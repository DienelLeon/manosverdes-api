// src/app.js
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const helmet = require('helmet');

const index = require('./rutas/index.routes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

if (
  process.env.GOOGLE_APPLICATION_CREDENTIALS &&
  !path.isAbsolute(process.env.GOOGLE_APPLICATION_CREDENTIALS)
) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(
    process.cwd(),
    process.env.GOOGLE_APPLICATION_CREDENTIALS
  );
  console.log('[GCP] credenciales:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
}

app.get('/health', (_req, res) => res.json({ ok: true, service: 'api-manosverdes' }));
app.use('/api', index);

// 404
app.use((_req, res) => res.status(404).json({ ok: false, error: 'No encontrado' }));

app.use((err, _req, res, _next) => {
  console.error('❌', err);
  res.status(err.statusCode || err.status || 500).json({
    ok: false,
    error: err.message || 'Error',
  });
});

module.exports = app;
