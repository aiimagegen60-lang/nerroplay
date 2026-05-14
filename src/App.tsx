import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTopButton from './components/BackToTopButton';
import RouterScrollToTop from './components/RouterScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardProvider } from './context/DashboardContext';
import { AuthProvider } from './context/AuthContext';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const BlogLanding = lazy(() => import('./pages/BlogLanding'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const GamesLanding = lazy(() => import('./pages/GamesLanding'));
const RashiDetail = lazy(() => import('./pages/RashiDetail'));
const KundliMatchingHome = lazy(() => import('./pages/KundliMatchingHome'));
const KundliMatchingReport = lazy(() => import('./pages/KundliMatchingReport'));
import BMIAnalyzer from './pages/BMIAnalyzer';
import BMIReport from './pages/BMIReport';
import CalorieCalculator from './pages/CalorieCalculator';
import CalorieReport from './pages/CalorieReport';
const AstroChat = lazy(() => import('./pages/AstroChat'));
const GunaMilanGuide = lazy(() => import('./pages/learn/GunaMilanGuide'));
const KundliMatchingGuide = lazy(() => import('./pages/learn/KundliMatchingGuide'));
const ManglikDoshaGuide = lazy(() => import('./pages/learn/ManglikDoshaGuide'));
import ToolsLanding from './pages/ToolsLanding';
import ToolDetail from './pages/ToolDetail';
import Legal from './pages/Legal';

function LoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
      <div className="text-accent font-mono text-xs tracking-widest animate-pulse">INITIALIZING CORE...</div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isAstroChat = location.pathname === '/tools/astro-chat';

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary transition-colors duration-300">
      {!isAstroChat && <Navbar />}
      
      <main className="flex-grow">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/tools" element={<ToolsLanding />} />
            <Route path="/tools/:id" element={<ToolDetail />} />
            <Route path="/games" element={<GamesLanding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/blogs" element={<BlogLanding />} />
            <Route path="/blogs/:id" element={<BlogPost />} />
            <Route path="/rashi/:slug" element={<RashiDetail />} />

            {/* BMI Analyzer PRO Routes */}
            <Route path="/tools/bmi-calculator" element={<BMIAnalyzer />} />
            <Route path="/report/bmi" element={<BMIReport />} />
            
            {/* Calorie Calculator Routes */}
            <Route path="/tools/calorie-calculator" element={<CalorieCalculator />} />
            <Route path="/report/calorie" element={<CalorieReport />} />
            
            {/* Kundli Matching Routes */}
            <Route path="/kundli-matching" element={<KundliMatchingHome />} />
            <Route path="/kundli-matching/report" element={<KundliMatchingReport />} />
            <Route path="/learn/guna-milan" element={<GunaMilanGuide />} />
            <Route path="/learn/kundli-matching" element={<KundliMatchingGuide />} />
            <Route path="/learn/manglik-dosha" element={<ManglikDoshaGuide />} />
            
            {/* Astro Chat tool */}
            <Route path="/tools/astro-chat" element={<AstroChat />} />
            
            {/* Legal Routes */}
            <Route path="/legal/privacy" element={<Legal type="privacy" />} />
            <Route path="/legal/terms" element={<Legal type="terms" />} />
            <Route path="/legal/disclaimer" element={<Legal type="disclaimer" />} />
            <Route path="/legal/cookies" element={<Legal type="cookies" />} />
            <Route path="/legal/ai-transparency" element={<Legal type="ai-transparency" />} />
            <Route path="/legal/data-usage" element={<Legal type="data-usage" />} />
            <Route path="/legal/faq" element={<Legal type="faq" />} />
            <Route path="/legal/dmca" element={<Legal type="dmca" />} />
            
            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>

      {!isAstroChat && <Footer />}
      {!isAstroChat && <BackToTopButton />}
      <RouterScrollToTop />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <LanguageProvider>
          <AuthProvider>
            <DashboardProvider>
              <ThemeProvider>
                <Router>
                  <AppContent />
                </Router>
              </ThemeProvider>
            </DashboardProvider>
          </AuthProvider>
        </LanguageProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}
