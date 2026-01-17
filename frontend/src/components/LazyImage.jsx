import { useState } from 'react';
import { motion } from 'framer-motion';
import { resolvePublicPath } from '../utils/paths';

export default function LazyImage({ src, alt, className = '' }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-700 animate-pulse" />
      )}
      {error ? (
        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
          <span className="text-gray-500">Image not available</span>
        </div>
      ) : (
        <motion.img
          src={resolvePublicPath(src)}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
    </div>
  );
}
