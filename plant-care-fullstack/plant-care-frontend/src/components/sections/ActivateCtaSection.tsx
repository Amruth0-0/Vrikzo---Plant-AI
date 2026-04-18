// components/sections/ActivateCtaSection.tsx
import { motion } from "motion/react";
import { Zap } from "lucide-react";

interface Props {
  onActivate: () => void;
}

export function ActivateCtaSection({ onActivate }: Props) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-10 md:py-20 overflow-hidden">
      <div className="max-w-6xl w-full text-center">
        {/* Visual grid */}
        <div className="relative h-[600px] flex items-center justify-center mb-16">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute rounded-full border"
              style={{
                width: `${120 + i * 80}px`,
                height: `${120 + i * 80}px`,
                borderColor: ["#00ff88", "#00e6ff", "#8800ff"][i % 3],
                opacity: 0.3,
              }}
              animate={{ scale: [1, 1.05, 1], rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{
                scale: { duration: 3, repeat: Infinity },
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              }}
            />
          ))}

          {/* Energy beams */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`beam-${i}`}
              className="absolute w-1 h-40 origin-bottom"
              style={{
                background: `linear-gradient(to top, ${["#00ff88", "#00e6ff", "#8800ff"][i % 3]}, transparent)`,
                left: "50%", bottom: "50%",
                transform: `rotate(${(i / 12) * 360}deg)`,
              }}
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}

          {/* Center core */}
          <motion.div
            className="relative w-40 h-40 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500 via-cyan-500 to-purple-500"
            animate={{
              boxShadow: ["0 0 40px #00ff88", "0 0 60px #00e6ff", "0 0 40px #8800ff"],
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

        <motion.h2
          className="text-4xl md:text-5xl lg:text-7xl mb-8 tracking-wider"
          style={{
            background: "linear-gradient(90deg,#00ff88,#00e6ff,#8800ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.15em",
          }}
        >
          GROW WITH VRIKZO
        </motion.h2>

        <motion.p className="text-lg md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto px-4">
          Your queries are processed into a well-organized format and delivered right to your inbox.
        </motion.p>

        <motion.button
          onClick={onActivate}
          className="group relative px-10 md:px-16 py-4 md:py-6 text-xl md:text-2xl rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 text-white tracking-widest overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-200%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <span className="relative">ACTIVATE NOW</span>
        </motion.button>

        <motion.div
          className="mt-16 h-0.5 max-w-4xl mx-auto rounded-full"
          style={{ background: "linear-gradient(90deg,transparent,#00ff88,#00e6ff,#8800ff,transparent)" }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </section>
  );
}
