import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Particles } from '../components/ParticleBackground';
import Typewriter from '../components/Typewriter';
import ScrollIndicator from '../components/ScrollIndicator';
import Card3D, { useMousePosition } from '../components/Card3D';
import { useEffect, useState, useRef } from 'react';
import { useRecruiterMode } from '../contexts/RecruiterModeContext';
import PathSelector from '../components/PathSelector';
import About from './About';
import Projects from './Projects';
import Experience from './Experience';
import Contact from './Contact';
import Game from './Game';

function Home() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const heroRef = useRef(null);
  const { recruiterMode, scrollToSection } = useRecruiterMode();

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const update = () => setReducedMotion(!!mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  const typewriterTexts = [
    'DevOps-minded',
    'Full-stack (React + Flask)',
    'Shipping apps & tooling',
    'Game Dev',
  ];

  const particleCount = reducedMotion ? 600 : 2000;

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.9]);
  // Lift the hero card higher on the screen (roughly +30px from previous)
  const heroTranslateY = useTransform(scrollYProgress, [0, 0.25], [-75, -115]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.75]);
  const bgTranslateY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  // scrollToSection 现在从 Context 获取

  // 高光层组件 - 完全自然地映射在圆角范围内，无轮廓感
  function CardGlareLayers() {
    const mousePos = useMousePosition();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (!mousePos || isMobile) {
      return null;
    }

    const { mouseXSpring, mouseYSpring } = mousePos;

    // Layer 1: 大范围柔和光斑 - 完全跟随鼠标，使用大范围渐变自然延伸到边界
    const glareOpacity = useTransform(
      mouseYSpring, 
      [-0.4, 0, 0.4], 
      [0, 0.15, 0]
    );
    const glareGradient = useTransform(
      [mouseXSpring, mouseYSpring],
      ([vx, vy]) => {
        // 将 -0.4..0.4 映射到 0..100%，完全跟随鼠标位置
        const xPct = 50 + vx * 100; // -0.4..0.4 -> 10%..90%
        const yPct = 50 + vy * 100; // -0.4..0.4 -> 10%..90%
        // 使用非常大的渐变半径，让光线自然延伸到边界并淡出
        return `radial-gradient(circle at ${xPct}% ${yPct}%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.1) 45%, transparent 70%)`;
      }
    );

    // Layer 2: 锐边高光带 - 完全跟随鼠标方向，自然延伸到边界
    const sharpGlareOpacity = useTransform(
      mouseYSpring, 
      [-0.4, 0, 0.4], 
      [0, 0.25, 0]
    );
    // 使用椭圆渐变，让高光带完全跟随鼠标位置和方向
    const sharpGlareGradient = useTransform(
      [mouseXSpring, mouseYSpring],
      ([vx, vy]) => {
        // 将鼠标位置映射到卡片内的百分比位置
        const xPct = 50 + vx * 100;
        const yPct = 50 + vy * 100;
        // 根据鼠标方向计算椭圆的角度和形状
        const angle = Math.atan2(vy, vx) * (180 / Math.PI);
        // 使用椭圆渐变，让高光带沿着鼠标方向自然延伸
        const distance = Math.sqrt(vx * vx + vy * vy);
        const ellipseWidth = 120 + distance * 80; // 根据距离调整宽度
        const ellipseHeight = 40 + distance * 20;
        return `radial-gradient(ellipse ${ellipseWidth}% ${ellipseHeight}% at ${xPct}% ${yPct}%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 20%, rgba(255,255,255,0.3) 40%, transparent 65%)`;
      }
    );

    return (
      <>
        {/* Layer 1: 大范围柔和光斑 - 完全自然地映射，无轮廓限制 */}
        <motion.div
          aria-hidden="true"
          style={{
            opacity: glareOpacity,
            backgroundImage: glareGradient,
          }}
          className="pointer-events-none absolute inset-0 rounded-[28px] mix-blend-screen z-0"
        />
        
        {/* Layer 2: 锐边高光带 - 完全自然地映射，无轮廓限制 */}
        <motion.div
          aria-hidden="true"
          style={{
            opacity: sharpGlareOpacity,
            backgroundImage: sharpGlareGradient,
          }}
          className="pointer-events-none absolute inset-0 rounded-[28px] mix-blend-screen z-0"
        />
      </>
    );
  }

  // Avatar parallax component
  function AvatarParallax() {
    const mousePos = useMousePosition();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    // 如果没有鼠标位置数据（移动端或未初始化），返回静态头像
    if (!mousePos || isMobile) {
      return (
        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-3xl overflow-hidden">
            {/* 渐变描边 */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-[2px]">
              <div className="w-full h-full rounded-[inherit] bg-gray-900/90 backdrop-blur-xl" />
            </div>
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-20 pointer-events-none" />
            <div className="relative w-full h-full rounded-3xl overflow-hidden isolation-isolate">
              {/* 边缘渐变压暗：只在顶部/右侧加渐变阴影，脸部区域保持清晰 */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-950/80 via-transparent to-transparent z-20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent z-20 pointer-events-none" />
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-gray-950/70 via-transparent to-transparent z-20 pointer-events-none" />
              
              <img
                src="/portrait.jpg"
                alt="Ningxiao Yang"
                className="w-full h-full object-cover object-center object-[center_top] scale-110 select-none pointer-events-none relative z-10"
                style={{
                  filter: 'brightness(0.95) contrast(1.15) saturate(1.0)',
                }}
              />
            </div>
          </div>
          {/* 信息 chips - 静态版本（移动端） */}
          <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto px-2 py-2 rounded-2xl bg-gray-900/30 backdrop-blur-sm border border-gray-800/50">
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-800/60 border border-gray-700/50 text-gray-300 backdrop-blur-sm">
                Sydney, AU
              </span>
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-800/60 border border-gray-700/50 text-gray-300 backdrop-blur-sm">
                Backend • DevOps
              </span>
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-800/60 border border-gray-700/50 text-gray-300 backdrop-blur-sm">
                UNSW Tutor • C++/Rust
              </span>
            </div>
          </div>
        </div>
      );
    }

    const { mouseXSpring, mouseYSpring } = mousePos;

    // 反向偏移：卡片往右倾时，头像往左漂（增强视差效果）
    const avatarTranslateX = useTransform(mouseXSpring, [-0.4, 0.4], [18, -18]);
    const avatarTranslateY = useTransform(mouseYSpring, [-0.4, 0.4], [12, -12]);

    // 头像微动效果：轻微 translateY + scale
    const avatarHoverY = useTransform(mouseYSpring, [-0.4, 0.4], [-2, 2]);
    const avatarHoverScale = useTransform(
      [mouseXSpring, mouseYSpring],
      ([vx, vy]) => {
        const distance = Math.sqrt(vx * vx + vy * vy);
        return 1 + distance * 0.01; // 最大 scale 1.01
      }
    );

    return (
      <div className="flex flex-col items-center md:items-end gap-6">
        <motion.div
          style={{
            x: avatarTranslateX,
            y: useTransform([avatarTranslateY, avatarHoverY], ([ty, hy]) => ty + hy),
            scale: avatarHoverScale,
          }}
          className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-3xl overflow-hidden"
        >
          {/* 渐变描边（蓝紫渐变，2px） */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-[2px]">
            <div className="w-full h-full rounded-[inherit] bg-gray-900/90 backdrop-blur-xl" />
          </div>

          {/* 轻微 glow 光晕（外层） */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-20 pointer-events-none" />

          {/* 头像容器（内层） */}
          <div className="relative w-full h-full rounded-3xl overflow-hidden">
            {/* 头像图片（裁剪更紧：胸口以上，脸占画面更大） */}
            <img
              src="/portrait.jpg"
              alt="Ningxiao Yang"
              className="w-full h-full object-cover object-center object-[center_top] scale-110 select-none pointer-events-none relative z-10"
              style={{
                filter: 'brightness(0.95) contrast(1.15) saturate(1.0)',
              }}
            />

            {/* 边缘渐变压暗：只在顶部/右侧加渐变阴影，脸部区域保持清晰 */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950/80 via-transparent to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent z-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-gray-950/70 via-transparent to-transparent z-20 pointer-events-none" />
          </div>
        </motion.div>

        {/* 信息 chips/badges - 微动效果 */}
        <motion.div
          style={{
            y: useTransform(mouseYSpring, [-0.4, 0.4], [-1, 1]),
          }}
          className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto px-2 py-2 rounded-2xl bg-gray-900/30 backdrop-blur-sm border border-gray-800/50"
        >
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
            <motion.span
              style={{
                borderColor: useTransform(
                  mouseYSpring,
                  [-0.2, 0, 0.2],
                  ['rgba(75, 85, 99, 0.5)', 'rgba(100, 116, 139, 0.6)', 'rgba(75, 85, 99, 0.5)']
                ),
              }}
              className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-800/60 border text-gray-300 backdrop-blur-sm transition-colors"
            >
              Sydney, AU
            </motion.span>
            <motion.span
              style={{
                borderColor: useTransform(
                  mouseYSpring,
                  [-0.2, 0, 0.2],
                  ['rgba(75, 85, 99, 0.5)', 'rgba(100, 116, 139, 0.6)', 'rgba(75, 85, 99, 0.5)']
                ),
              }}
              className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-800/60 border text-gray-300 backdrop-blur-sm transition-colors"
            >
              Backend • DevOps
            </motion.span>
            <motion.span
              style={{
                borderColor: useTransform(
                  mouseYSpring,
                  [-0.2, 0, 0.2],
                  ['rgba(75, 85, 99, 0.5)', 'rgba(100, 116, 139, 0.6)', 'rgba(75, 85, 99, 0.5)']
                ),
              }}
              className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-800/60 border text-gray-300 backdrop-blur-sm transition-colors"
            >
              UNSW Tutor • C++/Rust
            </motion.span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <section
        id="hero"
        ref={heroRef}
        className="relative w-full min-h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden"
      >
        {/* Particle Background */}
        <motion.div className="fixed inset-0 -z-10" style={{ y: bgTranslateY }}>
          <Canvas
            camera={{ position: [0, 0, 5] }}
            style={{ width: '100%', height: '100%' }}
            dpr={reducedMotion ? 1 : [1, 1.5]}
          >
            <Particles count={particleCount} />
          </Canvas>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ scale: heroScale, y: heroTranslateY, opacity: heroOpacity }}
          className="relative text-center px-4 z-10 w-full flex justify-center"
        >
          <Card3D className="inline-block w-full max-w-6xl">
            <div className="relative p-10 sm:p-12 md:p-16 bg-gradient-to-b from-white/10/80 via-white/5/70 to-transparent backdrop-blur-2xl rounded-[28px] border border-white/15 shadow-[0_22px_60px_rgba(15,23,42,0.9)] overflow-hidden">
              {/* 高光层 - 直接放在 hero card 内部，会被 overflow-hidden 正确裁切 */}
              <CardGlareLayers />
              
              {/* top soft glow - 往左挪，更照文字 */}
              <div className="pointer-events-none absolute -top-28 left-[35%] -translate-x-1/2 h-64 w-[50rem] rounded-full bg-gradient-to-r from-blue-500/25 via-purple-500/25 to-pink-500/25 blur-3xl" />
              {/* corner orbs */}
              <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
              <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/15 blur-3xl" />

              {/* 左右两列布局 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* 左侧：文字内容 */}
                <div className="text-center md:text-left">
                  <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl sm:text-5xl md:text-7xl font-bold mb-3 tracking-tight"
                  >
                    <span className="text-gradient">Hello, I'm</span>
                  </motion.h1>
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl sm:text-3xl md:text-5xl font-semibold mb-6 text-white drop-shadow-[0_10px_30px_rgba(15,23,42,0.8)]"
                  >
                    Ningxiao Yang
                  </motion.h2>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 min-h-[2rem] sm:min-h-[2.5rem] whitespace-nowrap"
                  >
                    Backend Engineer • <Typewriter texts={typewriterTexts} speed={100} />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-base sm:text-lg md:text-xl text-gray-200/90 mb-6 max-w-2xl mx-auto md:mx-0 px-4 md:px-0 leading-[1.7]"
                  >
                    Sydney-based engineer shipping web apps & tooling — React, Flask, Docker, CI/CD.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-sm sm:text-base md:text-lg text-gray-400/80 mb-8 max-w-2xl mx-auto md:mx-0 px-4 md:px-0 italic"
                  >
                    Clean engineering. Fast iteration. I ship.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center"
                  >
                    <Link
                      to="/"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection('projects');
                      }}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-semibold text-base sm:text-lg transition-all transform hover:translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-[0_14px_40px_rgba(37,99,235,0.55)] focus:outline-none focus:ring-2 focus:ring-blue-400/70 focus:ring-offset-2 focus:ring-offset-slate-900"
                      role="button"
                    >
                      View Web Projects
                      <span aria-hidden="true" className="inline-block translate-y-0.5">
                        →
                      </span>
                    </Link>
                    <Link
                      to="/"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection('contact');
                      }}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-semibold text-base sm:text-lg transition-all transform hover:translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] border border-white/25/80 hover:border-white/50 bg-slate-900/40 hover:bg-slate-900/70 text-slate-50/95 shadow-[0_10px_30px_rgba(15,23,42,0.85)] focus:outline-none focus:ring-2 focus:ring-slate-100/40 focus:ring-offset-2 focus:ring-offset-slate-900"
                      role="button"
                    >
                      Contact Me
                      <span aria-hidden="true" className="inline-block translate-y-0.5">
                        ✉
                      </span>
                    </Link>
                  </motion.div>
                </div>

                {/* 右侧：头像区域 */}
                <AvatarParallax />
              </div>
            </div>
          </Card3D>
        </motion.div>

        {/* Scroll Indicator (subtle, outside card, lifted further up) */}
        <ScrollIndicator className="absolute bottom-20 left-1/2 -translate-x-1/2 opacity-60 hover:opacity-90 transition-opacity" />
      </section>

      {/* Path Selector section */}
      <PathSelector />

      {/* Mini Game section - 始终保留 play 区域，Recruiter Mode 下留白 */}
      <section id="play" className="scroll-mt-28 border-t border-gray-800/60 bg-gray-950">
        {recruiterMode ? (
          <div className="h-12 md:h-16" />
        ) : (
          <Game onSkip={() => scrollToSection('about')} />
        )}
      </section>

      {/* Stacked sections for single-page scroll */}
      <section id="about" className="scroll-mt-28 border-t border-gray-800/60 bg-gradient-to-b from-gray-900 to-gray-950">
        <About />
      </section>
      <section id="projects" className="scroll-mt-28 border-t border-gray-800/60 bg-gray-950">
        <Projects />
      </section>
      <section id="experience" className="scroll-mt-28 border-t border-gray-800/60 bg-gray-900">
        <Experience />
      </section>
      <section id="contact" className="scroll-mt-28 border-t border-gray-800/60 bg-gray-950">
        <Contact />
      </section>
    </>
  );
}

export default Home;
