const request = require("supertest");

const app = require("../../app");
const { connectMongo, disconnectMongo } = require("../../services/mongoDB");

describe("Test Launch API", () => {
  beforeAll(async () => {
    await connectMongo();
  });

  afterAll(async () => {
    await disconnectMongo()
  })

  /// Test get request to launches route

  describe("Test GET launches", () => {
    test("The status code shoud be 200!", async () => {
      const responce = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  /// Test post request to launches route

  describe("Test POST launches", () => {
    const completeLaunchData = {
      launchDate: "April 28, 2030",
      mission: "heydar",
      rocket: "hrb",
      target: "Kepler-62 f",
    };
    const completeLaunchDataWithMisDate = {
      launchDate: "noon",
      mission: "heydar",
      rocket: "hrb",
      target: "Kepler-62 f",
    };

    const launchDataWithoutDate = {
      mission: "heydar",
      rocket: "hrb",
      target: "Kepler-62 f",
    };

    /// the success created new launch

    test("The status code shoud be 201!", async () => {
      const responce = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responceDate = new Date(responce.body.launchDate).valueOf();

      expect(responceDate).toBe(requestDate);

      expect(responce.body).toMatchObject(launchDataWithoutDate);
    });

    /// the fail add launch because miss data

    test("It shoud catch missing date", async () => {
      const responce = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(responce.body).toStrictEqual({
        error: "Missing Requierd launch property",
      });
    });

    /// the fail add launch because incorrect date

    test("It shoud catch Invalid date", async () => {
      const responce = await request(app)
        .post("/v1/launches")
        .send(completeLaunchDataWithMisDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(responce.body).toStrictEqual({
        error: "Invalid date!",
      });
    });
  });

  /// Test delete request to launches route

  describe("The DELETE launches", () => {
    let id = 105;

    /// the success delete launch

    test("The status code shoud be 200", async () => {
      const responce = await request(app)
        .delete(`/v1/launches/${id}`)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(responce.body.flightNumber).toBe(id);
    });

    /// the fail delete

    test("The status code shoud be 404", async () => {
      const responce = await request(app)
        .delete("/v1/launches/302")
        .expect("Content-Type", /json/)
        .expect(404);
      expect(responce.body).toStrictEqual({
        error: "launch not found!",
      });
    });
  });
});
