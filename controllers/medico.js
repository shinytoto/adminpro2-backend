"use strict";

const { response } = require("express");

const Medico = require("../models/medico");

const obtenerMedicos = async (req, res = response) => {
  const medicos = await Medico.find().populate("usuario hospital", "nombre img");

  res.status(200).json({
    ok: true,
    medicos,
  });
};

const crearMedico = async (req, res = response) => {
  const usuarioId = req.usuarioId;

  try {
    const medico = new Medico({ usuario: usuarioId, ...req.body });

    await medico.save();

    res.status(200).json({
      ok: true,
      medico,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      mensaje: "Error en el servidor",
      errors: err,
    });
  }
};

const actualizarMedico = (req, res = response) => {
  res.status(200).json({
    ok: true,
    mensaje: "Hola Mundo",
  });
};

const eliminarMedico = (req, res = response) => {
  res.status(200).json({
    ok: true,
    mensaje: "Hola Mundo",
  });
};

module.exports = {
  obtenerMedicos,
  crearMedico,
  actualizarMedico,
  eliminarMedico,
};
