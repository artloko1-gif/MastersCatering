import React from 'react';
import { UtensilsCrossed, Facebook, Instagram, Linkedin, Lock } from 'lucide-react';

interface FooterProps {
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center gap-2 text-white mb-6">
                <UtensilsCrossed size={24} className="text-primary" />
                <span className="font-serif text-xl font-bold">Master's Catering</span>
             </div>
             <p className="text-sm leading-relaxed mb-6">
               Doufáme, že se vám naše prezentace líbila a inspirovala Vás k uspořádání nezapomenutelné akce s Master's Catering.
             </p>
             <div className="flex gap-4">
               <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary hover:text-white transition-colors"><Facebook size={18} /></a>
               <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary hover:text-white transition-colors"><Instagram size={18} /></a>
               <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary hover:text-white transition-colors"><Linkedin size={18} /></a>
             </div>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">Rychlé odkazy</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="hover:text-primary transition-colors">Úvod</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Co nabízíme</a></li>
              <li><a href="#portfolio" className="hover:text-primary transition-colors">Reference</a></li>
              <li><a href="#locations" className="hover:text-primary transition-colors">Galerie</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">Kontaktujte nás</h4>
            <ul className="space-y-3">
              <li><a href="#contact" className="hover:text-primary transition-colors">Nezávazná poptávka</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Kontaktní informace</a></li>
              <li><a href="#team" className="hover:text-primary transition-colors">Náš tým</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">Právní informace</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-primary transition-colors">Ochrana osobních údajů</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Obchodní podmínky</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© 2025 Master's Catering. Všechna práva vyhrazena.</p>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
             <p>Design inspirován Master's Catering brandem.</p>
             {onAdminClick && (
               <button 
                onClick={onAdminClick}
                className="opacity-30 hover:opacity-100 transition-opacity flex items-center gap-1 text-xs"
               >
                 <Lock size={10} /> Administrace
               </button>
             )}
          </div>
        </div>
      </div>
    </footer>
  );
};
