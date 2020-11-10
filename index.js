const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { dbConnection } = require("./database/config");
require("dotenv").config();

// Crear servidor de express
const app = express();

// Conexión a base de datos
dbConnection();

// CORS
app.use(cors());

// BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rutas
app.use("/usuario", require("./routes/usuarios"));
app.use("/login", require("./routes/auth"));

app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto " + process.env.PORT);
});
