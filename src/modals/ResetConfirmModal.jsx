import { useProjectStore } from '../store/projectStore.js';
import { useUIStore } from '../store/uiStore.js';

export function ResetConfirmModal() {
  const closeModal    = useUIStore((s) => s.closeModal);
  const resetProgress = useProjectStore((s) => s.resetProgress);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
      <div onClick={e => e.stopPropagation()} className="glass-panel p-6 shadow-2xl max-w-sm w-full">
        <h3 className="font-bold text-lg text-slate-100 mb-2">İlerlemeyi Sıfırla</h3>
        <p className="text-sm text-slate-400 mb-5">Bu proje için tüm checklist ilerlemesi silinecek. Bu işlem geri alınamaz.</p>
        <div className="flex justify-end gap-3">
          <button onClick={closeModal} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">İptal</button>
          <button
            onClick={() => { resetProgress(); closeModal(); }}
            className="px-4 py-2 text-sm bg-rose-600/80 hover:bg-rose-500 text-white rounded-md font-medium"
          >
            Sıfırla
          </button>
        </div>
      </div>
    </div>
  );
}
