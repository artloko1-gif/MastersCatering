import React from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';

export const Portfolio: React.FC = () => {
  const { content } = useContent();

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-slate-900 mb-6">
            Naše úspěšné projekty a spokojení klienti
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-slate-600">
            Jsme hrdí na projekty, které jsme realizovali a na dlouhodobé vztahy s našimi klienty. Jejich spokojenost je naší největší vizitkou.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {content.projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-72 overflow-hidden">
                <div className="absolute top-4 left-4 flex gap-2 z-20">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              
              <div className="p-8">
                <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                
                {(project.client || project.date || project.guests) && (
                  <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-500 mb-6 bg-slate-50 p-4 rounded-xl">
                    {project.client && <div><span className="font-bold text-slate-700">Klient:</span> {project.client}</div>}
                    {project.date && <div><span className="font-bold text-slate-700">Datum:</span> {project.date}</div>}
                    {project.location && <div><span className="font-bold text-slate-700">Lokace:</span> {project.location}</div>}
                    {project.guests && <div><span className="font-bold text-slate-700">Hostů:</span> {project.guests}</div>}
                  </div>
                )}

                <p className="text-slate-600 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
