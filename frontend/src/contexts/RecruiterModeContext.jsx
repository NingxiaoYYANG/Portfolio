import { createContext, useContext, useState, useEffect } from 'react';

const RECRUITER_MODE_KEY = 'portfolio_recruiter_mode';

const RecruiterModeContext = createContext(null);

export function RecruiterModeProvider({ children }) {
  // 从 localStorage 读取初始值，默认为 true（Recruiter Mode ON）
  const [recruiterMode, setRecruiterModeState] = useState(() => {
    try {
      const stored = localStorage.getItem(RECRUITER_MODE_KEY);
      return stored !== null ? JSON.parse(stored) : true;
    } catch {
      return true;
    }
  });

  // 设置 Recruiter Mode，同时更新状态和 localStorage
  const setRecruiterMode = (value) => {
    setRecruiterModeState(value);
    try {
      localStorage.setItem(RECRUITER_MODE_KEY, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save recruiter mode to localStorage:', error);
    }
  };

  // 切换 Recruiter Mode
  const toggleRecruiterMode = () => {
    setRecruiterMode(!recruiterMode);
  };

  // 滚动到指定 section
  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // 打开 Play Mode（设置模式为 false 并滚动到 #play）
  const openPlayMode = () => {
    setRecruiterMode(false);
    // 使用 setTimeout 确保状态更新后再滚动
    setTimeout(() => {
      scrollToSection('play');
    }, 100);
  };

  return (
    <RecruiterModeContext.Provider
      value={{
        recruiterMode,
        setRecruiterMode,
        toggleRecruiterMode,
        scrollToSection,
        openPlayMode,
      }}
    >
      {children}
    </RecruiterModeContext.Provider>
  );
}

export function useRecruiterMode() {
  const context = useContext(RecruiterModeContext);
  if (!context) {
    throw new Error('useRecruiterMode must be used within RecruiterModeProvider');
  }
  return context;
}
