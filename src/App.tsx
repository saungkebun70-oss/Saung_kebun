import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { TopHeader } from './components/layout/TopHeader';
import { MainDashboardView } from './components/dashboard/MainDashboardView';
import { FinanceModule } from './components/finance/FinanceModule';
import { AdministrationModule } from './components/administration/AdministrationModule';
import { SecurityModule } from './components/security/SecurityModule';
import { CommunityModule } from './components/community/CommunityModule';
import { PanicAlertOverlay } from './components/security/PanicAlertOverlay';
import { ArchitectureModal } from './components/architecture/ArchitectureModal';
import { OfficialLetterModal } from './components/letters/OfficialLetterModal';
import { LoginPage } from './components/auth/LoginPage';
import { 
  GrafikKeuanganView, 
  LpjTriwulanView, 
  KegiatanView, 
  InventarisView, 
  ProfilView, 
  PengaturanView 
} from './components/views/AdditionalViews';

const AppContent: React.FC = () => {
  const { 
    isAuthenticated,
    activeTab, 
    selectedLetterForPrint, 
    setSelectedLetterForPrint,
    setIsArchitectureModalOpen
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Authentication Gate: redirect to LoginPage if not logged in
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <ArchitectureModal />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-stone-900 font-sans flex">
      {/* Panic Alert Overlay */}
      <PanicAlertOverlay />

      {/* 1. Left Sidebar Navigation matching image.png */}
      <LeftSidebar 
        isOpenMobile={isMobileMenuOpen} 
        onCloseMobile={() => setIsMobileMenuOpen(false)} 
      />

      {/* 2. Main Content Canvas with Left Margin for Sidebar */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen w-full">
        {/* Top Header */}
        <TopHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <MainDashboardView />}
          {activeTab === 'data-warga' && <AdministrationModule />}
          {activeTab === 'iuran' && <FinanceModule />}
          {activeTab === 'pengeluaran' && <FinanceModule />}
          {activeTab === 'buku-kas' && <FinanceModule />}
          {activeTab === 'grafik-keuangan' && <GrafikKeuanganView />}
          {activeTab === 'lpj-triwulan' && <LpjTriwulanView />}
          {activeTab === 'pengumuman' && <CommunityModule />}
          {activeTab === 'kegiatan' && <KegiatanView />}
          {activeTab === 'inventaris' && <InventarisView />}
          {activeTab === 'buku-tamu' && <SecurityModule />}
          {activeTab === 'surat-menyurat' && <AdministrationModule />}
          {activeTab === 'pengaduan' && <CommunityModule />}
          {activeTab === 'data-keamanan' && <SecurityModule />}
          {activeTab === 'profil' && <ProfilView />}
          {activeTab === 'pengaturan' && <PengaturanView />}
        </main>

        {/* Quiet Clean Footer */}
        <footer className="py-5 px-6 sm:px-8 border-t border-stone-200/80 bg-white text-xs text-stone-500 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900">SIPL Saung Kebun</span>
              <span aria-hidden="true">·</span>
              <span>Sistem Informasi Perumahan & Keuangan RT 04 / RW 08</span>
            </div>

            <div className="flex items-center gap-3 text-stone-500">
              <button
                onClick={() => setIsArchitectureModalOpen(true)}
                className="hover:text-emerald-700 font-medium transition-colors"
              >
                Arsitektur & Skema SQL
              </button>
              <span aria-hidden="true">·</span>
              <span>Pos Keamanan: 021-8899-7711</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Official Letter Modal */}
      {selectedLetterForPrint && (
        <OfficialLetterModal
          document={selectedLetterForPrint}
          onClose={() => setSelectedLetterForPrint(null)}
        />
      )}

      {/* Architecture & SQL Schema Modal */}
      <ArchitectureModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
