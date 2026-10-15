import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  HeartHandshake, 
  Receipt, 
  Building, 
  Search,
  Sparkles,
  QrCode
} from 'lucide-react';
import { PaymentModal } from './PaymentModal';
import { CashTransaction, DonationCampaign } from '../../types';

export const FinanceModule: React.FC = () => {
  const { 
    currentUser, 
    houses, 
    duesPayments, 
    verifyDuesPayment, 
    cashTransactions, 
    addCashTransaction, 
    campaigns, 
    donations, 
    donateToCampaign, 
    createCampaign 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'iuran' | 'kas' | 'donasi'>('iuran');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedHouseForPay, setSelectedHouseForPay] = useState<string | undefined>(undefined);

  // Filters for Iuran
  const [blockFilter, setBlockFilter] = useState<string>('Semua');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');

  // Filter & Search for Cash Ledger
  const [cashSearch, setCashSearch] = useState<string>('');
  const [cashTypeFilter, setCashTypeFilter] = useState<'Semua' | 'Pemasukan' | 'Pengeluaran'>('Semua');

  // New Cash Transaction Form Modal
  const [isNewTxModalOpen, setIsNewTxModalOpen] = useState(false);
  const [newTxType, setNewTxType] = useState<'Pemasukan' | 'Pengeluaran'>('Pengeluaran');
  const [newTxCategory, setNewTxCategory] = useState<CashTransaction['category']>('Pemeliharaan Taman & Saung');
  const [newTxAmount, setNewTxAmount] = useState<number>(250000);
  const [newTxDesc, setNewTxDesc] = useState<string>('');

  // Donation Modal
  const [selectedCampaignForDonation, setSelectedCampaignForDonation] = useState<DonationCampaign | null>(null);
  const [donationAmount, setDonationAmount] = useState<number>(100000);
  const [donationDonorName, setDonationDonorName] = useState<string>(currentUser.name);
  const [donationMessage, setDonationMessage] = useState<string>('');
  const [isAnonymousDonation, setIsAnonymousDonation] = useState<boolean>(false);
  const [isDonationSuccess, setIsDonationSuccess] = useState<boolean>(false);

  // New Campaign Modal
  const [isNewCampModalOpen, setIsNewCampModalOpen] = useState(false);
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampCategory, setNewCampCategory] = useState<DonationCampaign['category']>('Santunan Sosial');
  const [newCampTarget, setNewCampTarget] = useState(3000000);
  const [newCampDeadline, setNewCampDeadline] = useState('30 November 2026');
  const [newCampDesc, setNewCampDesc] = useState('');

  // Current Balances & Calculations
  const currentBalance = cashTransactions[0]?.balanceAfter || 31030000;
  
  const totalIncomeThisMonth = cashTransactions
    .filter(t => t.type === 'Pemasukan' && t.date.startsWith('2026-10'))
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenseThisMonth = cashTransactions
    .filter(t => t.type === 'Pengeluaran' && t.date.startsWith('2026-10'))
    .reduce((acc, t) => acc + t.amount, 0);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  // Filtered Houses
  const filteredHouses = houses.filter(h => {
    const matchBlock = blockFilter === 'Semua' || h.block === blockFilter;
    const matchStatus = statusFilter === 'Semua' || h.duesStatus === statusFilter;
    return matchBlock && matchStatus;
  });

  // Filtered Cash
  const filteredCash = cashTransactions.filter(t => {
    const matchType = cashTypeFilter === 'Semua' || t.type === cashTypeFilter;
    const matchSearch = t.description.toLowerCase().includes(cashSearch.toLowerCase()) || 
                        t.category.toLowerCase().includes(cashSearch.toLowerCase());
    return matchType && matchSearch;
  });

  // Pending verification payments
  const pendingPayments = duesPayments.filter(p => p.status === 'Menunggu Konfirmasi');

  const handleOpenPayment = (houseId?: string) => {
    setSelectedHouseForPay(houseId);
    setIsPaymentModalOpen(true);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTxDesc || newTxAmount <= 0) return;
    addCashTransaction({
      type: newTxType,
      category: newTxCategory,
      amount: newTxAmount,
      description: newTxDesc
    });
    setIsNewTxModalOpen(false);
    setNewTxDesc('');
    setNewTxAmount(250000);
  };

  const handleExecuteDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignForDonation || donationAmount <= 0) return;
    donateToCampaign(
      selectedCampaignForDonation.id,
      donationAmount,
      donationDonorName,
      donationMessage,
      isAnonymousDonation
    );
    setIsDonationSuccess(true);
    setTimeout(() => {
      setIsDonationSuccess(false);
      setSelectedCampaignForDonation(null);
      setDonationMessage('');
    }, 1500);
  };

  const handleCreateNewCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampTitle || newCampTarget <= 0) return;
    createCampaign({
      title: newCampTitle,
      category: newCampCategory,
      targetAmount: newCampTarget,
      deadline: newCampDeadline,
      description: newCampDesc
    });
    setIsNewCampModalOpen(false);
    setNewCampTitle('');
    setNewCampDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Subtab Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Pusat Keuangan & Iuran Warga Saung Kebun
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Sistem akuntansi paguyuban transparan, pencatatan iuran kavling, neraca kas, dan donasi sosial.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl shrink-0 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveSubTab('iuran')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeSubTab === 'iuran'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Iuran Warga
          </button>
          <button
            onClick={() => setActiveSubTab('kas')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeSubTab === 'kas'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Buku Kas Real-Time
          </button>
          <button
            onClick={() => setActiveSubTab('donasi')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeSubTab === 'donasi'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Penggalangan Dana & Donasi
          </button>
        </div>
      </div>

      {/* TAB 1: IURAN WARGA */}
      {activeSubTab === 'iuran' && (
        <div className="space-y-6">
          {/* Top Actions & Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-medium text-stone-500">Iuran Bulanan Per Kavling</span>
                <div className="text-2xl font-bold font-mono tabular-nums text-emerald-800 mt-1">
                  Rp 150.000
                </div>
              </div>
              <p className="text-[11px] text-stone-500 mt-3 pt-2 border-t border-stone-100">
                Termasuk: Keamanan 24 Jam (Rp 50rb), Kebersihan (Rp 60rb), Kas Fasum (Rp 25rb), Sosial (Rp 15rb).
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-medium text-stone-500">Status Pembayaran (Okt 2026)</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">
                    {houses.filter(h => h.duesStatus === 'Lunas').length}
                  </span>
                  <span className="text-xs text-stone-500 font-mono tabular-nums">/ {houses.length} Kavling Terisi</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-500 mt-3 pt-2 border-t border-stone-100">
                <span className="text-amber-700 font-medium font-mono tabular-nums">
                  {houses.filter(h => h.duesStatus === 'Belum Lunas').length} Belum Bayar
                </span>
                <span>·</span>
                <span className="text-rose-700 font-medium font-mono tabular-nums">
                  {houses.filter(h => h.duesStatus === 'Menunggak').length} Menunggak
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-medium text-stone-500">Aksi Pembayaran Cepat</span>
                <p className="text-xs text-stone-600 mt-1">
                  Bayar iuran secara instan dengan QRIS atau konfirmasi transfer bank.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-stone-100">
                <button
                  onClick={() => handleOpenPayment()}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Bayar Iuran Digital Sekarang</span>
                </button>
              </div>
            </div>
          </div>

          {/* Pending Verification Banner (For Pengurus / Bendahara) */}
          {pendingPayments.length > 0 && currentUser.role === 'pengurus' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-amber-700" />
                  <h3 className="text-xs font-bold text-amber-900">
                    Verifikasi Pembayaran Masuk ({pendingPayments.length} Pembayaran Perlu Tindakan)
                  </h3>
                </div>
                <span className="text-[11px] text-amber-700 font-medium">Akses Khusus Bendahara</span>
              </div>
              <div className="space-y-2 mt-2">
                {pendingPayments.map((p) => (
                  <div key={p.id} className="bg-white p-3 rounded-lg border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-stone-900">
                        {p.blockAndNumber} · {p.residentName}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Nominal: <strong className="font-mono tabular-nums text-stone-800">{formatIDR(p.amount)}</strong> · Metode: {p.paymentMethod} · Ref: {p.transactionRef} · {p.paymentDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => verifyDuesPayment(p.id, 'Ditolak')}
                        className="px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors"
                      >
                        Tolak
                      </button>
                      <button
                        onClick={() => verifyDuesPayment(p.id, 'Lunas')}
                        className="px-3 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md shadow-xs transition-colors"
                      >
                        Verifikasi & Masukkan Kas
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Blok Rumah:
              </span>
              {['Semua', 'A', 'B', 'C', 'D', 'E'].map(blk => (
                <button
                  key={blk}
                  onClick={() => setBlockFilter(blk)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                    blockFilter === blk
                      ? 'bg-emerald-700 text-white font-semibold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {blk === 'Semua' ? 'Semua Blok' : `Blok ${blk}`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-stone-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs rounded-lg border border-stone-300 p-1.5 text-stone-800 bg-white"
              >
                <option value="Semua">Semua Status</option>
                <option value="Lunas">Lunas</option>
                <option value="Belum Lunas">Belum Lunas</option>
                <option value="Menunggak">Menunggak</option>
              </select>
            </div>
          </div>

          {/* Table: Houses Dues Status */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Kavling</th>
                    <th className="py-3 px-4">Nama Penghuni</th>
                    <th className="py-3 px-4">Status Rumah</th>
                    <th className="py-3 px-4">Iuran Terakhir</th>
                    <th className="py-3 px-4">Status Oktober 2026</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredHouses.map((h) => {
                    const getStatusBadge = (status: string) => {
                      if (status === 'Lunas') {
                        return <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Lunas</span>;
                      }
                      if (status === 'Menunggak') {
                        return <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Menunggak ({h.unpaidMonthsCount} bln)</span>;
                      }
                      return <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Belum Lunas</span>;
                    };

                    return (
                      <tr key={h.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-stone-900 whitespace-nowrap">
                          Blok {h.block}-{h.number}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-stone-900">{h.residentName}</p>
                          <p className="text-[11px] text-stone-500">{h.residentPhone}</p>
                        </td>
                        <td className="py-3.5 px-4 text-stone-600">
                          {h.ownershipStatus}
                        </td>
                        <td className="py-3.5 px-4 text-stone-600 font-mono tabular-nums">
                          {h.lastPaidMonth || '-'}
                        </td>
                        <td className="py-3.5 px-4">
                          {getStatusBadge(h.duesStatus)}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          {h.duesStatus !== 'Lunas' ? (
                            <button
                              onClick={() => handleOpenPayment(h.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
                            >
                              Bayar Iuran
                            </button>
                          ) : (
                            <span className="text-stone-400 text-xs">Terbayar</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BUKU KAS REAL-TIME */}
      {activeSubTab === 'kas' && (
        <div className="space-y-6">
          {/* Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
              <span className="text-xs font-medium text-stone-500">Saldo Akhir Kas Paguyuban</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1">
                {formatIDR(currentBalance)}
              </div>
              <p className="text-[11px] text-stone-500 mt-2">Dikelola transparan oleh Bendahara RT 04</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
              <span className="text-xs font-medium text-stone-500">Total Pemasukan Bulan Berjalan</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700 mt-1 flex items-center gap-1">
                <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                {formatIDR(totalIncomeThisMonth)}
              </div>
              <p className="text-[11px] text-stone-500 mt-2">Iuran warga & donasi sukarela</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
              <span className="text-xs font-medium text-stone-500">Total Pengeluaran Bulan Berjalan</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-rose-700 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-5 h-5 text-rose-600" />
                {formatIDR(totalExpenseThisMonth)}
              </div>
              <p className="text-[11px] text-stone-500 mt-2">Honor satpam, kebersihan & rawat saung</p>
            </div>
          </div>

          {/* Visual Budget Allocation Bar */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Struktur Alokasi Pengeluaran Rutin Kas</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-stone-700 font-medium mb-1">
                  <span>Honor Petugas Keamanan (Satpam 24 Jam)</span>
                  <span className="font-mono tabular-nums">Rp 3.200.000 / bln (52%)</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-700 h-2 rounded-full" style={{ width: '52%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-stone-700 font-medium mb-1">
                  <span>Kebersihan & Pengangkutan Truk Sampah DLH</span>
                  <span className="font-mono tabular-nums">Rp 1.800.000 / bln (30%)</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-stone-700 font-medium mb-1">
                  <span>Pemeliharaan Taman Asri, Kebun Hidroponik & Saung</span>
                  <span className="font-mono tabular-nums">Rp 650.000 / bln (11%)</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-600 h-2 rounded-full" style={{ width: '11%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-stone-700 font-medium mb-1">
                  <span>Tagihan Listrik PJU & Air Fasum Saung</span>
                  <span className="font-mono tabular-nums">Rp 420.000 / bln (7%)</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-stone-500 h-2 rounded-full" style={{ width: '7%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Search, Filter & Record Transaction Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari transaksi kas atau keterangan..."
                  value={cashSearch}
                  onChange={(e) => setCashSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
              <select
                value={cashTypeFilter}
                onChange={(e) => setCashTypeFilter(e.target.value as any)}
                className="text-xs rounded-lg border border-stone-300 p-1.5 text-stone-800 bg-white"
              >
                <option value="Semua">Semua Arus</option>
                <option value="Pemasukan">Pemasukan</option>
                <option value="Pengeluaran">Pengeluaran</option>
              </select>
            </div>

            {currentUser.role === 'pengurus' && (
              <button
                onClick={() => setIsNewTxModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Catat Transaksi Kas Baru</span>
              </button>
            )}
          </div>

          {/* Cash Ledger Table */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Deskripsi / Keterangan</th>
                    <th className="py-3 px-4">Pencatat</th>
                    <th className="py-3 px-4 text-right">Nominal</th>
                    <th className="py-3 px-4 text-right">Saldo Kas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono">
                  {filteredCash.map((t) => {
                    const isIncome = t.type === 'Pemasukan';
                    return (
                      <tr key={t.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 px-4 text-stone-700 whitespace-nowrap tabular-nums">
                          {t.date}
                        </td>
                        <td className="py-3 px-4 font-sans font-medium text-stone-800">
                          {t.category}
                        </td>
                        <td className="py-3 px-4 font-sans text-stone-600 max-w-xs">
                          {t.description}
                        </td>
                        <td className="py-3 px-4 font-sans text-[11px] text-stone-500 whitespace-nowrap">
                          {t.recordedBy}
                        </td>
                        <td className={`py-3 px-4 text-right font-bold tabular-nums whitespace-nowrap ${
                          isIncome ? 'text-emerald-700' : 'text-rose-700'
                        }`}>
                          {isIncome ? '+' : '-'}{formatIDR(t.amount)}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-stone-900 tabular-nums whitespace-nowrap">
                          {formatIDR(t.balanceAfter)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PENGGALANGAN DANA & DONASI */}
      {activeSubTab === 'donasi' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-900 text-emerald-50 p-6 rounded-2xl shadow-sm">
            <div>
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                Dana Sosial & Gotong Royong
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Penggalangan Dana Kebajikan Warga Saung Kebun
              </h3>
              <p className="text-xs text-emerald-100/80 mt-1 max-w-xl leading-relaxed">
                Wadah solidaritas antar warga untuk santunan keluarga sakit, duka cita, perbaikan fasilitas kebun bersama, serta kegiatan hari besar lingkungan.
              </p>
            </div>
            {currentUser.role === 'pengurus' && (
              <button
                onClick={() => setIsNewCampModalOpen(true)}
                className="px-4 py-2 text-xs font-bold text-emerald-950 bg-emerald-300 hover:bg-emerald-200 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
              >
                + Buat Penggalangan Dana
              </button>
            )}
          </div>

          {/* Campaign Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((camp) => {
              const percentage = Math.min(100, Math.round((camp.collectedAmount / camp.targetAmount) * 100));
              const isAchieved = camp.collectedAmount >= camp.targetAmount;

              return (
                <div key={camp.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between">
                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {camp.category}
                      </span>
                      <span>Batas: {camp.deadline}</span>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 mb-2 line-clamp-2">
                      {camp.title}
                    </h4>

                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
                      {camp.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2 border-t border-stone-100">
                      <div className="flex justify-between text-xs">
                        <span className="text-stone-500">Terkumpul:</span>
                        <span className="font-bold font-mono tabular-nums text-stone-900">
                          {formatIDR(camp.collectedAmount)}
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isAchieved ? 'bg-emerald-600' : 'bg-emerald-700'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-stone-500">
                        <span>Target: <strong className="font-mono tabular-nums text-stone-700">{formatIDR(camp.targetAmount)}</strong></span>
                        <span className="font-semibold text-emerald-800">{percentage}% ({camp.donorsCount} Donatur)</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-stone-500 truncate">
                      Oleh: {camp.organizer}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedCampaignForDonation(camp);
                        setDonationAmount(100000);
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors shrink-0"
                    >
                      Bantu Donasi
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Donations List */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
            <h4 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-rose-600" />
              <span>Daftar Donatur Terkini</span>
            </h4>
            <div className="divide-y divide-stone-100">
              {donations.map((d) => (
                <div key={d.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-stone-900">{d.donorName}</span>
                    {d.houseBlock && <span className="text-stone-400"> ({d.houseBlock})</span>}
                    {d.message && <p className="text-stone-500 italic mt-0.5 text-[11px]">"{d.message}"</p>}
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono tabular-nums text-emerald-800">{formatIDR(d.amount)}</span>
                    <p className="text-[11px] text-stone-400">{d.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Record Cash Transaction Modal */}
      {isNewTxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full border border-stone-200 shadow-xl p-6">
            <h3 className="text-base font-bold text-stone-900 mb-1">Catat Transaksi Buku Kas</h3>
            <p className="text-xs text-stone-500 mb-4">Input penerimaan atau pengeluaran kas paguyuban Saung Kebun.</p>

            <form onSubmit={handleSaveTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Jenis Arus Kas</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTxType('Pemasukan')}
                    className={`py-2 text-xs font-semibold rounded-lg border text-center ${
                      newTxType === 'Pemasukan'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-700 ring-1 ring-emerald-700'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    + Pemasukan
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTxType('Pengeluaran')}
                    className={`py-2 text-xs font-semibold rounded-lg border text-center ${
                      newTxType === 'Pengeluaran'
                        ? 'bg-rose-50 text-rose-900 border-rose-700 ring-1 ring-rose-700'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    - Pengeluaran
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Kategori</label>
                <select
                  value={newTxCategory}
                  onChange={(e) => setNewTxCategory(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                >
                  <option value="Iuran Warga">Iuran Warga</option>
                  <option value="Honor Petugas Keamanan">Honor Petugas Keamanan</option>
                  <option value="Honor Petugas Kebersihan">Honor Petugas Kebersihan</option>
                  <option value="Pemeliharaan Taman & Saung">Pemeliharaan Taman & Saung</option>
                  <option value="Listrik & Air Fasum">Listrik & Air Fasum</option>
                  <option value="Santunan Sosial">Santunan Sosial</option>
                  <option value="Kas Operasional RT">Kas Operasional RT</option>
                  <option value="Donasi Sukarela">Donasi Sukarela</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  min="1000"
                  step="10000"
                  value={newTxAmount}
                  onChange={(e) => setNewTxAmount(Number(e.target.value))}
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 font-mono tabular-nums text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Keterangan / Deskripsi</label>
                <textarea
                  rows={2}
                  value={newTxDesc}
                  onChange={(e) => setNewTxDesc(e.target.value)}
                  placeholder="Contoh: Pembelian lampu sorot lapangan dan kabel outdoor"
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsNewTxModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Donation Modal */}
      {selectedCampaignForDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full border border-stone-200 shadow-xl p-6">
            <h3 className="text-base font-bold text-stone-900 mb-1">Formulir Donasi Sosial</h3>
            <p className="text-xs text-emerald-800 font-semibold mb-4">{selectedCampaignForDonation.title}</p>

            {isDonationSuccess ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-stone-900">Terima Kasih Atas Donasi Anda!</h4>
                <p className="text-xs text-stone-500 mt-1">Semoga menjadi berkah dan amal jariyah.</p>
              </div>
            ) : (
              <form onSubmit={handleExecuteDonation} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Pilihan Nominal Donasi</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[50000, 100000, 250000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDonationAmount(amt)}
                        className={`py-1.5 text-xs font-mono tabular-nums rounded-lg border text-center ${
                          donationAmount === amt
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-700 font-bold'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {formatIDR(amt)}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="10000"
                    step="10000"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Number(e.target.value))}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 font-mono tabular-nums text-stone-900 mt-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Donatur</label>
                  <input
                    type="text"
                    value={donationDonorName}
                    disabled={isAnonymousDonation}
                    onChange={(e) => setDonationDonorName(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900 disabled:bg-stone-100"
                  />
                  <label className="flex items-center gap-1.5 mt-1.5 text-xs text-stone-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymousDonation}
                      onChange={(e) => setIsAnonymousDonation(e.target.checked)}
                      className="rounded text-emerald-700 focus:ring-emerald-700"
                    />
                    <span>Sembunyikan nama (sebagai Hamba Allah)</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Pesan Doa / Harapan (Opsional)</label>
                  <textarea
                    rows={2}
                    value={donationMessage}
                    onChange={(e) => setDonationMessage(e.target.value)}
                    placeholder="Semoga lekas sembuh dan bermanfaat..."
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setSelectedCampaignForDonation(null)}
                    className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
                  >
                    Kirim Donasi ({formatIDR(donationAmount)})
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* New Campaign Modal */}
      {isNewCampModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full border border-stone-200 shadow-xl p-6">
            <h3 className="text-base font-bold text-stone-900 mb-1">Buat Kampanye Donasi Baru</h3>
            <p className="text-xs text-stone-500 mb-4">Pengurus RT 04 Saung Kebun</p>

            <form onSubmit={handleCreateNewCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Judul Penggalangan</label>
                <input
                  type="text"
                  value={newCampTitle}
                  onChange={(e) => setNewCampTitle(e.target.value)}
                  placeholder="Contoh: Pengadaan Tenda & Kursi Acara Warga"
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Kategori</label>
                  <select
                    value={newCampCategory}
                    onChange={(e) => setNewCampCategory(e.target.value as any)}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  >
                    <option value="Kesehatan Warga">Kesehatan Warga</option>
                    <option value="Renovasi Fasilitas">Renovasi Fasilitas</option>
                    <option value="Santunan Sosial">Santunan Sosial</option>
                    <option value="Peringatan Hari Besar">Peringatan Hari Besar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Target Dana (Rp)</label>
                  <input
                    type="number"
                    min="100000"
                    step="100000"
                    value={newCampTarget}
                    onChange={(e) => setNewCampTarget(Number(e.target.value))}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 font-mono tabular-nums text-stone-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Batas Waktu Pengumpulan</label>
                <input
                  type="text"
                  value={newCampDeadline}
                  onChange={(e) => setNewCampDeadline(e.target.value)}
                  placeholder="Contoh: 15 November 2026"
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Uraian / Deskripsi Tujuan</label>
                <textarea
                  rows={3}
                  value={newCampDesc}
                  onChange={(e) => setNewCampDesc(e.target.value)}
                  placeholder="Jelaskan kebutuhan dan transparansi alokasi dana..."
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsNewCampModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
                >
                  Publikasikan Kampanye
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          defaultHouseId={selectedHouseForPay}
        />
      )}
    </div>
  );
};
