import { FolderPlus } from 'lucide-react';
import { useProjectStore } from '../store/projectStore.js';
import { useUIStore } from '../store/uiStore.js';

export function ProjectCreateModal() {
  const closeModal      = useUIStore((s) => s.closeModal);
  const newProjectName  = useUIStore((s) => s.newProjectName);
  const setNewProjectName = useUIStore((s) => s.setNewProjectName);
  const vaultHandle     = useUIStore((s) => s.vaultHandle);
  const createProject   = useProjectStore((s) => s.createProject);

  const writeProjectFile = async (handle, project) => {
    if (!handle) return;
    try {
      const safeName = project.name.replace(/[^a-zA-Z0-9çÇğĞıİöÖşŞüÜ _-]/g, '_');
      const fileHandle = await handle.getFileHandle(`${safeName}.babok.json`, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(project, null, 2));
      await writable.close();
    } catch (err) { console.warn('Dosya yazılamadı:', err); }
  };

  const handleCreate = () => {
    if (!newProjectName.trim()) return;
    const np = createProject(newProjectName);
    if (vaultHandle) writeProjectFile(vaultHandle, np);
    setNewProjectName('');
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel p-6 shadow-2xl max-w-sm w-full">
        <h3 className="font-bold text-lg text-slate-100 mb-4 flex items-center gap-2">
          <FolderPlus className="text-cyan-400 w-5 h-5" />Yeni Proje Oluştur
        </h3>
        <input
          value={newProjectName}
          onChange={e => setNewProjectName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
          placeholder="Proje adı*"
          className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300 mb-4"
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <button onClick={closeModal} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">İptal</button>
          <button onClick={handleCreate} className="px-4 py-2 text-sm bg-cyan-600/80 hover:bg-cyan-500 text-white rounded-md font-medium">Oluştur</button>
        </div>
      </div>
    </div>
  );
}
