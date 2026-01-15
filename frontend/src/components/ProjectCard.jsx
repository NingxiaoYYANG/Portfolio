import { motion } from 'framer-motion';
import Card3D from './Card3D';

export default function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <Card3D className="h-full">
        <div className="bg-gray-800 rounded-lg p-6 h-full flex flex-col hover:bg-gray-750 transition-all border border-gray-700 hover:border-blue-500/50">
          {/* Project Image Placeholder */}
          <div className="w-full h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
            {project.image ? (
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <div className="text-4xl">🚀</div>
            )}
          </div>

          <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
          <p className="text-gray-400 mb-4 flex-grow">{project.description}</p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies?.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm border border-blue-500/30"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-4 mt-auto">
            {project.github_url && (
              <motion.a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-center transition-colors"
              >
                GitHub
              </motion.a>
            )}
            {project.demo_url && (
              <motion.a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-center transition-colors"
              >
                Demo
              </motion.a>
            )}
          </div>
        </div>
      </Card3D>
    </motion.div>
  );
}
