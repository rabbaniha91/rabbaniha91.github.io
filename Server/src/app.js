const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const api = require("./router/apiV1")


const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(morgan("combined"));

app.use(express.json());

app.use("/v1", api)



module.exports = app;
