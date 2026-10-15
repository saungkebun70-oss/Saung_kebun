import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Copy, 
  Check, 
  Database, 
  Layers, 
  ShieldCheck, 
  Table, 
  ArrowRight, 
  Lock, 
  Cpu, 
  Server, 
  Smartphone 
} from 'lucide-react';

export const ArchitectureModal: React.FC = () => {
  const { isArchitectureModalOpen, setIsArchitectureModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'arsitektur' | 'sql' | 'rbac'>('arsitektur');
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isArchitectureModalOpen) return null;

  const SQL_DDL_SCHEMA = `-- ========================================================
-- SISTEM INFORMASI PERUMAHAN SAUNG KEBUN (SIP-SK)
-- PRODUCTION DATABASE DDL SCHEMA (PostgreSQL / Relational)
-- ========================================================

-- 1. ENUM TYPES
CREATE TYPE user_role AS ENUM ('pengurus', 'warga', 'satpam');
CREATE TYPE ownership_type AS ENUM ('Pemilik Tetap', 'Pengontrak', 'Kosong');
CREATE TYPE dues_status AS ENUM ('Lunas', 'Belum Lunas', 'Menunggak');
CREATE TYPE payment_status AS ENUM ('Menunggu Konfirmasi', 'Lunas', 'Ditolak');
CREATE TYPE transaction_type AS ENUM ('Pemasukan', 'Pengeluaran');
CREATE TYPE letter_status AS ENUM ('Menunggu Review', 'Disetujui', 'Ditolak');
CREATE TYPE complaint_status AS ENUM ('Menunggu Penanganan', 'Dalam Proses', 'Selesai');
CREATE TYPE priority_level AS ENUM ('Rendah', 'Sedang', 'Tinggi');
CREATE TYPE guest_status AS ENUM ('Di Dalam', 'Sudah Keluar');

-- 2. HOUSES / KAVLING TABLE
CREATE TABLE houses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    block VARCHAR(5) NOT NULL,            -- e.g. 'A', 'B', 'C', 'D', 'E'
    number VARCHAR(10) NOT NULL,          -- e.g. '01', '02', '12'
    address TEXT NOT NULL,
    ownership_status ownership_type NOT NULL DEFAULT 'Pemilik Tetap',
    occupant_count INT NOT NULL DEFAULT 1,
    unpaid_months_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_block_number UNIQUE (block, number)
);

CREATE INDEX idx_houses_block ON houses(block);

-- 3. USERS / PENGHUNI & PENGURUS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    house_id UUID REFERENCES houses(id) ON DELETE SET NULL,
    nik VARCHAR(16) UNIQUE,               -- Nomor Induk Kependudukan
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'warga',
    position VARCHAR(100) NOT NULL,        -- 'Ketua RT', 'Bendahara', 'Warga Tetap', 'Satpam'
    family_members_count INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_house ON users(house_id);

-- 4. REGISTERED VEHICLES (STIKER GERBANG)
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,             -- 'Mobil', 'Motor'
    plate_number VARCHAR(15) UNIQUE NOT NULL,
    model_name VARCHAR(100),
    sticker_rfid_code VARCHAR(50) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. DUES PAYMENTS (IURAN WARGA)
CREATE TABLE dues_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    house_id UUID NOT NULL REFERENCES houses(id) ON DELETE RESTRICT,
    payer_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    period_month VARCHAR(30) NOT NULL,     -- e.g. 'Oktober 2026'
    amount DECIMAL(12,2) NOT NULL,         -- Default Rp 150.000
    fee_kebersihan DECIMAL(12,2) NOT NULL DEFAULT 60000,
    fee_keamanan DECIMAL(12,2) NOT NULL DEFAULT 50000,
    fee_kas_warga DECIMAL(12,2) NOT NULL DEFAULT 25000,
    fee_sosial DECIMAL(12,2) NOT NULL DEFAULT 15000,
    payment_method VARCHAR(50) NOT NULL,   -- 'QRIS', 'BCA', 'Mandiri', 'Tunai'
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status payment_status NOT NULL DEFAULT 'Menunggu Konfirmasi',
    transaction_ref VARCHAR(100) UNIQUE NOT NULL,
    receipt_url TEXT,
    verified_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dues_period ON dues_payments(period_month);
CREATE INDEX idx_dues_house ON dues_payments(house_id);

-- 6. REAL-TIME CASH LEDGER (BUKU KAS UMUM)
CREATE TABLE cash_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dues_payment_id UUID REFERENCES dues_payments(id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    type transaction_type NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(14,2) NOT NULL,
    description TEXT NOT NULL,
    recorded_by_user_id UUID NOT NULL REFERENCES users(id),
    balance_after DECIMAL(14,2) NOT NULL,
    evidence_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cash_date ON cash_transactions(date);

-- 7. DONATION CAMPAIGNS & DONATIONS
CREATE TABLE donation_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    target_amount DECIMAL(14,2) NOT NULL,
    collected_amount DECIMAL(14,2) DEFAULT 0,
    deadline DATE NOT NULL,
    description TEXT NOT NULL,
    organizer_user_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'Aktif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES donation_campaigns(id) ON DELETE CASCADE,
    donor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    donor_display_name VARCHAR(150) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    message TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. DIGITAL OFFICIAL LETTERS (SURAT PENGANTAR RT/RW)
CREATE TABLE document_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    letter_number VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(100) NOT NULL,
    applicant_name VARCHAR(150) NOT NULL,
    applicant_nik VARCHAR(16) NOT NULL,
    house_block VARCHAR(50) NOT NULL,
    applicant_phone VARCHAR(20) NOT NULL,
    purpose TEXT NOT NULL,
    status letter_status NOT NULL DEFAULT 'Menunggu Review',
    request_date DATE DEFAULT CURRENT_DATE,
    approved_date DATE,
    approved_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    digital_signature_hash VARCHAR(255),
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. SECURITY & GATE GUEST LOGS (BUKU TAMU)
CREATE TABLE guest_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_name VARCHAR(150) NOT NULL,
    vehicle_plate VARCHAR(20) NOT NULL,
    destination_house_id UUID REFERENCES houses(id) ON DELETE SET NULL,
    host_name VARCHAR(150) NOT NULL,
    purpose TEXT NOT NULL,
    check_in_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    check_out_time TIMESTAMP WITH TIME ZONE,
    id_card_type VARCHAR(20) DEFAULT 'KTP',
    security_officer_id UUID NOT NULL REFERENCES users(id),
    status guest_status DEFAULT 'Di Dalam'
);

-- 10. PATROL & SISKAMLING SCHEDULES
CREATE TABLE patrol_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patrol_date DATE NOT NULL,
    shift_name VARCHAR(50) NOT NULL,
    team_name VARCHAR(100) NOT NULL,
    leader_user_id UUID NOT NULL REFERENCES users(id),
    checkpoints_completed INT DEFAULT 0,
    total_checkpoints INT DEFAULT 6,
    notes TEXT,
    status VARCHAR(30) DEFAULT 'Terjadwal'
);

-- 11. COMMUNITY FACILITIES & RESERVATIONS
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    capacity VARCHAR(50) NOT NULL,
    description TEXT,
    operational_hours VARCHAR(50),
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE facility_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    applicant_user_id UUID NOT NULL REFERENCES users(id),
    event_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    purpose TEXT NOT NULL,
    guest_count INT NOT NULL DEFAULT 10,
    status letter_status DEFAULT 'Menunggu Review',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. CITIZEN COMPLAINTS & TICKETS (ASPIRASI)
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    reporter_user_id UUID NOT NULL REFERENCES users(id),
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    priority priority_level DEFAULT 'Sedang',
    status complaint_status DEFAULT 'Menunggu Penanganan',
    assigned_officer_id UUID REFERENCES users(id),
    response_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 13. OFFICIAL ANNOUNCEMENTS (PAPAN PENGUMUMAN)
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(250) NOT NULL,
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    author_user_id UUID NOT NULL REFERENCES users(id),
    pinned BOOLEAN DEFAULT FALSE,
    event_date VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. COMMUNITY MARKETPLACE / UMKM
CREATE TABLE marketplace_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    description TEXT,
    whatsapp_number VARCHAR(20) NOT NULL,
    rating DECIMAL(2,1) DEFAULT 5.0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. EMERGENCY PANIC ALERTS
CREATE TABLE panic_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    triggered_by_user_id UUID NOT NULL REFERENCES users(id),
    emergency_type VARCHAR(100) NOT NULL,
    location_notes TEXT,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by_user_id UUID REFERENCES users(id)
);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_DDL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-stone-200 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Arsitektur Sistem & Skema Basis Data SIP-SK</h2>
              <p className="text-xs text-stone-400">Township & Neighborhood Management System Specification</p>
            </div>
          </div>
          <button
            onClick={() => setIsArchitectureModalOpen(false)}
            className="text-stone-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 px-6 py-3 bg-stone-100 border-b border-stone-200">
          <button
            onClick={() => setActiveTab('arsitektur')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'arsitektur'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>Arsitektur Sistem & C4 Model</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'sql'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-blue-700" />
            <span>Skema DDL SQL & Relasi ERD</span>
          </button>
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'rbac'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Matriks Keamanan & RBAC</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700 leading-relaxed">
          {/* TAB 1: SYSTEM ARCHITECTURE */}
          {activeTab === 'arsitektur' && (
            <div className="space-y-6">
              {/* Architecture Overview */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-800" />
                  <span>Ikhtisar Arsitektur SIP-SK (High-Level Architecture)</span>
                </h3>
                <p>
                  Sistem Informasi Perumahan Saung Kebun (SIP-SK) didesain dengan pola <strong>Decoupled Modern Web Architecture</strong> dengan pendekatan <em>Mobile-First Responsive Web Application</em> yang mengutamakan kecepatan akses, transparansi finansial, dan keandalan sistem keamanan darurat secara real-time.
                </p>
              </div>

              {/* Layer Diagram Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-stone-900">
                    <Smartphone className="w-4 h-4 text-emerald-700" />
                    <span>1. Presentation Layer</span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    React 19 + TypeScript + Tailwind CSS dengan Progressive Web App (PWA) readiness. Mengimplementasikan Client-Side State Management terisolasi, offline-first localStorage caching, dan zero-friction quick actions untuk warga di ponsel pintar.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-stone-900">
                    <Server className="w-4 h-4 text-blue-700" />
                    <span>2. API & Service Gateway</span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    RESTful API & WebSockets Event Stream untuk sinkronisasi seketika (khususnya sinyal Panic Button ke Pos Keamanan & status transaksi kas). Integrasi QRIS Aggregator dan SMS/WhatsApp Business Notification Gateway.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-stone-900">
                    <Database className="w-4 h-4 text-amber-700" />
                    <span>3. Data & Storage Layer</span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    Relational Engine (PostgreSQL) dengan ACID Invariants untuk menjamin rekonsiliasi kas tidak pernah selisih, Row-Level Security (RLS), enkripsi data identitas NIK warga, dan digital hash signature untuk surat resmi RT/RW.
                  </p>
                </div>
              </div>

              {/* Data Flow Pipeline */}
              <div className="border border-stone-200 rounded-xl p-5 space-y-3 bg-white">
                <h4 className="font-bold text-stone-900 text-sm">Alur Kerja Utama Sistem (Key Workflows):</h4>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                    <div>
                      <strong className="text-stone-900">Siklus Pembayaran Iuran & Rekonsiliasi Otomatis:</strong>
                      <p className="text-stone-600">
                        Warga memilih bulan iuran → Generate QRIS dinamis → Warga bayar via mobile banking → Webhook callback mencocokkan nomor referensi → Status kavling terupdate "Lunas" otomatis → Saldo kas warga bertambah secara real-time.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                    <div>
                      <strong className="text-stone-900">Layanan Surat Menyurat Digital Tanpa Ketok Pintu:</strong>
                      <p className="text-stone-600">
                        Warga input NIK & keperluan surat → Pengurus menerima notifikasi verifikasi → Ketua RT klik "Setujui" → Sistem generate nomor resmi unik & stempel digital → Warga langsung dapat mengunduh atau mencetak dokumen resmi.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                    <div>
                      <strong className="text-stone-900">Sinyal Tanggap Darurat (Emergency Panic Button):</strong>
                      <p className="text-stone-600">
                        Warga memicu Panic Alert → Web Audio API membunyikan sirine darurat → Koordinat kavling dan nomor kontak pelapor langsung siaga di monitor Pos Satpam Gerbang Induk → Personel regu ronda langsung menuju ke lokasi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SQL DDL */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Skema SQL Relasional Lengkap (DDL)</h3>
                  <p className="text-xs text-stone-500">
                    Kompatibel dengan PostgreSQL / MySQL 8.0, mencakup Foreign Keys, Index, dan Enums.
                  </p>
                </div>
                <button
                  onClick={handleCopySql}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Tersalin ke Clipboard!' : 'Salin Kode SQL DDL'}</span>
                </button>
              </div>

              <div className="bg-stone-900 text-emerald-400 font-mono text-[11px] p-4 rounded-xl overflow-x-auto max-h-[420px] shadow-inner leading-relaxed">
                <pre>{SQL_DDL_SCHEMA}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: RBAC MATRIX */}
          {activeTab === 'rbac' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Matriks Hak Akses Pengguna (Role-Based Access Control)</h3>
                <p className="text-xs text-stone-500">Pemisahan tugas dan kewenangan antara Pengurus, Warga, dan Satpam.</p>
              </div>

              <div className="border border-stone-200 rounded-xl overflow-hidden shadow-xs bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Fitur / Modul Operasional</th>
                      <th className="py-3 px-4 text-center">Pengurus (Ketua/Bendahara)</th>
                      <th className="py-3 px-4 text-center">Warga (Tetap / Kontrak)</th>
                      <th className="py-3 px-4 text-center">Petugas Keamanan (Satpam)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-stone-900">Buku Kas & Catat Transaksi</td>
                      <td className="py-2.5 px-4 text-center text-emerald-700 font-bold">Akses Penuh (Tulis & Verifikasi)</td>
                      <td className="py-2.5 px-4 text-center text-blue-700">Lihat Neraca Transparan</td>
                      <td className="py-2.5 px-4 text-center text-stone-400">Tidak Ada</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-stone-900">Pembayaran Iuran Digital (QRIS/Bank)</td>
                      <td className="py-2.5 px-4 text-center text-emerald-700 font-bold">Verifikasi & Rekonsiliasi</td>
                      <td className="py-2.5 px-4 text-center text-emerald-700 font-bold">Bayar Mandiri</td>
                      <td className="py-2.5 px-4 text-center text-stone-400">Tidak Ada</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-stone-900">Surat Pengantar RT/RW Resmi</td>
                      <td className="py-2.5 px-4 text-center text-emerald-700 font-bold">Review, Setujui & TTD Digital</td>
                      <td className="py-2.5 px-4 text-center text-emerald-700 font-bold">Ajukan & Cetak Dokumen</td>
                      <td className="py-2.5 px-4 text-center text-stone-400">Tidak Ada</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-stone-900">Buku Tamu Masuk/Keluar Gerbang</td>
                      <td className="py-2.5 px-4 text-center text-stone-600">Monitoring Sensus</td>
                      <td className="py-2.5 px-4 text-center text-stone-400">Tidak Ada</td>
                      <td className="py-2.5 px-4 text-center text-emerald-700 font-bold">Input & Check-out Tamu</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-stone-900">Jadwal Siskamling / Ronda Malam</td>
                      <td className="py-2.5 px-4 text-center text-emerald-700 font-bold">Kelola Jadwal & Personel</td>
                      <td className="py-2.5 px-4 text-center text-blue-700">Lihat Giliran Ronda</td>
                      <td className="py-2.5 px-4 text-center text-emerald-700 font-bold">Pimpin Regu & Checkpoint</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-stone-900">Tombol Darurat (Panic Button)</td>
                      <td className="py-2.5 px-4 text-center text-rose-700 font-bold">Terima Alarm & Resolusi</td>
                      <td className="py-2.5 px-4 text-center text-rose-700 font-bold">Tekan Saat Darurat</td>
                      <td className="py-2.5 px-4 text-center text-rose-700 font-bold">Respon Lapangan 24 Jam</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-stone-900">Booking Fasilitas Saung & Lapangan</td>
                      <td className="py-2.5 px-4 text-center text-emerald-700 font-bold">Persetujuan Jadwal</td>
                      <td className="py-2.5 px-4 text-center text-emerald-700 font-bold">Reservasi Tanggal Acara</td>
                      <td className="py-2.5 px-4 text-center text-stone-600">Pengawasan Lokasi</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-stone-900">Etalase UMKM / Pasar Warga</td>
                      <td className="py-2.5 px-4 text-center text-stone-600">Moderasi Produk</td>
                      <td className="py-2.5 px-4 text-center text-emerald-700 font-bold">Jual & Beli Langsung WA</td>
                      <td className="py-2.5 px-4 text-center text-stone-600">Beli Produk</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={() => setIsArchitectureModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs"
          >
            Tutup Dokumentasi
          </button>
        </div>
      </div>
    </div>
  );
};
