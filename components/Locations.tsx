import React from 'react';
import { motion } from 'framer-motion';
import { Castle, Train, Building2 } from 'lucide-react';
import { LocationItem } from '../types';

const locations: LocationItem[] = [
  {
    title: "Rudolfova slévárna",
    description: "Historické prostory Pražského hradu, ideální pro galavečeře a prestižní firemní akce. Jedinečná atmosféra v srdci Prahy.",
    imageUrl: "https://images.unsplash.com/photo-1590623253754-52d37c68b75c?q=80&w=1974&auto=format&fit=crop",
    icon: Castle
  },
  {
    title: "Sál Sirius",
    description: "Moderní a flexibilní prostory v Pardubicích, vhodné pro konference, plesy a velké oslavy. Nejmodernější technické vybavení.",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
    icon: Building2
  },
  {
    title: "Speciální vlaky",
    description: "Catering v pohybu - nezapomenutelné zážitky na palubě historických i moderních vlaků. Originální řešení pro netradiční události.",
    imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=2184&auto=format&fit=crop",
    icon: Train
  }
];

export const Locations: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-widest uppercase text-sm">Exkluzivita</span>
          <h2 className="font-serif text-4xl md:text-5xl text-slate-900 mt-3 mb-6">
            Unikátní lokality pro vaše akce
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600">
            Kromě špičkového cateringu vám nabízíme i exkluzivní lokality, které dodají vaší události nezapomenutelnou atmosféru.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {locations.map((loc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative overflow-hidden rounded-2xl shadow-lg h-[500px]"
            >
              <img 
                src={loc.imageUrl} 
                alt={loc.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                  <loc.icon size={24} className="text-white" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3">{loc.title}</h3>
                <p className="text-slate-200 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {loc.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};