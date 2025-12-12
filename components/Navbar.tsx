
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

  // Logic to determine which logo image to show
  // If scrolled (white bg) -> prefer LightBgUrl, fallback to generic logoUrl
  // If top (transparent bg) -> prefer DarkBgUrl, fallback to generic logoUrl
  const activeLogo = isScrolled 
    ? (content.logoLightBgUrl || content.logoUrl) 
    : (content.logoDarkBgUrl || content.logoUrl);

  // Logic to determine if we need to force the logo to white using CSS filters
  // We do this ONLY if we are at the top (!isScrolled) AND we are using the generic fallback logo 
  // (assuming the generic logo is dark/colored and needs to be white on the dark hero image)
  const shouldInvertLogo = !isScrolled && !content.logoDarkBgUrl && content.logoUrl;

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            {activeLogo ? (
              <img 
                src={activeLogo} 
                alt="Logo" 
                className={`h-12 w-auto object-contain transition-all duration-300 ${shouldInvertLogo ? 'brightness-0 invert' : ''}`} 
              />
            ) : (
              <>
                <div className={`p-2 rounded-full ${isScrolled ? 'bg-primary text-white' : 'bg-white text-primary'}`}>
                   <UtensilsCrossed size={24} />
                </div>
                <span className={`font-serif text-2xl font-bold tracking-tight ${isScrolled ? 'text-primary-dark' : 'text-white drop-shadow-md'}`}>
                  Master's Catering
                </span>
              </>
            )}
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm uppercase tracking-wider font-semibold transition-colors duration-200 ${
                  isScrolled 
                    ? 'text-slate-600 hover:text-primary' 
                    : 'text-white/90 hover:text-white drop-shadow-sm'
                }`}
              >
                {link.name}
              </a>
            ))}
            <a
               href="#contact"
               className={`px-5 py-2 rounded-full text-sm font-bold transition-all -translate-y-0.5 ${
                 isScrolled 
                   ? 'bg-primary text-white hover:bg-primary-dark' 
                   : 'bg-white text-primary hover:bg-slate-100'
               }`}
            >
              Poptávka
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${isScrolled ? 'text-slate-700' : 'text-white'}`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 shadow-xl overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50 border-b border-slate-50 last:border-0"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
