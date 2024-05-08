const request = require("supertest");
const app = require("../../app");

describe("404 route", () => {
  test("returns 404 if route is not found", async () => {
    const response = await request(app).get("/gibberish");
    expect(response.status).toBe(404);
    expect(response.error.text).toBe("ROUTE NOT FOUND");
  });
});
