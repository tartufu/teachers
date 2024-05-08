const { inClauseQueryBuilder, errorMessageBuilder } = require("./utils");

describe("#inClauseQueryBuilder", () => {
  test("should return empty string on empty array", () => {
    expect(inClauseQueryBuilder([])).toBe("");
  });

  test("should return $1, $2 on array with 2 els", () => {
    expect(inClauseQueryBuilder([1, 2])).toBe("$1, $2");
  });

  test("should throw error if parms is not array", () => {
    expect(() => inClauseQueryBuilder("")).toThrow();
  });
});

describe("#errorMessageBuilder", () => {
  test("should return object and 400 status code if 3rd params not provided", () => {
    expect(errorMessageBuilder("123", "456")).toEqual({
      type: "123",
      message: "456",
      statusCode: 400,
    });
  });

  test("should return object on provided params", () => {
    expect(errorMessageBuilder("463", "287", 401)).toEqual({
      type: "463",
      message: "287",
      statusCode: 401,
    });
  });
});
