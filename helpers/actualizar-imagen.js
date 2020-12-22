"use strict";

const fs = require("fs");

const Hospital = require("../models/hospital");
const Medico = require("../models/medico");
const Usuario = require("../models/usuario");

const actualizarImagen = async (tipo, id, nombreArchivo) => {
  let pathViejo = "";

  switch (tipo) {
    case "usuario":
      const usuario = await Usuario.findById(id);

      if (!usuario) {
        console.log("No se encontro un usuario con ese id.");
        return false;
      }
      // Borrar el archivo ya existente
      pathViejo = `./uploads/usuario/${usuario.img}`;
      borrarImagen(pathViejo);

      // Guardar el archivo
      usuario.img = nombreArchivo;
      await usuario.save();

      return true;

    case "hospital":
      const hospital = await Hospital.findById(id);

      if (!hospital) {
        console.log("No se encontro un hospital con ese id.");
        return false;
      }

      pathViejo = `./uploads/hospital/${hospital.img}`;
      borrarImagen(pathViejo);

      hospital.img = nombreArchivo;
      await hospital.save();

      return true;

    case "medico":
      const medico = await Medico.findById(id);

      if (!medico) {
        console.log("No se encontro un medico con ese id.");
        return false;
      }

      pathViejo = `./uploads/medico/${medico.img}`;
      borrarImagen(pathViejo);

      medico.img = nombreArchivo;
      await medico.save();

      return true;

    default:
      break;
  }
};

const borrarImagen = (path) => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

module.exports = {
  actualizarImagen,
};
