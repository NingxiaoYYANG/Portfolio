import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function ExperienceCard({ experience, index }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-750 transition-colors border border-gray-700 hover:border-blue-500/50"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="text-2xl font-bold">{experience.title}</h3>
            <span className={`px-3 py-1 rounded text-sm ${
              experience.type === 'work' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'
            }`}>
              {experience.type === 'work' ? 'Work' : 'Education'}
            </span>
          </div>
          <p className="text-blue-400 mb-1">{experience.company}</p>
          <p className="text-gray-400 text-sm">{experience.period}</p>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="text-gray-400 text-2xl"
        >
          ▼
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-4"
          >
            <div className="pt-4 border-t border-gray-700">
              <p className="text-gray-300 mb-4">{experience.description}</p>
              {experience.responsibilities && (
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  {experience.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              )}
              {experience.technologies && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {experience.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
