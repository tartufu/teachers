const errorHandler = require("./errorHandler");
const { errorMessageBuilder } = require("../utils/utils");

describe("errorHandler", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test("should handle 404 errors", () => {
    // Create mock objects for req and res
    const mockReq = {};
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Call the errorHandler function with the mock objects and error
    errorHandler(
      errorMessageBuilder("404", "Route not found", 404),
      mockReq,
      mockRes
    );

    // Verify that res.status and res.send were called with the correct arguments
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.send).toHaveBeenCalledWith("Route not found");
  });

  test("should handle 404 errors", () => {
    // Create mock objects for req and res
    const mockReq = {};
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Call the errorHandler function with the mock objects and error
    errorHandler(
      errorMessageBuilder("MISSING_RECORD", "Resource not found", 400),
      mockReq,
      mockRes
    );

    // Verify that res.status and res.send were called with the correct arguments
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.send).toHaveBeenCalledWith("Resource not found");
  });

  test("should handle 500 errors", () => {
    // Create mock objects for req and res
    const mockReq = {};
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Call the errorHandler function with the mock objects and error
    errorHandler(
      errorMessageBuilder("123", "Resource not found", 400),
      mockReq,
      mockRes
    );

    // Verify that res.status and res.send were called with the correct arguments
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith("Something went wrong");
  });
});
