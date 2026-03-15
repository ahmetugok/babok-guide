import React from 'react';
import { ListChecks } from 'lucide-react';
import { EntitySelector } from '../components/EntitySelector.jsx';

export function ActionModal({ form, setForm, onSave, onClose, editingAction, activeProject }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel p-6 shadow-2xl max-w-md w-full">
        <h3 className="font-bold text-lg text-slate-100 mb-4 flex items-center gap-2"><ListChecks className="text-indigo-500 w-5 h-5" />{editingAction ? 'Aksiyonu Düzenle' : 'Yeni Aksiyon'}</h3>
        <div className="space-y-3">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Aksiyon başlığı*" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} placeholder="Sorumlu kişi" className="border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          </div>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
            {['Bekliyor', 'Devam Ediyor', 'Tamamlandı'].map(s => <option key={s}>{s}</option>)}
          </select>
          <input value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} placeholder="Kaynak (ör. Toplantı adı)" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          <div><label className="text-xs text-slate-400 block mb-1">Bağlı Toplantı</label>
            <EntitySelector entityType="meeting" activeProject={activeProject} value={form.sourceMeetingId || ''} onChange={id => setForm({ ...form, sourceMeetingId: id })} placeholder="Toplantı seçin…" />
          </div>
          <div><label className="text-xs text-slate-400 block mb-1">Bağlı Gereksinim</label>
            <EntitySelector entityType="requirement" activeProject={activeProject} value={form.linkedRequirementId || ''} onChange={id => setForm({ ...form, linkedRequirementId: id })} placeholder="Gereksinim seçin…" />
          </div>
          <textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Not / Açıklama (opsiyonel)" rows="2" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">İptal</button>
          <button onClick={onSave} className="px-4 py-2 text-sm bg-indigo-600/80 hover:bg-indigo-500 text-white rounded-md font-medium">Kaydet</button>
        </div>
      </div>
    </div>
  );
}
