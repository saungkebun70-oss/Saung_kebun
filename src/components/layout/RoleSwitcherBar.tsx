import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Shield, Home, Briefcase } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { currentUser, availableUsers, setCurrentUser } = useApp();

  return (
    <div className="bg-stone-900 text-stone-100 border-b border-stone-800 px-4 sm:px-6 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Left: Role Info */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-emerald-400 flex items-center gap-1.5 whitespace-nowrap">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            Simulasi Multi-Peran:
          </span>
          <span className="text-stone-300">
            Login sebagai: <strong className="text-white">{currentUser.name}</strong> ({currentUser.position})
          </span>
          <span className="hidden lg:inline text-stone-500">·</span>
          <span className="hidden lg:inline text-stone-400">
            {currentUser.role === 'pengurus' && 'Akses penuh kas RT, persetujuan iuran, approval surat & aduan'}
            {currentUser.role === 'warga' && 'Akses iuran digital (QRIS/Bank), minta surat pengantar, lapor keluhan, UMKM'}
            {currentUser.role === 'satpam' && 'Akses buku tamu gerbang, jadwal ronda malam, monitoring darurat'}
          </span>
        </div>

        {/* Right: Quick Switcher */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-stone-400 font-medium mr-1 whitespace-nowrap">Ganti Profil:</span>
          {availableUsers.map((u) => {
            const isSelected = u.id === currentUser.id;
            const getIcon = () => {
              if (u.role === 'pengurus') return <Briefcase className="w-3 h-3" />;
              if (u.role === 'satpam') return <Shield className="w-3 h-3" />;
              return <Home className="w-3 h-3" />;
            };

            return (
              <button
                key={u.id}
                onClick={() => setCurrentUser(u)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-medium shadow-sm'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                }`}
                title={`Beralih ke ${u.name} (${u.position})`}
              >
                {getIcon()}
                <span>{u.position.split(' ')[0]} {u.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
