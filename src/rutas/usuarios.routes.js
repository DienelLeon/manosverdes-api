const { Router } = require("express");
const auth = require("../middlewares/auth.middleware");
const c = require("../controladores/usuarios.controller");

const r = Router();

r.get("/me", auth, c.me);

module.exports = r;
