# TODOS — Teknik Borç

> Gstack `/review` denetiminden çıkan teknik borç listesi. 25 Nisan 2026.
> **Tüm maddeler tamamlandı — 25 Nisan 2026.**

---

## P2 — Kod Kalitesi (Refactor edilmeli)

### TD-01: `exportEngine.js` — Duplike sabit tanımlar
**Dosya:** `src/utils/exportEngine.js:4-7`

`PROB_LABELS` ve `RACI_LABELS` `constants/index.js`'den export edilmiş olmasına rağmen `exportEngine.js`'de lokal olarak yeniden tanımlanıyor. İki tanım arasında ileride tutarsızlık çıkabilir.

**Fix:** `exportEngine.js:4-7`'deki lokal sabitlerini sil, `constants/index.js`'den import et.

---

### TD-02: `totalTasks` / `totalSubTasks` duplik hesaplama
**Dosyalar:** `src/App.jsx:56-57` ve `src/tabs/DashboardTab.jsx:45-46`

`babokData.reduce(...)` hesabı her iki dosyada da bire bir aynı şekilde tekrar ediyor. `babokData` static veri olduğundan bu değerler bir kez hesaplanıp export edilebilir.

**Fix:** `src/data/babokData.jsx`'e `export const TOTAL_TASKS` ve `export const TOTAL_SUBTASKS` sabitleri ekle. Her iki dosyadaki inline `reduce` çağrısını bu sabitlerle değiştir.

---

### TD-03: `RingChart` bileşeni `App.jsx` içinde tanımlı
**Dosya:** `src/App.jsx:174-193`

`RingChart`, App'in render fonksiyonu içinde tanımlı (closure). Bu, her App render'ında React'ın yeni bir bileşen tipi oluşturmasına ve DashboardTab'i unmount/remount etmesine yol açar. Üstelik DashboardTab'e prop olarak geçiliyor, bu da gereksiz coupling.

**Fix:** `src/components/RingChart.jsx` olarak ayır, DashboardTab'e prop yerine doğrudan import ile kullan.

---

### TD-04: `window.confirm()` store katmanında çağrılıyor
**Dosya:** `src/store/projectStore.js` — 11 ayrı `delete*` fonksiyonu

Store, UI katmanına ait olan `window.confirm()` diyaloğunu doğrudan çağırıyor (`deleteRisk`, `deleteAssumption`, `deleteAction`, `deleteStakeholder`, `deleteBR`, `deleteCR`, `deleteReq`, `deleteGlossaryTerm`, `deleteMeeting`, `deleteGanttTask`). Store katmanı UI'dan bağımsız olmalı. Test edilemez ve native browser diyaloğu özelleştirilemiyor.

**Fix:** Store'dan `confirm()` çağrılarını kaldır; silme işlemini doğrudan gerçekleştir. Onay mantığını çağıran component katmanına taşı. (Örnek: `ResetConfirmModal` zaten bu pattern'i kullanıyor.)

---

### TD-05: `applyDocAnalysisResults` — 115 satır inline entity factory
**Dosya:** `src/store/projectStore.js:469-572`

Her entity tipi (req, risk, assumption, constraint, businessRule, stakeholder) inline olarak inline nesne literal'leriyle oluşturuluyor. Bu factory mantığı aynı zamanda `saveReq`, `saveRisk` vb. action'larla da duplike. İleride bir alana default değer eklenmesi durumunda iki yeri güncellemek gerekiyor.

**Fix:** `applyDocAnalysisResults` içindeki her entity tipini `buildReqFromAnalysis(r)`, `buildRiskFromAnalysis(r)` şeklinde pure factory fonksiyonlarına ayır. Bu fonksiyonlar `DEFAULT_REQ_FORM`, `DEFAULT_RISK_FORM` vb. sabitlerini spread edebildiği için default alanlar tek yerden yönetilir.

---

### TD-06: `addNote` fonksiyonu — 75 satır if/else cascade
**Dosya:** `src/store/projectStore.js:290-365`

4 farklı note tipini (Aksiyon, Gereksinim, Varsayim, diğer) tek bir büyük fonksiyonda if/else ile yönetiyor. Her branch, bir entity nesnesini inline olarak oluşturuyor.

**Fix:** Her branch için `createActionFromNote`, `createReqFromNote`, `createAssumptionFromNote` şeklinde küçük yardımcı fonksiyonlar çıkar. `addNote`'u bu fonksiyonları çağıran bir dispatcher'a dönüştür.

---

### TD-07: `addNote` — Aksiyon tipinde `sourceMeetingId` eksik
**Dosya:** `src/store/projectStore.js:299-311`

`noteType === 'Aksiyon'` branch'i yeni bir action oluştururken `sourceMeetingId: meetingId` alanını set etmiyor. Oysa `'Gereksinim'` (satır 328) ve `'Varsayim'` (satır 352) branch'leri bu alanı doğru şekilde set ediyor. Bu nedenle toplantıdan doğan aksiyonlar izlenebilirlik matrisinde toplantılarıyla ilişkilendirilemiyor.

**Fix:** `projectStore.js:305`'teki `newAction` objesine `sourceMeetingId: meetingId` alanını ekle.

---

### TD-08: Vault fonksiyonları `App.jsx` içinde tanımlı
**Dosya:** `src/App.jsx:61-104`

`openVault`, `writeProjectFile`, `readAllProjectFiles`, `deleteProjectFile` — 4 adet File System API fonksiyonu doğrudan App bileşeni içinde tanımlı. Bu fonksiyonlar React'tan bağımsız, pure async utility. App 422 satır uzunluğuna bu yüzden ulaşıyor.

**Fix:** `src/utils/vaultStorage.js` dosyası oluştur, bu 4 fonksiyonu oraya taşı. App'ten import et.

---

### TD-09: `KnowledgeAreasTab` prop olarak `babokData` alıyor, diğer tab'lar direkt import ediyor
**Dosyalar:** `src/App.jsx:345`, `src/tabs/KnowledgeAreasTab.jsx:11`

Tüm tab'lar `babokData`'yı doğrudan import ediyor (`DashboardTab`, `RequirementModal`). Yalnızca `KnowledgeAreasTab` bu veriyi App'ten prop olarak alıyor. Tutarsız bir pattern. Veri static olduğundan prop geçmek gereksiz.

**Fix:** `KnowledgeAreasTab.jsx`'te `babokData`'yı import et, `{ babokData }` prop'unu kaldır. App'teki `<KnowledgeAreasTab babokData={babokData} />` çağrısını `<KnowledgeAreasTab />` olarak güncelle.

---

## P3 — Düşük Öncelik (İmkan bulundukça)

### TD-10: `exportEngine.js:379` — Production'da `console.log` var
**Dosya:** `src/utils/exportEngine.js:379`

```js
console.log(`[exportEngine] Rapor üretildi: ${report.length} karakter, ${project?.name || '—'}`);
```

Kullanıcının console'unda görünüyor. Kaldırılmalı.

**Fix:** Satırı sil.

---

### TD-11: `.gitignore`'da `.claude/` üç kez tekrar ediyor
**Dosya:** `.gitignore`

`.claude/` girişi üç kez listelenmiş. Zararsız ama gürültü.

**Fix:** `.gitignore`'dan fazladan iki `.claude/` girişini temizle.

---

## Özet

| Öncelik | Adet | En Yüksek Etki |
|---------|------|----------------|
| P2 | 9 | TD-07 (veri bütünlüğü — aksiyon izlenebilirliği) |
| P3 | 2 | TD-10 (console.log) |

**Hemen yapılması önerilen:** TD-07 — toplantıdan açılan aksiyonların izlenebilirliği kırık, 2 satırlık fix.
