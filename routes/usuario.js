"use strict";

const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT, validarAdministrador, validarAdministadorMismoUsuario } = require("../middlewares/validar-jwt");
const UsuarioController = require("../controllers/usuario");

const router = Router();

router.get("/", validarJWT, UsuarioController.obtenerUsuarios);
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio.").not().isEmpty(), // Que el campo nombre no esté vacío
    check("password", "La contraseña es obligatoria.").not().isEmpty(), // Que el contraseña no esté vacío
    check("email", "El email es obligatorio.").isEmail(), // Que el campo email sea un email
    validarCampos,
  ],
  UsuarioController.crearUsuario
);

router.put(
  "/:id",
  [
    validarJWT,
    validarAdministadorMismoUsuario,
    check("nombre", "El nombre es obligatorio.").not().isEmpty(),
    check("email", "El email es obligatorio.").isEmail(),
    check("role", "El role es obligatorio.").not().isEmpty(),
    validarCampos,
  ],
  UsuarioController.actualizarUsuario
);

router.delete("/:id", [validarJWT, validarAdministrador], UsuarioController.eliminarUsuario);

module.exports = router;
