import { motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';
import Modal from './Modal';
import { useRecruiterMode } from '../contexts/RecruiterModeContext';

const colorMap = {
  blue: 'from-blue-500 to-blue-600',
  yellow: 'from-yellow-500 to-yellow-600',
  green: 'from-green-500 to-green-600',
  red: 'from-red-500 to-red-600',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600',
};

const skills = [
  // Languages
  { name: 'C++', level: 85, category: 'Languages', color: 'blue', details: 'Tutor experience + advanced C++ coursework.', related: ['MistWalker', 'CourseMaper'] },
  { name: 'Rust', level: 80, category: 'Languages', color: 'orange', details: 'Academic tutoring and modern Rust practices (ownership/borrowing).', related: ['CourseMaper'] },
  { name: 'Python', level: 85, category: 'Languages', color: 'green', details: 'Backend development + ML tooling work.', related: ['CourseMaper', 'Jo-en Media Website'] },
  { name: 'Java', level: 70, category: 'Languages', color: 'red', details: 'General programming + problem solving practice.', related: ['LeetCode Practice'] },
  { name: 'JavaScript', level: 80, category: 'Languages', color: 'yellow', details: 'Frontend + web tooling.', related: ['SkillVerse', 'Event Platform'] },

  // Frontend
  { name: 'React', level: 85, category: 'Frontend', color: 'blue', details: 'Production React apps, routing, UI collaboration.', related: ['CourseMaper', 'SkillVerse', 'Event Platform', 'Jo-en Media Website'] },
  { name: 'HTML/CSS', level: 80, category: 'Frontend', color: 'purple', details: 'Responsive layout + modern styling.', related: ['Jo-en Media Website'] },

  // Backend
  { name: 'Flask', level: 85, category: 'Backend', color: 'red', details: 'REST APIs + email workflow + deployment.', related: ['Event Platform', 'Jo-en Media Website', 'CourseMaper'] },
  { name: 'REST APIs', level: 80, category: 'Backend', color: 'green', details: 'Designing endpoints, auth flows, integrations.', related: ['Event Platform'] },

  // Database
  { name: 'SQL', level: 75, category: 'Database', color: 'purple', details: 'Relational data modelling + admin tooling (phpMyAdmin).', related: ['Event Platform'] },

  // DevOps
  { name: 'Docker', level: 75, category: 'DevOps', color: 'orange', details: 'Containerised Flask backend for production.', related: ['Jo-en Media Website'] },
  { name: 'Deployment/Hosting', level: 75, category: 'DevOps', color: 'blue', details: 'Firebase Hosting, GoDaddy hosting, production handover.', related: ['Jo-en Media Website', 'Event Platform'] },

  // Tools
  { name: 'Git', level: 85, category: 'Tools', color: 'orange', details: 'Daily workflow: branching, PRs, reviews.', related: ['CourseMaper', 'SkillVerse'] },
  { name: 'CI/CD', level: 75, category: 'Tools', color: 'green', details: 'TDD + CI/CD + code reviews in team delivery.', related: ['CourseMaper'] },
];

export default function SkillTree() {
  const { recruiterMode } = useRecruiterMode();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const categories = ['All', ...new Set(skills.map(s => s.category))];

  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter(s => s.category === selectedCategory);

  // Map numeric level to friendly label for recruiters
  const levelLabel = (level) => {
    if (level >= 85) return 'Used in production';
    if (level >= 80) return 'Strong';
    if (level >= 70) return 'Comfortable';
    return 'Familiar';
  };

  // 将数值映射为 1–4 档，用于分段小条
  const segmentsFilled = (level) => {
    if (level >= 85) return 4;
    if (level >= 80) return 3;
    if (level >= 70) return 2;
    return 1;
  };

  const modalTitle = useMemo(() => {
    if (!selectedSkill) return '';
    return `${selectedSkill.name} · ${selectedSkill.category}`;
  }, [selectedSkill]);

  // Recruiter Mode 切换时，默认 tab：ON → Backend，OFF → All
  useEffect(() => {
    setSelectedCategory(recruiterMode ? 'Backend' : 'All');
  }, [recruiterMode]);

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-gradient">Skills</h2>
      
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <motion.div
        key={`${selectedCategory}-${recruiterMode ? 'recruiter' : 'portfolio'}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="bg-gray-800/70 hover:bg-gray-800 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
            onClick={() => setSelectedSkill(skill)}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold">{skill.name}</h3>
              <span className="text-[11px] uppercase tracking-wide text-gray-400">
                {levelLabel(skill.level)}
              </span>
            </div>

            {/* Recruiter Mode OFF：4 段固定小条，不显示数值 */}
            {!recruiterMode && (
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 4 }).map((_, i) => {
                  const filled = i < segmentsFilled(skill.level);
                  return (
                    <motion.div
                      key={i}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.08 + i * 0.05 }}
                      className={`h-2 flex-1 rounded-full origin-left ${
                        filled
                          ? `bg-gradient-to-r ${colorMap[skill.color]}`
                          : 'bg-gray-700'
                      }`}
                    />
                  );
                })}
              </div>
            )}

            {/* Recruiter Mode ON：改为技能 chips + 证据 */}
            {recruiterMode && (
              <div className="mt-3">
                {skill.details && (
                  <p className="text-sm text-gray-300 mb-3">
                    {skill.details}
                  </p>
                )}
                {skill.related?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skill.related.map((r) => (
                      <span
                        key={r}
                        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-100 text-xs"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      <Modal
        isOpen={!!selectedSkill}
        title={modalTitle}
        onClose={() => setSelectedSkill(null)}
      >
        {selectedSkill && (
          <div className="space-y-4">
            <p className="text-gray-200">{selectedSkill.details}</p>
            {selectedSkill.related?.length > 0 && (
              <div>
                <div className="text-sm font-semibold text-gray-100 mb-2">Related</div>
                <div className="flex flex-wrap gap-2">
                  {selectedSkill.related.map((r) => (
                    <span
                      key={r}
                      className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-200 text-sm"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <p className="text-gray-400 text-sm">
              Tip: later we can link these to your Projects page or open the related card directly.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
