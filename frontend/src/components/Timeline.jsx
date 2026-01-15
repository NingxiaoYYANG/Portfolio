import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const experienceTimeline = [
  {
    year: '2024–Present',
    title: 'Academic Tutor (C++ & Rust)',
    company: 'UNSW · School of Engineering · Sydney, AU',
    impact: 'Run weekly labs and code reviews; help cohorts build safer C++/Rust systems.',
    type: 'work',
    description:
      'Tutor for C++ and Rust: instruct students in designing, building, and testing programs; guide them toward modern, widely-used practices.',
    responsibilities: [
      'Run weekly labs and explain core C++/Rust concepts with concrete examples.',
      'Perform code reviews and help students improve correctness and readability.',
      'Explain Rust ownership/borrowing and how it prevents data races in concurrent code.',
    ],
    technologies: ['C++', 'Rust', 'Code Review', 'Concurrency'],
  },
  {
    year: '2024',
    title: 'Full-stack Web Developer (Contract)',
    company: 'Jo-en Media (Client) · Sydney, AU',
    impact: 'Delivered a React + Flask marketing site into production with Docker and hosting.',
    type: 'work',
    description:
      'Built and shipped a production website with React + Flask; containerised the backend with Docker and deployed via Firebase Hosting.',
    responsibilities: [
      'Implemented enquiry-to-email backend workflow used by real clients.',
      'Worked with a designer to deliver UI to spec and responsive behaviour.',
      'Containerised backend with Docker and shipped the stack into production.',
    ],
    technologies: ['React', 'Flask', 'Docker', 'Firebase Hosting', 'REST APIs'],
  },
  {
    year: '2023–2024',
    title: 'Full-stack Web Developer (Contract)',
    company: 'Australian Chinese Scholars Association · Sydney, AU',
    impact: 'Built and deployed an event platform (auth, profiles, admin flows) used by students.',
    type: 'work',
    description:
      'Delivered an event management platform with authentication, profiles, and admin/user event workflows on GoDaddy hosting.',
    responsibilities: [
      'Built event management flows for both admin and student users.',
      'Implemented authentication and profile features for members.',
      'Deployed and supported stability during production handover.',
    ],
    technologies: ['React', 'Flask', 'SQL', 'phpMyAdmin', 'GoDaddy Hosting'],
  },
  {
    year: '2021–2024',
    title: 'Bachelor of Computer Science',
    company: 'UNSW · Sydney, AU',
    impact: 'Key courses: Data Structures, Databases, Advanced C++, Rust, Web Front-End.',
    type: 'education',
    description:
      'Bachelor of Computer Science at UNSW, focusing on core CS fundamentals and modern programming tooling.',
    responsibilities: [
      'Completed coursework in data structures, algorithms, and database systems.',
      'Studied advanced C++ and modern Rust for systems-level programming.',
      'Built web front-end projects using modern web technologies.',
    ],
    technologies: ['Data Structures', 'Algorithms', 'Databases', 'C++', 'Rust', 'Web Front-End'],
  },
];

export default function Timeline() {
  const [expandedIndices, setExpandedIndices] = useState(new Set());

  const toggleExpanded = (index) => {
    setExpandedIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-bold mb-8 text-gradient">Experience</h1>
          <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-700" />

        {experienceTimeline.map((item, index) => {
          const isExpanded = expandedIndices.has(index);
          return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="relative pl-20 pb-6"
            onClick={() => toggleExpanded(index)}
          >
            {/* Dot */}
            <div className="absolute left-6 top-2 w-4 h-4 bg-blue-500 rounded-full border-4 border-gray-900 z-10" />
            
            {/* Content */}
            <div className="bg-gray-800 p-5 rounded-lg hover:bg-gray-750 transition-colors border border-gray-700 cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className="text-blue-400 font-semibold text-sm sm:text-base">{item.year}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs sm:text-sm ${
                        item.type === 'work'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-purple-500/20 text-purple-400'
                      }`}
                    >
                      {item.type === 'work' ? 'Work' : 'Education'}
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                  </div>
                  {item.company && (
                    <p className="text-blue-400 text-xs sm:text-sm mb-1">{item.company}</p>
                  )}
                  {item.impact && (
                    <p className="text-gray-300 text-xs sm:text-sm">
                      {item.impact}
                    </p>
                  )}
                </div>
                <motion.span
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  className="text-gray-400 text-lg mt-1"
                >
                  ▼
                </motion.span>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden mt-3"
                  >
                    <div className="pt-3 border-t border-gray-700">
                      {item.description && (
                        <p className="text-gray-300 text-sm mb-3">
                          {item.description}
                        </p>
                      )}
                      {item.responsibilities && (
                        <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                          {item.responsibilities.map((resp) => (
                            <li key={resp}>{resp}</li>
                          ))}
                        </ul>
                      )}
                      {item.technologies && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-blue-500/15 text-blue-300 rounded-full text-xs border border-blue-500/30"
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
            </div>
          </motion.div>
        );
        })}
          </div>
      </motion.div>
    </div>
  );
}
