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

describe("#suspend student", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test("returns 204 code on sucessful call", async () => {
    const suspendStudentSpy = jest.spyOn(pool, "query").mockResolvedValue();
    const response = await request(app).post("/api/suspend");
    expect(response.status).toBe(204);
    expect(response.text).toBeFalsy();
  });

  test("returns 500 code on failed call", async () => {
    const suspendStudentSpy = jest
      .spyOn(pool, "query")
      .mockRejectedValue(new Error());

    const response = await request(app).post("/api/suspend");
    expect(response.status).toBe(500);
    expect(response.error.text).toBe("Something went wrong");
  });
});

describe("#register student", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test("returns 400 code if teacher not found", async () => {
    const getTeacherEmailsSpy = jest
      .spyOn(pool, "query")
      .mockResolvedValue({ rows: [] });
    const response = await request(app).post("/api/register");
    expect(response.status).toBe(400);
    expect(response.error.text).toBe("UNABLE TO FIND RECORD OF TEACHER!");
  });

  test("returns 400 code if students not found", async () => {
    const getTeacherEmailsSpy = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({ rows: [{ id: 12345678 }] });

    const getStudentEmailsSpy = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({ rows: [] });

    const response = await request(app)
      .post("/api/register")
      .send({ students: ["studentSeen@mail.com", "studentFive@mail.com"] });
    expect(response.status).toBe(400);
    expect(response.error.text).toBe(
      "ONE OR MORE STUDENTS DO NOT EXIST, PLEASE TRY AGAIN!"
    );
  });

  test("returns 400 code if students length not match returned records", async () => {
    const getTeacherEmailsSpy = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({ rows: [{ id: 12345678 }] });

    const getStudentEmailsSpy = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({ rows: [{ id: 5566677 }] });

    const response = await request(app)
      .post("/api/register")
      .send({ students: ["studentSeen@mail.com", "studentFive@mail.com"] });
    expect(response.status).toBe(400);
    expect(response.error.text).toBe(
      "ONE OR MORE STUDENTS DO NOT EXIST, PLEASE TRY AGAIN!"
    );
  });

  test("returns 204 code if successfully posted", async () => {
    const getTeacherEmailsSpy = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({ rows: [{ id: 12345678 }] });

    const getStudentEmailsSpy = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({ rows: [{ id: 5566677 }, { id: 444433333 }] });

    const postStudentsSpy = jest.spyOn(pool, "query").mockResolvedValue(2);

    const response = await request(app)
      .post("/api/register")
      .send({ students: ["studentSeen@mail.com", "studentFive@mail.com"] });
    expect(response.status).toBe(204);
    expect(response.text).toBeFalsy();
  });
});

describe("#retrievefornotifications", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test("returns 400 code if unable to find teacher", async () => {
    const getTeacherEmailsSpy = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({ rows: [] });
    const response = await request(app)
      .post("/api/retrievefornotifications")
      .send({
        teacher: "teacherUnknown@mail.com",
        notification:
          "Hello students! @studentTwo@mail.com @studentTen@mail.com",
      });
    expect(response.status).toBe(400);
    expect(response.text).toBe("UNABLE TO FIND RECORD OF TEACHER!");
  });

  test("returns 200 code on successful call with no duplicated student emails", async () => {
    const getTeacherEmailsSpy = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({ rows: [{ id: 1111111 }] });

    const getCommonStudentsIdSpy = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({ rows: [{ id: 222222222 }] });

    const getCommonStudentsEmailSpy = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({
        rows: [
          { email: "studentOne@mail.com" },
          { email: "studentTwo@mail.com" },
        ],
      });

    const getUnsuspendedStudentsEmaillSpy = jest
      .spyOn(pool, "query")
      .mockResolvedValueOnce({
        rows: [
          { email: "studentTwo@mail.com" },
          { email: "studentTen@mail.com" },
        ],
      });

    const response = await request(app)
      .post("/api/retrievefornotifications")
      .send({
        teacher: "teacherUnknown@mail.com",
        notification:
          "Hello students! @studentTwo@mail.com @studentTen@mail.com",
      });
    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toEqual({
      recipients: [
        "studentOne@mail.com",
        "studentTwo@mail.com",
        "studentTen@mail.com",
      ],
    });
  });
});
