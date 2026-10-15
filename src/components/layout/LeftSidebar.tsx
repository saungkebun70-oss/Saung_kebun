import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavTabId } from '../../types';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  CreditCard, 
  BookOpen, 
  BarChart3, 
  FileSpreadsheet, 
  Megaphone, 
  Calendar, 
  Package, 
  BookMarked, 
  Mail, 
  AlertCircle, 
  ShieldCheck, 
  User, 
  Settings,
  Shield
} from 'lucide-react';

interface LeftSidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { activeTab, setActiveTab, currentUser } = useApp();

  const menuItems: { id: NavTabId; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'data-warga', label: 'Data Warga', icon: Users },
    { id: 'iuran', label: 'Iuran', icon: DollarSign },
    { id: 'pengeluaran', label: 'Pengeluaran', icon: CreditCard },
    { id: 'buku-kas', label: 'Buku Kas', icon: BookOpen },
    { id: 'grafik-keuangan', label: 'Grafik Keuangan', icon: BarChart3 },
    { id: 'lpj-triwulan', label: 'LPJ Triwulan', icon: FileSpreadsheet },
    { id: 'pengumuman', label: 'Pengumuman', icon: Megaphone },
    { id: 'kegiatan', label: 'Kegiatan', icon: Calendar },
    { id: 'inventaris', label: 'Inventaris', icon: Package },
    { id: 'buku-tamu', label: 'Buku Tamu', icon: BookMarked },
    { id: 'surat-menyurat', label: 'Surat Menyurat', icon: Mail },
    { id: 'pengaduan', label: 'Pengaduan', icon: AlertCircle },
    { id: 'data-keamanan', label: 'Data Keamanan', icon: ShieldCheck },
    { id: 'profil', label: 'Profil', icon: User },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  const handleSelectTab = (id: NavTabId) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-stone-900/50 z-40 lg:hidden backdrop-blur-xs" 
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-stone-200 flex flex-col justify-between transition-transform duration-200 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-stone-100 shrink-0">
          <div className="flex items-center gap-3">
            {/* Green Shield Icon matching image.png */}
            <div className="w-10 h-10 rounded-xl bg-[#10B981] text-white flex items-center justify-center shadow-xs shrink-0">
              <Shield className="w-6 h-6 fill-white stroke-[#10B981]" />
            </div>
            <div>
              <span className="font-extrabold text-stone-900 text-lg tracking-tight leading-none block">
                SIPL
              </span>
              <span className="text-[11px] text-stone-500 font-medium block mt-0.5">
                Saung Kebun
              </span>
            </div>
          </div>
        </div>

        {/* Menu Navigation Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 text-sm no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all text-left whitespace-nowrap
                  ${isActive 
                    ? 'bg-[#10B981] text-white font-bold shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }
                `}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white stroke-[2.5]' : 'text-stone-400'}`} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom User Profile Section (Matching image.png) */}
        <div className="p-4 border-t border-stone-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            {/* Green initial circle avatar */}
            <div className="w-9 h-9 rounded-full bg-[#10B981] text-white font-bold flex items-center justify-center text-sm shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-stone-900 truncate">
                {currentUser.name}
              </p>
              <span className="inline-block px-2 py-0.5 mt-0.5 text-[10px] font-semibold text-purple-700 bg-purple-50 rounded-full">
                {currentUser.position}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
