import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';

const achievements = [
  {
    id: 'hackathon-awards',
    title: 'Hackathon Awards',
    subtitle: 'SkillVerse · Web3 & AI Hackathon',
    description:
      'Led a 5-person team to build an AI-powered decentralised certification platform.',
    outcome: 'Awarded Aspiring Entrepreneur and Best Presentation.',
    tags: ['Leadership', 'Web3', 'AI', 'Pitch'],
  },
  {
    id: 'coursemaper',
    title: 'Team Delivery',
    subtitle: 'CourseMaper · COMP3900',
    description:
      'Led a 3–6 person team to build a Bloom’s Taxonomy analytics webapp with React + Flask + BERT.',
    outcome: 'Delivered assessed capstone project on time with CI/CD, TDD and client sign-off.',
    tags: ['CI/CD', 'TDD', 'Client', 'BERT'],
  },
  {
    id: 'tutor',
    title: 'Teaching & Mentoring',
    subtitle: 'Academic Tutor · UNSW',
    description:
      'Tutored C++ and Rust, ran code reviews, and helped students adopt modern practices.',
    outcome: 'Supported cohorts of 20–30 students per term in passing and lifting code quality.',
    tags: ['C++', 'Rust', 'Code Review'],
  },
  {
    id: 'shipping',
    title: 'Shipping to Production',
    subtitle: 'Contract Work',
    description:
      'Shipped React + Flask products with Docker and hosting/deployment workflows.',
    outcome: 'Deployed and handed over live sites used by non-technical clients.',
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
            className="group relative text-left p-5 rounded-2xl bg-gray-800/70 hover:bg-gray-800 border border-white/5 hover:border-white/10 transition-colors"
          >
            {/* View 提示 */}
            <div className="absolute top-3 right-4 text-[11px] text-gray-400 flex items-center gap-1 group-hover:text-blue-300 transition-colors pointer-events-none">
              <span>View</span>
              <span>→</span>
            </div>
            <div className="text-lg font-semibold text-white">{a.title}</div>
            <div className="text-sm text-gray-400 mt-1">{a.subtitle}</div>
            {a.outcome && (
              <div className="text-xs text-emerald-300/90 mt-3">
                {a.outcome}
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              {a.tags.slice(0, 4).map((t) => (
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
            {/* description 拆分为 bullet points */}
            <ul className="list-disc list-inside space-y-1 text-gray-200 leading-relaxed text-sm">
              {selected.description
                .split('.')
                .map((part) => part.trim())
                .filter(Boolean)
                .map((part) => (
                  <li key={part}>{part}.</li>
                ))}
            </ul>
            {selected.outcome && (
              <p className="text-emerald-300/90 text-sm">{selected.outcome}</p>
            )}
            <div className="flex flex-wrap gap-2 pt-2">
              {selected.tags.slice(0, 4).map((t) => (
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

