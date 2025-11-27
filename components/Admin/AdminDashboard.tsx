import React, { useState, useRef } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { LogOut, Image as ImageIcon, Briefcase, Plus, Trash2, Save, X, Users, MapPin, Upload, Pencil } from 'lucide-react';
import { PortfolioItem, LocationItem } from '../../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

// --- Helper Component for File Upload ---
const ImageUpload: React.FC<{ 
  currentImage: string; 
  onImageChange: (base64: string) => void; 
  label: string 
}> = ({ currentImage, onImageChange, label }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <div className="flex gap-4 items-start">
        <div className="w-32 h-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
           {currentImage ? (
             <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-slate-400">Bez obr.</div>
           )}
        </div>
        <div className="flex-1">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="flex flex-col gap-2">
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-sm font-bold flex items-center gap-2 w-fit transition-colors"
            >
              <Upload size={16} />
              Vybrat z počítače
            </button>
            <p className="text-xs text-slate-500">
              Podporované formáty: JPG, PNG. Bez omezení velikosti (ukládá se do prohlížeče).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { 
    content, 
    updateGlobalImages, 
    addProject, 
    updateProject, 
    removeProject,
    updateTeam,
    updateLocations
  } = useContent();

  const [activeTab, setActiveTab] = useState<'images' | 'projects' | 'team' | 'locations'>('images');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  // Global Images State
  const [heroUrl, setHeroUrl] = useState(content.heroImage);
  const [aboutUrl, setAboutUrl] = useState(content.aboutImage);

  // Team State
  const [teamData, setTeamData] = useState(content.team);

  // Locations State
  const [locationsData, setLocationsData] = useState<LocationItem[]>(content.locations);

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  
  const initialProjectState: Partial<PortfolioItem> = {
    title: '',
    client: '',
    date: '',
    guests: 0,
    description: '',
    imageUrls: [],
    tags: []
  };
  const [projectForm, setProjectForm] = useState<Partial<PortfolioItem>>(initialProjectState);

  // --- Handlers ---

  const showSaveSuccess = () => {
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleSaveGlobalImages = () => {
    updateGlobalImages(heroUrl, aboutUrl);
    showSaveSuccess();
  };

  const handleSaveTeam = () => {
    updateTeam(teamData);
    showSaveSuccess();
  };

  const handleSaveLocations = () => {
    updateLocations(locationsData);
    showSaveSuccess();
  };

  const openAddProject = () => {
    setEditingProjectId(null);
    setProjectForm(initialProjectState);
    setIsProjectModalOpen(true);
  };

  const openEditProject = (project: PortfolioItem) => {
    setEditingProjectId(project.id);
    setProjectForm({ ...project });
    setIsProjectModalOpen(true);
  };

  const handleProjectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const promises = files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file as Blob);
        });
      });

      Promise.all(promises).then(base64Images => {
        setProjectForm(prev => ({
          ...prev,
          imageUrls: [...(prev.imageUrls || []), ...base64Images]
        }));
      });
    }
  };

  const removeProjectImage = (indexToRemove: number) => {
    setProjectForm(prev => ({
      ...prev,
      imageUrls: prev.imageUrls?.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title) return;

    const finalProject: PortfolioItem = {
      id: editingProjectId || Date.now().toString(),
      title: projectForm.title!,
      client: projectForm.client,
      date: projectForm.date,
      guests: Number(projectForm.guests),
      location: projectForm.location || "Lokace dle výběru",
      description: projectForm.description || '',
      imageUrls: projectForm.imageUrls || [],
      tags: projectForm.tags?.length ? projectForm.tags : ['Nové']
    };

    if (editingProjectId) {
      updateProject(editingProjectId, finalProject);
    } else {
      addProject(finalProject);
    }

    setIsProjectModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Admin Nav */}
      <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-40">
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
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-white rounded-xl shadow-sm border border-slate-100 w-fit">
          {[
            { id: 'images', icon: ImageIcon, label: 'Hlavní foto' },
            { id: 'projects', icon: Briefcase, label: 'Projekty' },
            { id: 'team', icon: Users, label: 'Tým' },
            { id: 'locations', icon: MapPin, label: 'Lokality' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-bold transition-all text-sm ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- IMAGES TAB --- */}
        {activeTab === 'images' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-3xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="font-serif text-2xl font-bold text-slate-800 mb-6">Fotografie webu</h3>
            <div className="space-y-8">
              <ImageUpload 
                label="Hlavní banner (Hero)" 
                currentImage={heroUrl} 
                onImageChange={setHeroUrl} 
              />
              <hr className="border-slate-100" />
              <ImageUpload 
                label="Sekce O nás (About)" 
                currentImage={aboutUrl} 
                onImageChange={setAboutUrl} 
              />
              
              <div className="pt-4">
                <button 
                  onClick={handleSaveGlobalImages}
                  className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  <Save size={18} />
                  Uložit změny
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- TEAM TAB --- */}
        {activeTab === 'team' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-3xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="font-serif text-2xl font-bold text-slate-800 mb-6">Správa týmu</h3>
            <div className="space-y-6">
              <ImageUpload 
                label="Společná fotka týmu" 
                currentImage={teamData.groupImage} 
                onImageChange={(val) => setTeamData({...teamData, groupImage: val})} 
              />
              
              <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Jméno manažera</label>
                    <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-black" 
                      value={teamData.managerName} onChange={e => setTeamData({...teamData, managerName: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Pozice</label>
                    <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-black" 
                      value={teamData.managerRole} onChange={e => setTeamData({...teamData, managerRole: e.target.value})} />
                 </div>
              </div>

              <ImageUpload 
                label="Fotka manažera" 
                currentImage={teamData.managerImage} 
                onImageChange={(val) => setTeamData({...teamData, managerImage: val})} 
              />

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Citát manažera</label>
                <textarea rows={3} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-black" 
                  value={teamData.managerQuote} onChange={e => setTeamData({...teamData, managerQuote: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Motto týmu</label>
                <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-black" 
                  value={teamData.teamMotto} onChange={e => setTeamData({...teamData, teamMotto: e.target.value})} />
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleSaveTeam}
                  className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  <Save size={18} />
                  Uložit změny
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- LOCATIONS TAB --- */}
        {activeTab === 'locations' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="font-serif text-2xl font-bold text-slate-800">Editace lokalit</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locationsData.map((loc, idx) => (
                <div key={loc.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                  <div className="mb-4">
                    <ImageUpload 
                       label={`Obrázek: ${loc.title}`}
                       currentImage={loc.imageUrl}
                       onImageChange={(val) => {
                         const newLocs = [...locationsData];
                         newLocs[idx].imageUrl = val;
                         setLocationsData(newLocs);
                       }}
                    />
                  </div>
                  <div className="space-y-3">
                    <input 
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-black"
                      value={loc.title}
                      onChange={(e) => {
                        const newLocs = [...locationsData];
                        newLocs[idx].title = e.target.value;
                        setLocationsData(newLocs);
                      }}
                    />
                     <textarea 
                      rows={4}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-black"
                      value={loc.description}
                      onChange={(e) => {
                        const newLocs = [...locationsData];
                        newLocs[idx].description = e.target.value;
                        setLocationsData(newLocs);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={handleSaveLocations}
              className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              Uložit všechny lokality
            </button>
          </div>
        )}

        {/* --- PROJECTS TAB --- */}
        {activeTab === 'projects' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            {/* Project List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Add New Card */}
              <button 
                onClick={openAddProject}
                className="h-[400px] border-3 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20">
                  <Plus size={32} />
                </div>
                <span className="font-bold text-lg">Přidat nový projekt</span>
              </button>

              {content.projects.map(project => (
                <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group flex flex-col h-[400px] relative">
                  <div className="relative h-48 shrink-0">
                    <img src={project.imageUrls[0]} alt={project.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button 
                        onClick={() => openEditProject(project)}
                        className="p-3 bg-white text-slate-800 rounded-full hover:text-primary hover:scale-110 transition-all shadow-xl"
                        title="Upravit"
                      >
                        <Pencil size={20} />
                      </button>
                      <button 
                        onClick={() => {
                          if(window.confirm('Opravdu chcete smazat tento projekt?')) removeProject(project.id);
                        }}
                        className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 hover:scale-110 transition-all shadow-xl"
                        title="Smazat"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none">
                      {project.imageUrls.length} {project.imageUrls.length === 1 ? 'fotka' : (project.imageUrls.length < 5 ? 'fotky' : 'fotek')}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h4 className="font-bold text-lg mb-2 line-clamp-2">{project.title}</h4>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-3 flex-1">{project.description}</p>
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

        {/* Global Success Message */}
        {saveStatus === 'saved' && (
           <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl font-bold animate-bounce z-50">
             Uloženo!
           </div>
        )}

        {/* Project Modal Overlay */}
        {isProjectModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="font-bold text-xl">{editingProjectId ? 'Upravit projekt' : 'Nový projekt'}</h3>
                <button onClick={() => setIsProjectModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleProjectSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Název akce *</label>
                  <input required className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 text-black" 
                    value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
                </div>
                
                {/* Image Upload Area */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Fotografie (nahrajte více najednou)</label>
                  
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {projectForm.imageUrls?.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                        <img src={url} alt="upload" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeProjectImage(idx)}
                          className="absolute inset-0 bg-red-500/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
                       <Plus size={24} />
                       <span className="text-xs mt-1">Přidat</span>
                       <input type="file" multiple accept="image/*" onChange={handleProjectFiles} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Klient</label>
                    <input className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 text-black" 
                      value={projectForm.client} onChange={e => setProjectForm({...projectForm, client: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Datum</label>
                    <input className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 text-black" 
                      value={projectForm.date} onChange={e => setProjectForm({...projectForm, date: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Počet hostů</label>
                  <input type="number" className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 text-black" 
                    value={projectForm.guests || ''} onChange={e => setProjectForm({...projectForm, guests: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Lokace</label>
                  <input className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 text-black" 
                    value={projectForm.location} onChange={e => setProjectForm({...projectForm, location: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Popis</label>
                  <textarea className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 text-black" rows={3}
                    value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} />
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsProjectModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Zrušit
                  </button>
                  <button 
                    type="submit" 
                    className="flex-[2] py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    {editingProjectId ? 'Uložit změny' : 'Přidat do portfolia'}
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