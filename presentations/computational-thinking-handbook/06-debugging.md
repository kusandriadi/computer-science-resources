---
marp: true
theme: default
paginate: true
header: 'Buku Panduan Computational Thinking'
footer: 'cs.kusandriadi.com'
---

# Debugging 🐛🔧
### Mencari dan Memperbaiki Kesalahan!

> Semua orang pasti pernah salah — yang penting tahu cara memperbaikinya!

---

# Apa yang Akan Kita Pelajari

- Apa itu **Debugging** dan asal-usul namanya
- Proses debugging langkah demi langkah
- Jenis-jenis bug yang umum
- Pola pikir seorang debugger
- Aktivitas seru: Berburu Bug! 🔍

---

# Apa Itu Debugging? 🐛

> **Debugging** = menemukan apa yang salah dan memperbaikinya

**Cerita seru:**
Tahun 1947, komputer di Universitas Harvard berhenti bekerja.
Para insinyur cek ke dalam mesin dan menemukan...
**seekor ngengat (moth) sungguhan** tersangkut di sirkuit!

Mereka tulis: "Kasus pertama bug sungguhan ditemukan!"

Sejak itu:
- Kesalahan = **bug** (serangga) 🐛
- Memperbaikinya = **debugging**

---

# Kenapa Debugging Itu Penting? 💡

Kuenya kempes dan hambar. Dua pilihan:

| Pilihan | Hasil |
|---|---|
| ❌ Menyerah: "Aku payah bikin kue" | Nggak belajar apa-apa 😢 |
| ✅ Debug: lihat apa yang salah, perbaiki | Jadi lebih jago! 💪 |

Debugging mengajarkan:
- **Kesabaran** — pelan-pelan cari masalahnya
- **Perhatian detail** — periksa setiap langkah
- **Percaya diri** — kamu BISA perbaiki!
- **Belajar** — setiap bug = pelajaran baru

---

# Contoh: Resep yang Gagal 🧁

Kue keringnya ASIN BANGET! Yuk debug:

**Langkah 1: Apa yang terjadi?**
Kuenya terlalu asin 🧂

**Langkah 2: Periksa setiap bahan**
Tepung ✅ | Gula ✅ | Garam... hmm 🤔

**Langkah 3: Ketemu bug-nya!**
Resep bilang 1 sendok **teh** — aku pakai 1 sendok **makan**! (3x lebih besar!)

**Langkah 4: Perbaiki!**
Lain kali pakai sendok TEH, bukan sendok MAKAN ✅

---

# Proses Debugging 🔍

### 5 langkah untuk debug apa saja:

| Langkah | Aksi | Contoh |
|---|---|---|
| 1️⃣ | **Sadari masalahnya** | "Pesawat kertasku terus jatuh" |
| 2️⃣ | **Periksa setiap langkah** | "Apakah sayapnya rata?" |
| 3️⃣ | **Temukan bug-nya** | "Satu sayap lebih besar!" |
| 4️⃣ | **Perbaiki** | Lipat ulang supaya sama |
| 5️⃣ | **Tes lagi** | Terbangkan — terbang lurus! ✈️ |

---

# Jenis-Jenis Bug yang Umum 🐛

### 1. Urutan Salah
❌ Pakai sepatu → pakai kaus kaki
✅ Kaus kaki dulu, BARU sepatu!

### 2. Langkah yang Hilang
❌ Sikat gigi tanpa pasta gigi!

### 3. Nilai yang Salah
❌ Limun terlalu manis — 5 sendok gula bukan 2!

### 4. Kesalahan Logika
❌ Bawa baju renang hari Kamis — kelas renang hari RABU!

### 5. Kesalahan Salin
❌ Telepon 555-1243 bukan 555-1234 — angka tertukar!

---

# Contoh: Debug Sepeda 🚲

Sepedamu nggak mau maju saat dikayuh. Yuk debug!

```
Cek rantai → di gir? YA ✅
Cek pedal → berputar? YA ✅
Cek roda belakang → berputar? TIDAK! ❌
Cek rem → menekan roda? YA! 🎯
```

**Ketemu bug-nya!** Kabel rem macet dalam posisi aktif!
**Perbaiki:** Lepaskan kabel rem → roda berputar → bisa jalan! 🎉

> Periksa satu per satu sampai ketemu masalahnya!

---

# Pola Pikir Debugging 🧠

Debugger yang baik berpikir begini:

1. 💭 **"Kesalahan itu biasa"**
   Semua orang salah — itu cuma kesempatan belajar!

2. 💪 **"Aku bisa cari tahu"**
   Tarik napas, mulai periksa langkah demi langkah

3. 🕵️ **"Aku jadi detektif"**
   Bug adalah pelaku — aku yang akan menemukannya!

4. ☝️ **"Satu hal dalam satu waktu"**
   Ubah satu, tes. Masih rusak? Ubah berikutnya.

5. 🤝 **"Minta tolong kalau mentok"**
   Mata segar bisa lihat yang kamu lewatkan!

---

# Kisah Debugging Terkenal 🚀

### Mars Climate Orbiter (1999) — NASA
Pesawat luar angkasa jatuh di Mars!
**Bug:** Satu tim pakai **mil**, tim lain pakai **kilometer**
Satu kesalahan unit kecil → satu tabrakan besar! 💥

### Bug Milenium Y2K (2000)
Komputer simpan tahun cuma 2 digit: "99" = 1999
Tahun 2000 → komputer kira tahun **1900**!
Ribuan programmer kerja keras perbaiki sebelum tengah malam 🕛

> Para ahli pun buat bug — yang penting temukan dan perbaiki!

---

# Aktivitas: Temukan Bug di Instruksi! 🔍

**Berburu Bug 1: Susu Cokelat** 🥛
1. Ambil gelas → 2. Tuang susu → 3. **Minum** → 4. Tambah sirup cokelat
**Bug:** Langkah 3 dan 4 terbalik! Tambah sirup DULU baru minum!

**Berburu Bug 2: Menanam Biji** 🌱
1. **Masukkan biji** → 2. Gali lubang → 3. Siram → 4. Tutup tanah
**Bug:** Gali lubang DULU baru masukkan biji!

> Temukan semua bug dan tulis perbaikannya!

---

# Aktivitas: Tantangan Berburu Bug Terhebat! 🏆

**Pagi Hari Ravi yang Penuh Bug:**

> Ravi bangun jam 7 di hari **Sabtu** dan bersiap ke **sekolah**.
> Dia pakai **seragam**, sarapan **semangkuk makan malam**.
> Pakai **sandal** keluar ke **salju**.
> Belok **kanan** padahal sekolah di **kiri**.
> Gerbang sekolah **terkunci**. Tidak ada yang datang.

**Berapa bug yang bisa kamu temukan?** (Minimal 6!) 🐛🐛🐛🐛🐛🐛

---

# Kuis Singkat! 🧩

**1.** Apa itu debugging?
- **B) Mencari dan memperbaiki kesalahan** ✅

**2.** Langkah PERTAMA debugging?
- **C) Sadari dan jelaskan apa yang salah** ✅

**3.** "Ambil roti → Taruh keju → Ambil keju" — jenis bug apa?
- **B) Urutan salah** ✅ (ambil keju DULU baru taruh!)

---

# Ingat! 🌟

- **Debugging** = temukan yang salah dan perbaiki
- Proses: **Sadari** → **Periksa** → **Temukan** → **Perbaiki** → **Tes lagi**
- Jenis bug: urutan salah, langkah hilang, nilai salah, logika salah, salin salah
- Pola pikir: kesalahan biasa, jadi detektif, satu hal per waktu

> **Semua orang bikin kesalahan — debugger HEBAT yang bisa memperbaikinya!** 🦸
