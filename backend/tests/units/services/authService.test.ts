import jwt from "jsonwebtoken";
import User from "../../../src/models/User";
import authService from "../../../src/services/authService";
import { redis } from "../../../src/config/redis";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../src/utils/jwt";

jest.mock("../../../src/models/User");
jest.mock("../../../src/config/redis", () => ({
  redis: {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  },
}));
jest.mock("../../../src/utils/jwt");

const mockedUser = User as jest.Mocked<typeof User>;
const mockedRedis = redis as jest.Mocked<typeof redis>;
const mockedGenerateAccessToken = generateAccessToken as jest.MockedFunction<
  typeof generateAccessToken
>;
const mockedGenerateRefreshToken = generateRefreshToken as jest.MockedFunction<
  typeof generateRefreshToken
>;

describe("authService", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user", async () => {
      const userId = "507f1f77bcf86cd799439011";

      mockedUser.findOne.mockResolvedValue(null);

      mockedUser.create.mockResolvedValue({
        _id: userId,
        username: "testUser1",
        email: "testuser1@test.com",
      } as any);

      const result = await authService.register(
        "testUser1",
        "testuser1@test.com",
        "Password123!",
      );

      expect(mockedUser.findOne).toHaveBeenCalledWith({
        $or: [{ email: "testuser1@test.com" }, { username: "testUser1" }],
      });

      expect(mockedUser.create).toHaveBeenCalledWith({
        username: "testUser1",
        email: "testuser1@test.com",
        password: "Password123!",
      });

      expect(result.user).toEqual({
        _id: userId,
        username: "testUser1",
        email: "testuser1@test.com",
      });
    });

    it("should throw an error if the user already exists", async () => {
      mockedUser.findOne.mockResolvedValue({
        _id: "123",
        username: "testUser",
        email: "testuser@test.com",
      } as any);

      await expect(
        authService.register("testUser", "testuser@test.com", "Password123!"),
      ).rejects.toMatchObject({
        message: "Username or email already exists",
        status: 409,
      });

      expect(mockedUser.create).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should login successfully with valid credentials", async () => {
      const userId = "507f1f77bcf86cd799439011";

      const user = {
        _id: userId,
        username: "testUser1",
        email: "testuser@test.com",
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      mockedUser.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(user),
      } as any);

      mockedGenerateAccessToken.mockReturnValue("access-token");
      mockedGenerateRefreshToken.mockReturnValue("refresh-token");
      mockedRedis.set.mockResolvedValue("OK");

      const result = await authService.login("testUser1", "Password123!");

      expect(result.user).toEqual({
        _id: userId,
        username: "testUser1",
        email: "testuser@test.com",
      });

      expect(result.accessToken).toBe("access-token");
      expect(result.refreshToken).toBe("refresh-token");

      expect(user.comparePassword).toHaveBeenCalledWith("Password123!");

      expect(mockedRedis.set).toHaveBeenCalledWith(
        `refresh:${userId}`,
        "refresh-token",
        {
          EX: 7 * 24 * 60 * 60,
        },
      );
    });

    it("should throw an error if the user does not exist", async () => {
      mockedUser.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        authService.login("testUser1", "Password123!"),
      ).rejects.toMatchObject({
        message: "Invalid credentials",
        status: 401,
      });
    });

    it("should throw an error if the password is incorrect", async () => {
      const user = {
        _id: "507f1f77bcf86cd799439011",
        username: "testUser1",
        email: "testuser@test.com",
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      mockedUser.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(user),
      } as any);

      await expect(
        authService.login("testUser1", "WrongPassword"),
      ).rejects.toMatchObject({
        status: 401,
      });

      expect(user.comparePassword).toHaveBeenCalledWith("WrongPassword");
    });
  });

  describe("logout", () => {
    it("should return a successful logout response", async () => {
      const result = await authService.logout(undefined, "refresh-token");

      expect(result).toEqual({
        message: "Logged out successfully",
      });
    });
  });

  describe("refresh", () => {
    it("should throw an error when no refresh token is provided", async () => {
      await expect(authService.refresh(null)).rejects.toMatchObject({
        message: "No token provided",
        status: 401,
      });
    });

    it("should throw an error when the refresh token is invalid", async () => {
      jest.spyOn(jwt, "verify").mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await expect(authService.refresh("invalid-token")).rejects.toMatchObject({
        message: "Invalid refresh token",
        status: 401,
      });
    });
  });
});
