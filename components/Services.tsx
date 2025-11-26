import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Heart, Salad, Utensils } from 'lucide-react';
import { ServiceItem } from '../types';

const services: ServiceItem[] = [
  {
    title: "Firemní akce",
    description: "Konference, večírky, teambuildingy. Zajistíme reprezentativní catering, který podtrhne vaši značku a zapůsobí na partnery.",
    icon: Briefcase
  },
  {
    title: "Svatby a oslavy",
    description: "Proměníme váš velký den v nezapomenutelnou kulinářskou pohádku. Od welcome drinku po půlnoční bufet, s ohledem na každý detail.",
    icon: Heart
  },
  {
    title: "Speciální diety",
    description: "Veganské, vegetariánské nebo bezlepkové menu? S námi žádný problém. Připravíme chutná a kreativní jídla pro každého hosta.",
    icon: Salad
  },
  {
    title: "Kompletní servis",
    description: "Výzdoba, nádobí, profesionální obsluha - vše pod jednou střechou. Užijte si akci bez starostí, my se postaráme o zbytek.",
    icon: Utensils
  }
];

export const Services: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-slate-900 mb-6">
            Kompletní cateringové služby na míru
          </h2>
          <p className="text-lg text-slate-600">
            Master's Catering je vaším spolehlivým partnerem pro všechny typy akcí. Od firemních akcí až po snové svatby - vždy s individuálním přístupem.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white p-8 md:p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <service.icon size={32} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};