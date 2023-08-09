console.clear();

const http = require("http");

require("dotenv").config()

const app = require("./app");
const { connectMongo } = require("./services/mongoDB")
const { returnPlanets } = require("./model/planets.model");
const { loadLaunchesSpaceX } = require("./model/launch.model")

const server = http.createServer(app);

const PORT = process.env.PORT;

async function loadData() {
  await connectMongo();
  await returnPlanets();
  await loadLaunchesSpaceX()
  server.listen(PORT, () => {
    console.log(`Server Run On ${PORT}...`);
  });
}

loadData();
