import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { RecruiterModeProvider } from './contexts/RecruiterModeContext';
import Layout from './components/Layout';
import PageTransition from './components/PageTransition';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));
const Game = lazy(() => import('./pages/Game'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-gray-400">Loading...</p>
    </div>
  </div>
);

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Suspense fallback={<LoadingFallback />}>
                <Home />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <Suspense fallback={<LoadingFallback />}>
                <About />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/projects"
          element={
            <PageTransition>
              <Suspense fallback={<LoadingFallback />}>
                <Projects />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <PageTransition>
              <Suspense fallback={<LoadingFallback />}>
                <Contact />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/game"
          element={
            <PageTransition>
              <Suspense fallback={<LoadingFallback />}>
                <Game />
              </Suspense>
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <RecruiterModeProvider>
      <Router>
        <Layout>
          <AppRoutes />
        </Layout>
      </Router>
    </RecruiterModeProvider>
  );
}

export default App;
