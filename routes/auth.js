"use strict";

const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const AuthController = require("../controllers/auth");

const router = Router();

router.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  AuthController.login
);

router.post(
  "/google",
  [check("token", "El token es obligatorio").not().isEmpty(), validarCampos],
  AuthController.googleSignIn
);

module.exports = router;
