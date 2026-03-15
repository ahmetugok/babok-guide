import React from 'react';
import { Wrench } from 'lucide-react';
import { techniquesData } from '../constants/index.js';

export function TechniquesTab({ babokData, techFilter, setTechFilter }) {
  return (
    <div className="space-y-4">
      <div className="bg-emerald-500/10 text-emerald-800 p-4 rounded-lg flex gap-3 items-start border border-emerald-100 mb-6">
        <Wrench className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="text-sm">
          <strong>İş Analizi Teknikleri:</strong> BABOK'ta 50'den fazla teknik bulunur. Burada en sık kullanılan ve her analistin alet çantasında bulunması gereken temel yöntemleri bulabilirsiniz.
        </p>
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {[['all', 'Tümü'], ...babokData.map(ka => [ka.id, ka.title.split(' ')[0]])].map(([id, lbl]) => (
          <button key={id} onClick={() => setTechFilter(id)} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors border ${techFilter === id ? 'bg-emerald-600/80 text-white border-emerald-600' : 'bg-white/5 text-slate-400 border-white/10 hover:border-emerald-500/30'}`}>{lbl}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {techniquesData.filter(t => techFilter === 'all' || t.relatedKA.includes(techFilter)).map(tech => (
          <div key={tech.id} className="bg-white/5 p-5 rounded-xl border border-white/10 shadow-lg shadow-black/20 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg text-slate-100 mb-2">{tech.name}</h3>
            <p className="text-sm text-slate-400 mb-4">{tech.desc}</p>
            <div className="bg-white/5 p-3 rounded-md border border-white/10">
              <span className="text-xs font-bold text-slate-400 uppercase">En İyi Nerede Kullanılır?</span>
              <p className="text-sm text-slate-300 mt-1">{tech.bestFor}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
