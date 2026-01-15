import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useRecruiterMode } from '../contexts/RecruiterModeContext';

const navItems = [
  { name: 'Home', path: '/', sectionId: 'hero' },
  { name: 'Game', path: '/', sectionId: 'play' },
  { name: 'About', path: '/', sectionId: 'about' },
  { name: 'Projects', path: '/', sectionId: 'projects' },
  { name: 'Experience', path: '/', sectionId: 'experience' },
  { name: 'Contact', path: '/', sectionId: 'contact' },
];

function LayoutContent({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHome = location.pathname === '/';
  const [activeSection, setActiveSection] = useState('hero');
  
  // Recruiter Mode context
  const { recruiterMode, toggleRecruiterMode } = useRecruiterMode();

  const scrollToSection = (sectionId, fast = false) => {
    if (!sectionId) return;
    
    const el = sectionId === 'hero' ? null : document.getElementById(sectionId);
    
    if (fast) {
      // 快速跳转：直接计算位置并跳转，避免平滑滚动经过中间section
      if (sectionId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'auto' });
      } else if (el) {
        const rect = el.getBoundingClientRect();
        const scrollTop = window.scrollY + rect.top - 96; // 96px 是导航栏高度 (h-24 = 6rem = 96px)
        window.scrollTo({ top: Math.max(0, scrollTop), behavior: 'auto' });
      }
    } else {
      // 正常平滑滚动
      if (sectionId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleNavClick = (e, item) => {
    e.preventDefault();
    if (!item.sectionId) {
      navigate(item.path || '/');
      setMobileMenuOpen(false);
      return;
    }

    const sectionId = item.sectionId;

    const doScroll = () => {
      // 立即设置，不等待 requestAnimationFrame
      setActiveSection(sectionId);
      
      // 使用快速跳转，避免经过中间section时触发检测
      scrollToSection(sectionId, true);
    };

    if (location.pathname !== '/') {
      navigate('/');
      // 等路由切回 Home 再滚动
      setTimeout(doScroll, 100);
    } else {
      doScroll();
    }

    setMobileMenuOpen(false);
  };

  // 监听滚动，自动检测当前 section 并更新高亮
  useEffect(() => {
    if (!isHome) return;

    const sections = navItems
      .filter(item => item.sectionId)
      .map(item => ({
        id: item.sectionId,
        element: document.getElementById(item.sectionId),
      }))
      .filter(s => s.element);

    if (sections.length === 0) return;

    // 仅使用滚动位置来判断当前 section，逻辑更简单、可预期
    // sections 顺序与 navItems 保持一致：hero -> play -> about -> projects -> experience -> contact
    // handleScroll 会在滚动时更新 activeSection
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // 视口上方 200px 作为判断点
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollBottom = window.scrollY + windowHeight;
      
      // 如果接近页面底部（距离底部小于200px），直接选择最后一个section
      if (scrollBottom >= documentHeight - 200) {
        const lastSection = sections[sections.length - 1];
        if (lastSection && lastSection.element) {
          setActiveSection(lastSection.id);
          return;
        }
      }
      
      // 正常检测逻辑：从下往上找到第一个满足条件的 section
      let currentSection = sections[0].id;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          const sectionTop = rect.top + window.scrollY;
          const sectionBottom = sectionTop + rect.height;
          
          // 如果section的顶部在判断点上方，或者section在视口中可见
          if (sectionTop <= scrollPosition || (rect.top >= 0 && rect.top < windowHeight * 0.5)) {
            currentSection = section.id;
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    // 初始检查
    handleScroll();

    // 添加滚动监听作为主要检测方法
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [isHome, location.pathname, recruiterMode]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 h-24">
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-6xl font-extrabold tracking-tight leading-none"
            >
              <Link to="/" className="text-gradient hover:opacity-90 transition-opacity">
                Portfolio
              </Link>
            </motion.div>
            
            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                // Recruiter Mode 打开时隐藏 Game 按钮
                if (item.name === 'Game' && recruiterMode) return null;
                const isOnHome = location.pathname === '/';
                const isActive =
                  isOnHome && item.sectionId
                    ? activeSection === item.sectionId
                    : !item.sectionId && location.pathname === item.path;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      onClick={(e) => handleNavClick(e, item)}
                      className={`relative px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'text-blue-300 bg-blue-500/10 border border-blue-500/30'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800 border border-transparent'
                      }`}
                    >
                      {item.name}
                      {isActive && (
                        <motion.div
                          layoutId="underline"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                          initial={false}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            
            {/* Recruiter Mode Toggle */}
            <div className="hidden md:flex items-center gap-3 ml-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm text-gray-300">Recruiter Mode</span>
                <button
                  onClick={toggleRecruiterMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                    recruiterMode ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                  role="switch"
                  aria-checked={recruiterMode}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      recruiterMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-100 hover:text-white px-4 py-2 rounded-xl bg-gray-800/70 hover:bg-gray-700/80 border border-gray-700 shadow-md shadow-black/20 flex items-center gap-2"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
              <span className="text-sm font-semibold">Menu</span>
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="md:hidden fixed inset-0 top-24 bg-black/50"
                />
                <motion.ul
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="md:hidden mt-4 space-y-2 relative z-10 bg-gray-900/90 backdrop-blur-md border border-gray-800 rounded-2xl p-3"
                >
                  {navItems.map((item) => {
                    // Recruiter Mode 打开时隐藏 Game 按钮
                    if (item.name === 'Game' && recruiterMode) return null;
                    const isOnHome = location.pathname === '/';
                    const isActive =
                      isOnHome && item.sectionId
                        ? activeSection === item.sectionId
                        : !item.sectionId && location.pathname === item.path;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.path}
                          onClick={(e) => handleNavClick(e, item)}
                          className={`block px-4 py-3 rounded-xl transition-colors ${
                            isActive
                              ? 'text-blue-300 bg-blue-500/10 border border-blue-500/30'
                              : 'text-gray-200 hover:text-white hover:bg-gray-800 border border-transparent'
                          }`}
                        >
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </motion.ul>
              </>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 flex-1">
        {children}
      </main>

      {/* Extra spacer on Home to ensure scroll area for ScrollIndicator */}
      {isHome && <div className="h-24" />}

      {/* Footer */}
      {!isHome && (
        <footer className="bg-gray-800 border-t border-gray-700 h-14 mt-auto">
          <div className="container mx-auto px-4 h-full flex items-center justify-center text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Portfolio. Built with React & Flask.</p>
          </div>
        </footer>
      )}
    </div>
  );
}

// 导出包装组件
export default function Layout({ children }) {
  return <LayoutContent>{children}</LayoutContent>;
}
