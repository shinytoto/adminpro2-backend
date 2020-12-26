"use strict";

const { response } = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");
const { obtenerMenuFrontend } = require("../helpers/menu-frontend");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificar email
    const usuarioDB = await Usuario.findOne({ email });

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        mensaje: "Email no válido.",
      });
    }

    // Verificar contraseña
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        mensaje: "Contraseña no válida.",
      });
    }

    // Generar JsonWebToken
    const token = await generarJWT(usuarioDB.id);

    res.status(200).json({
      ok: true,
      token,
      menu: obtenerMenuFrontend(usuarioDB.role),
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      mensaje: "Error en el servidor.",
      errors: err,
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const googleToken = req.body.token;

  try {
    const { name, email, picture } = await googleVerify(googleToken);

    // Verificar correo

    const usuarioDB = await Usuario.findOne({ email });
    let usuario;

    if (!usuarioDB) {
      // Si no existe el usuario
      usuario = new Usuario({
        nombre: name,
        email,
        password: "@@@",
        img: picture,
        google: true,
      });
    } else {
      // Existe el usuario
      usuario = usuarioDB;
      usuario.google = true;
    }

    // Guardar en DB
    await usuario.save();

    // Generar JsonWebToken
    const token = await generarJWT(usuario.id);

    res.status(200).json({
      ok: true,
      mensaje: "Google SignIn",
      token,
      menu: obtenerMenuFrontend(usuario.role),
    });
  } catch (err) {
    res.status(401).json({
      ok: false,
      mensaje: "Token no válido.",
    });
  }
};

const renovarToken = async (req, res = response) => {
  const usuarioId = req.usuarioId;

  // Generar JsonWebToken
  const token = await generarJWT(usuarioId);

  // Obtener el usuario por UID
  const usuarioDB = await Usuario.findById(usuarioId);

  res.status(200).json({
    ok: true,
    usuarioDB,
    token,
    menu: obtenerMenuFrontend(usuarioDB.role),
  });
};

module.exports = {
  login,
  googleSignIn,
  renovarToken,
};
