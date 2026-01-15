import { useRef, createContext, useContext } from 'react';
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';

// Context to expose mouse position data for parallax effects
const MousePositionContext = createContext(null);

export function useMousePosition() {
  const context = useContext(MousePositionContext);
  return context;
}

export default function Card3D({ children, className = '' }) {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 大幅调整 spring 参数，让离开时的过渡极其平滑，几乎看不出强制回到原始状态
  const mouseXSpring = useSpring(x, {
    stiffness: 80, // 大幅降低刚度，让过渡更慢更平滑
    damping: 35, // 大幅增加阻尼，减少震荡，让过渡更稳定
    mass: 1.2, // 大幅增加质量，增加惯性，让过渡更自然
  });
  const mouseYSpring = useSpring(y, {
    stiffness: 80,
    damping: 35,
    mass: 1.2,
  });

  // Tilt - 收敛到更小的角度，避免过度炫技
  const rotateX = useTransform(mouseYSpring, [-0.4, 0.4], ['6deg', '-6deg']);
  const rotateY = useTransform(mouseXSpring, [-0.4, 0.4], ['-6deg', '6deg']);

  // More pronounced positional parallax (整卡片明显跟随鼠标移动)
  const translateX = useTransform(mouseXSpring, [-0.4, 0.4], [-36, 36]);
  const translateY = useTransform(mouseYSpring, [-0.4, 0.4], [-26, 26]);

  // Layer 1: 大范围柔和光斑（降低强度，避免压暗内容）
  const glareOpacity = useTransform(mouseYSpring, [-0.2, 0, 0.3], [0, 0.15, 0.08]);
  const glareGradient = useTransform(
    [mouseXSpring, mouseYSpring],
    ([vx, vy]) => {
      const xPct = 50 + vx * 60; // -0.4..0.4 -> ~26%..74%
      const yPct = 10 + (vy + 0.4) * 40; // shift from top toward center
      return `radial-gradient(circle at ${xPct}% ${yPct}%, rgba(255,255,255,0.3), transparent 60%)`;
    }
  );

  // Layer 2: 窄而亮的锐边高光带（玻璃质感）
  const sharpGlareOpacity = useTransform(mouseYSpring, [-0.2, 0, 0.3], [0, 0.25, 0.12]);
  const sharpGlareGradient = useTransform(
    [mouseXSpring, mouseYSpring],
    ([vx, vy]) => {
      const angle = Math.atan2(vy, vx) * (180 / Math.PI) + 45;
      const xPct = 50 + vx * 40;
      const yPct = 30 + vy * 20;
      return `linear-gradient(${angle}deg, transparent 35%, rgba(255,255,255,0.7) 48%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.7) 52%, transparent 65%)`;
    }
  );
  const sharpGlareTransform = useTransform(
    [mouseXSpring, mouseYSpring],
    ([vx, vy]) => {
      const xPct = 50 + vx * 30;
      const yPct = 30 + vy * 15;
      return `translate(${xPct - 50}%, ${yPct - 30}%)`;
    }
  );

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    // Disable 3D effect on mobile devices
    if (window.innerWidth < 768) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    let xPct = mouseX / width - 0.5;
    let yPct = mouseY / height - 0.5;

    // Clamp at the edges to避免角落过度倾斜带来的“弹出”感
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
    xPct = clamp(xPct, -0.4, 0.4);
    yPct = clamp(yPct, -0.4, 0.4);

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    // 使用 animate 而不是直接 set，让过渡更平滑自然
    // 使用更长的过渡时间，让用户完全感觉不到强制回到原始状态
    animate(x, 0, {
      type: 'spring',
      stiffness: 80,
      damping: 35,
      mass: 1.2,
    });
    animate(y, 0, {
      type: 'spring',
      stiffness: 80,
      damping: 35,
      mass: 1.2,
    });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {}}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        x: translateX,
        y: translateY,
        transformStyle: 'preserve-3d',
      }}
      className={`${className} transition-transform duration-150`}
    >
      <MousePositionContext.Provider value={{ mouseXSpring, mouseYSpring }}>
        <div
          style={{
            transform: 'translateZ(55px)',
            transformStyle: 'preserve-3d',
            isolation: 'isolate', // 创建新的层叠上下文，让高光不压内容
          }}
          className="relative z-10"
        >
          {children}
        </div>
      </MousePositionContext.Provider>
    </motion.div>
  );
}
