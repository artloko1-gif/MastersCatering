import React, { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { LogOut, Image as ImageIcon, Briefcase, Plus, Trash2, Save, X } from 'lucide-react';
import { PortfolioItem } from '../../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { content, updateGlobalImages, addProject, removeProject } = useContent();
  const [activeTab, setActiveTab] = useState<'images' | 'projects'>('images');
  
  // Image State
  const [heroUrl, setHeroUrl] = useState(content.heroImage);
  const [aboutUrl, setAboutUrl] = useState(content.aboutImage);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  // New Project State
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState<Partial<PortfolioItem>>({
    title: '',
    client: '',
    date: '',
    guests: 0,
    description: '',
    imageUrl: '',
    tags: []
  });

  const handleSaveImages = () => {
    updateGlobalImages(heroUrl, aboutUrl);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.imageUrl) return;

    addProject({
      id: Date.now().toString(),
      title: newProject.title!,
      client: newProject.client,
      date: newProject.date,
      guests: Number(newProject.guests),
      location: "Pražský hrad (nebo dle výběru)", // Simplified for demo
      description: newProject.description || '',
      imageUrl: newProject.imageUrl!,
      tags: newProject.tags || ['Nové']
    });

    setIsAddingProject(false);
    setNewProject({ title: '', client: '', date: '', guests: 0, description: '', imageUrl: '', tags: [] });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Nav */}
      <nav className="bg-slate-900 text-white shadow-lg">
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
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-2xl">
            <h3 className="font-serif text-2xl font-bold text-slate-800 mb-6">Hlavní fotografie</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Hlavní banner (Hero)</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={heroUrl}
                      onChange={(e) => setHeroUrl(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="w-24 h-12 rounded-lg overflow-hidden bg-slate-100">
                    <img src={heroUrl} alt="Hero preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">O nás (About)</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={aboutUrl}
                      onChange={(e) => setAboutUrl(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="w-24 h-12 rounded-lg overflow-hidden bg-slate-100">
                    <img src={aboutUrl} alt="About preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button 
                  onClick={handleSaveImages}
                  className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  <Save size={18} />
                  Uložit změny
                </button>
                {saveStatus === 'saved' && (
                  <span className="text-green-600 font-bold animate-pulse">Uloženo!</span>
                )}
              </div>
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
                <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group">
                  <div className="relative h-48">
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
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
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-lg mb-2 line-clamp-1">{project.title}</h4>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex justify-between items-center text-xs text-slate-400">
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
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="font-bold text-xl">Nový projekt</h3>
                <button onClick={() => setIsAddingProject(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddProject} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Název akce *</label>
                  <input required className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200" 
                    value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">URL Obrázku *</label>
                  <input required className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200" 
                    placeholder="https://..."
                    value={newProject.imageUrl} onChange={e => setNewProject({...newProject, imageUrl: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Klient</label>
                    <input className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200" 
                      value={newProject.client} onChange={e => setNewProject({...newProject, client: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Datum</label>
                    <input className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200" 
                      value={newProject.date} onChange={e => setNewProject({...newProject, date: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Počet hostů</label>
                  <input type="number" className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200" 
                    value={newProject.guests || ''} onChange={e => setNewProject({...newProject, guests: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Popis</label>
                  <textarea className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200" rows={3}
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
