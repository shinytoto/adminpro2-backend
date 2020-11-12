"use strict";

const { response } = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

const obtenerUsuarios = async (req, res) => {
  const desde = Number(req.query.desde) || 0;

  const [usuarios, totalRegistros] = await Promise.all([
    Usuario.find({}, "nombre email img role google").skip(desde).limit(5),
    Usuario.countDocuments(),
  ]);

  res.status(200).json({
    ok: true,
    usuarios,
    totalRegistros,
    usuarioId: req.usuarioId, // Obtener el Id del usuario que realizó la petición
  });
};

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        mensaje: "El email ya esta registrado.",
      });
    }

    const usuario = new Usuario(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    // Guardar usuario
    await usuario.save();

    // Generar JsonWebToken
    const token = await generarJWT(usuario.id);

    res.status(200).json({
      ok: true,
      usuario,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      mensaje: "Error en el servidor.",
      errors: err,
    });
  }
};

const actualizarUsuario = async (req, res = response) => {
  // TODO: Validar token y comprobar si es el usuario correcto

  const usuarioId = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(usuarioId);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        mensaje: "No existe un usuario con ese id.",
      });
    }

    // Actualización
    const { password, google, email, ...campos } = req.body;

    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          mensaje: "El email ya esta en uso por otro usuario.",
        });
      }
    }

    campos.email = email;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      usuarioId,
      campos,
      { new: true }
    );

    res.status(200).json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      mensaje: "Error en el servidor.",
      errors: err,
    });
  }
};

const eliminarUsuario = async (req, res = response) => {
  const usuarioId = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(usuarioId);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        mensaje: "No existe un usuario con ese id.",
      });
    }

    await Usuario.findByIdAndRemove(usuarioId);

    res.status(200).json({
      ok: true,
      mensaje: "Usuario eliminado exitosamente.",
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      mensaje: "Error en el servidor.",
      errors: err,
    });
  }
};

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
