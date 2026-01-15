import { motion } from 'framer-motion';
import { useRecruiterMode } from '../contexts/RecruiterModeContext';

export default function PathSelector() {
  const { recruiterMode, setRecruiterMode, openPlayMode } = useRecruiterMode();

  const handleRecruiterMode = () => {
    // Behave like the navbar toggle: simply ensure Recruiter Mode is ON
    if (!recruiterMode) {
      setRecruiterMode(true);
    }
  };

  const handlePlayMode = () => {
    // Open Play Mode and scroll to the mini game section
    openPlayMode();
  };

  return (
    <section id="path" className="scroll-mt-28 border-t border-gray-800/60 bg-gray-900 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Choose your path
          </h2>
          <p className="text-gray-400 mb-8 text-sm md:text-base">
            All core portfolio content is directly accessible — playing the mini game is completely optional.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              onClick={handleRecruiterMode}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-[0_14px_40px_rgba(37,99,235,0.55)] hover:shadow-[0_18px_50px_rgba(37,99,235,0.65)] focus:outline-none focus:ring-2 focus:ring-blue-400/70 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Recruiter Mode →
            </motion.button>

            <motion.button
              onClick={handlePlayMode}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all border border-white/25 hover:border-white/50 bg-slate-900/40 hover:bg-slate-900/70 text-slate-50/95 shadow-[0_10px_30px_rgba(15,23,42,0.85)] focus:outline-none focus:ring-2 focus:ring-slate-100/40 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Play Mode →
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
