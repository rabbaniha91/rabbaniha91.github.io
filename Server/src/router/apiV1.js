const express = require("express")

const planetsRouter = require("./planets/planets.router");
const luanchRouter = require("./luanches/luanch.router");

const api = express.Router()

api.use("/planets", planetsRouter);
api.use("/launches", luanchRouter);

module.exports = api;