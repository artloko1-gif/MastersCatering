import React from 'react';
import { useContent } from '../contexts/ContentContext';

export const Clients: React.FC = () => {
  const { content } = useContent();
  // Safe fallback if clients array is empty/undefined
  const clients = content.clients || [];

  return (
    <section className="py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-center font-serif text-2xl text-slate-800 mb-10">
          Vybraní dlouhodobí klienti
        </h3>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {clients.map((client) => (
            <div key={client.id} className="flex items-center justify-center h-20 px-4 group">
              {client.logoUrl ? (
                <img 
                  src={client.logoUrl} 
                  alt={client.name} 
                  title={client.name}
                  className="max-h-full max-w-[150px] object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 filter"
                />
              ) : (
                <span className="font-bold text-xl md:text-2xl text-slate-400 group-hover:text-primary transition-colors cursor-default">
                  {client.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};