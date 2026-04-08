import React from 'react';
import { Target, BookOpen, Users, RefreshCw, Activity, Info } from 'lucide-react';

// --- BABOK KNOWLEDGE AREAS AND DETAILED TASKS DATA ---
export const babokData = [
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
    description: 'Paydaşlardan, dokümanlardan veya sistemlerden bilgi toplama ve sürekli iletişimi sağlama süreci.',
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
    title: 'Gereksinim Analizi ve Tasarım Tanımlama',
    description: 'Ortaya çıkarılan karmaşık bilgileri yapılandırma, modelleme ve geliştiriciler için net gereksinimlere dönüştürme.',
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
    description: 'Projenin başlangıcından bitişine kadar gereksinimlerdeki değişimleri, onayları ve izlenebilirliği yönetme.',
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
    description: 'Geliştirilen çözümün gerçekten hedeflenen değeri yaratıp yaratmadığını ölçme.',
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
