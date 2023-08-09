const mongoose = require("mongoose");

require("dotenv").config()

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
  console.log(`Mongo Ready...`);
});

mongoose.connection.on("error", (err) => {
  console.error("Error" + err);
});


async function connectMongo(){
  await mongoose.connect(MONGO_URL, {
    socketTimeoutMS: 30000,
    connectTimeoutMS: 30000,
  });
}

async function disconnectMongo(){
    await mongoose.disconnect()
}


module.exports = {
    connectMongo,
    disconnectMongo,
}
