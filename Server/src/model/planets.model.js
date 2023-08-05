const fs = require("fs");
const path = require("path");

const { parse } = require("csv-parse");

const planets = require("./planets.mongo");

function habitablePlanets(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_prad"] < 1.6 &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11
  );
}

function retrurnPlanets() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "..", "./data/planetData.csv"))
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (habitablePlanets(data)) {
          await insertPlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject();
      })
      .on("end", async () => {
        console.log((await getAllPlanets()).length);
        resolve();
      });
  });
}

async function getAllPlanets() {
 return await planets.find({}, {
  "_id": 0, "__v": 0,
 });
}

async function insertPlanet(planet) {
  await planets.updateOne(
    {
      keplerName: planet.kepler_name,
    },
    {
      keplerName: planet.kepler_name,
    },
    {
      upsert: true,
    }
  );
}

module.exports = {
  retrurnPlanets,
  getAllPlanets,
};
