import { motion } from 'framer-motion';
import SkillTree from '../components/SkillTree';
import Achievements from '../components/Achievements';
import PhotoCarousel from '../components/PhotoCarousel';
import { useRecruiterMode } from '../contexts/RecruiterModeContext';

export default function About() {
  const { recruiterMode, scrollToSection } = useRecruiterMode();

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
            {/* Headline + proof bullets */}
            <div className="mb-6 max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-3">
                Backend / Full‑stack engineer shipping real products.
              </h2>
              <ul className="space-y-2 text-sm sm:text-base text-gray-300">
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  <span>
                    Delivered React + Flask platforms for clients from brief → production handover.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  <span>
                    UNSW academic tutor (C++/Rust): labs, code reviews, ownership &amp; testing.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  <span>
                    Hackathon: built and demoed Web3 + AI product under tight deadline.
                  </span>
                </li>
              </ul>

              {recruiterMode && (
                <p className="mt-3 text-sm sm:text-base text-blue-200/90">
                  <span className="font-semibold text-blue-100">Focus:</span>{' '}
                  Backend/Full-stack roles now • Building toward game dev systems
                </p>
              )}
            </div>

            {/* Quick facts + CTA-style pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-500/15 text-blue-200 border border-blue-500/40 hover:bg-blue-500/25 hover:border-blue-400 transition-colors"
              >
                Open to: Backend / Full-stack
              </button>
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-800/70 text-gray-200 border border-gray-600/70">
                Based in Sydney, AU
              </span>
            </div>

            {/* Links 优先级在 Recruiter Mode ON 时提升到 bullets 下方 */}
            {recruiterMode && (
              <div className="mb-6">
                <h3 className="font-semibold text-white mb-3">Links</h3>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.linkedin.com/in/ningxiao-yang-46bb99213/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900/60 border border-gray-600 text-gray-100 hover:border-blue-500 hover:text-white hover:bg-gray-900 transition-colors text-sm font-medium"
                  >
                    <img src="/linkedin.png" alt="LinkedIn" className="w-5 h-5 rounded-full object-cover" />
                    <span>LinkedIn</span>
                    <span aria-hidden="true" className="text-xs">
                      ↗
                    </span>
                  </a>
                  <a
                    href="https://github.com/NingxiaoYYANG"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900/60 border border-gray-600 text-gray-100 hover:border-blue-500 hover:text-white hover:bg-gray-900 transition-colors text-sm font-medium"
                  >
                    <img src="/github.png" alt="GitHub" className="w-5 h-5 rounded-full object-cover" />
                    <span>GitHub</span>
                    <span aria-hidden="true" className="text-xs">
                      ↗
                    </span>
                  </a>
                  <a
                    href="/Resume_090126.pdf"
                    download="Resume_090126.pdf"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900/40 border border-dashed border-gray-600 text-gray-300 hover:border-blue-500 hover:text-white hover:bg-gray-900/60 transition-colors text-sm font-medium"
                  >
                    <img src="/resume.png" alt="Resume" className="w-5 h-5 rounded-full object-cover" />
                    <span>Resume (PDF)</span>
                    <span aria-hidden="true" className="text-xs">
                      ↗
                    </span>
                  </a>
                </div>
              </div>
            )}

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
              {!recruiterMode && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:col-span-2">
                  <h3 className="font-semibold text-white mb-3">Links</h3>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://www.linkedin.com/in/ningxiao-yang-46bb99213/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900/60 border border-gray-600 text-gray-100 hover:border-blue-500 hover:text-white hover:bg-gray-900 transition-colors text-sm font-medium"
                    >
                      <img src="/linkedin.png" alt="LinkedIn" className="w-5 h-5 rounded-full object-cover" />
                      <span>LinkedIn</span>
                      <span aria-hidden="true" className="text-xs">
                        ↗
                      </span>
                    </a>
                    <a
                      href="https://github.com/NingxiaoYYANG"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900/60 border border-gray-600 text-gray-100 hover:border-blue-500 hover:text-white hover:bg-gray-900 transition-colors text-sm font-medium"
                    >
                      <img src="/github.png" alt="GitHub" className="w-5 h-5 rounded-full object-cover" />
                      <span>GitHub</span>
                      <span aria-hidden="true" className="text-xs">
                        ↗
                      </span>
                    </a>
                    <a
                      href="/Resume_090126.pdf"
                      download="Resume_090126.pdf"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900/40 border border-dashed border-gray-600 text-gray-300 hover:border-blue-500 hover:text-white hover:bg-gray-900/60 transition-colors text-sm font-medium"
                    >
                      <img src="/resume.png" alt="Resume" className="w-5 h-5 rounded-full object-cover" />
                      <span>Resume (PDF)</span>
                      <span aria-hidden="true" className="text-xs">
                        ↗
                      </span>
                    </a>
                  </div>
                </div>
              )}
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
      </motion.div>
    </div>
  );
}
