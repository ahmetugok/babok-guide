import React from 'react';
import { CalendarDays, Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';

export function GanttTab({ activeProject, openGanttModal, deleteGanttTask, ganttZoom, setGanttZoom }) {
  const tasks = activeProject.ganttTasks || [];
  const DAY_WIDTHS = { week: 40, month: 16, quarter: 6 };
  const dayWidth = DAY_WIDTHS[ganttZoom];

  let rangeStart, rangeEnd;
  if (tasks.length > 0) {
    const starts = tasks.map(t => new Date(t.startDate).getTime());
    const ends = tasks.map(t => new Date(t.endDate).getTime());
    rangeStart = new Date(Math.min(...starts));
    rangeEnd = new Date(Math.max(...ends));
    const pad = ganttZoom === 'week' ? 3 : ganttZoom === 'month' ? 7 : 14;
    rangeStart.setDate(rangeStart.getDate() - pad);
    rangeEnd.setDate(rangeEnd.getDate() + pad);
  } else {
    rangeStart = new Date(); rangeStart.setDate(1);
    rangeEnd = new Date(); rangeEnd.setMonth(rangeEnd.getMonth() + 3);
  }
  const dow = rangeStart.getDay();
  rangeStart.setDate(rangeStart.getDate() - (dow === 0 ? 6 : dow - 1));
  rangeStart.setHours(0, 0, 0, 0);
  rangeEnd.setHours(0, 0, 0, 0);

  const diffDays = (a, b) => Math.round((a - b) / 86400000);
  const totalDays = diffDays(rangeEnd, rangeStart) + 1;
  const totalWidth = Math.max(totalDays * dayWidth, 600);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayPos = diffDays(today, rangeStart) * dayWidth;

  const categories = [...new Set(tasks.map(t => t.category || 'Genel'))];
  if (categories.length === 0) categories.push('Genel');

  const monthHeaders = [];
  const mCur = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1);
  while (mCur <= rangeEnd) {
    const mStart = mCur < rangeStart ? new Date(rangeStart) : new Date(mCur);
    const mLast = new Date(mCur.getFullYear(), mCur.getMonth() + 1, 0);
    const mEnd = mLast > rangeEnd ? rangeEnd : mLast;
    monthHeaders.push({
      label: mCur.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
      left: diffDays(mStart, rangeStart) * dayWidth,
      width: (diffDays(mEnd, mStart) + 1) * dayWidth,
    });
    mCur.setMonth(mCur.getMonth() + 1);
  }

  const weekMarkers = [];
  for (let i = 0; i < totalDays; i += 7) { weekMarkers.push(i * dayWidth); }

  const getBarPos = (task) => {
    const s = new Date(task.startDate); s.setHours(0, 0, 0, 0);
    const e = new Date(task.endDate); e.setHours(0, 0, 0, 0);
    return {
      left: diffDays(s, rangeStart) * dayWidth,
      width: Math.max((diffDays(e, s) + 1) * dayWidth, dayWidth),
    };
  };

  const rows = [];
  categories.forEach(cat => {
    rows.push({ type: 'category', label: cat });
    tasks.filter(t => (t.category || 'Genel') === cat).forEach(t => rows.push({ type: 'task', task: t }));
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <CalendarDays className="text-cyan-500 w-5 h-5" />Proje Timeline
          </h2>
          <p className="text-sm text-slate-400">{tasks.length} görev{categories.length > 1 ? ` · ${categories.length} kategori` : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/10 rounded-lg p-0.5">
            {[['week', 'Hafta'], ['month', 'Ay'], ['quarter', 'Çeyrek']].map(([z, label]) => (
              <button key={z} onClick={() => setGanttZoom(z)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${ganttZoom === z ? 'bg-white/5 text-cyan-700 shadow-lg shadow-black/20' : 'text-slate-400 hover:text-slate-300'}`}>{label}</button>
            ))}
          </div>
          <button onClick={() => openGanttModal()} className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-black/20">
            <Plus className="w-4 h-4" />Görev Ekle
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-20 glass-card p-8">
          <CalendarDays className="w-14 h-14 mx-auto mb-4 text-cyan-500/20 empty-state-icon" />
          <p className="text-slate-300 font-medium">Zaman çizelgesi boş.</p>
          <p className="text-xs text-slate-400 mt-2">Proje fazlarını ve görevlerini ekleyerek zaman çizelgenizi oluşturun.</p>
          <button onClick={() => openGanttModal()} className="mt-4 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">+ İlk Görevi Ekle</button>
        </div>
      ) : (
        <div className="bg-white/5 rounded-xl border border-white/10 shadow-lg shadow-black/20 overflow-hidden">
          <div className="flex" style={{ maxHeight: 'calc(100vh - 260px)', minHeight: 200 }}>
            {/* Sidebar */}
            <div className="w-80 shrink-0 border-r border-white/10 bg-white/5 z-[2] overflow-y-auto">
              <div className="h-[52px] border-b border-white/10 flex items-end px-3 pb-1.5 sticky top-0 z-[3]" style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <div className="flex items-center w-full">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-1">Görev Adı</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-24 text-center">Sorumlu</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-14 text-right pr-8">%</span>
                </div>
              </div>
              {rows.map((row, idx) => row.type === 'category' ? (
                <div key={`cat-${idx}`} className="h-8 px-3 flex items-center bg-white/10 border-b border-white/10">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{row.label}</span>
                </div>
              ) : (
                <div key={row.task.id} className="h-14 px-3 flex items-center border-b border-white/10 group hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: row.task.color }} />
                    <span className="text-xs font-medium text-slate-300 truncate" title={row.task.name}>{row.task.name}</span>
                  </div>
                  <div className="w-24 text-center shrink-0 px-1">
                    {row.task.assignedTo ? (
                      <span className="text-[11px] text-slate-400 font-medium truncate block" title={row.task.assignedTo}>{row.task.assignedTo}</span>
                    ) : (
                      <span className="text-[10px] text-slate-300">—</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 w-14 shrink-0 justify-end">
                    <div className="w-8 bg-slate-200 rounded-full h-1.5"><div className="h-1.5 rounded-full bg-cyan-500/100" style={{ width: `${row.task.progress || 0}%` }} /></div>
                    <span className="text-[10px] font-medium text-slate-400">{row.task.progress || 0}%</span>
                  </div>
                  {(() => { const te = new Date(row.task.endDate); te.setHours(0,0,0,0); const isD = te < new Date(new Date().setHours(0,0,0,0)) && (row.task.progress || 0) < 100; return isD ? <span className="text-[9px] bg-rose-100 text-rose-700 px-1 py-0.5 rounded-full font-bold ml-1 shrink-0" title={row.task.delayReason || 'Gecikmiş'}>⚠️</span> : null; })()}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1">
                    <button onClick={() => openGanttModal(row.task)} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-blue-600"><Pencil className="w-3 h-3" /></button>
                    <button onClick={() => deleteGanttTask(row.task.id)} className="p-1 hover:bg-rose-500/10 rounded text-slate-400 hover:text-rose-600"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="flex-1 overflow-x-auto overflow-y-auto">
              <div style={{ width: totalWidth, minWidth: '100%' }} className="relative">
                {/* Month header */}
                <div className="h-[26px] border-b border-white/10 relative bg-white/5 sticky top-0 z-[1]">
                  {monthHeaders.map((m, i) => (
                    <div key={i} className="absolute top-0 h-full flex items-center border-r border-white/10 overflow-hidden" style={{ left: m.left, width: m.width }}>
                      <span className="text-[10px] font-bold text-slate-400 px-2 truncate capitalize">{m.label}</span>
                    </div>
                  ))}
                </div>

                {/* Sub-header */}
                <div className="h-[26px] border-b border-white/10 relative bg-white/5 sticky top-[26px] z-[1]">
                  {Array.from({ length: totalDays }, (_, i) => {
                    const d = new Date(rangeStart); d.setDate(d.getDate() + i);
                    const isMonday = d.getDay() === 1;
                    const isFirst = d.getDate() === 1;
                    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                    const show = ganttZoom === 'week' || (ganttZoom === 'month' && isMonday) || (ganttZoom === 'quarter' && isFirst);
                    return show ? (
                      <div key={i} className="absolute top-0 h-full flex items-center" style={{ left: i * dayWidth }}>
                        <span className={`text-[9px] px-0.5 ${isWeekend ? 'text-rose-300' : 'text-slate-400'}`}>
                          {ganttZoom === 'week' ? d.getDate() : ganttZoom === 'month' ? `${d.getDate()}/${d.getMonth() + 1}` : d.toLocaleDateString('tr-TR', { month: 'short' })}
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>

                {/* Task rows */}
                {rows.map((row, idx) => row.type === 'category' ? (
                  <div key={`cat-${idx}`} className="h-8 border-b border-white/10 bg-white/40 flex items-center px-2"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{row.label}</span></div>
                ) : (() => {
                  const taskEnd = new Date(row.task.endDate); taskEnd.setHours(0,0,0,0);
                  const isDelayed = taskEnd < today && (row.task.progress || 0) < 100;
                  const delayDays = isDelayed ? diffDays(today, taskEnd) : 0;
                  return (
                  <div key={row.task.id} className="h-14 border-b border-white/10 relative">
                    <div
                      className={`absolute top-2 h-10 rounded-md shadow-lg shadow-black/20 cursor-pointer hover:brightness-110 transition-all flex flex-col justify-center px-2 overflow-hidden ${isDelayed ? 'ring-2 ring-rose-400 ring-offset-1' : ''}`}
                      style={{ left: getBarPos(row.task).left, width: getBarPos(row.task).width, backgroundColor: row.task.color || '#3b82f6' }}
                      onClick={() => openGanttModal(row.task)}
                      title={`${row.task.name}\n${row.task.startDate} → ${row.task.endDate}\nİlerleme: %${row.task.progress || 0}${row.task.assignedTo ? '\nSorumlu: ' + row.task.assignedTo : ''}${isDelayed ? '\n⚠️ ' + delayDays + ' gün gecikme' : ''}${row.task.delayReason ? '\nNeden: ' + row.task.delayReason : ''}`}
                    >
                      {getBarPos(row.task).width > 70 && <span className="text-[10px] text-white font-medium truncate drop-shadow-lg shadow-black/20 leading-tight">{row.task.name}</span>}
                      {getBarPos(row.task).width > 100 && row.task.assignedTo && <span className="text-[9px] text-white/80 truncate leading-tight">{row.task.assignedTo}</span>}
                      {getBarPos(row.task).width > 50 && <div className="w-full bg-white/10 rounded-full h-1.5 mt-0.5"><div className="h-1.5 rounded-full bg-white/40" style={{ width: `${row.task.progress || 0}%` }} /></div>}
                    </div>
                    {isDelayed && (
                      <div className="absolute top-0 right-0 flex items-center" style={{ left: getBarPos(row.task).left + getBarPos(row.task).width + 4, top: 8 }}>
                        <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap flex items-center gap-0.5" title={row.task.delayReason || ''}><AlertTriangle className="w-3 h-3" />{delayDays}g gecikme</span>
                      </div>
                    )}
                  </div>
                  );
                })())}

                {/* Weekend columns overlay */}
                {ganttZoom !== 'quarter' && (
                  <div className="absolute inset-0 pointer-events-none" style={{ top: 52 }}>
                    {Array.from({ length: totalDays }, (_, i) => {
                      const d = new Date(rangeStart); d.setDate(d.getDate() + i);
                      return (d.getDay() === 0 || d.getDay() === 6) ? (
                        <div key={i} className="absolute top-0 bottom-0 bg-white/10" style={{ left: i * dayWidth, width: dayWidth }} />
                      ) : null;
                    })}
                  </div>
                )}

                {/* Week separator lines */}
                <div className="absolute inset-0 pointer-events-none" style={{ top: 52 }}>
                  {weekMarkers.map((left, i) => (
                    <div key={i} className="absolute top-0 bottom-0 border-l border-white/10/80" style={{ left }} />
                  ))}
                </div>

                {/* Today line */}
                {todayPos >= 0 && todayPos <= totalWidth && (
                  <div className="absolute top-0 bottom-0 z-[3] pointer-events-none" style={{ left: todayPos }}>
                    <div className="w-0.5 h-full bg-rose-500/100 opacity-80" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-rose-500/100 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-b-md shadow-lg shadow-black/20 whitespace-nowrap">Bugün</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary bar */}
          <div className="border-t border-white/10 bg-white/5 px-4 py-3">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <span className="text-xs font-bold text-slate-400">{tasks.length} görev</span>
              {tasks.length > 0 && (() => { const avg = Math.round(tasks.reduce((a, t) => a + (t.progress || 0), 0) / tasks.length); return <span className="text-xs font-medium text-cyan-600">Ortalama İlerleme: %{avg}</span>; })()}
              {(() => { const delayed = tasks.filter(t => { const te = new Date(t.endDate); te.setHours(0,0,0,0); return te < today && (t.progress || 0) < 100; }); return delayed.length > 0 ? <span className="text-xs font-medium text-rose-600 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />{delayed.length} gecikmiş görev</span> : null; })()}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
              {tasks.map(t => {
                const s = new Date(t.startDate);
                const e = new Date(t.endDate);
                const dur = diffDays(e, s) + 1;
                const isPast = e < today;
                const isActive = s <= today && today <= e;
                return (
                  <div key={t.id} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: t.color }} />
                    <span className={`font-medium ${isPast ? 'text-slate-400 line-through' : isActive ? 'text-cyan-700' : 'text-slate-400'}`}>{t.name}</span>
                    <span className="text-slate-400">{dur}g</span>
                    <span className="text-[9px] text-cyan-600 font-medium">%{t.progress || 0}</span>
                    {t.assignedTo && <span className="text-xs text-slate-400 font-medium">· {t.assignedTo}</span>}
                    {isActive && <span className="text-[9px] bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded-full font-medium">Aktif</span>}
                    {isPast && <span className="text-[9px] bg-white/10 text-slate-400 px-1.5 py-0.5 rounded-full">Bitti</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
