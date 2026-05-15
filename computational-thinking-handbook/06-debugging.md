# Modul 06: Debugging — Mencari dan Memperbaiki Kesalahan

## Apa Itu Debugging?

Semua orang membuat kesalahan. SEMUA ORANG. Gurumu, orang tuamu, ilmuwan terkenal, koki kelas dunia — mereka semua membuat kesalahan. Yang penting bukan jadi sempurna. Yang penting adalah **tahu cara mencari dan memperbaiki kesalahanmu**.

Di dunia pemecahan masalah, mencari dan memperbaiki kesalahan disebut **debugging** (mencari dan memperbaiki kesalahan).

> **Debugging = menemukan apa yang salah dan memperbaikinya.**

Tapi kenapa disebut "debugging"? Ini cerita serunya:

Dahulu kala (tahun 1947!), sebuah komputer di Universitas Harvard berhenti bekerja. Para insinyur melihat ke dalamnya dan menemukan masalahnya — serangga sungguhan! Seekor ngengat asli tersangkut di dalam mesin. Mereka mengeluarkan ngengat itu dan menulis di buku catatan mereka: "Kasus pertama bug (serangga) sungguhan yang ditemukan." Sejak saat itu, kesalahan dalam sistem disebut **bug** (serangga), dan memperbaikinya disebut **debugging**!

---

## Kenapa Debugging Itu Penting

Bayangkan kamu membuat kue, dan hasilnya kempes dan hambar. Kamu punya dua pilihan:

1. **Menyerah** dan bilang "Aku payah bikin kue."
2. **Debug** — lihat apa yang salah, perbaiki, dan coba lagi.

Pilihan 2 SELALU lebih baik! Debugging mengajarkanmu:

- **Kesabaran** — Luangkan waktu untuk menemukan masalahnya.
- **Perhatian terhadap detail** — Perhatikan setiap langkah dengan cermat.
- **Pemecahan masalah** — Cari tahu kenapa sesuatu terjadi dan cara memperbaikinya.
- **Percaya diri** — Kamu BISA memperbaiki sesuatu! Kesalahan bukan akhir dari segalanya.
- **Belajar** — Setiap bug yang kamu temukan mengajarkanmu sesuatu yang baru.

---

## Contoh dalam Kehidupan Sehari-hari

### Contoh 1: Gambar Cari Perbedaan

Kamu tahu teka-teki "cari perbedaannya" di majalah? Dua gambar terlihat hampir sama, tapi ada perbedaan kecil — kancing yang hilang, bunga warna berbeda, awan tambahan.

Menemukan perbedaan itu adalah debugging! Kamu memperhatikan sesuatu dengan cermat untuk menemukan apa yang salah.

### Contoh 2: Resep yang Gagal

Kamu mengikuti resep kue kering, tapi rasanya ASIN BANGET. Waktunya debug!

**Langkah 1: Apa yang terjadi?** Kuenya terlalu asin.

**Langkah 2: Periksa setiap bahan.** Tepung? Takarannya benar. Gula? Takarannya benar. Garam? Tunggu... resepnya bilang 1 sendok teh garam, tapi kamu pakai 1 SENDOK MAKAN. Sendok makan itu 3 kali lebih besar dari sendok teh!

**Langkah 3: Ketemu bug-nya!** Kamu kebanyakan garam.

**Langkah 4: Perbaiki!** Lain kali, pakai 1 sendok teh, bukan 1 sendok makan.

Itu debugging beraksi!

### Contoh 3: Mencari Kenapa Sepedamu Tidak Mau Jalan

Sepedamu tidak mau maju saat dikayuh. Yuk debug!

**Periksa rantainya:** Apakah rantai ada di gir? YA, ada.

**Periksa pedalnya:** Apakah pedal berputar? YA, berputar.

**Periksa rodanya:** Apakah roda belakang berputar? TIDAK! Tersangkut!

**Periksa remnya:** Apakah rem menekan roda? YA! Remnya macet dalam posisi "aktif"!

**Ketemu bug-nya!** Kabel rem macet.

**Perbaiki!** Lepaskan kabel rem. Sekarang roda berputar dan sepeda bisa jalan!

Kamu memeriksa satu per satu sampai menemukan masalahnya. Begitulah cara debugging bekerja.

---

## Proses Debugging

Ini cara debugging apa saja langkah demi langkah:

### Langkah 1: Sadari Masalahnya

Sesuatu tidak berjalan dengan benar. Jelaskan apa yang salah.
- "Pesawat kertasku terus jatuh."
- "Resepnya rasanya tidak enak."
- "Aku sudah ikuti petunjuknya tapi tersesat."

### Langkah 2: Periksa Setiap Langkah

Telusuri prosesnya langkah demi langkah. Periksa setiap bagian dengan cermat.
- "Apakah aku melipat sayapnya rata?"
- "Apakah aku pakai takaran yang benar untuk setiap bahan?"
- "Apakah aku belok kiri di tempat yang seharusnya?"

### Langkah 3: Temukan Bug-nya

Identifikasi persisnya apa yang salah.
- "Satu sayap lebih besar dari yang lain!"
- "Aku pakai soda kue, bukan baking powder!"
- "Aku belok KANAN, padahal seharusnya kiri!"

### Langkah 4: Perbaiki

Sekarang kamu tahu apa yang salah, perbaiki!
- Lipat ulang sayapnya supaya ukurannya sama.
- Pakai baking powder lain kali.
- Kembali dan belok kiri.

### Langkah 5: Tes Lagi

Coba lagi untuk memastikan perbaikannya berhasil.
- Terbangkan pesawatnya lagi. Apakah sekarang terbang lurus?
- Buat kue lagi. Apakah rasanya lebih enak?
- Ikuti petunjuknya lagi. Apakah kamu sampai di tempat yang benar?

---

## Jenis-Jenis Bug yang Umum

### 1. Urutan Salah

Kamu melakukan hal yang benar tapi urutannya salah.

**Bug:** "Aku pakai sepatu, lalu pakai kaus kaki."
**Perbaikan:** Kaus kaki dulu, BARU sepatu!

### 2. Langkah yang Hilang

Kamu lupa satu langkah.

**Bug:** "Aku sudah sikat gigi, tapi mulutku masih terasa tidak enak." Kamu lupa pakai pasta gigi!
**Perbaikan:** Tambahkan langkah pasta gigi.

### 3. Nilai yang Salah

Kamu menggunakan jumlah, angka, atau benda yang salah.

**Bug:** "Limunnya terlalu manis." Kamu menambahkan 5 sendok gula, bukan 2.
**Perbaikan:** Pakai 2 sendok gula lain kali.

### 4. Kesalahan Logika

Penalaranmu yang salah.

**Bug:** "Aku bawa baju renang ke sekolah karena hari Kamis." Tapi kelas renang hari RABU, bukan Kamis!
**Perbaikan:** Cek jadwalnya — renang hari Rabu.

### 5. Kesalahan Salin

Kamu menyalin sesuatu dengan salah.

**Bug:** Kamu menyalin nomor telepon 555-1234, tapi kamu menelepon 555-1243. Dua angka terakhir tertukar!
**Perbaikan:** Cek nomornya dengan cermat dan telepon lagi.

---

## Aktivitas 1: Temukan Bug di Instruksi Ini

**Yang kamu butuhkan:** Kertas dan pensil.

**Instruksi:** Setiap set langkah di bawah ini punya BUG. Temukan dan tulis perbaikannya!

**Berburu Bug 1: Membuat Segelas Susu Cokelat**
1. Ambil gelas.
2. Tuang susu ke dalam gelas.
3. Minum susu cokelatnya.
4. Tambahkan sirup cokelat dan aduk.

**Apa bug-nya?** ____________
**Bagaimana cara memperbaikinya?** ____________

**Berburu Bug 2: Menanam Biji**
1. Masukkan biji ke dalam lubang.
2. Gali lubang kecil di tanah.
3. Siram bijinya.
4. Tutup biji dengan tanah.

**Apa bug-nya?** ____________
**Bagaimana cara memperbaikinya?** ____________

**Berburu Bug 3: Mencuci Tangan**
1. Nyalakan air.
2. Taruh sabun di tangan.
3. Bilas tangan.
4. Keringkan tangan dengan handuk.

**Apa bug-nya?** ____________ (Petunjuk: langkah apa yang hilang antara 2 dan 3?)
**Bagaimana cara memperbaikinya?** ____________

**Berburu Bug 4: Menelepon**
1. Angkat telepon.
2. Tekan nomornya: 555-1234.
3. Bilang halo ke Nenek.
4. Tunggu seseorang mengangkat.

**Apa bug-nya?** ____________
**Bagaimana cara memperbaikinya?** ____________

**Berburu Bug 5: Bersiap Tidur**
1. Pakai piyama.
2. Naik ke tempat tidur.
3. Sikat gigi.
4. Matikan lampu.
5. Tidur.

**Apa bug-nya?** ____________
**Bagaimana cara memperbaikinya?** ____________

---

## Aktivitas 2: Perbaiki Resep yang Rusak

**Yang kamu butuhkan:** Kertas dan pensil.

**Ceritanya:** Temanmu mencoba membuat pancake pakai resep ini, tapi pancake-nya jadi BERANTAKAN. Bisakah kamu menemukan SEMUA bug-nya?

**Resep Pancake yang Bermasalah:**
1. Taruh wajan di atas kompor dan nyalakan api BESAR.
2. Tambahkan 10 gelas tepung ke dalam mangkuk. (Ini untuk 100 orang!)
3. Tambahkan 1 telur dan 1 gelas susu.
4. Tuang adonan ke wajan panas.
5. Tunggu 30 menit. (Itu kelamaan!)
6. Balik pancake-nya.
7. Tambahkan garam, bukan sirup, di atasnya.
8. Makan!

**Berapa bug yang bisa kamu temukan?** Coba temukan setidaknya 4!

Untuk setiap bug, tulis:
- Apa yang salah
- Seharusnya bagaimana

**Resep yang diperbaiki:**
Tulis versi yang benar dari resepnya.

---

## Aktivitas 3: Skenario "Apa yang Salah?"

**Yang kamu butuhkan:** Kertas dan pensil.

Baca setiap skenario dan cari tahu apa yang salah. Lalu sarankan perbaikannya.

**Skenario 1:**
Maya ingin memberikan kejutan kartu ulang tahun untuk temannya. Dia menulis kartu yang indah, memasukkannya ke amplop, menempelkan perangko, dan mengirimnya lewat pos. Tapi kartunya tidak pernah sampai!

Apa yang mungkin salah? (Pikirkan setidaknya 2 kemungkinan.)

**Skenario 2:**
Tom mengikuti resep kue kering cokelat chip. Dia memasukkan tepung, gula, telur, mentega, dan kismis. Tapi kue keringnya rasanya aneh — tidak ada rasa cokelat chip yang dia harapkan.

Apa yang salah?

**Skenario 3:**
Lina memberikan petunjuk jalan ke rumahnya lewat telepon. Dia bilang: "Belok kiri di lampu lalu lintas, jalan tiga blok, lalu belok kanan." Temannya mengikuti petunjuk tapi sampai di tempat yang salah.

Apa yang mungkin salah? (Pikirkan setidaknya 2 kemungkinan.)

**Skenario 4:**
Rudi membuat pesawat kertas dan melemparkannya. Alih-alih terbang lurus, pesawatnya berputar-putar dan langsung jatuh.

Apa yang mungkin salah? Apa yang harus Rudi periksa?

**Skenario 5:**
Sebuah kelas sedang bermain lomba estafet. Tim A selesai pertama tapi didiskualifikasi. Tidak ada di Tim A yang curang — mereka semua berlari secepat mungkin.

Apa yang mungkin salah?

---

## Aktivitas 4: Debug Instruksi Menggambar

**Yang kamu butuhkan:** Kertas, pensil, seorang teman.

**Cara bermain:**

1. Lihat instruksi ini untuk menggambar rumah sederhana:

```
Langkah 1: Gambar lingkaran di tengah kertas.
Langkah 2: Gambar segitiga di atas lingkaran untuk atap.
Langkah 3: Gambar pintu kecil di sisi kiri.
Langkah 4: Gambar jendela di atas atap.
Langkah 5: Gambar cerobong asap di bawah rumah.
```

2. Ikuti instruksi ini PERSIS dan lihat apa yang terjadi. Apakah terlihat seperti rumah?

3. Temukan bug-nya! Ada beberapa hal yang salah. Tulis setiap bug dan perbaikannya.

4. Tulis instruksi yang BENAR untuk menggambar rumah.

5. Berikan instruksi yang sudah diperbaiki ke teman. Bisakah mereka menggambar rumah yang bagus?

---

## Aktivitas 5: Permainan Detektif Debugging

**Yang kamu butuhkan:** 3 pemain atau lebih, ruangan kecil.

**Cara bermain:**

1. **Persiapan:** Satu pemain jadi Detektif dan keluar ruangan.

2. **Membuat bug:** Saat Detektif pergi, pemain lainnya mengubah 5 hal di ruangan. Contoh:
   - Pindahkan buku ke tempat lain
   - Balik gambar jadi terbalik
   - Pakai sepatu di kaki yang salah
   - Tukar tempat duduk dua orang
   - Tutup jendela yang tadinya terbuka

3. **Debugging:** Detektif kembali dan harus menemukan semua 5 perubahan.

4. Detektif dapat 1 poin untuk setiap "bug" yang ditemukan.

5. Bergantian jadi Detektif.

**Bikin lebih sulit:** Ubah 7 atau 10 hal, bukan cuma 5!

---

## Pola Pikir Debugging

Debugger yang baik berpikir berbeda. Ini pola pikir debugging:

### 1. "Kesalahan itu biasa."
Semua orang membuat kesalahan. Bahkan orang paling pintar di dunia pun membuat kesalahan. Kesalahan itu cuma kesempatan untuk belajar!

### 2. "Aku bisa cari tahu."
Jangan menyerah kalau ada yang salah. Tarik napas dalam-dalam dan mulai periksa langkah demi langkah.

### 3. "Aku jadi detektif."
Pura-pura jadi detektif yang memecahkan misteri. Bug-nya adalah pelakunya, dan kamu yang akan menemukannya!

### 4. "Aku periksa satu hal dalam satu waktu."
Jangan ubah semuanya sekaligus. Ubah satu hal, lalu tes. Kalau masih rusak, ubah hal berikutnya. Dengan cara ini, saat kamu menemukan perbaikannya, kamu tahu persis apa yang salah.

### 5. "Aku akan minta tolong kalau mentok."
Kadang mata segar bisa melihat apa yang kamu lewatkan. Minta tolong itu cerdas!

---

## Kisah Debugging Terkenal

Ini beberapa cerita nyata tentang debugging:

**Mars Climate Orbiter (1999):** NASA mengirim pesawat luar angkasa ke Mars, tapi pesawatnya jatuh! Bug-nya? Satu tim menggunakan mil dan tim lainnya menggunakan kilometer. Ketidakcocokan itu menyebabkan pesawat terbang terlalu dekat ke Mars dan terbakar. Satu kesalahan unit kecil — satu tabrakan besar!

**Bug Milenium (Y2K):** Sebelum tahun 2000, banyak komputer menyimpan tahun dengan hanya 2 digit (seperti "99" untuk 1999). Orang-orang khawatir bahwa saat tahun berganti ke 2000, komputer akan mengira tahunnya 1900! Ribuan programmer bekerja untuk memperbaiki bug ini sebelum tengah malam 31 Desember 1999.

**Pelajarannya:** Para ahli pun membuat bug. Yang penting adalah menemukannya dan memperbaikinya!

---

## Waktunya Kuis!

**Pertanyaan 1:** Apa itu debugging?
- A) Menambahkan bug ke program
- B) Mencari dan memperbaiki kesalahan
- C) Membasmi serangga dari kebun
- D) Memulai dari awal lagi

**Pertanyaan 2:** Apa langkah PERTAMA dalam debugging?
- A) Langsung perbaiki masalahnya
- B) Menyerah
- C) Sadari dan jelaskan apa yang salah
- D) Mulai dari awal

**Pertanyaan 3:** Kamu mencoba memanggang kue, tapi kuenya tidak mengembang. Mana langkah debugging yang TERBAIK?
- A) Buang kuenya dan jangan pernah memanggang lagi
- B) Periksa setiap bahan dan langkah untuk menemukan apa yang salah
- C) Tambahkan lebih banyak krim untuk menyembunyikan masalahnya
- D) Salahkan ovennya

**Pertanyaan 4:** Kamu menulis instruksi membuat sandwich: "Ambil roti. Taruh keju di roti. Ambil keju." Jenis bug apa ini?
- A) Langkah yang hilang
- B) Urutan salah
- C) Nilai yang salah
- D) Kesalahan logika

**Pertanyaan 5:** Kenapa penting untuk hanya mengubah SATU hal dalam satu waktu saat debugging?
Tulis jawabanmu dengan kata-katamu sendiri.

---

## Tantangan: Berburu Bug Terhebat

Siap untuk tantangan? Ini cerita yang PENUH bug. Berapa banyak yang bisa kamu temukan?

**Pagi Hari Ravi (Penuh Bug):**

Ravi bangun jam 7:00 pagi di hari Sabtu dan bersiap ke sekolah. Dia memakai seragam sekolah dan mengemasi tasnya dengan buku matematika dan buku IPA. Dia sarapan — semangkuk besar makan malam. Lalu dia memakai sandal dan berjalan keluar ke salju. Dia belok kanan padahal sekolahnya di sebelah kiri. Saat tiba di sekolah, gerbangnya terkunci. "Aneh," pikir Ravi. Dia menunggu 30 menit dan tidak ada yang datang.

**Berapa bug yang bisa kamu temukan?** (Ada setidaknya 6!)

Tulis setiap bug dan jelaskan apa yang seharusnya berbeda.

---

## Apa yang Sudah Kamu Pelajari

Kamu makin jago debugging! Di modul ini, kamu belajar bahwa:
- **Debugging** (mencari dan memperbaiki kesalahan) berarti menemukan dan memperbaiki kesalahan.
- Kata "bug" berasal dari ngengat sungguhan yang ditemukan di komputer tahun 1947!
- Proses debugging adalah: Sadari masalahnya, Periksa setiap langkah, Temukan bug-nya, Perbaiki, Tes lagi.
- Jenis-jenis bug yang umum meliputi: urutan salah, langkah yang hilang, nilai yang salah, kesalahan logika, dan kesalahan salin.
- Semua orang membuat kesalahan — yang penting adalah menemukannya dan memperbaikinya.
- Punya **pola pikir debugging** berarti tetap tenang, jadi detektif, dan periksa satu hal dalam satu waktu.

---

## Jawaban

**Pertanyaan 1:** B) Mencari dan memperbaiki kesalahan.

**Pertanyaan 2:** C) Sadari dan jelaskan apa yang salah.

**Pertanyaan 3:** B) Periksa setiap bahan dan langkah untuk menemukan apa yang salah.

**Pertanyaan 4:** B) Urutan salah. Kamu harus "ambil keju" sebelum bisa "taruh keju di roti."

**Pertanyaan 5:** Contoh jawaban: "Kalau kamu mengubah banyak hal sekaligus dan tiba-tiba berhasil, kamu tidak tahu perubahan mana yang benar-benar memperbaiki masalahnya. Dengan mengubah satu hal dalam satu waktu, kamu bisa tahu persis apa yang salah."

**Jawaban Aktivitas 1:**
- Berburu Bug 1: Langkah 3 dan 4 urutannya salah. Kamu harus menambahkan sirup cokelat dan mengaduk SEBELUM minum.
- Berburu Bug 2: Langkah 1 dan 2 urutannya salah. Kamu harus menggali lubang SEBELUM memasukkan biji.
- Berburu Bug 3: Langkah yang hilang — kamu harus menggosok tangan dengan sabun selama 20 detik antara langkah 2 dan 3.
- Berburu Bug 4: Langkah 3 dan 4 urutannya salah. Kamu harus menunggu seseorang mengangkat SEBELUM bilang halo.
- Berburu Bug 5: Langkah 3 (sikat gigi) seharusnya sebelum Langkah 1 (pakai piyama) atau setidaknya sebelum Langkah 2 (naik ke tempat tidur).

**Jawaban Berburu Bug Terhebat:**
1. Ini hari Sabtu — tidak ada sekolah!
2. Dia memakai seragam sekolah di akhir pekan.
3. Dia makan "semangkuk makan malam" untuk sarapan — seharusnya makanan sarapan (sereal, roti panggang, dll.).
4. Sandal di salju — sepatu yang salah untuk cuacanya.
5. Dia belok kanan, tapi sekolahnya di kiri — arah yang salah.
6. Gerbang sekolah terkunci — karena ini hari Sabtu!

---

[Sebelumnya: Modul 05 — Berpikir Logis](05-logical-thinking.md) | [Selanjutnya: Modul 07 — CT Sehari-hari](07-everyday-ct.md)
