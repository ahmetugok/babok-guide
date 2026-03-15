import React from 'react';
import { FileStack, FileText, ClipboardCopy, RefreshCw } from 'lucide-react';
import { templatesData } from '../constants/index.js';

export function TemplatesTab({ generateLiveTemplate }) {
  return (
    <div className="space-y-4">
      <div className="bg-amber-500/10 text-amber-800 p-4 rounded-lg flex gap-3 items-start border border-amber-100 mb-6">
        <FileStack className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="text-sm">
          <strong>BABOK Doküman Şablonları:</strong> Bir iş analizi projesinde standart olarak bulunması gereken temel belgelerin yapısal (iskelet) şablonlarıdır. Herhangi bir şablonu kopyalayarak projenizdeki ilgili Word dokümanına, Confluence sayfasına veya Jira Issue açıklamasına doğrudan yapıştırabilir ve altlarını kendi projenize göre doldurabilirsiniz.
        </p>
      </div>

      <div className="space-y-6">
        {templatesData.map(tpl => (
          <div key={tpl.id} className="bg-white/5 rounded-xl border border-white/10 shadow-lg shadow-black/20 overflow-hidden">
            <div className="bg-white/5 border-b border-white/10 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  {tpl.name}
                </h3>
                <p className="text-sm text-slate-400 mt-1">{tpl.purpose}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-start md:self-auto flex-wrap">
                <button
                  onClick={() => { navigator.clipboard.writeText(tpl.format); alert(tpl.name + ' panoya kopyalandı!'); }}
                  className="bg-white/5 border border-white/15 hover:bg-white/10 text-slate-300 py-1.5 px-3 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-black/20"
                >
                  <ClipboardCopy className="w-4 h-4" />
                  Şablonu Kopyala
                </button>
                {['tpl_raci', 'tpl_mom', 'tpl_tm'].includes(tpl.id) && (
                  <button
                    onClick={() => generateLiveTemplate(tpl.id)}
                    className="bg-teal-600/20 border border-teal-500/30 hover:bg-teal-600/30 text-teal-300 py-1.5 px-3 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-black/20"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Canli Veriden Doldur
                  </button>
                )}
              </div>
            </div>
            <div className="p-4 bg-slate-900 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {tpl.format}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
