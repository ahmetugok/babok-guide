import React from 'react';
import { MessageSquare } from 'lucide-react';

export function MeetingModal({ form, setForm, onSave, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel p-6 shadow-2xl max-w-md w-full">
        <h3 className="font-bold text-lg text-slate-100 mb-4 flex items-center gap-2"><MessageSquare className="text-violet-500 w-5 h-5" />Yeni Toplantı</h3>
        <div className="space-y-3">
          <input value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} placeholder="Toplantı konusu*" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
          <input value={form.attendees} onChange={e => setForm({ ...form, attendees: e.target.value })} placeholder="Katılımcılar (ör. Ahmet, Ayşe, Mehmet)" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">İptal</button>
          <button onClick={onSave} className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-md font-medium">Oluştur</button>
        </div>
      </div>
    </div>
  );
}
