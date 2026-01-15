import { AnimatePresence, motion } from 'framer-motion';

export default function Modal({ isOpen, title, children, onClose }) {
  return (
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
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[min(92vw,720px)]"
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Dialog'}
          >
            <div className="bg-gray-900/80 border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="text-lg font-semibold text-white">{title}</div>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200"
                >
                  Close
                </button>
              </div>
              <div className="p-5 text-gray-200">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

