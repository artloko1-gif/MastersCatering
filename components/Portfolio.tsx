import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';
import { ChevronLeft, ChevronRight, Calendar, Users, MapPin, User } from 'lucide-react';

export const Portfolio: React.FC = () => {
  const { content } = useContent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const projects = content.projects;
  const currentProject = projects[currentIndex];

  const handleProjectChange = (index: number) => {
    setCurrentIndex(index);
    setActiveImageIndex(0); // Reset image gallery when project changes
  };

  // Safe check if no projects exist
  if (!projects || projects.length === 0) {
    return null;
  }

  const PaginationDots = () => (
    <div className="flex justify-center gap-3">
      {projects.map((_, index) => (
        <button
          key={index}
          onClick={() => handleProjectChange(index)}
          className={`h-3 rounded-full transition-all duration-300 ${
            index === currentIndex 
              ? 'w-10 bg-primary' 
              : 'w-3 bg-slate-300 hover:bg-primary/50'
          }`}
          aria-label={`Go to project ${index + 1}`}
        />
      ))}
    </div>
  );

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-slate-900 mb-6">
            Naše vybrané projekty a spokojení klienti
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-slate-600">
            Jsme hrdí na projekty, které jsme realizovali. Prohlédněte si detailní ukázky naší práce.
          </p>
        </div>

        {/* Top Dots */}
        <div className="mb-12">
          <PaginationDots />
        </div>

        {/* Main Project Card */}
        <div className="relative min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Image Gallery Side */}
                <div className="bg-slate-900 p-2 lg:p-4 flex flex-col h-[400px] lg:h-[600px]">
                  {/* Main Image */}
                  <div className="relative flex-1 rounded-xl overflow-hidden mb-4 group">
                     <motion.img
                        key={`${currentProject.id}-${activeImageIndex}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        src={currentProject.imageUrls[activeImageIndex]}
                        alt={`${currentProject.title} view ${activeImageIndex + 1}`}
                        className="w-full h-full object-cover"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                     
                     {/* Tags Overlay */}
                     <div className="absolute top-4 left-4 flex gap-2">
                        {currentProject.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                            {tag}
                          </span>
                        ))}
                     </div>
                  </div>

                  {/* Thumbnails (only if > 1 image) */}
                  {currentProject.imageUrls.length > 1 && (
                    <div className="h-20 flex gap-2 overflow-x-auto pb-2 px-1">
                      {currentProject.imageUrls.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative flex-shrink-0 w-24 h-full rounded-lg overflow-hidden border-2 transition-all ${
                            idx === activeImageIndex ? 'border-primary opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={url} alt="thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content Side */}
                <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
                  <h3 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                    {currentProject.title}
                  </h3>

                  <div className="space-y-4 mb-8">
                    {currentProject.date && (
                      <div className="flex items-center gap-3 text-slate-600">
                        <Calendar className="text-primary w-5 h-5" />
                        <span className="font-medium">{currentProject.date}</span>
                      </div>
                    )}
                    {currentProject.client && (
                      <div className="flex items-center gap-3 text-slate-600">
                        <User className="text-primary w-5 h-5" />
                        <span className="font-medium">{currentProject.client}</span>
                      </div>
                    )}
                    {currentProject.location && (
                      <div className="flex items-center gap-3 text-slate-600">
                        <MapPin className="text-primary w-5 h-5" />
                        <span className="font-medium">{currentProject.location}</span>
                      </div>
                    )}
                    {currentProject.guests && (
                      <div className="flex items-center gap-3 text-slate-600">
                        <Users className="text-primary w-5 h-5" />
                        <span className="font-medium">{currentProject.guests} hostů</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-primary">
                    <p className="text-slate-600 leading-relaxed text-lg">
                      {currentProject.description}
                    </p>
                  </div>

                  <div className="mt-8 flex justify-between items-center text-sm text-slate-400 font-medium uppercase tracking-wider">
                     <span>Projekt {currentIndex + 1} z {projects.length}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav Arrows (Optional, but good for accessibility/UX alongside dots) */}
          <button 
            onClick={() => handleProjectChange((currentIndex - 1 + projects.length) % projects.length)}
            className="absolute top-1/2 -left-4 lg:-left-16 transform -translate-y-1/2 p-3 rounded-full bg-white text-slate-800 shadow-xl hover:bg-primary hover:text-white transition-all z-10 hidden md:block"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => handleProjectChange((currentIndex + 1) % projects.length)}
            className="absolute top-1/2 -right-4 lg:-right-16 transform -translate-y-1/2 p-3 rounded-full bg-white text-slate-800 shadow-xl hover:bg-primary hover:text-white transition-all z-10 hidden md:block"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Bottom Dots */}
        <div className="mt-12">
          <PaginationDots />
        </div>

      </div>
    </section>
  );
};