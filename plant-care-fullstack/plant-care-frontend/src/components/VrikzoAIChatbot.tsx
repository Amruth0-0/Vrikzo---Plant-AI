// VrikzoAIChatbot.tsx
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Image as ImageIcon, Sparkles, Leaf } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ReminderButton } from "./ReminderButton";

interface VrikzoAIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  uploadedImage?: string | null;
}

interface DiagnosisBlock {
  plant: string;
  condition: string;
  confidence: number;
  weather: {
    temperature: number;
    humidity: number;
    condition: string;
    city: string;
  };
}

interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
  image?: string;
  timestamp: Date;
  diagnosis?: DiagnosisBlock | null;
}

export function VrikzoAIChatbot({
  isOpen,
  onClose,
  uploadedImage,
}: VrikzoAIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      text: "Hi! I'm your PlantCare AI assistant 🌱. How can I help your plants today?",
      timestamp: new Date(),
    },
  ]);

  const [lastBotReply, setLastBotReply] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showTransition, setShowTransition] = useState(true);
  

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );

  // 🌿 Reset soft-block AND RESET CHAT WHEN CLOSED
  const [softBlocked, setSoftBlocked] = useState(false);
  useEffect(() => {
    if (!isOpen) {
      setSoftBlocked(false);

      // 🔥 UPDATED — FULL RESET OF CHAT WHEN CLOSED
      setMessages([
        {
          id: "welcome",
          type: "bot",
          text: "Hi! I'm your PlantCare AI assistant 🌱. How can I help your plants today?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  // disable background scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setShowTransition(false), 1200);
      return () => clearTimeout(t);
    }
    setShowTransition(true);
  }, [isOpen]);

  const scrollDown = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollDown, [messages, isTyping]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    let didCancel = false;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (didCancel) return;
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      () => {},
      { enableHighAccuracy: true, timeout: 7000 }
    );
    return () => {
      didCancel = true;
    };
  }, []);

  const fetchWeatherNormalized = async () => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    if (!apiKey) return null;

    try {
      const url = coords
        ? `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`
        : `https://api.openweathermap.org/data/2.5/weather?q=India&appid=${apiKey}&units=metric`;

      const res = await fetch(url);
      if (!res.ok) return null;

      const data = await res.json();
      return {
        temperature: data.main?.temp ?? 0,
        humidity: data.main?.humidity ?? 0,
        condition: data.weather?.[0]?.description ?? "Unknown",
        city: data.name ?? "Unknown",
      };
    } catch {
      return null;
    }
  };

  const formatStructuredReply = (obj: any) => {
    if (!obj) return "";

    return [
      obj.observation ? `🌞 Observation:\n${obj.observation}` : null,
      obj.remedy ? `💊 Remedy:\n${obj.remedy}` : null,
      obj.careTip ? `🌱 Care Tip:\n${obj.careTip}` : null,
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  const askFollowUp = (prevMsgs: Message[]) => {
    if (softBlocked) return prevMsgs;

    const followUp: Message = {
      id: Date.now().toString() + "-follow",
      type: "bot",
      text: "Would you like more advice?",
      timestamp: new Date(),
    };

    return [...prevMsgs, followUp];
  };

  const detectSoftBlock = (text: string) => {
    const t = text.toLowerCase();
    if (
      t.includes("no") ||
      t.includes("nope") ||
      t.includes("nah") ||
      t.includes("not now") ||
      t.includes("thank") ||
      t.includes("thanks")
    ) {
      setSoftBlocked(true);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-soft",
          type: "bot",
          text: "Sure! If you need anything later, I’m here 🌱",
          timestamp: new Date(),
        },
      ]);

      return true;
    }
    return false;
  };

  const fetchGeminiResponse = async (
    query: string,
    fullChat: Message[],
    extraWeather?: {
      temperature?: number;
      humidity?: number;
      condition?: string;
      city?: string;
    } | null
  ) => {
    setIsTyping(true);

    try {
      const API_URL =
        (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";

      let weatherSnippet = "";

      if (extraWeather) {
        weatherSnippet = `\n\nCurrent weather: ${
          extraWeather.temperature ?? "N/A"
        }°C, ${extraWeather.condition ?? "Unknown"}, humidity ${
          extraWeather.humidity ?? "N/A"
        }% in ${extraWeather.city ?? "your area"}.`;
      } else {
        const weather = await fetchWeatherNormalized();
        if (weather) {
          weatherSnippet = `\n\nCurrent weather: ${weather.temperature}°C, ${weather.condition}, humidity ${weather.humidity}% in ${weather.city}.`;
        }
      }

      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${query}${weatherSnippet}`,
          history: [], // 🔥 UPDATED — STOP SENDING HISTORY
          location: coords ? `${coords.lat},${coords.lon}` : "Unknown",
        }),
      });

      const data = await res.json().catch(() => ({ reply: "" }));

      const botMsg: Message = {
        id: Date.now().toString(),
        type: "bot",
        text:
          typeof data.reply === "object"
            ? formatStructuredReply(data.reply)
            : data.reply || "",
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const newList = [...prev, botMsg];

        const lastBeforeBot = prev[prev.length - 1];
        const wasDiagnosis = lastBeforeBot && lastBeforeBot.text === "__DIAG_CARD__";

        if (wasDiagnosis) return askFollowUp(newList);
        setLastBotReply(botMsg.text);
        return newList;
      });
    } finally {
      setIsTyping(false);
    }
    
  };

  // diagnosis event listener
  useEffect(() => {
    const handleDiagnosisEvent = async (e: any) => {
      try {
        const detail = e?.detail || {};

        const crop =
          detail.cropName || detail.crop || "Unknown Plant";

        const diseaseName =
          detail.diseaseName || detail.disease || "Unknown Condition";

        const confidence =
          detail.confidence || detail.confidence_score || 0;

        const incomingWeather = detail.weather;

        let normalizedWeather = null;

        if (incomingWeather?.main) {
          normalizedWeather = {
            temperature: incomingWeather.main?.temp ?? 0,
            humidity: incomingWeather.main?.humidity ?? 0,
            condition: incomingWeather.weather?.[0]?.description ?? "Unknown",
            city: incomingWeather.name ?? "Unknown",
          };
        } else {
          const w = await fetchWeatherNormalized();
          normalizedWeather =
            w || { temperature: 0, humidity: 0, condition: "Unknown", city: "Unknown" };
        }

        const diagMsg: Message = {
          id: Date.now().toString(),
          type: "bot",
          text: "__DIAG_CARD__",
          image: detail.imageUrl,
          timestamp: new Date(),
          diagnosis: {
            plant: crop,
            condition: diseaseName,
            confidence: Number(confidence),
            weather: normalizedWeather,
          },
        };

        setMessages((prev) => {
          const next = [...prev, diagMsg];
          (async () => {
            const prompt = `Detected ${diseaseName} on ${crop}. Provide remedies, causes, prevention and care tips.`;
            await fetchGeminiResponse(prompt, next, normalizedWeather);
          })();
          return next;
        });
      } catch {}
    };

    window.addEventListener("vrikzo_diagnosis", handleDiagnosisEvent);
    return () =>
      window.removeEventListener("vrikzo_diagnosis", handleDiagnosisEvent);
  }, [coords]);

  // upload image manually
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      text: "Here is an image for analysis.",
      image: previewUrl,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const predictUrl =
        (import.meta as any).env?.VITE_PREDICT_URL ||
        "http://127.0.0.1:8000/predict";

      const res = await fetch(predictUrl, { method: "POST", body: form });
      const result = await res.json();

      const crop =
        result.crop || result.cropName || result.plant || "Unknown Plant";

      const condition =
        result.condition || result.disease || result.label || "Unknown";

      const confidence =
        result.confidence ?? result.confidence_score ?? 0;

      const w = await fetchWeatherNormalized();
      const normalizedWeather =
        w || { temperature: 0, humidity: 0, condition: "Unknown", city: "Unknown" };

      const diagMsg: Message = {
        id: Date.now().toString(),
        type: "bot",
        text: "__DIAG_CARD__",
        image: previewUrl,
        timestamp: new Date(),
        diagnosis: {
          plant: crop,
          condition,
          confidence: Number(confidence),
          weather: normalizedWeather,
        },
      };

      setMessages((prev) => {
        const next = [...prev, diagMsg];

        (async () => {
          const prompt = `Detected ${condition} on ${crop}. Provide remedies, causes, preventive measures and care tips.`;
          await fetchGeminiResponse(prompt, next, normalizedWeather);
        })();

        return next;
      });
    } finally {
      setIsTyping(false);
    }
  };

  // homepage uploaded image
  useEffect(() => {
    if (!uploadedImage || showTransition) return;

    (async () => {
      const weather = await fetchWeatherNormalized();
      const normalizedWeather = weather
        ? {
            temperature: weather.temperature,
            humidity: weather.humidity,
            condition: weather.condition,
            city: weather.city,
          }
        : { temperature: 0, humidity: 0, condition: "Unknown", city: "Unknown" };

      const blob = await fetch(uploadedImage).then((r) => r.blob());
      const file = new File([blob], "homepage.jpg", { type: blob.type });

      const form = new FormData();
      form.append("file", file);

      const predictUrl =
        (import.meta as any).env?.VITE_PREDICT_URL ||
        "http://127.0.0.1:8000/predict";

      const res = await fetch(predictUrl, { method: "POST", body: form });
      const result = await res.json();

      const crop =
        result.crop || result.cropName || result.plant || "Unknown Plant";

      const condition =
        result.condition || result.disease || result.label || "Unknown";

      const confidence =
        result.confidence ?? result.confidence_score ?? 0;

      setMessages((prev) => {
        const diagMsg: Message = {
          id: Date.now().toString(),
          type: "bot",
          text: "__DIAG_CARD__",
          image: uploadedImage,
          timestamp: new Date(),
          diagnosis: {
            plant: crop,
            condition,
            confidence: Number(confidence),
            weather: normalizedWeather,
          },
        };

        const next = [...prev, diagMsg];

        (async () => {
          const prompt = `Detected ${condition} on ${crop}. Provide remedies, causes, preventive measures and care tips.`;
          await fetchGeminiResponse(prompt, next, normalizedWeather);
        })();

        return next;
      });
    })();
  }, [uploadedImage, showTransition]);

  // handle sending text
  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const trimmed = inputMessage.trim();

    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      text: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => {
      const next = [...prev, userMsg];

      if (detectSoftBlock(trimmed)) return next;

      (async () => {
        const w = await fetchWeatherNormalized();
        await fetchGeminiResponse(trimmed, next, w || null);
      })();

      return next;
    });

    setInputMessage("");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {showTransition ? (
        <motion.div
          key="transition"
          className="fixed inset-0 flex items-center justify-center bg-black text-white z-[10000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Sparkles className="w-16 h-16 text-emerald-400 animate-spin-slow" />
        </motion.div>
      ) : (
        <motion.div
          key="chatbot"
          className="fixed inset-0 z-[9999] flex flex-col bg-gradient-to-br from-[#0A0A1F] via-[#0F123D] to-[#1E293B] text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          <div className="relative px-6 py-4 border-b border-emerald-500/30 bg-black/40 backdrop-blur-lg flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <Leaf className="w-8 h-8 text-emerald-400" />
              <h1 className="text-xl font-mono tracking-wide">VrikZo AI</h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          <div className="relative flex-1 overflow-y-auto px-6 py-6 space-y-6 z-10">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                    msg.type === "user"
                      ? "bg-cyan-500/20 border border-cyan-400/30"
                      : "bg-white/10 border border-emerald-400/30"
                  }`}
                >
                  {msg.text === "__DIAG_CARD__" && msg.diagnosis ? (
                    <div>
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="diagnosis"
                          className="rounded-lg mb-3 w-full"
                        />
                      )}

                      <div className="text-lg font-semibold text-emerald-300">
                        🌱 {msg.diagnosis.plant}
                      </div>

                      <div className="text-md text-red-300 mt-1">
                        🚨 Condition: {msg.diagnosis.condition}
                      </div>

                      <div className="text-sm text-yellow-300 mt-1">
                        🎯 Confidence:{" "}
                        {Number(msg.diagnosis.confidence).toFixed(2)}%
                      </div>

                      <div className="mt-3 p-3 rounded-lg bg-black/30 border border-emerald-400/20">
                        <div className="text-emerald-300 font-semibold mb-1">
                          🌦 Weather Conditions
                        </div>
                        <div className="text-sm text-gray-200">
                          <br />
                          Temperature: {msg.diagnosis.weather.temperature}°C
                          <br />
                          Humidity: {msg.diagnosis.weather.humidity}%
                          <br />
                          Condition: {msg.diagnosis.weather.condition}
                        </div>
                      </div>

                      <div className="mt-4">
                        <ReminderButton 
                          plantName={msg.diagnosis.plant} 
                          remedyText={lastBotReply}/>
                     </div>
                    </div>
                  ) : (
                    <div className="text-sm whitespace-pre-line">
                      {typeof msg.text === "string"
                        ? msg.text
                        : JSON.stringify(msg.text, null, 2)}
                    </div>
                  )}

                  {msg.image && msg.text !== "__DIAG_CARD__" && (
                    <img
                      src={msg.image}
                      alt="user-upload"
                      className="rounded-lg mt-3 max-w-xs"
                    />
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="text-emerald-400 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-pulse" /> typing…
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="relative z-20 px-6 py-4 bg-black/50 border-t border-emerald-500/30 flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-full bg-white/5 border border-emerald-400/30"
            >
              <ImageIcon className="w-5 h-5 text-emerald-400" />
            </button>

            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask VrikZo anything…"
              className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-emerald-400/30"
            />

            <button
              onClick={handleSend}
              className="p-3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
