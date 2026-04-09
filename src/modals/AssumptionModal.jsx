import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { EntitySelector } from '../components/EntitySelector.jsx';
import { useProjectStore, selectActiveProject } from '../store/projectStore.js';
import { useUIStore, DEFAULT_ASSUMPTION_FORM } from '../store/uiStore.js';

export function AssumptionModal() {
  const activeProject      = useProjectStore(selectActiveProject);
  const saveAssumption     = useProjectStore((s) => s.saveAssumption);
  const modalData  = useUIStore((s) => s.modalData);
  const closeModal = useUIStore((s) => s.closeModal);

  const editingAssumption = modalData.editingId
    ? (activeProject?.assumptions || []).find((a) => a.id === modalData.editingId)
    : null;

  const [form, setForm] = useState(
    editingAssumption
      ? { ...DEFAULT_ASSUMPTION_FORM, ...editingAssumption }
      : { ...DEFAULT_ASSUMPTION_FORM }
  );

  const onSave = () => {
    if (!form.title.trim()) return;
    saveAssumption(form, modalData.editingId);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel p-6 shadow-2xl max-w-lg w-full">
        <h3 className="font-bold text-lg text-slate-100 mb-4 flex items-center gap-2"><Lightbulb className="text-amber-400 w-5 h-5" />{editingAssumption ? 'Duzenle' : 'Yeni Varsayim / Kisit'}</h3>
        <div className="space-y-3">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Baslik*" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
          <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Aciklama / icerik*" rows="2" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none" />
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-slate-400 block mb-1">Tip</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
                <option value="Varsayim">Varsayim</option>
                <option value="Kisit">Kisit</option>
              </select>
            </div>
            <div><label className="text-xs text-slate-400 block mb-1">Kategori</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {['Teknik', 'Is', 'Paydas', 'Zaman', 'Butce', 'Yasal', 'Organizasyonel'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <input value={form.ownerId} onChange={e => setForm({ ...form, ownerId: e.target.value })} placeholder="Sorumlu (opsiyonel)" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          <div><label className="text-xs text-slate-400 block mb-1">Dogrulama Durumu</label>
            <select value={form.validationStatus} onChange={e => setForm({ ...form, validationStatus: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option value="Dogrulanmadi">Dogrulanmadi</option>
              <option value="Dogrulandi">Dogrulandi</option>
              <option value="Curutuldu">Curutuldu</option>
            </select>
          </div>
          {form.validationStatus !== 'Dogrulanmadi' && (
            <div><label className="text-xs text-slate-400 block mb-1">Dogrulama Tarihi</label>
              <input type="date" value={form.validationDate} onChange={e => setForm({ ...form, validationDate: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-slate-400 block mb-1">Bağlı Gereksinim</label>
              <EntitySelector entityType="requirement" value={form.linkedRequirements || ''} onChange={id => setForm({ ...form, linkedRequirements: id })} placeholder="Gereksinim seçin…" />
            </div>
            <div><label className="text-xs text-slate-400 block mb-1">Bağlı Risk</label>
              <EntitySelector entityType="risk" value={form.linkedRisks || ''} onChange={id => setForm({ ...form, linkedRisks: id })} placeholder="Risk seçin…" />
            </div>
          </div>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Not (opsiyonel)" rows="2" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" />
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={closeModal} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">Iptal</button>
          <button onClick={onSave} className="px-4 py-2 text-sm bg-amber-600/80 hover:bg-amber-500 text-white rounded-md font-medium">Kaydet</button>
        </div>
      </div>
    </div>
  );
}
