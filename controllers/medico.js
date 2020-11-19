"use strict";

const { response } = require("express");

const Medico = require("../models/medico");

const obtenerMedicos = async (req, res = response) => {
  const medicos = await Medico.find().populate(
    "usuario hospital",
    "nombre img"
  );

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

const actualizarMedico = async (req, res = response) => {
  const medicoId = req.params.id;
  const usuarioId = req.usuarioId;

  try {
    const medicoDB = await Medico.findById(medicoId);

    if (!medicoDB) {
      res.status(404).json({
        ok: false,
        mensaje: "Médico no encontrado.",
      });
    }

    const parametrosModificados = { ...req.body, usuario: usuarioId };

    const medicoActualizado = await Medico.findByIdAndUpdate(
      medicoId,
      parametrosModificados,
      { new: true }
    );

    res.status(200).json({
      ok: true,
      médico: medicoActualizado,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      mensaje: "Error en el servidor.",
      errors: err,
    });
  }
};

const eliminarMedico = async (req, res = response) => {
  const medicoId = req.params.id;

  try {
    const medicoDB = await Medico.findById(medicoId);

    if (!medicoDB) {
      res.status(404).json({
        ok: false,
        mensaje: "Médico no encontrado.",
      });
    }

    await Medico.findByIdAndRemove(medicoId);

    res.status(200).json({
      ok: true,
      mensaje: "Médico eliminado exitosamente.",
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
  obtenerMedicos,
  crearMedico,
  actualizarMedico,
  eliminarMedico,
};
