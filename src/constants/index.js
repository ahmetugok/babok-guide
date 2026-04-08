import {
  LayoutDashboard, LayoutGrid, Lightbulb, BookOpen, RefreshCw,
  AlertTriangle, ListChecks, Users, BookMarked, ArrowUpRight,
  MessageSquare, CalendarDays, FileStack, Download,
} from 'lucide-react';

// --- PURE JS CONSTANTS (no JSX) ---

export const DEFAULT_PROJECT = {
  id: 'proj_1', name: 'Ana Proje', projectContext: '',
  completedTasks: [], completedSubTasks: [],
  completedTaskDurations: {},
  risks: [], assumptions: [], businessRules: [], changeRequests: [], actions: [], stakeholders: [], requirements: [], meetings: [], ganttTasks: [], reqCounter: 1, brCounter: 1, crCounter: 1,
};

// Timer alanları — yeni meeting/action objeleri oluşturulurken spread edilir
export const DEFAULT_TIMER_FIELDS = {
  timerStartTime: null,
  duration: 0,
  babokKnowledgeArea: '',
};

export const PROB_LABELS = ['', 'Düşük', 'Orta', 'Yüksek'];
export const IMPACT_LABELS = ['', 'Düşük', 'Orta', 'Yüksek'];
export const RACI_LABELS = { R: 'Sorumlu', A: 'Onaylayan', C: 'Danışılan', I: 'Bilgilendirilen' };
export const RACI_COLORS = { R: 'bg-blue-100 text-blue-800', A: 'bg-purple-100 text-purple-800', C: 'bg-amber-100 text-amber-800', I: 'bg-white/10 text-slate-300' };
export const REQ_STATUS_COLORS = { 'Taslak': 'req-status-taslak', 'İncelemede': 'req-status-incelemede', 'Onaylandı': 'req-status-onaylandi', 'Geliştiriliyor': 'req-status-gelistiriliyor', 'Test': 'req-status-test', 'Canlıda': 'req-status-canlida' };
export const NOTE_TYPE_COLORS = { 'Karar': 'bg-blue-500/15 text-blue-300 border-blue-500/20', 'Açık Nokta': 'bg-rose-500/15 text-rose-300 border-rose-500/20', 'Aksiyon': 'bg-amber-500/15 text-amber-300 border-amber-500/20', 'Gereksinim': 'bg-teal-500/15 text-teal-300 border-teal-500/20', 'Varsayim': 'bg-amber-500/10 text-amber-200 border-amber-400/20' };
export const GANTT_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#f97316'];

// --- BABOK TECHNIQUES DATA ---
export const techniquesData = [
  { id: 'tech1', name: 'Atölye Çalışmaları (Workshops)', desc: 'Paydaşları bir araya getirerek hızlıca gereksinim toplama, karar alma ve fikir birliğine varma tekniğidir.', bestFor: 'Farklı departmanların uzlaşması gerektiğinde.', relatedKA: ['ka2', 'ka3'] },
  { id: 'tech2', name: 'Süreç Modelleme (Process Modelling)', desc: 'İşin nasıl yapıldığını (BPMN, Akış Şeması vb. ile) görselleştirme tekniği.', bestFor: 'Mevcut durumu anlamak ve dar boğazları tespit etmek.', relatedKA: ['ka1', 'ka4'] },
  { id: 'tech3', name: 'Görüşmeler (Interviews)', desc: 'Birebir veya küçük gruplarla soru-cevap yaparak derinlemesine bilgi alma yöntemi.', bestFor: 'Hassas konular veya uzmanlardan spesifik bilgiler almak.', relatedKA: ['ka3'] },
  { id: 'tech4', name: 'Kullanıcı Hikayeleri (User Stories)', desc: 'İhtiyacı, kullanıcının perspektifinden "Bir [rol] olarak, [hedef] istiyorum, böylece [fayda] sağlayabilirim" formatında yazma.', bestFor: 'Çevik (Agile) projelerde gereksinimleri ifade etmek.', relatedKA: ['ka4', 'ka5'] },
  { id: 'tech5', name: 'Kök Neden Analizi (Root Cause Analysis)', desc: 'Problemin yüzeydeki belirtilerini değil, altında yatan asıl sebebi (5 Neden, Balık Kılçığı vb.) bulma tekniği.', bestFor: 'Sorunların tekrarlamasını önlemek.', relatedKA: ['ka1', 'ka3'] },
  { id: 'tech6', name: 'Veri Modelleme (Data Modelling)', desc: 'Sistemin kullanacağı kavramları ve bu kavramlar arasındaki ilişkileri (ER Diyagramları) standartlaştırma.', bestFor: 'Veritabanı tasarımı öncesi kavramsal netlik sağlamak.', relatedKA: ['ka4'] },
];

// --- BABOK UNDERLYING COMPETENCIES DATA ---
export const competenciesData = [
  { id: 'comp1', name: 'Analitik Düşünme ve Problem Çözme', desc: 'Sistem düşüncesi, kök neden analizi ve yaratıcı düşünmeyi kapsar. Karmaşık sorunları basite indirgeme yeteneğidir.' },
  { id: 'comp2', name: 'Davranışsal Özellikler', desc: 'Etik kurallara uyma, kişisel organizasyon ve güvenilirlik. Analistin tarafsız ve dürüst olması kritik öneme sahiptir.' },
  { id: 'comp3', name: 'İş Bilgisi (Business Knowledge)', desc: 'Çalışılan sektörü, kurumun yapısını ve çözüm vizyonunu anlama. "Ne" yaptığınızı değil "neden" yaptığınızı bilmektir.' },
  { id: 'comp4', name: 'İletişim Becerileri', desc: 'Sözlü, yazılı iletişim ve aktif dinleme. Yanlış anlaşılan gereksinimlerin çoğu kötü dinlemeden kaynaklanır.' },
  { id: 'comp5', name: 'Etkileşim Becerileri', desc: 'Fasilitasyon, liderlik, müzakere ve takım çalışması. Çatışan paydaşları ortak bir noktada buluşturma sanatıdır.' },
  { id: 'comp6', name: 'Araçlar ve Teknoloji', desc: 'Gereksinim yönetim araçları (Jira vb.), modelleme araçları (Visio, Miro) ve ofis yazılımlarını etkin kullanabilme.' },
];

// --- TAB NAVIGATION ITEMS ---
export const TAB_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'knowledge_areas', label: 'Checklistler', Icon: LayoutGrid },
  { id: 'assumptions', label: 'Varsayimlar', Icon: Lightbulb },
  { id: 'businessrules', label: 'Is Kurallari', Icon: BookOpen },
  { id: 'changes', label: 'Degisiklikler', Icon: RefreshCw },
  { id: 'risks', label: 'Riskler', Icon: AlertTriangle },
  { id: 'actions', label: 'Aksiyonlar', Icon: ListChecks },
  { id: 'stakeholders', label: 'Paydaşlar', Icon: Users },
  { id: 'requirements', label: 'Gereksinimler', Icon: BookMarked },
  { id: 'traceability', label: 'Traceability', Icon: ArrowUpRight },
  { id: 'meetings', label: 'Toplantılar', Icon: MessageSquare },
  { id: 'gantt', label: 'Timeline', Icon: CalendarDays },
  { id: 'templates', label: 'Dokümanlar', Icon: FileStack },
  { id: 'export', label: 'Export', Icon: Download },
];

// --- BABOK DOCUMENT TEMPLATES DATA ---
export const templatesData = [
  {
    id: 'tpl_brd',
    name: 'İş Gereksinim Dokümanı (BRD - Business Requirements Document)',
    purpose: 'Projenin "ne" yapacağını ve "neden" yapıldığını iş biriminin dilinden anlatan temel sözleşmedir.',
    format: `1. YÖNETİCİ ÖZETİ\n   [Projenin genel amacı ve beklenen faydalar]\n\n2. İŞ HEDEFLERİ\n   - Hedef 1: [Örn: Operasyonel maliyetleri %10 düşürmek]\n   - Hedef 2: ...\n\n3. KAPSAM (IN-SCOPE / OUT-OF-SCOPE)\n   - Kapsam İçi: [Projenin teslim edeceği özellikler]\n   - Kapsam Dışı: [Açıkça yapılmayacağı belirtilen özellikler]\n\n4. PAYDAŞLAR VE KULLANICI ROLLERİ\n   [Sistemi kimler, hangi yetkilerle kullanacak?]\n\n5. MEVCUT DURUM VE GELECEK DURUM (AS-IS & TO-BE)\n   [Mevcut sürecin sıkıntıları ve yeni tasarlanan sürecin özeti]\n\n6. İŞ GEREKSİNİMLERİ (YÜKSEK SEVİYE)\n   - BR-01: Sistem ... yapabilmelidir.\n   - BR-02: Kullanıcı ... görebilmelidir.\n\n7. İŞ KURALLARI (BUSINESS RULES)\n   [Örn: Bir işlem onaylanmadan önce bakiye kontrol edilmelidir.]\n\n8. ONAYLAR (SIGN-OFF)\n   [İsim / Unvan / İmza / Tarih]`
  },
  {
    id: 'tpl_bc',
    name: 'İş Vakası (Business Case)',
    purpose: 'Yönetimden veya sponsorlardan projeyi başlatmak/bütçe almak için gereken gerekçelendirme belgesidir.',
    format: `1. PROBLEM / FIRSAT TANIMI\n   [Kurumun çözmesi gereken sorun veya yakalamak istediği fırsat]\n\n2. ÇÖZÜM ALTERNATİFLERİ\n   - Alternatif A (Örn: Hazır ürün satın alma): Artıları/Eksileri\n   - Alternatif B (Örn: İçeride geliştirme): Artıları/Eksileri\n   - Alternatif C (Hiçbir şey yapmama durumu): Etkileri\n\n3. ÖNERİLEN ÇÖZÜM VE GEREKÇESİ\n   [Hangi alternatif neden seçildi? Neden en yüksek değeri üretiyor?]\n\n4. FİNANSAL ANALİZ (MALİYET/FAYDA)\n   - Tahmini Başlangıç Maliyeti: ...\n   - Beklenen Fayda (Gelir Artışı/Maliyet Düşüşü): ...\n   - ROI (Yatırım Getirisi) ve Geri Dönüş Süresi (Payback Period): ...\n\n5. PROJE YOL HARİTASI\n   [Ana fazlar ve tahmini süreler]\n\n6. RİSKLER VE KISITLAR\n   [Projenin başarıya ulaşmasını engelleyebilecek faktörler ve yasal/teknik kısıtlar]`
  },
  {
    id: 'tpl_cr',
    name: 'Değişiklik Talep Formu (Change Request - CR)',
    purpose: 'Proje esnasında gelen ve kapsamı/bütçeyi/zamanı etkileyen yeni taleplerin kontrollü şekilde yönetilmesini sağlar.',
    format: `1. TALEP BİLGİLERİ\n   - Talep Eden: ...\n   - Tarih: ...\n   - Talep ID: CR-[No]\n\n2. DEĞİŞİKLİĞİN TANIMI\n   [Mevcut durumda ne isteniyor? Sisteme ne eklenecek/çıkarılacak?]\n\n3. DEĞİŞİKLİĞİN GEREKÇESİ (BUSINESS DRIVER)\n   [Neden bu değişikliğe ihtiyacımız var? Yapılmazsa ne gibi bir zarar oluşur?]\n\n4. ETKİ ANALİZİ (IMPACT ANALYSIS - Analist/Ekip Tarafından Doldurulur)\n   - Etkilenen Modüller/Süreçler: ...\n   - Efor / Maliyet Etkisi (Adam/Gün): ...\n   - Zaman Çizelgesine Etkisi (Gecikme süresi): ...\n   - Diğer Projelere Etkisi: ...\n\n5. CCB (Değişiklik Kontrol Kurulu) KARARI\n   [ ] Onaylandı    [ ] Reddedildi    [ ] Ertelendi (Faz 2'ye bırakıldı)\n   - Gerekçe / Notlar: ...\n   - Onaylayan(lar): ...`
  },
  {
    id: 'tpl_mom',
    name: 'Toplantı Tutanağı (Meeting Minutes - MoM)',
    purpose: 'Ortaya çıkarma (elicitation) çalışmaları sonrası kararları, açık noktaları ve aksiyonları kayıt altına alır.',
    format: `1. TOPLANTI BİLGİLERİ\n   - Tarih / Saat: ...\n   - Konu: ...\n   - Katılımcılar (Gelenler ve Mazeretli Olanlar): ...\n\n2. GÖRÜŞÜLEN KONULAR VE ALINAN KARARLAR\n   - Karar 1: [Örn: Parolalar en az 8 karakter olacak şekilde mutabık kalındı.]\n   - Karar 2: ...\n\n3. AÇIK NOKTALAR (OPEN ISSUES)\n   [Toplantıda çözülemeyen, dışarıdan teyit/araştırma bekleyen konular]\n   - Sorun/Konu: ... | Sorumlu Kişi: ... | Hedef Tarih: ...\n\n4. AKSİYON PLANLARI (ACTION ITEMS)\n   - Aksiyon 1: [Yapılacak İş] | Sorumlu: [Kim Yapacak] | Tarih: [Ne Zaman Bitecek]\n   - Aksiyon 2: ...`
  },
  {
    id: 'tpl_raci',
    name: 'Paydaş Kayıt ve RACI Matrisi',
    purpose: 'Projeye dahil olan kişileri ve karar/onay mekanizmasındaki rollerini netleştirerek iletişim kazalarını önler.',
    format: `| Paydaş Adı / Departman | Projedeki Rolü | İlgi | Etki | RACI Rolü |\n| :--- | :--- | :--- | :--- | :--- |\n| Ahmet Y. (Genel Müdür Yrd.) | Sponsor / Bütçe Onayı | Yüksek | Yüksek | A (Accountable - Onaylayan) |\n| Ayşe K. (İnsan Kaynakları) | Süreç Sahibi (Product Owner) | Yüksek | Yüksek | R (Responsible - Sorumlu) |\n| Mehmet T. (Yazılım Ekibi) | Geliştirici Lideri | Düşük | Yüksek | C (Consulted - Danışılan) |\n| Hukuk Departmanı | Yasal Uyumluluk Kontrolü | Düşük | Yüksek | C (Consulted - Danışılan) |\n| Son Kullanıcılar (Çalışanlar) | Sistemi Kullanacak Olanlar | Yüksek | Düşük | I (Informed - Bilgilendirilen) |\n\nR (Responsible): İşi yapan, gereksinimi veren, süreci yürüten ana kişi/ekip.\nA (Accountable): Son onayı veren, nihai sorumluluğu ve yetkiyi taşıyan kişi (Tek kişidir).\nC (Consulted): Fikri sorulan, işe başlamadan önce danışılan uzmanlar.\nI (Informed): Sadece sonuçtan ve gelişmelerden haberdar edilen kişiler.`
  },
  {
    id: 'tpl_tm',
    name: 'İzlenebilirlik Matrisi (Traceability Matrix)',
    purpose: 'Gereksinimlerin iş hedefleriyle ve yazılım testleriyle bağlantısını kurarak hiçbir şeyin atlanmamasını sağlar.',
    format: `| Req ID | İş Hedefi / Kapsam | Gereksinim Adı / Açıklaması | İlgili Modül / Ekran | Yazılım Geliştirici / Görev ID | Test Senaryosu ID | Durum |\n| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n| REQ-001 | H-01: Güvenliği Artırmak | Şifre sıfırlama linki e-posta ile iletilmeli. | Login Modülü | JIRA-1045 | TEST-001 | Canlıda |\n| REQ-002 | H-02: Hızı Artırmak | Arama sonuçları 2 sn altında gelmeli. | Arama Modülü | JIRA-1048 | TEST-005 | Test Aşamasında |\n| REQ-003 | ... | ... | ... | ... | ... | ... |`
  }
];
