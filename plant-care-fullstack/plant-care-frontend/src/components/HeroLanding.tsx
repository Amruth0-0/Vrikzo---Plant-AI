import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HeroLanding() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">

      {/* ---------------- BACKGROUND IMAGE ---------------- */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Futuristic plants"
          className="w-full h-full object-cover opacity-40"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black via-emerald-950/30 to-black" />
      </div>

      {/* ---------------- FLOATING LEAVES ---------------- */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`leaf-${i}`}
            className="absolute w-12 h-12 opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-emerald-500"
            >
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 1 10 20c3.26 0 4-2 4-2s2 2 4 2a4.49 4.49 0 0 1 3.29-.7l1 2.3l1.89-.66C22.1 16.17 20 10 11 8V5l6-4l-6 4l-6-4z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* ---------------- GRADIENT ORBS ---------------- */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      {/* ---------------- CONTENT ---------------- */}
      <div className="relative z-10 text-center px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* AI Badge */}
          <motion.div
            className="inline-block mb-8 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-400/50 backdrop-blur-md relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <span className="relative text-emerald-300 tracking-wider">
              ⚡ AI-POWERED INTELLIGENCE
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="mb-6 tracking-wider"
            style={{
              fontSize: "clamp(4rem, 12vw, 10rem)",
              fontWeight: 900,
              lineHeight: 0.9,
              background: "linear-gradient(to bottom, #ffffff, #6ee7b7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 0 80px rgba(110, 231, 183, 0.3)",
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            VRIKZO
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            The Future of Smart Plant Care Technology
          </motion.p>

          {/* CTA Button */}
          <motion.button
            className="group relative px-12 py-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-emerald-400"
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(110, 231, 183, 0.4), transparent 70%)",
                filter: "blur(20px)",
              }}
            />

            <span className="relative text-xl tracking-widest">
              LET'S GET STARTED
            </span>
          </motion.button>

          {/* Scroll to Explore */}
          <motion.p
            onClick={() =>
              document.getElementById("disease-detection")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="mt-8 text-emerald-400/60 tracking-wider cursor-pointer hover:text-emerald-300 transition"
          >
            SCROLL TO EXPLORE
          </motion.p>
        </motion.div>
      </div>

      {/* ---------------- SCROLL INDICATOR ---------------- */}
      <motion.div
        onClick={() =>
          document.getElementById("disease-detection")?.scrollIntoView({
            behavior: "smooth",
          })
        }
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-emerald-400/50 rounded-full flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* ---------------- AMBIENT LIGHT ---------------- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-emerald-500/5 to-transparent" />
      </div>
    </section>
  );
}
