import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';

export default function Modal({ isOpen, title, children, onClose }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position and lock
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll position when modal closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.96, x: '-50%', y: '-50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="z-[101] w-[min(95vw,720px)] max-w-[720px] max-h-[90vh] flex flex-col"
            style={{ 
              position: 'fixed',
              left: '50%',
              top: '50%',
              margin: 0,
              zIndex: 101,
            }}
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Dialog'}
          >
            <div className="bg-gray-900/80 border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col max-h-full">
              <div className="flex items-center justify-between px-4 md:px-5 py-3 md:py-4 border-b border-white/10 flex-shrink-0">
                <div className="text-base md:text-lg font-semibold text-white pr-2 flex-1 min-w-0 truncate">{title}</div>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 flex-shrink-0 ml-2"
                >
                  Close
                </button>
              </div>
              <div className="p-4 md:p-5 text-gray-200 overflow-y-auto flex-1 min-h-0">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Use portal to render modal at body level (like ProjectModal)
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  
  return modalContent;
}

