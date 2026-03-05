import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, ChevronDown, ChevronRight, BookOpen, Target, Users, Layers,
  RefreshCw, Activity, Info, Lightbulb, Wrench, BrainCircuit, LayoutGrid, FileText,
  CheckSquare, Square, Sparkles, Bot, X, Copy, Loader2, FileStack, ClipboardCopy,
  AlertTriangle, Trash2, Pencil, Plus, Download, LayoutDashboard, ListChecks,
  StickyNote, FolderPlus, RotateCcw, MessageSquare, Clock, UserPlus, ChevronUp,
  Shield, ArrowUpRight, TrendingUp, BookMarked, CalendarDays, GripVertical, ChevronLeft, ChevronRight as ChevronRightIcon
} from 'lucide-react';

// --- BABOK KNOWLEDGE AREAS AND DETAILED TASKS DATA ---
const babokData = [
  {
    id: 'ka1',
    title: 'Strateji Analizi',
    description: 'Bir ihtiyacı tanımlama, mevcut durumu anlama ve istenen gelecekteki duruma ulaşmak için bir değişim stratejisi önerme.',
    icon: <Target className="w-6 h-6 text-purple-500" />,
    color: 'border-purple-200 bg-purple-50',
    headerColor: 'text-purple-700',
    tasks: [
      {
        id: 't1_1',
        name: 'Mevcut Durumu Analiz Etme',
        purpose: 'Kurumun şu anki çalışma şeklini ve problemin/fırsatın kök nedenlerini anlamak.',
        deliverables: 'Problem Bildirimi (Problem Statement), Mevcut Durum (As-Is) Süreç Modeli, Kök Neden Analizi Raporu',
        checklist: [
          { id: 'c1_1_1', text: 'Çözülmesi gereken iş problemini veya yakalanacak fırsatı 1-2 cümlelik net bir "Problem Bildirimi" formatında yazın.' },
          { id: 'c1_1_2', text: 'Sorundan etkilenen departmanları, rolleri ve mevcut iş akışını (As-Is) tespit edip temel bir şema ile çizin.' },
          { id: 'c1_1_3', text: 'Mevcut IT sistemlerinin, altyapının ve donanımın süreç üzerindeki kısıtlamalarını (darboğazları) belgeleyin.' },
          { id: 'c1_1_4', text: 'Problemin yüzeysel belirtilerine değil, asıl kaynağına inmek için "5 Neden" veya "Balık Kılçığı" tekniği ile kök neden analizi yapın.' }
        ],
        tips: 'Müşteri size gelip "Bize yeni bir CRM sistemi lazım" diyorsa, "Neden?" diye sorarak asıl derdi (ör: müşteri verilerinin kaybolması) bulun. Çözüme atlamayın.'
      },
      {
        id: 't1_2',
        name: 'Gelecek Durumu Tanımlama',
        purpose: 'İhtiyaç karşılandığında kurumun nasıl görüneceğini ve hangi hedeflere ulaşılacağını belirlemek.',
        deliverables: 'İş Hedefleri (Business Objectives), Gelecek Durum (To-Be) Modeli, Kapsam Sınırları',
        checklist: [
          { id: 'c1_2_1', text: 'Çözümün ulaşacağı iş hedeflerini SMART (Spesifik, Ölçülebilir, Ulaşılabilir, İlgili, Zaman Sınırlı) formatında listeleyin (Ör: 6 ay içinde iade oranını %15 azaltmak).' },
          { id: 'c1_2_2', text: 'Hedeflenen yeni iş akışını (To-Be) kaba taslak olarak tasarlayın.' },
          { id: 'c1_2_3', text: 'Gelecekteki yapının gerektireceği yeni yetenekleri (yeni personel, yeni yazılım becerisi) listeleyin.' },
          { id: 'c1_2_4', text: 'Projenin neleri kapsayacağını ve daha önemlisi nelerin kapsam dışı (Out of Scope) kalacağını net olarak yazın.' }
        ],
        tips: 'Gelecek durum, paydaşlar için net bir "kuzey yıldızı" olmalıdır. Nereye gittiğinizi bilmezseniz, hiçbir rüzgar size yardım edemez.'
      },
      {
        id: 't1_3',
        name: 'Riskleri Değerlendirme',
        purpose: 'Değişimin önündeki belirsizlikleri ve olumsuz olasılıkları proaktif olarak yönetmek.',
        deliverables: 'Risk Kayıt Defteri (Risk Register), Risk Azaltma Planları',
        checklist: [
          { id: 'c1_3_1', text: 'Projeyi veya hedeflenen değişimi engelleyebilecek olası riskleri (bütçe kesintisi, personel direnci, teknik yetersizlik) beyin fırtınası ile belirleyin.' },
          { id: 'c1_3_2', text: 'Her risk için "Gerçekleşme Olasılığı" (Düşük/Orta/Yüksek) ve "Etki Seviyesi" (Düşük/Orta/Yüksek) puanlaması yapın.' },
          { id: 'c1_3_3', text: 'Puanı yüksek (Kritik) riskler için bir "Kaçınma", "Azaltma" veya "Transfer etme" stratejisi belirleyip sorumlularını atayın.' }
        ],
        tips: 'Risk analizi tek seferlik bir evrak işi değildir. Proje ilerledikçe bu listeyi düzenli olarak güncelleyin ve yeni riskleri arayın.'
      },
      {
        id: 't1_4',
        name: 'Değişim Stratejisini Tanımlama',
        purpose: 'Mevcut durumdan gelecek duruma geçiş için uygulanabilir bir yol haritası oluşturmak.',
        deliverables: 'İş Vakası (Business Case), Çözüm Yaklaşımı, Yol Haritası (Roadmap)',
        checklist: [
          { id: 'c1_4_1', text: 'Hedefe ulaşmak için 2 veya 3 farklı çözüm alternatifi (A, B, C planları) belirleyin.' },
          { id: 'c1_4_2', text: 'Her alternatif için tahmini Maliyet ve Fayda analizi (Cost/Benefit Analysis) veya Yatırım Getirisi (ROI) hesabı yapın.' },
          { id: 'c1_4_3', text: 'Sponsorlarla görüşerek en uygun alternatifi seçin ve gerekçesini (İş Vakası) dökümante edin.' },
          { id: 'c1_4_4', text: 'Seçilen çözüm için kaba bir zaman çizelgesi ve sürümlendirme (faz 1, faz 2) planı çıkarın.' }
        ],
        tips: 'Karar vericilere asla tek bir seçenekle gitmeyin. "Satın alma", "Sıfırdan geliştirme" veya "Mevcut olanı iyileştirme" gibi alternatifler sunun.'
      }
    ]
  },
  {
    id: 'ka2',
    title: 'İş Analizi Planlama ve İzleme',
    description: 'İş analistinin görevlerini nasıl organize edeceğini, kimlerle çalışacağını ve süreci nasıl yöneteceğini belirleme.',
    icon: <BookOpen className="w-6 h-6 text-blue-500" />,
    color: 'border-blue-200 bg-blue-50',
    headerColor: 'text-blue-700',
    tasks: [
      {
        id: 't2_1',
        name: 'İş Analizi Yaklaşımını Planlama',
        purpose: 'Analiz çalışmalarının metodolojisini (Öngörücü/Şelale veya Çevik/Agile) ve genel planını belirlemek.',
        deliverables: 'İş Analizi Planı, Görev Dağılım ve Tahminleme Listesi',
        checklist: [
          { id: 'c2_1_1', text: 'Kurumun ve projenin yapısına göre metodolojiyi seçin (Çevik yaklaşım mı, Şelale mi olacak?).' },
          { id: 'c2_1_2', text: 'Geliştirilecek çıktıların (User Story, Use Case, BRD vb.) formatına karar verin.' },
          { id: 'c2_1_3', text: 'Yapılacak tüm iş analizi aktivitelerini (toplantılar, dokümantasyon) listeleyin.' },
          { id: 'c2_1_4', text: 'Aktiviteler için adam-gün efor tahmini yapıp proje yöneticisiyle takvime entegre edin.' }
        ],
        tips: 'Çevik (Agile) bir projedeyseniz, ağır dokümantasyon yerine hafif, iletişim odaklı ve sürekli değişime açık bir yaklaşım planlayın.'
      },
      {
        id: 't2_2',
        name: 'Paydaş Katılımını Planlama',
        purpose: 'Değişimden etkilenecek kişileri belirlemek ve onlarla en iyi nasıl iletişim kurulacağını planlamak.',
        deliverables: 'Paydaş Kayıt Defteri (Stakeholder Register), İletişim Planı, RACI Matrisi',
        checklist: [
          { id: 'c2_2_1', text: 'Projeye dahil olacak, projeden etkilenecek veya projeyi etkileyecek tüm paydaşların (kişi/departman) listesini çıkarın.' },
          { id: 'c2_2_2', text: 'Paydaşları İlgi/Etki matrisine yerleştirerek kiminle ne kadar yakın çalışmanız gerektiğini belirleyin.' },
          { id: 'c2_2_3', text: 'Önemli paydaşlar için bir RACI (Sorumlu, Onaylayan, Danışılan, Bilgilendirilen) matrisi oluşturun.' },
          { id: 'c2_2_4', text: 'Her paydaş grubuna hangi sıklıkta (Haftalık/Aylık) ve hangi yöntemle (Toplantı/E-posta) bilgi verileceğini planlayın.' }
        ],
        tips: 'Masada olması gereken bir paydaşı unutursanız, projenin en sonunda "bu bizim işimize yaramaz" diyerek tüm sistemi çöpe attırabilir.'
      },
      {
        id: 't2_3',
        name: 'İş Analizi Yönetişimini Planlama',
        purpose: 'Gereksinimlerde değişiklik olduğunda veya karar alınması gerektiğinde sürecin nasıl işleyeceğini belirlemek.',
        deliverables: 'Değişiklik Yönetimi Süreci, Onay Yetki Matrisi',
        checklist: [
          { id: 'c2_3_1', text: 'Gereksinim paketlerini, modelleri ve tasarımları son olarak kimin/kimlerin onaylayacağını netleştirin.' },
          { id: 'c2_3_2', text: 'Projeye yeni bir özellik (Değişiklik Talebi) eklenmek istendiğinde bunun nasıl talep edileceğini belgeleyin.' },
          { id: 'c2_3_3', text: 'Değişiklikleri değerlendirecek ve onaylayacak bir "Değişiklik Kontrol Kurulu" (CCB) belirleyin.' }
        ],
        tips: '"Gereksinimler değişirse veya kapsam büyürse buna kim karar verecek?" sorusunun cevabını işin başında kurala bağlayın.'
      },
      {
        id: 't2_4',
        name: 'İş Analizi Bilgi Yönetimini Planlama',
        purpose: 'Gereksinimlerin, modellerin ve belgelerin nerede, nasıl saklanacağını ve izleneceğini belirlemek.',
        deliverables: 'Bilgi Yönetimi Standartları (Araçlar, Klasör Yapısı, Versiyonlama)',
        checklist: [
          { id: 'c2_4_1', text: 'Çalışmaların kaydedileceği dijital platformu (Jira, Confluence, TFS, SharePoint) seçin.' },
          { id: 'c2_4_2', text: 'Dokümanların ve gereksinimlerin isimlendirme standartlarını (Ör: PRJ_Gereksinim_V1.2.docx) belirleyin.' },
          { id: 'c2_4_3', text: 'Gereksinimlerin durumlarını (Taslak, İncelemede, Onaylandı, Geliştiriliyor) temsil edecek statü akışını oluşturun.' }
        ],
        tips: 'Ekibe yeni katılan biri, sizin yönlendirmeniz olmadan klasörlere bakarak projenin nerede olduğunu anlayabilmelidir.'
      }
    ]
  },
  {
    id: 'ka3',
    title: 'Ortaya Çıkarma ve İşbirliği',
    description: 'Paydaşlardan, dokümanlardan veya sistemlerden bilgi toplama ve sürekli iletişimi sağlama süreci.',
    icon: <Users className="w-6 h-6 text-orange-500" />,
    color: 'border-orange-200 bg-orange-50',
    headerColor: 'text-orange-700',
    tasks: [
      {
        id: 't3_1',
        name: 'Ortaya Çıkarma Çalışmalarını Hazırlama',
        purpose: 'Bilgi toplama seanslarının (toplantı, anket vb.) verimli geçmesi için ön hazırlık yapmak.',
        deliverables: 'Toplantı Ajandası, Mülakat Soru Seti, Çalıştay (Workshop) Planı',
        checklist: [
          { id: 'c3_1_1', text: 'Bilgi toplamak için en uygun tekniği seçin (Birebir Mülakat, Grup Çalıştayı, Anket, Doküman Analizi).' },
          { id: 'c3_1_2', text: 'Görüşülecek paydaşların projeyle ilgili teknik/iş seviyesine uygun soru listeleri hazırlayın.' },
          { id: 'c3_1_3', text: 'Toplantı takvimlerini ayarlayın ve katılımcılara ne hazırlığı yapmaları gerektiğini anlatan bir ajanda gönderin.' },
          { id: 'c3_1_4', text: 'Mevcut sistem dokümanlarını veya yasal mevzuatları toplantı öncesi okuyup çalışın.' }
        ],
        tips: 'Hazırlıksız girilen bir mülakat hem vakit kaybıdır hem de paydaşın size olan güvenini sıfırlar.'
      },
      {
        id: 't3_2',
        name: 'Ortaya Çıkarma Çalışmalarını Yürütme',
        purpose: 'Planlanan teknikleri kullanarak gereksinimleri, iş kurallarını ve süreçleri keşfetmek.',
        deliverables: 'Ham Toplantı Notları, Ses Kayıtları (İzinliyse), Kavramsal Taslaklar',
        checklist: [
          { id: 'c3_2_1', text: 'Toplantılarda yönlendirici açık uçlu sorular sorarak paydaşları konuşturun ve aktif dinleme yapın.' },
          { id: 'c3_2_2', text: 'Sürekli dile getirilen "Varsayımları" ve çözülmemiş "Açık Noktaları (Open Issues)" yakalayıp not alın.' },
          { id: 'c3_2_3', text: 'Gereksinimleri alırken arkasındaki iş kurallarını (Ör: Kredi onay limiti 50.000 TL\'dir) sormayı unutmayın.' },
          { id: 'c3_2_4', text: 'Kullanıcıların sadece "ekranda buton olsun" gibi çözüm taleplerine değil, "bunu neden istiyorsunuz?" sorusuyla asıl hedefe odaklanın.' }
        ],
        tips: 'İnsanlar genellikle çözümü söyler. Analistin asıl görevi, o çözümün altındaki maskelenmiş asıl ihtiyacı bulup çıkarmaktır.'
      },
      {
        id: 't3_3',
        name: 'Ortaya Çıkarma Sonuçlarını Doğrulama',
        purpose: 'Toplanan bilgilerin doğru, tutarlı ve paydaşların asıl niyetini yansıttığından emin olmak.',
        deliverables: 'Doğrulanmış Toplantı Tutanakları (MoM), Teyit Mailleri',
        checklist: [
          { id: 'c3_3_1', text: 'Toplantı sırasında alınan dağınık notları anlamlı metinler halinde temize çekin.' },
          { id: 'c3_3_2', text: 'Notları, toplantıya katılan paydaşlara göndererek "Doğru anlamış mıyım? Eksik var mı?" onayı (teyit) isteyin.' },
          { id: 'c3_3_3', text: 'Farklı paydaşlardan gelen birbiriyle çelişen (Ör: Pazarlama A diyor, Muhasebe B diyor) ifadeleri tespit edin.' },
          { id: 'c3_3_4', text: 'Çelişkili konular için ilgili kişileri bir araya getirip ortak bir karara/uzlaşmaya vardırın.' }
        ],
        tips: 'Söylenenleri toplantıdan hemen sonra yazılı olarak teyit ettirmek, gelecekte yaşanacak "ben öyle dememiştim" krizlerini önler.'
      },
      {
        id: 't3_4',
        name: 'İş Analizi Bilgilerini İletme',
        purpose: 'Doğru bilginin, doğru zamanda, doğru paydaşlara net bir şekilde sunulması.',
        deliverables: 'Gereksinim Sunumları, Bilgilendirme Mailleri, Dashboardlar',
        checklist: [
          { id: 'c3_4_1', text: 'Toplanan bilgileri, sunulacak kitleye (Teknik ekip, Üst yönetim, Son kullanıcı) uygun bir formata dönüştürün.' },
          { id: 'c3_4_2', text: 'Üst yönetim için özet tablolar, teknik ekip için veri ve süreç detayları içeren sunumlar/belgeler hazırlayın.' },
          { id: 'c3_4_3', text: 'Hazırlanan gereksinimlerin periyodik olarak tüm paydaşlarca görülebilmesi için (Jira vb. üzerinden) şeffaf bir erişim sağlayın.' }
        ],
        tips: 'Yazılımcıya destan gibi metin vermek yerine süreç modeli, iş birimine ise karmaşık kod mantığı yerine ekran prototipi göstermek her zaman daha etkilidir.'
      }
    ]
  },
  {
    id: 'ka4',
    title: 'Gereksinim Analizi ve Tasarım Tanımlama',
    description: 'Ortaya çıkarılan karmaşık bilgileri yapılandırma, modelleme ve geliştiriciler için net gereksinimlere dönüştürme.',
    icon: <Layers className="w-6 h-6 text-teal-500" />,
    color: 'border-teal-200 bg-teal-50',
    headerColor: 'text-teal-700',
    tasks: [
      {
        id: 't4_1',
        name: 'Gereksinimleri Belirtme ve Modelleme',
        purpose: 'Toplanan bilgileri, herkesin aynı şeyi anlayacağı net kurallar ve görseller haline getirmek.',
        deliverables: 'İş Gereksinim Dokümanı (BRD), User Story / Use Case Listesi, BPMN Çizimleri, Ekran Mockup\'ları',
        checklist: [
          { id: 'c4_1_1', text: 'Gereksinimleri atomik (tek bir işi anlatan) metinler halinde (User Story, Use Case veya Yazılı Madde) dökümante edin.' },
          { id: 'c4_1_2', text: 'Kavramların herkes tarafından aynı anlaşılması için "Veri Sözlüğü" (Data Dictionary) ve Kavramsal Veri Modeli oluşturun.' },
          { id: 'c4_1_3', text: 'İş süreçlerinin nasıl akacağını ve karar noktalarını gösteren Süreç Akış Diyagramları (Ör: BPMN) çizin.' },
          { id: 'c4_1_4', text: 'Uygulamanın kullanıcıya nasıl görüneceğini tasvir eden ekran taslakları (Wireframe/Mockup) veya prototipler hazırlayın.' }
        ],
        tips: 'Bir resim (model) bin kelimeye bedeldir. "Eğer A olursa B sayfasına git, X işaretliyse C formunu aç" gibi karmaşık karar mantıklarını metin yerine diyagramla anlatın.'
      },
      {
        id: 't4_2',
        name: 'Gereksinimleri Doğrulama (Verification)',
        purpose: 'Gereksinimlerin kalite standartlarına (doğru yazılmış mı?) uygun olduğunu kontrol etmek.',
        deliverables: 'Doğrulanmış Kaliteli Gereksinim Seti (Quality Checked Requirements)',
        checklist: [
          { id: 'c4_2_1', text: 'Her bir gereksinimin "Açık, Net, Anlaşılır ve Tek Anlamlı" olup olmadığını kendi içinizde okuyarak test edin.' },
          { id: 'c4_2_2', text: 'Gereksinimlerin Test Edilebilir (Testable) olduğunu kontrol edin. "Sistem hızlı olmalı" yerine "Sistem 2 saniyede açılmalı" yazın.' },
          { id: 'c4_2_3', text: 'User Story kullanıyorsanız, INVEST (Independent, Negotiable, Valuable, Estimable, Small, Testable) kriterlerine uygunluğunu denetleyin.' },
          { id: 'c4_2_4', text: 'Kurumsal yazım standartlarına, şablonlara ve isimlendirme kurallarına uyulduğundan emin olun.' }
        ],
        tips: 'Doğrulama (Verification) işlemi tamamen kalite ile ilgilidir. Soru şudur: "Gereksinimi doğru ve kurallara uygun şekilde YAZMIŞ mıyız?"'
      },
      {
        id: 't4_3',
        name: 'Gereksinimleri Geçerli Kılma (Validation)',
        purpose: 'Gereksinimlerin gerçekten iş hedeflerine hizmet edip etmediğini kontrol etmek.',
        deliverables: 'Geçerli Kılınmış Kapsam, Kapsam Dışı (Out-of-Scope) Listesi',
        checklist: [
          { id: 'c4_3_1', text: 'Yazılan her bir alt gereksinimi, Strateji Analizinde belirlenen ana "İş Hedefleri" ile eşleştirin.' },
          { id: 'c4_3_2', text: 'Eğer bir gereksinim hiçbir iş hedefine veya problem çözümüne hizmet etmiyorsa, bunu tespit edin.' },
          { id: 'c4_3_3', text: 'Müşteri "Bunu da koysak güzel olur" dese bile, iş değerine katkısı olmayan (Gold-plating) talepleri kapsam dışına alın.' },
          { id: 'c4_3_4', text: 'Kalan tüm gereksinimlerin "Doğru İşi Yapmak" (Business Value) felsefesine uygun olduğundan emin olun.' }
        ],
        tips: 'Geçerlilik (Validation), "Sırf birisi istedi diye, ürüne değersiz ve kullanılmayacak bir özellik ekliyor muyuz?" sorusunun filtresidir.'
      },
      {
        id: 't4_4',
        name: 'Tasarım Seçeneklerini Tanımlama',
        purpose: 'Gereksinimleri karşılayacak çözüm mimarilerini veya yazılım yaklaşımlarını değerlendirmek.',
        deliverables: 'Tasarım Alternatifleri Analizi, Make or Buy Raporu',
        checklist: [
          { id: 'c4_4_1', text: 'Gereksinimleri karşılayacak hazır bir yazılım (COTS) mı alınmalı, yoksa şirket içinde (In-house) mi geliştirilmeli araştırması yapın.' },
          { id: 'c4_4_2', text: 'Eğer geliştirilecekse, teknik mimar, yazılım uzmanı veya tasarımcılarla bir araya gelerek olası teknik yolları konuşun.' },
          { id: 'c4_4_3', text: 'Farklı teknik seçeneklerin gereksinimleri ne oranda karşıladığını ve kısıtlarını (Performans, Güvenlik) karşılaştırın.' },
          { id: 'c4_4_4', text: 'Hangi çözümün veya teknik tasarımın paydaşlara en yüksek değeri sunacağını (Recommendation) raporlayın.' }
        ],
        tips: 'Tasarım aşamasında analist; iş biriminin "Ne istiyoruz?" (What) sorusu ile yazılımcının "Bunu nasıl yaparız?" (How) sorusu arasındaki köprüdür.'
      }
    ]
  },
  {
    id: 'ka5',
    title: 'Gereksinim Yaşam Döngüsü Yönetimi',
    description: 'Projenin başlangıcından bitişine kadar gereksinimlerdeki değişimleri, onayları ve izlenebilirliği yönetme.',
    icon: <RefreshCw className="w-6 h-6 text-indigo-500" />,
    color: 'border-indigo-200 bg-indigo-50',
    headerColor: 'text-indigo-700',
    tasks: [
      {
        id: 't5_1',
        name: 'Gereksinimleri İzleme (Traceability)',
        purpose: 'İş hedefinden, gereksinime, tasarıma ve test senaryosuna kadar olan bağıntıyı kurmak.',
        deliverables: 'İzlenebilirlik Matrisi (Traceability Matrix)',
        checklist: [
          { id: 'c5_1_1', text: 'En üst seviye iş ihtiyacını (Hedef) -> Detay gereksinime bağlayın (Geriye Dönük İzlenebilirlik).' },
          { id: 'c5_1_2', text: 'Detay gereksinimi -> Yazılım koduna/modülüne ve Test senaryosuna bağlayın (İleriye Dönük İzlenebilirlik).' },
          { id: 'c5_1_3', text: 'Bu ilişkileri Jira gibi bir araç üzerinden (Epic -> Story -> Task -> Bug) veya bir Excel tablosunda (Matris) oluşturun.' },
          { id: 'c5_1_4', text: 'Test aşamasına gelindiğinde, açıkta kalan (testi yazılmamış) hiçbir gereksinim olmadığından emin olun.' }
        ],
        tips: 'İzlenebilirlik, projede bir değişiklik talep edildiğinde "Bu değişiklik sistemdeki başka neleri bozar?" (Impact Analysis) sorusunu saniyeler içinde cevaplamanızı sağlar.'
      },
      {
        id: 't5_2',
        name: 'Gereksinimleri Önceliklendirme',
        purpose: 'Kaynaklar kısıtlı olduğunda hangi gereksinimin önce yapılacağına karar vermek.',
        deliverables: 'Önceliklendirilmiş Ürün İş Listesi (Prioritized Product Backlog), MVP Kapsamı',
        checklist: [
          { id: 'c5_2_1', text: 'Gereksinimleri MoSCoW (Must have, Should have, Could have, Won\'t have) tekniği ile kategorize edin.' },
          { id: 'c5_2_2', text: 'İş birimiyle toplantı yaparak gereksinimleri İş Değeri, Maliyet, Aciliyet ve Risk faktörlerine göre puanlayın.' },
          { id: 'c5_2_3', text: 'Ürünün canlıya çıkabilmesi için gereken en küçük ve en değerli seti (Minimum Viable Product - MVP) belirleyin.' },
          { id: 'c5_2_4', text: 'Çevik çalışıyorsanız, iş listesini (Backlog) her Sprint (koşu) öncesi tekrar gözden geçirip öncelikleri güncelleyin.' }
        ],
        tips: 'İş birimine kalsa her gereksinim "Çok Acil ve Yüksek Öncelikli"dir. Analist olarak sınırları çizmeli ve "Her şey yüksek öncelikliyse, hiçbir şeyin önceliği yoktur" kuralını hatırlatmalısınız.'
      },
      {
        id: 't5_3',
        name: 'Gereksinim Değişikliklerini Değerlendirme',
        purpose: 'Yeni gelen veya değişen bir talebin projeye (maliyet, zaman, değer) etkisini analiz etmek.',
        deliverables: 'Değişiklik Talep Formu (CR), Etki Analiz Raporu (Impact Analysis)',
        checklist: [
          { id: 'c5_3_1', text: 'Proje ortasında gelen değişiklik talebini (Change Request) yazılı olarak kayıt altına alın.' },
          { id: 'c5_3_2', text: 'Bu değişikliğin zaman planına, efora, maliyete ve projenin diğer parçalarına etkisini (Impact Analysis) çıkarın.' },
          { id: 'c5_3_3', text: 'Değişikliğin uygulanıp uygulanmayacağına karar vermek üzere durumu Karar Kuruluna (CCB) veya Sponsora sunun.' },
          { id: 'c5_3_4', text: 'Karar onaylanırsa dokümanları (BRD, Planlar vb.) güncelleyin; reddedilirse sebebini talep sahibine iletin.' }
        ],
        tips: 'Değişikliklere katı bir şekilde direnmek Agile ruhuna aykırıdır; ancak değişikliği etki analizi yapmadan kabul etmek de projenin felaketi olur.'
      },
      {
        id: 't5_4',
        name: 'Gereksinimleri Onaylama',
        purpose: 'Tasarım ve geliştirme aşamasına geçmeden önce yetkili kişilerden mutabakat almak.',
        deliverables: 'İmzalı/Onaylı BRD, Sprint Backlog Onayı, Onay E-postaları (Sign-off)',
        checklist: [
          { id: 'c5_4_1', text: 'Hazırlanan gereksinim dokümanlarını veya User Story\'leri ilgili paydaşlara okuma ve inceleme için gönderin.' },
          { id: 'c5_4_2', text: 'Eğer paydaşlar arasında gereksinimle ilgili çatışma varsa, bir arabulucu gibi davranarak sorunu çözün.' },
          { id: 'c5_4_3', text: 'Sürecin başında belirlenen yetkili kişilerden (Sponsor, Ürün Sahibi vb.) tasarıma geçilmesi için resmi onay (Sign-off) alın.' },
          { id: 'c5_4_4', text: 'Alınan onayları (fiziki imza, e-posta onayı veya Jira statü değişimi) projenin kanıtı olarak saklayın.' }
        ],
        tips: 'Onay aşaması analistin işinin bittiği değil, herkesin "aynı şeyi anladığını" resmileştirdiği noktadır.'
      }
    ]
  },
  {
    id: 'ka6',
    title: 'Çözüm Değerlendirme',
    description: 'Geliştirilen çözümün (veya canlıya alınan ürünün) gerçekten hedeflenen değeri yaratıp yaratmadığını ölçme.',
    icon: <Activity className="w-6 h-6 text-emerald-500" />,
    color: 'border-emerald-200 bg-emerald-50',
    headerColor: 'text-emerald-700',
    tasks: [
      {
        id: 't6_1',
        name: 'Çözüm Performansını Ölçme',
        purpose: 'Canlıdaki çözümün ne kadar iyi çalıştığına dair gerçek veri toplamak.',
        deliverables: 'Performans Ölçüm Kriterleri (Metrikler/KPI), Veri Toplama Sistemi',
        checklist: [
          { id: 'c6_1_1', text: 'Çözüm canlıya (Prod) alındıktan sonra, projenin başarısını gösterecek niteliksel (anket vb.) ve niceliksel (süre vb.) metrikleri belirleyin.' },
          { id: 'c6_1_2', text: 'Eğer sistemde bunu ölçecek bir yapı yoksa (Ör: Kaç kişi butona bastı verisi), veri toplamak için sisteme loglama/analitik araçları ekletin.' },
          { id: 'c6_1_3', text: 'Kullanıcılardan periyodik olarak geri bildirim (Feedback) toplamak için mekanizmalar (NPS anketleri) kurun.' },
          { id: 'c6_1_4', text: 'Toplanan bu ham verileri belirli aralıklarla sistemden çekerek bir araya getirin.' }
        ],
        tips: '"Proje bitti, canlıya çıktık" demek başarının kanıtı değildir. Rakamlarla ölçemediğiniz hiçbir şeyin başarısını ispat edemezsiniz.'
      },
      {
        id: 't6_2',
        name: 'Performans Ölçümlerini Analiz Etme',
        purpose: 'Toplanan verileri yorumlayarak beklenen değer ile gerçekleşen değeri karşılaştırmak.',
        deliverables: 'Performans Değerlendirme Raporu, KPI Tabloları',
        checklist: [
          { id: 'c6_2_1', text: 'Toplanan gerçek verileri (Ör: gerçekleşen %5 iade oranı), "Strateji Analizinde" koyduğunuz hedeflerle (Ör: hedeflenen %15 azalma) kıyaslayın.' },
          { id: 'c6_2_2', text: 'Eğer çözüm beklenen değeri yaratmıyorsa veya KPI\'lar tutmuyorsa, sorunun nereden kaynaklandığını bulmak için analiz yapın.' },
          { id: 'c6_2_3', text: 'Beklenmeyen/fark edilmeyen olumsuz yan etkiler (Ör: iade düştü ama müşteri şikayetleri arttı) oluştuysa bunları tespit edin.' },
          { id: 'c6_2_4', text: 'Bulgularınızı sponsorlar ve üst yönetim ile paylaşmak üzere bir rapor haline getirin.' }
        ],
        tips: 'Yazılımın hatasız çalışması başka, değer üretmesi başkadır. Sistem tıkır tıkır çalışıyor olabilir ama kullanıcılar ekranı zor bulduğu için kullanmıyorsa o çözüm başarısızdır.'
      },
      {
        id: 't6_3',
        name: 'Çözüm/Kurum Kısıtlarını Değerlendirme',
        purpose: 'Çözümün tam potansiyeline ulaşmasını engelleyen teknik veya kurumsal engelleri bulmak.',
        deliverables: 'Kısıt ve Darboğaz Analizi, Sorun Bildirim Listesi',
        checklist: [
          { id: 'c6_3_1', text: 'Sistemden kaynaklanan teknik darboğazları (Uygulamanın yavaş çalışması, sistemin sık çökmesi, UI karmaşıklığı) tespit edin.' },
          { id: 'c6_3_2', text: 'Kurumdan (İnsan/Süreç) kaynaklanan engelleri araştırın (Personelin yetersiz eğitimi, eski alışkanlıklara direnç gösterilmesi).' },
          { id: 'c6_3_3', text: 'Yasal düzenlemelerin veya şirket kurallarının çözümün tam kullanılmasını engelleyip engellemediğini kontrol edin.' },
          { id: 'c6_3_4', text: 'Kısıtların ürüne ne kadar zarar verdiğini puanlayarak etki analizi yapın.' }
        ],
        tips: 'Canlıdaki bir sorunun kaynağı her zaman "yazılım" değildir. Çoğu zaman sorun, kurum kültürünün veya çalışanların yeni sisteme adaptasyon sağlayamamasıdır.'
      },
      {
        id: 't6_4',
        name: 'Çözüm Değerini Artırmak İçin Eylemler Önerme',
        purpose: 'Elde edilen bulgularla sistemi veya süreçleri iyileştirecek yeni aksiyonlar planlamak.',
        deliverables: 'İyileştirme Önerileri Raporu (Recommendations), Yeni Faz Talepleri',
        checklist: [
          { id: 'c6_4_1', text: 'Teknik sorunlar için yeni düzeltme veya özellik geliştirme talepleri (Yeni Feature Request) hazırlayın.' },
          { id: 'c6_4_2', text: 'Kurumsal uyum sorunları için yeni eğitim programları veya süreç iyileştirme adımları tavsiye edin.' },
          { id: 'c6_4_3', text: 'Eğer mevcut çözüm artık hiçbir şekilde fayda sağlamıyorsa (End of Life), sistemin emekliye ayrılması ve tamamen yeni bir sistem kurulması yönünde öneri sunun.' },
          { id: 'c6_4_4', text: 'Tavsiyelerinizi karar vericilere sunarak iş analizi döngüsünü yeniden "Strateji Analizi" adımından başlatın.' }
        ],
        tips: 'İş analizi sürekli dönen bir çarktır. Bir projenin bitişi ve değerlendirilmesi, aslında her zaman yeni bir projenin başlangıcına (Yeni bir ihtiyaca) temel hazırlar.'
      }
    ]
  }
];

// --- BABOK TECHNIQUES DATA ---
const techniquesData = [
  { id: 'tech1', name: 'Atölye Çalışmaları (Workshops)', desc: 'Paydaşları bir araya getirerek hızlıca gereksinim toplama, karar alma ve fikir birliğine varma tekniğidir.', bestFor: 'Farklı departmanların uzlaşması gerektiğinde.', relatedKA: ['ka2','ka3'] },
  { id: 'tech2', name: 'Süreç Modelleme (Process Modelling)', desc: 'İşin nasıl yapıldığını (BPMN, Akış Şeması vb. ile) görselleştirme tekniği.', bestFor: 'Mevcut durumu anlamak ve dar boğazları tespit etmek.', relatedKA: ['ka1','ka4'] },
  { id: 'tech3', name: 'Görüşmeler (Interviews)', desc: 'Birebir veya küçük gruplarla soru-cevap yaparak derinlemesine bilgi alma yöntemi.', bestFor: 'Hassas konular veya uzmanlardan spesifik bilgiler almak.', relatedKA: ['ka3'] },
  { id: 'tech4', name: 'Kullanıcı Hikayeleri (User Stories)', desc: 'İhtiyacı, kullanıcının perspektifinden "Bir [rol] olarak, [hedef] istiyorum, böylece [fayda] sağlayabilirim" formatında yazma.', bestFor: 'Çevik (Agile) projelerde gereksinimleri ifade etmek.', relatedKA: ['ka4','ka5'] },
  { id: 'tech5', name: 'Kök Neden Analizi (Root Cause Analysis)', desc: 'Problemin yüzeydeki belirtilerini değil, altında yatan asıl sebebi (5 Neden, Balık Kılçığı vb.) bulma tekniği.', bestFor: 'Sorunların tekrarlamasını önlemek.', relatedKA: ['ka1','ka3'] },
  { id: 'tech6', name: 'Veri Modelleme (Data Modelling)', desc: 'Sistemin kullanacağı kavramları ve bu kavramlar arasındaki ilişkileri (ER Diyagramları) standartlaştırma.', bestFor: 'Veritabanı tasarımı öncesi kavramsal netlik sağlamak.', relatedKA: ['ka4'] },
];

// --- UTILITIES & CONSTANTS ---
const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2,9)}`;
const DEFAULT_PROJECT = {
  id: 'proj_1', name: 'Ana Proje', projectContext: '',
  completedTasks: [], completedSubTasks: [],
  risks: [], actions: [], stakeholders: [], requirements: [], meetings: [], timeline: [], reqCounter: 1,
};
const PROB_LABELS = ['','Düşük','Orta','Yüksek'];
const IMPACT_LABELS = ['','Düşük','Orta','Yüksek'];
const RACI_LABELS = { R:'Sorumlu', A:'Onaylayan', C:'Danışılan', I:'Bilgilendirilen' };
const RACI_COLORS = { R:'bg-blue-100 text-blue-800', A:'bg-purple-100 text-purple-800', C:'bg-amber-100 text-amber-800', I:'bg-slate-100 text-slate-700' };
const REQ_STATUS_COLORS = { 'Taslak':'bg-slate-100 text-slate-700', 'İncelemede':'bg-amber-100 text-amber-800', 'Onaylandı':'bg-blue-100 text-blue-800', 'Geliştiriliyor':'bg-purple-100 text-purple-800', 'Test':'bg-orange-100 text-orange-800', 'Canlıda':'bg-emerald-100 text-emerald-800' };
const NOTE_TYPE_COLORS = { 'Karar':'bg-blue-100 text-blue-800 border-blue-200', 'Açık Nokta':'bg-rose-100 text-rose-800 border-rose-200', 'Aksiyon':'bg-amber-100 text-amber-800 border-amber-200' };
const TIMELINE_COLORS = ['#6366f1','#f59e0b','#10b981','#ef4444','#8b5cf6','#06b6d4','#f97316','#84cc16','#ec4899','#14b8a6'];
const PX_PER_DAY = { week: 14, month: 4, quarter: 2 };
const diffDays = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

// --- BABOK UNDERLYING COMPETENCIES DATA ---
const competenciesData = [
  { id: 'comp1', name: 'Analitik Düşünme ve Problem Çözme', desc: 'Sistem düşüncesi, kök neden analizi ve yaratıcı düşünmeyi kapsar. Karmaşık sorunları basite indirgeme yeteneğidir.' },
  { id: 'comp2', name: 'Davranışsal Özellikler', desc: 'Etik kurallara uyma, kişisel organizasyon ve güvenilirlik. Analistin tarafsız ve dürüst olması kritik öneme sahiptir.' },
  { id: 'comp3', name: 'İş Bilgisi (Business Knowledge)', desc: 'Çalışılan sektörü, kurumun yapısını ve çözüm vizyonunu anlama. "Ne" yaptığınızı değil "neden" yaptığınızı bilmektir.' },
  { id: 'comp4', name: 'İletişim Becerileri', desc: 'Sözlü, yazılı iletişim ve aktif dinleme. Yanlış anlaşılan gereksinimlerin çoğu kötü dinlemeden kaynaklanır.' },
  { id: 'comp5', name: 'Etkileşim Becerileri', desc: 'Fasilitasyon, liderlik, müzakere ve takım çalışması. Çatışan paydaşları ortak bir noktada buluşturma sanatıdır.' },
  { id: 'comp6', name: 'Araçlar ve Teknoloji', desc: 'Gereksinim yönetim araçları (Jira vb.), modelleme araçları (Visio, Miro) ve ofis yazılımlarını etkin kullanabilme.' },
];

// --- BABOK DOCUMENT TEMPLATES DATA ---
const templatesData = [
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

export default function App() {
  // --- Multi-Project Management ---
  const [projects, setProjects] = useState(() => {
    try {
      const sv = localStorage.getItem('babok_v2_projects');
      if (sv) return JSON.parse(sv);
      return [{ ...DEFAULT_PROJECT,
        completedTasks: JSON.parse(localStorage.getItem('babok_project_tasks') || '[]'),
        completedSubTasks: JSON.parse(localStorage.getItem('babok_project_subtasks') || '[]'),
        projectContext: localStorage.getItem('babok_project_context') || '',
      }];
    } catch { return [DEFAULT_PROJECT]; }
  });
  const [activeProjectId, setActiveProjectId] = useState(() =>
    localStorage.getItem('babok_v2_activeProjectId') || 'proj_1'
  );
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const updateActive = (updater) => setProjects(prev => prev.map(p =>
    p.id === activeProject.id ? (typeof updater === 'function' ? updater(p) : { ...p, ...updater }) : p
  ));

  // Per-project derived state (keeps all existing code intact)
  const completedTasks = activeProject?.completedTasks || [];
  const completedSubTasks = activeProject?.completedSubTasks || [];
  const projectContext = activeProject?.projectContext || '';
  const setCompletedTasks = (v) => updateActive(p => ({ ...p, completedTasks: typeof v === 'function' ? v(p.completedTasks) : v }));
  const setCompletedSubTasks = (v) => updateActive(p => ({ ...p, completedSubTasks: typeof v === 'function' ? v(p.completedSubTasks) : v }));
  const setProjectContext = (v) => updateActive(p => ({ ...p, projectContext: typeof v === 'function' ? v(p.projectContext) : v }));

  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedKA, setExpandedKA] = useState('ka1');
  const [selectedTask, setSelectedTask] = useState(null);

  // Gemini API States
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [activeAiTask, setActiveAiTask] = useState(null);
  const [isContextSaved, setIsContextSaved] = useState(false);

  // Project UI states
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Risk states
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [editingRisk, setEditingRisk] = useState(null);
  const [riskForm, setRiskForm] = useState({ title:'', category:'Teknik', probability:2, impact:2, owner:'', mitigation:'', status:'Açık' });

  // Action states
  const [showActionModal, setShowActionModal] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [actionForm, setActionForm] = useState({ title:'', owner:'', dueDate:'', status:'Bekliyor', source:'' });

  // Stakeholder states
  const [showStakeholderModal, setShowStakeholderModal] = useState(false);
  const [editingStakeholder, setEditingStakeholder] = useState(null);
  const [stakeholderForm, setStakeholderForm] = useState({ name:'', role:'', department:'', interest:2, influence:2, raci:'I', notes:'' });

  // Requirement states
  const [showReqModal, setShowReqModal] = useState(false);
  const [editingReq, setEditingReq] = useState(null);
  const [reqForm, setReqForm] = useState({ name:'', objective:'', module:'', status:'Taslak', testId:'' });
  const [reqFilter, setReqFilter] = useState('all');

  // Meeting states
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [meetingForm, setMeetingForm] = useState({ topic:'', attendees:'', date: new Date().toISOString().split('T')[0] });
  const [newNoteType, setNewNoteType] = useState('Karar');
  const [newNoteText, setNewNoteText] = useState('');

  // Techniques filter
  const [techFilter, setTechFilter] = useState('all');

  const toggleTask = (taskId, e) => {
    e.stopPropagation();
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter(id => id !== taskId));
    } else {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };

  const toggleSubTask = (subTaskId) => {
    if (completedSubTasks.includes(subTaskId)) {
      setCompletedSubTasks(completedSubTasks.filter(id => id !== subTaskId));
    } else {
      setCompletedSubTasks([...completedSubTasks, subTaskId]);
    }
  };

  // Save all project data to localStorage
  useEffect(() => {
    localStorage.setItem('babok_v2_projects', JSON.stringify(projects));
    localStorage.setItem('babok_v2_activeProjectId', activeProjectId);
  }, [projects, activeProjectId]);

  // Computed totals
  const totalTasks = babokData.reduce((acc, ka) => acc + ka.tasks.length, 0);
  const totalSubTasks = babokData.reduce((acc, ka) => acc + ka.tasks.reduce((a,t) => a + t.checklist.length, 0), 0);
  const overallProgress = Math.round(((completedTasks.length + completedSubTasks.length) / (totalTasks + totalSubTasks)) * 100) || 0;
  const progressPercentage = Math.round((completedTasks.length / totalTasks) * 100);

  const handleTaskClick = (task) => {
    setSelectedTask(selectedTask?.id === task.id ? null : task);
  };

  // --- MARK ALL KA + RESET ---
  const markAllKA = (ka, e) => {
    e.stopPropagation();
    setCompletedTasks([...new Set([...completedTasks, ...ka.tasks.map(t => t.id)])]);
    setCompletedSubTasks([...new Set([...completedSubTasks, ...ka.tasks.flatMap(t => t.checklist.map(c => c.id))])]);
  };
  const resetProgress = () => { setCompletedTasks([]); setCompletedSubTasks([]); setShowResetConfirm(false); };

  // --- RISK ---
  const getRiskLevel = (prob, impact) => {
    const s = prob * impact;
    if (s >= 7) return { label:'Kritik', cls:'text-rose-700 bg-rose-100 border-rose-300', dot:'bg-rose-500' };
    if (s >= 4) return { label:'Orta', cls:'text-amber-700 bg-amber-100 border-amber-300', dot:'bg-amber-500' };
    return { label:'Düşük', cls:'text-emerald-700 bg-emerald-100 border-emerald-300', dot:'bg-emerald-500' };
  };
  const openRiskModal = (risk = null) => { setEditingRisk(risk); setRiskForm(risk || { title:'', category:'Teknik', probability:2, impact:2, owner:'', mitigation:'', status:'Açık' }); setShowRiskModal(true); };
  const saveRisk = () => {
    if (!riskForm.title.trim()) return;
    updateActive(p => ({ ...p, risks: editingRisk ? p.risks.map(r => r.id === editingRisk.id ? { ...riskForm, id: editingRisk.id } : r) : [...p.risks, { ...riskForm, id: generateId() }] }));
    setShowRiskModal(false);
  };
  const deleteRisk = (id) => { if(window.confirm('Riski silmek istiyor musunuz?')) updateActive(p => ({ ...p, risks: p.risks.filter(r => r.id !== id) })); };

  // --- ACTION ---
  const isOverdue = (a) => a.status !== 'Tamamlandı' && a.dueDate && new Date(a.dueDate) < new Date();
  const openActionModal = (action = null) => { setEditingAction(action); setActionForm(action || { title:'', owner:'', dueDate:'', status:'Bekliyor', source:'' }); setShowActionModal(true); };
  const saveAction = () => {
    if (!actionForm.title.trim()) return;
    updateActive(p => ({ ...p, actions: editingAction ? p.actions.map(a => a.id === editingAction.id ? { ...actionForm, id: editingAction.id } : a) : [...p.actions, { ...actionForm, id: generateId() }] }));
    setShowActionModal(false);
  };
  const deleteAction = (id) => { if(window.confirm('Aksiyonu silmek istiyor musunuz?')) updateActive(p => ({ ...p, actions: p.actions.filter(a => a.id !== id) })); };

  // --- STAKEHOLDER ---
  const openStakeholderModal = (s = null) => { setEditingStakeholder(s); setStakeholderForm(s || { name:'', role:'', department:'', interest:2, influence:2, raci:'I', notes:'' }); setShowStakeholderModal(true); };
  const saveStakeholder = () => {
    if (!stakeholderForm.name.trim()) return;
    updateActive(p => ({ ...p, stakeholders: editingStakeholder ? p.stakeholders.map(s => s.id === editingStakeholder.id ? { ...stakeholderForm, id: editingStakeholder.id } : s) : [...p.stakeholders, { ...stakeholderForm, id: generateId() }] }));
    setShowStakeholderModal(false);
  };
  const deleteStakeholder = (id) => { if(window.confirm('Paydaşı silmek istiyor musunuz?')) updateActive(p => ({ ...p, stakeholders: p.stakeholders.filter(s => s.id !== id) })); };

  // --- REQUIREMENT ---
  const openReqModal = (r = null) => { setEditingReq(r); setReqForm(r || { name:'', objective:'', module:'', status:'Taslak', testId:'' }); setShowReqModal(true); };
  const saveReq = () => {
    if (!reqForm.name.trim()) return;
    updateActive(p => { const cnt = p.reqCounter||1; return { ...p, requirements: editingReq ? p.requirements.map(r => r.id===editingReq.id ? {...reqForm,id:editingReq.id,reqId:editingReq.reqId} : r) : [...p.requirements, {...reqForm,id:generateId(),reqId:`REQ-${String(cnt).padStart(3,'0')}`}], reqCounter: editingReq?cnt:cnt+1 }; });
    setShowReqModal(false);
  };
  const deleteReq = (id) => { if(window.confirm('Gereksinimi silmek istiyor musunuz?')) updateActive(p => ({ ...p, requirements: p.requirements.filter(r => r.id !== id) })); };

  // --- MEETING ---
  const saveMeeting = () => {
    if (!meetingForm.topic.trim()) return;
    const nm = { ...meetingForm, id: generateId(), notes: [] };
    updateActive(p => ({ ...p, meetings: [...p.meetings, nm] }));
    setSelectedMeeting(nm); setShowMeetingModal(false);
  };
  const deleteMeeting = (id) => { if(window.confirm('Toplantıyı silmek istiyor musunuz?')) { updateActive(p => ({ ...p, meetings: p.meetings.filter(m => m.id!==id) })); if(selectedMeeting?.id===id) setSelectedMeeting(null); } };
  const addNote = () => {
    if (!newNoteText.trim() || !selectedMeeting) return;
    const note = { id: generateId(), type: newNoteType, text: newNoteText };
    const upd = { ...selectedMeeting, notes: [...selectedMeeting.notes, note] };
    updateActive(p => ({ ...p, meetings: p.meetings.map(m => m.id===selectedMeeting.id ? upd : m) }));
    setSelectedMeeting(upd); setNewNoteText('');
  };
  const deleteNote = (nid) => { const upd={...selectedMeeting,notes:selectedMeeting.notes.filter(n=>n.id!==nid)}; updateActive(p=>({...p,meetings:p.meetings.map(m=>m.id===selectedMeeting.id?upd:m)})); setSelectedMeeting(upd); };
  const generateMoM = (mtg) => {
    const lines=[`# Toplantı Tutanağı`,`**Konu:** ${mtg.topic}`,`**Tarih:** ${mtg.date}`,`**Katılımcılar:** ${mtg.attendees}`,''];
    ['Karar','Açık Nokta','Aksiyon'].forEach(type=>{ const it=mtg.notes.filter(n=>n.type===type); if(it.length){lines.push(`## ${type}lar`);it.forEach((n,i)=>lines.push(`${i+1}. ${n.text}`));lines.push('');} });
    navigator.clipboard.writeText(lines.join('\n')); alert('MoM panoya kopylandı!');
  };

  // --- PROJECT MANAGEMENT ---
  const createProject = () => { if(!newProjectName.trim()) return; const np={...DEFAULT_PROJECT,id:generateId(),name:newProjectName}; setProjects(prev=>[...prev,np]); setActiveProjectId(np.id); setNewProjectName(''); setShowProjectModal(false); };
  const deleteProject = (id) => { if(projects.length<=1){alert('En az bir proje olmalıdır!');return;} const rem=projects.filter(p=>p.id!==id); setProjects(rem); if(activeProjectId===id) setActiveProjectId(rem[0].id); };

  // --- EXPORT ---
  const exportMarkdown = () => {
    const p=activeProject;
    const lines=[`# BABOK Proje Raporu: ${p.name}`,`**Tarih:** ${new Date().toLocaleDateString('tr-TR')}`,`**Bağlam:** ${p.projectContext||'-'}`,'',`## İlerleme`,`- Ana: ${p.completedTasks.length}/${totalTasks}`,`- Alt: ${p.completedSubTasks.length}/${totalSubTasks}`,'',`## Riskler`,...p.risks.map(r=>`- [${getRiskLevel(r.probability,r.impact).label}] ${r.title} | ${r.owner}`),'',`## Aksiyonlar`,...p.actions.map(a=>`- [${a.status}] ${a.title} | ${a.owner} | ${a.dueDate}`),'',`## Paydaşlar`,...p.stakeholders.map(s=>`- ${s.name} (${s.role}) | ${RACI_LABELS[s.raci]}`),'',`## Gereksinimler`,...p.requirements.map(r=>`- ${r.reqId}: ${r.name} | ${r.status}`)];
    const blob=new Blob([lines.join('\n')],{type:'text/markdown'});
    const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`${p.name}_BABOK.md`; a.click(); URL.revokeObjectURL(url);
  };

  // --- AI HELPER ---
  const handleRegenerateAI = () => { if(activeAiTask) { setAiResult(''); handleOpenAIModal(activeAiTask, ''); } };

  // --- GEMINI API INTEGRATION ---
  const generateWithGemini = async (promptText) => {
    const apiKey = ""; // API key will be provided by execution environment
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    let retries = 0;
    const maxRetries = 5;
    const delays = [1000, 2000, 4000, 8000, 16000];

    while (retries <= maxRetries) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: "Sen 15 yıllık deneyimli, CBAP sertifikalı Kıdemli bir IT İş Analistisin. Kullanıcının verdiği proje bağlamına %100 sadık kalarak eksiksiz, profesyonel, gerçeğe yakın ve doğrudan kullanılabilecek BABOK dokümanları hazırlarsın. Asla tavsiye vermezsin, doğrudan istenen çıktıyı (rapor, taslak vb.) sunarsın." }]
            },
            contents: [{ parts: [{ text: promptText }] }]
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          if (response.status >= 400 && response.status < 500 && response.status !== 429) {
             return `API İsteği Reddedildi (${response.status}): Gönderilen bilgilerde bir hata var.\n\nDetay: ${errText}`;
          }
          throw new Error(`HTTP error! status: ${response.status}, message: ${errText}`);
        }
        
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Maalesef geçerli bir yanıt oluşturulamadı.";
        
      } catch (error) {
        if (retries === maxRetries) {
          console.error("Gemini API Hatası:", error);
          return `Üzgünüm, yapay zeka servisine şu an erişilemiyor veya ağ hatası oluştu. Lütfen daha sonra tekrar deneyin.\n\nDetay: ${error.message}`;
        }
        await new Promise(resolve => setTimeout(resolve, delays[retries]));
        retries++;
      }
    }
  };

  const handleOpenAIModal = async (task, kaTitle) => {
    if (!projectContext.trim()) {
      alert("Lütfen önce ekranın üst kısmından projenizin genel konusunu (bağlamını) girin ve 'Kaydet ve Onayla' butonuna basın. Böylece size özel taslaklar üretebilirim.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActiveAiTask(task);
    setIsAiModalOpen(true);
    setAiLoading(true);
    setAiResult('');

    const checklistText = task.checklist.map(c => `- ${c.text}`).join('\n');
    
    const prompt = `
LÜTFEN ŞU PROJE İÇİN ÖZEL BİR ÇIKTI ÜRET:
"${projectContext}"

BULUNDUĞUN BABOK AŞAMASI:
Bilgi Alanı: ${kaTitle}
Görev: ${task.name}
Görevin Amacı: ${task.purpose}
Beklenen Çıktılar (Deliverables): ${task.deliverables}

Analist olarak kontrol ettiğin detaylı alt görevler şunlar:
${checklistText}

TALİMATLAR (ÇOK ÖNEMLİ):
1. Yukarıdaki "PROJE BAĞLAMI" dikkate alınarak, bu projeye TAMAMEN ÖZEL, farazi verilerle, örnek metriklerle, aktörlerle ve senaryolarla doldurulmuş bir "${task.deliverables}" raporu/çıktısı YAZ.
2. Kesinlikle genel geçer BABOK teorisi, tanımı veya "şunu yapmalısınız" gibi TAVSİYELER ANLATMA. 
3. Doğrudan toplantıdan çıkmış bir iş analisti gibi, ekibe sunulmaya hazır DOKÜMANIN KENDİSİNİ ver.
4. Raporu okuyan kişi "${projectContext}" projesi için özel olarak yazıldığını %100 hissetmeli.
5. Başlıklar (##, ###), madde işaretleri (-) ve numaralandırmalar kullanarak okunması kolay, şık bir Markdown taslağı oluştur.
6. Yanıtın tamamı Türkçe olmalıdır.
    `;

    const generatedText = await generateWithGemini(prompt);
    setAiResult(generatedText);
    setAiLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiResult);
    alert("Taslak panoya kopyalandı!");
  };

  // Basit Markdown biçimlendirici
  const formatMarkdown = (text) => {
    if (!text) return { __html: '' };
    let html = text
      .replace(/</g, "&lt;").replace(/>/g, "&gt;") // Basit güvenlik
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-900">$1</strong>') // Kalın
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // İtalik
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-6 mb-2 text-indigo-700">$1</h3>') // Başlık 3
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-8 mb-3 text-indigo-800 border-b border-indigo-100 pb-2">$1</h2>') // Başlık 2
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4 text-indigo-900 border-b-2 border-indigo-200 pb-2">$1</h1>') // Başlık 1
      .replace(/^- (.*$)/gim, '<li class="ml-5 list-disc mb-1.5">$1</li>') // Liste
      .replace(/^\* (.*$)/gim, '<li class="ml-5 list-disc mb-1.5">$1</li>') // Liste (Alternatif)
      .replace(/\n/g, '<br />'); // Yeni satırlar
      
    // Liste elemanlarını ul içine alma (Basit çözüm)
    html = html.replace(/(<li.*?>.*?<\/li>(?:<br \/>)*)+/g, '<ul class="my-3">$&</ul>');
      
    return { __html: html };
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="text-blue-600" /> BABOK v3 Saha Asistanı
            </h1>
            {/* Project Switcher */}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <select
                value={activeProjectId}
                onChange={e => setActiveProjectId(e.target.value)}
                className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
              >
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button onClick={() => setShowProjectModal(true)} className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded-md flex items-center gap-1 transition-colors">
                <FolderPlus className="w-3 h-3" /> Yeni
              </button>
              {projects.length > 1 && (
                <button onClick={() => { if(window.confirm(`"${activeProject.name}" projesini silmek istiyor musunuz?`)) deleteProject(activeProjectId); }} className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 px-2 py-1 rounded-md flex items-center gap-1 transition-colors">
                  <Trash2 className="w-3 h-3" /> Sil
                </button>
              )}
              <button onClick={() => setShowResetConfirm(true)} title="İlerlemeyi sıfırla" className="text-xs text-slate-400 hover:text-rose-500 px-1 py-1 rounded transition-colors">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex flex-col items-end w-full md:w-56">
            <div className="flex justify-between w-full mb-1">
              <span className="text-xs font-medium text-slate-600">Genel İlerleme</span>
              <span className="text-xs font-bold text-blue-600">{overallProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${overallProgress}%` }}></div>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5">{completedTasks.length}/{totalTasks} Ana · {completedSubTasks.length}/{totalSubTasks} Alt Görev</span>
          </div>
        </div>
        {/* TAB NAVIGATION */}
        <div className="max-w-5xl mx-auto px-4 mt-1 flex gap-1 overflow-x-auto pb-px">
          {[['dashboard','LayoutDashboard','Dashboard'],['knowledge_areas','LayoutGrid','Checklistler'],['risks','AlertTriangle','Riskler'],['actions','ListChecks','Aksiyonlar'],['stakeholders','Users','Paydaşlar'],['requirements','BookMarked','Gereksinimler'],['meetings','MessageSquare','Toplantılar'],['techniques','Wrench','Teknikler'],['templates','FileStack','Dokümanlar'],['competencies','BrainCircuit','Yetkinlikler']].map(([tab,,label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2.5 px-2.5 font-medium text-xs flex items-center gap-1.5 whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}>
              {tab==='dashboard' && <LayoutDashboard className="w-3.5 h-3.5" />}
              {tab==='knowledge_areas' && <LayoutGrid className="w-3.5 h-3.5" />}
              {tab==='risks' && <AlertTriangle className="w-3.5 h-3.5" />}
              {tab==='actions' && <ListChecks className="w-3.5 h-3.5" />}
              {tab==='stakeholders' && <Users className="w-3.5 h-3.5" />}
              {tab==='requirements' && <BookMarked className="w-3.5 h-3.5" />}
              {tab==='meetings' && <MessageSquare className="w-3.5 h-3.5" />}
              {tab==='techniques' && <Wrench className="w-3.5 h-3.5" />}
              {tab==='templates' && <FileStack className="w-3.5 h-3.5" />}
              {tab==='competencies' && <BrainCircuit className="w-3.5 h-3.5" />}
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        <div className="flex-1 space-y-4">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label:'Genel İlerleme', value:`${overallProgress}%`, sub:`${completedTasks.length+completedSubTasks.length}/${totalTasks+totalSubTasks} görev`, color:'text-blue-700', bg:'bg-blue-50 border-blue-200' },
                  { label:'Açık Riskler', value: activeProject.risks.filter(r=>r.status==='Açık').length, sub:`${activeProject.risks.length} toplam risk`, color:'text-rose-700', bg:'bg-rose-50 border-rose-200' },
                  { label:'Bekleyen Aksiyonlar', value: activeProject.actions.filter(a=>a.status!=='Tamamlandı').length, sub:`${activeProject.actions.filter(isOverdue).length} gecikmiş`, color:'text-amber-700', bg:'bg-amber-50 border-amber-200' },
                  { label:'Gereksinimler', value: activeProject.requirements.length, sub:`${activeProject.requirements.filter(r=>r.status==='Canlıda').length} canlıda`, color:'text-emerald-700', bg:'bg-emerald-50 border-emerald-200' },
                ].map((s,i) => (
                  <div key={i} className={`p-4 rounded-xl border ${s.bg} flex flex-col`}>
                    <span className="text-xs text-slate-500 mb-1">{s.label}</span>
                    <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
                    <span className="text-[10px] text-slate-400 mt-1">{s.sub}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {babokData.map(ka => {
                  const done = ka.tasks.filter(t => completedTasks.includes(t.id)).length;
                  const subDone = ka.tasks.flatMap(t=>t.checklist).filter(c=>completedSubTasks.includes(c.id)).length;
                  const subTotal = ka.tasks.reduce((a,t)=>a+t.checklist.length,0);
                  const pct = Math.round((done/ka.tasks.length)*100);
                  return (
                    <div key={ka.id} className={`bg-white rounded-xl border p-4 shadow-sm ${done===ka.tasks.length?'border-green-200':'border-slate-200'}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`p-1.5 rounded-lg ${ka.color} ${done===ka.tasks.length?'!bg-green-100 !border-green-200':''}`}>
                          {done===ka.tasks.length ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : ka.icon}
                        </div>
                        <h3 className={`font-bold text-sm ${ka.headerColor}`}>{ka.title}</h3>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                        <div className={`h-2 rounded-full transition-all ${done===ka.tasks.length?'bg-green-500':'bg-blue-500'}`} style={{width:`${pct}%`}}></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>{done}/{ka.tasks.length} Ana Görev ({pct}%)</span>
                        <span>{subDone}/{subTotal} Alt</span>
                      </div>
                      <button onClick={()=>{setActiveTab('knowledge_areas');}} className="mt-2 text-xs text-blue-600 hover:underline">Detay →</button>
                    </div>
                  );
                })}
              </div>
              <button onClick={exportMarkdown} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Tüm Projeyi Dışa Aktar (.md)
              </button>
            </div>
          )}

          {/* RISK REGISTER TAB */}
          {activeTab === 'risks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><AlertTriangle className="text-rose-500 w-5 h-5"/>Risk Kayıt Defteri</h2>
                  <p className="text-sm text-slate-500">{activeProject.risks.length} risk kayıtlı · {activeProject.risks.filter(r=>getRiskLevel(r.probability,r.impact).label==='Kritik').length} kritik</p>
                </div>
                <button onClick={()=>openRiskModal()} className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"><Plus className="w-4 h-4"/>Risk Ekle</button>
              </div>
              {activeProject.risks.length === 0 ? (
                <div className="text-center py-16 text-slate-400"><AlertTriangle className="w-10 h-10 mx-auto mb-3 opacity-30"/><p>Henüz risk eklenmemiş.</p></div>
              ) : (
                <div className="space-y-3">
                  {activeProject.risks.map(r => {
                    const lvl = getRiskLevel(r.probability, r.impact);
                    return (
                      <div key={r.id} className={`bg-white rounded-xl border p-4 shadow-sm flex items-start gap-4 ${lvl.cls.includes('rose')?'border-l-4 border-l-rose-400':lvl.cls.includes('amber')?'border-l-4 border-l-amber-400':'border-l-4 border-l-emerald-400'}`}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${lvl.cls}`}>{lvl.label}</span>
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{r.category}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${r.status==='Açık'?'bg-rose-50 text-rose-700':r.status==='Azaltıldı'?'bg-amber-50 text-amber-700':'bg-emerald-50 text-emerald-700'}`}>{r.status}</span>
                          </div>
                          <p className="font-semibold text-slate-800">{r.title}</p>
                          {r.mitigation && <p className="text-xs text-slate-500 mt-1">Azaltma: {r.mitigation}</p>}
                          <p className="text-xs text-slate-400 mt-1">Sorumlu: {r.owner||'—'} · Olas.: {PROB_LABELS[r.probability]} · Etki: {IMPACT_LABELS[r.impact]} · Skor: {r.probability*r.impact}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={()=>openRiskModal(r)} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-blue-600 transition-colors"><Pencil className="w-4 h-4"/></button>
                          <button onClick={()=>deleteRisk(r.id)} className="p-1.5 hover:bg-rose-50 rounded-md text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ACTION TRACKER TAB */}
          {activeTab === 'actions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><ListChecks className="text-indigo-500 w-5 h-5"/>Aksiyon Takip Listesi</h2>
                  <p className="text-sm text-slate-500">{activeProject.actions.length} aksiyon · {activeProject.actions.filter(isOverdue).length} gecikmiş</p>
                </div>
                <button onClick={()=>openActionModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"><Plus className="w-4 h-4"/>Aksiyon Ekle</button>
              </div>
              {activeProject.actions.length === 0 ? (
                <div className="text-center py-16 text-slate-400"><ListChecks className="w-10 h-10 mx-auto mb-3 opacity-30"/><p>Henüz aksiyon eklenmemiş.</p></div>
              ) : (
                <div className="space-y-3">
                  {activeProject.actions.map(a => {
                    const od = isOverdue(a);
                    return (
                      <div key={a.id} className={`bg-white rounded-xl border p-4 shadow-sm flex items-start gap-4 ${od?'border-l-4 border-l-rose-400 bg-rose-50/20':''}`}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${a.status==='Tamamlandı'?'bg-emerald-100 text-emerald-800 border-emerald-200':a.status==='Devam Ediyor'?'bg-blue-100 text-blue-800 border-blue-200':'bg-slate-100 text-slate-700 border-slate-200'}`}>{a.status}</span>
                            {od && <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1"><Clock className="w-3 h-3"/>Gecikmiş</span>}
                          </div>
                          <p className={`font-semibold ${a.status==='Tamamlandı'?'line-through text-slate-400':'text-slate-800'}`}>{a.title}</p>
                          <p className="text-xs text-slate-400 mt-1">Sorumlu: {a.owner||'—'} · Tarih: {a.dueDate||'—'}{a.source?` · Kaynak: ${a.source}`:''}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={()=>openActionModal(a)} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-blue-600 transition-colors"><Pencil className="w-4 h-4"/></button>
                          <button onClick={()=>deleteAction(a.id)} className="p-1.5 hover:bg-rose-50 rounded-md text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STAKEHOLDER TAB */}
          {activeTab === 'stakeholders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><UserPlus className="text-orange-500 w-5 h-5"/>Paydaş Yönetimi</h2>
                  <p className="text-sm text-slate-500">{activeProject.stakeholders.length} paydaş kayıtlı</p>
                </div>
                <button onClick={()=>openStakeholderModal()} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"><Plus className="w-4 h-4"/>Paydaş Ekle</button>
              </div>
              {activeProject.stakeholders.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-700 mb-3">İlgi / Etki Matrisi</h3>
                  <div className="relative h-48 border border-slate-200 rounded-lg bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
                    <div className="absolute inset-0 flex"><div className="flex-1 border-r border-dashed border-slate-300"/><div className="flex-1"/></div>
                    <div className="absolute inset-0 flex flex-col"><div className="flex-1 border-b border-dashed border-slate-300"/><div className="flex-1"/></div>
                    <span className="absolute top-1 left-2 text-[9px] text-slate-400">Yüksek Etki</span>
                    <span className="absolute bottom-1 left-2 text-[9px] text-slate-400">Düşük Etki</span>
                    <span className="absolute bottom-1 left-6 text-[9px] text-slate-400">Düşük İlgi</span>
                    <span className="absolute bottom-1 right-2 text-[9px] text-slate-400">Yüksek İlgi</span>
                    {activeProject.stakeholders.map(s => {
                      const x = ((s.interest-1)/2)*85+5;
                      const y = 100-((s.influence-1)/2)*85-10;
                      return (
                        <div key={s.id} className="absolute flex flex-col items-center" style={{left:`${x}%`,top:`${y}%`,transform:'translate(-50%,-50%)'}}>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-md ${RACI_COLORS[s.raci].replace('bg-','bg-').replace('text-','')}`} style={{background:s.raci==='R'?'#3b82f6':s.raci==='A'?'#8b5cf6':s.raci==='C'?'#f59e0b':'#94a3b8'}} title={s.name}>{s.name.charAt(0)}</div>
                          <span className="text-[8px] text-slate-600 whitespace-nowrap mt-0.5 bg-white/80 px-1 rounded">{s.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {activeProject.stakeholders.length === 0 ? (
                <div className="text-center py-16 text-slate-400"><Users className="w-10 h-10 mx-auto mb-3 opacity-30"/><p>Henüz paydaş eklenmemiş.</p></div>
              ) : (
                <div className="space-y-3">
                  {activeProject.stakeholders.map(s => (
                    <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0`} style={{background:s.raci==='R'?'#3b82f6':s.raci==='A'?'#8b5cf6':s.raci==='C'?'#f59e0b':'#94a3b8'}}>{s.name.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800">{s.name} <span className="text-slate-400 font-normal text-sm">— {s.role}</span></p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${RACI_COLORS[s.raci]}`}>{s.raci} — {RACI_LABELS[s.raci]}</span>
                          {s.department && <span className="text-xs text-slate-400">{s.department}</span>}
                          <span className="text-xs text-slate-400">İlgi: {PROB_LABELS[s.interest]} · Etki: {PROB_LABELS[s.influence]}</span>
                        </div>
                        {s.notes && <p className="text-xs text-slate-400 mt-1 italic">{s.notes}</p>}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={()=>openStakeholderModal(s)} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-blue-600 transition-colors"><Pencil className="w-4 h-4"/></button>
                        <button onClick={()=>deleteStakeholder(s.id)} className="p-1.5 hover:bg-rose-50 rounded-md text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* REQUIREMENTS TAB */}
          {activeTab === 'requirements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><BookMarked className="text-teal-500 w-5 h-5"/>Gereksinim Takip Tablosu</h2>
                  <p className="text-sm text-slate-500">{activeProject.requirements.length} gereksinim · {activeProject.requirements.filter(r=>r.status==='Canlıda').length} canlıda</p>
                </div>
                <div className="flex items-center gap-2">
                  <select value={reqFilter} onChange={e=>setReqFilter(e.target.value)} className="text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-teal-400">
                    <option value="all">Tüm Durumlar</option>
                    {Object.keys(REQ_STATUS_COLORS).map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={()=>openReqModal()} className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"><Plus className="w-4 h-4"/>Gereksinim Ekle</button>
                </div>
              </div>
              {activeProject.requirements.length === 0 ? (
                <div className="text-center py-16 text-slate-400"><BookMarked className="w-10 h-10 mx-auto mb-3 opacity-30"/><p>Henüz gereksinim eklenmemiş.</p></div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>{['ID','Gereksinim','Hedef','Modül','Durum',''].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeProject.requirements.filter(r=>reqFilter==='all'||r.status===reqFilter).map(r=>(
                        <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-xs font-mono text-slate-500 whitespace-nowrap">{r.reqId}</td>
                          <td className="px-4 py-3 font-medium text-slate-800">{r.name}</td>
                          <td className="px-4 py-3 text-xs text-slate-500 max-w-[150px] truncate">{r.objective||'—'}</td>
                          <td className="px-4 py-3 text-xs text-slate-500">{r.module||'—'}</td>
                          <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${REQ_STATUS_COLORS[r.status]||'bg-slate-100 text-slate-700'}`}>{r.status}</span></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button onClick={()=>openReqModal(r)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600 transition-colors"><Pencil className="w-3.5 h-3.5"/></button>
                              <button onClick={()=>deleteReq(r.id)} className="p-1 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* MEETINGS TAB */}
          {activeTab === 'meetings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><MessageSquare className="text-violet-500 w-5 h-5"/>Toplantı Notları</h2>
                  <p className="text-sm text-slate-500">{activeProject.meetings.length} toplantı kaydı</p>
                </div>
                <button onClick={()=>setShowMeetingModal(true)} className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"><Plus className="w-4 h-4"/>Yeni Toplantı</button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  {activeProject.meetings.length === 0 && <div className="text-center py-12 text-slate-400"><MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30"/><p className="text-sm">Henüz toplantı yok.</p></div>}
                  {activeProject.meetings.map(m=>(
                    <div key={m.id} onClick={()=>setSelectedMeeting(m)} className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedMeeting?.id===m.id?'border-violet-400 bg-violet-50 shadow-sm':'border-slate-200 bg-white hover:border-violet-200 hover:shadow-sm'}`}>
                      <p className="font-semibold text-sm text-slate-800 truncate">{m.topic}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-slate-400">{m.date}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-slate-400">{m.notes.length} not</span>
                          <button onClick={e=>{e.stopPropagation();deleteMeeting(m.id);}} className="p-0.5 hover:text-rose-500 text-slate-300 transition-colors"><Trash2 className="w-3 h-3"/></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="lg:col-span-2">
                  {!selectedMeeting ? (
                    <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-xl"><StickyNote className="w-8 h-8 mx-auto mb-2 opacity-30"/><p className="text-sm">Sol taraftan bir toplantı seçin.</p></div>
                  ) : (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                      <div className="flex items-start justify-between">
                        <div><h3 className="font-bold text-slate-800">{selectedMeeting.topic}</h3><p className="text-xs text-slate-400 mt-0.5">{selectedMeeting.date} · {selectedMeeting.attendees}</p></div>
                        <button onClick={()=>generateMoM(selectedMeeting)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"><ClipboardCopy className="w-3.5 h-3.5"/>MoM Oluştur</button>
                      </div>
                      <div className="flex gap-2">
                        <select value={newNoteType} onChange={e=>setNewNoteType(e.target.value)} className="text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-slate-50 focus:outline-none w-32">
                          <option>Karar</option><option>Açık Nokta</option><option>Aksiyon</option>
                        </select>
                        <input value={newNoteText} onChange={e=>setNewNoteText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addNote()} placeholder="Not ekle ve Enter'a bas..." className="flex-1 text-sm border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-400"/>
                        <button onClick={addNote} className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors"><Plus className="w-4 h-4"/></button>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {selectedMeeting.notes.length===0 && <p className="text-xs text-slate-400 text-center py-4">Henüz not yok. Yukarıdan ekleyin.</p>}
                        {selectedMeeting.notes.map(n=>(
                          <div key={n.id} className={`flex items-start gap-2 p-2.5 rounded-lg border text-sm ${NOTE_TYPE_COLORS[n.type]}`}>
                            <span className="text-xs font-bold whitespace-nowrap shrink-0 mt-0.5">{n.type}</span>
                            <span className="flex-1">{n.text}</span>
                            <button onClick={()=>deleteNote(n.id)} className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"><X className="w-3.5 h-3.5"/></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: KNOWLEDGE AREAS (Proje Kontrol Listesi) */}
          {activeTab === 'knowledge_areas' && (
            <>
              {/* AI CONTEXT INPUT SECTON */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100 mb-6 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <Bot className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-indigo-900 text-lg flex items-center gap-2">
                      ✨ Yapay Zeka (AI) İçin Proje Bağlamı
                    </h3>
                    <p className="text-sm text-indigo-700 mt-1">
                      Aşağıya projenizi kısaca özetleyin (Örn: "Restoranlar için QR menü uygulaması", "Banka çalışanları için yeni izin sistemi"). Yapay zeka, bu bilgiye dayanarak her BABOK adımı için size özel doküman taslakları üretecektir.
                    </p>
                  </div>
                </div>
                <textarea 
                  className="w-full p-3 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all text-sm text-slate-700 resize-none"
                  rows="3"
                  placeholder="Projenizin konusu ve hedefleri nedir?"
                  value={projectContext}
                  onChange={(e) => {
                    setProjectContext(e.target.value);
                    setIsContextSaved(false);
                  }}
                ></textarea>
                <div className="mt-3 flex justify-end items-center gap-3">
                  {isContextSaved && (
                    <span className="text-sm text-emerald-600 font-medium flex items-center gap-1.5 animate-in fade-in slide-in-from-right-2 duration-300">
                      <CheckCircle2 className="w-4 h-4" /> Bağlam Kaydedildi!
                    </span>
                  )}
                  <button 
                    onClick={() => {
                      if(projectContext.trim()) {
                        setIsContextSaved(true);
                        setTimeout(() => setIsContextSaved(false), 3000);
                      }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-5 rounded-md transition-colors shadow-sm flex items-center gap-2"
                  >
                    Kaydet ve Onayla
                  </button>
                </div>
              </div>

              {babokData.map((ka) => {
                const kaCompletedTasks = ka.tasks.filter(t => completedTasks.includes(t.id)).length;
                const isAllComplete = kaCompletedTasks === ka.tasks.length;
                const isExpanded = expandedKA === ka.id;

                return (
                  <div key={ka.id} className={`bg-white rounded-xl shadow-sm border ${isAllComplete ? 'border-green-200' : 'border-slate-200'} overflow-hidden transition-all mb-4`}>
                    {/* KA Header */}
                    <div 
                      className={`p-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${isExpanded ? 'bg-slate-50 border-b border-slate-100' : ''}`}
                      onClick={() => setExpandedKA(isExpanded ? null : ka.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${ka.color} ${isAllComplete ? 'bg-green-100 border-green-200' : ''}`}>
                          {isAllComplete ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : ka.icon}
                        </div>
                        <div>
                          <h2 className={`font-bold text-lg ${ka.headerColor}`}>{ka.title}</h2>
                          <p className="text-sm text-slate-500 hidden md:block">{ka.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isAllComplete && (
                          <button
                            onClick={(e) => markAllKA(ka, e)}
                            className="text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-md transition-colors shrink-0"
                          >
                            Tümünü İşaretle
                          </button>
                        )}
                        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                          {kaCompletedTasks}/{ka.tasks.length}
                        </span>
                        {isExpanded ? <ChevronDown className="text-slate-400" /> : <ChevronRight className="text-slate-400" />}
                      </div>
                    </div>

                    {/* KA Tasks */}
                    {isExpanded && (
                      <div className="divide-y divide-slate-100 bg-white">
                        {ka.tasks.map(task => {
                          const isTaskCompleted = completedTasks.includes(task.id);
                          const isTaskSelected = selectedTask?.id === task.id;
                          
                          // Calculate subtask progress
                          const subTasksTotal = task.checklist.length;
                          const subTasksCompleted = task.checklist.filter(c => completedSubTasks.includes(c.id)).length;
                          const subTaskProgress = Math.round((subTasksCompleted / subTasksTotal) * 100) || 0;

                          return (
                            <div key={task.id} className="flex flex-col">
                              <div 
                                className={`p-4 pl-6 md:pl-16 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors ${isTaskSelected ? 'bg-slate-50' : ''}`}
                                onClick={() => handleTaskClick(task)}
                              >
                                <button 
                                  onClick={(e) => toggleTask(task.id, e)}
                                  className="focus:outline-none shrink-0"
                                  title="Ana Görevi Tamamla"
                                >
                                  {isTaskCompleted ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-500 hover:text-green-600 transition-colors" />
                                  ) : (
                                    <Circle className="w-6 h-6 text-slate-300 hover:text-blue-500 transition-colors" />
                                  )}
                                </button>
                                
                                <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                  <span className={`font-medium ${isTaskCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                    {task.name}
                                  </span>
                                  
                                  {/* Mini progress indicator for subtasks */}
                                  <div className="flex items-center gap-2 w-24">
                                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                                      <div className={`h-1.5 rounded-full ${subTaskProgress === 100 ? 'bg-green-500' : 'bg-blue-400'}`} style={{width: `${subTaskProgress}%`}}></div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-medium">{subTasksCompleted}/{subTasksTotal}</span>
                                  </div>
                                </div>
                                
                                {isTaskSelected ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                              </div>

                              {/* Task Detail Inline Drawer with Checklist */}
                              {isTaskSelected && (
                                <div className="pl-14 md:pl-24 pr-4 pb-4 bg-slate-50">
                                  <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                                    
                                    <div className="flex justify-between items-start gap-4 mb-4">
                                      <p className="text-sm text-slate-600 italic border-l-2 border-slate-300 pl-3">
                                        {task.purpose}
                                      </p>
                                      {/* AI Generator Button */}
                                      <button 
                                        onClick={() => handleOpenAIModal(task, ka.title)}
                                        className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-3 rounded-md flex items-center gap-1.5 transition-colors shadow-sm"
                                      >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>AI Taslak Üret</span>
                                      </button>
                                    </div>

                                    {/* Deliverables Banner */}
                                    <div className="bg-slate-50 border border-slate-200 rounded-md p-3 mb-5 flex gap-3 items-center">
                                      <FileText className="w-5 h-5 text-slate-500 shrink-0" />
                                      <div>
                                        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Beklenen Çıktılar (Deliverables)</h5>
                                        <p className="text-sm font-medium text-slate-800">{task.deliverables}</p>
                                      </div>
                                    </div>

                                    {/* Actionable Detailed Checklist */}
                                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                      <CheckSquare className="w-4 h-4 text-blue-600" /> Operasyonel Checklist
                                    </h4>
                                    
                                    <div className="space-y-2 mb-6">
                                      {task.checklist.map((item) => {
                                        const isChecked = completedSubTasks.includes(item.id);
                                        return (
                                          <div 
                                            key={item.id} 
                                            className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${isChecked ? 'bg-green-50/50 border-green-100' : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50'}`}
                                            onClick={() => toggleSubTask(item.id)}
                                          >
                                            <div className="mt-0.5 shrink-0">
                                              {isChecked ? (
                                                <CheckSquare className="w-5 h-5 text-green-600" />
                                              ) : (
                                                <Square className="w-5 h-5 text-slate-300" />
                                              )}
                                            </div>
                                            <span className={`text-sm leading-relaxed ${isChecked ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                                              {item.text}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>

                                    {/* Tip Box */}
                                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex gap-3 items-start">
                                      <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                      <p className="text-sm text-amber-900 leading-relaxed">
                                        <strong className="block mb-1">Analist İpucu:</strong> {task.tips}
                                      </p>
                                    </div>
                                    
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* TAB 2: TECHNIQUES (Teknikler) */}
          {activeTab === 'techniques' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg flex gap-3 items-start border border-emerald-100 mb-6">
                <Wrench className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">
                  <strong>İş Analizi Teknikleri:</strong> BABOK'ta 50'den fazla teknik bulunur. Burada en sık kullanılan ve her analistin alet çantasında bulunması gereken temel yöntemleri bulabilirsiniz.
                </p>
              </div>
              <div className="flex gap-2 mb-4 flex-wrap">
                {[['all','Tümü'],...babokData.map(ka=>[ka.id,ka.title.split(' ')[0]])].map(([id,lbl])=>(
                  <button key={id} onClick={()=>setTechFilter(id)} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors border ${techFilter===id?'bg-emerald-600 text-white border-emerald-600':'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'}`}>{lbl}</button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {techniquesData.filter(t=>techFilter==='all'||t.relatedKA.includes(techFilter)).map(tech => (
                  <div key={tech.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-lg text-slate-800 mb-2">{tech.name}</h3>
                    <p className="text-sm text-slate-600 mb-4">{tech.desc}</p>
                    <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
                      <span className="text-xs font-bold text-slate-500 uppercase">En İyi Nerede Kullanılır?</span>
                      <p className="text-sm text-slate-700 mt-1">{tech.bestFor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TEMPLATES (Doküman Şablonları) */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="bg-amber-50 text-amber-800 p-4 rounded-lg flex gap-3 items-start border border-amber-100 mb-6">
                <FileStack className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">
                  <strong>BABOK Doküman Şablonları:</strong> Bir iş analizi projesinde standart olarak bulunması gereken temel belgelerin yapısal (iskelet) şablonlarıdır. Herhangi bir şablonu kopyalayarak projenizdeki ilgili Word dokümanına, Confluence sayfasına veya Jira Issue açıklamasına doğrudan yapıştırabilir ve altlarını kendi projenize göre doldurabilirsiniz.
                </p>
              </div>
              
              <div className="space-y-6">
                {templatesData.map(tpl => (
                  <div key={tpl.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-indigo-500" />
                          {tpl.name}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">{tpl.purpose}</p>
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(tpl.format);
                          alert(tpl.name + ' panoya kopyalandı!');
                        }}
                        className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 py-1.5 px-3 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm shrink-0 self-start md:self-auto"
                      >
                        <ClipboardCopy className="w-4 h-4" />
                        Şablonu Kopyala
                      </button>
                    </div>
                    <div className="p-4 bg-slate-900 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {tpl.format}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COMPETENCIES (Yetkinlikler) */}
          {activeTab === 'competencies' && (
            <div className="space-y-4">
              <div className="bg-purple-50 text-purple-800 p-4 rounded-lg flex gap-3 items-start border border-purple-100 mb-6">
                <BrainCircuit className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">
                  <strong>Temel Yetkinlikler:</strong> Başarılı bir iş analisti olmak sadece teknikleri bilmekle değil, doğru iletişim ve analitik düşünce yapısına sahip olmakla ilgilidir.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {competenciesData.map(comp => (
                  <div key={comp.id} className="bg-white p-5 rounded-xl border border-slate-200 border-l-4 border-l-purple-400 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-lg text-slate-800 mb-2">{comp.name}</h3>
                    <p className="text-sm text-slate-600">{comp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* RESET CONFIRM */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg text-slate-800 mb-2">İlerlemeyi Sıfırla?</h3>
            <p className="text-sm text-slate-500 mb-5">Bu projede tamamlanan tüm ana görev ve alt görevler sıfırlanacak. Bu işlem geri alınamaz!</p>
            <div className="flex justify-end gap-3">
              <button onClick={()=>setShowResetConfirm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md">İptal</button>
              <button onClick={resetProgress} className="px-4 py-2 text-sm bg-rose-600 hover:bg-rose-700 text-white rounded-md font-medium">Sıfırla</button>
            </div>
          </div>
        </div>
      )}

      {/* PROJECT MODAL */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2"><FolderPlus className="text-blue-500 w-5 h-5"/>Yeni Proje</h3>
            <input value={newProjectName} onChange={e=>setNewProjectName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&createProject()} placeholder="Proje adı..." className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4" autoFocus/>
            <div className="flex justify-end gap-3">
              <button onClick={()=>{setShowProjectModal(false);setNewProjectName('');}} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md">İptal</button>
              <button onClick={createProject} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium">Oluştur</button>
            </div>
          </div>
        </div>
      )}

      {/* RISK MODAL */}
      {showRiskModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full">
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2"><AlertTriangle className="text-rose-500 w-5 h-5"/>{editingRisk?'Riski Düzenle':'Yeni Risk'}</h3>
            <div className="space-y-3">
              <input value={riskForm.title} onChange={e=>setRiskForm({...riskForm,title:e.target.value})} placeholder="Risk başlığı*" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"/>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-slate-500 block mb-1">Kategori</label>
                  <select value={riskForm.category} onChange={e=>setRiskForm({...riskForm,category:e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                    {['Teknik','İş','Kaynak','Çevresel','Yasal'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className="text-xs text-slate-500 block mb-1">Durum</label>
                  <select value={riskForm.status} onChange={e=>setRiskForm({...riskForm,status:e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                    {['Açık','Azaltıldı','Kapatıldı'].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-slate-500 block mb-1">Olasılık: {PROB_LABELS[riskForm.probability]}</label>
                  <input type="range" min="1" max="3" value={riskForm.probability} onChange={e=>setRiskForm({...riskForm,probability:Number(e.target.value)})} className="w-full accent-rose-500"/>
                </div>
                <div><label className="text-xs text-slate-500 block mb-1">Etki: {IMPACT_LABELS[riskForm.impact]}</label>
                  <input type="range" min="1" max="3" value={riskForm.impact} onChange={e=>setRiskForm({...riskForm,impact:Number(e.target.value)})} className="w-full accent-rose-500"/>
                </div>
              </div>
              <div className={`text-center text-sm font-bold py-2 rounded-lg border ${getRiskLevel(riskForm.probability,riskForm.impact).cls}`}>
                Risk Skoru: {riskForm.probability*riskForm.impact} — {getRiskLevel(riskForm.probability,riskForm.impact).label}
              </div>
              <input value={riskForm.owner} onChange={e=>setRiskForm({...riskForm,owner:e.target.value})} placeholder="Sorumlu kişi" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
              <textarea value={riskForm.mitigation} onChange={e=>setRiskForm({...riskForm,mitigation:e.target.value})} placeholder="Azaltma stratejisi..." rows="2" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"/>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={()=>setShowRiskModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md">İptal</button>
              <button onClick={saveRisk} className="px-4 py-2 text-sm bg-rose-600 hover:bg-rose-700 text-white rounded-md font-medium">Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* ACTION MODAL */}
      {showActionModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2"><ListChecks className="text-indigo-500 w-5 h-5"/>{editingAction?'Aksiyonu Düzenle':'Yeni Aksiyon'}</h3>
            <div className="space-y-3">
              <input value={actionForm.title} onChange={e=>setActionForm({...actionForm,title:e.target.value})} placeholder="Aksiyon başlığı*" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
              <div className="grid grid-cols-2 gap-3">
                <input value={actionForm.owner} onChange={e=>setActionForm({...actionForm,owner:e.target.value})} placeholder="Sorumlu kişi" className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
                <input type="date" value={actionForm.dueDate} onChange={e=>setActionForm({...actionForm,dueDate:e.target.value})} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
              </div>
              <select value={actionForm.status} onChange={e=>setActionForm({...actionForm,status:e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {['Bekliyor','Devam Ediyor','Tamamlandı'].map(s=><option key={s}>{s}</option>)}
              </select>
              <input value={actionForm.source} onChange={e=>setActionForm({...actionForm,source:e.target.value})} placeholder="Kaynak (ör. Toplantı adı)" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={()=>setShowActionModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md">İptal</button>
              <button onClick={saveAction} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium">Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* STAKEHOLDER MODAL */}
      {showStakeholderModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2"><UserPlus className="text-orange-500 w-5 h-5"/>{editingStakeholder?'Paydaşı Düzenle':'Yeni Paydaş'}</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={stakeholderForm.name} onChange={e=>setStakeholderForm({...stakeholderForm,name:e.target.value})} placeholder="Paydaş adı*" className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"/>
                <input value={stakeholderForm.role} onChange={e=>setStakeholderForm({...stakeholderForm,role:e.target.value})} placeholder="Rol/Ünvan" className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
              </div>
              <input value={stakeholderForm.department} onChange={e=>setStakeholderForm({...stakeholderForm,department:e.target.value})} placeholder="Departman" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-slate-500 block mb-1">İlgi: {PROB_LABELS[stakeholderForm.interest]}</label>
                  <input type="range" min="1" max="3" value={stakeholderForm.interest} onChange={e=>setStakeholderForm({...stakeholderForm,interest:Number(e.target.value)})} className="w-full accent-orange-500"/>
                </div>
                <div><label className="text-xs text-slate-500 block mb-1">Etki: {PROB_LABELS[stakeholderForm.influence]}</label>
                  <input type="range" min="1" max="3" value={stakeholderForm.influence} onChange={e=>setStakeholderForm({...stakeholderForm,influence:Number(e.target.value)})} className="w-full accent-orange-500"/>
                </div>
              </div>
              <div><label className="text-xs text-slate-500 block mb-1">RACI Rolü</label>
                <div className="flex gap-2">
                  {Object.entries(RACI_LABELS).map(([k,v])=>(
                    <button key={k} onClick={()=>setStakeholderForm({...stakeholderForm,raci:k})} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors border ${stakeholderForm.raci===k?RACI_COLORS[k]+' border-current':'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>{k}</button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1">{RACI_LABELS[stakeholderForm.raci]}</p>
              </div>
              <textarea value={stakeholderForm.notes} onChange={e=>setStakeholderForm({...stakeholderForm,notes:e.target.value})} placeholder="Notlar..." rows="2" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"/>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={()=>setShowStakeholderModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md">İptal</button>
              <button onClick={saveStakeholder} className="px-4 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium">Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* REQUIREMENT MODAL */}
      {showReqModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2"><BookMarked className="text-teal-500 w-5 h-5"/>{editingReq?'Gereksinimi Düzenle':'Yeni Gereksinim'}</h3>
            <div className="space-y-3">
              <input value={reqForm.name} onChange={e=>setReqForm({...reqForm,name:e.target.value})} placeholder="Gereksinim adı*" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"/>
              <input value={reqForm.objective} onChange={e=>setReqForm({...reqForm,objective:e.target.value})} placeholder="Bağlı iş hedefi" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
              <div className="grid grid-cols-2 gap-3">
                <input value={reqForm.module} onChange={e=>setReqForm({...reqForm,module:e.target.value})} placeholder="Modül/Ekran" className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
                <input value={reqForm.testId} onChange={e=>setReqForm({...reqForm,testId:e.target.value})} placeholder="Test ID" className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
              </div>
              <select value={reqForm.status} onChange={e=>setReqForm({...reqForm,status:e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {Object.keys(REQ_STATUS_COLORS).map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={()=>setShowReqModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md">İptal</button>
              <button onClick={saveReq} className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-md font-medium">Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* MEETING MODAL */}
      {showMeetingModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2"><MessageSquare className="text-violet-500 w-5 h-5"/>Yeni Toplantı</h3>
            <div className="space-y-3">
              <input value={meetingForm.topic} onChange={e=>setMeetingForm({...meetingForm,topic:e.target.value})} placeholder="Toplantı konusu*" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"/>
              <input value={meetingForm.attendees} onChange={e=>setMeetingForm({...meetingForm,attendees:e.target.value})} placeholder="Katılımcılar (ör. Ahmet, Ayşe, Mehmet)" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
              <input type="date" value={meetingForm.date} onChange={e=>setMeetingForm({...meetingForm,date:e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={()=>setShowMeetingModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md">İptal</button>
              <button onClick={saveMeeting} className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-md font-medium">Oluştur</button>
            </div>
          </div>
        </div>
      )}

      {/* AI GENERATION MODAL */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-indigo-600 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-lg">AI Taslak: {activeAiTask?.name}</h3>
              </div>
              <button 
                onClick={() => setIsAiModalOpen(false)}
                className="text-indigo-100 hover:text-white transition-colors focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center h-48 text-indigo-600">
                  <Loader2 className="w-10 h-10 animate-spin mb-4" />
                  <p className="font-medium">Proje bağlamınıza göre özel dokümanlar hazırlanıyor...</p>
                  <p className="text-sm text-slate-500 mt-2">Bu işlem birkaç saniye sürebilir.</p>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm overflow-x-auto">
                  <div 
                    className="text-slate-700 leading-relaxed text-[15px]"
                    dangerouslySetInnerHTML={formatMarkdown(aiResult)}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-white border-t border-slate-200 p-4 flex justify-end gap-3">
              <button 
                onClick={() => setIsAiModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
              >
                Kapat
              </button>
              {!aiLoading && (
                <button 
                  onClick={handleRegenerateAI}
                  className="px-4 py-2 text-sm font-medium bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Yeniden \u00dcret
                </button>
              )}
              {!aiLoading && (
                <button 
                  onClick={copyToClipboard}
                  className="px-4 py-2 text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Kopyala
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}