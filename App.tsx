import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { Clients } from './components/Clients';
import { Team } from './components/Team';
import { Locations } from './components/Locations';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Login } from './components/Admin/Login';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { ContentProvider } from './contexts/ContentContext';
import { ArrowUp } from 'lucide-react';

const PublicSite: React.FC<{ onAdminClick: () => void }> = ({ onAdminClick }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="font-sans text-slate-800 antialiased bg-slate-50 selection:bg-primary selection:text-white">
      <Navbar />
      
      <main>
        <div id="home">
          <Hero />
        </div>
        <div id="about">
          <About />
        </div>
        <div id="services">
          <Services />
        </div>
        <div id="locations">
          <Locations />
        </div>
        <div id="portfolio">
          <Portfolio />
        </div>
        <div id="clients">
          <Clients />
        </div>
        <div id="team">
          <Team />
        </div>
        <div id="contact">
          <Contact />
        </div>
      </main>

      <Footer onAdminClick={onAdminClick} />

      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-primary text-white shadow-xl transition-all duration-300 z-50 hover:bg-primary-dark ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<'public' | 'login' | 'admin'>('public');

  return (
    <ContentProvider>
      {view === 'public' && (
        <PublicSite onAdminClick={() => setView('login')} />
      )}
      
      {view === 'login' && (
        <Login 
          onLogin={() => setView('admin')} 
          onBack={() => setView('public')} 
        />
      )}

      {view === 'admin' && (
        <AdminDashboard onLogout={() => setView('public')} />
      )}
    </ContentProvider>
  );
};

export default App;
