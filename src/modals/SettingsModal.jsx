import { useState } from 'react';
import { Settings, Eye, EyeOff, X } from 'lucide-react';
import { useUIStore } from '../store/uiStore.js';

export function SettingsModal() {
  const closeModal = useUIStore((s) => s.closeModal);
  const [groqKey, setGroqKey] = useState(() => localStorage.getItem('groq_api_key') || '');
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('groq_api_key', groqKey.trim());
    localStorage.setItem('gemini_api_key', geminiKey.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel p-6 shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
            <Settings className="text-teal-500 w-5 h-5" /> Ayarlar
          </h3>
          <button onClick={() => closeModal()} className="text-slate-400 hover:text-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1.5">Groq API Key</label>
            <div className="relative">
              <input
                type={showGroqKey ? 'text' : 'password'}
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full border border-white/10 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
              <button
                type="button"
                onClick={() => setShowGroqKey(!showGroqKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showGroqKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              console.groq.com adresinden ücretsiz alabilirsiniz. Tarayıcınızda saklanır, sunucuya gönderilmez.
            </p>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1.5">Gemini API Key</label>
            <div className="relative">
              <input
                type={showGeminiKey ? 'text' : 'password'}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIza..."
                className="w-full border border-white/10 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
              <button
                type="button"
                onClick={() => setShowGeminiKey(!showGeminiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              aistudio.google.com adresinden ücretsiz alabilirsiniz. AI Taslak özelliği için gereklidir.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5 items-center">
          {saved && <span className="text-xs text-teal-400">Kaydedildi ✓</span>}
          <button onClick={() => closeModal()} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">
            İptal
          </button>
          <button onClick={handleSave} className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-md font-medium">
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
