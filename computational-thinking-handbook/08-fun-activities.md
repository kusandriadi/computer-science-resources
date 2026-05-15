# Modul 08: Aktivitas Seru — Permainan dan Teka-Teki Tanpa Komputer

## Tidak Perlu Komputer!

Siap-siap — ini bagian yang SERU banget! Modul ini penuh dengan permainan keren, teka-teki asyik, dan aktivitas langsung yang mengajarkan Computational Thinking — semuanya TANPA komputer! Kamu bisa mainkan ini di kelas, di rumah, atau bersama teman-teman.

Ini yang akan kamu lihat di setiap aktivitas:
- **Yang kamu butuhkan** (bahan-bahan)
- **Berapa pemain**
- **Kemampuan CT yang dilatih**
- **Instruksi langkah demi langkah**

Siap? Ayo main!

---

## Aktivitas 1: Jaringan Penyortiran Manusia

**Yang kamu butuhkan:** 6 pemain atau lebih, selotip atau kapur untuk menandai lantai, kartu bernomor

**Kemampuan CT:** Desain Algoritma, Dekomposisi

**Waktu:** 15-20 menit

### Apa Itu Jaringan Penyortiran?

Yang satu ini keren banget! Jaringan penyortiran (Sorting Network) adalah sekumpulan jalur di tanah dengan stasiun "bandingkan." Dua orang berjalan di jalur, dan saat mereka bertemu di stasiun, mereka membandingkan angka mereka. Orang dengan angka LEBIH KECIL selalu ke kiri, dan orang dengan angka LEBIH BESAR selalu ke kanan.

Di akhir, semua orang tersusun urut — tanpa siapa pun perlu melihat gambaran besarnya!

### Persiapan

1. Tandai jaringan di lantai menggunakan selotip atau kapur. Ini contoh sederhana untuk 4 orang:

```
Mulai:    A ----.    .---- B
               |    |
              [BANDINGKAN]
               |    |
          .----'    '----.
          |               |
     C ----.    .---- D   |
           |    |         |
          [BANDINGKAN]    |
           |    |         |
      .----'    '----.    |
      |               |   |
      |          .-----.----.
      |          |         |
     [BANDINGKAN]  [BANDINGKAN]
      |    |     |    |
      '----'     '----'
Akhir: 1    2    3    4
```

(Untuk versi yang lebih simpel, cukup suruh pasangan siswa membandingkan dan bertukar. Lakukan ini dalam beberapa ronde sampai semua urut.)

2. Beri setiap pemain kartu dengan angka acak.

### Cara Bermain

1. Pemain berdiri di posisi awal.
2. Mereka berjalan maju sepanjang jalur.
3. Saat dua pemain bertemu di stasiun Bandingkan, mereka menunjukkan angka mereka satu sama lain.
4. Pemain dengan angka **lebih kecil** ambil jalur **kiri**.
5. Pemain dengan angka **lebih besar** ambil jalur **kanan**.
6. Pemain terus berjalan sampai mencapai akhir.
7. Cek: apakah angkanya urut dari terkecil ke terbesar? Seharusnya iya!

### Kenapa Ini Keren

Tidak ada yang menentukan urutan akhirnya. Tidak ada yang bisa melihat angka semua orang. Aturan sederhana "yang kecil ke kiri, yang besar ke kanan" di setiap stasiun sudah cukup untuk menyortir semua orang. Begitulah cara komputer menyortir!

---

## Aktivitas 2: Gelang Angka Biner

**Yang kamu butuhkan:** Manik-manik (2 warna, misalnya hitam dan putih), benang atau tali, gunting

**Kemampuan CT:** Pengenalan Pola, Abstraksi

**Waktu:** 20-30 menit

### Apa Itu Angka Biner?

Ini salah satu hal paling keren tentang komputer! Komputer hanya menggunakan dua digit: **0** dan **1**. Ini disebut **biner** (binary). Setiap angka, huruf, gambar, dan video di komputer disimpan hanya menggunakan 0 dan 1!

Yuk ubah usiamu (atau angka apa saja) jadi biner dan buat gelang darinya.

### Cara Kerja Biner

Dalam biner, setiap posisi mewakili pangkat 2:

| Posisi | ke-5 | ke-4 | ke-3 | ke-2 | ke-1 |
|----------|-----|-----|-----|-----|-----|
| Nilai    | 16  | 8   | 4   | 2   | 1   |

Untuk menulis angka dalam biner, cari tahu nilai mana yang kalau dijumlahkan hasilnya angkamu.

**Contoh: Angka 10**
- 16? TIDAK (terlalu besar). Tulis **0**.
- 8? YA (10 - 8 = sisa 2). Tulis **1**.
- 4? TIDAK (2 kurang dari 4). Tulis **0**.
- 2? YA (2 - 2 = sisa 0). Tulis **1**.
- 1? TIDAK (tidak ada sisa). Tulis **0**.

Jadi 10 dalam biner = **01010**

**Contoh: Angka 7**
- 16? TIDAK. **0**
- 8? TIDAK. **0**
- 4? YA (7 - 4 = 3). **1**
- 2? YA (3 - 2 = 1). **1**
- 1? YA (1 - 1 = 0). **1**

Jadi 7 dalam biner = **00111**

### Membuat Gelang

1. Pilih angkamu (usiamu pilihan yang bagus!).
2. Ubah ke biner menggunakan cara di atas.
3. Pilih dua warna manik-manik:
   - **Putih** = 0
   - **Hitam** = 1
4. Masukkan manik-manik ke benang sesuai urutan biner.
5. Ikat gelangnya dan pakai!

**Contoh: Usia 9 = 01001**
Manik-manik: putih, hitam, putih, putih, hitam

### Tantangan

- Bisakah kamu membaca gelang biner temanmu dan menebak angkanya?
- Buat gelang untuk seluruh keluargamu!

---

## Aktivitas 3: Pixel Art (Mewarnai Kotak-Kotak)

**Yang kamu butuhkan:** Kertas kotak-kotak (atau gambar kotak-kotakmu sendiri), pensil warna atau spidol

**Kemampuan CT:** Abstraksi, Pengenalan Pola, Dekomposisi

**Waktu:** 15-25 menit

### Apa Itu Pixel?

Setiap gambar di layar terbuat dari kotak-kotak kecil yang disebut **pixel**. Kalau kamu zoom in sangat dekat ke gambar digital apa pun, kamu akan melihatnya — kotak-kotak kecil berwarna! Pixel art itu seperti melukis, tapi menggunakan kotak-kotak di grid, bukan sapuan kuas.

### Cara Membuat Pixel Art

1. Gambar grid di kertasmu (10x10 kotak adalah awal yang bagus, atau pakai kertas kotak-kotak).
2. Rencanakan gambar sederhana: hati, bintang, wajah tersenyum, pohon, pesawat luar angkasa, hewan.
3. Warnai kotak-kotak untuk membuat gambarmu.

### Meng-encode Gambarmu

Ini bagian kerennya: kamu bisa menulis gambarmu sebagai **angka**, bukan warna!

**Cara meng-encode:**

Untuk setiap baris, tulis berapa banyak kotak dari setiap warna, dari kiri ke kanan.

**Contoh: Sebuah baris yang terlihat seperti ini:**
Putih Putih Putih Hitam Hitam Hitam Putih Putih Putih Putih

Kamu tulis: **3P, 3H, 4P** (3 putih, 3 hitam, 4 putih)

**Lakukan ini untuk setiap baris, dan kamu sudah mengubah gambar jadi data!**

### Tantangan Decoding

1. Pemain 1 membuat gambar pixel art dan meng-encode-nya sebagai angka.
2. Pemain 1 memberikan HANYA angkanya ke Pemain 2.
3. Pemain 2 men-decode angka kembali jadi gambar dengan mewarnai grid.
4. Bandingkan gambarnya — apakah cocok?

**Contoh untuk di-decode:**

Grid: 8 kolom lebar

```
Baris 1: 3P, 2H, 3P
Baris 2: 2P, 4H, 2P
Baris 3: 1P, 6H, 1P
Baris 4: 8H
Baris 5: 8H
Baris 6: 1P, 6H, 1P
Baris 7: 2P, 4H, 2P
Baris 8: 3P, 2H, 3P
```

Bentuk apa yang dihasilkan? (Petunjuk: itu belah ketupat!)

---

## Aktivitas 4: Berburu Harta Karun dengan Algoritma

Yang satu ini seru banget!

**Yang kamu butuhkan:** "Harta karun" kecil (mainan, permen, stiker), kertas, pensil, area untuk menyembunyikan harta karun

**Kemampuan CT:** Desain Algoritma, Berpikir Logis, Debugging

**Waktu:** 20-30 menit

### Persiapan

1. Satu pemain (si Penyembunyi) menyembunyikan harta karun di suatu tempat di ruangan, rumah, atau halaman.
2. Si Penyembunyi menulis sebuah **algoritma** (petunjuk langkah demi langkah) untuk menemukan harta karunnya.
3. Pemain lain (si Pencari) mengikuti algoritma untuk menemukan harta karunnya.

### Aturan Menulis Algoritma

Petunjuknya harus sangat spesifik:
- Gunakan angka yang tepat: "Jalan 5 langkah ke depan" (bukan "jalan sedikit").
- Gunakan arah yang jelas: "Belok kiri" atau "Belok kanan" (bukan "belok sana").
- Sertakan penanda: "Jalan ke pohon besar" atau "Berhenti di kursi merah."

### Contoh Algoritma

```
Langkah 1: Mulai di pintu depan.
Langkah 2: Jalan 10 langkah ke depan.
Langkah 3: Belok kanan.
Langkah 4: Jalan sampai rak buku biru.
Langkah 5: Lihat di rak ketiga dari bawah.
Langkah 6: Harta karunnya ada di belakang buku merah besar!
```

### Bikin Lebih Sulit

- Tambahkan cabang **JIKA-MAKA**: "JIKA kamu melihat sticky note kuning, MAKA belok kiri. SELAINNYA belok kanan."
- Tambahkan **teka-teki** di setiap langkah: "Selesaikan soal matematika ini untuk tahu berapa langkah selanjutnya: 3 + 4 = ?"
- Buat berburu harta karun **multi-langkah** di mana setiap petunjuk mengarah ke petunjuk berikutnya.

### Debugging Perburuannya

Kalau si Pencari tidak bisa menemukan harta karunnya, debug bersama:
- Langkah mana yang membingungkan?
- Apakah si Pencari melewatkan belokan?
- Apakah ada arah yang salah?

---

## Aktivitas 5: Trik Sulap Deteksi Kesalahan (Paritas)

Siap-siap — yang ini menjebak tapi KEREN BANGET!

**Yang kamu butuhkan:** 36 kartu atau potongan kertas (dua warna — misalnya biru dan kuning), permukaan datar

**Kemampuan CT:** Pengenalan Pola, Berpikir Logis, Debugging

**Waktu:** 15-20 menit

### Trik Sulapnya

Trik ini akan membuat teman-temanmu takjub karena kamu bisa tahu kartu mana yang dibalik — tanpa melihat!

### Persiapan

1. Tata grid 5x5 kartu, secara acak menunjukkan sisi biru atau kuning.
2. INI RAHASIANYA: Tambahkan baris ke-6 dan kolom ke-6. Di setiap posisi tambahan, taruh kartu supaya SETIAP baris dan SETIAP kolom punya jumlah **genap** dari satu warna (misalnya kuning). Ini disebut **paritas** (parity).

### Cara Melakukan Trik

1. Tunjukkan ke penonton grid 6x6-nya. (Mereka kira acak, tapi kamu sudah mengaturnya dengan cermat!)
2. Minta seseorang membalik SATU kartu saat kamu tidak melihat.
3. Berbalik dan lihat grid-nya.
4. Periksa setiap baris: hitung kartu kuning. Kalau sebuah baris punya jumlah GANJIL kartu kuning, baris itu yang ada kartu yang dibalik.
5. Periksa setiap kolom: hitung kartu kuning. Kalau sebuah kolom punya jumlah GANJIL kartu kuning, kolom itu yang ada kartu yang dibalik.
6. Kartu yang dibalik ada di pertemuan baris "ganjil" dan kolom "ganjil"!

### Kenapa Ini Berhasil

Kamu mengatur grid-nya supaya setiap baris dan kolom punya jumlah genap kartu kuning. Saat seseorang membalik kartu, itu mengubah satu baris dari genap ke ganjil dan satu kolom dari genap ke ganjil. Keduanya memberitahumu PERSIS kartu mana yang dibalik!

### Koneksi CT

Beginilah cara komputer mendeteksi kesalahan! Saat data dikirim lewat internet, "bit paritas" (parity bits) tambahan (seperti baris dan kolom tambahanmu) ditambahkan. Kalau sebuah bit tertukar saat transfer, komputer bisa mendeteksinya — persis seperti trik sulapmu!

---

## Aktivitas 6: Tantangan Algoritma Menyusun Gelas

**Yang kamu butuhkan:** 6-10 gelas plastik (atau gelas kertas), meja

**Kemampuan CT:** Desain Algoritma, Dekomposisi, Debugging

**Waktu:** 10-15 menit

### Cara Bermain

1. Bangun piramida gelas: 4 gelas di bawah, 3 di tingkat berikutnya, 2 di berikutnya, dan 1 di atas.
2. Sekarang tulis algoritma (instruksi langkah demi langkah) untuk orang lain membangun piramida yang sama.
3. Robohkan piramidanya.
4. Berikan algoritmamu ke teman. Bisakah mereka membangun ulang piramida HANYA menggunakan instruksimu?

### Aturan

- Temanmu HANYA boleh melakukan apa yang tertulis di instruksi.
- Kamu tidak boleh bicara, memberi isyarat, atau membantu dengan cara apa pun.
- Kalau instruksinya tidak jelas, temanmu menebak sebaik mungkin (yang mungkin salah!).

### Apa yang Akan Kamu Pelajari

Kamu akan menemukan betapa sulitnya menulis instruksi yang jelas! Kamu mungkin bilang "taruh gelas" — tapi DI MANA? Arah mana? Ini mengajarkanmu untuk sangat tepat dalam algoritmamu.

---

## Aktivitas 7: Algoritma Telepon

**Yang kamu butuhkan:** 5 pemain atau lebih, kertas, pensil

**Kemampuan CT:** Desain Algoritma, Debugging, Abstraksi

**Waktu:** 15-20 menit

### Cara Bermain

1. Pemain 1 menulis algoritma untuk tugas sederhana (seperti menggambar wajah tersenyum, mengikat sepatu, atau membuat topi kertas). Algoritmanya harus punya 6-8 langkah.

2. Pemain 1 membisikkan Langkah 1 ke Pemain 2. Pemain 2 menulisnya.
   Pemain 1 membisikkan Langkah 2 ke Pemain 2. Pemain 2 menulisnya.
   Lanjut sampai semua langkah diteruskan.

3. Pemain 2 sekarang membacakan versinya ke Pemain 3 (tanpa menunjukkan), dan Pemain 3 menulisnya.

4. Lanjut sampai algoritma mencapai pemain terakhir.

5. Pemain terakhir mencoba mengikuti algoritmanya.

6. Bandingkan algoritma ASLI dengan versi TERAKHIR. Berapa banyak yang berubah?

### Diskusi

- "Bug" apa yang muncul?
- Langkah mana yang paling banyak berubah?
- Bagaimana caranya membuat algoritma lebih tahan terhadap kesalahan?
- Ini seperti permainan anak-anak "Telepon" — tapi dengan instruksi!

---

## Aktivitas 8: Labirin Robot Manusia

**Yang kamu butuhkan:** Kursi atau kotak untuk membuat labirin, 2+ pemain, penutup mata (opsional)

**Kemampuan CT:** Desain Algoritma, Berpikir Logis, Debugging

**Waktu:** 20-30 menit

### Persiapan

1. Susun kursi, kotak, atau bantal untuk membuat labirin sederhana di ruangan atau lorong.
2. Taruh "tujuan" (boneka, buku, atau bola) di ujung labirin.

### Cara Bermain

1. Satu pemain jadi **Robot**. Robot berdiri di awal labirin dan menutup mata (atau pakai penutup mata).
2. Pemain lain jadi **Programmer**. Programmer bisa melihat labirin dan memberikan perintah verbal.
3. Robot hanya bisa mengikuti perintah ini:
   - "Maju" (satu langkah ke depan)
   - "Kiri" (belok kiri 90 derajat)
   - "Kanan" (belok kanan 90 derajat)
   - "Berhenti" (diam di tempat)
   - "Ambil" (ambil benda tujuannya)

4. Programmer memandu Robot melewati labirin ke tujuan.

### Versi Lanjutan

Programmer harus menulis SEMUA instruksi di kertas DULU, lalu berikan ke Robot. Tidak boleh ada perubahan! Ini memaksa Programmer untuk merencanakan seluruh jalur terlebih dahulu.

### Debugging

Kalau Robot menabrak sesuatu:
- Instruksi mana yang salah?
- Apakah itu langkah yang hilang, arah yang salah, atau jumlah langkah yang salah?
- Bagaimana cara memperbaiki algoritmanya?

---

## Aktivitas 9: Untaian Manik-Manik Pola

**Yang kamu butuhkan:** Manik-manik atau pasta warna-warni (3-4 warna), benang

**Kemampuan CT:** Pengenalan Pola, Desain Algoritma

**Waktu:** 15-20 menit

### Cara Bermain

1. Buat pola menggunakan manik-manik di benang. Mulai dari yang simpel dan makin sulit:
   - **Mudah:** Merah, Biru, Merah, Biru, Merah, Biru (pola AB)
   - **Sedang:** Merah, Merah, Biru, Hijau, Merah, Merah, Biru, Hijau (pola AABC)
   - **Sulit:** Merah, Biru, Biru, Merah, Biru, Biru, Biru, Merah, Biru, Biru, Biru, Biru (jumlah biru bertambah: 2, 3, 4!)

2. Tunjukkan untaianmu ke teman. Bisakah mereka menebak polanya?

3. Temanmu melanjutkan untaian dengan menambahkan manik-manik yang benar.

4. Sekarang temanmu membuat pola untuk KAMU tebak!

### Tulis Algoritmanya

Setelah kamu menebak polanya, tulis sebagai algoritma:

**Contoh:**
```
ULANGI selamanya:
  Tambah 1 manik merah
  Tambah 2 manik biru
```

Ini menghasilkan: M, B, B, M, B, B, M, B, B...

Bisakah kamu menulis algoritma untuk pola yang lebih kompleks?

---

## Aktivitas 10: Lini Perakitan Sandwich

**Yang kamu butuhkan:** Roti, olesan, isian (atau bahan-bahan pura-pura menggunakan potongan kertas), 4+ pemain

**Kemampuan CT:** Dekomposisi, Desain Algoritma, Pengenalan Pola

**Waktu:** 15-20 menit

### Cara Bermain

1. **Dekomposisi** proses membuat sandwich jadi langkah-langkah terpisah:
   - Stasiun 1: Ambil roti
   - Stasiun 2: Oleskan selai kacang
   - Stasiun 3: Tambahkan selai buah
   - Stasiun 4: Satukan irisan roti dan potong

2. Setiap pemain berdiri di SATU stasiun dan melakukan HANYA langkah mereka.

3. Teruskan sandwich dari stasiun ke stasiun.

4. Lihat berapa banyak sandwich yang bisa dibuat lini perakitanmu dalam 3 menit!

### Diskusi

- Pola apa yang kamu perhatikan? (Setiap sandwich mengikuti langkah yang sama!)
- Apa yang terjadi kalau satu stasiun terlalu lambat? (Bottleneck — kemacetan!)
- Bagaimana cara membuat lini perakitan lebih cepat? (Tambahkan orang kedua di stasiun yang lambat!)
- Bagaimana kalau seseorang di stasiun membuat kesalahan? Bagaimana cara debug-nya?

Kalau tidak mau pakai makanan sungguhan, potong kertas jadi "irisan roti" dan pakai kertas berwarna untuk "bahan-bahan."

---

## Aktivitas 11: Kartu Algoritma Cerita

**Yang kamu butuhkan:** Kartu indeks atau kertas dipotong jadi kartu, pensil, 2+ pemain

**Kemampuan CT:** Desain Algoritma, Dekomposisi, Berpikir Logis

**Waktu:** 15-20 menit

### Cara Bermain

1. Pikirkan cerita pendek (dongeng cocok banget, seperti Goldilocks atau Si Kancil dan Buaya).

2. Tulis setiap KEJADIAN dalam cerita di kartu terpisah. Satu kejadian per kartu. Tulis setidaknya 8 kartu.

**Contoh untuk "Goldilocks dan Tiga Beruang":**
- Tiga beruang pergi jalan-jalan.
- Goldilocks menemukan rumah beruang.
- Goldilocks mencoba tiga mangkuk bubur.
- Goldilocks mencoba tiga kursi.
- Kursi kecil patah.
- Goldilocks mencoba tiga tempat tidur.
- Goldilocks tertidur di tempat tidur kecil.
- Tiga beruang pulang.
- Beruang-beruang menemukan Goldilocks.
- Goldilocks lari.

3. Kocok kartunya dan berikan ke teman.

4. Temanmu harus menyusun kartu dalam URUTAN YANG BENAR untuk menceritakan ulang ceritanya.

5. Cek: apakah urutannya benar? Kalau tidak, debug! Kartu mana yang salah tempat?

### Bikin Lebih Sulit

- Tambahkan 2-3 kejadian PALSU yang tidak ada dalam cerita. Temanmu harus menemukan dan menyingkirkannya!
- Campur kartu dari DUA cerita berbeda. Temanmu harus memisahkan dan mengurutkan masing-masing.

---

## Aktivitas 12: Lomba Estafet Debugging

Yang satu ini bagus banget untuk tim!

**Yang kamu butuhkan:** 2 tim dengan 3-4 pemain, kertas, pensil, daftar instruksi "bermasalah"

**Kemampuan CT:** Debugging, Desain Algoritma

**Waktu:** 15-20 menit

### Persiapan

Siapkan 5 set "instruksi bermasalah" (instruksi dengan kesalahan). Tulis setiap set di kertas terpisah.

**Contoh set instruksi bermasalah:**

**Set 1: Membuat roti panggang**
1. Oleskan mentega di roti. 2. Masukkan roti ke pemanggang. 3. Tunggu rotinya matang. 4. Ambil roti.
(Bug: urutan salah)

**Set 2: Mencuci tangan**
1. Nyalakan air. 2. Taruh sabun di tangan. 3. Keringkan tangan. 4. Matikan air.
(Bug: langkah hilang — gosok tangan!)

**Set 3: Mau tidur**
1. Sikat gigi. 2. Naik ke tempat tidur. 3. Matikan lampu. 4. Pakai piyama. 5. Tidur.
(Bug: piyama seharusnya sebelum naik ke tempat tidur)

**Set 4: Mengirim surat**
1. Tulis suratnya. 2. Kirim suratnya. 3. Masukkan surat ke amplop. 4. Tempel perangko di amplop. 5. Tulis alamatnya.
(Bug: beberapa langkah urutannya salah)

**Set 5: Membuat limun**
1. Ambil gelas. 2. Tambah 10 gelas gula. 3. Tambah air. 4. Tambah perasan lemon. 5. Aduk.
(Bug: gulanya kebanyakan — seharusnya 2 sendok makan)

### Cara Bermain

1. Taruh setiap set instruksi bermasalah di tempat berbeda di ruangan (stasiun).
2. Tim berbaris di titik mulai.
3. Saat kamu bilang "Mulai!", satu pemain dari setiap tim berlari ke Stasiun 1.
4. Mereka membaca instruksi bermasalah, menemukan bug-nya, dan menulis perbaikannya.
5. Mereka berlari kembali dan tag teman tim berikutnya.
6. Teman tim berikutnya berlari ke Stasiun 2.
7. Lanjut sampai semua 5 stasiun selesai.
8. Periksa jawaban. Tim dengan perbaikan paling benar DAN waktu tercepat menang!

---

## Aktivitas 13: Pesan Rahasia Berkode

Siap untuk tantangan? Yuk kirim pesan rahasia seperti mata-mata!

**Yang kamu butuhkan:** Kertas, pensil, kunci kode di bawah ini

**Kemampuan CT:** Pengenalan Pola, Abstraksi, Desain Algoritma

**Waktu:** 15-20 menit

### Sandi Caesar (Caesar Cipher)

Sandi (cipher) adalah cara untuk meng-encode pesan rahasia. Sandi Caesar adalah salah satu yang tertua dan paling sederhana. Begini caranya:

Geser setiap huruf maju sejumlah tertentu. Kita pakai geser 3:

```
Asli:  A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
Sandi: D E F G H I J K L M N O P Q R S T U V W X Y Z A B C
```

Jadi A jadi D, B jadi E, C jadi F, dan seterusnya. X berputar jadi A, Y jadi B, Z jadi C.

### Meng-encode Pesan

**Pesan:** HELLO
- H jadi K
- E jadi H
- L jadi O
- L jadi O
- O jadi R

**Pesan ter-encode:** KHOOR

### Men-decode Pesan

Untuk men-decode, geser setiap huruf MUNDUR 3.

**Coba decode pesan-pesan ini (geser 3):**
1. FRPSXWHU (jawaban: COMPUTER)
2. SDWWHUQ (jawaban: PATTERN)
3. DOJRULWKP (jawaban: ALGORITHM)

### Buat Sendiri

1. Tulis pesan rahasia.
2. Encode menggunakan Sandi Caesar (pilih angka gesermu sendiri!).
3. Berikan pesan ter-encode DAN angka gesernya ke teman.
4. Bisakah mereka men-decode-nya?

### Tantangan

Bagaimana kalau kamu dapat pesan ter-encode tapi TIDAK tahu angka gesernya? Coba setiap kemungkinan geser (1 sampai 25) sampai ada yang masuk akal. Itu disebut **brute force** — mencoba setiap kemungkinan!

---

## Aktivitas 14: Menyortir Tanpa Melihat

**Yang kamu butuhkan:** 5-8 pemain, kartu bernomor (satu per pemain, angka disembunyikan dari yang lain)

**Kemampuan CT:** Desain Algoritma, Berpikir Logis, Dekomposisi

**Waktu:** 10-15 menit

### Cara Bermain

1. Beri setiap pemain kartu dengan angka. Pemain hanya bisa melihat angka mereka SENDIRI.
2. Tujuan: berbaris urut dari terkecil ke terbesar.
3. Aturan: Pemain hanya boleh bertanya SATU pertanyaan ke pemain lain: "Apakah angkamu lebih besar dari punyaku?"
4. Pemain lain menjawab YA atau TIDAK.
5. Berdasarkan jawaban, pemain bertukar posisi atau tetap di tempat.
6. Ulangi sampai semua urut.

### Diskusi

- Berapa pertanyaan yang dibutuhkan?
- Strategi apa yang paling berhasil?
- Apakah ada pola dalam pertanyaan yang harus kamu ajukan?
- Beginilah cara komputer menyortir data — dengan membandingkan dua item sekaligus!

---

## Aktivitas 15: Permainan Menggambar Robot

**Yang kamu butuhkan:** Kertas, pensil, 2 pemain yang tidak bisa melihat kertas satu sama lain

**Kemampuan CT:** Desain Algoritma, Abstraksi, Debugging

**Waktu:** 15-20 menit

### Cara Bermain

1. Pemain 1 menggambar robot sederhana di kertasnya (menggunakan bentuk dasar — lingkaran, persegi, persegi panjang, segitiga).

2. Pemain 1 lalu menulis algoritma yang menjelaskan cara menggambar robot itu, langkah demi langkah.

**Contoh:**
```
Langkah 1: Gambar persegi besar di tengah kertas. Ini badannya.
Langkah 2: Gambar persegi lebih kecil di atas badan. Ini kepalanya.
Langkah 3: Gambar dua lingkaran kecil di dalam kepala untuk mata.
Langkah 4: Gambar garis lurus melintang di kepala di bawah mata untuk mulutnya.
Langkah 5: Gambar dua persegi panjang panjang turun dari bawah badan untuk kaki.
Langkah 6: Gambar dua persegi panjang tipis keluar dari sisi badan untuk lengan.
Langkah 7: Gambar segitiga kecil di atas kepala untuk antena.
```

3. Pemain 1 memberikan HANYA algoritma tertulis ke Pemain 2 (bukan gambarnya!).

4. Pemain 2 mengikuti algoritma dan menggambar robotnya.

5. Bandingkan kedua gambar. Apakah cocok?

### Debugging

Kalau gambarnya tidak cocok:
- Langkah mana yang tidak jelas?
- Apa yang hilang?
- Bagaimana algoritmanya bisa diperbaiki?

---

## Aktivitas Bonus: Buat Game CT-mu Sendiri!

Sekarang giliran KAMU — dan ini bakal keren banget! Gunakan apa yang sudah kamu pelajari untuk membuat game sendiri yang mengajarkan satu atau lebih kemampuan CT.

**Game-mu harus punya:**
1. Nama yang jelas
2. Apa yang dibutuhkan untuk bermain
3. Berapa pemain
4. Aturan yang jelas (algoritma untuk bermain!)
5. Cara menang
6. Kemampuan CT apa yang diajarkan

**Ide untuk memulai:**
- Board game di mana kamu menavigasi labirin dengan menulis algoritma
- Card game di mana kamu mencari pola untuk mendapat poin
- Permainan tebak-tebakan yang menggunakan berpikir logis
- Permainan tim di mana kamu debug instruksi yang rusak

Tulis game-mu, tes dengan teman-teman, dan debug sampai sempurna!

---

## Tabel Referensi Cepat Aktivitas

| # | Aktivitas | Pemain | Waktu | Kemampuan CT Utama |
|---|----------|---------|------|---------------|
| 1 | Jaringan Penyortiran Manusia | 6+ | 15-20 mnt | Desain Algoritma, Dekomposisi |
| 2 | Gelang Angka Biner | 1+ | 20-30 mnt | Pengenalan Pola, Abstraksi |
| 3 | Pixel Art | 1+ | 15-25 mnt | Abstraksi, Pengenalan Pola |
| 4 | Berburu Harta Karun dengan Algoritma | 2+ | 20-30 mnt | Desain Algoritma, Berpikir Logis |
| 5 | Trik Sulap Deteksi Kesalahan | 2+ | 15-20 mnt | Pengenalan Pola, Debugging |
| 6 | Algoritma Menyusun Gelas | 2+ | 10-15 mnt | Desain Algoritma, Debugging |
| 7 | Algoritma Telepon | 5+ | 15-20 mnt | Desain Algoritma, Debugging |
| 8 | Labirin Robot Manusia | 2+ | 20-30 mnt | Desain Algoritma, Berpikir Logis |
| 9 | Untaian Manik-Manik Pola | 2+ | 15-20 mnt | Pengenalan Pola, Desain Algoritma |
| 10 | Lini Perakitan Sandwich | 4+ | 15-20 mnt | Dekomposisi, Desain Algoritma |
| 11 | Kartu Algoritma Cerita | 2+ | 15-20 mnt | Desain Algoritma, Dekomposisi |
| 12 | Lomba Estafet Debugging | 6+ | 15-20 mnt | Debugging, Desain Algoritma |
| 13 | Pesan Rahasia Berkode | 2+ | 15-20 mnt | Pengenalan Pola, Desain Algoritma |
| 14 | Menyortir Tanpa Melihat | 5+ | 10-15 mnt | Desain Algoritma, Berpikir Logis |
| 15 | Menggambar Robot | 2 | 15-20 mnt | Desain Algoritma, Abstraksi |

---

Kamu berhasil — kamu sudah menyelesaikan SEMUA aktivitas! Kamu hebat banget! Semakin sering kamu memainkan permainan-permainan ini, semakin kuat kemampuan Computational Thinking-mu. Dan ingat — bagian terbaiknya adalah kamu belajar berpikir seperti pemecah masalah sambil bersenang-senang! Sekarang ayo coba yang paling kamu suka bersama teman-temanmu!

---

[Sebelumnya: Modul 07 — CT Sehari-hari](07-everyday-ct.md) | [Selanjutnya: Modul 09 — Untuk Guru dan Orang Tua](09-for-teachers-and-parents.md)
