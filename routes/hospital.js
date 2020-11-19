"use strict";

const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const HospitalController = require("../controllers/hospital");

const router = Router();

router.get("/", validarJWT, HospitalController.obtenerHospitales);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre del hospital es obligatorio.").not().isEmpty(),
    validarCampos,
  ],
  HospitalController.crearHospital
);
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre del hospital no puede estar vacío.").not().isEmpty(),
    validarCampos,
  ],
  HospitalController.actualizarHospital
);
router.delete("/:id", validarJWT, HospitalController.eliminarHospital);

module.exports = router;
