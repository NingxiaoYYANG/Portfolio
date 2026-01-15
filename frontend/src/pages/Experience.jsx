import { motion } from 'framer-motion';
import ExperienceCard from '../components/ExperienceCard';

const experiences = [
  {
    id: 1,
    title: 'Academic Tutor (C++ & Rust)',
    company: 'The University of New South Wales (UNSW) · School of Engineering',
    period: 'May 2024 – Present · Sydney, Australia',
    type: 'work',
    description:
      'Instruct students in designing, building, and testing C++ and Rust programs; ran code reviews and provided actionable feedback.',
    responsibilities: [
      'Guided students toward modern, widely-used C++/Rust practices',
      'Explained Rust ownership/borrowing and how it prevents data races in concurrent code',
      'Performed code reviews and helped students improve correctness and readability',
    ],
    technologies: ['C++', 'Rust', 'Code Review', 'Concurrency'],
  },
  {
    id: 2,
    title: 'Full-stack Web Developer (Contract)',
    company: 'Jo-en Media (Client)',
    period: 'Jun 2024 – Oct 2024 · Sydney, Australia',
    type: 'work',
    description:
      'Built and shipped a production website with React + Flask; containerised the backend with Docker and deployed via Firebase Hosting.',
    responsibilities: [
      'Implemented enquiry-to-email backend workflow',
      'Worked with a designer to deliver UI to spec',
      'Containerised backend with Docker and shipped to production',
    ],
    technologies: ['React', 'Flask', 'Docker', 'Firebase Hosting', 'REST APIs'],
  },
  {
    id: 3,
    title: 'Full-stack Web Developer (Contract)',
    company: 'Australian Chinese Scholars Association (Client)',
    period: 'Nov 2023 – Apr 2024 · Sydney, Australia',
    type: 'work',
    description:
      'Delivered an event management platform with authentication, profiles, and admin/user event workflows. Deployed on GoDaddy hosting and supported stability during handover.',
    responsibilities: [
      'Built event management flows for admin and users',
      'Implemented authentication and profile features',
      'Deployed and supported stability during handover',
    ],
    technologies: ['React', 'Flask', 'SQL', 'phpMyAdmin', 'GoDaddy Hosting'],
  },
  {
    id: 4,
    title: 'Bachelor of Computer Science',
    company: 'The University of New South Wales (UNSW)',
    period: '2021 – 2024 · Sydney, Australia',
    type: 'education',
    description:
      'Key courses: Data Structures & Algorithms, Database Systems, OODP, Web Front-End Programming, Advanced C++ Programming, Modern Programming Problems with Rust.',
    technologies: ['Data Structures', 'Algorithms', 'Databases', 'C++', 'Rust'],
  },
];

export default function Experience() {
  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-bold mb-4 text-gradient">Experience</h1>
        <p className="text-xl text-gray-400 mb-12 max-w-3xl">
          My professional journey and educational background
        </p>

        <div className="space-y-6">
          {experiences.map((experience, index) => (
            <ExperienceCard key={experience.id} experience={experience} index={index} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
