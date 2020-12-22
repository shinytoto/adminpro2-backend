"use strict";

const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const MedicoController = require("../controllers/medico");

const router = Router();

router.get("/", validarJWT, MedicoController.obtenerMedicos);

router.get("/:id", validarJWT, MedicoController.obtenerMedico);

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre del médico es obligatorio.").not().isEmpty(),
    check("hospital", "El hospital es obligatorio y debe ser válido.").isMongoId(),
    validarCampos,
  ],
  MedicoController.crearMedico
);
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre del médico no puede estar vacío.").not().isEmpty(),
    validarCampos,
  ],
  MedicoController.actualizarMedico
);

router.delete("/:id", validarJWT, MedicoController.eliminarMedico);

module.exports = router;
