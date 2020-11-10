"use strict";

const jwt = require("jsonwebtoken");

const validarJWT = (req, res, next) => {
  // Leer el token
  const token = req.header("x-token");

  if (!token) {
    res.status(401).json({
      ok: false,
      mensaje: "No hay token en la petición.",
    });
  }

  try {
    const { usuarioId } = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = usuarioId; // Localizar el Id del usuario que realizó la petición

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      mensaje: "Token no válido.",
    });
  }
};

module.exports = {
  validarJWT,
};
