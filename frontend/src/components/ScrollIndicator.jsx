import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ScrollIndicator({ className = '' }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: scrollY < 100 ? 1 : 0 }}
      className={`${className} cursor-pointer`}
      onClick={scrollToNext}
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="flex flex-col items-center"
      >
        <span className="text-gray-400/70 text-[11px] tracking-[0.25em] uppercase mb-2">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-5 h-8 border border-gray-500/70 rounded-full flex justify-center bg-black/20 backdrop-blur-sm"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-0.5 h-3 bg-gray-300 rounded-full mt-1.5"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
