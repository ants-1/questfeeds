import request from "supertest";

import app from "../../src/app";
import User from "../../src/models/User";
import { redis } from "../../src/config/redis";

jest.mock("../../src/config/redis", () => ({
  redis: {
    set: jest.fn().mockResolvedValue("OK"),
    get: jest.fn(),
    del: jest.fn().mockResolvedValue(1),
  },
}));

const mockedRedis = redis as jest.Mocked<typeof redis>;

describe("Authentication API", () => {
  const user = {
    username: "testuser",
    email: "testuser@test.com",
    password: "Password123!",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/v1/auth/register", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(user);

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
        success: true,
        data: {
          user: expect.objectContaining({
            username: "testuser",
            email: "testuser@test.com",
          }),
        },
        error: null,
      });

      const createdUser = await User.findOne({
        email: user.email,
      });

      expect(createdUser).not.toBeNull();
    });

    it("should reject duplicate email", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send(user);

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          username: "different",
          email: user.email,
          password: "Password123!",
        });

      expect(response.status).toBe(409);

      expect(response.body).toEqual({
        success: false,
        data: null,
        error: "Username or email already exists",
      });
    });

    it("should reject duplicate username", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send(user);

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          username: user.username,
          email: "different@test.com",
          password: "Password123!",
        });

      expect(response.status).toBe(409);

      expect(response.body).toEqual({
        success: false,
        data: null,
        error: "Username or email already exists",
      });
    });
  });

  describe("POST /api/v1/auth/login", () => {
    beforeEach(async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send(user);
    });

    it("should login successfully", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          username: user.username,
          password: user.password,
        });

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data.user).toEqual(
        expect.objectContaining({
          username: user.username,
          email: user.email,
        }),
      );

      expect(response.body.data.token).toBeDefined();

      expect(response.headers["set-cookie"]).toBeDefined();
      expect(response.headers["set-cookie"][0]).toContain(
        "refreshToken=",
      );
    });

    it("should reject an incorrect password", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          username: user.username,
          password: "WrongPassword123!",
        });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        success: false,
        data: null,
        error: "Invalid crendetials",
      });
    });

    it("should reject a nonexistent user", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          username: "does-not-exist",
          password: user.password,
        });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        success: false,
        data: null,
        error: "Invalid credentials",
      });
    });
  });

  describe("POST /api/v1/auth/refresh", () => {
    it("should reject a request without a refresh token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/refresh");

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        success: false,
        data: null,
        error: "No token provided",
      });
    });

    it("should reject an invalid refresh token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/refresh")
        .set(
          "Cookie",
          "refreshToken=invalid-token",
        );

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        success: false,
        data: null,
        error: "Invalid refresh token",
      });
    });

it("should refresh an authenticated session", async () => {
  // Register
  await request(app)
    .post("/api/v1/auth/register")
    .send(user);

  // Login
  const loginResponse = await request(app)
    .post("/api/v1/auth/login")
    .send({
      username: user.username,
      password: user.password,
    });

  expect(loginResponse.status).toBe(200);

  const cookie = loginResponse.headers["set-cookie"][0];

  const refreshToken = cookie
    .split(";")[0]
    .split("=")[1];

  // Make Redis return the refresh token stored during login
  mockedRedis.get.mockResolvedValueOnce(refreshToken);

  // Refresh
  const response = await request(app)
    .post("/api/v1/auth/refresh")
    .set("Cookie", `refreshToken=${refreshToken}`);

  expect(response.status).toBe(200);

  expect(response.body).toEqual({
    success: true,
    data: {
      token: expect.any(String),
    },
    error: null,
  });

  expect(response.headers["set-cookie"]).toBeDefined();
  expect(response.headers["set-cookie"][0]).toContain(
    "refreshToken=",
  );
});
  });

  describe("POST /api/v1/auth/logout", () => {
    it("should logout successfully", async () => {
      const agent = request.agent(app);

      // Register
      await agent
        .post("/api/v1/auth/register")
        .send(user);

      // Login
      const loginResponse = await agent
        .post("/api/v1/auth/login")
        .send({
          username: user.username,
          password: user.password,
        });

      expect(loginResponse.status).toBe(200);

      const accessToken = loginResponse.body.data.token;

      expect(accessToken).toBeDefined();

      // Logout
      const response = await agent
        .post("/api/v1/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: {
          message: "Logged out successfully",
        },
        error: null,
      });

      // Access token should be blacklisted
      expect(mockedRedis.set).toHaveBeenCalledWith(
        expect.stringContaining("blacklist:"),
        "true",
        expect.objectContaining({
          EX: expect.any(Number),
        }),
      );

      // Refresh token should be removed
      expect(mockedRedis.del).toHaveBeenCalled();

      // Refresh cookie should be cleared
      expect(response.headers["set-cookie"]).toBeDefined();
      expect(response.headers["set-cookie"][0]).toContain(
        "refreshToken=;",
      );
    });
  });
});