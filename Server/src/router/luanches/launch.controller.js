const {
  getAllLaunch,
  createNewLaunch,
  existLaunch,
  abortLaunchById,
} = require("../../model/launch.model");

const pagination = require("../../services/query")

async function httpGetAllLuanch(req, res) {
  const {limit, skip} = pagination(req.query)
  const launches = await getAllLaunch(limit, skip)
  res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.launchDate ||
    !launch.mission ||
    !launch.rocket ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing Requierd launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid date!",
    });
  }
  if (await createNewLaunch(launch)) {
    res.status(201).json(launch);
  } else {
    res.status(404).json({
      error: "no planet matching",
    });
  }
}

async function httpAbortLaunch(req, res) {
  const launchID = +req.params.id;

  if (!await existLaunch(launchID)) {
    return res.status(404).json({
      error: "launch not found!",
    });
  }
  const aborted = await abortLaunchById(launchID);
  if(!aborted){
    return res.status(400).json({
      error: "launch not aborted!"
    })
  }

  return res.status(200).json({
    ok: true,
  });
}

module.exports = { httpGetAllLuanch, httpAddNewLaunch, httpAbortLaunch };
