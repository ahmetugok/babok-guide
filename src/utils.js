// --- PURE UTILITY FUNCTIONS ---

export const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const getRiskLevel = (prob, impact) => {
  const s = prob * impact;
  if (s >= 7) return { label: 'Kritik', cls: 'text-rose-700 bg-rose-100 border-rose-500/30', dot: 'bg-rose-500/100' };
  if (s >= 4) return { label: 'Orta', cls: 'text-amber-700 bg-amber-100 border-amber-500/30', dot: 'bg-amber-500/100' };
  return { label: 'Düşük', cls: 'text-emerald-700 bg-emerald-100 border-emerald-500/30', dot: 'bg-emerald-500/100' };
};

export const isOverdue = (a) => a.status !== 'Tamamlandı' && a.dueDate && new Date(a.dueDate) < new Date();

export const formatMarkdown = (text) => {
  if (!text) return { __html: '' };
  let html = text
    .replace(/</g, "&lt;").replace(/>/g, "&gt;") // Basit güvenlik
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-900">$1</strong>') // Kalın
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // İtalik
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-6 mb-2 text-indigo-700">$1</h3>') // Başlık 3
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-8 mb-3 text-indigo-800 border-b border-indigo-500/15 pb-2">$1</h2>') // Başlık 2
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4 text-indigo-900 border-b-2 border-indigo-500/20 pb-2">$1</h1>') // Başlık 1
    .replace(/^- (.*$)/gim, '<li class="ml-5 list-disc mb-1.5">$1</li>') // Liste
    .replace(/^\* (.*$)/gim, '<li class="ml-5 list-disc mb-1.5">$1</li>') // Liste (Alternatif)
    .replace(/\n/g, '<br />'); // Yeni satırlar

  // Liste elemanlarını ul içine alma (Basit çözüm)
  html = html.replace(/(<li.*?>.*?<\/li>(?:<br \/>)*)+/g, '<ul class="my-3">$&</ul>');

  return { __html: html };
};
