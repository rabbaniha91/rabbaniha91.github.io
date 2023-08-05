const express = require("express");

const {
  httpGetAllLuanch,
  httpAddNewLaunch,
  httpAbortLaunch,
} = require("./launch.controller");

const luanchRouter = express();

luanchRouter.get("/", httpGetAllLuanch);
luanchRouter.post("/", httpAddNewLaunch);
luanchRouter.delete("/:id", httpAbortLaunch);

module.exports = luanchRouter;
