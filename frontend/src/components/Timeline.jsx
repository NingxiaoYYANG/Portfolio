import { motion } from 'framer-motion';

const timelineData = [
  {
    year: '2024–Present',
    title: 'Academic Tutor (C++ & Rust)',
    company: 'UNSW · School of Engineering (Sydney, AU)',
    description:
      'Tutor for C++ and Rust: guided students on program design/testing, ran code reviews, and explained Rust ownership/borrowing for safe concurrency.',
    type: 'work',
  },
  {
    year: '2024',
    title: 'Full-stack Web Developer (Contract)',
    company: 'Jo-en Media (Client) · Sydney, AU',
    description:
      'Shipped a production React + Flask website; containerised backend with Docker; deployed (incl. Firebase Hosting); implemented enquiry-to-email workflow.',
    type: 'work',
  },
  {
    year: '2023–2024',
    title: 'Full-stack Web Developer (Contract)',
    company: 'Australian Chinese Scholars Association (Client) · Sydney, AU',
    description:
      'Delivered an event management platform (React + Flask + SQL) with auth, profiles, and admin/user event flows; deployed and supported handover.',
    type: 'work',
  },
  {
    year: '2021–2024',
    title: 'Bachelor of Computer Science',
    company: 'The University of New South Wales (UNSW) · Sydney, AU',
    description:
      'Key courses: Data Structures & Algorithms, Database Systems, OODP, Web Front-End, Advanced C++, Modern Programming Problems with Rust.',
    type: 'education',
  },
];

export default function Timeline() {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-8 text-gradient">Timeline</h2>
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-700" />

        {timelineData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="relative pl-20 pb-8"
          >
            {/* Dot */}
            <div className="absolute left-6 top-2 w-4 h-4 bg-blue-500 rounded-full border-4 border-gray-900 z-10" />
            
            {/* Content */}
            <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-blue-400 font-bold">{item.year}</span>
                <span className={`px-3 py-1 rounded text-sm ${
                  item.type === 'work' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {item.type === 'work' ? 'Work' : 'Education'}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{item.title}</h3>
              <p className="text-blue-400 mb-2">{item.company}</p>
              <p className="text-gray-400">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
