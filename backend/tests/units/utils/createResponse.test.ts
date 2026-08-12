import { createResponse } from "../../../src/utils/createResponse";

describe("createResponse", () => {
  it("should return a successful response with data", () => {
    const result = createResponse(true, { username: "testUser1" });

    expect(result).toEqual({
      success: true,
      data: { username: "testUser1" },
      error: null,
    });
  });

  it("should return the error directly when error is a string", () => {
    const result = createResponse(false, null, "Invalid credentials");

    expect(result).toEqual({
      success: false,
      data: null,
      error: "Invalid credentials",
    });
  });

  it("should use default values when data and error are not provided", () => {
    const result = createResponse(true);

    expect(result).toEqual({
      success: true,
      data: null,
      error: null,
    });
  });
});
