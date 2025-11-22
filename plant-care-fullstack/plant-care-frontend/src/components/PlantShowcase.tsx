import { motion } from 'motion/react';
import { Droplets, Sun, Thermometer, Wind } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';


const plants = [
  {
    name: 'HIBISCUS',
    scientificName: 'Hibiscus rosa-sinensis',
    image: 'https://images.unsplash.com/photo-1611441922932-24868bf6391a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    color: '#ed5214ff',
    stats: { water: '85%', light: '90%', temp: '28°C', health: '98%' },
  },
  {
    name: 'ALOE VERA',
    scientificName: 'Aloe barbadensis',
    image: 'https://images.unsplash.com/photo-1709716341475-323bdcbeb637?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    color: '#00ff88',
    stats: { water: '45%', light: '75%', temp: '24°C', health: '95%' },
  },
  {
    name: 'TOMATO',
    scientificName: 'Solanum lycopersicum',
    image: 'https://images.unsplash.com/photo-1596199050105-6d5d32222916?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    color: '#c42222ff',
    stats: { water: '75%', light: '95%', temp: '26°C', health: '99%' },
  },
];

export function PlantShowcase() {
  return (
    <section className="relative min-h-screen py-20 px-6 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/30 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="font-mono text-emerald-400 tracking-widest">BIOTECH COLLECTION</span>
          </motion.div>

          <h2
            className="text-6xl mb-4 tracking-wider"
            style={{
              background: 'linear-gradient(90deg, #00ff88, #00e6ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.2em',
            }}
          >
            SUPPORTED SPECIES
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Accepts 3 plant species as displayed below! and give your plants the best care with tailored advice. 
          </p>
        </motion.div>

        {/* Plants Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {plants.map((plant, index) => (
            <motion.div
              key={plant.name}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm hover:border-white/30 transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              {/* Plant Image */}
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={plant.image}
                  alt={plant.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                {/* Scan Line Effect */}
                <motion.div
                  className="absolute left-0 w-full h-0.5"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${plant.color}, transparent)`,
                  }}
                  animate={{
                    y: [0, 256, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                />

                {/* Health Badge */}
                <div
                  className="absolute top-3 right-3 px-3 py-1 rounded-full backdrop-blur-md border text-xs font-mono"
                  style={{
                    borderColor: plant.color,
                    backgroundColor: `${plant.color}20`,
                    color: plant.color,
                  }}
                >
                  {plant.stats.health}
                </div>
              </div>

              {/* Plant Info */}
              <div className="p-5">
                <h3
                  className="text-xl mb-1 tracking-widest"
                  style={{ color: plant.color }}
                >
                  {plant.name}
                </h3>
                <p className="text-xs text-gray-500 mb-4 italic">{plant.scientificName}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-xs text-gray-500">Water</div>
                      <div className="text-sm font-mono text-cyan-400">{plant.stats.water}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                    <Sun className="w-4 h-4 text-yellow-400" />
                    <div>
                      <div className="text-xs text-gray-500">Light</div>
                      <div className="text-sm font-mono text-yellow-400">{plant.stats.light}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                    <Thermometer className="w-4 h-4 text-orange-400" />
                    <div>
                      <div className="text-xs text-gray-500">Temp</div>
                      <div className="text-sm font-mono text-orange-400">{plant.stats.temp}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                    <Wind className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-xs text-gray-500">Air</div>
                      <div className="text-sm font-mono text-emerald-400">Good</div>
                    </div>
                  </div>
                </div>    
              </div>

              {/* Hover Glow Effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${plant.color}20, transparent 70%)`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Energy Grid Visualization */}
        <motion.div
          className="mt-16 h-px w-full"
          style={{
            background: 'linear-gradient(90deg, transparent, #00ff88, #00e6ff, #8800ff, transparent)',
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
    </section>
  );
}
