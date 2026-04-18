// components/sections/PlantCareSection.tsx
import { motion } from "motion/react";
import { Sprout } from "lucide-react";

export function PlantCareSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-16 items-center">
        {/* ---- LEFT — NEURAL VISUALIZATION ---- */}
        <div className="relative h-[500px] flex items-center justify-center">
          {/* Nodes */}
          {[...Array(20)].map((_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const radius = 180;
            return (
              <motion.div
                key={`node-${i}`}
                className="absolute w-4 h-4 rounded-full bg-purple-400"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: Math.cos(angle) * radius,
                  marginTop: Math.sin(angle) * radius,
                  boxShadow: "0 0 10px #8800ff",
                }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              />
            );
          })}

          {/* Connections */}
          <svg className="absolute inset-0 w-full h-full">
            {[...Array(15)].map((_, i) => {
              const start = Math.floor(Math.random() * 20);
              const end = Math.floor(Math.random() * 20);
              const radius = 180;
              const startAngle = (start / 20) * Math.PI * 2;
              const endAngle = (end / 20) * Math.PI * 2;
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
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                />
              );
            })}
          </svg>

          {/* Core */}
          <motion.div
            className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-400/50 to-purple-600/50 flex items-center justify-center border-2 border-purple-400/50"
            animate={{
              boxShadow: ["0 0 20px #8800ff", "0 0 40px #8800ff", "0 0 20px #8800ff"],
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

        {/* ---- RIGHT — TEXT CONTENT ---- */}
        <div>
          <motion.div
            className="inline-block px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/30 mb-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <span className="font-mono text-purple-400 tracking-widest">03 / PLANT CARE</span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl mb-6 tracking-wider"
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
            The CNN model detects your plant species, and the chatbot integrates image diagnostics
            with live weather details to give accurate remedies and growth guidance.
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
  );
}
