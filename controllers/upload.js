"use strict";

const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const { actualizarImagen } = require("../helpers/actualizar-imagen");

const subirArchivo = (req, res = response) => {
  const tipo = req.params.tipo;
  const id = req.params.id;

  // Verificar si el tipo es válido
  const tiposValidos = ["usuario", "medico", "hospital"];

  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      mensaje: "El tipo seleccionado no es válido.",
    });
  }

  // Validar existencia de archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "No hay archivos para subir.",
    });
  }

  // Procesar imagen y extraer extensión
  const file = req.files.imagen;
  const nombreCortado = file.name.split(".");
  const extensionArchivo = nombreCortado[nombreCortado.length - 1];

  // Validar extensión
  const extensionesValidas = ["png", "jpg", "jpeg"];

  if (!extensionesValidas.includes(extensionArchivo)) {
    return res.status(400).json({
      ok: false,
      mensaje: "El archivo no tiene una extensión válida.",
    });
  }

  // Generar nombre del archivo
  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

  // Path para guardar el archivo
  const path = `./uploads/${tipo}/${nombreArchivo}`;

  // Mover el archivo al path
  file.mv(path, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        ok: false,
        mensaje: "Error al mover el archivo.",
      });
    }

    // Actualizar database
    actualizarImagen(tipo, id, nombreArchivo);

    res.status(200).json({
      ok: true,
      mensaje: "Archivo subido exitosamente!",
      nombreArchivo,
    });
  });
};

const obtenerImagen = (req, res = response) => {
  const tipo = req.params.tipo;
  const archivo = req.params.archivo;

  // Obtener imagen por medio del path
  const pathImg = path.join(__dirname, `../uploads/${tipo}/${archivo}`);

  // Devolver imagen por defecto en caso de no ser válido el path
  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    const pathNoImg = path.join(__dirname, "../assets/no-img.jpg");
    res.sendFile(pathNoImg);
  }
};

module.exports = {
  subirArchivo,
  obtenerImagen,
};
