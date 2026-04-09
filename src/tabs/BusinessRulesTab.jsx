import React from 'react';
import { BookOpen, Plus, Pencil, Trash2 } from 'lucide-react';
import { useProjectStore, selectActiveProject } from '../store/projectStore.js';
import { useUIStore } from '../store/uiStore.js';

export function BusinessRulesTab() {
  const activeProject = useProjectStore(selectActiveProject);
  const openModal  = useUIStore((s) => s.openModal);
  const deleteBR      = useProjectStore((s) => s.deleteBR);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2"><BookOpen className="text-blue-400 w-5 h-5" />Is Kurallari</h2>
          <p className="text-sm text-slate-400">{(activeProject.businessRules || []).length} kural · {(activeProject.businessRules || []).filter(r => r.status === 'Aktif').length} aktif</p>
        </div>
        <button onClick={() => openModal('businessRule')} className="bg-blue-600/80 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-black/20"><Plus className="w-4 h-4" />Kural Ekle</button>
      </div>
      {(activeProject.businessRules || []).length === 0 ? (
        <div className="text-center py-16 text-slate-400"><BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>Henuz is kurali eklenmemis.</p><button onClick={() => openModal('businessRule')} className="mt-3 text-xs text-blue-400 hover:text-blue-300 transition-colors">+ Kural Ekle</button></div>
      ) : (
        <div className="bg-white/5 rounded-xl border border-white/10 shadow-lg shadow-black/20 overflow-hidden" style={{ maxHeight: 'calc(100vh - 220px)' }}>
          <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
            <table className="w-full text-sm">
              <thead className="bg-white/5 border-b border-white/10 sticky top-0 z-10" style={{ backdropFilter: 'blur(12px)' }}>
                <tr>{['BR ID', 'Kural Basligi', 'Kategori', 'Kaynak', 'Versiyon', 'Durum', ''].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100/5">
                {(activeProject.businessRules || []).map(r => (
                  <tr key={r.id} className={`hover:bg-white/5 transition-colors ${r.status === 'Gecersiz' ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3 text-xs font-mono text-slate-400 whitespace-nowrap">{r.brId}</td>
                    <td className={`px-4 py-3 font-medium text-slate-100 ${r.status === 'Gecersiz' ? 'line-through' : ''}`}>{r.title}</td>
                    <td className="px-4 py-3"><span className="text-xs bg-white/10 text-slate-400 px-2 py-0.5 rounded-full">{r.category}</span></td>
                    <td className="px-4 py-3 text-xs text-slate-400">{r.source}{r.sourceRef ? ` (${r.sourceRef})` : ''}</td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-400">{r.version}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${r.status === 'Aktif' ? 'bg-emerald-500/10 text-emerald-400' : r.status === 'Revize Edildi' ? 'bg-amber-500/10 text-amber-400' : 'bg-white/10 text-slate-500'}`}>{r.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openModal('businessRule', { editingId: r.id })} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-blue-600 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => deleteBR(r.id)} className="p-1 hover:bg-rose-500/10 rounded text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
