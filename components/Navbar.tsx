import React, { useState, useEffect } from 'react';
import { Menu, X, UtensilsCrossed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';

const navLinks = [
  { name: 'Úvod', href: '#home' },
  { name: 'O nás', href: '#about' },
  { name: 'Služby', href: '#services' },
  { name: 'Lokality', href: '#locations' },
  { name: 'Reference', href: '#portfolio' },
  { name: 'Kontakt', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { content } = useContent();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Custom scroll handler with delay for mobile performance
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false); // Close menu immediately
    
    // Small timeout ensures the menu closing animation doesn't conflict with the scroll
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        // 80px offset for the fixed navbar
        const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }, 150);
  };

  // Determine if navbar should look "active" (white bg, dark text)
  // This happens if user scrolled OR if mobile menu is open
  const isNavbarActive = isScrolled || isOpen;

  const activeLogo = isNavbarActive 
    ? (content.logoLightBgUrl || content.logoUrl) 
    : (content.logoDarkBgUrl || content.logoUrl);

  const shouldInvertLogo = !isNavbarActive && !content.logoDarkBgUrl && content.logoUrl;

  return (
    <nav
      className={`fixed w-full z-[100] transition-all duration-300 ${
        isNavbarActive ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer z-[101]" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {activeLogo ? (
              <img 
                src={activeLogo} 
                alt="Logo" 
                className={`h-12 w-auto object-contain transition-all duration-300 ${shouldInvertLogo ? 'brightness-0 invert' : ''}`} 
              />
            ) : (
              <>
                <div className={`p-2 rounded-full ${isNavbarActive ? 'bg-primary text-white' : 'bg-white text-primary'}`}>
                   <UtensilsCrossed size={24} />
                </div>
                <span className={`font-serif text-2xl font-bold tracking-tight ${isNavbarActive ? 'text-primary-dark' : 'text-white drop-shadow-md'}`}>
                  Master's Catering
                </span>
              </>
            )}
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-sm uppercase tracking-wider font-semibold transition-colors duration-200 cursor-pointer ${
                  isNavbarActive 
                    ? 'text-slate-600 hover:text-primary' 
                    : 'text-white/90 hover:text-white drop-shadow-sm'
                }`}
              >
                {link.name}
              </a>
            ))}
            <a
               href="#contact"
               onClick={(e) => handleNavClick(e, '#contact')}
               className={`px-5 py-2 rounded-full text-sm font-bold transition-all -translate-y-0.5 cursor-pointer ${
                 isNavbarActive 
                   ? 'bg-primary text-white hover:bg-primary-dark' 
                   : 'bg-white text-primary hover:bg-slate-100'
               }`}
            >
              Poptávka
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center z-[101]">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md transition-colors ${isNavbarActive ? 'text-slate-700' : 'text-white'}`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Full Screen Overlay) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed inset-0 top-0 left-0 w-full bg-white z-[90] flex flex-col pt-24 px-6 overflow-y-auto"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block px-4 py-5 text-xl font-serif font-bold text-slate-800 hover:text-primary border-b border-slate-100 last:border-0"
                >
                  {link.name}
                </a>
              ))}
              <a
                 href="#contact"
                 onClick={(e) => handleNavClick(e, '#contact')}
                 className="mt-6 block w-full text-center px-6 py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg"
              >
                Nezávazná poptávka
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};