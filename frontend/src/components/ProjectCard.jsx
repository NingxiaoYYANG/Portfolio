import { motion } from 'framer-motion';
import { useState } from 'react';
import Card3D from './Card3D';
import { useRecruiterMode } from '../contexts/RecruiterModeContext';
import { resolvePublicPath } from '../utils/paths';

// Category-based default icons mapping
const categoryIcons = {
  Web: '🌐',
  Backend: '⚙️',
  DevOps: '🚀',
  Game: '🎮',
  Hackathon: '🏆',
};

export default function ProjectCard({ project, index, onCardClick }) {
  const { recruiterMode } = useRecruiterMode();
  const [isHovered, setIsHovered] = useState(false);

  // Get cover or fallback
  const cover = project.cover || project.image;
  const coverType = project.coverType || 'image';
  const coverIcon = project.coverIcon || categoryIcons[project.category] || '🚀';

  // Get tags (prioritize highlightTags, then techTags, fallback to technologies)
  const highlightTags = project.highlightTags || [];
  const techTags = project.techTags || [];
  const fallbackTags = project.technologies || [];

  // Limit tags based on Recruiter Mode
  const maxHighlightTags = recruiterMode ? 2 : 2;
  const maxTechTags = recruiterMode ? 1 : 2;
  const maxTotalTags = recruiterMode ? 3 : 4;

  const displayHighlightTags = highlightTags.slice(0, maxHighlightTags);
  const displayTechTags = techTags.slice(0, maxTechTags);
  const displayTags = [...displayHighlightTags, ...displayTechTags].slice(0, maxTotalTags);

  // If no new tags, use fallback
  const finalTags = displayTags.length > 0 ? displayTags : fallbackTags.slice(0, maxTotalTags);
  const finalHighlightTags = displayTags.length > 0 ? displayHighlightTags : [];
  const finalTechTags = displayTags.length > 0 ? displayTechTags : (fallbackTags.length > 0 ? fallbackTags.slice(0, maxTotalTags) : []);

  // Get CTA URLs (new format or backward compatibility)
  const demoUrl = project.demoUrl || project.demo_url;
  const codeUrl = project.codeUrl || project.github_url;
  const caseStudyUrl = project.caseStudyUrl;

  const handleCardClick = (e) => {
    // Don't trigger if clicking on buttons
    if (e.target.closest('a, button')) {
      return;
    }
    if (onCardClick) {
      onCardClick(project);
    }
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <Card3D className="h-full">
        <div
          className="bg-gray-800 rounded-lg p-6 h-full flex flex-col hover:bg-gray-750 transition-all border border-gray-700 hover:border-blue-500/50 cursor-pointer"
          onClick={handleCardClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Project Cover Media */}
          <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4 group">
            {cover ? (
              coverType === 'video' ? (
                <video
                  src={resolvePublicPath(cover)}
                  poster={project.videoPoster ? resolvePublicPath(project.videoPoster) : undefined}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  muted
                  loop
                />
              ) : (
                <img
                  src={resolvePublicPath(cover)}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              )
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <div className="text-6xl">{coverIcon}</div>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold mb-1">{project.title}</h3>
          {project.subtitle && (
            <p className="text-sm text-gray-400 mb-3">{project.subtitle}</p>
          )}

          {/* Description (2 lines max) */}
          <p className="text-gray-400 mb-4 flex-grow line-clamp-2">
            {project.description}
          </p>

          {/* CTA Buttons (before tags in Recruiter Mode) */}
          {recruiterMode && (
            <div className="flex gap-2 mb-4">
              {demoUrl ? (
                <motion.a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleButtonClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-center text-sm font-medium text-white transition-colors"
                >
                  Live
                </motion.a>
              ) : caseStudyUrl ? (
                <motion.a
                  href={caseStudyUrl.startsWith('http') ? caseStudyUrl : resolvePublicPath(caseStudyUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleButtonClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-3 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-center text-sm font-medium text-white transition-colors"
                >
                  {caseStudyUrl.toLowerCase().endsWith('.pdf') 
                    ? 'Report' 
                    : caseStudyUrl.toLowerCase().endsWith('.mp4') || caseStudyUrl.toLowerCase().endsWith('.mov') || caseStudyUrl.toLowerCase().endsWith('.webm')
                    ? 'Video'
                    : 'Case Study'}
                </motion.a>
              ) : (
                <div className="flex-1 px-3 py-2 bg-gray-700/50 rounded-lg text-center text-sm font-medium text-gray-500 cursor-not-allowed">
                  Demo
                </div>
              )}
              {codeUrl ? (
                <motion.a
                  href={codeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleButtonClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-center text-sm font-medium text-white transition-colors"
                >
                  Code
                </motion.a>
              ) : (
                <div className="flex-1 px-3 py-2 bg-gray-700/50 rounded-lg text-center text-sm font-medium text-gray-500 cursor-not-allowed">
                  Code
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {finalTags.map((tag, idx) => {
              const isHighlight = finalHighlightTags.includes(tag);
              return (
                <span
                  key={`${tag}-${idx}`}
                  className={`px-3 py-1 rounded text-xs border ${
                    isHighlight
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}
                >
                  {tag}
                </span>
              );
            })}
          </div>

          {/* CTA Buttons (after tags in non-Recruiter Mode) */}
          {!recruiterMode && (
            <div className="flex gap-2 mt-auto">
              {demoUrl ? (
                <motion.a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleButtonClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-center text-sm font-medium text-white transition-colors"
                >
                  Live
                </motion.a>
              ) : caseStudyUrl ? (
                <motion.a
                  href={caseStudyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleButtonClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-center text-sm font-medium text-white transition-colors"
                >
                  {caseStudyUrl.toLowerCase().endsWith('.pdf') 
                    ? 'Report' 
                    : caseStudyUrl.toLowerCase().endsWith('.mp4') || caseStudyUrl.toLowerCase().endsWith('.mov') || caseStudyUrl.toLowerCase().endsWith('.webm')
                    ? 'Video'
                    : 'Case Study'}
                </motion.a>
              ) : null}
              {codeUrl ? (
                <motion.a
                  href={codeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleButtonClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-center text-sm font-medium text-white transition-colors"
                >
                  Code
                </motion.a>
              ) : null}
            </div>
          )}
        </div>
      </Card3D>
    </motion.div>
  );
}
