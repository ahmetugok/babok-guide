import React, { useState } from 'react';
import { BookText, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useProjectStore } from '../store/projectStore.js';
import { selectActiveGlossaryTerms, selectActiveRequirements } from '../store/selectors.js';
import { useUIStore } from '../store/uiStore.js';

export function GlossaryTab() {
  const terms            = useProjectStore(selectActiveGlossaryTerms);
  const requirements     = useProjectStore(selectActiveRequirements);
  const deleteGlossaryTerm = useProjectStore((s) => s.deleteGlossaryTerm);
  const openModal        = useUIStore((s) => s.openModal);

  const [search, setSearch] = useState('');

  const filtered = terms.filter(
    (t) =>
      !search ||
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      (t.definition || '').toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.term.localeCompare(b.term, 'tr'));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <BookText className="text-emerald-500 w-5 h-5" />Terimler Sözlüğü
          </h2>
          <p className="text-sm text-slate-400">{terms.length} terim tanımlı</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Terim ara…"
              className="pl-8 pr-3 py-1.5 text-xs border border-white/10 rounded-lg bg-white/5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
          </div>
          <button
            onClick={() => openModal('glossary')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-black/20"
          >
            <Plus className="w-4 h-4" />Terim Ekle
          </button>
        </div>
      </div>

      {terms.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <BookText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Henüz terim eklenmemiş.</p>
        </div>
      ) : (
        <div className="bg-white/5 rounded-xl border border-white/10 shadow-lg shadow-black/20 overflow-hidden">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 border-b border-white/10 sticky top-0 z-10" style={{ backdropFilter: 'blur(12px)' }}>
                <tr>
                  {['ID', 'Terim', 'Tanım', 'Kaynak', 'İlgili Gereksinim', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((t) => {
                  const linkedReq = t.linkedRequirementId
                    ? requirements.find((r) => r.id === t.linkedRequirementId)
                    : null;
                  return (
                    <tr key={t.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-slate-400 whitespace-nowrap">{t.termId}</td>
                      <td className="px-4 py-3 font-semibold text-slate-100 whitespace-nowrap">{t.term}</td>
                      <td className="px-4 py-3 text-xs text-slate-300 max-w-[300px]">
                        <span className="line-clamp-2" title={t.definition}>{t.definition || '—'}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{t.source || '—'}</td>
                      <td className="px-4 py-3 text-xs">
                        {linkedReq ? (
                          <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-medium">
                            {linkedReq.reqId} — {linkedReq.name}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openModal('glossary', { editingId: t.id })}
                            className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-blue-400 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteGlossaryTerm(t.id)}
                            className="p-1 hover:bg-rose-500/10 rounded text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
