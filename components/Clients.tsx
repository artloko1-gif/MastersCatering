import React from 'react';

// Using text placeholders for logos as per standard practice when real logos aren't available as separate files
// In a real app, these would be SVGs or PNGs
const clients = [
  "Dr.Max", "České dráhy", "Cinnabon", "Makro", 
  "PID", "Siemens", "Skanska", "Škoda", 
  "UniCredit Bank", "Metrostav", "Qatar Airways"
];

export const Clients: React.FC = () => {
  return (
    <section className="py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-center font-serif text-2xl text-slate-800 mb-10">
          Vybraní dlouhodobí klienti
        </h3>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          {clients.map((client, index) => (
            <div key={index} className="flex items-center justify-center h-16 px-4">
              <span className="font-bold text-xl md:text-2xl text-slate-400 hover:text-primary transition-colors cursor-default">
                {client}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};