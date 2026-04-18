import express from "express";

const router = express.Router();

/**
 * GET /api/weather?city=Bangalore
 * GET /api/weather?lat=12.97&lon=77.59
 *
 * Server-side proxy so OPENWEATHER_API_KEY is never exposed to the browser.
 */
router.get("/", async (req, res) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return res.status(503).json({ error: "Weather service not configured." });
  }

  try {
    const { city, lat, lon } = req.query;

    let query;
    if (lat && lon) {
      query = `lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
    } else if (city) {
      query = `q=${encodeURIComponent(city)}`;
    } else {
      // Default to Bangalore if no location provided
      query = "q=Bangalore";
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || "Weather fetch failed." });
    }

    // Return a normalized subset — don't expose raw OWM payload to the client
    return res.json({
      city: data.name,
      temp: data.main?.temp,
      humidity: data.main?.humidity,
      condition: data.weather?.[0]?.description,
      icon: data.weather?.[0]?.icon,
      wind: data.wind?.speed,
    });
  } catch (err) {
    console.error("🌩️ Weather proxy error:", err.message);
    return res.status(500).json({ error: "Failed to fetch weather data." });
  }
});

export default router;
