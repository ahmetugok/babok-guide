import React, { useState } from 'react';
import { ListChecks, Plus, Pencil, Trash2, Clock, AlignJustify, LayoutGrid } from 'lucide-react';
import { isOverdue } from '../utils.js';

const COLUMNS = [
  { status: 'Bekliyor',     label: 'Bekliyor',      bg: 'bg-white/3',          badge: 'bg-slate-500/20 text-slate-400' },
  { status: 'Devam Ediyor', label: 'Devam Ediyor',  bg: 'bg-cyan-500/5',       badge: 'bg-cyan-500/20 text-cyan-400' },
  { status: 'Tamamlandı',   label: 'Tamamlandı',    bg: 'bg-emerald-500/5',    badge: 'bg-emerald-500/20 text-emerald-400' },
];

export function ActionsTab({ activeProject, openActionModal, deleteAction, quickUpdateActionStatus, updateActive }) {
  const [actionView, setActionView]       = useState('kanban');
  const [draggedId, setDraggedId]         = useState(null);
  const [dragOverCol, setDragOverCol]     = useState(null);

  const actions = activeProject.actions || [];
  const reqs    = activeProject.requirements || [];

  function getReqId(linkedId) {
    if (!linkedId) return null;
    const r = reqs.find(r => r.id === linkedId);
    return r ? r.reqId : linkedId;
  }

  // ── Drag handlers ──────────────────────────────────────────────
  function onDragStart(e, id) {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragOver(e, colStatus) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCol(colStatus);
  }

  function onDragLeave() {
    setDragOverCol(null);
  }

  function onDrop(e, colStatus) {
    e.preventDefault();
    setDragOverCol(null);
    if (!draggedId) return;
    const updated = actions.map(a =>
      a.id === draggedId ? { ...a, status: colStatus } : a
    );
    updateActive({ actions: updated });
    setDraggedId(null);
  }

  function onDragEnd() {
    setDraggedId(null);
    setDragOverCol(null);
  }

  // ── Kanban card ────────────────────────────────────────────────
  function KanbanCard({ a }) {
    const od      = isOverdue(a);
    const reqId   = getReqId(a.linkedRequirementId);
    const isDragging = draggedId === a.id;

    return (
      <div
        draggable
        onDragStart={e => onDragStart(e, a.id)}
        onDragEnd={onDragEnd}
        className={`glass-card p-3 rounded-xl shadow-md cursor-grab active:cursor-grabbing transition-opacity select-none
          ${od ? 'border-l-4 border-l-rose-400' : ''}
          ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      >
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className={`text-sm font-semibold leading-snug flex-1 ${a.status === 'Tamamlandı' ? 'line-through text-slate-400' : 'text-slate-100'}`}>
            {a.title}
          </p>
          <div className="flex items-center gap-0.5 shrink-0">
            <button onClick={() => openActionModal(a)} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-blue-400 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
            <button onClick={() => deleteAction(a.id)} className="p-1 hover:bg-rose-500/10 rounded text-slate-400 hover:text-rose-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
        <p className="text-xs text-slate-500 mb-2">
          {a.owner || '—'} · {a.dueDate || 'Tarih yok'}
        </p>
        <div className="flex flex-wrap gap-1">
          {od && (
            <span className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" />Gecikmiş
            </span>
          )}
          {reqId && (
            <span className="text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full">
              {reqId}
            </span>
          )}
          {a.source && (
            <span className="text-xs bg-white/5 text-slate-400 border border-white/10 px-2 py-0.5 rounded-full">
              {a.source}
            </span>
          )}
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <ListChecks className="text-indigo-500 w-5 h-5" />Aksiyon Takip Listesi
          </h2>
          <p className="text-sm text-slate-400">
            {actions.length} aksiyon · {actions.filter(isOverdue).length} gecikmiş
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5">
            <button
              onClick={() => setActionView('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${actionView === 'list' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <AlignJustify className="w-3.5 h-3.5" />Liste
            </button>
            <button
              onClick={() => setActionView('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${actionView === 'kanban' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />Kanban
            </button>
          </div>
          <button onClick={() => openActionModal()} className="bg-indigo-600/80 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-black/20">
            <Plus className="w-4 h-4" />Aksiyon Ekle
          </button>
        </div>
      </div>

      {/* Empty state */}
      {actions.length === 0 ? (
        <div className="text-center py-20 glass-card p-8">
          <ListChecks className="w-14 h-14 mx-auto mb-4 text-violet-500/20 empty-state-icon" />
          <p className="text-slate-300 font-medium">Aksiyon listesi boş.</p>
          <p className="text-xs text-slate-400 mt-2">Yapılması gerekeni not düş, takipte kal.</p>
          <button onClick={() => openActionModal()} className="mt-4 text-xs text-violet-400 hover:text-violet-300 transition-colors">+ Aksiyon Ekle</button>
        </div>
      ) : actionView === 'list' ? (

        /* ── LIST VIEW ── */
        <div className="space-y-3">
          {actions.map(a => {
            const od = isOverdue(a);
            const reqId = getReqId(a.linkedRequirementId);
            return (
              <div key={a.id} className={`bg-white/5 rounded-xl border p-4 shadow-lg shadow-black/20 ${od ? 'border-l-4 border-l-rose-400 bg-rose-500/10' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <select value={a.status} onChange={e => quickUpdateActionStatus(a.id, e.target.value)} className={`text-xs font-bold px-2 py-1 rounded-full border cursor-pointer appearance-none text-center focus:outline-none focus:ring-2 focus:ring-indigo-300 ${a.status === 'Tamamlandı' ? 'bg-emerald-100 text-emerald-800 border-emerald-500/20' : a.status === 'Devam Ediyor' ? 'bg-blue-100 text-blue-800 border-blue-500/20' : 'bg-white/10 text-slate-300 border-white/10'}`} style={{ minWidth: 110 }}>
                        {['Bekliyor', 'Devam Ediyor', 'Tamamlandı'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {od && <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full border border-rose-500/20 flex items-center gap-1"><Clock className="w-3 h-3" />Gecikmiş</span>}
                    </div>
                    <p className={`font-semibold ${a.status === 'Tamamlandı' ? 'line-through text-slate-400' : 'text-slate-100'}`}>{a.title}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                      <span>Sorumlu: {a.owner || '—'} · Tarih: {a.dueDate || '—'}{a.source ? ` · Kaynak: ${a.source}` : ''}</span>
                      {reqId && <span className="text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full">{reqId}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => openActionModal(a)} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-blue-600 transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => deleteAction(a.id)} className="p-1.5 hover:bg-rose-500/10 rounded-md text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                {a.notes && (
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="text-xs text-slate-400"><span className="font-medium text-slate-400">Not:</span> {a.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      ) : (

        /* ── KANBAN VIEW ── */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map(col => {
            const colActions = actions.filter(a => a.status === col.status);
            const isOver = dragOverCol === col.status;
            return (
              <div
                key={col.status}
                onDragOver={e => onDragOver(e, col.status)}
                onDragLeave={onDragLeave}
                onDrop={e => onDrop(e, col.status)}
                className={`rounded-xl p-3 min-h-[200px] transition-all ${col.bg} border ${isOver ? 'border-2 border-dashed border-indigo-400/60 bg-indigo-500/5' : 'border-white/10'}`}
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{col.label}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badge}`}>{colActions.length}</span>
                </div>
                {/* Cards */}
                <div className="space-y-2">
                  {colActions.map(a => <KanbanCard key={a.id} a={a} />)}
                  {colActions.length === 0 && (
                    <p className="text-xs text-slate-600 text-center py-6 border border-dashed border-white/10 rounded-lg">
                      Buraya sürükle
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
