import React from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';

export const Team: React.FC = () => {
  const { content } = useContent();
  const { team } = content;

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
              src={team.groupImage} 
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
                   src={team.managerImage} 
                   alt={team.managerName}
                   className="w-full h-full object-cover"
                 />
               </div>
               
               <h3 className="font-serif text-3xl font-bold text-slate-900">{team.managerName}</h3>
               <p className="text-primary font-bold uppercase tracking-wider text-sm mb-6">{team.managerRole}</p>
               
               <p className="text-slate-600 mb-6 leading-relaxed">
                 "{team.managerQuote}"
               </p>

               <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 w-full">
                 <p className="font-serif italic text-primary-dark text-center md:text-left">
                   Motto našeho týmu: <br/>“{team.teamMotto}”
                 </p>
               </div>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};