const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { dbConnection } = require("./database/config");
require("dotenv").config();

// Crear servidor de express
const app = express();

// Conexión a base de datos
dbConnection();

// Directorio público
app.use(express.static("public"));

// CORS
app.use(cors());

// BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rutas
app.use("/login", require("./routes/auth"));
app.use("/usuario", require("./routes/usuario"));
app.use("/hospital", require("./routes/hospital"));
app.use("/medico", require("./routes/medico"));
app.use("/busqueda", require("./routes/busqueda"));
app.use("/upload", require("./routes/upload"));

app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto " + process.env.PORT);
});
