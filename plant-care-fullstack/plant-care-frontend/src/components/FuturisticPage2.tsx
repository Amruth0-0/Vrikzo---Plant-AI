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
   * FETCH WEATHER DATA (runs once)
   * ----------------------------------------- */
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

        if (!apiKey) {
          console.error("❌ Missing VITE_WEATHER_API_KEY");
          return;
        }

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Bangalore&appid=${apiKey}&units=metric`
        );

        const data = await res.json();
        setWeatherData(data);
      } catch (err) {
        console.error("Weather API Error:", err);
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
        className="relative min-h-screen flex items-center justify-center px-6 py-20"
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

            {/* Heading */}
            <motion.h2
              className="text-6xl mb-6 tracking-wider"
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

                    /* WEATHER API */
                    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

                    const weatherRes = await fetch(
                      `https://api.openweathermap.org/data/2.5/weather?q=Bangalore&appid=${apiKey}&units=metric`
                    );

                    const weatherJson = await weatherRes.json();

                    const payload = {
                      imageUrl: previewUrl,
                      cropName,
                      diseaseName,
                      confidence,
                      weather: {
                        temperature: weatherJson.main?.temp,
                        humidity: weatherJson.main?.humidity,
                        condition:
                          weatherJson.weather?.[0]?.description || "",
                        city: weatherJson.name || "Bangalore",
                      },
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
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SECTION 2 — WEATHER INTELLIGENCE                      */}
      {/* ===================================================== */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
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
              className="text-6xl mb-6 tracking-wider"
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
                  {weatherData?.main?.temp !== undefined
                    ? `${weatherData.main.temp}°C`
                    : "24°C"}
                </div>
                <div className="text-sm text-gray-500">Temperature</div>
              </div>

              {/* Humidity */}
              <div className="px-6 py-3 bg-cyan-500/5 border border-cyan-500/30 rounded-lg">
                <div className="font-mono text-cyan-400">
                  {weatherData?.main?.humidity !== undefined
                    ? `${weatherData.main.humidity}%`
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
              {weatherData?.main?.temp !== undefined
                ? `[TEMP: ${weatherData.main.temp}°C]`
                : "[TEMP: 24°C]"}
            </div>

            <div className="absolute bottom-10 right-10 font-mono text-xs text-cyan-400 opacity-60">
              {weatherData?.main?.humidity !== undefined
                ? `[HUM: ${weatherData.main.humidity}%]`
                : "[HUM: 80%]"}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SECTION 3 — PLANT CARE SYSTEM                         */}
      {/* ===================================================== */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-16 items-center">
          {/* ---------------------------------------- */}
          {/* LEFT — NEURAL VISUALIZATION              */}
          {/* ---------------------------------------- */}
          <div className="relative h-[500px] flex items-center justify-center">
            {/* Nodes */}
            {[...Array(20)].map((_, i) => {
              const angle = (i / 20) * Math.PI * 2;
              const radius = 180;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.div
                  key={`node-${i}`}
                  className="absolute w-4 h-4 rounded-full bg-purple-400"
                  style={{
                    left: "50%",
                    top: "50%",
                    marginLeft: x,
                    marginTop: y,
                    boxShadow: "0 0 10px #8800ff",
                  }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              );
            })}

            {/* Connections */}
            <svg className="absolute inset-0 w-full h-full">
              {[...Array(15)].map((_, i) => {
                const start = Math.floor(Math.random() * 20);
                const end = Math.floor(Math.random() * 20);
                const startAngle = (start / 20) * Math.PI * 2;
                const endAngle = (end / 20) * Math.PI * 2;
                const radius = 180;

                return (
                  <motion.line
                    key={`line-${i}`}
                    stroke="#8800ff"
                    strokeWidth="1"
                    opacity="0.3"
                    style={{
                      x1: `calc(50% + ${Math.cos(startAngle) * radius}px)`,
                      y1: `calc(50% + ${Math.sin(startAngle) * radius}px)`,
                      x2: `calc(50% + ${Math.cos(endAngle) * radius}px)`,
                      y2: `calc(50% + ${Math.sin(endAngle) * radius}px)`,
                    }}
                    animate={{ opacity: [0.1, 0.5, 0.1] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                );
              })}
            </svg>

            {/* Core */}
            <motion.div
              className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-400/50 to-purple-600/50 flex items-center justify-center border-2 border-purple-400/50"
              animate={{
                boxShadow: [
                  "0 0 20px #8800ff",
                  "0 0 40px #8800ff",
                  "0 0 20px #8800ff",
                ],
                scale: [1, 1.05, 1],
              }}
              transition={{
                boxShadow: { duration: 2, repeat: Infinity },
                scale: { duration: 3, repeat: Infinity },
              }}
            >
              <Sprout className="w-16 h-16 text-white" />
            </motion.div>

            {/* Scan Line */}
            <motion.div
              className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
              animate={{ y: [-250, 250], opacity: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>

          {/* ---------------------------------------- */}
          {/* RIGHT — TEXT CONTENT                     */}
          {/* ---------------------------------------- */}
          <div>
            <motion.div
              className="inline-block px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/30 mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <span className="font-mono text-purple-400 tracking-widest">
                03 / PLANT CARE
              </span>
            </motion.div>

            <motion.h2
              className="text-6xl mb-6 tracking-wider"
              style={{
                background: "linear-gradient(to right, #8800ff, #ff00ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "0.2em",
              }}
            >
              PLANT CARE SYSTEM
            </motion.h2>

            <motion.p className="text-xl text-gray-400 mb-8 leading-relaxed">
              The CNN model detects your plant species, and the chatbot integrates
              image diagnostics with live weather details to give accurate remedies
              and growth guidance.
            </motion.p>

            <motion.div className="flex gap-4">
              <div className="px-6 py-3 bg-purple-500/5 border border-purple-500/30 rounded-lg">
                <div className="font-mono text-purple-400">1M+</div>
                <div className="text-sm text-gray-500">Data Points</div>
              </div>
              <div className="px-6 py-3 bg-purple-500/5 border border-purple-500/30 rounded-lg">
                <div className="font-mono text-purple-400">AI</div>
                <div className="text-sm text-gray-500">Powered</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SECTION 4 — CHAT WITH VRIKZO                          */}
      {/* ===================================================== */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-7xl w-full text-center">
          {/* ---------------------------------------- */}
          {/* Floating UI Elements                     */}
          {/* ---------------------------------------- */}
          <div className="relative h-[500px] flex items-center justify-center mb-16">
            {[...Array(8)].map((_, i) => {
              const positions = [
                { x: -200, y: -150 },
                { x: 200, y: -120 },
                { x: -180, y: 80 },
                { x: 180, y: 100 },
                { x: -100, y: -50 },
                { x: 120, y: -80 },
                { x: -150, y: 150 },
                { x: 150, y: 160 },
              ];

              return (
                <motion.div
                  key={`bubble-${i}`}
                  className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 border border-emerald-400/30 flex items-center justify-center"
                  style={{
                    left: "50%",
                    top: "50%",
                    marginLeft: positions[i].x,
                    marginTop: positions[i].y,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  <MessageCircle className="w-6 h-6 text-emerald-400" />
                </motion.div>
              );
            })}

            {/* Center Core */}
            <motion.div
              className="relative w-48 h-48 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-cyan-400"
              animate={{
                boxShadow: [
                  "0 0 40px rgba(0,255,136,0.4)",
                  "0 0 60px rgba(0,230,255,0.6)",
                  "0 0 40px rgba(0,255,136,0.4)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                className="w-full h-full rounded-full border-4 border-white/20 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <MessageCircle className="w-24 h-24 text-white" />
              </motion.div>
            </motion.div>

            {/* Waves */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`wave-${i}`}
                className="absolute rounded-full border-2 border-emerald-400/30"
                style={{ width: "200px", height: "200px" }}
                animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 1.3,
                }}
              />
            ))}
          </div>

          {/* ---------------------------------------- */}
          {/* CHAT LABEL & TEXT                         */}
          {/* ---------------------------------------- */}
          <motion.div
            className="inline-block px-4 py-2 mb-6 rounded-full bg-emerald-500/10 border border-emerald-400/30"
          >
            <span className="font-mono text-emerald-400 tracking-widest">
              04 / AI ASSISTANT
            </span>
          </motion.div>

          <motion.h2
            className="text-7xl mb-6 tracking-wider"
            style={{
              background: "linear-gradient(90deg,#00ff88,#00e6ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            LET'S CHAT WITH VRIKZO
          </motion.h2>

          <motion.p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Get instant answers from our AI-powered plant care expert. Real-time
            assistance for all your botanical questions.
          </motion.p>

          {/* ---------------------------------------- */}
          {/* CHAT BUTTON                                */}
          {/* ---------------------------------------- */}
          <motion.button
            className="relative px-12 py-5 rounded-full overflow-hidden font-mono tracking-widest bg-gradient-to-br from-emerald-500 to-cyan-500"
            onClick={() => onOpenChatbot?.()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <span className="relative text-black flex items-center gap-3">
              <MessageCircle className="w-5 h-5" />
              START CONVERSATION
            </span>
          </motion.button>

          {/* Energy Line */}
          <motion.div
            className="mt-16 h-0.5 max-w-4xl mx-auto rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, #00ff88, #00e6ff, transparent)",
            }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </section>

      {/* ===================================================== */}
      {/* SECTION 5 — CALL TO ACTION                            */}
      {/* ===================================================== */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-6xl w-full text-center">
          {/* ---------------------------------------- */}
          {/* VISUAL GRID                               */}
          {/* ---------------------------------------- */}
          <div className="relative h-[600px] flex items-center justify-center mb-16">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`ring-${i}`}
                className="absolute rounded-full border"
                style={{
                  width: `${120 + i * 80}px`,
                  height: `${120 + i * 80}px`,
                  borderColor: [
                    "#00ff88",
                    "#00e6ff",
                    "#8800ff",
                  ][i % 3],
                  opacity: 0.3,
                }}
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: i % 2 === 0 ? 360 : -360,
                }}
                transition={{
                  scale: { duration: 3, repeat: Infinity },
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                }}
              />
            ))}

            {/* Energy Beams */}
            {[...Array(12)].map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;

              return (
                <motion.div
                  key={`beam-${i}`}
                  className="absolute w-1 h-40 origin-bottom"
                  style={{
                    background: `linear-gradient(to top, ${
                      ["#00ff88", "#00e6ff", "#8800ff"][i % 3]
                    }, transparent)`,
                    left: "50%",
                    bottom: "50%",
                    transform: `rotate(${(i / 12) * 360}deg)`,
                  }}
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              );
            })}

            {/* Center Core */}
            <motion.div
              className="relative w-40 h-40 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500 via-cyan-500 to-purple-500"
              animate={{
                boxShadow: [
                  "0 0 40px #00ff88",
                  "0 0 60px #00e6ff",
                  "0 0 40px #8800ff",
                ],
                rotate: 360,
              }}
              transition={{
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                boxShadow: { duration: 3, repeat: Infinity },
              }}
            >
              <Zap className="w-20 h-20 text-white" />
            </motion.div>
          </div>

          {/* ---------------------------------------- */}
          {/* CTA TEXT                                   */}
          {/* ---------------------------------------- */}
          <motion.h2
            className="text-7xl mb-8 tracking-wider"
            style={{
              background:
                "linear-gradient(90deg,#00ff88,#00e6ff,#8800ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.15em",
            }}
          >
            GROW WITH VRIKZO
          </motion.h2>

          <motion.p
            className="text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            Your queries are processed into a well-organized format and delivered
            right to your inbox.
          </motion.p>

          {/* ---------------------------------------- */}
          {/* CTA BUTTON                                */}
          {/* ---------------------------------------- */}
          <motion.button
            onClick={() => setShowLoginDialog(true)}
            className="group relative px-16 py-6 text-2xl rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 text-white tracking-widest overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ["-200%", "200%"] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <span className="relative">ACTIVATE NOW</span>
          </motion.button>

          <motion.div
            className="mt-16 h-0.5 max-w-4xl mx-auto rounded-full"
            style={{
              background:
                "linear-gradient(90deg,transparent,#00ff88,#00e6ff,#8800ff,transparent)",
            }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </section>

      {/* ===================================================== */}
      {/* LOGIN DIALOG                                           */}
      {/* ===================================================== */}
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  );
}
