const axios = require("axios");

const launnchesDataBase = require("./launches.mongo");
const planets = require("./planets.mongo");

let launchFlightNumber;

async function getLatestFilghtNumber() {
  const laltestFightNumber = await launnchesDataBase
    .findOne({})
    .sort({ flightNumber: "desc" });
  if (laltestFightNumber) {
    return laltestFightNumber.flightNumber;
  } else {
    return false;
  }
}

async function setFlightNumber() {
  launchFlightNumber = (await getLatestFilghtNumber()) || 99;
}

setFlightNumber();

async function getAllLaunch(limit, skip) {
  return await launnchesDataBase.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  )
  .sort({
    flightNumber: "ascending"
  })
  .skip(skip)
  .limit(limit);
}

async function createNewLaunch(launch) {
  const planetName = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planetName) {
    return null;
  }
  launchFlightNumber++;
  Object.assign(launch, {
    flightNumber: launchFlightNumber,
    customers: ["Nasa", "Ztm"],
    upcoming: true,
    success: true,
  });
  await launnchesDataBase.updateOne(
    {
      flightNumber: +launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
  return true;
}

async function findLaunch(filter) {
  return await launnchesDataBase.findOne(filter);
}

async function existLaunch(id) {
  return await findLaunch({ flightNumber: id });
}

async function abortLaunchById(id) {
  const aborted = await launnchesDataBase.updateOne(
    {
      flightNumber: id,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.modifiedCount === 1;
}

const SPACEX_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunch() {
  const responce = await axios.post(SPACEX_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if(responce.status !== 200){
    throw new Error("download data faild!")
  }

  const launchDataDocs = responce.data.docs;

  for (const launchDataDoc of launchDataDocs) {
    const payloads = launchDataDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDataDoc["flight_number"],
      mission: launchDataDoc["name"],
      rocket: launchDataDoc["rocket"]["name"],
      launchDate: launchDataDoc["date_local"],
      upcoming: launchDataDoc["upcoming"],
      success: launchDataDoc["success"],
      customers,
    };

    console.log(launch);
    await launnchesDataBase.findOneAndUpdate(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      {
        upsert: true,
      }
    );
  }
}

async function loadLaunchesSpaceX() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("SpaceX launch alresdy laoded!");
  } else {
    await populateLaunch();
  }
}

module.exports = {
  loadLaunchesSpaceX,
  getAllLaunch,
  createNewLaunch,
  existLaunch,
  abortLaunchById,
};
