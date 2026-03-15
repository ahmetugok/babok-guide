import React from 'react';
import { BrainCircuit } from 'lucide-react';
import { competenciesData } from '../constants/index.js';

export function CompetenciesTab() {
  return (
    <div className="space-y-4">
      <div className="bg-purple-500/10 text-purple-800 p-4 rounded-lg flex gap-3 items-start border border-purple-100 mb-6">
        <BrainCircuit className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="text-sm">
          <strong>Temel Yetkinlikler:</strong> Başarılı bir iş analisti olmak sadece teknikleri bilmekle değil, doğru iletişim ve analitik düşünce yapısına sahip olmakla ilgilidir.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {competenciesData.map(comp => (
          <div key={comp.id} className="bg-white/5 p-5 rounded-xl border border-white/10 border-l-4 border-l-purple-400 shadow-lg shadow-black/20 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg text-slate-100 mb-2">{comp.name}</h3>
            <p className="text-sm text-slate-400">{comp.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
