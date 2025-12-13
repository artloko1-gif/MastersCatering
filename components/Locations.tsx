import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Castle, Train, Building2, MapPin, X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

export const Locations: React.FC = () => {
  const { content } = useContent();
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get active location data
  const selectedLocation = content.locations.find(l => l.id === selectedLocationId);

  // Mapping icons to indices for display purposes
  const getIcon = (index: number) => {
    switch(index) {
      case 0: return Castle;
      case 1: return Building2;
      case 2: return Train;
      default: return MapPin;
    }
  };

  const openGallery = (id: string) => {
    setSelectedLocationId(id);
    setCurrentImageIndex(0);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setSelectedLocationId(null);
    document.body.style.overflow = 'unset';
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedLocation) return;
    setCurrentImageIndex((prev) => (prev + 1) % selectedLocation.imageUrls.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedLocation) return;
    setCurrentImageIndex((prev) => (prev - 1 + selectedLocation.imageUrls.length) % selectedLocation.imageUrls.length);
  };

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
          {content.locations.map((loc, index) => {
            const Icon = getIcon(index);
            const coverImage = loc.imageUrls && loc.imageUrls.length > 0 ? loc.imageUrls[0] : '';
            
            return (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                onClick={() => openGallery(loc.id)}
                className="group relative overflow-hidden rounded-2xl shadow-lg h-[500px] cursor-pointer"
              >
                <img 
                  src={coverImage} 
                  alt={loc.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90 transition-opacity duration-300" />
                
                {/* View Gallery Hint */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                   <Expand className="text-white w-5 h-5" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-3">{loc.title}</h3>
                  <p className="text-slate-200 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 mb-2">
                    {loc.description}
                  </p>
                  <span className="text-primary text-sm font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                    Prohlédnout galerii ({loc.imageUrls.length})
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={closeGallery}
          >
            <button 
              onClick={closeGallery} 
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-50"
            >
              <X size={32} />
            </button>

            <div className="w-full max-w-6xl flex flex-col items-center justify-center relative" onClick={e => e.stopPropagation()}>
               {/* Main Image Container */}
               <div className="relative w-full aspect-video max-h-[80vh] flex items-center justify-center bg-black/50 rounded-lg overflow-hidden">
                 <AnimatePresence mode="wait">
                   <motion.img
                     key={currentImageIndex}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     transition={{ duration: 0.3 }}
                     src={selectedLocation.imageUrls[currentImageIndex]}
                     alt={`${selectedLocation.title} ${currentImageIndex + 1}`}
                     className="max-w-full max-h-full object-contain"
                   />
                 </AnimatePresence>
                 
                 {/* Navigation Arrows */}
                 {selectedLocation.imageUrls.length > 1 && (
                   <>
                     <button 
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-primary text-white rounded-full transition-all"
                     >
                        <ChevronLeft size={24} />
                     </button>
                     <button 
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-primary text-white rounded-full transition-all"
                     >
                        <ChevronRight size={24} />
                     </button>
                   </>
                 )}
               </div>

               {/* Caption & Counter */}
               <div className="mt-6 text-center">
                 <h3 className="text-white font-serif text-2xl font-bold mb-1">{selectedLocation.title}</h3>
                 <p className="text-white/60 text-sm">Fotografie {currentImageIndex + 1} z {selectedLocation.imageUrls.length}</p>
                 <p className="text-white/80 mt-2 max-w-2xl mx-auto">{selectedLocation.description}</p>
               </div>

               {/* Thumbnails */}
               {selectedLocation.imageUrls.length > 1 && (
                 <div className="mt-6 flex gap-2 overflow-x-auto max-w-full pb-2 px-2 scrollbar-hide">
                    {selectedLocation.imageUrls.map((url, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                        className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === currentImageIndex ? 'border-primary opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};