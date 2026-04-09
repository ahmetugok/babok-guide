import { Sparkles, X, Loader2, Copy, RotateCcw } from 'lucide-react';
import { formatMarkdown } from '../utils.js';
import { useUIStore } from '../store/uiStore.js';

export function AiGenerationModal() {
  const modalData          = useUIStore((s) => s.modalData);
  const closeModal         = useUIStore((s) => s.closeModal);
  const handleRegenerateAI = useUIStore((s) => s.handleRegenerateAI);

  const { loading, result, activeTask } = modalData;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel w-full shadow-2xl max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-indigo-600/80 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-lg">AI Taslak: {activeTask?.name}</h3>
          </div>
          <button onClick={closeModal} className="text-indigo-100 hover:text-white transition-colors focus:outline-none">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 bg-white/5">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 text-indigo-600">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="font-medium">Proje bağlamınıza göre özel dokümanlar hazırlanıyor...</p>
              <p className="text-sm text-slate-400 mt-2">Bu işlem birkaç saniye sürebilir.</p>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20 overflow-x-auto">
              <div className="text-slate-300 leading-relaxed text-[15px]"
                dangerouslySetInnerHTML={formatMarkdown(result)} />
            </div>
          )}
        </div>
        <div className="bg-white/5 border-t border-white/10 p-4 flex justify-end gap-3">
          <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-white/10 rounded-md transition-colors">Kapat</button>
          {!loading && (
            <button onClick={handleRegenerateAI} className="px-4 py-2 text-sm font-medium bg-white/5 text-slate-300 hover:bg-white/10 rounded-md transition-colors flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />Yeniden Üret
            </button>
          )}
          {!loading && (
            <button
              onClick={() => { navigator.clipboard.writeText(result); alert('Taslak panoya kopyalandı!'); }}
              className="px-4 py-2 text-sm font-medium bg-indigo-500/10 text-indigo-700 hover:bg-indigo-100 rounded-md transition-colors flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />Kopyala
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
