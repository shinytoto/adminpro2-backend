"use strict";

const { Router } = require("express");

const { validarJWT } = require("../middlewares/validar-jwt");
const BusquedaController = require("../controllers/busqueda");

const router = Router();

router.get("/todo/:busqueda", validarJWT, BusquedaController.busquedaTotal);
router.get("/:coleccion/:busqueda", validarJWT, BusquedaController.busquedaEspecifica);

module.exports = router;
