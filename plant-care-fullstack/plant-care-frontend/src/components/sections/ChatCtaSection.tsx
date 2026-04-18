// components/sections/ChatCtaSection.tsx
import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";

interface Props {
  onOpenChatbot?: () => void;
}

export function ChatCtaSection({ onOpenChatbot }: Props) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-10 md:py-20 overflow-hidden">
      <div className="max-w-7xl w-full text-center">
        {/* Floating bubbles */}
        <div className="relative h-[500px] flex items-center justify-center mb-16">
          {[...Array(8)].map((_, i) => {
            const positions = [
              { x: -200, y: -150 }, { x: 200, y: -120 },
              { x: -180, y: 80 },  { x: 180, y: 100 },
              { x: -100, y: -50 }, { x: 120, y: -80 },
              { x: -150, y: 150 }, { x: 150, y: 160 },
            ];
            return (
              <motion.div
                key={`bubble-${i}`}
                className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 border border-emerald-400/30 flex items-center justify-center"
                style={{
                  left: "50%", top: "50%",
                  marginLeft: positions[i].x,
                  marginTop: positions[i].y,
                }}
                animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
              >
                <MessageCircle className="w-6 h-6 text-emerald-400" />
              </motion.div>
            );
          })}

          {/* Center core */}
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

          {/* Ripple waves */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`wave-${i}`}
              className="absolute rounded-full border-2 border-emerald-400/30"
              style={{ width: "200px", height: "200px" }}
              animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 1.3 }}
            />
          ))}
        </div>

        {/* Text */}
        <motion.div className="inline-block px-4 py-2 mb-6 rounded-full bg-emerald-500/10 border border-emerald-400/30">
          <span className="font-mono text-emerald-400 tracking-widest">04 / AI ASSISTANT</span>
        </motion.div>

        <motion.h2
          className="text-4xl md:text-5xl lg:text-7xl mb-6 tracking-wider"
          style={{
            background: "linear-gradient(90deg,#00ff88,#00e6ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          LET'S CHAT WITH VRIKZO
        </motion.h2>

        <motion.p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed px-4">
          Get instant answers from our AI-powered plant care expert. Real-time assistance for
          all your botanical questions.
        </motion.p>

        <motion.button
          className="relative px-12 py-5 rounded-full overflow-hidden font-mono tracking-widest bg-gradient-to-br from-emerald-500 to-cyan-500"
          onClick={() => onOpenChatbot?.()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <span className="relative text-black flex items-center gap-3">
            <MessageCircle className="w-5 h-5" />
            START CONVERSATION
          </span>
        </motion.button>

        <motion.div
          className="mt-16 h-0.5 max-w-4xl mx-auto rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, #00ff88, #00e6ff, transparent)" }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </section>
  );
}
