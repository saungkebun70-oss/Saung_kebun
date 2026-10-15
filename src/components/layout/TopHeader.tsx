import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { NavTabId, AppNotification } from '../../types';
import { 
  Bell, 
  ChevronDown, 
  Menu, 
  LogOut, 
  ShieldCheck, 
  Database, 
  AlertTriangle,
  UserCheck,
  Briefcase,
  Home,
  Shield,
  Wallet,
  FileText,
  Trees,
  CheckCircle2,
  Check,
  Clock,
  ArrowRight
} from 'lucide-react';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenMobileMenu }) => {
  const { 
    currentUser, 
    availableUsers,
    setCurrentUser,
    activeTab, 
    setActiveTab,
    logout,
    setIsArchitectureModalOpen,
    panicAlert,
    triggerPanicAlert,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useApp();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tab Title mapping
  const getTabTitle = (tab: NavTabId) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard';
      case 'data-warga': return 'Data Warga';
      case 'iuran': return 'Iuran';
      case 'pengeluaran': return 'Pengeluaran';
      case 'buku-kas': return 'Buku Kas';
      case 'grafik-keuangan': return 'Grafik Keuangan';
      case 'lpj-triwulan': return 'LPJ Triwulan';
      case 'pengumuman': return 'Pengumuman';
      case 'kegiatan': return 'Kegiatan';
      case 'inventaris': return 'Inventaris';
      case 'buku-tamu': return 'Buku Tamu';
      case 'surat-menyurat': return 'Surat Menyurat';
      case 'pengaduan': return 'Pengaduan';
      case 'data-keamanan': return 'Data Keamanan';
      case 'profil': return 'Profil';
      case 'pengaturan': return 'Pengaturan';
      default: return 'Dashboard';
    }
  };

  const getNotificationIcon = (category: AppNotification['category']) => {
    switch (category) {
      case 'iuran':
        return <Wallet className="w-4 h-4 text-emerald-600" />;
      case 'surat':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'pengaduan':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'fasilitas':
        return <Trees className="w-4 h-4 text-teal-600" />;
      case 'keamanan':
        return <ShieldCheck className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-emerald-600" />;
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    setActiveTab(notif.targetTab);
    setIsNotifOpen(false);
  };

  const shortName = currentUser.name.split(' ').slice(0, 2).join(' ');

  return (
    <header className="h-18 bg-white border-b border-stone-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Page Title & Welcome Subtitle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-2 text-stone-600 hover:text-stone-900 rounded-lg"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 leading-tight">
            {getTabTitle(activeTab)}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Selamat datang, {currentUser.name}
          </p>
        </div>
      </div>

      {/* Right: Notification Bell & Profile Dropdown */}
      <div className="flex items-center gap-3 sm:gap-4 relative">
        {/* Panic Button Mini Indicator */}
        <button
          onClick={() => {
            if (panicAlert?.active) return;
            triggerPanicAlert('Gangguan Keamanan', `Laporan darurat dari ${currentUser.name}`);
          }}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
            panicAlert?.active 
              ? 'bg-rose-600 text-white animate-pulse border-rose-700' 
              : 'text-rose-600 bg-rose-50 border-rose-200 hover:bg-rose-100'
          }`}
          title="Tombol Darurat Panic Button"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Panic Button</span>
        </button>

        {/* Notification Bell with Red Badge matching image.png */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-9 h-9 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors relative"
            title="Pemberitahuan Warga"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Notifications Flyout */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-88 sm:w-96 bg-white rounded-2xl border border-stone-200 shadow-2xl p-4 z-50 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 text-sm">Pemberitahuan Sistem</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {unreadNotificationsCount} Baru
                    </span>
                  )}
                </div>
                {unreadNotificationsCount > 0 ? (
                  <button
                    onClick={() => markAllNotificationsAsRead()}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    <span>Tandai Semua Dibaca</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-stone-400">Semua telah dibaca</span>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-96 overflow-y-auto divide-y divide-stone-100 mt-2 -mx-1 px-1">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-stone-400">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-stone-300 stroke-[1.5]" />
                    <p className="font-medium text-stone-600">Tidak ada pemberitahuan baru</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">Semua info dan permohonan warga telah terbaca</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`py-3 px-2 rounded-xl transition-all cursor-pointer flex gap-3 text-left items-start ${
                        notif.isRead 
                          ? 'hover:bg-stone-50 opacity-75' 
                          : 'bg-emerald-50/50 hover:bg-emerald-50/80 border border-emerald-100/60 shadow-2xs'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        notif.isRead ? 'bg-stone-100 text-stone-500' : 'bg-white shadow-2xs border border-stone-100'
                      }`}>
                        {getNotificationIcon(notif.category)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <p className={`text-xs truncate ${notif.isRead ? 'font-medium text-stone-700' : 'font-bold text-stone-900'}`}>
                            {notif.title}
                          </p>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          )}
                        </div>

                        <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>

                        <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-stone-400">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-stone-400" />
                            {notif.timeAgo}
                          </span>
                          <span className="text-emerald-700 font-semibold flex items-center gap-0.5 group-hover:underline">
                            <span>Buka</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown Pill matching image.png */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 py-1 px-2 hover:bg-stone-50 rounded-xl transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-[#10B981] text-white font-bold flex items-center justify-center text-xs shadow-2xs">
              {currentUser.name.charAt(0)}
            </div>
            <span className="text-xs font-semibold text-stone-900 hidden sm:inline whitespace-nowrap">
              {shortName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-stone-200 shadow-xl p-3 z-50 text-xs space-y-2">
              <div className="p-2 bg-stone-50 rounded-xl">
                <p className="font-bold text-stone-900">{currentUser.name}</p>
                <p className="text-[11px] text-stone-500">{currentUser.email}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                  {currentUser.position}
                </span>
              </div>

              {/* Demo Switcher Quick Buttons */}
              <div className="pt-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block px-2 mb-1">
                  Ganti Profil Demo:
                </span>
                <div className="space-y-1">
                  {availableUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setCurrentUser(u);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                        u.id === currentUser.id 
                          ? 'bg-emerald-50 text-emerald-900 font-bold' 
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span>{u.name.split(' ')[0]} ({u.position.split(' ')[0]})</span>
                      {u.id === currentUser.id && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 space-y-1">
                <button
                  onClick={() => {
                    setIsArchitectureModalOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Dokumentasi & Skema SQL</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
