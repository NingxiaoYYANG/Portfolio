import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';

const achievements = [
  {
    id: 'hackathon-awards',
    title: 'Hackathon Awards',
    subtitle: 'SkillVerse · Web3 & AI Hackathon',
    description:
      'Led a 5-person team to build an AI-powered decentralised certification platform. Awarded Aspiring Entrepreneur and Best Presentation.',
    tags: ['Leadership', 'Web3', 'AI', 'Pitch'],
  },
  {
    id: 'coursemaper',
    title: 'Team Delivery',
    subtitle: 'CourseMaper · COMP3900',
    description:
      'Led a 3–6 person team to build a Bloom’s Taxonomy analytics webapp. Applied TDD, CI/CD, code reviews, and iterated with client feedback.',
    tags: ['CI/CD', 'TDD', 'Client', 'BERT'],
  },
  {
    id: 'tutor',
    title: 'Teaching & Mentoring',
    subtitle: 'Academic Tutor · UNSW',
    description:
      'Tutored C++ and Rust, ran code reviews, and helped students adopt modern practices (incl. Rust ownership/borrowing).',
    tags: ['C++', 'Rust', 'Code Review'],
  },
  {
    id: 'shipping',
    title: 'Shipping to Production',
    subtitle: 'Contract Work',
    description:
      'Shipped React + Flask products with Docker and hosting/deployment workflows, and supported stability through handover.',
    tags: ['React', 'Flask', 'Docker', 'Deployment'],
  },
];

export default function Achievements() {
  const [selected, setSelected] = useState(null);

  const modalTitle = useMemo(() => {
    if (!selected) return '';
    return selected.title;
  }, [selected]);

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-gradient">Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((a, idx) => (
          <motion.button
            key={a.id}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(a)}
            className="text-left p-5 rounded-2xl bg-gray-800/70 hover:bg-gray-800 border border-white/5 hover:border-white/10 transition-colors"
          >
            <div className="text-lg font-semibold text-white">{a.title}</div>
            <div className="text-sm text-gray-400 mt-1">{a.subtitle}</div>
            <div className="flex flex-wrap gap-2 mt-4">
              {a.tags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-200 text-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.button>
        ))}
      </div>

      <Modal isOpen={!!selected} title={modalTitle} onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-3">
            <div className="text-sm text-gray-400">{selected.subtitle}</div>
            <p className="text-gray-200 leading-relaxed">{selected.description}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {selected.tags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-200 text-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

