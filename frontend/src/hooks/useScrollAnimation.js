import { useEffect, useRef, useState } from 'react';

export default function useScrollAnimation(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (options.once) {
            observer.unobserve(entry.target);
          }
        } else if (!options.once) {
          setIsVisible(false);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
      }
    );

    if (ref.current) {
      const node = ref.current;
      observer.observe(node);
      return () => observer.unobserve(node);
    }
    return undefined;
  }, [options.threshold, options.rootMargin, options.once]);

  return [ref, isVisible];
}
