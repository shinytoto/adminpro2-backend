"use strict";

const { response } = require("express");

const Hospital = require("../models/hospital");

const obtenerHospitales = async (req, res = response) => {
  const hospitales = await Hospital.find().populate("usuario", "nombre img");

  res.status(200).json({
    ok: true,
    hospitales,
  });
};

const crearHospital = async (req, res = response) => {
  const usuarioId = req.usuarioId;

  try {
    const hospital = new Hospital({ usuario: usuarioId, ...req.body });

    await hospital.save();

    res.status(200).json({
      ok: true,
      hospital,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      mensaje: "Error en el servidor.",
      errors: err,
    });
  }
};

const actualizarHospital = (req, res = response) => {
  res.status(200).json({
    ok: true,
    mensaje: "Hola Mundo",
  });
};

const eliminarHospital = (req, res = response) => {
  res.status(200).json({
    ok: true,
    mensaje: "Hola Mundo",
  });
};

module.exports = {
  obtenerHospitales,
  crearHospital,
  actualizarHospital,
  eliminarHospital,
};
