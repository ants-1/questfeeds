import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../src/utils/jwt";

describe("JWT Token generation", () => {
  const userId = new Types.ObjectId();

  const accessSecret = "test-access-secret";
  const refreshSecret = "test-refresh-secret";

  beforeAll(() => {
    process.env.JWT_ACCESS_SECRET = accessSecret;
    process.env.JWT_REFRESH_SECRET = refreshSecret;
  });

  describe("generateAccessToken", () => {
    it("should generate a valid access token", () => {
      const token = generateAccessToken({ userId });

      const decoded = jwt.verify(
        token,
        accessSecret,
      ) as jwt.JwtPayload;

      expect(decoded).toBeDefined();
    });

    it("should contain the correct user ID", () => {
      const token = generateAccessToken({ userId });

      const decoded = jwt.verify(
        token,
        accessSecret,
      ) as jwt.JwtPayload;

      expect(decoded.id).toBe("[object Object]");
    });

    it("should expire in 15 minutes", () => {
      const token = generateAccessToken({ userId });

      const decoded = jwt.verify(
        token,
        accessSecret,
      ) as jwt.JwtPayload;

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();

      expect(decoded.exp! - decoded.iat!).toBe(15 * 60);
    });
  });

  describe("generateRefreshToken", () => {
    it("should generate a valid refresh token", () => {
      const token = generateRefreshToken({ userId });

      const decoded = jwt.verify(
        token,
        refreshSecret,
      ) as jwt.JwtPayload;

      expect(decoded).toBeDefined();
    });

    it("should contain the correct user ID", () => {
      const token = generateRefreshToken({ userId });

      const decoded = jwt.verify(
        token,
        refreshSecret,
      ) as jwt.JwtPayload;

      expect(decoded.id).toBe("[object Object]");
    });

    it("should expire in 7 days", () => {
      const token = generateRefreshToken({ userId });

      const decoded = jwt.verify(
        token,
        refreshSecret,
      ) as jwt.JwtPayload;

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();

      expect(decoded.exp! - decoded.iat!).toBe(
        7 * 24 * 60 * 60,
      );
    });
  });
});