import { AppError } from "../../../src/utils/AppError";

describe("AppError", () => {
  it("should create an error with the correct message and status", () => {
    const error = new AppError("User not found", 404);

    expect(error.message).toBe("User not found");
    expect(error.status).toBe(404);
  });

  it("should have the name AppError", () => {
    const error = new AppError("Something went wrong", 500);

    expect(error.name).toBe("AppError");
  });

  it("should be an instance of Error", () => {
    const error = new AppError("Something went wrong", 500);

    expect(error).toBeInstanceOf(Error);
  });

  it("should be an instance of AppError", () => {
    const error = new AppError("Something went wrong", 500);

    expect(error).toBeInstanceOf(AppError);
  });

  it("should have a stack trace", () => {
    const error = new AppError("Something went wrong", 500);

    expect(error.stack).toBeDefined();
  });
});
