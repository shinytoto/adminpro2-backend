const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./database/config");
require("dotenv").config();

// Crear servidor de express
const app = express();

// Conexión a base de datos
dbConnection();

// CORS
app.use(cors());

// Rutas
app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    mensaje: "Hola Mundo",
  });
});

app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto " + process.env.PORT);
});
