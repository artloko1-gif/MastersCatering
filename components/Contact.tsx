import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import emailjs from '@emailjs/browser';

export const Contact: React.FC = () => {
  const { content, addInquiry } = useContent();
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');

    if (formRef.current) {
      // Create FormData object to easily extract values
      const formData = new FormData(formRef.current);

      emailjs.sendForm(
        'service_lf1u0vo', // Service ID
        'template_4z923ne', // Template ID
        formRef.current,
        { publicKey: '1q6MCRFxIYFlQli0D' } // Public Key
      )
      .then(
        async () => {
          // Email sent successfully, now save to DB
          try {
             await addInquiry({
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                eventType: formData.get('event_type') as string || 'Neurčeno',
                guests: Number(formData.get('guests')),
                dateLocation: formData.get('date_location') as string || '',
                email: formData.get('email') as string || '',
                requirements: formData.get('message') as string || '',
                status: 'new'
             });
             
             setFormStatus('success');
             alert('Zpráva úspěšně odeslána a uložena.');
             if (formRef.current) formRef.current.reset();
          } catch (dbError) {
             console.error("Failed to save inquiry to DB", dbError);
             // Still show success for user as email went through
             setFormStatus('success');
             alert('Zpráva odeslána na email, ale nepodařilo se ji uložit do historie.');
          }
        },
        (error) => {
          setFormStatus('idle');
          alert('Odeslání selhalo: ' + error.text);
          console.error('FAILED...', error.text);
        }
      );
    }
  };

  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Contact Info Side */}
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Jsme tu pro vás</h2>
            <p className="text-slate-300 mb-10 text-lg leading-relaxed">
              Máte dotazy, potřebujete poradit nebo si přejete nezávaznou konzultaci? Neváhejte se na nás obrátit. Rádi vám pomůžeme s plánováním vaší události.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-lg text-primary">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Telefon</h4>
                  <p className="text-slate-300 font-serif text-xl">+420 725 497 170</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-lg text-primary">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">E-mail</h4>
                  <a href="mailto:david.schwarczinger@jlv.cz" className="text-slate-300 hover:text-primary transition-colors">david.schwarczinger@jlv.cz</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-lg text-primary">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Adresa</h4>
                  <p className="text-slate-300">
                    JLV, a.s.<br/>
                    Chodovská 3/228, 141 00 Praha 4
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 rounded-2xl overflow-hidden shadow-2xl h-64 border border-white/10">
              <img 
                src={content.contactImage}
                alt="Sídlo JLV nebo cateringové prostory" 
                className="w-full h-full object-cover opacity-60 hover:opacity-80 transition-opacity"
              />
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="bg-white rounded-3xl p-8 md:p-10 text-slate-800 shadow-2xl"
          >
            <h3 className="font-serif text-3xl font-bold mb-2">Rychlá poptávka</h3>
            <p className="text-slate-500 mb-8">Vyplňte formulář a my se vám co nejdříve ozveme s nabídkou.</p>

            {formStatus === 'success' ? (
               <div className="text-center py-20 bg-green-50 rounded-2xl">
                 <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Send size={32} />
                 </div>
                 <h4 className="text-2xl font-bold text-green-800 mb-2">Odesláno!</h4>
                 <p className="text-green-600">Děkujeme za vaši poptávku. Brzy vás budeme kontaktovat.</p>
                 <button onClick={() => setFormStatus('idle')} className="mt-6 text-sm font-bold text-green-700 underline">Poslat další</button>
               </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Typ akce</label>
                    <select name="event_type" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-black">
                      <option value="Svatba">Svatba</option>
                      <option value="Firemní večírek">Firemní večírek</option>
                      <option value="Oslava">Oslava</option>
                      <option value="Konference">Konference</option>
                      <option value="Jiné">Jiné</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Počet hostů</label>
                    <input 
                      type="number" 
                      name="guests"
                      placeholder="Např. 50" 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Datum a místo</label>
                  <input 
                    type="text" 
                    name="date_location"
                    placeholder="Kdy a kde se událost koná?" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Kontaktní email</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    placeholder="vas@email.cz" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Speciální požadavky</label>
                  <textarea 
                    rows={4}
                    name="message"
                    placeholder="Diety, preferované menu, výzdoba..." 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none text-black"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={formStatus === 'sending'}
                  className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {formStatus === 'sending' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Odesílám...
                    </>
                  ) : (
                    <>Odeslat poptávku</>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};