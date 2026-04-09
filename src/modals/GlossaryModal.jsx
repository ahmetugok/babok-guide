import React, { useState } from 'react';
import { BookText } from 'lucide-react';
import { EntitySelector } from '../components/EntitySelector.jsx';
import { useProjectStore, selectActiveProject } from '../store/projectStore.js';
import { useUIStore, DEFAULT_GLOSSARY_FORM } from '../store/uiStore.js';

export function GlossaryModal() {
  const activeProject    = useProjectStore(selectActiveProject);
  const saveGlossaryTerm = useProjectStore((s) => s.saveGlossaryTerm);
  const modalData   = useUIStore((s) => s.modalData);
  const closeModal  = useUIStore((s) => s.closeModal);

  const editingTerm = modalData.editingId
    ? (activeProject?.glossaryTerms || []).find((t) => t.id === modalData.editingId)
    : null;

  const [form, setForm] = useState(
    editingTerm
      ? { ...DEFAULT_GLOSSARY_FORM, ...editingTerm }
      : { ...DEFAULT_GLOSSARY_FORM }
  );

  const onSave = () => {
    if (!form.term.trim()) return;
    saveGlossaryTerm(form, modalData.editingId);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel p-6 shadow-2xl max-w-md w-full">
        <h3 className="font-bold text-lg text-slate-100 mb-4 flex items-center gap-2">
          <BookText className="text-emerald-500 w-5 h-5" />
          {editingTerm ? 'Terimi Düzenle' : 'Yeni Terim'}
        </h3>
        <div className="space-y-3">
          <input
            value={form.term}
            onChange={e => setForm({ ...form, term: e.target.value })}
            placeholder="Terim*"
            className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-transparent"
          />
          <textarea
            value={form.definition}
            onChange={e => setForm({ ...form, definition: e.target.value })}
            placeholder="Tanım"
            rows="3"
            className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none bg-transparent"
          />
          <input
            value={form.source}
            onChange={e => setForm({ ...form, source: e.target.value })}
            placeholder="Kaynak (ör. İş birimi, Standart)"
            className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none bg-transparent"
          />
          <div>
            <label className="text-xs text-slate-400 block mb-1">İlgili Gereksinim (opsiyonel)</label>
            <EntitySelector
              entityType="requirement"
              value={form.linkedRequirementId || ''}
              onChange={id => setForm({ ...form, linkedRequirementId: id })}
              placeholder="Gereksinim seçin…"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={closeModal} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">İptal</button>
          <button onClick={onSave} className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium">Kaydet</button>
        </div>
      </div>
    </div>
  );
}
