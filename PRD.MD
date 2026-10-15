# Product Requirements Document (PRD) 

# Kenangin Booth — Mini Photobooth 

| Parameter         | Detail                |
| ----------------- | --------------------- |
| **Produk**        | Kenangin Booth        |
| **Versi Dokumen** | v0.3 (Updated)        |
| **Tanggal**       | 29 September 2026     |
| **Owner**         | Founder / Super Admin |
| **Status**        | Draft                 |

## 1\. Latar Belakang &amp; Deskripsi Produk 

Kenangin Booth adalah layanan mini photobooth fisik berbasis web application yang ditempatkan di kafe mitra melalui skema kerja sama B2B. Pengunjung kafe dapat menikmati sesi foto mandiri (*self-service*) secara langsung di lokasi. Perangkat menjalankan antarmuka web yang terhubung ke jaringan internet untuk memproses transaksi pembayaran digital QRIS, sesi foto, pencetakan fisik, serta pengiriman/unduhan hasil foto digital. Selain itu, sistem ini memungkinkan pemilik *web app* (Super Admin / pihak Kenangin) untuk memantau status operasional dan aktivitas perangkat *photo booth* secara *live* (*real-time*). 

## 2\. Model Bisnis &amp; Skema Bagi Hasil 

* **Mekanisme Pembayaran:** Pengunjung membayar per sesi foto secara mandiri melalui *kiosk*.
* **Penetapan Harga:** Ditetapkan dan dikelola oleh pihak Kafe (*Admin Kafe*).
* **Metode Pembayaran:** QRIS *real-time* via Payment Gateway (Midtrans / Xendit).
* **Pembagian Pendapatan &amp; Alokasi Finansial (note: bisa di atur ke super admin):**  
  * **Admin (Pihak Kafe):** Mendapatkan max bagian **40%** dari total nilai transaksi sebagai kompensasi tempat dan fasilitas listrik.
  * **Super Admin (Kenangin):** Mendapatkan minimal bagian **60%** yang dialokasikan internal untuk:  
    * **Operasional (20%):** Mencakup biaya potongan transaksi QRIS Payment Gateway (0.7%), pengadaan kertas foto/tinta printer, server *cloud storage*, serta infrastruktur web.
    * **Maintenance (10%):** Perawatan berkala *hardware* kiosk, kamera, printer, dan cadangan perbaikan/penggantian unit.
    * **Pengembangan / R&amp;D (10%):** Pengembangan fitur aplikasi web, penambahan template/frame foto, dan integrasi sistem.
    * **Keuntungan Bersih / Profit (20%):** Margin keuntungan bersih bisnis Kenangin.

## 3\. Peran Pengguna &amp; Hak Akses (User Roles &amp; Access Control) 

### 3.1 Pengunjung (End-User / Guest) 

* Pengguna *self-service* di depan mesin *kiosk*.
* Memilih paket, melakukan pembayaran QRIS, Memilih frame, melakukan sesi foto, Memilih foto yang akan di pakai serta menerima hasil cetak dan digital. (opsional)

### 3.2 Admin (Pihak Kafe) 

* Pengelola operasional kafe mitra.
* **Hak Akses:**  
  * Membuat, mengedit, dan mengelola paket foto (harga dan kustomisasi fitur aktif) khusus untuk kafenya, dengan validasi batas harga minimal.
  * Mengunggah, mengedit, dan mengelola variasi *frame* foto (template/overlay *frame*) khusus untuk kafenya sendiri.
  * Melihat laporan transaksi dan pendapatan (*revenue*) khusus untuk kafenya sendiri (porsi 50%).

### 3.3 Super Admin (Pihak Kenangin) 

* Pemilik platform Kenangin Booth.
* **Hak Akses:**  
  * Kelola pendaftaran kafe mitra (*merchant onboarding* &amp; manajemen akun kafe).
  * Melihat laporan keuangan menyeluruh: total *revenue* seluruh kafe mitra, rincian *revenue* per masing-masing kafe, serta breakdown alokasi Kenangin (50% total: 10% operasional, 10% maintenance, 10% pengembangan, 20% profit).
  * **Pengaturan Sistem Global (** **system\_settings** **):** Menentukan batas harga minimal paket (min\_package\_price) dan mengelola Master Opsi Fitur Paket yang tersedia untuk Admin Kafe.

## 4\. Alur Pengguna Utama (User Flow Pengunjung) 

* **Pilih Paket Foto:** Pengunjung memilih paket foto yang tersedia di layar *kiosk*.
* **Pembayaran &amp; Verifikasi QRIS:** Layar menampilkan kode QRIS dinamis via Payment Gateway. Pengunjung melakukan pemindaian (*scan*) dan pembayaran, lalu sistem memverifikasi transaksi tersebut secara otomatis secara *real-time*.
* **Pilih Frame Foto:** Setelah pembayaran berhasil terverifikasi, sistem membuka layar pilihan variasi desain frame untuk dipilih oleh pengunjung.
* **Sesi Foto:** Sistem memulai *countdown* dan proses pengambilan foto.
* **Pilih Foto:** Pengunjung menyeleksi/memilih foto terbaik dari hasil jepretan sesi foto untuk dimasukkan ke dalam layout frame.

* **Output Hasil (Cetak &amp; Digital):**  
  * Mesin mencetak lembaran foto fisik secara otomatis.
  * Layar menyediakan opsi input *email* (opsional) untuk mengirimkan file foto digital ke alamat email pengunjung.

## 5\. Ruang Lingkup &amp; Fitur (Scope &amp; Features) 

### 5.1 Antarmuka Kiosk (Web App Front-End) 

* Tampilan antarmuka *kiosk* responsif di browser pada komponen hardware terpasang.
* Integrasi Payment Gateway untuk *generate* QRIS dinamis dan verifikasi status pembayaran *real-time*.
* Modul kamera *kiosk* (live preview, countdown timer, capture, &amp; overlay frame).
* Pemicu cetak (*print trigger*) ke printer lokal serta modul *download* QR / kirim email.

### 5.2 Dashboard Admin (Pihak Kafe) 

* **Manajemen Paket:** Buat dan ubah paket sesi foto.
* **Laporan Pendapatan Kafe:** Ringkasan pendapatan kafe (porsi 40%) dan riwayat transaksi harian/bulanan.

### 5.3 Dashboard Super Admin (Pihak Kenangin) 

1. **Manajemen Kafe Mitra:** Tambah, ubah, dan nonaktifkan data kafe mitra serta kredensial akun Admin Kafe.
2. **Laporan Pendapatan Terpusat:** Monitoring *real-time* untuk akumulasi seluruh pendapatan, breakdown per kafe, dan porsi Kenangin (60% beserta breakdown pos alokasinya: 10% operasional, 10% maintenance, 10% R&amp;D, 20% profit).
3. **Pengaturan Sistem (System Settings):**
4. Kontrol nilai min\_package\_price global secara dinamis.
5. **Master Feature Configurator:** Mengatur daftar fitur paket yang aktif/dapat digunakan oleh Admin Kafe.

### 5.4 Detail Fitur Paket Dinamis (Dynamic Package Features) 

Fitur yang dapat diatur oleh Admin Kafe (berdasarkan opsi master dari Super Admin) disimpan dalam format JSONB pada database: 

* **Sesi Foto &amp; Kontrol Kamera:**  
  * photo\_shots\_count (Number): Jumlah jepretan foto saat sesi.
  * retake\_limit (Number): Kuota kesempatan foto ulang.
  * timer\_duration (Number): Durasi hitung mundur antarfoto (detik).
* **Editing &amp; Kustomisasi Visual:**  
  * allow\_frame (Boolean): Akses pemilihan koleksi frame foto.
  * allow\_emoji (Boolean): Akses menambah stiker dan emoji pada foto.
  * allow\_filters (Boolean): Akses menggunakan preset efek foto (B&amp;W, Vintage, Sepia, Warm).
  * allow\_custom\_text (Boolean): Akses menambahkan teks kustom pada foto.
* **Hasil Cetak Fisik:**  
  * print\_copies\_count (Numbe): Jumlah lembar cetak fisik foto.

## 6\. Kebutuhan Non-Fungsional (Non-Functional Requirements) 

* **Konektivitas Internet:** **Online-Only**. Perangkat wajib selalu terhubung ke jaringan internet untuk pemrosesan pembayaran QRIS via Payment Gateway, upload media, dan pengiriman email.
* **Hardware:** Menjalankan aplikasi web pada komponen hardware *kiosk* siap pakai (*turnkey*) yang terhubung dengan layar sentuh, kamera, dan printer foto.

## 7\. ERD 
// ==========================================
// KENANGIN BOOTH DATABASE SCHEMA v1.4 (DBML)
// Dynamic Package Features (JSONB) & System Settings
// PostgreSQL Native Datatypes
// Pembaruan:
// 1. Foto dokumentasi disederhanakan menjadi 1 kolom (photo_url) pada maintenance_logs
// 2. Rincian biaya tetap dipisah ke maintenance_cost_items (One-to-Many)
// ==========================================

Enum user_role {
  super_admin
  cafe_admin
}

Enum payment_status {
  pending
  settlement
  expire
  cancel
  deny
}

Enum kiosk_status {
  active
  maintenance
  offline
}

Enum print_status {
  pending
  printed
  failed
}

Enum maintenance_type {
  routine
  repair
  paper_refill
  software_update
  other
}

Table users {
  id uuid [pk, default: `gen_random_uuid()`, note: 'Primary Key UUID v4']
  email varchar [not null, unique]
  password_hash varchar [note: 'Hash password (Bcrypt/Argon2)']
  full_name varchar [not null]
  role user_role [not null, default: 'cafe_admin']
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]

  Note: 'Tabel profil pengguna (Super Admin Kenangin & Admin Kafe)'
}

Table system_settings {
  id uuid [pk, default: `gen_random_uuid()`]
  setting_key varchar [not null, unique, note: 'Key konfigurasi global, misal: min_package_price, available_package_features']
  setting_value text [not null, note: 'Nilai konfigurasi (String / Stringified JSON)']
  description text [note: 'Deskripsi kegunaan konfigurasi']
  updated_by uuid [ref: > users.id, note: 'ID Super Admin yang melakukan pembaruan']
  updated_at timestamptz [default: `now()`]

  Note: 'Tabel master konfigurasi global sistem yang dikelola Super Admin'
}

Table cafes {
  id uuid [pk, default: `gen_random_uuid()`]
  name varchar [not null, note: 'Nama Kafe Mitra']
  slug varchar [not null, unique, note: 'Identifier unik kafe']
  address text [note: 'Alamat fisik kafe']
  phone varchar
  cafe_share_percent integer [not null, default: 40, note: 'Porsi revenue Kafe (40%)']
  kenangin_share_percent integer [not null, default: 60, note: 'Porsi revenue Kenangin (60%)']
  is_active boolean [default: true]
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]

  Note: 'Tabel master data kafe mitra B2B'
}

Table cafe_users {
  id uuid [pk, default: `gen_random_uuid()`]
  cafe_id uuid [not null, ref: > cafes.id]
  user_id uuid [not null, ref: > users.id]
  created_at timestamptz [default: `now()`]

  Note: 'Relasi akun Admin Kafe dengan kafe yang dikelola'
}

Table kiosks {
  id uuid [pk, default: `gen_random_uuid()`]
  cafe_id uuid [not null, ref: > cafes.id]
  kiosk_code varchar [not null, unique, note: 'Kode unik mesin kiosk (misal: KSK-BDG-01)']
  name varchar [not null, note: 'Nama/Lokasi sudut kiosk']
  status kiosk_status [default: 'active']
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]

  Note: 'Tabel unit hardware kiosk fisik di lokasi kafe'
}

Table booth_packages {
  id uuid [pk, default: `gen_random_uuid()`]
  cafe_id uuid [not null, ref: > cafes.id]
  name varchar [not null, note: 'Nama paket (misal: Single Strip, Premium Fun)']
  price integer [not null, note: 'Harga per sesi (Wajib >= min_package_price dari system_settings)']
  photo_shots_count integer [not null, default: 4, note: 'Jumlah jepretan foto saat sesi']
  print_copies_count integer [not null, default: 1, note: 'Jumlah cetakan fisik']
  
  // Konfigurasi fitur paket dinamis dalam PostgreSQL JSONB
  features jsonb [not null, note: 'Konfigurasi fitur: {"allow_frame": true, "allow_emoji": true, "allow_filters": true, "allow_custom_text": false, "retake_limit": 1, "timer_duration": 5}']
  
  description text
  is_active boolean [default: true]
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]

  Note: 'Master paket sesi foto yang dikelola Admin Kafe dengan kustomisasi fitur JSONB'
}

Table frames {
  id uuid [pk, default: `gen_random_uuid()`]
  cafe_id uuid [ref: > cafes.id, note: 'NULL jika frame global milik Super Admin Kenangin']
  title varchar [not null, note: 'Nama desain frame']
  frame_url text [not null, note: 'URL file overlay template frame PNG']
  max_photos_slot integer [not null, default: 3, note: 'Jumlah slot foto dalam frame']
  is_active boolean [default: true]
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]

  Note: 'Master desain frame (Global Kenangin atau Custom Kafe)'
}

Table booth_transactions {
  id uuid [pk, default: `gen_random_uuid()`]
  kiosk_id uuid [not null, ref: > kiosks.id]
  cafe_id uuid [not null, ref: > cafes.id]
  package_id uuid [not null, ref: > booth_packages.id]
  order_id varchar [not null, unique, note: 'Kode order unik Payment Gateway']
  
  gross_amount integer [not null, note: 'Total bayar transaksi (gross)']
  cafe_share_amount integer [not null, note: 'Porsi Kafe (40% gross)']
  kenangin_share_amount integer [not null, note: 'Porsi Kenangin (60% gross)']
  
  // Breakdown Internal Kenangin (60%)
  operasional_amount integer [not null, note: 'Alokasi Operasional (20% gross, termasuk QRIS 0.7%)']
  maintenance_amount integer [not null, note: 'Alokasi Maintenance (10% gross)']
  rnd_amount integer [not null, note: 'Alokasi R&D / Pengembangan (10% gross)']
  profit_amount integer [not null, note: 'Alokasi Profit Bersih (20% gross)']

  payment_status payment_status [default: 'pending']
  payment_type varchar [note: 'qris']
  snap_token varchar
  paid_at timestamptz
  created_at timestamptz [default: `now()`]

  Note: 'Pencatatan transaksi pembayaran QRIS murni dan breakdown otomatis alokasi finansial'
}

Table sessions {
  id uuid [pk, default: `gen_random_uuid()`]
  transaction_id uuid [not null, unique, ref: > booth_transactions.id]
  frame_id uuid [not null, ref: > frames.id, note: 'Desain frame yang dipilih pengunjung setelah pembayaran sukses']
  session_code varchar [not null, unique, note: 'Kode unik sesi foto di kiosk']
  print_status print_status [default: 'pending']
  
  // Fitur Opsional Kirim Email & Drive Upload
  guest_email varchar [note: 'Email pengunjung (opsional, NULL jika pengunjung melewati opsi email)']
  final_drive_url text [note: 'Link Google Drive (NULL jika pengunjung tidak minta kirim email)']
  email_sent_at timestamptz [note: 'Waktu email terkirim (NULL jika tidak minta email)']
  
  created_at timestamptz [default: `now()`]

  Note: 'Tabel penyimpan detail operasional sesi foto, frame pilihan pengunjung, status cetak lokal, dan log email/Drive'
}

Table maintenance_logs {
  id uuid [pk, default: `gen_random_uuid()`]
  kiosk_id uuid [not null, ref: > kiosks.id, note: 'Kiosk unit yang dilakukan pemeliharaan/perbaikan']
  performed_by uuid [ref: > users.id, note: 'User/Admin/Teknisi yang mencatat atau melakukan maintenance']
  type maintenance_type [not null, default: 'routine', note: 'Kategori tindakan: routine, repair, paper_refill, software_update, other']
  title varchar [not null, note: 'Judul singkat (misal: Perbaikan Printer & Ganti Kabel)']
  description text [note: 'Detail kendala dan tindakan perbaikan']
  photo_url text [note: 'URL 1 foto bukti dokumentasi/nota (opsional)']
  performed_at timestamptz [default: `now()`, note: 'Waktu eksekusi maintenance']
  created_at timestamptz [default: `now()`]

  Note: 'Tabel utama riwayat log pemeliharaan dan perbaikan hardware kiosk'
}

Table maintenance_cost_items {
  id uuid [pk, default: `gen_random_uuid()`]
  maintenance_log_id uuid [not null, ref: > maintenance_logs.id, note: 'Foreign Key ke log maintenance']
  item_name varchar [not null, note: 'Nama komponen/item (misal: Roll Kertas Thermal 2x, Kabel HDMI 2m)']
  amount integer [not null, default: 0, note: 'Biaya per item dalam Rupiah']
  description text [note: 'Catatan tambahan terkait item biaya']
  created_at timestamptz [default: `now()`]

  Note: 'Tabel rincian item biaya (1 log maintenance bisa memiliki banyak rincian biaya)'
}