// tests/detectRoute.test.js
import request from "supertest";
import express from "express";
import detectRoutes from "../routes/detectRoutes.js";

const app = express();
app.use(express.json());
app.use("/api/detect", detectRoutes);

describe("POST /api/detect", () => {
  it("returns 400 when imagePath is missing", async () => {
    const res = await request(app).post("/api/detect").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("returns 400 when imagePath file does not exist", async () => {
    const res = await request(app).post("/api/detect").send({
      imagePath: "/nonexistent/path/to/image.jpg",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/not found/i);
  });
});
