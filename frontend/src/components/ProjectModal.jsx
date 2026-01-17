import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ProjectModal({ project, isOpen, onClose }) {
  // Early return if project is null - must be before any project property access
  if (!project) return null;

  const modalRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // #region agent log
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      const viewport = { w: window.innerWidth, h: window.innerHeight };
      fetch('http://127.0.0.1:7242/ingest/aa4580b9-8f1d-41ba-b9fb-6ae5bd9cb9fd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'ProjectModal.jsx:useEffect',
          message: 'Modal position check',
          data: {
            modalRect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            viewport,
            centerX: viewport.w / 2,
            centerY: viewport.h / 2,
            modalCenterX: rect.x + rect.width / 2,
            modalCenterY: rect.y + rect.height / 2,
            offsetX: (rect.x + rect.width / 2) - viewport.w / 2,
            offsetY: (rect.y + rect.height / 2) - viewport.h / 2,
          },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'run1',
          hypothesisId: 'H1',
        }),
      }).catch(() => {});
    }
  }, [isOpen]);
  // #endregion

  // Collect all images (cover + screenshots)
  const cover = project.cover || project.image;
  const coverType = project.coverType || 'image';
  const screenshots = project.screenshots || [];
  
  // Combine cover and screenshots into a single array
  const allImages = [];
  if (cover) {
    allImages.push({ src: cover, type: coverType, poster: project.videoPoster });
  }
  screenshots.forEach(screenshot => {
    allImages.push({ src: screenshot, type: 'image' });
  });

  // Reset to first image when modal opens or project changes
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen, project?.id]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || allImages.length <= 1) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, allImages.length]);

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  // Get all tags
  const highlightTags = project.highlightTags || [];
  const techTags = project.techTags || [];
  const fallbackTags = project.technologies || [];
  const allTags = highlightTags.length > 0 || techTags.length > 0
    ? [...highlightTags, ...techTags]
    : fallbackTags;

  // Get CTA URLs
  const demoUrl = project.demoUrl || project.demo_url;
  const codeUrl = project.codeUrl || project.github_url;
  const caseStudyUrl = project.caseStudyUrl;

  const handleButtonClick = (e) => {
    e.stopPropagation();
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]"
            onClick={onClose}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          
          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.96, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.96, x: '-50%', y: '-50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="z-[101] w-[min(95vw,1000px)] max-w-[1000px] max-h-[90vh] flex flex-col"
            style={{ 
              position: 'fixed',
              left: '50%',
              top: '50%',
              margin: 0,
              zIndex: 101,
            }}
            role="dialog"
            aria-modal="true"
            aria-label={project.title || 'Project Details'}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gray-900/95 border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header - Fixed */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50 bg-gray-800/50 flex-shrink-0">
                <h2 className="text-xl font-semibold text-white">{project.title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 px-6 py-6 space-y-6">
                {/* Image Carousel */}
                {allImages.length > 0 && (
                  <div className="relative w-full rounded-xl overflow-hidden bg-gray-800/50 border border-gray-700/30">
                    {/* Main Image/Video Display */}
                    <div className="relative w-full flex items-center justify-center min-h-[300px] max-h-[500px]">
                      {allImages[currentImageIndex].type === 'video' ? (
                        <video
                          src={allImages[currentImageIndex].src}
                          poster={allImages[currentImageIndex].poster}
                          className="w-full h-auto max-h-[500px] object-contain"
                          controls
                          autoPlay
                          loop
                          muted
                        />
                      ) : (
                        <img
                          src={allImages[currentImageIndex].src}
                          alt={`${project.title} - Image ${currentImageIndex + 1}`}
                          className="w-full h-auto max-h-[500px] object-contain mx-auto"
                          style={{ display: 'block' }}
                        />
                      )}

                      {/* Navigation Arrows */}
                      {allImages.length > 1 && (
                        <>
                          <button
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 text-white transition-all hover:scale-110 z-10"
                            aria-label="Previous image"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 text-white transition-all hover:scale-110 z-10"
                            aria-label="Next image"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      )}

                      {/* Image Counter */}
                      {allImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white text-sm font-medium">
                          {currentImageIndex + 1} / {allImages.length}
                        </div>
                      )}
                    </div>

                    {/* Thumbnail Navigation */}
                    {allImages.length > 1 && (
                      <div className="px-4 py-3 bg-gray-800/30 border-t border-gray-700/30">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                          {allImages.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                idx === currentImageIndex
                                  ? 'border-blue-500 ring-2 ring-blue-500/50'
                                  : 'border-gray-600/50 hover:border-gray-500'
                              }`}
                              aria-label={`Go to image ${idx + 1}`}
                            >
                              {img.type === 'video' ? (
                                <div className="w-full h-full bg-gray-700 flex items-center justify-center relative">
                                  <img
                                    src={img.poster || img.src}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className="w-full h-full object-cover opacity-70"
                                  />
                                  <svg className="absolute w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              ) : (
                                <img
                                  src={img.src}
                                  alt={`Thumbnail ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Subtitle */}
                {project.subtitle && (
                  <p className="text-lg text-gray-300 font-medium">{project.subtitle}</p>
                )}

                {/* Project Meta Info */}
                {(project.category || project.year) && (
                  <div className="flex gap-4 text-sm">
                    {project.category && (
                      <div>
                        <span className="text-gray-400">Category: </span>
                        <span className="text-gray-200 font-medium">{project.category}</span>
                      </div>
                    )}
                    {project.year && (
                      <div>
                        <span className="text-gray-400">Year: </span>
                        <span className="text-gray-200 font-medium">{project.year}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Full Description */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-200 mb-3 uppercase tracking-wide">Description</h3>
                  <p className="text-gray-300 leading-relaxed text-base">{project.description}</p>
                </div>


                {/* All Tags */}
                {allTags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-200 mb-3 uppercase tracking-wide">Technologies & Highlights</h3>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag, idx) => {
                        const isHighlight = highlightTags.includes(tag);
                        return (
                          <span
                            key={`${tag}-${idx}`}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
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
                  </div>
                )}
              </div>

              {/* Footer with CTA Buttons - Fixed */}
              {(demoUrl || caseStudyUrl || codeUrl) && (
                <div className="px-6 py-4 border-t border-gray-700/50 bg-gray-800/30 flex-shrink-0">
                  <div className="flex gap-3">
                    {demoUrl && (
                      <motion.a
                        href={demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleButtonClick}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-5 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-center font-medium text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <span>View Live Demo</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </motion.a>
                    )}
                    {caseStudyUrl && (
                      <motion.a
                        href={caseStudyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleButtonClick}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-5 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl text-center font-medium text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <span>
                          {caseStudyUrl.toLowerCase().endsWith('.pdf') 
                            ? 'View Report' 
                            : caseStudyUrl.toLowerCase().endsWith('.mp4') || caseStudyUrl.toLowerCase().endsWith('.mov') || caseStudyUrl.toLowerCase().endsWith('.webm')
                            ? 'View Demo Video'
                            : 'View Case Study'}
                        </span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </motion.a>
                    )}
                    {codeUrl && (
                      <motion.a
                        href={codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleButtonClick}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-5 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-center font-medium text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <span>View Code</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </motion.a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Use portal to render modal at body level
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  
  return modalContent;
}
