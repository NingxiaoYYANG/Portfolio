import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const photos = [
  {
    id: 'hackathon',
    src: '/hackthon.jpg',
    alt: 'Winning an Aspiring Entrepreneur Award at a Web3 & AI hackathon',
  },
  {
    id: 'graduate',
    src: '/graduate.jpg',
    alt: 'Graduation ceremony holding UNSW award folder',
  },
  {
    id: 'game_project',
    src: '/game_project.jpg',
    alt: 'Artwork for a game project showing a team walking through a misty street',
  },
  {
    id: 'coding_env',
    src: '/coding_env.jpg',
    alt: 'Coding setup with dual monitors, notebooks, and problem solving notes',
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
  // page 用来支持循环，direction 记录方向
  const [[page, direction], setPage] = useState([0, 0]);

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

  return (
    <div className="relative flex items-center justify-end w-full mx-auto">
      {/* 左右箭头固定在图片两侧 */}
      <button
        type="button"
        onClick={() => paginate(-1)}
        className="hidden sm:flex absolute -left-4 z-20 h-9 w-9 text-2xl text-gray-300 hover:text-blue-300 transition-colors items-center justify-center"
        aria-label="Previous photo"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={() => paginate(1)}
        className="hidden sm:flex absolute -right-4 z-20 h-9 w-9 text-2xl text-gray-300 hover:text-blue-300 transition-colors items-center justify-center"
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
            className="absolute inset-0 rounded-3xl border border-gray-200/20 overflow-hidden shadow-[0_18px_45px_rgba(15,23,42,0.9)] cursor-grab active:cursor-grabbing"
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
            
            {/* 可选的装饰性边框光晕 */}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-white/5 pointer-events-none" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

