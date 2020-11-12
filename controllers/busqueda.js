"use strict";

const { response } = require("express");

const Hospital = require("../models/hospital");
const Medico = require("../models/medico");
const Usuario = require("../models/usuario");

const busquedaTotal = async (req, res = response) => {
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, "i");

  const [usuarios, hospitales, medicos] = await Promise.all([
    Usuario.find({ nombre: regex }, "nombre email img role google"),
    Hospital.find({ nombre: regex }, "nombre img usuario"),
    Medico.find({ nombre: regex }, "nombre img usuario hospital"),
  ]);

  res.status(200).json({
    ok: true,
    usuarios,
    hospitales,
    medicos,
  });
};

const busquedaEspecifica = async (req, res = response) => {
  const busqueda = req.params.busqueda;
  const coleccion = req.params.coleccion;
  const regex = new RegExp(busqueda, "i");

  let data = [];

  switch (coleccion) {
    case "usuario":
      data = await Usuario.find({ nombre: regex }, "nombre email img role google")
      break;

    case "hospital":
      data = await Hospital.find({ nombre: regex }, "nombre img usuario")
                           .populate("usuario", "nombre img");
      break;

    case "medico":
      data = await Medico.find({ nombre: regex }, "nombre img usuario hospital")
                         .populate("usuario hospital", "nombre img");
      break;

    default:
      return res.status(400).json({
        ok: false,
        mensaje: "La tabla debe ser usuario, hospital o medico.",
      });
  }

  res.status(200).json({
    ok: true,
    resultados: data,
  });
};

module.exports = {
  busquedaTotal,
  busquedaEspecifica,
};
