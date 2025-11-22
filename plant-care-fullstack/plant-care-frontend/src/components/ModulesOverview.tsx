import { motion } from 'motion/react';
import { CloudSun, Camera, MessageCircle, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Module {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const modules: Module[] = [
  {
    icon: <CloudSun className="w-8 h-8" />,
    title: 'Weather Insights',
    description: 'Real-time weather data and forecasts tailored to your plants\' needs',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: <Camera className="w-8 h-8" />,
    title: 'Image Diagnosis',
    description: 'Instant plant health analysis through AI-powered image recognition',
    color: 'from-emerald-500 to-green-500'
  },
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: 'AI Chatbot',
    description: 'Get personalized care advice from our intelligent assistant',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    title: 'Care Scheduler',
    description: 'Never miss watering or feeding with smart reminders',
    color: 'from-orange-500 to-red-500'
  }
];

export function ModulesOverview() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById('modules');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="modules" className="py-24 px-6 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* UPDATED */}
          <h2 className="text-4xl font-bold text-white mb-4">
            Powerful Features for Plant Lovers
          </h2>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to keep your plants thriving, all in one place
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module, index) => (
            <motion.div
              key={module.title}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 h-full hover:border-emerald-500/50 transition-all duration-300 overflow-hidden">
                
                <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${module.color} mb-4`}>
                    <div className="text-white">
                      {module.icon}
                    </div>
                  </div>

                  {/* UPDATED */}
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {module.title}
                  </h3>

                  <p className="text-gray-400">
                    {module.description}
                  </p>
                </div>

                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
