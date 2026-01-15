import { motion } from 'framer-motion';
import { useRecruiterMode } from '../contexts/RecruiterModeContext';

export default function GameTeaser() {
  const { openPlayMode } = useRecruiterMode();

  return (
    <section id="play" className="scroll-mt-28 border-t border-gray-800/60 bg-gray-950 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-gray-400 mb-4 text-base md:text-lg">
            Play Mini Game (optional)
          </p>
          <motion.button
            onClick={openPlayMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl font-medium text-sm md:text-base transition-all border border-gray-700/50 hover:border-blue-500/50 bg-gray-900/50 hover:bg-gray-800/70 text-gray-300 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-gray-950"
          >
            Enter Play Mode →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
