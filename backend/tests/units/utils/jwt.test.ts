import jwt from "jsonwebtoken";
import { Types } from "mongoose";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../src/utils/jwt";

describe("JWT Token generation", () => {
  const accessSecret = "test-access-secret";
  const refreshSecret = "test-refresh-secret";

  const userId = new Types.ObjectId();
  const user = { userId };

  beforeAll(() => {
    process.env.JWT_ACCESS_SECRET = accessSecret;
    process.env.JWT_REFRESH_SECRET = refreshSecret;
  });

  describe("generateAcessToken", () => {
    it("should generate a valid access token", () => {
      const token = generateAccessToken(user);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });

    it("should contain the correct user ID", () => {
      const token = generateAccessToken(user);

      const decoded = jwt.verify(token, accessSecret) as jwt.JwtPayload;

      expect(decoded.userId.userId).toBe(userId.toString());
    });

    it("should expire in 15 minutes", () => {
      const token = generateAccessToken(user);

      const decoded = jwt.verify(token, accessSecret) as jwt.JwtPayload;

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();

      expect(decoded.exp! - decoded.iat!).toBe(15 * 60);
    });

    it("should use the access token secret", () => {
      const token = generateAccessToken(user);

      expect(() => {
        jwt.verify(token, accessSecret);
      }).not.toThrow();

      expect(() => {
        jwt.verify(token, refreshSecret);
      }).toThrow();
    });
  });

  describe("generateRefreshToken", () => {
    it("should generate a valid refresh token", () => {
      const token = generateRefreshToken(user);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });

    it("should contain the correct user ID", () => {
      const token = generateRefreshToken(user);

      const decoded = jwt.verify(token, refreshSecret) as jwt.JwtPayload;

      expect(decoded.userId.userId).toBe(userId.toString());
    });

    it("should expire in 7 days", () => {
      const token = generateRefreshToken(user);

      const decoded = jwt.verify(token, refreshSecret) as jwt.JwtPayload;

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();

      expect(decoded.exp! - decoded.iat!).toBe(7 * 24 * 60 * 60);
    });

    it("should use the refresh token secret", () => {
      const token = generateRefreshToken(user);

      expect(() => {
        jwt.verify(token, refreshSecret);
      }).not.toThrow();

      expect(() => {
        jwt.verify(token, accessSecret);
      }).toThrow();
    });
  });
});
