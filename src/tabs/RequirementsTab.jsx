import React, { useState } from 'react';
import { BookMarked, Plus, Pencil, Trash2, ArrowUpRight, CheckCircle2, X, ChevronRight, ChevronDown, Link } from 'lucide-react';
import { REQ_STATUS_COLORS } from '../constants/index.js';
import { useProjectStore, selectActiveProject } from '../store/projectStore.js';
import { useUIStore } from '../store/uiStore.js';

function HierarchyBadge({ type }) {
  if (type === 'epic')  return <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-violet-500/20 text-violet-300 border border-violet-500/20">Epic</span>;
  if (type === 'story') return <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/20">Story</span>;
  return null;
}

export function RequirementsTab() {
  const activeProject = useProjectStore(selectActiveProject);
  const openModal     = useUIStore((s) => s.openModal);
  const deleteReq     = useProjectStore((s) => s.deleteReq);
  const reqFilter     = useUIStore((s) => s.reqFilter);
  const setReqFilter  = useUIStore((s) => s.setReqFilter);

  const [storyView, setStoryView] = useState(false);
  const [collapsed, setCollapsed] = useState({});

  const toggleCollapse = (id) =>
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

  const reqs = activeProject.requirements || [];
  const filtered = reqFilter === 'all' ? reqs : reqs.filter((r) => r.status === reqFilter);

  // Build hierarchy: epics → stories under epics → requirements under stories,
  // plus orphan stories (no parent epic) and orphan requirements
  const epics           = filtered.filter((r) => r.hierarchyType === 'epic');
  const stories         = filtered.filter((r) => r.hierarchyType === 'story');
  const plainReqs       = filtered.filter((r) => !r.hierarchyType || r.hierarchyType === 'requirement');

  // Build ordered rows for hierarchy view
  function buildRows() {
    const rows = [];
    for (const epic of epics) {
      rows.push({ req: epic, depth: 0, parentCollapsed: false });
      const epicCollapsed = collapsed[epic.id];
      const childStories = stories.filter((s) => s.parentId === epic.id);
      if (!epicCollapsed) {
        for (const story of childStories) {
          rows.push({ req: story, depth: 1, parentCollapsed: false });
          const storyCollapsed = collapsed[story.id];
          const childReqs = plainReqs.filter((r) => r.parentId === story.id);
          if (!storyCollapsed) {
            for (const req of childReqs) {
              rows.push({ req, depth: 2, parentCollapsed: false });
            }
          }
        }
        // requirements linked directly to epic (parentId = epic.id)
        const directReqs = plainReqs.filter((r) => r.parentId === epic.id);
        for (const req of directReqs) {
          rows.push({ req, depth: 1, parentCollapsed: false });
        }
      }
    }
    // Orphan stories (no parent or parent epic not in filtered)
    const epicIds = new Set(epics.map((e) => e.id));
    for (const story of stories.filter((s) => !s.parentId || !epicIds.has(s.parentId))) {
      rows.push({ req: story, depth: 0, parentCollapsed: false });
      const storyCollapsed = collapsed[story.id];
      const childReqs = plainReqs.filter((r) => r.parentId === story.id);
      if (!storyCollapsed) {
        for (const req of childReqs) {
          rows.push({ req, depth: 1, parentCollapsed: false });
        }
      }
    }
    // Orphan requirements
    const allParentIds = new Set([
      ...stories.map((s) => s.id),
      ...epics.map((e) => e.id),
    ]);
    for (const req of plainReqs.filter((r) => !r.parentId || !allParentIds.has(r.parentId))) {
      rows.push({ req, depth: 0, parentCollapsed: false });
    }
    return rows;
  }

  const hasHierarchy = epics.length > 0 || stories.length > 0;
  const rows = hasHierarchy ? buildRows() : filtered.map((r) => ({ req: r, depth: 0 }));

  const hasChildren = (id) =>
    reqs.some((r) => r.parentId === id);

  const predecessorMap = Object.fromEntries(reqs.map((r) => [r.id, r]));

  const hasAC = (r) =>
    (r.gherkinScenarios && r.gherkinScenarios.length > 0) || !!r.acceptanceCriteria;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <BookMarked className="text-teal-500 w-5 h-5" />Gereksinim Takip Tablosu
          </h2>
          <p className="text-sm text-slate-400">
            {reqs.length} gereksinim · {reqs.filter(r => r.status === 'Canlıda').length} canlıda
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center text-xs border border-white/10 rounded-lg overflow-hidden">
            <button
              onClick={() => setStoryView(false)}
              className={`px-2.5 py-1.5 transition-colors ${!storyView ? 'bg-teal-600/80 text-white' : 'text-slate-400 hover:bg-white/5'}`}
            >
              Klasik
            </button>
            <button
              onClick={() => setStoryView(true)}
              className={`px-2.5 py-1.5 transition-colors ${storyView ? 'bg-teal-600/80 text-white' : 'text-slate-400 hover:bg-white/5'}`}
            >
              User Story
            </button>
          </div>
          <select
            value={reqFilter}
            onChange={e => setReqFilter(e.target.value)}
            className="text-xs border border-white/10 rounded-md px-2 py-1.5 bg-white/5 focus:outline-none focus:ring-1 focus:ring-teal-400"
          >
            <option value="all">Tüm Durumlar</option>
            {Object.keys(REQ_STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            onClick={() => openModal('requirement')}
            className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-black/20"
          >
            <Plus className="w-4 h-4" />Gereksinim Ekle
          </button>
        </div>
      </div>

      {reqs.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <BookMarked className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Henüz gereksinim eklenmemiş.</p>
        </div>
      ) : (
        <div className="bg-white/5 rounded-xl border border-white/10 shadow-lg shadow-black/20 overflow-hidden" style={{ maxHeight: 'calc(100vh - 220px)' }}>
          <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
            <table className="w-full text-sm">
              <thead className="bg-white/5 border-b border-white/10 sticky top-0 z-10" style={{ backdropFilter: 'blur(12px)' }}>
                <tr>
                  {['ID', 'Seviye', 'Tip', 'F/NF', 'Gereksinim', 'Tür', 'Modül', 'MoSCoW', 'Durum', 'K.K.', 'Bagl.', 'Not', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map(({ req: r, depth }) => {
                  const linkedCount = [
                    (activeProject.risks          || []).filter(x => x.linkedRequirementId === r.id).length,
                    (activeProject.changeRequests  || []).filter(x => x.affectedEntityId   === r.id).length,
                    (activeProject.businessRules   || []).filter(x => x.linkedRequirements  === r.id).length,
                  ].reduce((a, b) => a + b, 0);

                  const canCollapse = hasChildren(r.id);
                  const isCollapsed = collapsed[r.id];
                  const predecessorReq = r.predecessorId ? predecessorMap[r.predecessorId] : null;

                  const nameDisplay = storyView && r.hierarchyType === 'story' && r.userStoryRole
                    ? `As a ${r.userStoryRole}, I want ${r.userStoryAction}`
                    : r.name;

                  return (
                    <tr key={r.id} className={`hover:bg-white/5 transition-colors ${depth === 1 ? 'opacity-95' : depth === 2 ? 'opacity-90' : ''}`}>
                      <td className="px-4 py-3 text-xs font-mono text-slate-400 whitespace-nowrap">
                        <div style={{ paddingLeft: `${depth * 16}px` }} className="flex items-center gap-1">
                          {canCollapse ? (
                            <button
                              onClick={() => toggleCollapse(r.id)}
                              className="text-slate-500 hover:text-slate-300 transition-colors"
                            >
                              {isCollapsed
                                ? <ChevronRight className="w-3.5 h-3.5" />
                                : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          ) : (
                            <span className="w-3.5 h-3.5 inline-block" />
                          )}
                          {r.reqId}
                          {predecessorReq && (
                            <Link className="w-3 h-3 text-slate-500 ml-0.5" title={`Önkoşul: ${predecessorReq.reqId} — ${predecessorReq.name}`} />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <HierarchyBadge type={r.hierarchyType} />
                      </td>
                      <td className="px-4 py-3">{(() => {
                        const colors = {
                          'Is Gereksinimi':     'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
                          'Paydas Gereksinimi': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                          'Cozum Gereksinimi':  'bg-violet-500/10 text-violet-400 border-violet-500/20',
                          'Gecis Gereksinimi':  'bg-slate-500/10 text-slate-400 border-slate-500/20',
                        };
                        const cls = colors[r.requirementType];
                        return cls
                          ? <span className={`text-xs px-2 py-0.5 rounded-full border font-medium whitespace-nowrap ${cls}`}>{r.requirementType}</span>
                          : <span className="text-xs text-slate-600">—</span>;
                      })()}</td>
                      <td className="px-4 py-3">{(() => {
                        if (!r.functionalType) return <span className="text-xs text-slate-600">—</span>;
                        if (r.functionalType === 'Fonksiyonel') return <span className="text-xs px-2 py-0.5 rounded-full border font-medium bg-emerald-500/10 text-emerald-400 border-emerald-500/20">F</span>;
                        return <span className="text-xs px-2 py-0.5 rounded-full border font-medium bg-amber-500/10 text-amber-400 border-amber-500/20 whitespace-nowrap">{r.nfCategory ? `NF · ${r.nfCategory}` : 'NF'}</span>;
                      })()}</td>
                      <td className="px-4 py-3 font-medium text-slate-100 max-w-[200px]">
                        <span className="truncate block" title={r.name}>{nameDisplay}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 max-w-[120px] truncate">{r.objective || '—'}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">{r.module || '—'}</td>
                      <td className="px-4 py-3">{r.moscow ? (
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${r.moscow === 'Must' ? 'moscow-must' : r.moscow === 'Should' ? 'moscow-should' : r.moscow === 'Could' ? 'moscow-could' : 'moscow-wont'}`}>{r.moscow}</span>
                      ) : <span className="text-xs text-slate-500">—</span>}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${REQ_STATUS_COLORS[r.status] || 'bg-white/10 text-slate-300'}`}>{r.status}</span>
                      </td>
                      <td className="px-4 py-3 text-center" title={hasAC(r) ? 'Kabul kriteri var' : 'Kabul kriteri girilmemiş'}>
                        {hasAC(r)
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                          : <X className="w-4 h-4 text-rose-400 inline" />}
                      </td>
                      <td className="px-4 py-3 text-center">{linkedCount > 0 ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">{linkedCount} bagl.</span>
                      ) : <span className="text-xs text-slate-600">—</span>}</td>
                      <td className="px-4 py-3 text-xs text-slate-400 max-w-[150px] truncate" title={r.notes || ''}>{r.notes || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openModal('linkCard', { entityType: 'requirement', entityId: r.id })} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-cyan-400 transition-colors" title="Bağlantılar"><ArrowUpRight className="w-3.5 h-3.5" /></button>
                          <button onClick={() => openModal('requirement', { editingId: r.id })} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-blue-600 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => deleteReq(r.id)} className="p-1 hover:bg-rose-500/10 rounded text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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
