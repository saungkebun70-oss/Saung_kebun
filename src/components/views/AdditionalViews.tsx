import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  BarChart2,
  FileSpreadsheet, 
  Calendar, 
  Package, 
  User, 
  Settings, 
  Printer, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign, 
  Database, 
  Download,
  PlusCircle,
  Clock,
  MapPin,
  Users,
  TrendingUp,
  TrendingDown,
  Layers,
  Filter,
  LineChart as LineChartIcon,
  Info,
  ShieldCheck
} from 'lucide-react';

// Monthly Income vs Expense Dataset
interface MonthlyFinancePoint {
  id: string;
  month: string;
  fullMonth: string;
  quarter: string;
  income: number;
  expense: number;
  operationalNotes: string;
}

const ALL_MONTHLY_FINANCE_DATA: MonthlyFinancePoint[] = [
  { id: 'm1', month: 'Jan', fullMonth: 'Januari 2026', quarter: 'Q1', income: 14200000, expense: 11450000, operationalNotes: 'Gaji satpam, sampah & perawatan pos masuk' },
  { id: 'm2', month: 'Feb', fullMonth: 'Februari 2026', quarter: 'Q1', income: 13800000, expense: 12100000, operationalNotes: 'Perbaikan selokan drainase Blok C' },
  { id: 'm3', month: 'Mar', fullMonth: 'Maret 2026', quarter: 'Q1', income: 15500000, expense: 14600000, operationalNotes: 'Pemangkasan dahan pohon peneduh & PJU' },
  { id: 'm4', month: 'Apr', fullMonth: 'April 2026', quarter: 'Q2', income: 16200000, expense: 13900000, operationalNotes: 'Pembersihan menjelang Hari Raya' },
  { id: 'm5', month: 'Mei', fullMonth: 'Mei 2026', quarter: 'Q2', income: 14900000, expense: 12350000, operationalNotes: 'Bibit hidroponik kebun & pupuk tanaman' },
  { id: 'm6', month: 'Jun', fullMonth: 'Juni 2026', quarter: 'Q2', income: 15300000, expense: 13100000, operationalNotes: 'Pengecatan ulang marka jalan perumahan' },
  { id: 'm7', month: 'Jul', fullMonth: 'Juli 2026', quarter: 'Q3', income: 16400000, expense: 14500000, operationalNotes: 'Servis rutin pompa air & lampu sorot saung' },
  { id: 'm8', month: 'Agu', fullMonth: 'Agustus 2026', quarter: 'Q3', income: 17100000, expense: 15200000, operationalNotes: 'Pemasangan umbul-umbul & perlengkapan HUT RI' },
  { id: 'm9', month: 'Sep', fullMonth: 'September 2026', quarter: 'Q3', income: 15800000, expense: 13600000, operationalNotes: 'Pemberian insentif kebersihan & fogging DBD' },
  { id: 'm10', month: 'Okt', fullMonth: 'Oktober 2026', quarter: 'Q4', income: 16900000, expense: 13850000, operationalNotes: 'Berjalan: Pembelian mesin potong rumput baru' },
  { id: 'm11', month: 'Nov', fullMonth: 'November 2026 (Est)', quarter: 'Q4', income: 16500000, expense: 13500000, operationalNotes: 'Estimasi operasional rutin akhir tahun' },
  { id: 'm12', month: 'Des', fullMonth: 'Desember 2026 (Est)', quarter: 'Q4', income: 17500000, expense: 15000000, operationalNotes: 'Estimasi bonus akhir tahun satpam & petugas' }
];

// 1. GRAFIK KEUANGAN VIEW (IMPROVED & FULLY INTERACTIVE)
export const GrafikKeuanganView: React.FC = () => {
  const { cashTransactions } = useApp();
  const [periodFilter, setPeriodFilter] = useState<'3-bulan' | '6-bulan' | 'tahun-ini'>('tahun-ini');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [hoveredPoint, setHoveredPoint] = useState<MonthlyFinancePoint | null>(null);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const formatShortIDR = (val: number) => {
    if (val >= 1000000) {
      return `Rp ${(val / 1000000).toFixed(1)} Jt`;
    }
    return `Rp ${(val / 1000).toFixed(0)} rb`;
  };

  // Filter dataset by period
  const filteredData = React.useMemo(() => {
    if (periodFilter === '3-bulan') {
      return ALL_MONTHLY_FINANCE_DATA.slice(7, 10); // Agu, Sep, Okt
    }
    if (periodFilter === '6-bulan') {
      return ALL_MONTHLY_FINANCE_DATA.slice(4, 10); // Mei s/d Okt
    }
    return ALL_MONTHLY_FINANCE_DATA; // 12 Bulan Tahun Ini
  }, [periodFilter]);

  // Calculations for current period
  const totalIncome = filteredData.reduce((acc, curr) => acc + curr.income, 0);
  const totalExpense = filteredData.reduce((acc, curr) => acc + curr.expense, 0);
  const totalSurplus = totalIncome - totalExpense;
  const savingsRate = ((totalSurplus / totalIncome) * 100).toFixed(1);

  // Maximum value for chart scaling
  const maxVal = Math.max(...filteredData.map(d => Math.max(d.income, d.expense))) * 1.12;

  // Selected or active point for tooltip
  const activeTooltipData = hoveredPoint || filteredData[filteredData.length - 1];

  return (
    <div className="space-y-6">
      {/* Title & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl border border-stone-200/70 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-[#10B981]">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-stone-900">Komparasi Pemasukan vs Pengeluaran Kas</h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Visualisasi tren perbandingan penerimaan iuran warga dan realisasi pengeluaran kas operasional paguyuban RT 04 Saung Kebun.
          </p>
        </div>

        {/* Controls: Period Filter & Chart Mode */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          {/* Period Toggle */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setPeriodFilter('3-bulan')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                periodFilter === '3-bulan' 
                  ? 'bg-white text-emerald-800 shadow-xs font-bold' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              3 Bulan Terakhir
            </button>
            <button
              onClick={() => setPeriodFilter('6-bulan')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                periodFilter === '6-bulan' 
                  ? 'bg-white text-emerald-800 shadow-xs font-bold' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              6 Bulan Terakhir
            </button>
            <button
              onClick={() => setPeriodFilter('tahun-ini')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                periodFilter === 'tahun-ini' 
                  ? 'bg-white text-emerald-800 shadow-xs font-bold' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tahun Ini (2026)
            </button>
          </div>

          {/* Chart Type Toggle */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setChartType('bar')}
              className={`p-1.5 rounded-lg transition-all ${
                chartType === 'bar' 
                  ? 'bg-white text-emerald-700 shadow-xs' 
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Diagram Batang"
            >
              <BarChart2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-1.5 rounded-lg transition-all ${
                chartType === 'line' 
                  ? 'bg-white text-emerald-700 shadow-xs' 
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Grafik Garis"
            >
              <LineChartIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="bg-white rounded-2xl border border-stone-200/70 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-stone-500">Total Pemasukan Periode</span>
            <p className="text-xl font-bold font-mono text-emerald-700 mt-1">{formatIDR(totalIncome)}</p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Iuran Warga & Donasi Kas</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ArrowDownLeft className="w-5 h-5 text-[#10B981]" />
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white rounded-2xl border border-stone-200/70 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-stone-500">Total Pengeluaran Periode</span>
            <p className="text-xl font-bold font-mono text-rose-600 mt-1">{formatIDR(totalExpense)}</p>
            <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-1">
              <span>Keamanan, Sampah & PJU</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-rose-600" />
          </div>
        </div>

        {/* Surplus Bersih */}
        <div className="bg-white rounded-2xl border border-stone-200/70 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-stone-500">Surplus Kas Bersih</span>
            <p className="text-xl font-bold font-mono text-stone-900 mt-1">+{formatIDR(totalSurplus)}</p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Kas Positif & Surplus</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        {/* Tingkat Tabungan */}
        <div className="bg-white rounded-2xl border border-stone-200/70 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-stone-500">Rasio Tabungan Kas RT</span>
            <p className="text-xl font-bold font-mono text-stone-900 mt-1">{savingsRate}%</p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
              <span>Cadangan Dana Abadi</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white rounded-2xl border border-stone-200/70 p-6 shadow-xs space-y-6">
        {/* Chart Header & Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#10B981]" />
              <span className="text-xs font-bold text-stone-800">Pemasukan Iuran (Kas Masuk)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-xs font-bold text-stone-800">Pengeluaran Operasional (Kas Keluar)</span>
            </div>
          </div>

          <div className="text-xs text-stone-400 italic">
            *Arahkan kursor ke grafik untuk melihat detail nominal & surplus
          </div>
        </div>

        {/* Visual Chart Area */}
        {chartType === 'bar' ? (
          /* Grouped Bar Chart */
          <div className="relative pt-6">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40 pb-8">
              <div className="border-b border-stone-200 border-dashed w-full h-0">
                <span className="text-[10px] text-stone-400 font-mono -translate-y-4 block">
                  {formatShortIDR(maxVal)}
                </span>
              </div>
              <div className="border-b border-stone-200 border-dashed w-full h-0">
                <span className="text-[10px] text-stone-400 font-mono -translate-y-4 block">
                  {formatShortIDR(maxVal * 0.66)}
                </span>
              </div>
              <div className="border-b border-stone-200 border-dashed w-full h-0">
                <span className="text-[10px] text-stone-400 font-mono -translate-y-4 block">
                  {formatShortIDR(maxVal * 0.33)}
                </span>
              </div>
              <div className="border-b border-stone-300 w-full h-0">
                <span className="text-[10px] text-stone-400 font-mono -translate-y-4 block">Rp 0</span>
              </div>
            </div>

            {/* Bars Container */}
            <div className="h-68 flex items-end justify-between gap-2 sm:gap-4 relative z-10 px-2 sm:px-6 pb-2">
              {filteredData.map((d) => {
                const incomePercent = Math.min(100, Math.round((d.income / maxVal) * 100));
                const expensePercent = Math.min(100, Math.round((d.expense / maxVal) * 100));
                const isHovered = hoveredPoint?.id === d.id;

                return (
                  <div
                    key={d.id}
                    onMouseEnter={() => setHoveredPoint(d)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="flex-1 flex flex-col items-center group h-full justify-end cursor-pointer"
                  >
                    {/* The 2 Grouped Bars */}
                    <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full pb-1">
                      {/* Income Bar (Emerald) */}
                      <div
                        style={{ height: `${incomePercent}%` }}
                        className={`w-full max-w-[20px] sm:max-w-[26px] bg-[#10B981] rounded-t-md transition-all duration-300 relative shadow-xs ${
                          isHovered 
                            ? 'bg-emerald-600 ring-2 ring-emerald-300 scale-105' 
                            : 'hover:brightness-95'
                        }`}
                      />

                      {/* Expense Bar (Rose) */}
                      <div
                        style={{ height: `${expensePercent}%` }}
                        className={`w-full max-w-[20px] sm:max-w-[26px] bg-rose-500 rounded-t-md transition-all duration-300 relative shadow-xs ${
                          isHovered 
                            ? 'bg-rose-600 ring-2 ring-rose-300 scale-105' 
                            : 'hover:brightness-95'
                        }`}
                      />
                    </div>

                    {/* Month Label */}
                    <span className={`text-[11px] sm:text-xs font-semibold mt-2 transition-colors ${
                      isHovered ? 'text-emerald-800 font-bold' : 'text-stone-600'
                    }`}>
                      {d.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Dual Line Curve Chart (SVG) */
          <div className="relative pt-6">
            <div className="h-68 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 800 240" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal grid lines */}
                <line x1="0" y1="40" x2="800" y2="40" stroke="#E5E7EB" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="800" y2="100" stroke="#E5E7EB" strokeDasharray="4 4" />
                <line x1="0" y1="160" x2="800" y2="160" stroke="#E5E7EB" strokeDasharray="4 4" />
                <line x1="0" y1="220" x2="800" y2="220" stroke="#D1D5DB" />

                {/* Calculate points for Income and Expense */}
                {(() => {
                  const n = filteredData.length;
                  const stepX = 800 / (n - 1 || 1);
                  const incomeCoords = filteredData.map((d, i) => {
                    const x = i * stepX;
                    const y = 220 - ((d.income / maxVal) * 200);
                    return { x, y, data: d };
                  });
                  const expenseCoords = filteredData.map((d, i) => {
                    const x = i * stepX;
                    const y = 220 - ((d.expense / maxVal) * 200);
                    return { x, y, data: d };
                  });

                  const incomePathStr = incomeCoords.reduce((acc, pt, idx) => 
                    idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`, ''
                  );
                  const incomeAreaStr = `${incomePathStr} L ${incomeCoords[n - 1].x} 220 L 0 220 Z`;

                  const expensePathStr = expenseCoords.reduce((acc, pt, idx) => 
                    idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`, ''
                  );
                  const expenseAreaStr = `${expensePathStr} L ${expenseCoords[n - 1].x} 220 L 0 220 Z`;

                  return (
                    <>
                      {/* Income Area Fill & Line */}
                      <path d={incomeAreaStr} fill="url(#incomeGradient)" />
                      <path d={incomePathStr} fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                      {/* Expense Area Fill & Line */}
                      <path d={expenseAreaStr} fill="url(#expenseGradient)" />
                      <path d={expensePathStr} fill="none" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                      {/* Data Point Nodes for Income */}
                      {incomeCoords.map((pt, idx) => (
                        <circle
                          key={`inc-${idx}`}
                          cx={pt.x}
                          cy={pt.y}
                          r={hoveredPoint?.id === pt.data.id ? "7" : "4.5"}
                          fill="#10B981"
                          stroke="#FFFFFF"
                          strokeWidth="2.5"
                          className="cursor-pointer transition-all duration-200 hover:scale-125"
                          onMouseEnter={() => setHoveredPoint(pt.data)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      ))}

                      {/* Data Point Nodes for Expense */}
                      {expenseCoords.map((pt, idx) => (
                        <circle
                          key={`exp-${idx}`}
                          cx={pt.x}
                          cy={pt.y}
                          r={hoveredPoint?.id === pt.data.id ? "7" : "4.5"}
                          fill="#F43F5E"
                          stroke="#FFFFFF"
                          strokeWidth="2.5"
                          className="cursor-pointer transition-all duration-200 hover:scale-125"
                          onMouseEnter={() => setHoveredPoint(pt.data)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      ))}
                    </>
                  );
                })()}
              </svg>
            </div>

            {/* X-Axis labels for line chart */}
            <div className="flex justify-between px-1 pt-3 text-[11px] font-semibold text-stone-600">
              {filteredData.map(d => (
                <span 
                  key={d.id} 
                  className={`cursor-pointer ${hoveredPoint?.id === d.id ? 'text-emerald-800 font-bold' : ''}`}
                  onMouseEnter={() => setHoveredPoint(d)}
                >
                  {d.month}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Live Interactive Detail Tooltip Card */}
        {activeTooltipData && (
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-800 text-white font-bold text-[10px]">
                  Bulan {activeTooltipData.fullMonth}
                </span>
                <span className="text-xs font-semibold text-emerald-950">
                  Kuartal {activeTooltipData.quarter}
                </span>
              </div>
              <p className="text-xs text-stone-600 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{activeTooltipData.operationalNotes}</span>
              </p>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              <div>
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Pemasukan Iuran:</span>
                <span className="text-sm font-bold font-mono text-emerald-700">
                  {formatIDR(activeTooltipData.income)}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Pengeluaran Kas:</span>
                <span className="text-sm font-bold font-mono text-rose-600">
                  {formatIDR(activeTooltipData.expense)}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Surplus Bersih:</span>
                <span className={`text-sm font-bold font-mono ${
                  activeTooltipData.income >= activeTooltipData.expense ? 'text-emerald-900 font-extrabold' : 'text-rose-700'
                }`}>
                  {activeTooltipData.income >= activeTooltipData.expense ? '+' : ''}
                  {formatIDR(activeTooltipData.income - activeTooltipData.expense)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rekapitulasi Tabel Komparasi Bulanan */}
      <div className="bg-white rounded-2xl border border-stone-200/70 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900">Rekapitulasi Arus Kas Bulanan</h3>
            <p className="text-xs text-stone-500">Tabel perbandingan pemasukan vs pengeluaran dan status efisiensi kas.</p>
          </div>
        </div>

        <div className="overflow-x-auto border border-stone-200 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-700 font-semibold border-b border-stone-200">
              <tr>
                <th className="p-3">Periode Bulan</th>
                <th className="p-3 text-right">Pemasukan Kas</th>
                <th className="p-3 text-right">Pengeluaran Kas</th>
                <th className="p-3 text-right">Selisih (Surplus)</th>
                <th className="p-3">Rasio Realisasi</th>
                <th className="p-3">Status</th>
                <th className="p-3">Catatan Operasional Utama</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono">
              {filteredData.map((row) => {
                const diff = row.income - row.expense;
                const ratio = Math.round((row.expense / row.income) * 100);

                return (
                  <tr key={row.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-3 font-sans font-bold text-stone-900 whitespace-nowrap">
                      {row.fullMonth}
                    </td>
                    <td className="p-3 text-right text-emerald-700 font-bold">
                      {formatIDR(row.income)}
                    </td>
                    <td className="p-3 text-right text-rose-600 font-bold">
                      {formatIDR(row.expense)}
                    </td>
                    <td className="p-3 text-right font-bold text-stone-900">
                      <span className={diff >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                        {diff >= 0 ? '+' : ''}{formatIDR(diff)}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-stone-100 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${ratio <= 85 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(100, ratio)}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-stone-600">{ratio}%</span>
                      </div>
                    </td>
                    <td className="p-3 font-sans">
                      <span className="bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                        Surplus Aman
                      </span>
                    </td>
                    <td className="p-3 font-sans text-stone-600 text-[11px]">
                      {row.operationalNotes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


// 2. LPJ TRIWULAN VIEW
export const LpjTriwulanView: React.FC = () => {
  const { cashTransactions } = useApp();

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200/70 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
              Laporan Pertanggungjawaban Resmi
            </span>
            <h2 className="text-lg font-bold text-stone-900 mt-1">
              LPJ Keuangan Triwulan III Tahun 2026 (Juli - September 2026)
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Rukun Tetangga 04 / Rukun Warga 08 Perumahan Saung Kebun, Kota Depok
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#10B981] hover:bg-[#059669] rounded-xl shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Ekspor LPJ</span>
          </button>
        </div>

        {/* Neraca Triwulan Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-stone-900">Ringkasan Neraca Keuangan Triwulan III</h3>
          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-700 font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-3">Uraian Akun</th>
                  <th className="p-3 text-right">Pemasukan</th>
                  <th className="p-3 text-right">Pengeluaran</th>
                  <th className="p-3 text-right">Saldo Bersih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                <tr>
                  <td className="p-3 font-sans font-medium text-stone-900">Saldo Awal Kas per 1 Juli 2026</td>
                  <td className="p-3 text-right">-</td>
                  <td className="p-3 text-right">-</td>
                  <td className="p-3 text-right font-bold text-stone-900">Rp 26.500.000</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans text-stone-700">Penerimaan Iuran Warga (Juli - September)</td>
                  <td className="p-3 text-right text-emerald-700 font-bold">Rp 10.800.000</td>
                  <td className="p-3 text-right">-</td>
                  <td className="p-3 text-right">-</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans text-stone-700">Honor Petugas Keamanan (Satpam 24 Jam)</td>
                  <td className="p-3 text-right">-</td>
                  <td className="p-3 text-right text-rose-700 font-bold">Rp 9.600.000</td>
                  <td className="p-3 text-right">-</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans text-stone-700">Operasional Truk Sampah & Petugas Kebersihan</td>
                  <td className="p-3 text-right">-</td>
                  <td className="p-3 text-right text-rose-700 font-bold">Rp 5.400.000</td>
                  <td className="p-3 text-right">-</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans text-stone-700">Perawatan Kebun Asri, Tanaman & Saung Utama</td>
                  <td className="p-3 text-right">-</td>
                  <td className="p-3 text-right text-rose-700 font-bold">Rp 1.950.000</td>
                  <td className="p-3 text-right">-</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans text-stone-700">Listrik PJU & Pompa Air Hidroponik Fasum</td>
                  <td className="p-3 text-right">-</td>
                  <td className="p-3 text-right text-rose-700 font-bold">Rp 1.260.000</td>
                  <td className="p-3 text-right">-</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans text-stone-700">Donasi Sukarela & Kas Sosial Warga</td>
                  <td className="p-3 text-right text-emerald-700 font-bold">Rp 1.940.000</td>
                  <td className="p-3 text-right">-</td>
                  <td className="p-3 text-right">-</td>
                </tr>
                <tr className="bg-stone-50 font-bold">
                  <td className="p-3 font-sans text-stone-900">Saldo Akhir per 30 September 2026</td>
                  <td className="p-3 text-right text-emerald-800">Rp 12.740.000</td>
                  <td className="p-3 text-right text-rose-800">Rp 18.210.000</td>
                  <td className="p-3 text-right text-stone-950 font-extrabold">Rp 31.030.000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-6 border-t border-stone-200 grid grid-cols-2 gap-8 text-center text-xs">
          <div>
            <p className="text-stone-500">Bendahara RT 04</p>
            <div className="h-14 flex items-center justify-center font-serif italic text-base text-stone-800 font-bold">
              Siti Rahmawati, S.E.
            </div>
            <p className="font-bold text-stone-900 underline">Siti Rahmawati, S.E.</p>
          </div>

          <div>
            <p className="text-stone-500">Mengetahui, Ketua RT 04</p>
            <div className="h-14 flex items-center justify-center font-serif italic text-base text-stone-800 font-bold">
              Ir. H. Gunawan Wibisono
            </div>
            <p className="font-bold text-stone-900 underline">Ir. H. Gunawan Wibisono</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. KEGIATAN WARGA VIEW
export const KegiatanView: React.FC = () => {
  const events = [
    {
      id: 1,
      title: 'Kerja Bakti Akbar Bersih Lingkungan & Fogging DBD',
      date: 'Minggu, 20 Oktober 2026',
      time: '07:00 - 10:30 WIB',
      location: 'Titik Kumpul: Saung Utama Gazebo',
      description: 'Pembersihan saluran got perumahan menyambut musim hujan, penataan taman jalan, dan fogging nyamuk demam berdarah. Disediakan kopi & bubur kacang ijo.',
      status: 'Akan Datang',
      lead: 'Seksi Lingkungan & Keamanan'
    },
    {
      id: 2,
      title: 'Panen Raya Sayur Hidroponik Komunitas Saung Kebun',
      date: 'Jumat, 25 Oktober 2026',
      time: '15:30 - 17:30 WIB',
      location: 'Greenhouse Hidroponik Saung Kebun',
      description: 'Panen bersama selada keriting, pakcoy dan bayam merah hidroponik non-pestisida. Terbuka gratis untuk seluruh warga komplek.',
      status: 'Akan Datang',
      lead: 'Pokdarwis Kebun Asri'
    },
    {
      id: 3,
      title: 'Kajian Rutin & Silaturahmi Bulanan Warga Saung Kebun',
      date: 'Sabtu, 01 November 2026',
      time: '19:30 - 21:00 WIB',
      location: 'Balai Warga / Gazebo Saung',
      description: 'Silaturahmi dan tausiyah kebersamaan warga serta ramah tamah menyambut warga baru di Kavling C-08.',
      status: 'Terjadwal',
      lead: 'Seksi Sosial & Kerohanian'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Agenda & Kegiatan Paguyuban Warga</h2>
          <p className="text-xs text-stone-500">Jadwal kegiatan sosial, kerja bakti, dan agenda komunitas di Saung Kebun.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((ev) => (
          <div key={ev.id} className="bg-white rounded-2xl border border-stone-200/70 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-[#10B981] bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px]">
                  {ev.status}
                </span>
                <span className="text-stone-400 font-mono text-[11px]">{ev.date.split(',')[0]}</span>
              </div>

              <h3 className="text-sm font-bold text-stone-900 leading-snug">{ev.title}</h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">{ev.description}</p>
            </div>

            <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-stone-700">
                <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
                <span>{ev.date} · {ev.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{ev.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. INVENTARIS FASILITAS VIEW
export const InventarisView: React.FC = () => {
  const inventoryItems = [
    { name: 'Saung Utama Gazebo Kayu Jati', qty: '1 Unit', condition: 'Sangat Baik', loc: 'Taman Tengah Saung' },
    { name: 'Greenhouse & Instalasi Hidroponik NFT', qty: '1 Set (4 Rak)', condition: 'Aktif / Produktif', loc: 'Area Kebun Belakang' },
    { name: 'Meja Tenis Meja & Net Standar', qty: '1 Set', condition: 'Baik', loc: 'Gudang Balai Saung' },
    { name: 'Mesin Potong Rumput Dorong Honda', qty: '1 Unit', condition: 'Baik', loc: 'Pos Satpam Belakang' },
    { name: 'Mesin Fogging Disinfektan / Nyamuk', qty: '1 Unit', condition: 'Siap Pakai', loc: 'Pos Satpam Depan' },
    { name: 'Sound System Portable Wireless + Mic', qty: '2 Unit', condition: 'Sangat Baik', loc: 'Kediaman Ketua RT' },
    { name: 'Tenda Lipat Acara 3x3 Meter', qty: '4 Unit', condition: 'Baik', loc: 'Gudang Balai Saung' },
    { name: 'Kursi Plastik Acara Warga', qty: '60 Buah', condition: 'Lengkap', loc: 'Gudang Balai Saung' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200/70 p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Inventaris Fasilitas & Aset Saung Kebun</h2>
          <p className="text-xs text-stone-500">Pencatatan sarana prasarana milik bersama paguyuban warga RT 04 / RW 08.</p>
        </div>

        <div className="overflow-x-auto border border-stone-200 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-700 font-semibold border-b border-stone-200">
              <tr>
                <th className="p-3">Nama Sarana / Alat Inventaris</th>
                <th className="p-3">Jumlah</th>
                <th className="p-3">Kondisi Alat</th>
                <th className="p-3">Lokasi Penyimpanan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {inventoryItems.map((inv, idx) => (
                <tr key={idx} className="hover:bg-stone-50/70">
                  <td className="p-3 font-semibold text-stone-900">{inv.name}</td>
                  <td className="p-3 font-mono font-bold text-stone-700">{inv.qty}</td>
                  <td className="p-3">
                    <span className="bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-full text-[11px]">
                      {inv.condition}
                    </span>
                  </td>
                  <td className="p-3 text-stone-600">{inv.loc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 5. PROFIL VIEW
export const ProfilView: React.FC = () => {
  const { currentUser, houses } = useApp();
  const currentHouse = houses.find(h => h.id === currentUser.houseId);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white rounded-2xl border border-stone-200/70 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#10B981] text-white font-bold text-2xl flex items-center justify-center shadow-xs">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900">{currentUser.name}</h2>
            <p className="text-xs text-stone-500">{currentUser.email} · {currentUser.phone}</p>
            <span className="inline-block px-2.5 py-0.5 mt-1 text-xs font-semibold text-purple-700 bg-purple-50 rounded-full">
              {currentUser.position} ({currentUser.role.toUpperCase()})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-stone-100">
          <div className="p-3.5 bg-stone-50 rounded-xl space-y-1">
            <span className="text-stone-500 font-medium">Alamat Kavling Terdata:</span>
            <p className="font-bold text-stone-900">
              {currentHouse ? `Blok ${currentHouse.block}-${currentHouse.number}` : 'Kawasan Saung Kebun'}
            </p>
            <p className="text-stone-500 text-[11px]">{currentHouse?.address || 'Jl. Saung Kebun Raya'}</p>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-xl space-y-1">
            <span className="text-stone-500 font-medium">Kontak Darurat Tersimpan:</span>
            <p className="font-bold text-stone-900">
              {currentUser.emergencyContact?.name || 'Sekretariat Pos Induk'}
            </p>
            <p className="text-stone-500 text-[11px]">
              {currentUser.emergencyContact?.relationship} · {currentUser.emergencyContact?.phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 6. PENGATURAN VIEW
export const PengaturanView: React.FC = () => {
  const { setIsArchitectureModalOpen } = useApp();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white rounded-2xl border border-stone-200/70 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Pengaturan Sistem SIP-SK</h2>
          <p className="text-xs text-stone-500">Konfigurasi paguyuban, integrasi basis data, dan informasi pengembang.</p>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 bg-stone-50 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold text-stone-900">Dokumentasi Arsitektur & Skema SQL</p>
              <p className="text-stone-500 text-[11px]">Lihat relasi tabel DDL SQL (PostgreSQL), ERD dan matriks RBAC.</p>
            </div>
            <button
              onClick={() => setIsArchitectureModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-lg transition-colors whitespace-nowrap"
            >
              Buka Skema SQL
            </button>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold text-stone-900">Nama Perumahan & Lingkungan</p>
              <p className="text-stone-500 text-[11px]">Rukun Tetangga 04 / Rukun Warga 08 Perumahan Saung Kebun</p>
            </div>
            <span className="font-mono text-stone-400">Aktif</span>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold text-stone-900">Metode Pembayaran Digital</p>
              <p className="text-stone-500 text-[11px]">QRIS Dinamis, Transfer Bank BCA, Mandiri, BRI, dan GoPay</p>
            </div>
            <span className="font-semibold text-emerald-700">Terhubung</span>
          </div>
        </div>
      </div>
    </div>
  );
};
