const request = require("supertest");
const app = require("../../app");

const pool = require("../../db");

describe("#health-check", () => {
  test("route works", async () => {
    const response = await request(app).get("/api/health-check");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Server is running!");
  });
});

describe("#common students", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test("throws 400 error if teacher record not found", async () => {
    const getTeacherEmailsSpy = jest
      .spyOn(pool, "query")
      .mockResolvedValue({ rows: [] });

    const response = await request(app).get("/api/commonstudents");

    expect(response.status).toBe(400);
    expect(response.error.text).toBe("UNABLE TO FIND RECORD OF TEACHER!");
  });

  test("returns 200 code and empty array if no common students", async () => {
    const getTeacherEmailsSpy = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({ rows: [{ id: 123456 }] });

    const getCommonStudentsIdSpy = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({ rows: [] });

    const commonStudentsEmailSpy = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({ rows: [] });

    const response = await request(app).get("/api/commonstudents");
    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toEqual([]);
  });

  test("returns 200 code and array of common students", async () => {
    const getTeacherEmailsSpy = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({ rows: [{ id: 123456 }] });

    const getCommonStudentsIdSpy = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({ rows: [{ student_id: 123456 }] });

    const commonStudentsEmailSpy = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({
        rows: [
          { email: "one@mail.com", username: "one" },
          { email: "two@mail.com", username: "two" },
        ],
      });

    const response = await request(app).get("/api/commonstudents");
    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toEqual(["one@mail.com", "two@mail.com"]);
  });
});
