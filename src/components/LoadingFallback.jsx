import React from 'react';

function Sk({ w = 'w-full', h = 'h-3', extra = '' }) {
  return <div className={`skeleton ${w} ${h} ${extra}`} />;
}

function SkRow({ cols }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.05]">
      {cols.map((w, i) => <Sk key={i} w={w} h="h-2.5" />)}
    </div>
  );
}

function TableSkeleton({ cols = ['w-10', 'w-36', 'w-24', 'w-16', 'w-20', 'w-12'], rows = 6 }) {
  const rowVariants = [
    ['w-10', 'w-32', 'w-20', 'w-14', 'w-16', 'w-10'],
    ['w-10', 'w-40', 'w-28', 'w-16', 'w-20', 'w-8'],
    ['w-10', 'w-28', 'w-16', 'w-12', 'w-14', 'w-12'],
    ['w-10', 'w-36', 'w-24', 'w-18', 'w-16', 'w-8'],
    ['w-10', 'w-44', 'w-20', 'w-14', 'w-24', 'w-10'],
    ['w-10', 'w-32', 'w-32', 'w-10', 'w-18', 'w-8'],
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="space-y-1.5">
          <Sk w="w-52" h="h-5" extra="rounded-md" />
          <Sk w="w-28" h="h-3" extra="rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Sk w="w-28" h="h-8" extra="rounded-lg" />
          <Sk w="w-32" h="h-8" extra="rounded-lg" />
        </div>
      </div>
      <div className="bg-white/[0.03] rounded-xl border border-white/[0.08] overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.03] border-b border-white/[0.08]">
          {cols.map((w, i) => <Sk key={i} w={w} h="h-2.5" />)}
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <SkRow key={i} cols={(rowVariants[i % rowVariants.length]).slice(0, cols.length)} />
        ))}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white/[0.03] rounded-xl border border-white/[0.08] p-5 flex flex-col items-center gap-3">
          <Sk w="w-24" h="h-24" extra="rounded-full" />
          <Sk w="w-20" h="h-2.5" extra="rounded-md" />
        </div>
        {[0, 1, 2].map(i => (
          <div key={i} className="bg-white/[0.03] rounded-xl border border-white/[0.08] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Sk w="w-16" h="h-2.5" extra="rounded-md" />
              <Sk w="w-8" h="h-8" extra="rounded-xl" />
            </div>
            <Sk w="w-16" h="h-7" extra="rounded-md" />
            <Sk w="w-full" h="h-1.5" extra="rounded-full" />
          </div>
        ))}
      </div>
      <div className="bg-white/[0.03] rounded-xl border border-white/[0.08] p-5 space-y-3">
        <Sk w="w-44" h="h-4" extra="rounded-md" />
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3">
            <Sk w="w-32" h="h-2.5" extra="rounded-md" />
            <Sk w="w-full" h="h-2" extra="rounded-full" />
            <Sk w="w-8" h="h-2.5" extra="rounded-md" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[0, 1, 2].map(i => (
          <div key={i} className="bg-white/[0.03] rounded-xl border border-white/[0.08] p-4 space-y-2">
            <Sk w="w-28" h="h-3" extra="rounded-md" />
            <Sk w="w-full" h="h-16" extra="rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MeetingsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Sk w="w-40" h="h-5" extra="rounded-md" />
        <Sk w="w-32" h="h-8" extra="rounded-lg" />
      </div>
      <div className="flex gap-4" style={{ height: 'calc(100vh - 200px)', minHeight: 400 }}>
        <div className="w-64 shrink-0 space-y-2 overflow-hidden">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white/[0.03] rounded-xl border border-white/[0.08] p-3 space-y-2">
              <Sk w="w-36" h="h-3" extra="rounded-md" />
              <Sk w="w-24" h="h-2.5" extra="rounded-md" />
              <div className="flex gap-1">
                <Sk w="w-14" h="h-4" extra="rounded-full" />
                <Sk w="w-10" h="h-4" extra="rounded-full" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1 bg-white/[0.03] rounded-xl border border-white/[0.08] p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Sk w="w-64" h="h-5" extra="rounded-md" />
              <Sk w="w-40" h="h-3" extra="rounded-md" />
            </div>
            <Sk w="w-24" h="h-8" extra="rounded-lg" />
          </div>
          <div className="h-px bg-white/[0.08]" />
          {[0, 1, 2].map(i => (
            <div key={i} className="space-y-2">
              <Sk w="w-36" h="h-3.5" extra="rounded-md" />
              <Sk w="w-full" h="h-2.5" extra="rounded-md" />
              <Sk w="w-4/5" h="h-2.5" extra="rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GanttSkeleton() {
  const bars = [
    { nameW: 'w-28', barW: 'w-2/3', offset: 'ml-0' },
    { nameW: 'w-36', barW: 'w-1/2', offset: 'ml-16' },
    { nameW: 'w-24', barW: 'w-3/4', offset: 'ml-4' },
    { nameW: 'w-32', barW: 'w-1/3', offset: 'ml-24' },
    { nameW: 'w-40', barW: 'w-4/5', offset: 'ml-8' },
    { nameW: 'w-28', barW: 'w-2/5', offset: 'ml-20' },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Sk w="w-36" h="h-5" extra="rounded-md" />
        <Sk w="w-32" h="h-8" extra="rounded-lg" />
      </div>
      <div className="bg-white/[0.03] rounded-xl border border-white/[0.08] overflow-hidden">
        <div className="flex items-center gap-4 px-4 py-3 bg-white/[0.03] border-b border-white/[0.08]">
          <Sk w="w-36" h="h-2.5" />
          <Sk w="w-24" h="h-2.5" />
          <Sk w="w-full" h="h-2.5" />
        </div>
        {bars.map(({ nameW, barW, offset }, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-white/[0.05]">
            <Sk w={nameW} h="h-2.5" extra="rounded-md shrink-0" />
            <Sk w="w-20" h="h-2.5" extra="rounded-md shrink-0" />
            <div className="flex-1">
              <Sk w={barW} h="h-5" extra={`rounded-full ${offset}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KnowledgeAreasSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Sk w="w-52" h="h-5" extra="rounded-md" />
          <Sk w="w-32" h="h-3" extra="rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white/[0.03] rounded-xl border border-white/[0.08] p-5 space-y-3">
            <div className="flex items-center gap-3">
              <Sk w="w-10" h="h-10" extra="rounded-xl shrink-0" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <Sk w="w-3/4" h="h-3.5" extra="rounded-md" />
                <Sk w="w-1/2" h="h-2.5" extra="rounded-md" />
              </div>
            </div>
            <Sk w="w-full" h="h-1.5" extra="rounded-full" />
            <div className="space-y-1.5">
              <Sk w="w-full" h="h-2" extra="rounded-md" />
              <Sk w="w-4/5" h="h-2" extra="rounded-md" />
              <Sk w="w-3/4" h="h-2" extra="rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TemplatesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Sk w="w-40" h="h-5" extra="rounded-md" />
        <Sk w="w-28" h="h-8" extra="rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/[0.03] rounded-xl border border-white/[0.08] p-5 space-y-3">
            <div className="flex items-center gap-3">
              <Sk w="w-12" h="h-12" extra="rounded-xl shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Sk w="w-2/3" h="h-4" extra="rounded-md" />
                <Sk w="w-1/2" h="h-2.5" extra="rounded-md" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Sk w="w-full" h="h-2" extra="rounded-md" />
              <Sk w="w-5/6" h="h-2" extra="rounded-md" />
            </div>
            <div className="flex gap-2">
              <Sk w="w-20" h="h-7" extra="rounded-lg" />
              <Sk w="w-16" h="h-7" extra="rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TAB_SKELETON_MAP = {
  dashboard:       <DashboardSkeleton />,
  meetings:        <MeetingsSkeleton />,
  gantt:           <GanttSkeleton />,
  knowledge_areas: <KnowledgeAreasSkeleton />,
  templates:       <TemplatesSkeleton />,
  requirements:    <TableSkeleton cols={['w-10', 'w-6', 'w-6', 'w-6', 'w-36', 'w-20', 'w-16', 'w-14']} />,
  risks:           <TableSkeleton cols={['w-10', 'w-36', 'w-20', 'w-16', 'w-14', 'w-12']} />,
  assumptions:     <TableSkeleton cols={['w-10', 'w-36', 'w-24', 'w-16', 'w-20', 'w-12']} />,
  businessrules:   <TableSkeleton cols={['w-10', 'w-40', 'w-20', 'w-16', 'w-14']} />,
  actions:         <TableSkeleton cols={['w-10', 'w-36', 'w-24', 'w-16', 'w-14', 'w-12']} />,
  stakeholders:    <TableSkeleton cols={['w-10', 'w-32', 'w-20', 'w-24', 'w-16', 'w-12']} />,
  changes:         <TableSkeleton cols={['w-10', 'w-32', 'w-20', 'w-16', 'w-14', 'w-12']} />,
  glossary:        <TableSkeleton cols={['w-10', 'w-32', 'w-40', 'w-20', 'w-28']} />,
  traceability:    <TableSkeleton cols={['w-10', 'w-28', 'w-24', 'w-20', 'w-20', 'w-16']} />,
};

export function TabFallback({ activeTab }) {
  return (
    <div className="aura-content-enter">
      {TAB_SKELETON_MAP[activeTab] || <TableSkeleton />}
    </div>
  );
}

export function ModalFallback() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-panel rounded-2xl p-8 flex flex-col items-center gap-4 border border-white/10 shadow-2xl">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
        </div>
        <span className="text-xs font-bold tracking-widest uppercase neon-cyan opacity-70">Yükleniyor</span>
      </div>
    </div>
  );
}
