// src/utils/jwt.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

function signToken(payload) {
  const jti = crypto.randomUUID();
  const token = jwt.sign({ ...payload, jti }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return { token, jti };
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET, { clockTolerance: 5 });
}

module.exports = { signToken, verifyToken };
