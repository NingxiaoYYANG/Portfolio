import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import Modal from './Modal';

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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const categories = ['All', ...new Set(skills.map(s => s.category))];

  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter(s => s.category === selectedCategory);

  const modalTitle = useMemo(() => {
    if (!selectedSkill) return '';
    return `${selectedSkill.name} · ${selectedSkill.category}`;
  }, [selectedSkill]);

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/70 hover:bg-gray-800 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
            onClick={() => setSelectedSkill(skill)}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold">{skill.name}</h3>
              <span className="text-gray-400">{skill.level}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`h-full bg-gradient-to-r ${colorMap[skill.color]} rounded-full`}
              />
            </div>
          </motion.div>
        ))}
      </div>

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
