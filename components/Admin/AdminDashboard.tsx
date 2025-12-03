import React, { useState, useEffect } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { LogOut, Image as ImageIcon, Briefcase, Plus, Trash2, Save, X } from 'lucide-react';
import { PortfolioItem, LocationItem } from '../../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { content, updateContent, addProject, removeProject } = useContent();
  const [activeTab, setActiveTab] = useState<'images' | 'projects'>('images');
  
  // Image State
  const [formData, setFormData] = useState({
    logoUrl: '',
    heroImage: '',
    aboutImage: '',
    teamImage: '',
    managerImage: '',
    contactImage: '',
  });

  const [locations, setLocations] = useState<LocationItem[]>([]);

  // Initialize local state from context
  useEffect(() => {
    setFormData({
      logoUrl: content.logoUrl,
      heroImage: content.heroImage,
      aboutImage: content.aboutImage,
      teamImage: content.teamImage,
      managerImage: content.managerImage,
      contactImage: content.contactImage
    });
    setLocations(content.locations);
  }, [content]);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  // New Project State
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [rawImagesInput, setRawImagesInput] = useState('');
  
  const [newProject, setNewProject] = useState<Partial<PortfolioItem>>({
    title: '',
    client: '',
    date: '',
    guests: 0,
    description: '',
    imageUrls: [],
    tags: []
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (index: number, value: string) => {
    const newLocs = [...locations];
    newLocs[index].imageUrl = value;
    setLocations(newLocs);
  };

  const handleSaveImages = () => {
    updateContent({
      ...formData,
      locations: locations
    });
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) return;

    // Parse images from textarea
    const images = rawImagesInput
      .split('\n')
      .map(url => url.trim())
      .filter(url => url !== '');

    if (images.length === 0) {
      alert("Prosím zadejte alespoň jednu URL obrázku.");
      return;
    }

    addProject({
      id: Date.now().toString(),
      title: newProject.title!,
      client: newProject.client,
      date: newProject.date,
      guests: Number(newProject.guests),
      location: "Pražský hrad (nebo dle výběru)",
      description: newProject.description || '',
      imageUrls: images,
      tags: newProject.tags || ['Nové']
    });

    setIsAddingProject(false);
    setNewProject({ title: '', client: '', date: '', guests: 0, description: '', imageUrls: [], tags: [] });
    setRawImagesInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Nav */}
      <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="font-serif text-xl font-bold">Master's Catering <span className="text-primary font-sans text-sm font-normal ml-2">CMS</span></span>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm font-bold">Odhlásit</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('images')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'images' 
                ? 'bg-primary text-white shadow-lg' 
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ImageIcon size={20} />
            Fotografie webu
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'projects' 
                ? 'bg-primary text-white shadow-lg' 
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Briefcase size={20} />
            Projekty a Realizace
          </button>
        </div>

        {/* IMAGES TAB */}
        {activeTab === 'images' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h3 className="font-serif text-2xl font-bold text-slate-800 mb-6">Základní fotografie</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-black mb-2 uppercase tracking-wide">Logo (URL adresa)</label>
                  <input 
                    type="text" 
                    value={formData.logoUrl}
                    onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                    placeholder="https://..."
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-black font-medium focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <p className="text-xs text-slate-500 mt-1">Pokud prázdné, zobrazí se výchozí ikona.</p>
                </div>

                <div>
                  <label className="block text-sm font-black text-black mb-2 uppercase tracking-wide">Hlavní banner (Hero)</label>
                  <p className="text-xs text-slate-500 mb-2">Pozadí pro "Váš partner pro nezapomenutelné..."</p>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={formData.heroImage}
                        onChange={(e) => handleInputChange('heroImage', e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-black font-medium"
                      />
                    </div>
                    <div className="w-24 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                      <img src={formData.heroImage} alt="Hero preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-black mb-2 uppercase tracking-wide">O nás (About)</label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={formData.aboutImage}
                        onChange={(e) => handleInputChange('aboutImage', e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-black font-medium"
                      />
                    </div>
                    <div className="w-24 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                      <img src={formData.aboutImage} alt="About preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                 <div>
                  <label className="block text-sm font-black text-black mb-2 uppercase tracking-wide">Tým (Hlavní fotka)</label>
                  <p className="text-xs text-slate-500 mb-2">Pozadí sekce "Profesionálové s vášní..."</p>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={formData.teamImage}
                        onChange={(e) => handleInputChange('teamImage', e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-black font-medium"
                      />
                    </div>
                    <div className="w-24 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                      <img src={formData.teamImage} alt="Team preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-black mb-2 uppercase tracking-wide">Manažer (Profilovka)</label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={formData.managerImage}
                        onChange={(e) => handleInputChange('managerImage', e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-black font-medium"
                      />
                    </div>
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                      <img src={formData.managerImage} alt="Manager preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-black mb-2 uppercase tracking-wide">Kontakt (Budova)</label>
                  <p className="text-xs text-slate-500 mb-2">Fotka u "Jsme tu pro vás"</p>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={formData.contactImage}
                        onChange={(e) => handleInputChange('contactImage', e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-black font-medium"
                      />
                    </div>
                    <div className="w-24 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                      <img src={formData.contactImage} alt="Contact preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-2xl font-bold text-slate-800">Unikátní Lokality</h3>
              </div>
              
              <div className="space-y-8">
                {locations.map((loc, index) => (
                  <div key={loc.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="block text-sm font-black text-black mb-2 uppercase tracking-wide">
                      {loc.title}
                    </label>
                    <div className="flex flex-col gap-3">
                      <div className="relative h-32 w-full rounded-lg overflow-hidden bg-slate-200">
                        <img src={loc.imageUrl} alt={loc.title} className="w-full h-full object-cover" />
                      </div>
                      <input 
                        type="text" 
                        value={loc.imageUrl}
                        onChange={(e) => handleLocationChange(index, e.target.value)}
                        className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-black font-medium"
                        placeholder="URL obrázku lokality"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 flex items-center gap-4 sticky bottom-0 bg-white pb-2 border-t border-slate-100 mt-8">
                <button 
                  onClick={handleSaveImages}
                  className="w-full px-6 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors flex justify-center items-center gap-2 shadow-lg shadow-primary/30"
                >
                  <Save size={20} />
                  Uložit všechny změny
                </button>
              </div>
              {saveStatus === 'saved' && (
                  <div className="text-center mt-2 text-green-600 font-bold animate-pulse">Vše úspěšně uloženo!</div>
              )}
            </div>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            {/* Project List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Add New Card */}
              <button 
                onClick={() => setIsAddingProject(true)}
                className="h-[400px] border-3 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20">
                  <Plus size={32} />
                </div>
                <span className="font-bold text-lg">Přidat nový projekt</span>
              </button>

              {content.projects.map(project => (
                <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group flex flex-col h-[400px]">
                  <div className="relative h-48 shrink-0">
                    {/* Display first image as preview */}
                    <img src={project.imageUrls[0]} alt={project.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2">
                      <button 
                        onClick={() => {
                          if(window.confirm('Opravdu chcete smazat tento projekt?')) removeProject(project.id);
                        }}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                      {project.imageUrls.length} {project.imageUrls.length === 1 ? 'fotka' : (project.imageUrls.length < 5 ? 'fotky' : 'fotek')}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h4 className="font-bold text-lg mb-2 line-clamp-2 text-slate-900">{project.title}</h4>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-1">{project.description}</p>
                    <div className="flex justify-between items-center text-xs text-slate-400 mt-auto pt-4 border-t border-slate-50">
                      <span>{project.date}</span>
                      <span>{project.client}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Project Modal Overlay */}
        {isAddingProject && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="font-bold text-xl text-slate-900">Nový projekt</h3>
                <button onClick={() => setIsAddingProject(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddProject} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">Název akce *</label>
                  <input required className="w-full p-3 bg-slate-50 rounded-lg border border-slate-300 text-black font-medium" 
                    value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">URL Obrázků (jeden na řádek, 1-5)*</label>
                  <textarea required className="w-full p-3 bg-slate-50 rounded-lg border border-slate-300 text-black font-mono text-sm" 
                    placeholder={"https://image1.jpg\nhttps://image2.jpg"}
                    rows={4}
                    value={rawImagesInput} onChange={e => setRawImagesInput(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-black mb-1">Klient</label>
                    <input className="w-full p-3 bg-slate-50 rounded-lg border border-slate-300 text-black font-medium" 
                      value={newProject.client} onChange={e => setNewProject({...newProject, client: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-black mb-1">Datum</label>
                    <input className="w-full p-3 bg-slate-50 rounded-lg border border-slate-300 text-black font-medium" 
                      value={newProject.date} onChange={e => setNewProject({...newProject, date: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">Počet hostů</label>
                  <input type="number" className="w-full p-3 bg-slate-50 rounded-lg border border-slate-300 text-black font-medium" 
                    value={newProject.guests || ''} onChange={e => setNewProject({...newProject, guests: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">Popis</label>
                  <textarea className="w-full p-3 bg-slate-50 rounded-lg border border-slate-300 text-black font-medium" rows={3}
                    value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark">
                    Přidat do portfolia
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
