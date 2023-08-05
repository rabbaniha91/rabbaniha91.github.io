console.clear();

const http = require("http");

require("dotenv").config()

const app = require("./app");
const { connectMongo } = require("./services/mongoDB")
const { retrurnPlanets } = require("./model/planets.model");
const { loadLaunchesSpaceX } = require("./model/launch.model")

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

async function loadData() {
  await connectMongo();
  await retrurnPlanets();
  await loadLaunchesSpaceX()
  server.listen(PORT, () => {
    console.log(`Server Run On ${PORT}...`);
  });
}

loadData();
