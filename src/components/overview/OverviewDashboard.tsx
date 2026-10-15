import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  FileCheck2, 
  ShieldCheck, 
  AlertCircle, 
  Trees, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ChevronRight,
  Sparkles,
  QrCode,
  Send
} from 'lucide-react';
import { PaymentModal } from '../finance/PaymentModal';

export const OverviewDashboard: React.FC = () => {
  const { 
    currentUser, 
    houses, 
    cashTransactions, 
    documentRequests, 
    complaints, 
    announcements, 
    setActiveTab, 
    triggerPanicAlert,
    panicAlert
  } = useApp();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Financial stats
  const currentBalance = cashTransactions[0]?.balanceAfter || 31030000;
  const paidHousesCount = houses.filter(h => h.duesStatus === 'Lunas').length;
  const totalHouses = houses.length;
  const duesPercentage = Math.round((paidHousesCount / totalHouses) * 100);

  // Pending docs
  const pendingDocsCount = documentRequests.filter(d => d.status === 'Menunggu Review').length;

  // Complaints
  const pendingComplaintsCount = complaints.filter(c => c.status !== 'Selesai').length;

  // Format IDR
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Hero Estate Section */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-2">
                <span className="uppercase tracking-wider">Perumahan Saung Kebun</span>
                <span aria-hidden="true">·</span>
                <span>RT 04 / RW 08</span>
                <span aria-hidden="true">·</span>
                <span>Eco-Living & Paguyuban Mandiri</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 mb-3 max-w-xl text-balance">
                Manajemen Keuangan & Pelayanan Warga yang Transparan dan Asri
              </h1>
              <p className="text-sm text-stone-600 leading-relaxed max-w-xl mb-6">
                Selamat datang di portal terpadu SIP-SK. Pantau iuran kas warga secara terbuka, ajukan surat pengantar resmi RT/RW secara instan, reservasi fasilitas saung kebun, dan lapor aduan lingkungan secara real-time.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-stone-100">
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Bayar Iuran Digital</span>
              </button>

              <button
                onClick={() => setActiveTab('surat-menyurat')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-stone-600" />
                <span>Ajukan Surat Pengantar</span>
              </button>

              <button
                onClick={() => setActiveTab('inventaris')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
              >
                <Trees className="w-3.5 h-3.5 text-emerald-700" />
                <span>Booking Saung</span>
              </button>

              <button
                onClick={() => setActiveTab('pengaduan')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
              >
                <Send className="w-3.5 h-3.5 text-amber-600" />
                <span>Lapor Keluhan</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full">
            <img
              src="/src/assets/images/saung_kebun_hero_1791991915164.jpg"
              alt="Perumahan Saung Kebun"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent flex items-end p-4 text-white">
              <div className="text-xs">
                <p className="font-semibold text-stone-100">Kawasan Saung Kebun Induk</p>
                <p className="text-stone-300">Nuansa hijau tropis dengan balai saung kayu jati serbaguna</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Kas */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-stone-500">Saldo Kas Warga</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold font-mono tabular-nums text-stone-900">
              {formatIDR(currentBalance)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-stone-500">
              <span className="text-emerald-700 font-medium flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> Transparan
              </span>
              <span>·</span>
              <span>Neraca kas terverifikasi</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Dues progress */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-stone-500">Kepatuhan Iuran (Okt 2026)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono tabular-nums text-stone-900">{duesPercentage}%</span>
              <span className="text-xs text-stone-500 font-mono tabular-nums">({paidHousesCount}/{totalHouses} Rumah)</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${duesPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 3: Surat Administrasi */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-stone-500">Layanan Surat RT/RW</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold font-mono tabular-nums text-stone-900">
              {documentRequests.length} Pengajuan
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-stone-500">
              <span className="font-semibold text-amber-700">{pendingDocsCount} Perlu Review</span>
              <span>·</span>
              <span>Digital & Cetak</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Keamanan & Aduan */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-stone-500">Keamanan & Aduan</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold font-mono tabular-nums text-stone-900">
              Pos Kamling Aktif
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-stone-500">
              <span className="text-stone-700 font-medium">{pendingComplaintsCount} Tiket Aduan</span>
              <span>·</span>
              <span>2 Regu Ronda</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Pinned Announcement & Financial Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Announcements & Emergency Safety Prompt (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Pinned Announcement */}
          {announcements.length > 0 && (
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Pengumuman Resmi RT
                  </span>
                  <span className="text-xs text-stone-400">·</span>
                  <span className="text-xs text-stone-500">{announcements[0].publishedAt}</span>
                </div>
                <button
                  onClick={() => setActiveTab('pengumuman')}
                  className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
                >
                  <span>Lihat Semua</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <h2 className="text-base font-bold text-stone-900 mb-2">
                {announcements[0].title}
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                {announcements[0].content}
              </p>

              {announcements[0].eventDate && (
                <div className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-lg text-xs text-stone-700 border border-stone-200/60">
                  <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span><strong>Jadwal Pelaksanaan:</strong> {announcements[0].eventDate}</span>
                </div>
              )}
            </div>
          )}

          {/* Quick Panic Safety Box */}
          <div className="bg-gradient-to-r from-rose-50 to-stone-50 rounded-xl border border-rose-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">Tombol Darurat Terintegrasi (Panic Button)</h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Dalam situasi darurat (kejahatan, medis mendesak, kebakaran), tekan tombol ini untuk membunyikan sirine dan mengirim notifikasi lokasi ke Pos Satpam Saung Kebun.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                if (panicAlert?.active) return;
                triggerPanicAlert(
                  'Darurat Medis',
                  `Laporan darurat cepat dari ${currentUser.name} (${currentUser.position})`
                );
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm whitespace-nowrap shrink-0 transition-colors"
            >
              Uji Coba Panic Alert
            </button>
          </div>

          {/* Complaints / Aduan Preview */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-stone-900">Aspirasi & Laporan Lingkungan Terkini</h3>
              <button
                onClick={() => setActiveTab('pengaduan')}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
              >
                <span>Kelola Aduan</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              {complaints.slice(0, 3).map((cmp) => {
                const getStatusColor = (status: string) => {
                  if (status === 'Selesai') return 'text-emerald-700 bg-emerald-50 border-emerald-200';
                  if (status === 'Dalam Proses') return 'text-amber-700 bg-amber-50 border-amber-200';
                  return 'text-stone-700 bg-stone-100 border-stone-200';
                };

                return (
                  <div key={cmp.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getStatusColor(cmp.status)}`}>
                          {cmp.status}
                        </span>
                        <span className="text-xs text-stone-500 font-medium">{cmp.category}</span>
                        <span className="text-xs text-stone-400">·</span>
                        <span className="text-xs text-stone-400">{cmp.reportedAt}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-stone-900">{cmp.title}</h4>
                      <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{cmp.location} - Dilaporkan oleh {cmp.reportedBy}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Financial Stream & Facility Showcase (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Cash Flow */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-stone-900">Arus Kas Warga Terakhir</h3>
              <button
                onClick={() => setActiveTab('buku-kas')}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
              >
                <span>Buku Kas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {cashTransactions.slice(0, 4).map((tx) => {
                const isIncome = tx.type === 'Pemasukan';
                return (
                  <div key={tx.id} className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-stone-50 border border-stone-100">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                        isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {isIncome ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-stone-900 truncate">{tx.description}</p>
                        <p className="text-[11px] text-stone-500">{tx.date} · {tx.category}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold font-mono tabular-nums shrink-0 ${
                      isIncome ? 'text-emerald-700' : 'text-stone-900'
                    }`}>
                      {isIncome ? '+' : '-'}{formatIDR(tx.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Facility Highlight: Saung Utama Gazebo */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="h-36 relative">
              <img
                src="/src/assets/images/saung_gazebo_facility_1791991914772.jpg"
                alt="Saung Utama Gazebo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[11px] font-medium">
                Fasilitas Unggulan
              </div>
            </div>
            <div className="p-5">
              <h4 className="text-sm font-bold text-stone-900 mb-1">Saung Utama Gazebo & Kebun</h4>
              <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                Paviliun kayu jati asri untuk silaturahmi warga, syukuran, kajian, dan rapat RT. Terbuka gratis untuk seluruh warga Saung Kebun.
              </p>
              <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                <span>Kapasitas: 35-50 orang</span>
                <button
                  onClick={() => setActiveTab('inventaris')}
                  className="font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Pesan Sekarang →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} />
      )}
    </div>
  );
};
