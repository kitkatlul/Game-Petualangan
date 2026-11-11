# 🐻 Petualangan Bubu: Misi Menyelamatkan Hutan Pelangi (versi platformer)

## Isi folder
| File | Fungsi |
|---|---|
| `index.html` | Halaman utama |
| `style.css` | Tampilan |
| `platformer.js` | **Baru.** Mesin game: gerak Bubu, lompat, rintangan, 6 level, progres |
| `minigames.js` | Mini game lama (Memory, Cari Perbedaan, Puzzle) dipakai di pintu Level 5, plus suara Bubu |
| `sounds/` | MP3 suara (opsional, lihat `DAFTAR-SUARA.md`) |

**File `game.js` yang lama sudah diganti `minigames.js`. Hapus `game.js` dari GitHub.**

## Cara bermain
- HP/tablet: tombol ◀ ▶ (kiri bawah) dan ⬆ (kanan bawah), bisa ditekan bersamaan. Putar layar ke samping.
- Laptop: tombol panah atau W A D, lompat dengan spasi.
- Tombol atas: ⏸ jeda, 🔁 ulangi level, 📢 ulangi petunjuk suara, 🔊 suara hidup/mati.
- Jatuh ke air: Bubu kembali ke tempat aman, tanpa hukuman. Tidak ada game over dan tidak ada batas waktu.
- Level terbuka satu per satu. Progres tersimpan di browser.

## Enam level
1. **Hutan Hewan**: lompati kayu, dengar suara, naik ke hewan yang benar.
2. **Kebun Buah Ajaib**: kumpulkan 3 buah dengan warna yang diminta (warna salah tidak dihitung).
3. **Istana Bentuk**: ambil kunci bentuk yang sama dengan pintu (pilihan kunci bertambah di tiap pintu).
4. **Taman Bunga**: kumpulkan air dan matahari (bola dan permen tidak dibutuhkan), bunga mekar.
5. **Gua Misteri**: 3 pintu, tiap pintu membuka mini game (Memory 3 pasang, Cari Perbedaan, Puzzle singa 3x3).
6. **Gerbang Pelangi**: tantangan warna, bentuk, dan suara hewan berurutan, lalu medali "Penjelajah Hebat".

Bantuan bertahap: setelah 2 kali salah, jawaban yang benar berkedip kuning.

## Update ke GitHub dan Vercel
1. Ekstrak `petualangan-bubu.zip`.
2. Di repo GitHub: **Add file → Upload files**, drag **semua isi folder** (index.html, style.css, platformer.js, minigames.js, sounds). Commit.
3. Hapus `game.js` lama: buka file → ikon 🗑️ (sampah) → Commit.
4. Vercel otomatis memperbarui dalam ±1 menit. Refresh keras di browser.

## Menjalankan di komputer sendiri
Klik 2x `index.html` (pakai Chrome). Tidak perlu install apa pun.
