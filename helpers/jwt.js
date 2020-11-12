"use strict";

const jwt = require("jsonwebtoken");

const generarJWT = (usuarioId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      usuarioId,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "111d",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se ha generado el JsonWebToken", err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generarJWT,
};
