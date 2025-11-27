import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

export const Hero: React.FC = () => {
  const { content } = useContent();

  return (
    <div className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={content.heroImage}
          alt="Elegant catering setup"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-900/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-sm font-medium tracking-widest uppercase mb-6 bg-white/10 backdrop-blur-sm">
            Exkluzivní Cateringové Služby
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6">
            Váš partner pro <br/>
            <span className="text-primary-light">nezapomenutelné</span> <br/>
            gastronomické zážitky
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-200 mb-10 font-light leading-relaxed">
            Dovolte nám přetvořit vaše představy v kulinářskou realitu. V Master's Catering se specializujeme na vytváření jedinečných gastronomických zážitků, které dokonale doplní jakoukoli událost.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#contact"
              className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-primary/30 transform hover:-translate-y-1"
            >
              Nezávazná poptávka
            </a>
            <a 
              href="#about"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold rounded-full transition-all duration-300"
            >
              Více o nás
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <a href="#about" className="flex flex-col items-center text-white/70 hover:text-white transition-colors">
          <span className="text-xs uppercase tracking-widest mb-2">Objevte více</span>
          <ChevronDown className="animate-bounce w-6 h-6" />
        </a>
      </motion.div>
    </div>
  );
};
