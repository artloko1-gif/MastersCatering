import React from 'react';
import { motion } from 'framer-motion';

export const Team: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-slate-900 mb-6">
            Profesionálové s vášní pro gastronomii
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-slate-600">
            Za každým úspěšným cateringem stojí tým oddaných profesionálů. V Master's Catering spojujeme talent, zkušenosti a vášeň.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12 bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2"
          >
            <img 
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=2577&auto=format&fit=crop" 
              alt="Master's Catering Team" 
              className="rounded-2xl shadow-lg w-full h-[400px] object-cover"
            />
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="w-full md:w-1/2 text-center md:text-left"
          >
             <div className="flex flex-col items-center md:items-start">
               <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary mb-6 shadow-md">
                 <img 
                   src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop" 
                   alt="David Schwarczinger"
                   className="w-full h-full object-cover"
                 />
               </div>
               
               <h3 className="font-serif text-3xl font-bold text-slate-900">David Schwarczinger</h3>
               <p className="text-primary font-bold uppercase tracking-wider text-sm mb-6">Event & Catering Manager</p>
               
               <p className="text-slate-600 mb-6 leading-relaxed">
                 "Event manažer, který se postará o každý detail vaší akce. Jeho organizační schopnosti a smysl pro estetiku zaručují dokonalý průběh."
               </p>

               <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 w-full">
                 <p className="font-serif italic text-primary-dark text-center md:text-left">
                   Motto našeho týmu: <br/>“Vaše spokojenost je naší největší odměnou.”
                 </p>
               </div>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};