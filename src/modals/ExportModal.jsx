import { useState, useEffect } from 'react';
import { Download, Copy, X, Loader2 } from 'lucide-react';
import { generateBABOKReport, generateBABOKSections } from '../utils/exportEngine.js';
import { generateDocx } from '../utils/docxExporter.js';
import { useProjectStore, selectActiveProject } from '../store/projectStore.js';
import { useUIStore } from '../store/uiStore.js';

const SECTION_LABELS = [
  'Özet', 'Paydaş', 'Varsayım', 'İş Kuralı',
  'Gereksinim', 'Risk', 'Değişiklik', 'Aksiyon',
];

export function ExportModal() {
  const activeProject      = useProjectStore(selectActiveProject);
  const closeModal = useUIStore((s) => s.closeModal);

  const [activeSection, setActiveSection] = useState(0);
  const [sections, setSections]           = useState([]);
  const [fullReport, setFullReport]       = useState('');
  const [copied, setCopied]               = useState(false);
  const [docxLoading, setDocxLoading]     = useState(false);

  useEffect(() => {
    if (!activeProject) return;
    const s = generateBABOKSections(activeProject);
    const r = generateBABOKReport(activeProject);
    setSections(s);
    setFullReport(r);
    setActiveSection(0);
  }, [activeProject]);

  const p    = activeProject || {};
  const reqs = p.requirements   || [];
  const risks = p.risks         || [];
  const crs  = p.changeRequests || [];
  const asms = p.assumptions    || [];

  const copy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const downloadDocx = async () => {
    setDocxLoading(true);
    try { await generateDocx(p); }
    finally { setDocxLoading(false); }
  };

  const download = () => {
    const blob = new Blob([fullReport], { type: 'text/markdown' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `${p.name || 'proje'}_BABOK.md`; a.click();
    URL.revokeObjectURL(url);
  };

  const onClose = closeModal;

  const badges = [
    { label: 'Gereksinim', value: reqs.length, color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
    { label: 'Açık Risk',  value: risks.filter(r => r.status === 'Açık').length, color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    { label: 'Bekleyen CR', value: crs.filter(c => c.status === 'Bekliyor').length, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    { label: 'Doğrulanmamış Vars.', value: asms.filter(a => a.validationStatus === 'Dogrulanmadi').length, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3">
      <div onClick={e => e.stopPropagation()} className="glass-panel shadow-2xl w-full max-w-4xl flex flex-col" style={{ maxHeight: '92vh' }}>

        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-white/10 shrink-0">
          <div>
            <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
              <Download className="text-cyan-400 w-5 h-5" />
              BABOK Proje Raporu — {p.name}
            </h3>
            <div className="flex gap-2 flex-wrap mt-2">
              {badges.map(b => (
                <span key={b.label} className={`text-xs px-2 py-0.5 rounded-full border font-medium ${b.color}`}>
                  {b.value} {b.label}
                </span>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 shrink-0 ml-4">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex gap-1 flex-wrap px-5 pt-3 shrink-0">
          {SECTION_LABELS.map((label, i) => (
            <button
              key={i}
              onClick={() => setActiveSection(i)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                activeSection === i
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-transparent'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-hidden px-5 pt-3 pb-0 min-h-0">
          <pre
            className="w-full h-full overflow-y-auto rounded-lg bg-slate-900 text-green-400 font-mono text-xs leading-relaxed p-4 border border-white/10"
            style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
          >
            {sections[activeSection] || '…'}
          </pre>
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-white/10 shrink-0 flex-wrap">
          <button
            onClick={() => copy(fullReport)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition-colors border border-white/10"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? 'Kopyalandı ✓' : 'Tümünü Kopyala'}
          </button>
          <button
            onClick={() => copy(sections[activeSection] || '')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition-colors border border-white/10"
          >
            <Copy className="w-3.5 h-3.5" />
            Seçili Bölümü Kopyala
          </button>
          <button
            onClick={download}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-cyan-600/80 hover:bg-cyan-500 text-white rounded-lg transition-colors shadow-lg shadow-cyan-900/30"
          >
            <Download className="w-3.5 h-3.5" />
            .md Olarak İndir
          </button>
          <button
            onClick={downloadDocx}
            disabled={docxLoading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-indigo-600/80 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-lg shadow-indigo-900/30 disabled:opacity-60"
          >
            {docxLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            .docx Olarak İndir
          </button>
          <button
            onClick={onClose}
            className="px-3 py-2 text-xs text-slate-400 hover:bg-white/10 rounded-lg transition-colors"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
}
