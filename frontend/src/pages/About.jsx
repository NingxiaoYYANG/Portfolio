import { motion } from 'framer-motion';
import SkillTree from '../components/SkillTree';
import Timeline from '../components/Timeline';
import Achievements from '../components/Achievements';
import PhotoCarousel from '../components/PhotoCarousel';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-bold mb-8 text-gradient">About Me</h1>
        
        {/* Personal Introduction + Photo area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16 md:grid md:grid-cols-2 gap-10 items-start"
        >
          {/* Left: text + info cards */}
          <div>
            <p className="text-xl text-gray-300 mb-6 max-w-3xl leading-relaxed">
              I’m Ningxiao Yang, a Sydney-based developer focused on full-stack development,
              backend & deployment, and game development. I build production web apps with
              React + Flask, and I care a lot about quality through code review, testing, and CI/CD.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">Areas of Specialisation</h3>
                <ul className="text-gray-300 space-y-1">
                  <li>Full-stack Development</li>
                  <li>Backend & Deployment</li>
                  <li>Game Development</li>
                </ul>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">Languages</h3>
                <ul className="text-gray-300 space-y-1">
                  <li>English (Fluent)</li>
                  <li>Mandarin (Mother Tongue)</li>
                </ul>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:col-span-2">
                <h3 className="font-semibold text-white mb-2">Links</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href="https://www.linkedin.com/in/ningxiao-yang-46bb99213/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded bg-gray-900/50 border border-gray-700 text-gray-200 hover:border-blue-500/60 hover:text-white transition-colors"
                  >
                    LinkedIn · in/ningxiao-yang-46bb99213
                  </a>
                  <a
                    href="https://github.com/NingxiaoYYANG"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded bg-gray-900/50 border border-gray-700 text-gray-200 hover:border-blue-500/60 hover:text-white transition-colors"
                  >
                    GitHub · @NingxiaoYYANG
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: photo carousel */}
          <div className="mt-10 md:mt-0 flex justify-center md:justify-end">
            <PhotoCarousel />
          </div>
        </motion.div>

        {/* Skills Section */}
        <Achievements />

        <SkillTree />

        {/* Timeline Section */}
        <Timeline />
      </motion.div>
    </div>
  );
}
