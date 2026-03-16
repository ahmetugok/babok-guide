import React, { useState, useEffect } from 'react';
import {
  BookOpen, Target, Users, Layers,
  RefreshCw, Activity, Info, Lightbulb, Wrench, BrainCircuit, LayoutGrid, FileText,
  Sparkles, X, Copy, Loader2, FileStack,
  AlertTriangle, Trash2, Plus, Download, LayoutDashboard, ListChecks,
  FolderPlus, RotateCcw, MessageSquare,
  ArrowUpRight, BookMarked, CalendarDays, Upload, Moon, Sun
} from 'lucide-react';

import { DEFAULT_PROJECT, PROB_LABELS, RACI_LABELS, templatesData } from './constants/index.js';
import { generateId, formatMarkdown } from './utils.js';
import { generateBABOKReport } from './utils/exportEngine.js';

import { DashboardTab } from './tabs/DashboardTab.jsx';
import { KnowledgeAreasTab } from './tabs/KnowledgeAreasTab.jsx';
import { AssumptionsTab } from './tabs/AssumptionsTab.jsx';
import { BusinessRulesTab } from './tabs/BusinessRulesTab.jsx';
import { ChangesTab } from './tabs/ChangesTab.jsx';
import { RisksTab } from './tabs/RisksTab.jsx';
import { ActionsTab } from './tabs/ActionsTab.jsx';
import { StakeholdersTab } from './tabs/StakeholdersTab.jsx';
import { RequirementsTab } from './tabs/RequirementsTab.jsx';
import { TraceabilityTab } from './tabs/TraceabilityTab.jsx';
import { MeetingsTab } from './tabs/MeetingsTab.jsx';
import { GanttTab } from './tabs/GanttTab.jsx';
import { TechniquesTab } from './tabs/TechniquesTab.jsx';
import { TemplatesTab } from './tabs/TemplatesTab.jsx';
import { CompetenciesTab } from './tabs/CompetenciesTab.jsx';

import { BusinessRuleModal } from './modals/BusinessRuleModal.jsx';
import { ChangeRequestModal } from './modals/ChangeRequestModal.jsx';
import { RiskModal } from './modals/RiskModal.jsx';
import { AssumptionModal } from './modals/AssumptionModal.jsx';
import { ActionModal } from './modals/ActionModal.jsx';
import { StakeholderModal } from './modals/StakeholderModal.jsx';
import { RequirementModal } from './modals/RequirementModal.jsx';
import { LinkCardModal } from './modals/LinkCardModal.jsx';
import { MeetingModal } from './modals/MeetingModal.jsx';
import { GanttModal } from './modals/GanttModal.jsx';
import { ExportModal } from './modals/ExportModal.jsx';

// --- BABOK KNOWLEDGE AREAS AND DETAILED TASKS DATA ---
const babokData = [
  {
    id: 'ka1',
    title: 'Strateji Analizi',
    description: 'Bir ihtiyacı tanımlama, mevcut durumu anlama ve istenen gelecekteki duruma ulaşmak için bir değişim stratejisi önerme.',
    icon: <Target className="w-6 h-6 text-purple-500" />,
    color: 'border-purple-200 bg-purple-500/10',
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
    color: 'border-blue-500/20 bg-blue-500/10',
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
        name: 'İş Analizi Bilgisini Yönetme',
        purpose: 'Analiz çalışmaları sırasında üretilen tüm bilgi ve çıktıların düzenli, erişilebilir ve güncel tutulmasını sağlamak.',
        deliverables: 'Gereksinim Deposu (Repository), Versiyon Kontrollü Belgeler',
        checklist: [
          { id: 'c2_4_1', text: 'Tüm gereksinim ve analiz dokümanlarının saklanacağı merkezi bir yer (Confluence, SharePoint vb.) belirleyin.' },
          { id: 'c2_4_2', text: 'Dokümanlar için bir versiyon numaralandırma standardı (v1.0, v1.1 gibi) belirleyin.' },
          { id: 'c2_4_3', text: 'Eski ve geçersiz gereksinimlerin ne yapılacağını (arşivleme, silme) planlayın.' }
        ],
        tips: 'Bilgi yönetimi sıkıcı görünür ama bir toplantıdan 3 ay sonra "Bu kararı neden almıştık?" sorusunu yanıtlayabilmek paha biçilemez.'
      },
      {
        id: 't2_5',
        name: 'İş Analizi Performansını İzleme',
        purpose: 'Kendi iş analizi çalışmalarının kalitesini ve verimliliğini ölçerek sürekli iyileştirme sağlamak.',
        deliverables: 'İA Performans Metrikleri Raporu, Derslerin Öğrenilmesi (Lessons Learned)',
        checklist: [
          { id: 'c2_5_1', text: 'İş analizi sürecinin kalitesini ölçmek için metrikler belirleyin (ör: toplantıda geçirilen süre, düzeltilen gereksinim sayısı).' },
          { id: 'c2_5_2', text: 'Periyodik olarak (Sprint sonu, faz sonu) "Geri Bakış" (Retrospective) yaparak neyin iyi, neyin kötü gittiğini belgeleyin.' },
          { id: 'c2_5_3', text: 'Öğrenilen dersleri gelecekteki projeler için paylaşın.' }
        ],
        tips: 'En iyi analistler, her projeden bir şeyler öğrenir. "Lessons Learned" belgesi, kurumsal hafızanın en değerli parçasıdır.'
      }
    ]
  },
  {
    id: 'ka3',
    title: 'Ortaya Çıkarma ve İşbirliği',
    description: 'Paydaşlardan ihtiyaçlar, beklentiler ve kısıtlamalar hakkında bilgi toplamak için teknikler kullanma.',
    icon: <Users className="w-6 h-6 text-green-500" />,
    color: 'border-green-500/20 bg-green-500/10',
    headerColor: 'text-green-700',
    tasks: [
      {
        id: 't3_1',
        name: 'Ortaya Çıkarmayı Hazırlama',
        purpose: 'Paydaşlarla yapılacak görüşme veya atölye çalışmasını verimli kılmak için önceden hazırlanmak.',
        deliverables: 'Görüşme Rehberi (Interview Guide), Atölye Ajandası',
        checklist: [
          { id: 'c3_1_1', text: 'Hangi bilgilere ihtiyaç duyduğunuzu ve bu bilgileri kimden alabileceğinizi listeleyin.' },
          { id: 'c3_1_2', text: 'Görüşmeler için açık uçlu sorulardan oluşan bir soru listesi hazırlayın.' },
          { id: 'c3_1_3', text: 'Atölye çalışmaları için katılımcıları, gündem maddelerini ve süreleri içeren bir ajanda oluşturun.' },
          { id: 'c3_1_4', text: 'Kullanılacak teknikleri (Beyin Fırtınası, Prototip Gösterimi vb.) belirleyin.' }
        ],
        tips: '"Sistemin nasıl çalışmasını istersiniz?" yerine "Şu an hangi adımda en çok zaman kaybediyorsunuz?" gibi sorular çok daha değerli yanıtlar getirir.'
      },
      {
        id: 't3_2',
        name: 'Ortaya Çıkarmayı Yürütme',
        purpose: 'Paydaşlarla aktif olarak etkileşerek gereksinimleri, fikirleri ve kısıtlamaları keşfetmek.',
        deliverables: 'Toplantı Notları, Ham Gereksinim Listesi, Gözlem Bulguları',
        checklist: [
          { id: 'c3_2_1', text: 'Planlanan görüşmeleri, atölyeleri veya anketleri gerçekleştirin.' },
          { id: 'c3_2_2', text: 'Toplantı sırasında aktif dinleme yapın; söylenmeyeni de duymaya çalışın.' },
          { id: 'c3_2_3', text: 'Her toplantının sonunda kısa bir özet yaparak mutabık kalınan noktaları teyit edin.' },
          { id: 'c3_2_4', text: 'Farklı paydaşlar arasında çelişen gereksinimleri not alın, daha sonra çözüme kavuşturmak üzere işaretleyin.' }
        ],
        tips: 'Paydaşlar çoğu zaman ne istediklerini değil, ne yapmak istediklerini anlatır. "Ne" değil "Neden" sorusunu sormayı alışkanlık edinin.'
      },
      {
        id: 't3_3',
        name: 'Ortaya Çıkarma Sonuçlarını Onaylama',
        purpose: 'Toplanan bilgilerin paydaşların gerçek niyetini doğru yansıttığından emin olmak.',
        deliverables: 'Onaylı Toplantı Tutanağı (MoM), Çatışan Gereksinim Çözüm Raporu',
        checklist: [
          { id: 'c3_3_1', text: 'Toplantı notlarını ve çıkarılan gereksinimleri düzenleyerek paydaşlara gönderin.' },
          { id: 'c3_3_2', text: 'Belirlenen süre içinde onay veya düzeltme geri bildirimi isteyin.' },
          { id: 'c3_3_3', text: 'Çelişen paydaş görüşlerini kolaylaştırıcı (facilitator) rolüyle uzlaştırın.' }
        ],
        tips: '"MoM\'u okudum, onaylıyorum" yanıtını almak zordur. "Herhangi bir itirazınız yoksa 3 iş günü içinde onaylandı sayacağım" yöntemi işe yarar.'
      }
    ]
  },
  {
    id: 'ka4',
    title: 'Gereksinimlerin Yaşam Döngüsü Yönetimi',
    description: 'Gereksinimlerin ve tasarımların belgelenmesi, izlenmesi, önceliklendirilmesi ve onaylanması süreçleri.',
    icon: <RefreshCw className="w-6 h-6 text-orange-500" />,
    color: 'border-orange-500/20 bg-orange-500/10',
    headerColor: 'text-orange-700',
    tasks: [
      {
        id: 't4_1',
        name: 'Gereksinimleri İzleme',
        purpose: 'Bir gereksinimin proje boyunca izlenebilirliğini (traceability) sağlamak.',
        deliverables: 'İzlenebilirlik Matrisi (Traceability Matrix)',
        checklist: [
          { id: 'c4_1_1', text: 'Her gereksinimleme bir iş hedefiyle, bir proje çıktısıyla veya bir test senaryosuyla ilişkilendirin.' },
          { id: 'c4_1_2', text: 'İzlenebilirlik matrisini oluşturun ve düzenli aralıklarla güncelleyin.' },
          { id: 'c4_1_3', text: 'Hiçbir gereksinimin karşılıksız (implement edilmemiş veya test edilmemiş) kalmamasını sağlayın.' }
        ],
        tips: 'İzlenebilirlik matrisi olmadan "Bu özellik neden geliştirildi?" sorusu proje biterken bile yanıtsız kalabilir. Bu matris sizi kurtarır.'
      },
      {
        id: 't4_2',
        name: 'Gereksinimleri Sürdürme',
        purpose: 'Gereksinimler değiştikçe bunları güncel, doğru ve tutarlı tutmak.',
        deliverables: 'Güncellenmiş Gereksinim Deposu, Değişiklik Geçmişi Logu',
        checklist: [
          { id: 'c4_2_1', text: 'Gereksinimlerde yapılan her değişikliği, nedenini ve kimin onayladığını kaydedin.' },
          { id: 'c4_2_2', text: 'Gereksinimler arasındaki bağımlılıkları belirleyin; bir gereksinim değişirse bağlı olanları da güncelleyin.' },
          { id: 'c4_2_3', text: 'Geçersiz veya kapsam dışına çıkan gereksinimleri aktif listeden çıkarıp arşivleyin.' }
        ],
        tips: 'Gereksinimlerin "canlı belgeler" olduğunu unutmayın. Proje başındaki ilk liste, proje sonunda tamamen farklı görünebilir ve bu normaldir.'
      },
      {
        id: 't4_3',
        name: 'Gereksinimleri Önceliklendirme',
        purpose: 'Kısıtlı zaman ve bütçe ile hangi gereksinimlerin önce ele alınacağına karar vermek.',
        deliverables: 'Önceliklendirilmiş Gereksinim Listesi (Product Backlog vb.)',
        checklist: [
          { id: 'c4_3_1', text: "MoSCoW (Must/Should/Could/Won't), Kano Modeli veya Oylamayla Önceliklendirme tekniklerinden birini kullanın." },
          { id: 'c4_3_2', text: 'Önceliklendirme kararlarını paydaşlarla birlikte, şeffaf bir şekilde yapın.' },
          { id: 'c4_3_3', text: "İş değeri düşük ama maliyeti yüksek \"Won't Have\" gereksinimlerini sürüm 1 dışında bırakın." }
        ],
        tips: '"Her şey öncelikli" diyenlerle çalışıyorsanız, onlara "Eğer sadece bir tane yapabilseydik hangisi olurdu?" sorusunu sorun.'
      },
      {
        id: 't4_4',
        name: 'Gereksinimleri Onaylama',
        purpose: 'Gereksinimin doğru ve eksiksiz tanımlandığını ve paydaşların bunu kabul ettiğini resmileştirmek.',
        deliverables: 'İmzalı Gereksinim Onay Belgesi (Sign-off Document)',
        checklist: [
          { id: 'c4_4_1', text: 'Gereksinimlerin "yeterince detaylı" ve "uygulanabilir" olduğundan emin olun.' },
          { id: 'c4_4_2', text: 'Onay almak istediğiniz gereksinim paketini ilgili paydaşlara gönderin.' },
          { id: 'c4_4_3', text: 'Resmi onayı (imza veya dijital onay) alın ve kaydedin. Bu, ilerleyen süreçlerdeki anlaşmazlıkları önler.' }
        ],
        tips: 'Onay almak, projenin en önemli risk azaltma adımlarından biridir. "Sözlü onay" çoğu zaman ileride "Ben öyle demedim" e dönüşür.'
      }
    ]
  },
  {
    id: 'ka5',
    title: 'Gereksinim Yaşam Döngüsü Yönetimi',
    description: 'Gereksinimlerin ve tasarımların doğrulanması, onaylanması ve iş hedeflerine uygunluğunun değerlendirilmesi.',
    icon: <Activity className="w-6 h-6 text-red-500" />,
    color: 'border-red-500/20 bg-red-500/10',
    headerColor: 'text-red-700',
    tasks: [
      {
        id: 't5_1',
        name: 'Gereksinimleri ve Tasarımları Doğrulama',
        purpose: 'Gereksinimlerin kalite kriterlerini (doğru, eksiksiz, tutarlı, test edilebilir) karşıladığını kontrol etmek.',
        deliverables: 'Gereksinim Kalite İnceleme Raporu',
        checklist: [
          { id: 'c5_1_1', text: 'Her gereksinimin açık, tek bir yoruma sahip (muğlak olmayan) olduğundan emin olun.' },
          { id: 'c5_1_2', text: 'Her gereksinimin en az bir test senaryosuyla test edilebilir olduğunu doğrulayın.' },
          { id: 'c5_1_3', text: 'Gereksinimler arasında çelişki veya çakışma olup olmadığını kontrol edin.' }
        ],
        tips: '"Sistem hızlı çalışmalıdır" gibi muğlak gereksinimler yazılırsa test edilemez. "Sistem, arama sonuçlarını 2 saniye altında getirmelidir" yazın.'
      },
      {
        id: 't5_2',
        name: 'Gereksinimleri ve Tasarımları Onaylama',
        purpose: 'Çözümün gerçekten iş değeri yaratıp yaratmayacağını ve doğru sorunu çözüp çözmediğini teyit etmek.',
        deliverables: 'Kullanıcı Kabul Testi (UAT) Sonuçları, Paydaş Kabul Belgesi',
        checklist: [
          { id: 'c5_2_1', text: 'Geliştirilen çözümü, gerçek kullanıcı senaryoları ile test eden bir UAT (Kullanıcı Kabul Testi) organize edin.' },
          { id: 'c5_2_2', text: 'Geri bildirimleri toplayın ve kritik hataları önceliklendirin.' },
          { id: 'c5_2_3', text: 'Tüm onay kriterleri karşılandığında resmi kabul belgesini imzalatın.' }
        ],
        tips: 'UAT\'ı geçmek, projenin teknik olarak "bitti" değil, iş hedeflerini gerçekten karşıladığı anlamına gelir. Bu iki kavramı birbirinden ayırın.'
      }
    ]
  },
  {
    id: 'ka6',
    title: 'Çözüm Değerlendirmesi',
    description: 'Uygulanan çözümün iş değerini ve kurumun değişim kapasitesini değerlendirme.',
    icon: <Info className="w-6 h-6 text-teal-500" />,
    color: 'border-teal-500/20 bg-teal-500/10',
    headerColor: 'text-teal-700',
    tasks: [
      {
        id: 't6_1',
        name: 'Çözüm Performansını Ölçme',
        purpose: 'Canlıya alınan çözümün gerçekten öngörülen iş değerini yaratıp yaratmadığını ölçmek.',
        deliverables: 'KPI (Anahtar Performans Göstergesi) Raporu, ROI Analizi',
        checklist: [
          { id: 'c6_1_1', text: 'Proje başında belirlenen iş hedeflerine ne kadar ulaşıldığını ölçen KPI\'ları tanımlayın.' },
          { id: 'c6_1_2', text: 'Çözümün canlıya alınmasından belirli bir süre (3-6 ay) sonra bu metrikleri ölçün.' },
          { id: 'c6_1_3', text: 'Sonuçları paydaşlarla paylaşın ve gerekiyorsa iyileştirme önerilerinde bulunun.' }
        ],
        tips: 'İş analizi, sistemin "canlıya alınmasıyla" bitmez. Asıl soru şudur: "Bu sistemi yaptık, ama değer yarattı mı?"'
      },
      {
        id: 't6_2',
        name: 'Kurumun Değişim Kapasitesini Değerlendirme',
        purpose: 'Kurumun yeni çözümü benimseyip benimseyemeyeceğini ve geçişin nasıl yönetileceğini planlamak.',
        deliverables: 'Değişim Yönetimi Planı, Eğitim İhtiyaç Analizi',
        checklist: [
          { id: 'c6_2_1', text: 'Çözümün etkilediği iş süreçlerini, rolleri ve yetkinlikleri belirleyin.' },
          { id: 'c6_2_2', text: 'Son kullanıcıların yeni sistemi kullanmak için ihtiyaç duyduğu eğitimleri planlayın.' },
          { id: 'c6_2_3', text: 'Değişime direnç gösterebilecek grupları belirleyip onlar için iletişim stratejisi geliştirin.' }
        ],
        tips: 'En mükemmel sistem bile, kullanıcılar onu sevmez veya nasıl kullanacaklarını bilmezlerse başarısız olur. Değişim yönetimi teknik kadar önemlidir.'
      }
    ]
  }
];

export default function App() {
  // --- File System Access API helpers (Obsidian vault style) ---
  const [vaultHandle, setVaultHandle] = useState(null);
  const [vaultReady, setVaultReady] = useState(false);

  const openVault = async () => {
    try {
      const handle = await window.showDirectoryPicker({ mode: 'readwrite', startIn: 'documents' });
      setVaultHandle(handle);
      localStorage.setItem('babok_vault_name', handle.name);
      return handle;
    } catch { return null; }
  };

  const writeProjectFile = async (handle, project) => {
    if (!handle) return;
    try {
      const safeName = project.name.replace(/[^a-zA-Z0-9çÇğĞıİöÖşŞüÜ _-]/g, '_');
      const fileName = `${safeName}.babok.json`;
      const fileHandle = await handle.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(project, null, 2));
      await writable.close();
    } catch (err) { console.warn('Dosya yazılamadı:', err); }
  };

  const readAllProjectFiles = async (handle) => {
    if (!handle) return [];
    const projects = [];
    try {
      for await (const entry of handle.values()) {
        if (entry.kind === 'file' && entry.name.endsWith('.babok.json')) {
          try {
            const file = await entry.getFile();
            const text = await file.text();
            const data = JSON.parse(text);
            if (data && data.name) projects.push({ ...DEFAULT_PROJECT, ...data });
          } catch { /* skip invalid files */ }
        }
      }
    } catch (err) { console.warn('Vault okunamadı:', err); }
    return projects;
  };

  const deleteProjectFile = async (handle, project) => {
    if (!handle) return;
    try {
      const safeName = project.name.replace(/[^a-zA-Z0-9çÇğĞıİöÖşŞüÜ _-]/g, '_');
      const fileName = `${safeName}.babok.json`;
      await handle.removeEntry(fileName);
    } catch { /* file may not exist */ }
  };

  // --- Multi-Project Management ---
  const [projects, setProjects] = useState(() => {
    try {
      const sv = localStorage.getItem('babok_v2_projects');
      if (sv) return JSON.parse(sv);
      return [{
        ...DEFAULT_PROJECT,
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
  const [riskForm, setRiskForm] = useState({ title: '', category: '', probability: 2, impact: 2, owner: '', mitigation: '', status: 'Açık', linkedRequirementId: '', linkedAssumptionId: '', affectedStakeholderId: '', triggerDescription: '' });

  // Assumption states
  const [showAssumptionModal, setShowAssumptionModal] = useState(false);
  const [editingAssumption, setEditingAssumption] = useState(null);
  const [assumptionForm, setAssumptionForm] = useState({ title: '', content: '', type: 'Varsayim', category: 'Is', ownerId: '', validationStatus: 'Dogrulanmadi', validationDate: '', linkedRequirements: '', linkedRisks: '', notes: '' });

  // Action states
  const [showActionModal, setShowActionModal] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [actionForm, setActionForm] = useState({ title: '', owner: '', dueDate: '', status: 'Bekliyor', source: '', notes: '', linkedRequirementId: '' });

  // Stakeholder states
  const [showStakeholderModal, setShowStakeholderModal] = useState(false);
  const [editingStakeholder, setEditingStakeholder] = useState(null);
  const [stakeholderForm, setStakeholderForm] = useState({ name: '', role: '', department: '', interest: 2, influence: 2, raci: 'I', notes: '' });

  // Business Rule states
  const [showBRModal, setShowBRModal] = useState(false);
  const [editingBR, setEditingBR] = useState(null);
  const [brForm, setBrForm] = useState({ title: '', ruleText: '', category: 'Surec', source: 'Sirket Politikasi', sourceRef: '', version: 'v1.0', status: 'Aktif', linkedRequirements: '', linkedStakeholderId: '', notes: '' });

  // Change Request states
  const [showCRModal, setShowCRModal] = useState(false);
  const [editingCR, setEditingCR] = useState(null);
  const [crForm, setCrForm] = useState({ title: '', changeType: 'Yeni Ekleme', affectedEntityType: 'Gereksinim', affectedEntityId: '', changeDescription: '', businessDriver: '', requestingStakeholderId: '', impactAnalysis: '', linkedMeetingId: '', status: 'Bekliyor', decisionDate: '', decisionNote: '' });

  // Requirement states
  const [showReqModal, setShowReqModal] = useState(false);
  const [editingReq, setEditingReq] = useState(null);
  const [reqForm, setReqForm] = useState({ name: '', objective: '', module: '', status: 'Taslak', testId: '', notes: '', moscow: '', requirementType: '', sourceMeetingId: '', acceptanceCriteria: '', approvalStatus: 'Taslak', approvedById: '', babokKnowledgeArea: '' });
  const [reqFilter, setReqFilter] = useState('all');

  // Meeting states
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [meetingForm, setMeetingForm] = useState({ topic: '', attendees: '', date: new Date().toISOString().split('T')[0] });
  const [newNoteType, setNewNoteType] = useState('Karar');
  const [newNoteText, setNewNoteText] = useState('');

  // Gantt states
  const [showGanttModal, setShowGanttModal] = useState(false);
  const [editingGanttTask, setEditingGanttTask] = useState(null);
  const [ganttForm, setGanttForm] = useState({ name: '', startDate: '', endDate: '', color: '#3b82f6', category: '', assignedTo: '', progress: 0, delayReason: '' });
  const [showDashboardDetail, setShowDashboardDetail] = useState(null);
  const [focusedStakeholderId, setFocusedStakeholderId] = useState(null);
  const [ganttZoom, setGanttZoom] = useState('month');
  const [showBackupMenu, setShowBackupMenu] = useState(false);

  // Dark mode
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('babok_darkMode') === 'true');
  useEffect(() => { localStorage.setItem('babok_darkMode', String(darkMode)); }, [darkMode]);

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

  // Save all project data to localStorage + vault file system
  useEffect(() => {
    localStorage.setItem('babok_v2_projects', JSON.stringify(projects));
    localStorage.setItem('babok_v2_activeProjectId', activeProjectId);
    // Auto-save to vault if connected
    if (vaultHandle && vaultReady) {
      const proj = projects.find(p => p.id === activeProjectId);
      if (proj) writeProjectFile(vaultHandle, proj);
    }
  }, [projects, activeProjectId]);

  // Save ALL projects to vault when vault changes
  useEffect(() => {
    if (vaultHandle && vaultReady) {
      projects.forEach(p => writeProjectFile(vaultHandle, p));
    }
  }, [vaultHandle, vaultReady]);

  // Computed totals
  const totalTasks = babokData.reduce((acc, ka) => acc + ka.tasks.length, 0);
  const totalSubTasks = babokData.reduce((acc, ka) => acc + ka.tasks.reduce((a, t) => a + t.checklist.length, 0), 0);
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
  const openRiskModal = (risk = null) => { setEditingRisk(risk); setRiskForm(risk ? { linkedRequirementId: '', linkedAssumptionId: '', affectedStakeholderId: '', triggerDescription: '', ...risk } : { title: '', category: '', probability: 2, impact: 2, owner: '', mitigation: '', status: 'Açık', linkedRequirementId: '', linkedAssumptionId: '', affectedStakeholderId: '', triggerDescription: '' }); setShowRiskModal(true); };
  const saveRisk = () => {
    if (!riskForm.title.trim()) return;
    updateActive(p => ({ ...p, risks: editingRisk ? p.risks.map(r => r.id === editingRisk.id ? { ...riskForm, id: editingRisk.id } : r) : [...p.risks, { ...riskForm, id: generateId() }] }));
    setShowRiskModal(false);
  };
  const deleteRisk = (id) => { if (window.confirm('Riski silmek istiyor musunuz?')) updateActive(p => ({ ...p, risks: p.risks.filter(r => r.id !== id) })); };

  // --- ASSUMPTION ---
  const openAssumptionModal = (item = null) => { setEditingAssumption(item); setAssumptionForm(item || { title: '', content: '', type: 'Varsayim', category: 'Is', ownerId: '', validationStatus: 'Dogrulanmadi', validationDate: '', linkedRequirements: '', linkedRisks: '', notes: '' }); setShowAssumptionModal(true); };
  const saveAssumption = () => {
    if (!assumptionForm.title.trim() || !assumptionForm.content.trim()) return;
    updateActive(p => ({ ...p, assumptions: editingAssumption ? p.assumptions.map(a => a.id === editingAssumption.id ? { ...assumptionForm, id: editingAssumption.id } : a) : [...(p.assumptions || []), { ...assumptionForm, id: generateId() }] }));
    setShowAssumptionModal(false);
  };
  const deleteAssumption = (id) => { if (window.confirm('Varsayimi silmek istiyor musunuz?')) updateActive(p => ({ ...p, assumptions: p.assumptions.filter(a => a.id !== id) })); };

  // --- ACTION ---
  const openActionModal = (action = null) => { setEditingAction(action); setActionForm(action ? { linkedRequirementId: '', sourceMeetingId: '', ...action, notes: action.notes || '' } : { title: '', owner: '', dueDate: '', status: 'Bekliyor', source: '', notes: '', linkedRequirementId: '', sourceMeetingId: '' }); setShowActionModal(true); };
  const quickUpdateActionStatus = (actionId, newStatus) => { updateActive(p => ({ ...p, actions: p.actions.map(a => a.id === actionId ? { ...a, status: newStatus } : a) })); };
  const saveAction = () => {
    if (!actionForm.title.trim()) return;
    updateActive(p => ({ ...p, actions: editingAction ? p.actions.map(a => a.id === editingAction.id ? { ...actionForm, id: editingAction.id } : a) : [...p.actions, { ...actionForm, id: generateId() }] }));
    setShowActionModal(false);
  };
  const deleteAction = (id) => { if (window.confirm('Aksiyonu silmek istiyor musunuz?')) updateActive(p => ({ ...p, actions: p.actions.filter(a => a.id !== id) })); };

  // --- STAKEHOLDER ---
  const openStakeholderModal = (s = null) => { setEditingStakeholder(s); setStakeholderForm(s || { name: '', role: '', department: '', interest: 2, influence: 2, raci: 'I', notes: '' }); setShowStakeholderModal(true); };
  const saveStakeholder = () => {
    if (!stakeholderForm.name.trim()) return;
    updateActive(p => ({ ...p, stakeholders: editingStakeholder ? p.stakeholders.map(s => s.id === editingStakeholder.id ? { ...stakeholderForm, id: editingStakeholder.id } : s) : [...p.stakeholders, { ...stakeholderForm, id: generateId() }] }));
    setShowStakeholderModal(false);
  };
  const deleteStakeholder = (id) => { if (window.confirm('Paydaşı silmek istiyor musunuz?')) updateActive(p => ({ ...p, stakeholders: p.stakeholders.filter(s => s.id !== id) })); };

  // --- BUSINESS RULE ---
  const openBRModal = (item = null) => { setEditingBR(item); setBrForm(item ? { ...item } : { title: '', ruleText: '', category: 'Surec', source: 'Sirket Politikasi', sourceRef: '', version: 'v1.0', status: 'Aktif', linkedRequirements: '', linkedStakeholderId: '', notes: '' }); setShowBRModal(true); };
  const saveBR = () => {
    if (!brForm.title.trim() || !brForm.ruleText.trim()) return;
    updateActive(p => { const cnt = p.brCounter || 1; return { ...p, businessRules: editingBR ? p.businessRules.map(r => r.id === editingBR.id ? { ...brForm, id: editingBR.id, brId: editingBR.brId } : r) : [...(p.businessRules || []), { ...brForm, id: generateId(), brId: `BR-${String(cnt).padStart(3, '0')}` }], brCounter: editingBR ? cnt : cnt + 1 }; });
    setShowBRModal(false);
  };
  const deleteBR = (id) => { if (window.confirm('Is kuralini silmek istiyor musunuz?')) updateActive(p => ({ ...p, businessRules: p.businessRules.filter(r => r.id !== id) })); };

  // --- LINK CARD ---
  const [showLinkCard, setShowLinkCard] = useState(false);
  const [linkCardEntity, setLinkCardEntity] = useState(null);
  const openLinkCard = (type, id) => { setLinkCardEntity({ type, id }); setShowLinkCard(true); };
  const closeLinkCard = () => { setShowLinkCard(false); setLinkCardEntity(null); };

  // --- CHANGE REQUEST ---
  const openCRModal = (item = null) => { setEditingCR(item); setCrForm(item ? { ...item } : { title: '', changeType: 'Yeni Ekleme', affectedEntityType: 'Gereksinim', affectedEntityId: '', changeDescription: '', businessDriver: '', requestingStakeholderId: '', impactAnalysis: '', linkedMeetingId: '', status: 'Bekliyor', decisionDate: '', decisionNote: '' }); setShowCRModal(true); };
  const saveCR = () => {
    if (!crForm.title.trim() || !crForm.changeDescription.trim() || !crForm.businessDriver.trim()) return;
    updateActive(p => { const cnt = p.crCounter || 1; return { ...p, changeRequests: editingCR ? p.changeRequests.map(r => r.id === editingCR.id ? { ...crForm, id: editingCR.id, crId: editingCR.crId, createdAt: editingCR.createdAt } : r) : [...(p.changeRequests || []), { ...crForm, id: generateId(), crId: `CR-${String(cnt).padStart(3, '0')}`, createdAt: new Date().toISOString().split('T')[0] }], crCounter: editingCR ? cnt : cnt + 1 }; });
    setShowCRModal(false);
  };
  const deleteCR = (id) => { if (window.confirm('Degisiklik talebini silmek istiyor musunuz?')) updateActive(p => ({ ...p, changeRequests: p.changeRequests.filter(r => r.id !== id) })); };

  // --- REQUIREMENT ---
  const openReqModal = (r = null) => { setEditingReq(r); setReqForm(r ? { requirementType: '', sourceMeetingId: '', acceptanceCriteria: '', approvalStatus: 'Taslak', approvedById: '', babokKnowledgeArea: '', ...r, notes: r.notes || '', moscow: r.moscow || '' } : { name: '', objective: '', module: '', status: 'Taslak', testId: '', notes: '', moscow: '', requirementType: '', sourceMeetingId: '', acceptanceCriteria: '', approvalStatus: 'Taslak', approvedById: '', babokKnowledgeArea: '' }); setShowReqModal(true); };
  const saveReq = () => {
    if (!reqForm.name.trim()) return;
    updateActive(p => { const cnt = p.reqCounter || 1; return { ...p, requirements: editingReq ? p.requirements.map(r => r.id === editingReq.id ? { ...reqForm, id: editingReq.id, reqId: editingReq.reqId } : r) : [...p.requirements, { ...reqForm, id: generateId(), reqId: `REQ-${String(cnt).padStart(3, '0')}` }], reqCounter: editingReq ? cnt : cnt + 1 }; });
    setShowReqModal(false);
  };
  const deleteReq = (id) => { if (window.confirm('Gereksinimi silmek istiyor musunuz?')) updateActive(p => ({ ...p, requirements: p.requirements.filter(r => r.id !== id) })); };

  // --- MEETING ---
  const saveMeeting = () => {
    if (!meetingForm.topic.trim()) return;
    const nm = { ...meetingForm, id: generateId(), notes: [] };
    updateActive(p => ({ ...p, meetings: [...p.meetings, nm] }));
    setSelectedMeeting(nm); setShowMeetingModal(false);
  };
  const deleteMeeting = (id) => { if (window.confirm('Toplantıyı silmek istiyor musunuz?')) { updateActive(p => ({ ...p, meetings: p.meetings.filter(m => m.id !== id) })); if (selectedMeeting?.id === id) setSelectedMeeting(null); } };
  const addNote = () => {
    if (!newNoteText.trim() || !selectedMeeting) return;
    const note = { id: generateId(), type: newNoteType, text: newNoteText };
    const upd = { ...selectedMeeting, notes: [...selectedMeeting.notes, note] };
    if (newNoteType === 'Aksiyon') {
      const newAction = { id: generateId(), title: newNoteText, owner: '', dueDate: '', status: 'Bekliyor', source: selectedMeeting.topic, notes: '', linkedRequirementId: '' };
      updateActive(p => ({ ...p, meetings: p.meetings.map(m => m.id === selectedMeeting.id ? upd : m), actions: [...p.actions, newAction] }));
    } else if (newNoteType === 'Gereksinim') {
      const newReq = { id: generateId(), reqId: `REQ-${String(activeProject.reqCounter || 1).padStart(3, '0')}`, name: newNoteText, objective: '', module: '', status: 'Taslak', testId: '', moscow: '', notes: '', requirementType: '', acceptanceCriteria: '', sourceMeetingId: selectedMeeting.id, approvalStatus: 'Taslak', approvedById: '', babokKnowledgeArea: '' };
      updateActive(p => ({ ...p, meetings: p.meetings.map(m => m.id === selectedMeeting.id ? upd : m), requirements: [...p.requirements, newReq], reqCounter: (p.reqCounter || 1) + 1 }));
    } else if (newNoteType === 'Varsayim') {
      const newAss = { id: generateId(), title: newNoteText, content: '', type: 'Varsayim', category: 'Is', validationStatus: 'Dogrulanmadi', ownerId: '', linkedRequirements: [], linkedRisks: [], notes: '', sourceMeetingId: selectedMeeting.id };
      updateActive(p => ({ ...p, meetings: p.meetings.map(m => m.id === selectedMeeting.id ? upd : m), assumptions: [...(p.assumptions || []), newAss] }));
    } else {
      updateActive(p => ({ ...p, meetings: p.meetings.map(m => m.id === selectedMeeting.id ? upd : m) }));
    }
    setSelectedMeeting(upd); setNewNoteText('');
  };
  const generateLiveTemplate = (templateId) => {
    const reqs = activeProject.requirements || [];
    const stakeholders = activeProject.stakeholders || [];
    const meetings = activeProject.meetings || [];
    let text = '';
    if (templateId === 'tpl_raci') {
      const header = `| Paydas Adi / Departman | Projedeki Rolu | Ilgi | Etki | RACI Rolu |\n| :--- | :--- | :--- | :--- | :--- |`;
      const rows = stakeholders.length > 0
        ? stakeholders.map(s => `| ${s.name}${s.department ? ` (${s.department})` : ''} | ${s.role || '—'} | ${PROB_LABELS[s.interest] || '—'} | ${PROB_LABELS[s.influence] || '—'} | ${s.raci} — ${RACI_LABELS[s.raci]} |`).join('\n')
        : '| (Henüz paydas eklenmemis) | — | — | — | — |';
      text = `${header}\n${rows}`;
    } else if (templateId === 'tpl_mom') {
      const mtg = meetings[meetings.length - 1];
      if (!mtg) { alert('Henuz toplanti kaydedilmemis.'); return; }
      const lines = [`# Toplanti Tutanagi`, `**Konu:** ${mtg.topic}`, `**Tarih:** ${mtg.date}`, `**Katilimcilar:** ${mtg.attendees || '—'}`, ''];
      ['Karar', 'Açık Nokta', 'Aksiyon', 'Gereksinim', 'Varsayim'].forEach(type => {
        const it = mtg.notes.filter(n => n.type === type);
        if (it.length) { lines.push(`## ${type}lar`); it.forEach((n, i) => lines.push(`${i + 1}. ${n.text}`)); lines.push(''); }
      });
      text = lines.join('\n');
    } else if (templateId === 'tpl_tm') {
      const header = `| Req ID | Is Hedefi / Kapsam | Gereksinim Adi | Ilgili Modul | Test Senaryosu ID | Durum |\n| :--- | :--- | :--- | :--- | :--- | :--- |`;
      const rows = reqs.length > 0
        ? reqs.map(r => `| ${r.reqId} | ${r.objective || '—'} | ${r.name} | ${r.module || '—'} | ${r.testId || '—'} | ${r.status} |`).join('\n')
        : '| (Henüz gereksinim eklenmemis) | — | — | — | — | — |';
      text = `${header}\n${rows}`;
    } else {
      const tpl = templatesData.find(t => t.id === templateId);
      if (tpl) text = tpl.format;
    }
    navigator.clipboard.writeText(text);
    alert('Canli veri ile doldurulmus sablon panoya kopyalandi!');
  };

  const deleteNote = (nid) => { const upd = { ...selectedMeeting, notes: selectedMeeting.notes.filter(n => n.id !== nid) }; updateActive(p => ({ ...p, meetings: p.meetings.map(m => m.id === selectedMeeting.id ? upd : m) })); setSelectedMeeting(upd); };
  const generateMoM = (mtg) => {
    const lines = [`# Toplantı Tutanağı`, `**Konu:** ${mtg.topic}`, `**Tarih:** ${mtg.date}`, `**Katılımcılar:** ${mtg.attendees}`, ''];
    ['Karar', 'Açık Nokta', 'Aksiyon'].forEach(type => { const it = mtg.notes.filter(n => n.type === type); if (it.length) { lines.push(`## ${type}lar`); it.forEach((n, i) => lines.push(`${i + 1}. ${n.text}`)); lines.push(''); } });
    navigator.clipboard.writeText(lines.join('\n')); alert('MoM panoya kopylandı!');
  };

  // --- GANTT ---
  const openGanttModal = (task = null) => {
    setEditingGanttTask(task);
    const td = new Date().toISOString().split('T')[0];
    const nw = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    setGanttForm(task ? { name: task.name, startDate: task.startDate, endDate: task.endDate, color: task.color, category: task.category, assignedTo: task.assignedTo || '', progress: task.progress || 0, delayReason: task.delayReason || '' } : { name: '', startDate: td, endDate: nw, color: '#3b82f6', category: '', assignedTo: '', progress: 0, delayReason: '' });
    setShowGanttModal(true);
  };
  const saveGanttTask = () => {
    if (!ganttForm.name.trim() || !ganttForm.startDate || !ganttForm.endDate) return;
    if (new Date(ganttForm.endDate) < new Date(ganttForm.startDate)) { alert('Bitiş tarihi başlangıç tarihinden önce olamaz!'); return; }
    updateActive(p => ({
      ...p,
      ganttTasks: editingGanttTask
        ? (p.ganttTasks || []).map(t => t.id === editingGanttTask.id ? { ...ganttForm, id: editingGanttTask.id } : t)
        : [...(p.ganttTasks || []), { ...ganttForm, id: generateId() }]
    }));
    setShowGanttModal(false);
  };
  const deleteGanttTask = (id) => { if (window.confirm('Görevi silmek istiyor musunuz?')) updateActive(p => ({ ...p, ganttTasks: (p.ganttTasks || []).filter(t => t.id !== id) })); };

  // --- PROJECT MANAGEMENT ---
  const createProject = () => {
    if (!newProjectName.trim()) return;
    const np = { ...DEFAULT_PROJECT, id: generateId(), name: newProjectName };
    setProjects(prev => [...prev, np]);
    setActiveProjectId(np.id);
    if (vaultHandle) writeProjectFile(vaultHandle, np);
    setNewProjectName(''); setShowProjectModal(false);
  };
  const deleteProject = (id) => {
    if (projects.length <= 1) { alert('En az bir proje olmalıdır!'); return; }
    const proj = projects.find(p => p.id === id);
    const rem = projects.filter(p => p.id !== id);
    setProjects(rem);
    if (activeProjectId === id) setActiveProjectId(rem[0].id);
    if (vaultHandle && proj) deleteProjectFile(vaultHandle, proj);
  };
  const importProject = () => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (data && data.name) {
            const np = { ...DEFAULT_PROJECT, ...data, id: generateId() };
            setProjects(prev => [...prev, np]);
            setActiveProjectId(np.id);
            if (vaultHandle) writeProjectFile(vaultHandle, np);
            alert(`"${np.name}" projesi başarıyla içe aktarıldı!`);
          } else if (Array.isArray(data)) {
            data.forEach(d => { const np = { ...DEFAULT_PROJECT, ...d, id: generateId() }; setProjects(prev => [...prev, np]); if (vaultHandle) writeProjectFile(vaultHandle, np); });
            alert(`${data.length} proje başarıyla içe aktarıldı!`);
          } else { alert('Geçersiz proje dosyası formatı.'); }
        } catch { alert('Dosya okunamadı. Lütfen geçerli bir JSON dosyası seçin.'); }
      };
      reader.readAsText(file);
    };
    input.click();
  };
  const openVaultAndLoad = async () => {
    const handle = await openVault();
    if (!handle) return;
    const vaultProjects = await readAllProjectFiles(handle);
    if (vaultProjects.length > 0) {
      setProjects(vaultProjects);
      setActiveProjectId(vaultProjects[0].id);
      alert(`Vault açıldı! ${vaultProjects.length} proje yüklendi.`);
    } else {
      // No projects in vault, save current to vault
      alert('Vault bağlandı. Mevcut projeler vault klasörüne kaydedilecek.');
    }
    setVaultReady(true);
  };
  const saveAllToVault = async () => {
    let handle = vaultHandle;
    if (!handle) {
      handle = await openVault();
      if (!handle) return;
    }
    for (const p of projects) { await writeProjectFile(handle, p); }
    setVaultReady(true);
    alert(`${projects.length} proje vault klasörüne kaydedildi!`);
  };
  const exportProjectJSON = () => {
    const blob = new Blob([JSON.stringify(activeProject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${activeProject.name}_backup.json`; a.click(); URL.revokeObjectURL(url);
  };

  // --- EXPORT ---
  const exportMarkdown = () => {
    const report = generateBABOKReport(activeProject);
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${activeProject.name}_BABOK.md`; a.click();
    URL.revokeObjectURL(url);
  };

  // --- AI HELPER ---
  const handleRegenerateAI = () => { if (activeAiTask) { setAiResult(''); handleOpenAIModal(activeAiTask, ''); } };

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

Yukarıdaki "PROJE BAĞLAMI" dikkate alınarak, bu projeye TAMAMEN ÖZEL, farazi verilerle, örnek metriklerle, aktörlerle ve senaryolarla doldurulmuş bir "${task.deliverables}" raporu/çıktısı YAZ.
Kesinlikle genel geçer BABOK teorisi, tanımı veya "şunu yapmalısınız" gibi TAVSİYELER ANLATMA.
Doğrudan toplantıdan çıkmış bir iş analisti gibi, ekibe sunulmaya hazır DOKÜMANIN KENDİSİNİ ver.
Raporu okuyan kişi "${projectContext}" projesi için özel olarak yazıldığını %100 hissetmeli.
Başlıklar (##, ###), madde işaretleri (-) ve numaralandırmalar kullanarak okunması kolay, şık bir Markdown taslağı oluştur.
Yanıtın tamamı Türkçe olmalıdır.
`;
    const generatedText = await generateWithGemini(prompt);
    setAiResult(generatedText);
    setAiLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiResult);
    alert("Taslak panoya kopyalandı!");
  };

  // Tab definitions with icons
  const TAB_ITEMS = [
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
    { id: 'techniques', label: 'Teknikler', Icon: Wrench },
    { id: 'templates', label: 'Dokümanlar', Icon: FileStack },
    { id: 'competencies', label: 'Yetkinlikler', Icon: BrainCircuit },
    { id: 'export', label: 'Export', Icon: Download },
  ];

  // Ring Chart SVG component
  const RingChart = ({ progress, size = 160, stroke = 10 }) => {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (progress / 100) * circ;
    return (
      <div className="ring-chart">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#ringGrad)" strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }} />
          <defs><linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
        </svg>
        <div className="ring-chart-label">
          <span className="font-stat text-3xl font-bold neon-cyan">{progress}%</span>
          <span className="text-[10px] text-slate-400 mt-0.5">{activeProject.name}</span>
        </div>
      </div>
    );
  };

  // Mobile fab menu
  const [showFabMenu, setShowFabMenu] = useState(false);
  // Mobile all-modules drawer
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  // Export modal
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <div className={`aura-void min-h-screen font-sans ${darkMode ? 'theme-dark text-slate-200' : 'theme-light text-slate-800'}`}>
      {/* Void Background Beams */}
      <div className="void-beam void-beam-1" />
      <div className="void-beam void-beam-2" />
      <div className="void-beam void-beam-3" />

      {/* ===== FLOATING DOCK NAVIGATION (Desktop) ===== */}
      <nav className="aura-dock hidden lg:flex">
        {TAB_ITEMS.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => {
            if (id === 'export') { setShowExportModal(true); return; }
            setActiveTab(id); setShowDashboardDetail(null);
          }}
            className={`aura-dock-item ${activeTab === id ? 'active' : ''}`} title={label}>
            <Icon className="w-[18px] h-[18px]" />
            <span className="dock-label">{label}</span>
          </button>
        ))}
        <div className="w-6 h-px bg-slate-700/50 my-1" />
        <div className="relative">
          <button onClick={() => setShowBackupMenu(!showBackupMenu)} className="aura-dock-item" title="Yedekle">
            <Download className="w-[18px] h-[18px]" />
            <span className="dock-label">Yedekle</span>
          </button>
          {showBackupMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowBackupMenu(false)} />
              <div className="absolute left-full bottom-0 ml-2 glass-card rounded-xl shadow-2xl border border-white/10 py-2 px-1 min-w-[160px] z-50">
              <button onClick={() => { exportProjectJSON(); setShowBackupMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors">
                <Download className="w-4 h-4 text-cyan-400" />
                <span>JSON Yedek</span>
              </button>
              <button onClick={() => { setShowExportModal(true); setShowBackupMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors">
                <FileText className="w-4 h-4 text-violet-400" />
                <span>BABOK Raporu</span>
              </button>
              <div className="border-t border-white/10 my-1" />
              <button onClick={() => { saveAllToVault(); setShowBackupMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors">
                <FolderPlus className="w-4 h-4 text-amber-400" />
                <span>{vaultHandle ? 'Vault Senkronla' : 'Vault Bağla'}</span>
              </button>
              {vaultHandle && (
                <button onClick={async () => { const vp = await readAllProjectFiles(vaultHandle); if (vp.length > 0) { setProjects(vp); setActiveProjectId(vp[0].id); alert(`${vp.length} proje vault'dan yüklendi!`); } else alert('Vault klasöründe proje dosyası bulunamadı.'); setShowBackupMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Vault'dan Yükle</span>
                </button>
              )}
              </div>
            </>
          )}
        </div>
      </nav>

      {/* ===== MAIN CONTENT AREA ===== */}
      <div className="lg:ml-[78px] relative z-[1]">

        {/* Glass Header */}
        <header className="glass-panel sticky top-2 mx-3 lg:mx-5 mb-2 z-10">
          <div className="px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
            {/* Left: Project Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/10">
                  <Layers className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base font-bold text-white flex items-center gap-2">
                    <span>BABOK v3</span>
                    <span className="text-slate-400">·</span>
                    <span className="neon-cyan truncate max-w-[200px]">{activeProject.name}</span>
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <select value={activeProjectId} onChange={e => setActiveProjectId(e.target.value)}
                      className="text-xs rounded-lg px-2 py-0.5 max-w-[160px] border-none !bg-transparent !text-slate-400 focus:!text-slate-200 cursor-pointer">
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <button onClick={() => setShowProjectModal(true)} className="text-xs text-cyan-400/70 hover:text-cyan-300 transition-colors" title="Yeni Proje"><FolderPlus className="w-3.5 h-3.5" /></button>
                    <button onClick={importProject} className="text-xs text-emerald-400/70 hover:text-emerald-300 transition-colors" title="JSON İçe Aktar"><Upload className="w-3.5 h-3.5" /></button>
                    {vaultHandle ? (
                      <span className="text-[9px] text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded-full font-medium" title={`Vault: ${vaultHandle.name}`}>📂 Vault</span>
                    ) : (
                      <button onClick={openVaultAndLoad} className="text-xs text-amber-400/70 hover:text-amber-300 transition-colors" title="Vault Klasörü Bağla (Obsidian tarzı lokal dosya sistemi)"><FolderPlus className="w-3.5 h-3.5" /></button>
                    )}
                    {projects.length > 1 && (
                      <button onClick={() => { if (window.confirm(`"${activeProject.name}" projesini silmek istiyor musunuz?`)) deleteProject(activeProjectId); }} className="text-xs text-rose-400/60 hover:text-rose-400 transition-colors"><Trash2 className="w-3 h-3" /></button>
                    )}
                    <button onClick={() => setShowResetConfirm(true)} title="İlerlemeyi sıfırla" className="text-xs text-slate-400 hover:text-rose-400 transition-colors"><RotateCcw className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            </div>
            {/* Right: Theme Toggle + Progress Ring */}
            <div className="flex items-center gap-3">
              <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle" title={darkMode ? 'Açık Tema' : 'Koyu Tema'}>
                {darkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </button>
              <div className="hidden sm:flex flex-col items-end gap-0.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">İlerleme</span>
                <span className="text-xs text-slate-400">{completedTasks.length + completedSubTasks.length}/{totalTasks + totalSubTasks}</span>
              </div>
              <div className="relative w-14 h-14">
                <svg width={56} height={56} className="transform -rotate-90">
                  <circle cx={28} cy={28} r={22} fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth={5} />
                  <circle cx={28} cy={28} r={22} fill="none" stroke="url(#headerRingGrad)" strokeWidth={5}
                    strokeDasharray={138.23} strokeDashoffset={138.23 - (overallProgress / 100) * 138.23} strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }} />
                  <defs><linearGradient id="headerRingGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-stat text-sm font-bold neon-cyan">{overallProgress}%</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="px-3 lg:px-5 pb-20 lg:pb-3">

        <div className="flex-1 space-y-3 min-w-0 aura-content-enter">

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <DashboardTab
              activeProject={activeProject}
              babokData={babokData}
              completedTasks={completedTasks}
              completedSubTasks={completedSubTasks}
              totalTasks={totalTasks}
              totalSubTasks={totalSubTasks}
              overallProgress={overallProgress}
              setActiveTab={setActiveTab}
              setExpandedKA={setExpandedKA}
              RingChart={RingChart}
            />
          )}

          {/* ASSUMPTIONS & CONSTRAINTS TAB */}
          {activeTab === 'assumptions' && (
            <AssumptionsTab
              activeProject={activeProject}
              openAssumptionModal={openAssumptionModal}
              deleteAssumption={deleteAssumption}
            />
          )}

          {/* BUSINESS RULES TAB */}
          {activeTab === 'businessrules' && (
            <BusinessRulesTab
              activeProject={activeProject}
              openBRModal={openBRModal}
              deleteBR={deleteBR}
            />
          )}

          {/* CHANGE REQUESTS TAB */}
          {activeTab === 'changes' && (
            <ChangesTab
              activeProject={activeProject}
              openCRModal={openCRModal}
              deleteCR={deleteCR}
            />
          )}

          {/* RISK REGISTER TAB */}
          {activeTab === 'risks' && (
            <RisksTab
              activeProject={activeProject}
              openRiskModal={openRiskModal}
              deleteRisk={deleteRisk}
              openLinkCard={openLinkCard}
            />
          )}

          {/* ACTION TRACKER TAB */}
          {activeTab === 'actions' && (
            <ActionsTab
              activeProject={activeProject}
              openActionModal={openActionModal}
              deleteAction={deleteAction}
              quickUpdateActionStatus={quickUpdateActionStatus}
              updateActive={updateActive}
            />
          )}

          {/* STAKEHOLDER TAB */}
          {activeTab === 'stakeholders' && (
            <StakeholdersTab
              activeProject={activeProject}
              openStakeholderModal={openStakeholderModal}
              deleteStakeholder={deleteStakeholder}
              openLinkCard={openLinkCard}
              focusedStakeholderId={focusedStakeholderId}
              setFocusedStakeholderId={setFocusedStakeholderId}
            />
          )}

          {/* REQUIREMENTS TAB */}
          {activeTab === 'requirements' && (
            <RequirementsTab
              activeProject={activeProject}
              openReqModal={openReqModal}
              deleteReq={deleteReq}
              openLinkCard={openLinkCard}
              reqFilter={reqFilter}
              setReqFilter={setReqFilter}
            />
          )}

          {/* TRACEABILITY TAB */}
          {activeTab === 'traceability' && (
            <TraceabilityTab
              activeProject={activeProject}
              setActiveTab={setActiveTab}
            />
          )}

          {/* MEETINGS TAB */}
          {activeTab === 'meetings' && (
            <MeetingsTab
              activeProject={activeProject}
              selectedMeeting={selectedMeeting}
              setSelectedMeeting={setSelectedMeeting}
              setShowMeetingModal={setShowMeetingModal}
              deleteMeeting={deleteMeeting}
              newNoteType={newNoteType}
              setNewNoteType={setNewNoteType}
              newNoteText={newNoteText}
              setNewNoteText={setNewNoteText}
              addNote={addNote}
              deleteNote={deleteNote}
              generateMoM={generateMoM}
              setActiveTab={setActiveTab}
            />
          )}

          {/* GANTT CHART TAB */}
          {activeTab === 'gantt' && (
            <GanttTab
              activeProject={activeProject}
              openGanttModal={openGanttModal}
              deleteGanttTask={deleteGanttTask}
              ganttZoom={ganttZoom}
              setGanttZoom={setGanttZoom}
            />
          )}

          {/* KNOWLEDGE AREAS TAB */}
          {activeTab === 'knowledge_areas' && (
            <KnowledgeAreasTab
              babokData={babokData}
              completedTasks={completedTasks}
              completedSubTasks={completedSubTasks}
              expandedKA={expandedKA}
              setExpandedKA={setExpandedKA}
              selectedTask={selectedTask}
              handleTaskClick={handleTaskClick}
              toggleTask={toggleTask}
              toggleSubTask={toggleSubTask}
              markAllKA={markAllKA}
              projectContext={projectContext}
              setProjectContext={setProjectContext}
              isContextSaved={isContextSaved}
              setIsContextSaved={setIsContextSaved}
              handleOpenAIModal={handleOpenAIModal}
            />
          )}

          {/* TECHNIQUES TAB */}
          {activeTab === 'techniques' && (
            <TechniquesTab
              babokData={babokData}
              techFilter={techFilter}
              setTechFilter={setTechFilter}
            />
          )}

          {/* TEMPLATES TAB */}
          {activeTab === 'templates' && (
            <TemplatesTab
              generateLiveTemplate={generateLiveTemplate}
            />
          )}

          {/* COMPETENCIES TAB */}
          {activeTab === 'competencies' && (
            <CompetenciesTab />
          )}

        </div>
        </main>

        {/* ===== MODALS ===== */}

        {/* BUSINESS RULE MODAL */}
        {showBRModal && (
          <BusinessRuleModal
            form={brForm}
            setForm={setBrForm}
            onSave={saveBR}
            onClose={() => setShowBRModal(false)}
            editingBR={editingBR}
            activeProject={activeProject}
          />
        )}

        {/* CHANGE REQUEST MODAL */}
        {showCRModal && (
          <ChangeRequestModal
            form={crForm}
            setForm={setCrForm}
            onSave={saveCR}
            onClose={() => setShowCRModal(false)}
            editingCR={editingCR}
            activeProject={activeProject}
          />
        )}

        {/* RISK MODAL */}
        {showRiskModal && (
          <RiskModal
            form={riskForm}
            setForm={setRiskForm}
            onSave={saveRisk}
            onClose={() => setShowRiskModal(false)}
            editingRisk={editingRisk}
            activeProject={activeProject}
          />
        )}

        {/* ASSUMPTION MODAL */}
        {showAssumptionModal && (
          <AssumptionModal
            form={assumptionForm}
            setForm={setAssumptionForm}
            onSave={saveAssumption}
            onClose={() => setShowAssumptionModal(false)}
            editingAssumption={editingAssumption}
            activeProject={activeProject}
          />
        )}

        {/* ACTION MODAL */}
        {showActionModal && (
          <ActionModal
            form={actionForm}
            setForm={setActionForm}
            onSave={saveAction}
            onClose={() => setShowActionModal(false)}
            editingAction={editingAction}
            activeProject={activeProject}
          />
        )}

        {/* STAKEHOLDER MODAL */}
        {showStakeholderModal && (
          <StakeholderModal
            form={stakeholderForm}
            setForm={setStakeholderForm}
            onSave={saveStakeholder}
            onClose={() => setShowStakeholderModal(false)}
            editingStakeholder={editingStakeholder}
          />
        )}

        {/* REQUIREMENT MODAL */}
        {showReqModal && (
          <RequirementModal
            form={reqForm}
            setForm={setReqForm}
            onSave={saveReq}
            onClose={() => setShowReqModal(false)}
            editingReq={editingReq}
            babokData={babokData}
          />
        )}

        {/* LINK CARD MODAL */}
        {showLinkCard && linkCardEntity && (
          <LinkCardModal
            activeProject={activeProject}
            linkCardEntity={linkCardEntity}
            onClose={closeLinkCard}
          />
        )}

        {/* MEETING MODAL */}
        {showMeetingModal && (
          <MeetingModal
            form={meetingForm}
            setForm={setMeetingForm}
            onSave={saveMeeting}
            onClose={() => setShowMeetingModal(false)}
          />
        )}

        {/* GANTT TASK MODAL */}
        {showGanttModal && (
          <GanttModal
            form={ganttForm}
            setForm={setGanttForm}
            onSave={saveGanttTask}
            onClose={() => setShowGanttModal(false)}
            editingGanttTask={editingGanttTask}
          />
        )}

        {/* AI GENERATION MODAL */}
        {isAiModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel w-full shadow-2xl max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

              {/* Modal Header */}
              <div className="bg-indigo-600/80 p-4 flex justify-between items-center">
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
              <div className="p-6 overflow-y-auto flex-1 bg-white/5">
                {aiLoading ? (
                  <div className="flex flex-col items-center justify-center h-48 text-indigo-600">
                    <Loader2 className="w-10 h-10 animate-spin mb-4" />
                    <p className="font-medium">Proje bağlamınıza göre özel dokümanlar hazırlanıyor...</p>
                    <p className="text-sm text-slate-400 mt-2">Bu işlem birkaç saniye sürebilir.</p>
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20 overflow-x-auto">
                    <div
                      className="text-slate-300 leading-relaxed text-[15px]"
                      dangerouslySetInnerHTML={formatMarkdown(aiResult)}
                    />
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-white/5 border-t border-white/10 p-4 flex justify-end gap-3">
                <button
                  onClick={() => setIsAiModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-white/10 rounded-md transition-colors"
                >
                  Kapat
                </button>
                {!aiLoading && (
                  <button
                    onClick={handleRegenerateAI}
                    className="px-4 py-2 text-sm font-medium bg-white/5 text-slate-300 hover:bg-white/10 rounded-md transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Yeniden Üret
                  </button>
                )}
                {!aiLoading && (
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 text-sm font-medium bg-indigo-500/10 text-indigo-700 hover:bg-indigo-100 rounded-md transition-colors flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Kopyala
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* RESET CONFIRM MODAL */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel p-6 shadow-2xl max-w-sm w-full">
              <h3 className="font-bold text-lg text-slate-100 mb-2">İlerlemeyi Sıfırla</h3>
              <p className="text-sm text-slate-400 mb-5">Bu proje için tüm checklist ilerlemesi silinecek. Bu işlem geri alınamaz.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowResetConfirm(false)} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">İptal</button>
                <button onClick={resetProgress} className="px-4 py-2 text-sm bg-rose-600/80 hover:bg-rose-500 text-white rounded-md font-medium">Sıfırla</button>
              </div>
            </div>
          </div>
        )}

        {/* PROJECT CREATE MODAL */}
        {showProjectModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel p-6 shadow-2xl max-w-sm w-full">
              <h3 className="font-bold text-lg text-slate-100 mb-4 flex items-center gap-2"><FolderPlus className="text-cyan-400 w-5 h-5" />Yeni Proje Oluştur</h3>
              <input
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createProject()}
                placeholder="Proje adı*"
                className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300 mb-4"
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowProjectModal(false)} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">İptal</button>
                <button onClick={createProject} className="px-4 py-2 text-sm bg-cyan-600/80 hover:bg-cyan-500 text-white rounded-md font-medium">Oluştur</button>
              </div>
            </div>
          </div>
        )}

        {/* EXPORT MODAL */}
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          activeProject={activeProject}
        />

      </div>{/* end lg:ml-[78px] */}

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <nav className="aura-mobile-nav lg:hidden">
        {[TAB_ITEMS[0], TAB_ITEMS[5], TAB_ITEMS[6], TAB_ITEMS[8]].map(({ id, Icon }) => (
          <button key={id} onClick={() => { setActiveTab(id); setShowDashboardDetail(null); setShowFabMenu(false); setShowMobileMenu(false); }}
            className={`mobile-nav-item ${activeTab === id ? 'active' : ''}`}>
            <Icon className="w-5 h-5" />
          </button>
        ))}
        <button onClick={() => { setShowMobileMenu(true); setShowFabMenu(false); }} className="mobile-nav-item">
          <LayoutGrid className="w-5 h-5" />
        </button>
        <button onClick={() => setShowFabMenu(!showFabMenu)} className="aura-fab">
          {showFabMenu ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </button>
      </nav>

      {/* ===== MOBILE ALL-MODULES DRAWER ===== */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-60 lg:hidden flex flex-col justify-end" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative glass-panel rounded-t-2xl p-5 pb-8 shadow-2xl" style={{ maxHeight: '70vh' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-slate-300">Tüm Modüller</p>
              <button onClick={() => setShowMobileMenu(false)} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-4 gap-2 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 60px)' }}>
              {TAB_ITEMS.map(({ id, label, Icon }) => (
                <button key={id} onClick={() => {
                  setShowMobileMenu(false);
                  if (id === 'export') { setShowExportModal(true); return; }
                  setActiveTab(id); setShowDashboardDetail(null);
                }} className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl text-center transition-colors ${activeTab === id ? 'bg-cyan-500/15 text-cyan-400' : 'hover:bg-white/5 text-slate-400'}`}>
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAB Quick-Add Menu (Mobile) */}
      {showFabMenu && (
        <div className="fab-menu lg:hidden" onClick={() => setShowFabMenu(false)}>
          <div className="fab-menu-items" onClick={e => e.stopPropagation()}>
            <button className="fab-menu-item" onClick={() => { setShowFabMenu(false); setActiveTab('risks'); openRiskModal(); }}>
              <AlertTriangle className="w-6 h-6 text-rose-400" />Risk Ekle
            </button>
            <button className="fab-menu-item" onClick={() => { setShowFabMenu(false); setActiveTab('requirements'); openReqModal(); }}>
              <BookMarked className="w-6 h-6 text-cyan-400" />Gereksinim
            </button>
            <button className="fab-menu-item" onClick={() => { setShowFabMenu(false); setActiveTab('actions'); openActionModal(); }}>
              <ListChecks className="w-6 h-6 text-violet-400" />Aksiyon
            </button>
            <button className="fab-menu-item" onClick={() => { setShowFabMenu(false); setActiveTab('knowledge_areas'); setIsAiModalOpen(true); }}>
              <Sparkles className="w-6 h-6 text-amber-400" />AI'a Sor
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
