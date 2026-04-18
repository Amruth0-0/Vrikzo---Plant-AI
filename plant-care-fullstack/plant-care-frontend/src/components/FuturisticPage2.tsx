import { motion, useScroll } from "motion/react";
import {
  Scan,
  CloudRain,
  Brain,
  Zap,
  Upload,
  Sprout,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { LoginDialog } from "./LoginDialog";
import { PlantCareSection } from "./sections/PlantCareSection";
import { ChatCtaSection } from "./sections/ChatCtaSection";
import { ActivateCtaSection } from "./sections/ActivateCtaSection";

export function FuturisticPage2({
  onOpenChatbot,
  onImageUpload,
}: {
  onOpenChatbot?: () => void;
  onImageUpload?: (url: string) => void;
}) {
  /* -----------------------------------------
   * Scroll State
   * ----------------------------------------- */
  const { scrollYProgress } = useScroll();
  const [scrollPercent, setScrollPercent] = useState(0);

  /* -----------------------------------------
   * Weather State
   * ----------------------------------------- */
  const [weatherData, setWeatherData] = useState<any>(null);

  /* -----------------------------------------
   * Login Dialog State
   * ----------------------------------------- */
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  /* -----------------------------------------
   * FETCH WEATHER DATA — proxied via backend
   * Tries geolocation first, falls back to Bangalore
   * ----------------------------------------- */
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

        // Try to get user's coordinates
        let weatherUrl = `${API_URL}/api/weather?city=Bangalore`;

        if (navigator.geolocation) {
          const pos = await new Promise<GeolocationPosition | null>((resolve) =>
            navigator.geolocation.getCurrentPosition(resolve, () => resolve(null), {
              timeout: 5000,
            })
          );
          if (pos) {
            weatherUrl = `${API_URL}/api/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`;
          }
        }

        const res = await fetch(weatherUrl);
        if (!res.ok) return;
        const data = await res.json();
        setWeatherData(data);
      } catch (err) {
        console.error("Weather fetch error:", err);
      }
    };

    fetchWeather();
  }, []);


  /* -----------------------------------------
   * SCROLL PERCENTAGE TRACKER
   * ----------------------------------------- */
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (latest) => {
      setScrollPercent(Math.round(latest * 100));
    });
    return () => unsub();
  }, [scrollYProgress]);

  /* -----------------------------------------
   * PAGE RETURN
   * ----------------------------------------- */
  return (
    <div className="relative bg-black">
      {/* ===================================================== */}
      {/* BACKGROUND PARTICLES                                  */}
      {/* ===================================================== */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(45)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: ["#00ff88", "#00e6ff", "#8800ff"][
                Math.floor(Math.random() * 3)
              ],
              boxShadow: `0 0 ${4 + Math.random() * 6}px currentColor`,
            }}
            animate={{
              y: [0, -20 - Math.random() * 30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* ===================================================== */}
      {/* GRID MATRIX BACKGROUND                                */}
      {/* ===================================================== */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#00ff88"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* ===================================================== */}
      {/* TOP ENERGY STRIP                                      */}
      {/* ===================================================== */}
      <motion.div
        className="fixed top-0 left-0 w-full h-1 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, #00ff88, #00e6ff, #8800ff, transparent)",
        }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* ===================================================== */}
      {/* VERTICAL SCROLL BAR                                   */}
      {/* ===================================================== */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4">
        <div className="relative w-1 h-64 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-emerald-500 via-cyan-500 to-purple-500"
            style={{ height: `${scrollPercent}%` }}
          />
        </div>

        <div className="font-mono text-emerald-400 tracking-widest">
          {scrollPercent}%
        </div>
      </div>

      {/* ===================================================== */}
      {/* SECTION 1 — DISEASE DETECTION                         */}
      {/* ===================================================== */}
      <section
        id="disease-detection"
        className="relative min-h-screen flex items-center justify-center px-6 py-10 md:py-20 overflow-hidden"
      >
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-16 items-center">
          {/* ---------------------------------------- */}
          {/* LEFT — SCANNER VISUALIZATION             */}
          {/* ---------------------------------------- */}
          <div className="relative h-[500px] flex items-center justify-center">
            {/* Rings */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`ring-${i}`}
                className="absolute rounded-full border border-emerald-500/30"
                style={{
                  width: `${100 + i * 80}px`,
                  height: `${100 + i * 80}px`,
                }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}

            {/* Orbiting Dots */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`dot-${i}`}
                className="absolute w-3 h-3 rounded-full bg-emerald-400"
                style={{ boxShadow: "0 0 10px #00ff88" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                initial={{
                  x: Math.cos((i / 12) * Math.PI * 2) * 200,
                  y: Math.sin((i / 12) * Math.PI * 2) * 200,
                }}
              />
            ))}

            {/* Center Core */}
            <motion.div
              className="relative w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400/50 to-emerald-600/50 flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 20px #00ff88",
                  "0 0 40px #00ff88",
                  "0 0 20px #00ff88",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Scan className="w-16 h-16 text-white" />
            </motion.div>

            {/* Scan Line */}
            <motion.div
              className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
              animate={{ y: [-250, 250], opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>

          {/* ---------------------------------------- */}
          {/* RIGHT — TEXT + UPLOAD BUTTON             */}
          {/* ---------------------------------------- */}
          <div>
            {/* Label */}
            <motion.div
              className="inline-block px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/30 mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="font-mono text-emerald-400 tracking-widest">
                01 / DETECTION
              </span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl mb-6 tracking-wider"
              style={{
                background: "linear-gradient(to right, #00ff88, #00e6ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "0.2em",
              }}
            >
              DISEASE DETECTION
            </motion.h2>

            {/* Paragraph */}
            <motion.p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Upload a snapshot and let our AI pinpoint diseases and suggest the
              right treatments.
            </motion.p>

            {/* Upload Handler */}
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    console.log("📸 Image selected:", file.name);

                    const previewUrl = URL.createObjectURL(file);
                    onImageUpload?.(previewUrl);

                    const formData = new FormData();
                    formData.append("file", file);

                    console.log("🚀 Sending image to backend...");
                    const response = await fetch(
                      "http://127.0.0.1:8000/predict",
                      {
                        method: "POST",
                        body: formData,
                      }
                    );

                    const result = await response.json();
                    console.log("🧪 Prediction result:", result);

                    // Normalize Values
                    const cropName =
                      result.crop ||
                      result.cropName ||
                      result.plant ||
                      "Unknown Plant";

                    const diseaseName =
                      result.disease ||
                      result.diseaseName ||
                      result.label ||
                      "Unknown Disease";

                    const confidence = result.confidence || 0;

                    /* WEATHER — proxied through backend, no key in browser */
                    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
                    let weatherUrl = `${API_URL}/api/weather?city=Bangalore`;

                    if (navigator.geolocation) {
                      const pos = await new Promise<GeolocationPosition | null>((resolve) =>
                        navigator.geolocation.getCurrentPosition(resolve, () => resolve(null), { timeout: 5000 })
                      );
                      if (pos) {
                        weatherUrl = `${API_URL}/api/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`;
                      }
                    }

                    let weatherPayload = { temperature: 0, humidity: 0, condition: "", city: "Bangalore" };
                    try {
                      const weatherRes = await fetch(weatherUrl);
                      if (weatherRes.ok) {
                        const w = await weatherRes.json();
                        weatherPayload = {
                          temperature: w.temp ?? 0,
                          humidity: w.humidity ?? 0,
                          condition: w.condition || "",
                          city: w.city || "Bangalore",
                        };
                      }
                    } catch {}

                    const payload = {
                      imageUrl: previewUrl,
                      cropName,
                      diseaseName,
                      confidence,
                      weather: weatherPayload,
                      raw: result,
                    };

                    // Send to Chatbot
                    window.dispatchEvent(
                      new CustomEvent("vrikzo_diagnosis", {
                        detail: payload,
                      })
                    );

                    console.log(
                      "📡 Diagnosis payload sent to chatbot:",
                      payload
                    );

                    onOpenChatbot?.();
                  } catch (err) {
                    console.error("❌ Error uploading image:", err);
                    alert("Failed to analyze image. Check backend.");
                  }
                }}
              />

              <motion.div
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/50 rounded-lg font-mono tracking-widest text-emerald-400 hover:bg-emerald-500/30 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Upload className="w-5 h-5" />
                UPLOAD IMAGE
              </motion.div>
            </label>

            {/* Plant species disclaimer */}
            <p className="mt-4 text-xs text-gray-600 font-mono tracking-wide">
              🌿 Currently supports:{" "}
              <span className="text-emerald-600">Aloe Vera</span>,{" "}
              <span className="text-emerald-600">Tomato</span>,{" "}
              <span className="text-emerald-600">Hibiscus</span>
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SECTION 2 — WEATHER INTELLIGENCE                      */}
      {/* ===================================================== */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-10 md:py-20 overflow-hidden">
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-16 items-center">
          {/* ---------------------------------------- */}
          {/* LEFT — WEATHER CONTENT                   */}
          {/* ---------------------------------------- */}
          <div className="order-2 md:order-1">
            <motion.div
              className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="font-mono text-cyan-400 tracking-widest">
                02 / CLIMATE
              </span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl mb-6 tracking-wider"
              style={{
                background: "linear-gradient(to right, #00e6ff, #8800ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "0.2em",
              }}
            >
              WEATHER INTELLIGENCE
            </motion.h2>

            <motion.p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Using live API data, our system predicts temperature, humidity,
              and rainfall trends to guide optimal care.
            </motion.p>

            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Temperature */}
              <div className="px-6 py-3 bg-cyan-500/5 border border-cyan-500/30 rounded-lg">
                <div className="font-mono text-cyan-400">
                  {weatherData?.temp !== undefined
                    ? `${weatherData.temp}°C`
                    : "24°C"}
                </div>
                <div className="text-sm text-gray-500">Temperature</div>
              </div>

              {/* Humidity */}
              <div className="px-6 py-3 bg-cyan-500/5 border border-cyan-500/30 rounded-lg">
                <div className="font-mono text-cyan-400">
                  {weatherData?.humidity !== undefined
                    ? `${weatherData.humidity}%`
                    : "80%"}
                </div>
                <div className="text-sm text-gray-500">Humidity</div>
              </div>
            </motion.div>
          </div>

          {/* ---------------------------------------- */}
          {/* RIGHT — CLIMATE HOLOGRAM                 */}
          {/* ---------------------------------------- */}
          <div className="relative h-[500px] flex items-center justify-center order-1 md:order-2">
            {/* Rotating Rings */}
            {[...Array(4)].map((_, index) => (
              <motion.div
                key={`ring-${index}`}
                className="absolute"
                style={{
                  width: `${150 + index * 70}px`,
                  height: `${150 + index * 70}px`,
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 15 + index * 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <svg width="100%" height="100%">
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="#00e6ff"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                  {/* Data Points */}
                  {[...Array(8)].map((_, i) => {
                    const angle = (i / 8) * Math.PI * 2;
                    const x = 50 + 48 * Math.cos(angle);
                    const y = 50 + 48 * Math.sin(angle);

                    return (
                      <motion.circle
                        key={`point-${index}-${i}`}
                        cx={x}
                        cy={y}
                        r="1.5"
                        fill="#00e6ff"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    );
                  })}
                </svg>
              </motion.div>
            ))}

            {/* Clickable Center */}
            <motion.div
              className="relative w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400/50 to-cyan-600/50 flex items-center justify-center cursor-pointer"
              animate={{
                boxShadow: [
                  "0 0 20px #00e6ff",
                  "0 0 40px #00e6ff",
                  "0 0 20px #00e6ff",
                ],
                rotate: 360,
              }}
              transition={{
                boxShadow: { duration: 2, repeat: Infinity },
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
              }}
              onClick={() =>
                document
                  .getElementById("weather-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <CloudRain className="w-12 h-12 text-white" />
            </motion.div>

            {/* HUD Overlays */}
            <div className="absolute top-10 left-10 font-mono text-xs text-cyan-400 opacity-60">
              {weatherData?.temp !== undefined
                ? `[TEMP: ${weatherData.temp}°C]`
                : "[TEMP: 24°C]"}
            </div>

            <div className="absolute bottom-10 right-10 font-mono text-xs text-cyan-400 opacity-60">
              {weatherData?.humidity !== undefined
                ? `[HUM: ${weatherData.humidity}%]`
                : "[HUM: 80%]"}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SECTION 3 — PLANT CARE SYSTEM                         */}
      {/* ===================================================== */}
      <PlantCareSection />

      {/* ===================================================== */}
      {/* SECTION 4 — CHAT WITH VRIKZO                          */}
      {/* ===================================================== */}
      <ChatCtaSection onOpenChatbot={onOpenChatbot} />

      {/* ===================================================== */}
      {/* SECTION 5 — CALL TO ACTION (ACTIVATE NOW)             */}
      {/* ===================================================== */}
      <ActivateCtaSection onActivate={() => setShowLoginDialog(true)} />

      {/* LOGIN DIALOG */}
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  );
}
