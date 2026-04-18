// tests/weatherRoute.test.js
import request from "supertest";
import express from "express";
import weatherRoutes from "../routes/weatherRoutes.js";

const app = express();
app.use("/api/weather", weatherRoutes);

describe("GET /api/weather", () => {
  it("returns 503 when OPENWEATHER_API_KEY is not set", async () => {
    const original = process.env.OPENWEATHER_API_KEY;
    delete process.env.OPENWEATHER_API_KEY;

    const res = await request(app).get("/api/weather?city=Bangalore");
    expect(res.status).toBe(503);

    process.env.OPENWEATHER_API_KEY = original;
  });

  it("accepts city query param", async () => {
    // With a real key in env this would return 200; here we just assert shape
    const res = await request(app).get("/api/weather?city=London");
    expect([200, 503]).toContain(res.status);
  });

  it("accepts lat/lon query params", async () => {
    const res = await request(app).get("/api/weather?lat=12.97&lon=77.59");
    expect([200, 503]).toContain(res.status);
  });
});
