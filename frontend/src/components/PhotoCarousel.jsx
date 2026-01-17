import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecruiterMode } from '../contexts/RecruiterModeContext';

const photos = [
  {
    id: 'graduate',
    src: '/graduate.jpg',
    alt: 'Graduation ceremony holding UNSW award folder',
    caption: 'UNSW Graduation • 2024',
  },
  {
    id: 'hackathon',
    src: '/SkillVerse/award.jpg',
    alt: 'Winning an Aspiring Entrepreneur Award at a Web3 & AI hackathon',
    caption: 'Web3 & AI Hackathon • Aspiring Entrepreneur Award',
  },
  {
    id: 'coding_env',
    src: '/coding_env.jpg',
    alt: 'Coding setup with dual monitors, notebooks, and problem solving notes',
    caption: 'Everyday coding setup • Problem solving',
  },
  {
    id: 'hackthon_demo',
    src: '/SkillVerse/presentation.jpg',
    alt: 'Demonstrating the SkillVerse web3 & AI hackathon project',
    caption: 'SkillVerse web3 & AI hackathon • Demonstration',
  },
];

// 基于 framer-motion 官方示例的水平滑动 variants
const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
};

const SWIPE_CONFIDENCE = 80;

export default function PhotoCarousel() {
  const { recruiterMode } = useRecruiterMode();
  // page 用来支持循环，direction 记录方向
  const [[page, direction], setPage] = useState([0, 0]);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedHovered, setIsExpandedHovered] = useState(false);

  const index = ((page % photos.length) + photos.length) % photos.length;
  const current = photos[index];

  const paginate = (newDirection) => {
    setPage(([p]) => [p + newDirection, newDirection]);
  };

  const handleDragEnd = (_e, { offset, velocity }) => {
    const swipePower = offset.x + velocity.x * 100;

    if (swipePower < -SWIPE_CONFIDENCE) {
      paginate(1);
    } else if (swipePower > SWIPE_CONFIDENCE) {
      paginate(-1);
    }
  };

  // Recruiter Mode OFF 时自动轮播；ON 时只在用户交互时切换
  useEffect(() => {
    if (recruiterMode || isExpanded || photos.length <= 1) return;

    const id = setInterval(() => {
      setPage(([p]) => [p + 1, 1]);
    }, 6000);

    return () => clearInterval(id);
  }, [recruiterMode, isExpanded]);

  return (
    <>
      <div
        className="relative flex items-center justify-end w-full mx-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 左右箭头固定在图片两侧，默认弱化，hover / 展开时更明显 */}
        <button
          type="button"
          onClick={() => paginate(-1)}
          className={`hidden sm:flex absolute -left-4 z-20 h-9 w-9 text-2xl items-center justify-center transition-opacity transition-colors
            ${isHovered || isExpanded ? 'opacity-100 text-gray-300 hover:text-blue-300/90' : 'opacity-0 text-gray-400/40'}`}
          aria-label="Previous photo"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={() => paginate(1)}
          className={`hidden sm:flex absolute -right-4 z-20 h-9 w-9 text-2xl items-center justify-center transition-opacity transition-colors
            ${isHovered || isExpanded ? 'opacity-100 text-gray-300 hover:text-blue-300/90' : 'opacity-0 text-gray-400/40'}`}
          aria-label="Next photo"
        >
          ›
        </button>

        {/* 主图区域，可拖拽左右滑动 */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[3/2]">
          <AnimatePresence custom={direction} initial={false} mode="popLayout">
            <motion.div
              key={current.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 rounded-3xl border border-gray-200/20 overflow-hidden shadow-[0_18px_45px_rgba(15,23,42,0.85)] cursor-grab active:cursor-grabbing bg-gray-950/80"
            >
              {/* 优雅的背景渐变填充，统一视觉 */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/90 via-gray-900/80 to-gray-950/90" />
              
              {/* 图片容器：保持原比例，居中显示 */}
              <div className="relative h-full w-full flex items-center justify-center p-4">
                <img
                  src={current.src}
                  alt={current.alt}
                  className="max-h-full max-w-full h-auto w-auto object-contain select-none pointer-events-none drop-shadow-2xl"
                  style={{ 
                    filter: 'contrast(1.05) saturate(1.1)',
                  }}
                />
              </div>
              
              {/* 放大查看按钮：hover 时出现在右上角 */}
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className={`absolute top-3 right-3 inline-flex items-center justify-center h-8 w-8 rounded-full bg-black/60 text-gray-200 text-xs shadow-md hover:bg-black/80 hover:text-white transition-opacity transition-colors
                  ${isHovered && !isExpanded ? 'opacity-100' : 'opacity-0'}`}
                aria-label="Expand photo"
              >
                ⤢
              </button>

              {/* 图片说明 caption：右下角轻量文字 */}
              <div className="absolute bottom-3 right-4 left-4 text-right text-xs sm:text-sm text-gray-300/80 bg-gradient-to-l from-gray-900/70 via-gray-900/40 to-transparent px-3 py-1 rounded-full pointer-events-none">
                {current.caption}
              </div>

              {/* 可选的装饰性边框光晕 */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-white/5 pointer-events-none" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 全屏查看模式 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              className="relative max-w-6xl w-[94%] aspect-[16/9] sm:aspect-[3/2] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 border border-gray-200/15 shadow-[0_24px_70px_rgba(0,0,0,0.9)] cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={() => setIsExpandedHovered(true)}
              onMouseLeave={() => setIsExpandedHovered(false)}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={handleDragEnd}
            >
              {/* 关闭按钮：放在卡片右上角，始终可见 */}
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 z-50 inline-flex items-center justify-center h-11 w-11 rounded-full bg-white/95 hover:bg-white text-gray-900 shadow-lg hover:shadow-xl transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/60"
                aria-label="Close expanded photo"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* 左右切换按钮（全屏模式） */}
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      paginate(-1);
                    }}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 z-50 inline-flex items-center justify-center h-12 w-12 rounded-full bg-black/80 text-white text-2xl hover:bg-black/95 hover:text-blue-300 shadow-xl transition-all hover:scale-110 ${isExpandedHovered ? 'opacity-100' : 'opacity-0'}`}
                    aria-label="Previous photo"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      paginate(1);
                    }}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 z-50 inline-flex items-center justify-center h-12 w-12 rounded-full bg-black/80 text-white text-2xl hover:bg-black/95 hover:text-blue-300 shadow-xl transition-all hover:scale-110 ${isExpandedHovered ? 'opacity-100' : 'opacity-0'}`}
                    aria-label="Next photo"
                  >
                    ›
                  </button>
                </>
              )}

              <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
                <img
                  src={current.src}
                  alt={current.alt}
                  className="max-h-full max-w-full h-auto w-auto object-contain select-none drop-shadow-2xl pointer-events-none"
                  style={{ filter: 'contrast(1.05) saturate(1.1)' }}
                  draggable="false"
                />
              </div>
              <div className="absolute bottom-4 left-6 right-6 text-right text-xs sm:text-sm text-gray-200/90 bg-gradient-to-l from-black/70 via-black/40 to-transparent px-4 py-2 rounded-full">
                {current.caption}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

