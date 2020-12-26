"use strict";

const jwt = require("jsonwebtoken");
const usuario = require("../models/usuario");

const Usuario = require("../models/usuario");

const validarJWT = (req, res, next) => {
  // Leer el token
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      mensaje: "No hay token en la petición.",
    });
  }

  try {
    const { usuarioId } = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = usuarioId; // Localizar el Id del usuario que realizó la petición

    next();
  } catch (err) {
    return res.status(401).json({
      ok: false,
      mensaje: "Token no válido.",
      errors: err,
    });
  }
};

const validarAdministrador = async (req, res, next) => {
  const usuarioId = req.usuarioId;

  try {
    const usuarioDB = await Usuario.findById(usuarioId);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        mensaje: "Usuario no encontrado.",
      });
    }

    if (usuarioDB.role !== "ADMIN_ROLE") {
      return res.status(403).json({
        ok: false,
        mensaje: "El usuario no tiene los suficientes privilegios para proceder.",
      });
    }

    next();
  } catch (err) {
    res.status(500).json({
      ok: false,
      mensaje: "Error en el servidor.",
      errors: err,
    });
  }
};

const validarAdministadorMismoUsuario = async (req, res, next) => {
  const usuarioId = req.usuarioId;
  const id = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(usuarioId);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        mensaje: "Usuario no encontrado.",
      });
    }

    if (usuarioDB.role !== "ADMIN_ROLE" && usuarioId !== id) {
      return res.status(403).json({
        ok: false,
        mensaje: "El usuario no tiene los suficientes privilegios para proceder.",
      });
    }

    next();
  } catch (err) {
    res.status(500).json({
      ok: false,
      mensaje: "Error en el servidor.",
      errors: err,
    });
  }
};

module.exports = {
  validarJWT,
  validarAdministrador,
  validarAdministadorMismoUsuario,
};
