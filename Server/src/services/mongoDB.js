const mongoose = require("mongoose");

require("dotenv").config()

const MONGO_URL = process.env.Mongo_URL;

mongoose.connection.once("open", () => {
  console.log(`Mongo Ready...`);
});

mongoose.connection.on("error", (err) => {
  console.error("Error" + err);
});


async function connectMongo(){
  await mongoose.connect(MONGO_URL);
}

async function disconnectMongo(){
    await mongoose.disconnect()
}


module.exports = {
    connectMongo,
    disconnectMongo,
}
