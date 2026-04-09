import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { GANTT_COLORS } from '../constants/index.js';
import { useProjectStore, selectActiveProject } from '../store/projectStore.js';
import { useUIStore, DEFAULT_GANTT_FORM } from '../store/uiStore.js';

export function GanttModal() {
  const activeProject  = useProjectStore(selectActiveProject);
  const saveGanttTask  = useProjectStore((s) => s.saveGanttTask);
  const modalData  = useUIStore((s) => s.modalData);
  const closeModal = useUIStore((s) => s.closeModal);

  const editingGanttTask = modalData.editingId
    ? (activeProject?.ganttTasks || []).find((t) => t.id === modalData.editingId)
    : null;

  const [form, setForm] = useState(
    editingGanttTask
      ? { ...DEFAULT_GANTT_FORM, ...editingGanttTask }
      : { ...DEFAULT_GANTT_FORM }
  );

  const onSave = () => {
    if (!form.name.trim() || !form.startDate || !form.endDate) return;
    saveGanttTask(form, modalData.editingId);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel p-6 shadow-2xl max-w-md w-full">
        <h3 className="font-bold text-lg text-slate-100 mb-4 flex items-center gap-2"><CalendarDays className="text-cyan-500 w-5 h-5" />{editingGanttTask ? 'Görevi Düzenle' : 'Yeni Görev / Faz'}</h3>
        <div className="space-y-3">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Görev/Faz adı*" className="w-full border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300" autoFocus />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Kategori (ör. Faz 1)" className="border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            <input value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })} placeholder="Sorumlu kişi" className="border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Başlangıç Tarihi*</label>
              <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Bitiş Tarihi*</label>
              <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">İlerleme: <span className="font-bold text-cyan-700">%{form.progress}</span></label>
            <input type="range" min="0" max="100" step="5" value={form.progress} onChange={e => setForm({ ...form, progress: Number(e.target.value) })} className="w-full accent-cyan-500" />
            <div className="flex justify-between text-[9px] text-slate-400"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Renk</label>
            <div className="flex gap-2 flex-wrap">
              {GANTT_COLORS.map(c => (
                <button key={c} onClick={() => setForm({ ...form, color: c })} className={`w-7 h-7 rounded-lg transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Gecikme Nedeni <span className="text-slate-300">(varsa)</span></label>
            <textarea value={form.delayReason || ''} onChange={e => setForm({ ...form, delayReason: e.target.value })} placeholder="Gecikme varsa nedenini yazın..." rows="2" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none" />
          </div>
          {form.startDate && form.endDate && new Date(form.endDate) >= new Date(form.startDate) && (
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 text-center">
              <span className="text-sm font-bold text-cyan-700">
                Süre: {Math.round((new Date(form.endDate) - new Date(form.startDate)) / 86400000) + 1} gün
              </span>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={closeModal} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">İptal</button>
          <button onClick={onSave} className="px-4 py-2 text-sm bg-cyan-600 hover:bg-cyan-700 text-white rounded-md font-medium">Kaydet</button>
        </div>
      </div>
    </div>
  );
}
