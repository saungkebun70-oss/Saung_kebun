import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavTabId } from '../../types';
import { 
  Building2, 
  Wallet, 
  FileText, 
  ShieldCheck, 
  Trees, 
  MessageSquareWarning, 
  ShoppingBag, 
  Database, 
  AlertTriangle,
  LogOut
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    setIsArchitectureModalOpen,
    panicAlert,
    triggerPanicAlert,
    logout
  } = useApp();

  const navItems: { id: NavTabId; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Ringkasan', icon: Building2 },
    { id: 'iuran', label: 'Keuangan & Iuran', icon: Wallet },
    { id: 'data-warga', label: 'Administrasi & Warga', icon: FileText },
    { id: 'data-keamanan', label: 'Keamanan & Tamu', icon: ShieldCheck },
    { id: 'inventaris', label: 'Fasilitas Saung', icon: Trees },
    { id: 'pengaduan', label: 'Pengumuman & Keluhan', icon: MessageSquareWarning },
    { id: 'kegiatan', label: 'Kegiatan Warga', icon: ShoppingBag },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-800 text-emerald-100 flex items-center justify-center font-bold text-lg shadow-sm">
              SK
            </div>
            <a 
              href="#dashboard" 
              onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}
              className="text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap"
            >
              SIP-SK <span className="font-normal text-stone-500">· Saung Kebun</span>
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200' 
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions (Architecture Doc, Panic Button, User Profile & Logout) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsArchitectureModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap"
              title="Lihat Arsitektur Sistem & Skema SQL"
            >
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              <span>Arsitektur & Skema SQL</span>
            </button>

            <button
              onClick={() => {
                if (panicAlert?.active) return;
                triggerPanicAlert(
                  'Gangguan Keamanan',
                  `Tombol darurat ditekan oleh ${currentUser.name} (${currentUser.position})`
                );
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-xs whitespace-nowrap transition-all ${
                panicAlert?.active
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Panic Button</span>
            </button>

            {/* User Profile Badge */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-stone-200 text-xs">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 border border-emerald-200">
                {currentUser.name.charAt(0)}
              </div>
              <div className="leading-tight text-left">
                <span className="font-semibold text-stone-900 block truncate max-w-[120px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-stone-500 block truncate max-w-[120px]">
                  {currentUser.position}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:text-rose-700 hover:bg-rose-50 border border-stone-200 hover:border-rose-200 rounded-lg transition-colors whitespace-nowrap"
              title="Keluar dari akun SIP-SK"
            >
              <LogOut className="w-3.5 h-3.5 text-stone-500 hover:text-rose-600" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Nav Strip */}
        <div className="xl:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-stone-100 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200' 
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setIsArchitectureModalOpen(true)}
            className="flex sm:hidden items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 rounded-md whitespace-nowrap shrink-0"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Skema SQL</span>
          </button>
        </div>
      </div>
    </header>
  );
};
