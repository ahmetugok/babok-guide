import React, { useState } from 'react';
import { BookOpen, AlertTriangle } from 'lucide-react';
import { EntitySelector } from '../components/EntitySelector.jsx';
import { useProjectStore, selectActiveProject } from '../store/projectStore.js';
import { useUIStore, DEFAULT_BR_FORM } from '../store/uiStore.js';

export function BusinessRuleModal() {
  const activeProject = useProjectStore(selectActiveProject);
  const saveBR        = useProjectStore((s) => s.saveBR);
  const modalData  = useUIStore((s) => s.modalData);
  const closeModal = useUIStore((s) => s.closeModal);

  const editingBR = modalData.editingId
    ? (activeProject?.businessRules || []).find((r) => r.id === modalData.editingId)
    : null;

  const [form, setForm] = useState(
    editingBR
      ? { ...DEFAULT_BR_FORM, ...editingBR }
      : { ...DEFAULT_BR_FORM }
  );

  const onSave = () => {
    if (!form.title.trim()) return;
    saveBR(form, modalData.editingId);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel p-6 shadow-2xl max-w-lg w-full">
        <h3 className="font-bold text-lg text-slate-100 mb-4 flex items-center gap-2"><BookOpen className="text-blue-400 w-5 h-5" />{editingBR ? 'Is Kuralini Duzenle' : 'Yeni Is Kurali'}</h3>
        <div className="space-y-3">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Kural basligi*" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          <textarea value={form.ruleText} onChange={e => setForm({ ...form, ruleText: e.target.value })} placeholder="[Kosul] durumunda [eylem] yapilmalidir*" rows="3" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none" />
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-slate-400 block mb-1">Kategori</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {['Hesaplama', 'Surec', 'Veri', 'Erisim', 'Dogrulama', 'Bildirim'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="text-xs text-slate-400 block mb-1">Kaynak</label>
              <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {['Mevzuat', 'Sirket Politikasi', 'Paydas Karari', 'Sektor Standardi'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.sourceRef} onChange={e => setForm({ ...form, sourceRef: e.target.value })} placeholder="Kaynak ref. (orn: Madde 5/3)" className="border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            <input value={form.version} onChange={e => setForm({ ...form, version: e.target.value })} placeholder="Versiyon (orn: v1.0)" className="border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          </div>
          <div><label className="text-xs text-slate-400 block mb-1">Durum</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
              {['Aktif', 'Revize Edildi', 'Gecersiz'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div><label className="text-xs text-slate-400 block mb-1">Sorumlu Paydaş</label>
            <EntitySelector entityType="stakeholder" value={form.linkedStakeholderId || ''} onChange={id => setForm({ ...form, linkedStakeholderId: id })} placeholder="Paydaş seçin…" />
          </div>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Not (opsiyonel)" rows="2" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" />
          {editingBR && form.version !== editingBR.version && (
            <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 text-xs text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>Versiyon degisti — eski kayit &quot;Revize Edildi&quot; durumuna cekilecek.</span>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={closeModal} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">Iptal</button>
          <button onClick={onSave} className="px-4 py-2 text-sm bg-blue-600/80 hover:bg-blue-500 text-white rounded-md font-medium">Kaydet</button>
        </div>
      </div>
    </div>
  );
}
