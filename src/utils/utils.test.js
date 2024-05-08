const { inClauseQueryBuilder } = require("./utils");

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
