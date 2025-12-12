
import React, { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { LogOut, Image as ImageIcon, Briefcase, Plus, Trash2, Save, X, Upload, Pencil, Users, MapPin, AlignLeft, MessageSquare, Check, Calendar, Mail, Download, FileCode } from 'lucide-react';
import { PortfolioItem, LocationItem } from '../../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

// --- Image Compression Utility ---
const compressImage = (file: File, maxWidth = 1200, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            resolve(event.target?.result as string);
            return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to JPEG with reduced quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

// Internal component for handling file uploads (Base64 + Compression)
const ImageUpload: React.FC<{ 
  currentImage: string; 
  onImageChange: (base64: string) => void;
  label: string;
  description?: string;
  isAvatar?: boolean;
}> = ({ currentImage, onImageChange, label, description, isAvatar = false }) => {
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file, isAvatar ? 400 : 1200);
        onImageChange(compressedBase64);
      } catch (error) {
        console.error("Compression failed", error);
        alert("Chyba při zpracování obrázku.");
      }
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-black text-black mb-2 uppercase tracking-wide">{label}</label>
      {description && <p className="text-xs text-slate-500 mb-2">{description}</p>}
      <div className="flex gap-4 items-center">
        <div className={`overflow-hidden bg-slate-100 border border-slate-200 shrink-0 ${isAvatar ? 'w-20 h-20 rounded-full' : 'w-32 h-20 rounded-lg'}`}>
          {currentImage ? (
             <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-slate-400">
               <ImageIcon size={20} />
             </div>
          )}
        </div>
        <div className="flex-1">
          <label className="cursor-pointer flex items-center justify-center w-full px-4 py-3 bg-white border border-slate-300 border-dashed rounded-lg hover:bg-slate-50 hover:border-primary transition-all group">
            <div className="flex items-center gap-2 text-slate-600 group-hover:text-primary">
              <Upload size={18} />
              <span className="text-sm font-medium">Vybrat soubor z počítače</span>
            </div>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { content, updateContent, updateTeam, updateLocation, addProject, updateProject, removeProject, removeInquiry } = useContent();
  const [activeTab, setActiveTab] = useState<'images' | 'texts' | 'team' | 'locations' | 'projects' | 'inquiries'>('inquiries');
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'saving_file'>('idle');

  // New/Edit Project State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  
  const [projectForm, setProjectForm] = useState<Partial<PortfolioItem>>({
    title: '',
    client: '',
    date: '',
    guests: 0,
    description: '',
    imageUrls: [],
    tags: []
  });

  const triggerSave = () => {
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const getFileContent = () => {
    return `import { SiteContent } from '../types';

export const defaultContent: SiteContent = ${JSON.stringify(content, null, 2)};`;
  };

  // --- Export Functionality (Fallback) ---
  const handleExportForWeb = () => {
    const fileContent = getFileContent();
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'defaultContent.ts';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert("Soubor 'defaultContent.ts' byl stažen. Přesuňte ho do složky 'data/'.");
  };

  // --- Direct File Save (File System Access API) ---
  const handleDirectFileSave = async () => {
    if (!('showSaveFilePicker' in window)) {
      alert("Váš prohlížeč nepodporuje přímé ukládání. Použijte prosím tlačítko Stáhnout.");
      handleExportForWeb();
      return;
    }

    try {
      setSaveStatus('saving_file');
      
      // @ts-ignore - Types for File System Access API might be missing in some setups
      const handle = await window.showSaveFilePicker({
        suggestedName: 'defaultContent.ts',
        types: [{
          description: 'TypeScript File',
          accept: { 'text/typescript': ['.ts'], 'text/plain': ['.ts'] },
        }],
      });

      const writable = await handle.createWritable();
      await writable.write(getFileContent());
      await writable.close();

      alert("ÚSPĚCH! Soubor byl přepsán.\n\nNyní stačí, aby se aplikace znovu načetla (pokud běžíte lokálně, stiskněte F5).");
      setSaveStatus('idle');
    } catch (err: any) {
      console.error(err);
      setSaveStatus('idle');
      if (err.name !== 'AbortError') {
        alert("Chyba při ukládání souboru. Zkuste to znovu nebo použijte stažení.");
      }
    }
  };

  const openAddProject = () => {
    setEditingProjectId(null);
    setProjectForm({ title: '', client: '', date: '', guests: 0, description: '', imageUrls: [], tags: [] });
    setIsModalOpen(true);
  };

  const openEditProject = (project: PortfolioItem) => {
    setEditingProjectId(project.id);
    setProjectForm(project);
    setIsModalOpen(true);
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title) return;

    const tags = projectForm.tags && projectForm.tags.length > 0 ? projectForm.tags : ['Reference'];

    if (editingProjectId) {
      updateProject(editingProjectId, {
        ...projectForm,
        tags
      });
    } else {
      addProject({
        id: Date.now().toString(),
        title: projectForm.title!,
        client: projectForm.client,
        date: projectForm.date,
        guests: Number(projectForm.guests),
        location: projectForm.location || "Lokace",
        description: projectForm.description || '',
        imageUrls: projectForm.imageUrls || [],
        tags: tags
      });
    }

    setIsModalOpen(false);
    triggerSave();
  };

  const handleProjectImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files) as File[];
      const newImages: string[] = [];
      let processedCount = 0;

      for (const file of fileArray) {
        try {
          const compressed = await compressImage(file, 1200);
          newImages.push(compressed);
        } catch (err) {
          console.error("Skipped image due to error", err);
        }
        processedCount++;
      }

      setProjectForm(prev => ({
          ...prev,
          imageUrls: [...(prev.imageUrls || []), ...newImages]
      }));
    }
  };

  // Function to format date safely
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('cs-CZ');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
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
        <div className="flex flex-wrap gap-4 mb-8">
           <button onClick={() => setActiveTab('inquiries')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'inquiries' ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
            <MessageSquare size={20} /> Poptávky
            {content.inquiries && content.inquiries.length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {content.inquiries.length}
              </span>
            )}
          </button>
          <button onClick={() => setActiveTab('texts')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'texts' ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
            <AlignLeft size={20} /> Texty
          </button>
          <button onClick={() => setActiveTab('images')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'images' ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
            <ImageIcon size={20} /> Hlavní foto
          </button>
          <button onClick={() => setActiveTab('team')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'team' ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
            <Users size={20} /> Tým
          </button>
          <button onClick={() => setActiveTab('locations')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'locations' ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
            <MapPin size={20} /> Lokality
          </button>
          <button onClick={() => setActiveTab('projects')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'projects' ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
            <Briefcase size={20} /> Reference
          </button>
        </div>

        {/* ================== INQUIRIES TAB ================== */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-4xl">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-serif text-2xl font-bold text-slate-800">Doručené poptávky</h3>
               <span className="text-sm text-slate-500">Celkem: {content.inquiries?.length || 0}</span>
             </div>

             {(!content.inquiries || content.inquiries.length === 0) ? (
               <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl">
                 <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                 <p>Zatím žádné poptávky.</p>
               </div>
             ) : (
               <div className="space-y-4">
                 {content.inquiries.map((inq) => (
                   <div key={inq.id} className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative hover:shadow-md transition-shadow">
                     <div className="grid md:grid-cols-2 gap-4 mb-4">
                       <div>
                         <div className="flex items-center gap-2 text-primary font-bold mb-1">
                           <Calendar size={16} /> {formatDate(inq.createdAt)}
                         </div>
                         <h4 className="text-lg font-bold text-slate-900">{inq.eventType} ({inq.guests} hostů)</h4>
                       </div>
                       <div className="md:text-right">
                          <div className="flex items-center gap-2 justify-start md:justify-end text-slate-700">
                             <Mail size={16} /> <a href={`mailto:${inq.email}`} className="hover:underline font-medium">{inq.email}</a>
                          </div>
                          <div className="text-sm text-slate-500 mt-1">
                             <MapPin size={14} className="inline mr-1"/> {inq.dateLocation}
                          </div>
                       </div>
                     </div>
                     
                     <div className="bg-white p-4 rounded-lg border border-slate-100 text-slate-700 mb-4">
                       <p className="whitespace-pre-wrap">{inq.requirements}</p>
                     </div>

                     <div className="flex justify-end">
                       <button 
                         onClick={() => {
                           if(confirm('Opravdu chcete tuto poptávku smazat?')) removeInquiry(inq.id);
                         }}
                         className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                       >
                         <Trash2 size={16} /> Smazat poptávku
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

        {/* ================== TEXTS TAB ================== */}
        {activeTab === 'texts' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-3xl">
            <h3 className="font-serif text-2xl font-bold text-slate-800 mb-6">Editace textů</h3>
            
            <div className="space-y-6">
              <h4 className="font-bold text-primary uppercase tracking-wider text-sm border-b pb-2">Úvodní sekce (Hero)</h4>
              <div>
                <label className="block text-sm font-black text-black mb-1 uppercase">Hlavní nadpis</label>
                <textarea 
                  className="w-full p-2 border rounded text-black font-serif text-lg" 
                  rows={3}
                  value={content.textContent?.heroTitle} 
                  onChange={(e) => { updateContent({ textContent: { ...content.textContent!, heroTitle: e.target.value } }); triggerSave(); }}
                />
              </div>
              <div>
                <label className="block text-sm font-black text-black mb-1 uppercase">Podnadpis (Malý text nad)</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded text-black" 
                  value={content.textContent?.heroTagline} 
                  onChange={(e) => { updateContent({ textContent: { ...content.textContent!, heroTagline: e.target.value } }); triggerSave(); }}
                />
              </div>
              <div>
                <label className="block text-sm font-black text-black mb-1 uppercase">Popis (Slogan pod)</label>
                <textarea 
                  className="w-full p-2 border rounded text-black" 
                  rows={3}
                  value={content.textContent?.heroSubtitle} 
                  onChange={(e) => { updateContent({ textContent: { ...content.textContent!, heroSubtitle: e.target.value } }); triggerSave(); }}
                />
              </div>

              <h4 className="font-bold text-primary uppercase tracking-wider text-sm border-b pb-2 mt-8">Sekce O nás</h4>
              <div>
                <label className="block text-sm font-black text-black mb-1 uppercase">Nadpis</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded text-black font-serif" 
                  value={content.textContent?.aboutTitle} 
                  onChange={(e) => { updateContent({ textContent: { ...content.textContent!, aboutTitle: e.target.value } }); triggerSave(); }}
                />
              </div>
              <div>
                <label className="block text-sm font-black text-black mb-1 uppercase">Hlavní text</label>
                <textarea 
                  className="w-full p-2 border rounded text-black h-40" 
                  value={content.textContent?.aboutDescription} 
                  onChange={(e) => { updateContent({ textContent: { ...content.textContent!, aboutDescription: e.target.value } }); triggerSave(); }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================== GENERAL IMAGES TAB ================== */}
        {activeTab === 'images' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-3xl">
            <h3 className="font-serif text-2xl font-bold text-slate-800 mb-6">Základní fotografie webu</h3>
            
            <ImageUpload 
               label="Logo (pro tmavé pozadí)" 
               description="Zobrazí se nahoře na banneru. Ideálně bílé/světlé PNG."
               currentImage={content.logoDarkBgUrl || content.logoUrl} 
               onImageChange={(val) => { updateContent({ logoDarkBgUrl: val }); triggerSave(); }} 
            />
            <ImageUpload 
               label="Logo (pro světlé pozadí)" 
               description="Zobrazí se při scrollování na bílé liště. Ideálně tmavé PNG."
               currentImage={content.logoLightBgUrl || content.logoUrl} 
               onImageChange={(val) => { updateContent({ logoLightBgUrl: val }); triggerSave(); }} 
            />

            <hr className="my-6"/>

            <ImageUpload 
               label="Hlavní banner (Hero)" 
               description="Velký obrázek na úvodní stránce."
               currentImage={content.heroImage} 
               onImageChange={(val) => { updateContent({ heroImage: val }); triggerSave(); }} 
            />
            <ImageUpload 
               label="O nás (Sekce Vítejte)" 
               currentImage={content.aboutImage} 
               onImageChange={(val) => { updateContent({ aboutImage: val }); triggerSave(); }} 
            />
             <ImageUpload 
               label="Kontakt (Obrázek budovy)" 
               currentImage={content.contactImage} 
               onImageChange={(val) => { updateContent({ contactImage: val }); triggerSave(); }} 
            />
          </div>
        )}

        {/* ================== TEAM TAB ================== */}
        {activeTab === 'team' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-3xl">
            <h3 className="font-serif text-2xl font-bold text-slate-800 mb-6">Správa sekce Tým</h3>
            
            <ImageUpload 
               label="Hlavní foto týmu" 
               currentImage={content.team.teamImage} 
               onImageChange={(val) => { updateTeam({ teamImage: val }); triggerSave(); }} 
            />
            
            <hr className="my-6 border-slate-100"/>
            
            <div className="grid md:grid-cols-2 gap-6">
               <div>
                  <ImageUpload 
                    label="Profilovka manažera" 
                    isAvatar
                    currentImage={content.team.managerImage} 
                    onImageChange={(val) => { updateTeam({ managerImage: val }); triggerSave(); }} 
                  />
               </div>
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-black text-black mb-1 uppercase">Jméno manažera</label>
                   <input type="text" className="w-full p-2 border rounded text-black" value={content.team.managerName} onChange={(e) => { updateTeam({managerName: e.target.value}); triggerSave(); }} />
                 </div>
                 <div>
                   <label className="block text-sm font-black text-black mb-1 uppercase">Pozice</label>
                   <input type="text" className="w-full p-2 border rounded text-black" value={content.team.managerRole} onChange={(e) => { updateTeam({managerRole: e.target.value}); triggerSave(); }} />
                 </div>
               </div>
            </div>

            <div className="mt-4">
                <label className="block text-sm font-black text-black mb-1 uppercase">Citát manažera</label>
                <textarea className="w-full p-2 border rounded text-black" rows={3} value={content.team.managerQuote} onChange={(e) => { updateTeam({managerQuote: e.target.value}); triggerSave(); }} />
            </div>
             <div className="mt-4">
                <label className="block text-sm font-black text-black mb-1 uppercase">Motto týmu</label>
                <input className="w-full p-2 border rounded text-black" value={content.team.teamMotto} onChange={(e) => { updateTeam({teamMotto: e.target.value}); triggerSave(); }} />
            </div>
          </div>
        )}

        {/* ================== LOCATIONS TAB ================== */}
        {activeTab === 'locations' && (
          <div className="space-y-6 max-w-4xl">
             <h3 className="font-serif text-2xl font-bold text-slate-800">Unikátní Lokality</h3>
             {content.locations.map((loc) => (
                <div key={loc.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-start">
                   <div className="shrink-0">
                      <ImageUpload 
                        label="" 
                        currentImage={loc.imageUrl} 
                        onImageChange={(val) => { updateLocation(loc.id, { imageUrl: val }); triggerSave(); }}
                      />
                   </div>
                   <div className="flex-1 w-full space-y-4">
                      <div>
                        <label className="block text-xs font-black text-black mb-1 uppercase">Název lokality</label>
                        <input type="text" className="w-full p-2 border rounded text-black font-bold" value={loc.title} onChange={(e) => { updateLocation(loc.id, {title: e.target.value}); triggerSave(); }} />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-black mb-1 uppercase">Popis</label>
                        <textarea className="w-full p-2 border rounded text-black text-sm" rows={3} value={loc.description} onChange={(e) => { updateLocation(loc.id, {description: e.target.value}); triggerSave(); }} />
                      </div>
                   </div>
                </div>
             ))}
          </div>
        )}

        {/* ================== PROJECTS TAB ================== */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
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
                         className="p-3 bg-white text-slate-900 rounded-full hover:bg-primary hover:text-white transition-colors shadow-lg"
                         title="Upravit"
                       >
                         <Pencil size={20} />
                       </button>
                       <button 
                        onClick={() => {
                          if(window.confirm('Opravdu chcete smazat tento projekt?')) {
                             removeProject(project.id);
                             triggerSave();
                          }
                        }}
                        className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        title="Smazat"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h4 className="font-bold text-lg mb-2 line-clamp-2 text-slate-900">{project.title}</h4>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-1">{project.description}</p>
                    <div className="flex justify-between items-center text-xs text-slate-400 mt-auto pt-4 border-t border-slate-50">
                      <span>{project.date}</span>
                      <span>{project.imageUrls.length} fotek</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="font-bold text-xl text-slate-900">
                   {editingProjectId ? 'Upravit projekt' : 'Nový projekt'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleProjectSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">Název akce *</label>
                  <input required className="w-full p-3 bg-slate-50 rounded-lg border border-slate-300 text-black font-medium" 
                    value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-2">Fotografie</label>
                  
                  {/* Image List */}
                  {projectForm.imageUrls && projectForm.imageUrls.length > 0 && (
                     <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
                        {projectForm.imageUrls.map((img, idx) => (
                           <div key={idx} className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden group">
                              <img src={img} className="w-full h-full object-cover" />
                              <button 
                                 type="button"
                                 onClick={() => {
                                    const newImgs = projectForm.imageUrls!.filter((_, i) => i !== idx);
                                    setProjectForm({...projectForm, imageUrls: newImgs});
                                 }}
                                 className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        ))}
                     </div>
                  )}

                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-32 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl hover:border-primary hover:bg-primary/5 transition-all">
                      <div className="flex flex-col items-center gap-2 text-slate-500">
                        <Upload size={24} />
                        <span className="font-bold text-sm">Nahrát další fotografie</span>
                        <span className="text-xs">Klikněte pro výběr (lze vybrat více najednou)</span>
                      </div>
                      <input type="file" multiple accept="image/*" onChange={handleProjectImagesChange} className="hidden" />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-black mb-1">Klient</label>
                    <input className="w-full p-3 bg-slate-50 rounded-lg border border-slate-300 text-black font-medium" 
                      value={projectForm.client} onChange={e => setProjectForm({...projectForm, client: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-black mb-1">Datum</label>
                    <input className="w-full p-3 bg-slate-50 rounded-lg border border-slate-300 text-black font-medium" 
                      value={projectForm.date} onChange={e => setProjectForm({...projectForm, date: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">Počet hostů</label>
                  <input type="number" className="w-full p-3 bg-slate-50 rounded-lg border border-slate-300 text-black font-medium" 
                    value={projectForm.guests || ''} onChange={e => setProjectForm({...projectForm, guests: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">Popis</label>
                  <textarea className="w-full p-3 bg-slate-50 rounded-lg border border-slate-300 text-black font-medium" rows={4}
                    value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} />
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark shadow-lg">
                    {editingProjectId ? 'Uložit změny' : 'Vytvořit projekt'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* FIXED BOTTOM SAVE BAR */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] flex justify-between items-center z-40">
        <div className="flex items-center gap-2">
           {saveStatus === 'saved' && (
             <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
               <Check size={16} /> Změny uloženy v prohlížeči
             </div>
           )}
        </div>
        <div className="flex gap-4">
           {/* Primary Permanent Save Button */}
           <button 
             onClick={handleDirectFileSave}
             disabled={saveStatus === 'saving_file'}
             className={`px-6 py-3 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 border ${saveStatus === 'saving_file' ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-900'}`}
             title="Přímo přepsat soubor defaultContent.ts na disku (vyžaduje podporovaný prohlížeč)"
           >
             <FileCode size={20} />
             {saveStatus === 'saving_file' ? 'Ukládám...' : 'Přepsat soubor v kódu'}
           </button>

           {/* Fallback Download Button */}
           <button 
             onClick={handleExportForWeb}
             className="px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all flex items-center gap-2"
             title="Stáhnout jako soubor (pokud přímý zápis nefunguje)"
           >
             <Download size={20} />
             <span className="hidden sm:inline">Stáhnout</span>
           </button>

           <div className="h-10 w-px bg-slate-200 mx-2"></div>

           {/* Temporary Browser Save */}
           <button 
             onClick={triggerSave}
             className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-all flex items-center gap-2"
           >
             <Save size={20} />
             <span className="hidden sm:inline">Uložit dočasně</span>
           </button>
        </div>
      </div>
    </div>
  );
};
