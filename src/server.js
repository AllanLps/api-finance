const express = require("express");
const bodyParse = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

require("./controllers/index")(app);

app.listen(process.env.SERVER_PORT, () => {
  console.log("servidor iniciado");
});
