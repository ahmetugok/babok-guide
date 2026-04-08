import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { PROB_LABELS, RACI_LABELS, RACI_COLORS } from '../constants/index.js';
import { useProjectStore, selectActiveProject } from '../store/projectStore.js';
import { useUIStore, DEFAULT_STAKEHOLDER_FORM } from '../store/uiStore.js';

export function StakeholderModal() {
  const activeProject       = useProjectStore(selectActiveProject);
  const saveStakeholder     = useProjectStore((s) => s.saveStakeholder);
  const stakeholderModal    = useUIStore((s) => s.stakeholderModal);
  const closeStakeholderModal = useUIStore((s) => s.closeStakeholderModal);

  const editingStakeholder = stakeholderModal.editingId
    ? (activeProject?.stakeholders || []).find((s) => s.id === stakeholderModal.editingId)
    : null;

  const [form, setForm] = useState(
    editingStakeholder
      ? { ...DEFAULT_STAKEHOLDER_FORM, ...editingStakeholder }
      : { ...DEFAULT_STAKEHOLDER_FORM }
  );

  const onSave = () => {
    if (!form.name.trim()) return;
    saveStakeholder(form, stakeholderModal.editingId);
    closeStakeholderModal();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel p-6 shadow-2xl max-w-md w-full">
        <h3 className="font-bold text-lg text-slate-100 mb-4 flex items-center gap-2"><UserPlus className="text-orange-500 w-5 h-5" />{editingStakeholder ? 'Paydaşı Düzenle' : 'Yeni Paydaş'}</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Paydaş adı*" className="border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
            <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Rol/Ünvan" className="border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          </div>
          <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="Departman" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-slate-400 block mb-1">İlgi: {PROB_LABELS[form.interest]}</label>
              <input type="range" min="1" max="3" value={form.interest} onChange={e => setForm({ ...form, interest: Number(e.target.value) })} className="w-full accent-orange-500" />
            </div>
            <div><label className="text-xs text-slate-400 block mb-1">Etki: {PROB_LABELS[form.influence]}</label>
              <input type="range" min="1" max="3" value={form.influence} onChange={e => setForm({ ...form, influence: Number(e.target.value) })} className="w-full accent-orange-500" />
            </div>
          </div>
          <div><label className="text-xs text-slate-400 block mb-1">RACI Rolü</label>
            <div className="flex gap-2">
              {Object.entries(RACI_LABELS).map(([k, v]) => (
                <button key={k} onClick={() => setForm({ ...form, raci: k })} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors border ${form.raci === k ? RACI_COLORS[k] + ' border-current' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}>{k}</button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-1">{RACI_LABELS[form.raci]}</p>
          </div>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Notlar..." rows="2" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" />
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={closeStakeholderModal} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">İptal</button>
          <button onClick={onSave} className="px-4 py-2 text-sm bg-orange-500/100 hover:bg-orange-600 text-white rounded-md font-medium">Kaydet</button>
        </div>
      </div>
    </div>
  );
}
