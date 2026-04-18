// tests/reminder.test.js
import request from "supertest";
import express from "express";
import reminderRoutes from "../routes/reminderRoutes.js";

const app = express();
app.use(express.json());
app.use("/api/reminders", reminderRoutes);

describe("POST /api/reminders/create", () => {
  it("rejects missing email", async () => {
    const res = await request(app).post("/api/reminders/create").send({
      plantName: "Tomato",
      action: "water",
      scheduleDate: new Date().toISOString(),
    });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("rejects invalid action value", async () => {
    const res = await request(app).post("/api/reminders/create").send({
      email: "test@example.com",
      plantName: "Tomato",
      action: "spray",          // not in enum
      scheduleDate: new Date().toISOString(),
    });
    expect(res.status).toBe(400);
  });

  it("rejects remedyText over 500 characters", async () => {
    const res = await request(app).post("/api/reminders/create").send({
      email: "test@example.com",
      plantName: "Tomato",
      action: "water",
      scheduleDate: new Date().toISOString(),
      remedyText: "x".repeat(501),
    });
    expect(res.status).toBe(400);
  });

  it("rejects invalid ISO date", async () => {
    const res = await request(app).post("/api/reminders/create").send({
      email: "test@example.com",
      plantName: "Tomato",
      action: "water",
      scheduleDate: "not-a-date",
    });
    expect(res.status).toBe(400);
  });
});
