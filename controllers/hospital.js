"use strict";

const { response } = require("express");

const Hospital = require("../models/hospital");

const obtenerHospitales = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;

  if (desde || desde.length || desde == 0) {
    const [hospitales, totalRegistros] = await Promise.all([Hospital.find({}).populate("usuario", "nombre img").skip(desde).limit(5), Hospital.countDocuments()]);

    res.status(200).json({
      ok: true,
      hospitales,
      totalRegistros,
    });
  } else {
    const [hospitales, totalRegistros] = await Promise.all([Hospital.find({}).populate("usuario", "nombre img"), Hospital.countDocuments()]);

    res.status(200).json({
      ok: true,
      hospitales,
      totalRegistros,
    });
  }
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

const actualizarHospital = async (req, res = response) => {
  const hospitalId = req.params.id;
  const usuarioId = req.usuarioId;

  try {
    const hospitalDB = await Hospital.findById(hospitalId);

    if (!hospitalDB) {
      res.status(404).json({
        ok: false,
        mensaje: "Hospital no encontrado.",
      });
    }

    const parametrosModificados = { ...req.body, usuario: usuarioId };

    const hospitalActualizado = await Hospital.findByIdAndUpdate(hospitalId, parametrosModificados, { new: true });

    res.status(200).json({
      ok: true,
      hospital: hospitalActualizado,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      mensaje: "Error en el servidor.",
      errors: err,
    });
  }
};

const eliminarHospital = async (req, res = response) => {
  const hospitalId = req.params.id;

  try {
    const hospitalDB = await Hospital.findById(hospitalId);

    if (!hospitalDB) {
      res.status(404).json({
        ok: false,
        mensaje: "Hospital no encontrado.",
      });
    }

    await Hospital.findByIdAndRemove(hospitalId);

    res.status(200).json({
      ok: true,
      mensaje: "Hospital eliminado exitosamente.",
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      mensaje: "Error en el servidor.",
      errors: err,
    });
  }
};

module.exports = {
  obtenerHospitales,
  crearHospital,
  actualizarHospital,
  eliminarHospital,
};
