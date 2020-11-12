"use strict";

const { Router } = require("express");
const fileUpload = require("express-fileupload");

const { validarJWT } = require("../middlewares/validar-jwt");
const UploadController = require("../controllers/upload");

const router = Router();

router.use(fileUpload());

router.put("/:tipo/:id", validarJWT, UploadController.subirArchivo);
router.get("/:tipo/:archivo", UploadController.obtenerImagen);

module.exports = router;
