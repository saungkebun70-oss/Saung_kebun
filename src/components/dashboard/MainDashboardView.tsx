import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  Users, 
  ArrowUpRight, 
  ChevronRight, 
  Calendar, 
  CheckCircle2, 
  DollarSign, 
  QrCode,
  Wallet,
  ArrowRight,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { PaymentModal } from '../finance/PaymentModal';

export const MainDashboardView: React.FC = () => {
  const { 
    currentUser, 
    cashTransactions, 
    duesPayments, 
    houses, 
    announcements, 
    documentRequests,
    complaints,
    bookings,
    setActiveTab 
  } = useApp();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Financial calculations
  const totalIncome = cashTransactions
    .filter(t => t.type === 'Pemasukan')
    .reduce((sum, t) => sum + t.amount, 0);

  // Current Balance (Saldo Kas Berjalan)
  const currentBalance = cashTransactions[0]?.balanceAfter || 31030000;

  // Active Resident Demographics
  const activeHouses = houses.filter(h => h.ownershipStatus !== 'Kosong');
  const activeHousesCount = activeHouses.length;
  const activeResidentPeopleCount = houses.reduce((sum, h) => sum + (h.occupantCount || 0), 0);
  const permanentResidentCount = houses.filter(h => h.ownershipStatus === 'Pemilik Tetap').length;
  const contractResidentCount = houses.filter(h => h.ownershipStatus === 'Pengontrak').length;

  // Pending Requests (Snapshot Antrean)
  const pendingDuesCount = duesPayments.filter(p => p.status === 'Menunggu Konfirmasi').length;
  const pendingDocsCount = documentRequests.filter(d => d.status === 'Menunggu Review').length;
  const pendingComplaintsCount = complaints.filter(c => c.status === 'Menunggu Penanganan').length;
  const pendingBookingsCount = bookings.filter(b => b.status === 'Menunggu Persetujuan').length;
  const totalPendingRequests = pendingDuesCount + pendingDocsCount + pendingComplaintsCount + pendingBookingsCount;

  const pendingVerificationCount = pendingDuesCount;
  const unpaidHousesCount = houses.filter(h => h.duesStatus !== 'Lunas').length;

  const totalUsersCount = 5;
  const pengurusCount = 2;
  const wargaCount = 3;

  // Format Rupiah
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  // Bar chart monthly revenue dataset
  const monthlyData = [
    { month: 'Jan', amount: 720000, label: '720k', heightPercent: 82 },
    { month: 'Feb', amount: 480000, label: '480k', heightPercent: 54 },
    { month: 'Mar', amount: 0, label: '0k', heightPercent: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* 0. Quick Summary Snapshot Section */}
      <section className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider">
              Ringkasan Cepat & Snapshot Eksekutif
            </h2>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-stone-500 font-mono">
            <span>Pembaruan Real-Time</span>
            <span aria-hidden="true">·</span>
            <span>RT 04 / RW 08 Saung Kebun</span>
          </div>
        </div>

        {/* 3 Snapshot Columns: Current Balance, Active Resident Count, Pending Requests */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Snapshot 1: Current Balance */}
          <div 
            onClick={() => setActiveTab('buku-kas')}
            className="group p-4 rounded-xl bg-gradient-to-br from-emerald-50/70 to-emerald-50/20 border border-emerald-100/80 hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wide block">
                  Saldo Kas Berjalan
                </span>
                <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-emerald-950 mt-1">
                  {formatIDR(currentBalance)}
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                <Wallet className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-emerald-100/60 text-xs">
              <span className="text-[11px] text-emerald-700 font-medium">
                Kas sehat & terverifikasi
              </span>
              <span className="text-emerald-800 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Buku Kas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Snapshot 2: Active Resident Count */}
          <div 
            onClick={() => setActiveTab('data-warga')}
            className="group p-4 rounded-xl bg-gradient-to-br from-blue-50/70 to-blue-50/20 border border-blue-100/80 hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wide block">
                  Warga Aktif Terdata
                </span>
                <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-blue-950 mt-1">
                  {activeResidentPeopleCount} Jiwa
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-blue-100/60 text-xs">
              <span className="text-[11px] text-blue-700 font-medium truncate">
                {activeHousesCount} Kavling ({permanentResidentCount} Tetap, {contractResidentCount} Sewa)
              </span>
              <span className="text-blue-800 font-bold flex items-center gap-1 shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">
                <span>Warga</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Snapshot 3: Pending Requests */}
          <div 
            onClick={() => {
              if (pendingDuesCount > 0) setActiveTab('iuran');
              else if (pendingDocsCount > 0) setActiveTab('surat-menyurat');
              else if (pendingComplaintsCount > 0) setActiveTab('pengaduan');
              else setActiveTab('iuran');
            }}
            className="group p-4 rounded-xl bg-gradient-to-br from-amber-50/70 to-amber-50/20 border border-amber-100/80 hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide">
                    Antrean Permohonan
                  </span>
                  {totalPendingRequests > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  )}
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-amber-950 mt-1">
                  {totalPendingRequests} Berkas
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-amber-100/60 text-xs">
              <span className="text-[11px] text-amber-700 font-medium truncate">
                {pendingDuesCount} Iuran · {pendingDocsCount} Surat · {pendingComplaintsCount} Aduan
              </span>
              <span className="text-amber-800 font-bold flex items-center gap-1 shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">
                <span>Tinjau</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Hero Banner matching image.png */}
      <div className="relative rounded-2xl bg-[#10B981] text-white p-5 sm:p-7 shadow-sm overflow-hidden">
        {/* Subtle decorative curved shape on the right */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-emerald-400/20 pointer-events-none" />
        <div className="absolute right-10 -bottom-16 w-52 h-52 rounded-full bg-emerald-600/30 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="truncate">Selamat Datang, {currentUser.name}</span>
              <span className="text-xl sm:text-2xl shrink-0">👋</span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-50 mt-1 font-normal opacity-95">
              Ringkasan pengelolaan keuangan & lingkungan Saung Kebun
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-[#10B981] bg-white hover:bg-stone-50 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Bayar Iuran Digital</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Summary Metric Cards (Responsive 1 or 2 columns on mobile, 4 on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Pemasukan */}
        <div className="bg-white rounded-2xl border border-stone-200/70 p-4 sm:p-5 shadow-xs flex items-center justify-between transition-all hover:shadow-sm">
          <div className="min-w-0 flex-1 mr-2">
            <span className="text-xs font-medium text-stone-500 block mb-1 truncate">
              Total Pemasukan
            </span>
            <div className="text-lg sm:text-2xl font-extrabold text-stone-900 tracking-tight font-mono tabular-nums truncate">
              {formatIDR(totalIncome || 31030000)}
            </div>
          </div>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-xs">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
        </div>

        {/* Card 2: Menunggu Verifikasi */}
        <div className="bg-white rounded-2xl border border-stone-200/70 p-4 sm:p-5 shadow-xs flex items-center justify-between transition-all hover:shadow-sm">
          <div className="min-w-0 flex-1 mr-2">
            <span className="text-xs font-medium text-stone-500 block mb-1 truncate">
              Menunggu Verifikasi
            </span>
            <div className="text-lg sm:text-2xl font-extrabold text-blue-600 tracking-tight font-mono tabular-nums truncate">
              {pendingVerificationCount}
            </div>
          </div>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#3B82F6] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
        </div>

        {/* Card 3: Belum Bayar */}
        <div className="bg-white rounded-2xl border border-stone-200/70 p-4 sm:p-5 shadow-xs flex items-center justify-between transition-all hover:shadow-sm">
          <div className="min-w-0 flex-1 mr-2">
            <span className="text-xs font-medium text-stone-500 block mb-1 truncate">
              Belum Bayar
            </span>
            <div className="text-lg sm:text-2xl font-extrabold text-[#F59E0B] tracking-tight font-mono tabular-nums truncate">
              {unpaidHousesCount}
            </div>
          </div>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center shrink-0 shadow-xs">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
        </div>

        {/* Card 4: Total User */}
        <div className="bg-white rounded-2xl border border-stone-200/70 p-4 sm:p-5 shadow-xs flex items-center justify-between transition-all hover:shadow-sm">
          <div className="min-w-0 flex-1 mr-2">
            <span className="text-xs font-medium text-stone-500 block mb-1 truncate">
              Total User
            </span>
            <div className="text-lg sm:text-2xl font-extrabold text-stone-900 tracking-tight font-mono tabular-nums truncate">
              {totalUsersCount}
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold truncate">
              <span className="text-purple-600">{pengurusCount} Pengurus</span>
              <span className="text-[#10B981]">{wargaCount} Warga</span>
            </div>
          </div>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#A855F7] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* 3. Bar Chart "Pendapatan Bulanan" matching image.png */}
      <div className="bg-white rounded-2xl border border-stone-200/70 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-stone-900">
            Pendapatan Bulanan
          </h3>
          <span className="text-xs text-stone-400 font-mono">Tahun 2026</span>
        </div>

        {/* Chart Canvas Area */}
        <div className="h-64 sm:h-72 w-full pt-4 relative flex flex-col justify-between">
          {/* Y-Axis Guidelines & Grid */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[11px] text-stone-400 font-mono pr-4">
            <div className="flex items-center gap-2 w-full">
              <span className="w-8 text-right">800k</span>
              <div className="flex-1 border-b border-stone-100 border-dashed" />
            </div>
            <div className="flex items-center gap-2 w-full">
              <span className="w-8 text-right">600k</span>
              <div className="flex-1 border-b border-stone-100 border-dashed" />
            </div>
            <div className="flex items-center gap-2 w-full">
              <span className="w-8 text-right">400k</span>
              <div className="flex-1 border-b border-stone-100 border-dashed" />
            </div>
            <div className="flex items-center gap-2 w-full">
              <span className="w-8 text-right">200k</span>
              <div className="flex-1 border-b border-stone-100 border-dashed" />
            </div>
            <div className="flex items-center gap-2 w-full">
              <span className="w-8 text-right">0k</span>
              <div className="flex-1 border-b border-stone-200" />
            </div>
          </div>

          {/* Bar Columns Container (Aligned to Y-axis) */}
          <div className="h-full pl-12 pr-4 flex items-end justify-around relative z-10 pb-6">
            {monthlyData.map((data, index) => {
              const isHovered = hoveredBarIndex === index;

              return (
                <div 
                  key={data.month} 
                  className="flex flex-col items-center flex-1 max-w-[140px] sm:max-w-[180px] h-full justify-end relative group cursor-pointer"
                  onMouseEnter={() => setHoveredBarIndex(index)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                >
                  {/* Tooltip on Hover */}
                  {isHovered && data.amount > 0 && (
                    <div className="absolute -top-9 bg-stone-900 text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-md shadow-md pointer-events-none z-20 whitespace-nowrap">
                      {formatIDR(data.amount)}
                    </div>
                  )}

                  {/* Vertical Bar (Pure Emerald Green matching image.png) */}
                  <div 
                    className="w-full bg-[#10B981] hover:bg-[#059669] rounded-t-md transition-all duration-300"
                    style={{ height: `${data.heightPercent}%` }}
                  />

                  {/* X-Axis Label */}
                  <span className="absolute -bottom-6 text-xs font-medium text-stone-600 font-sans">
                    {data.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid: "Pembayaran Terbaru" & "Pengumuman" matching image.png */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Pembayaran Terbaru */}
        <div className="bg-white rounded-2xl border border-stone-200/70 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900">
                Pembayaran Terbaru
              </h3>
              <button
                onClick={() => setActiveTab('iuran')}
                className="text-xs font-semibold text-[#10B981] hover:text-[#059669] flex items-center gap-0.5"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-stone-100 mt-2">
              {duesPayments.slice(0, 4).map((pay) => (
                <div key={pay.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-stone-900">{pay.residentName}</p>
                      <span className="text-[10px] text-stone-500 font-medium">({pay.blockAndNumber})</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {pay.periodMonth} · Via {pay.paymentMethod} · {pay.paymentDate}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-stone-900 font-mono tabular-nums block">
                      {formatIDR(pay.amount)}
                    </span>
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${
                      pay.status === 'Lunas'
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-amber-50 text-amber-800'
                    }`}>
                      {pay.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Rekonsiliasi Kas Otomatis</span>
            <span className="font-semibold text-emerald-700">QRIS & Transfer Aktif</span>
          </div>
        </div>

        {/* Right Card: Pengumuman */}
        <div className="bg-white rounded-2xl border border-stone-200/70 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900">
                Pengumuman
              </h3>
              <button
                onClick={() => setActiveTab('pengumuman')}
                className="text-xs font-semibold text-[#10B981] hover:text-[#059669] flex items-center gap-0.5"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-stone-100 mt-2 space-y-1">
              {announcements.slice(0, 3).map((ann) => (
                <div key={ann.id} className="py-3 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {ann.category}
                    </span>
                    <span>{ann.publishedAt}</span>
                  </div>
                  <h4 className="font-bold text-stone-900 line-clamp-1">{ann.title}</h4>
                  <p className="text-stone-600 text-[11px] line-clamp-2 mt-0.5 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Broadcast RT 04 / RW 08</span>
            <span className="text-stone-400">Diperbarui berkala</span>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
        />
      )}
    </div>
  );
};
