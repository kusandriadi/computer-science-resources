# Modul 04: Algorithm Design — Membuat Instruksi Langkah demi Langkah

## Apa Itu Algorithm?

Ini kata yang seru: **algorithm** (baca: AL-go-rit-ma).

Kedengarannya canggih, tapi sebenarnya sangat sederhana:

> **Algoritma** atau **Algorithm** = kumpulan instruksi langkah demi langkah untuk menyelesaikan masalah atau menyelesaikan tugas.

Kamu mengikuti algorithm setiap hari! Resep masakan adalah algorithm untuk memasak. Petunjuk arah ke rumah teman adalah algorithm untuk sampai ke sana. Aturan permainan adalah algorithm untuk memainkannya.

Hal-hal penting tentang algorithm:
1. Punya **langkah-langkah yang jelas**.
2. Langkah-langkahnya dalam **urutan tertentu**.
3. Siapa pun yang mengikuti langkahnya mendapat **hasil yang sama**.

Itu saja! Kalau kamu bisa menulis langkah-langkah yang jelas dalam urutan yang benar, kamu bisa merancang algorithm.

---

## Kenapa Algorithm Design Itu Penting

Coba pikir — apa yang terjadi kalau resep nggak punya langkah? Kamu cuma punya setumpuk bahan dan nggak tahu mau diapakan.

Bagaimana kalau petunjuk ke sekolah nggak ada urutannya? "Belok kiri. Jalan dua blok. Belok kanan. Keluar dari pintu." Tunggu — bukannya "keluar dari pintu" harusnya yang PERTAMA?

Algorithm itu penting karena:

1. **Memastikan nggak ada yang terlupa.** Setiap langkah tertulis.
2. **Menjaga semuanya tetap berurutan.** Kamu melakukan hal yang benar di waktu yang benar.
3. **Siapa pun bisa mengikutinya.** Kamu nggak perlu jadi ahli — tinggal ikuti langkahnya!
4. **Bisa diulang.** Setiap kali kamu mengikuti algorithm yang sama, kamu dapat hasil yang sama.

---

## Contoh di Kehidupan Nyata

### Contoh 1: Resep Membuat Roti Isi Cokelat

Ini algorithm untuk membuat roti isi cokelat:

```
Langkah 1: Ambil dua lembar roti.
Langkah 2: Ambil toples selai cokelat dan toples mentega.
Langkah 3: Ambil pisau roti.
Langkah 4: Buka toples selai cokelat.
Langkah 5: Gunakan pisau untuk mengambil selai cokelat.
Langkah 6: Oleskan selai cokelat di satu lembar roti.
Langkah 7: Buka toples mentega.
Langkah 8: Gunakan pisau untuk mengambil mentega.
Langkah 9: Oleskan mentega di lembar roti yang lain.
Langkah 10: Tempelkan kedua lembar roti (sisi selai cokelat menghadap sisi mentega).
Langkah 11: Potong roti jadi dua kalau kamu mau.
Langkah 12: Makan dan nikmati!
```

Kalau siapa pun mengikuti langkah-langkah ini, mereka akan mendapat roti isi cokelat yang enak. Itulah algorithm!

### Contoh 2: Pergi dari Rumah ke Sekolah

```
Langkah 1: Keluar dari pintu depan.
Langkah 2: Belok kanan di trotoar.
Langkah 3: Jalan lurus tiga blok.
Langkah 4: Belok kiri di lampu merah.
Langkah 5: Jalan melewati toko roti dan toko buku.
Langkah 6: Menyeberang jalan di zebra cross.
Langkah 7: Sekolahnya gedung besar di sebelah kanan.
Langkah 8: Masuk lewat gerbang sekolah.
```

### Contoh 3: Aturan Permainan Sederhana (Kejar-kejaran)

```
Langkah 1: Pilih satu orang jadi "pengejar."
Langkah 2: Semua yang lain berlari menjauh.
Langkah 3: Si pengejar mengejar yang lainnya.
Langkah 4: Kalau pengejar menyentuh seseorang, orang itu jadi pengejar baru.
Langkah 5: Pengejar baru hitung sampai 5 sementara yang lain lari.
Langkah 6: Ulangi dari Langkah 3 sampai semua capek!
```

---

## Bahan-bahan Algorithm yang Bagus

Nggak semua algorithm itu sama bagusnya. Ini yang membuat algorithm jadi BAGUS:

### 1. Langkah yang Jelas

Setiap langkah harus begitu jelas sehingga siapa pun bisa memahaminya — bahkan seseorang yang belum pernah melakukan tugas itu sebelumnya.

**Langkah jelek:** "Masak makanannya."
**Langkah bagus:** "Masukkan dua sendok makan beras ke panci dan tambahkan air sampai air setinggi satu jari di atas beras."

### 2. Urutan yang Benar

Langkah-langkahnya harus dalam urutan yang benar. Kamu nggak bisa makan kue sebelum memanggang kuenya!

### 3. Nggak Ada yang Terlewat

Kalau kamu melewatkan satu langkah, algorithm-nya nggak akan berhasil. Bayangkan algorithm cuci tangan yang melewatkan "pakai sabun" — tanganmu nggak benar-benar bersih!

### 4. Awal dan Akhir yang Jelas

Setiap algorithm harus punya titik awal dan titik akhir. Kamu harus tahu kapan sudah selesai!

---

## Algorithm dengan Keputusan

Nah sekarang yang seru. Beberapa algorithm punya titik keputusan — tempat di mana kamu harus membuat pilihan. Kita pakai **JIKA-MAKA** untuk ini.

**Contoh: Berpakaian di pagi hari**

```
Langkah 1: Cek cuaca.
Langkah 2: JIKA cerah, MAKA pakai kaos dan celana pendek.
           JIKA hujan, MAKA pakai jaket dan bawa payung.
           JIKA dingin, MAKA pakai sweater dan celana panjang.
Langkah 3: Pakai kaus kaki.
Langkah 4: Pakai sepatu.
Langkah 5: JIKA mau ke sekolah, MAKA pakai seragam sekolah saja.
Langkah 6: Lihat cermin. Selesai!
```

Bagian JIKA-MAKA itu seperti persimpangan jalan — kamu ke satu arah atau arah lain tergantung apa yang benar.

**Contoh lain: Bermain di luar**

```
Langkah 1: Pergi ke luar.
Langkah 2: JIKA temanmu ada di sana, MAKA main bersama.
           JIKA temanmu nggak ada, MAKA main sendiri.
Langkah 3: JIKA kamu haus, MAKA masuk ke dalam dan minum air.
Langkah 4: JIKA mulai hujan, MAKA masuk ke dalam.
Langkah 5: JIKA sudah waktunya makan malam, MAKA pulang.
```

---

## Algorithm dengan Pengulangan (Loop)

Kadang-kadang algorithm perlu mengulangi satu langkah terus-menerus. Ini namanya **loop** (perulangan).

**Contoh: Makan semangkuk sereal**

```
Langkah 1: Tuang sereal ke mangkuk.
Langkah 2: Tuang susu ke sereal.
Langkah 3: Ambil sendokmu.
Langkah 4: ULANGI yang berikut ini SAMPAI mangkuknya kosong:
             - Sendok sereal dengan sendok.
             - Masukkan sendok ke mulut.
             - Kunyah dan telan.
Langkah 5: Minum sisa susu kalau kamu mau.
Langkah 6: Taruh mangkuk di bak cuci piring.
```

Langkah 4 adalah loop! Kamu terus menyendok, makan, dan mengunyah sampai nggak ada sereal lagi. Kamu nggak perlu menulis "suapan 1, suapan 2, suapan 3..." — kamu cuma bilang "ulangi sampai selesai."

**Contoh lain: Mencari mainan yang hilang**

```
Langkah 1: Pikirkan tempat terakhir kamu melihat mainan itu.
Langkah 2: Pergi ke tempat itu dan cari.
Langkah 3: JIKA kamu menemukan mainannya, MAKA rayakan! Kamu selesai!
Langkah 4: JIKA kamu belum menemukan mainannya:
             - Pikirkan tempat lain untuk dicek.
             - Pergi ke sana dan cari.
             - ULANGI Langkah 3 dan Langkah 4 SAMPAI kamu menemukannya (atau kehabisan tempat).
```

---

## Kegiatan 1: Tulis Instruksi untuk Sikat Gigi

**Apa yang kamu butuhkan:** Kertas dan pensil.

**Misimu:** Tulis algorithm untuk sikat gigi. Harus SANGAT spesifik! Bayangkan kamu menulis instruksi untuk seseorang yang BELUM PERNAH sikat gigi sebelumnya.

**Aturan:**
- Setiap langkah harus SATU tindakan kecil.
- Langkah harus dalam urutan yang benar.
- Jangan lewatkan langkah apa pun, sekecil apa pun kelihatannya.

**Mulai:** Apa hal pertama yang kamu lakukan? (Petunjuk: mungkin "jalan ke kamar mandi" atau "ambil sikat gigi")

**Akhir:** Apa hal terakhir yang kamu lakukan?

**Periksa kerjamu:** Bacakan algorithm-mu ke teman atau anggota keluarga. Minta mereka mengikutinya PERSIS. Apakah gigi mereka jadi bersih? Atau kamu lupa satu langkah?

**Pikirkan:** Apakah kamu ingat memasukkan:
- Mengambil sikat gigi?
- Membuka pasta gigi?
- Membasahi sikat?
- Menyikat SEMUA gigi (atas, bawah, depan, belakang)?
- Meludah?
- Berkumur?
- Membereskan semuanya?

---

## Kegiatan 2: Ajarkan Alien Membuat Pesawat Kertas

**Apa yang kamu butuhkan:** Kertas, pensil, dan beberapa lembar kertas untuk dilipat.

**Ceritanya:** Seorang alien baru saja mendarat di Bumi. Alien ini sangat pintar, tapi belum pernah melihat kertas sebelumnya. Dia bisa mengikuti instruksi dengan sempurna, tapi dia NGGAK TAHU apa-apa tentang kertas, melipat, atau pesawat.

**Misimu:** Tulis algorithm yang mengajarkan alien cara membuat pesawat kertas. Ingat — alien akan mengikuti instruksimu PERSIS. Kalau kamu bilang "lipat kertasnya," alien mungkin melipatnya secara acak karena kamu nggak bilang BAGAIMANA cara melipatnya!

**Tips:**
- Mulai dengan "ambil selembar kertas."
- Jelaskan dengan spesifik ke ARAH mana harus dilipat.
- Bilang hal seperti "lipat tepi atas ke bawah sampai bertemu tepi bawah."
- Beritahu alien ke arah mana kertas harus menghadap.

**Uji algorithm-mu:** Berikan instruksimu ke teman (mereka pura-pura jadi alien). Mereka harus mengikuti HANYA yang kamu tulis — nggak lebih. Apakah mereka berhasil membuat pesawat yang bagus?

---

## Kegiatan 3: Permainan Robot

**Apa yang kamu butuhkan:** Dua atau lebih pemain, ruangan terbuka (ruang tamu, halaman belakang, ruang kelas).

**Cara bermain:**

1. **Persiapan:** Taruh benda kecil (seperti buku atau mainan) di suatu tempat di ruangan. Ini "hartanya."

2. **Pilih peran:**
   - Satu orang jadi **Robot**. Robot hanya bisa bergerak mengikuti instruksi. Robot nggak bisa berpikir sendiri.
   - Satu orang jadi **Programmer**. Programmer memberi instruksi ke Robot.

3. **Perintah yang dipahami Robot:**
   - "Langkah maju" (ambil satu langkah ke depan)
   - "Langkah mundur" (ambil satu langkah ke belakang)
   - "Belok kiri" (berputar 90 derajat ke kiri)
   - "Belok kanan" (berputar 90 derajat ke kanan)
   - "Ambil" (ambil benda di depanmu)
   - "Taruh" (taruh benda yang kamu pegang)

4. **Tujuannya:** Programmer harus memandu Robot ke harta menggunakan HANYA perintah-perintah ini. Robot melakukan PERSIS seperti yang diperintahkan — nggak lebih, nggak kurang.

5. **Aturan penting:**
   - Robot nggak boleh bicara atau bertanya.
   - Robot harus mengikuti perintah secara harfiah (kalau kamu bilang "langkah maju" dan ada tembok, Robot nabrak tembok!).
   - Programmer harus berpikir dengan hati-hati sebelum memberi setiap perintah.

**Buat lebih susah:**
- Tambah rintangan (kursi, bantal) yang harus dilewati Robot.
- Tutup mata Robot supaya mereka benar-benar mengandalkan instruksi Programmer.
- Minta Programmer menulis SEMUA perintah di kertas dulu, BARU Robot mengikuti semuanya sekaligus (nggak boleh diubah!).

**Yang kamu pelajari:** Permainan ini mengajarkan bahwa algorithm harus tepat, lengkap, dan dalam urutan yang benar!

---

## Kegiatan 4: Algorithm untuk Kegiatan Favoritmu

**Apa yang kamu butuhkan:** Kertas dan pensil.

**Instruksi:**

1. Pilih kegiatan yang kamu tahu dengan baik:
   - Cara menggambar bintang
   - Cara membuat gelang persahabatan
   - Cara melakukan roda (cartwheel)
   - Cara bermain permainan kartu favoritmu
   - Cara membuat perahu kertas

2. Tulis algorithm (instruksi langkah demi langkah) untuk kegiatan ini.

3. Algorithm-mu harus cukup bagus sehingga seseorang yang BELUM PERNAH melakukan kegiatan itu bisa mengikuti langkah-langkahmu dan berhasil.

4. Uji coba! Berikan algorithm-mu ke seseorang dan lihat apakah mereka bisa mengikutinya.

---

## Kegiatan 5: Perbaiki Algorithm yang Teracak

**Apa yang kamu butuhkan:** Kertas dan pensil.

**Instruksi:** Langkah-langkah di bawah semuanya teracak! Susun dalam urutan yang benar dengan memberi nomor 1 sampai 8.

**Algorithm Teracak: Membuat Semangkuk Sereal**

___ Tuang susu ke mangkuk.
___ Ambil mangkuk dari lemari.
___ Makan sereal dengan sendok.
___ Kembalikan kotak sereal dan susu ke tempatnya.
___ Ambil kotak sereal dan susu dari dapur.
___ Ambil sendok dari laci.
___ Tuang sereal ke mangkuk.
___ Duduk di meja makan.

**Bisakah kamu menemukan urutan yang benar?**

---

## Algorithm vs. Tanpa Algorithm

Yuk lihat apa yang terjadi kalau kamu NGGAK punya algorithm yang bagus.

**Skenario 1: Memanggang tanpa resep**
"Masukin aja bahan-bahan ke oven!" Hasilnya: sesuatu yang gosong, kempes, dan rasanya nggak enak. Waduh.

**Skenario 2: Memberi petunjuk arah yang jelek**
"Jalan ke sana agak jauh, terus belok di suatu tempat." Hasilnya: temanmu tersesat dan meneleponmu sambil menangis.

**Skenario 3: Main permainan dengan aturan nggak jelas**
"Tinggal pukul bolanya!" Hasilnya: semua orang ribut soal aturan dan nggak ada yang seru.

Sekarang bandingkan:

**Skenario 1 dengan algorithm:** Ikuti resepnya langkah demi langkah. Hasilnya: kue yang enak!

**Skenario 2 dengan algorithm:** "Jalan ke utara dua blok, belok kiri, rumah ketiga di sebelah kanan." Hasilnya: temanmu sampai tepat di depan pintumu!

**Skenario 3 dengan algorithm:** Aturan yang jelas yang disetujui semua orang. Hasilnya: permainan yang adil, semua senang!

---

## Pseudocode: Menulis Algorithm dalam Bahasa Sehari-hari

Saat orang-orang yang bekerja dengan komputer menulis algorithm, mereka kadang menggunakan sesuatu yang namanya **pseudocode**. Tenang — ini cuma cara menulis langkah-langkah yang kelihatan sedikit seperti kode komputer tapi sebenarnya cuma bahasa sehari-hari.

Ini pseudocode untuk memutuskan apa yang dilakukan setelah pulang sekolah:

```
MULAI
  Cek tas untuk PR
  JIKA ada PR MAKA
    Kerjakan PR dulu
    KALAU PR sudah selesai, pergi main
  KALAU TIDAK
    Langsung pergi main
  SELESAI JIKA
  JIKA sudah gelap MAKA
    Pulang ke rumah
  SELESAI JIKA
  Makan malam
  Sikat gigi
  Tidur
SELESAI
```

Lihat? Ini cuma bahasa sehari-hari dengan sedikit struktur. Kata MULAI dan SELESAI memberitahumu di mana algorithm dimulai dan berakhir. JIKA-MAKA membantu kamu membuat keputusan.

Kamu nggak harus pakai pseudocode — langkah bernomor biasa juga bagus! Ini cuma cara lain untuk menulis hal yang sama.

---

## Waktunya Kuis!

**Pertanyaan 1:** Apa itu algorithm?
- A) Sejenis komputer
- B) Kumpulan instruksi langkah demi langkah untuk menyelesaikan masalah
- C) Rumus matematika
- D) Sejenis robot

**Pertanyaan 2:** Mana yang PALING penting tentang algorithm?
- A) Harus sangat panjang
- B) Harus pakai kata-kata besar
- C) Langkahnya harus jelas dan dalam urutan yang benar
- D) Harus ditulis di komputer

**Pertanyaan 3:** Apa yang salah dengan algorithm membuat roti panggang ini?

```
Langkah 1: Olesi mentega di roti panggang.
Langkah 2: Masukkan roti ke pemanggang.
Langkah 3: Tunggu rotinya matang.
Langkah 4: Ambil selembar roti.
```

- A) Terlalu panjang
- B) Langkah-langkahnya dalam urutan yang salah
- C) Terlalu banyak langkah
- D) Nggak ada yang salah

**Pertanyaan 4:** Dalam algorithm, apa artinya "ULANGI SAMPAI"?
- A) Lakukan sesuatu sekali
- B) Lakukan sesuatu berulang-ulang sampai suatu kondisi terpenuhi
- C) Lewati satu langkah
- D) Mundur ke belakang

**Pertanyaan 5:** Kamu menulis algorithm untuk membantu teman jalan dari ruang kelas ke perpustakaan. Set instruksi mana yang LEBIH BAIK?

Set A: "Pergi ke perpustakaan."
Set B: "Belok kiri keluar dari ruang kelas. Jalan sampai ujung koridor. Belok kanan. Perpustakaan ada di pintu kedua sebelah kiri."

- A) Set A, karena lebih pendek
- B) Set B, karena langkahnya jelas dan spesifik
- C) Keduanya sama bagusnya
- D) Keduanya nggak bagus

---

## Tantangan: Rancang Permainanmu Sendiri

Siap untuk tantangan BESAR? **Rancang permainan sederhana dan tulis algorithm untuk memainkannya!**

Algorithm permainanmu harus mencakup:
1. **Persiapan:** Apa yang kamu butuhkan? Berapa pemain?
2. **Aturan:** Apa yang boleh dilakukan pemain? Apa yang nggak boleh?
3. **Cara bermain:** Instruksi langkah demi langkah untuk satu giliran.
4. **Cara menang:** Kapan permainannya selesai? Bagaimana menentukan pemenangnya?

Permainannya bisa apa saja — permainan kartu, permainan papan, permainan lari-larian, permainan tebak-tebakan. Buat sederhana tapi pastikan aturannya cukup jelas sehingga siapa pun bisa memainkannya dengan hanya membaca algorithm-mu.

**Uji permainanmu:** Ajarkan ke teman atau keluarga menggunakan HANYA algorithm tertulismu. Bisakah mereka bermain tanpa kamu menjelaskan hal tambahan?

---

## Apa yang Sudah Kamu Pelajari

Kerja yang luar biasa! Di modul ini, kamu belajar bahwa:
- **Algorithm** (algoritma) adalah kumpulan instruksi langkah demi langkah untuk menyelesaikan masalah atau menyelesaikan tugas.
- Algorithm yang bagus punya langkah yang jelas, urutan yang benar, nggak ada yang terlewat, dan awal serta akhir yang jelas.
- Algorithm bisa mencakup **keputusan** (JIKA-MAKA) dan **perulangan** (ULANGI SAMPAI).
- Kamu mengikuti algorithm setiap hari — resep, petunjuk arah, aturan permainan.
- Menulis algorithm yang bagus artinya harus sangat spesifik dan memikirkan setiap detail kecil.

---

## Jawaban

**Pertanyaan 1:** B) Kumpulan instruksi langkah demi langkah untuk menyelesaikan masalah.

**Pertanyaan 2:** C) Langkahnya harus jelas dan dalam urutan yang benar.

**Pertanyaan 3:** B) Langkah-langkahnya dalam urutan yang salah. Urutan yang benar seharusnya: Ambil selembar roti, Masukkan roti ke pemanggang, Tunggu rotinya matang, Olesi mentega di roti panggang.

**Pertanyaan 4:** B) Lakukan sesuatu berulang-ulang sampai suatu kondisi terpenuhi.

**Pertanyaan 5:** B) Set B, karena langkahnya jelas dan spesifik.

**Perbaiki Algorithm Teracak (Kegiatan 5):**
1. Ambil kotak sereal dan susu dari dapur.
2. Ambil mangkuk dari lemari.
3. Ambil sendok dari laci.
4. Tuang sereal ke mangkuk.
5. Tuang susu ke mangkuk.
6. Duduk di meja makan.
7. Makan sereal dengan sendok.
8. Kembalikan kotak sereal dan susu ke tempatnya.

---

[Sebelumnya: Modul 03 — Abstraksi](03-abstraction.md) | [Selanjutnya: Modul 05 — Berpikir Logis](05-logical-thinking.md)
