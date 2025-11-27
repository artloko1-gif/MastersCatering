import React from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';

export const About: React.FC = () => {
  const { content } = useContent();

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full -z-10" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-slate-100 rounded-full -z-10" />
            <img 
              src={content.aboutImage}
              alt="Catering detail" 
              className="rounded-2xl shadow-2xl w-full object-cover h-[500px]"
            />
            <div className="absolute bottom-8 right-8 bg-white p-6 rounded-lg shadow-xl max-w-xs">
              <p className="font-serif italic text-primary-dark text-lg">
                “Kvalita, chuť a servis na míru vašim představám.”
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">O nás</h2>
            <h3 className="font-serif text-4xl md:text-5xl text-slate-900 mb-8 leading-tight">
              Vítejte u <span className="text-primary">Master's Catering</span>
            </h3>
            
            <div className="space-y-6 text-lg text-slate-600">
              <p>
                Vítejte ve světě Master's Catering, kde se spojuje špičková gastronomie s dokonalým servisem. Vytváříme svěží a elegantní prostředí pro vaše nezapomenutelné události.
              </p>
              <p>
                Prožijte s námi kulinářský zážitek, který si budete pamatovat. Jsme připraveni proměnit jakoukoliv událost v jedinečnou slavnost. Ať už plánujete firemní večírek nebo svatbu snů, jsme tu pro vás.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a 
                href="#services"
                className="px-8 py-3 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-colors shadow-lg"
              >
                Objevte naši nabídku
              </a>
              <a 
                href="#contact"
                className="px-8 py-3 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                Kontaktujte nás
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
