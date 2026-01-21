// src/utils/crypto.js
const crypto = require('crypto');

function sha256Hex(input) {
  return crypto.createHash('sha256').update(String(input)).digest('hex');
}

function generarOtpDigitos(len = 6) {
  let out = '';
  for (let i = 0; i < len; i++) out += Math.floor(Math.random() * 10);
  return out;
}

module.exports = { sha256Hex, generarOtpDigitos };
