import React, { useState, useRef, useCallback } from 'react';
import { X, Upload, FileText, Loader2, AlertTriangle } from 'lucide-react';
import { readFileAsText } from '../utils/documentParser.js';
import { analyzeDocument } from '../utils/groqClient.js';
import { AnalysisResultsModal } from './AnalysisResultsModal.jsx';
import { useProjectStore } from '../store/projectStore.js';
import { useUIStore } from '../store/uiStore.js';

const LOADING_STEPS = [
  'Döküman okunuyor...',
  'Groq\'a gönderiliyor...',
  'Sonuçlar hazırlanıyor...',
];

const ACCEPTED = '.pdf,.txt,.md';

export function DocumentAnalysisModal() {
  const applyDocAnalysisResults  = useProjectStore((s) => s.applyDocAnalysisResults);
  const openModal  = useUIStore((s) => s.openModal);
  const closeModal = useUIStore((s) => s.closeModal);

  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loadingStep, setLoadingStep] = useState(null);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  const onClose = closeModal;

  const handleFile = (f) => {
    if (!f) return;
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['pdf', 'txt', 'md'].includes(ext)) {
      setError('Desteklenmeyen dosya türü. Lütfen .pdf, .txt veya .md dosyası yükleyin.');
      return;
    }
    setFile(f);
    setError('');
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const startAnalysis = async () => {
    if (!file) { setError('Lütfen bir dosya seçin.'); return; }
    const key = localStorage.getItem('groq_api_key') || '';
    if (!key.trim()) {
      onClose();
      openModal('settings');
      return;
    }

    setError('');
    try {
      setLoadingStep(0);
      const text = await readFileAsText(file);

      setLoadingStep(1);
      const data = await analyzeDocument(text, key.trim());

      setLoadingStep(2);
      await new Promise((r) => setTimeout(r, 400));

      setResults(data);
    } catch (err) {
      setError(err.message || 'Beklenmedik bir hata oluştu.');
    } finally {
      setLoadingStep(null);
    }
  };

  const handleApprove = (selected) => {
    applyDocAnalysisResults(selected);
    setResults(null);
    setFile(null);
    onClose();
  };

  if (results) {
    return (
      <AnalysisResultsModal
        results={results}
        onClose={() => setResults(null)}
        onApprove={handleApprove}
      />
    );
  }

  const isLoading = loadingStep !== null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl shadow-2xl border border-white/10 w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center border border-violet-500/20">
              <FileText className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Döküman Analiz Et</h2>
              <p className="text-xs text-slate-400">BABOK v3 — Groq AI destekli</p>
            </div>
          </div>
          <button onClick={onClose} disabled={isLoading} className="text-slate-400 hover:text-white transition-colors disabled:opacity-40">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragging
                ? 'border-violet-400 bg-violet-500/10'
                : file
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-white/15 hover:border-violet-500/50 hover:bg-white/5'
            }`}
            onClick={() => !isLoading && fileInputRef.current?.click()}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED}
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <Upload className={`w-8 h-8 mx-auto mb-2 ${file ? 'text-emerald-400' : 'text-slate-500'}`} />
            {file ? (
              <>
                <p className="text-sm font-medium text-emerald-300">{file.name}</p>
                <p className="text-xs text-slate-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-300">Dosyayı sürükle bırak veya tıkla</p>
                <p className="text-xs text-slate-500 mt-1">PDF, TXT, MD desteklenir</p>
              </>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-sm text-rose-300">{error}</p>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center gap-3 bg-violet-500/10 border border-violet-500/20 rounded-lg p-3">
              <Loader2 className="w-4 h-4 text-violet-400 animate-spin shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-violet-300">{LOADING_STEPS[loadingStep]}</p>
                <div className="flex gap-1 mt-2">
                  {LOADING_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i <= loadingStep ? 'bg-violet-400' : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 pt-0 flex justify-end gap-3">
          <button onClick={onClose} disabled={isLoading} className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40">
            İptal
          </button>
          <button
            onClick={startAnalysis}
            disabled={isLoading || !file}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Analiz Başlat
          </button>
        </div>
      </div>
    </div>
  );
}
