import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  HelpCircle, 
  Briefcase, 
  Home, 
  Shield, 
  CheckCircle2, 
  AlertCircle,
  Phone,
  Trees
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, quickLoginAs, availableUsers, setIsArchitectureModalOpen } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const result = login(identifier, password, rememberMe);
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage(result.message || 'Kredensial tidak valid.');
      }
    }, 400);
  };

  const handleQuickDemoClick = (userId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      quickLoginAs(userId);
      setIsLoading(false);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Brand Stripe */}
      <header className="w-full bg-white border-b border-stone-200 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-base shadow-xs">
              SK
            </div>
            <div>
              <span className="font-bold text-stone-900 text-base tracking-tight block">
                SIP-SK <span className="text-stone-500 font-normal">· Saung Kebun</span>
              </span>
              <span className="text-[11px] text-stone-500 hidden sm:block">
                Sistem Informasi & Manajemen Keuangan Paguyuban Warga RT 04 / RW 08
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsArchitectureModalOpen(true)}
              className="text-xs font-medium text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
            >
              Dokumentasi & Skema SQL
            </button>
          </div>
        </div>
      </header>

      {/* Main Content: Split Grid */}
      <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 my-auto">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Visual & Welcome Banner (5 cols) */}
          <div className="lg:col-span-5 relative bg-emerald-950 text-white p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
            {/* Background Texture / Photo */}
            <div className="absolute inset-0 opacity-25 mix-blend-overlay">
              <img
                src="/src/assets/images/saung_kebun_hero_1791991915164.jpg"
                alt="Perumahan Saung Kebun"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/90 via-emerald-950/95 to-emerald-950" />

            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-800/80 border border-emerald-700/60 p-1 flex items-center justify-center shadow-md">
                <img
                  src="/src/assets/images/saung_logo_badge_1791991914079.jpg"
                  alt="Logo Saung Kebun"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>

              <div>
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider block mb-1">
                  Kawasan Hunian Asri & Harmonis
                </span>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white text-balance">
                  Selamat Datang di Portal Warga Saung Kebun
                </h1>
                <p className="text-xs text-emerald-100/80 mt-2 leading-relaxed">
                  Layanan terpadu keuangan terbuka, verifikasi iuran digital, pengurusan surat RT/RW instan, reservasi Saung Gazebo, dan sistem keamanan pos jaga 24 jam.
                </p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-emerald-800/60 text-xs text-emerald-100/90">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Transparansi kas paguyuban real-time</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Surat Pengantar RT bernomor resmi & stempel digital</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Panic Button darurat terhubung ke Pos Satpam</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-emerald-800/50 text-[11px] text-emerald-300/80">
              Kavling Blok A s/d Blok E · Kel. Sukadamai, Kec. Kebun Asri, Kota Depok
            </div>
          </div>

          {/* Right Column: Form Login & Demo Switcher (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-stone-900 tracking-tight">Masuk ke Akun Anda</h2>
                <p className="text-xs text-stone-500 mt-1">
                  Masukkan nomor WhatsApp terdaftar, alamat email, atau nomor kavling rumah Anda.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nomor WhatsApp / Email / Nomor Blok Rumah
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Contoh: 0811-9876-5432 / Blok B-03 / gunawan@saungkebun.id"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent text-stone-900"
                      required
                    />
                  </div>
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    Bisa login menggunakan nomor kavling seperti <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700">Blok B-03</code>
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Kata Sandi (Password)
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(true)}
                      className="text-[11px] font-medium text-emerald-800 hover:text-emerald-900 hover:underline"
                    >
                      Lupa Kata Sandi?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi akun Anda"
                      className="w-full pl-9 pr-10 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent text-stone-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-stone-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-emerald-700 focus:ring-emerald-700 w-3.5 h-3.5"
                    />
                    <span>Ingat Saya di Perangkat Ini</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Memverifikasi Kredensial...</span>
                  ) : (
                    <>
                      <span>Masuk ke Sistem SIP-SK</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Demo Login Section */}
            <div className="pt-5 border-t border-stone-200">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Pilih Akun Demo (Akses Cepat Pengujian)
                </span>
                <span className="text-[11px] text-stone-400">1-Klik Langsung Masuk</span>
              </div>
              <p className="text-[11px] text-stone-500 mb-3">
                Klik salah satu profil di bawah ini untuk mencoba aplikasi dengan hak akses peran terkait:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Ketua RT */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoClick('user-ketua')}
                  className="p-3 text-left rounded-xl border border-stone-200 hover:border-emerald-700 hover:bg-emerald-50/50 transition-all group shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                      Ketua RT
                    </span>
                    <Briefcase className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-700" />
                  </div>
                  <p className="text-xs font-bold text-stone-900">H. Ahmad Suryadi</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Akses Penuh, Approval Surat & Kas</p>
                </button>

                {/* 2. Bendahara */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoClick('user-bendahara')}
                  className="p-3 text-left rounded-xl border border-stone-200 hover:border-emerald-700 hover:bg-emerald-50/50 transition-all group shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded">
                      Bendahara RT
                    </span>
                    <Briefcase className="w-3.5 h-3.5 text-stone-400 group-hover:text-blue-700" />
                  </div>
                  <p className="text-xs font-bold text-stone-900">Siti Rahmawati, S.E.</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Kelola Keuangan, Iuran & Neraca</p>
                </button>

                {/* 3. Warga Tetap */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoClick('user-warga1')}
                  className="p-3 text-left rounded-xl border border-stone-200 hover:border-emerald-700 hover:bg-emerald-50/50 transition-all group shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                      Warga Tetap (Blok B-03)
                    </span>
                    <Home className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-700" />
                  </div>
                  <p className="text-xs font-bold text-stone-900">Bambang Prasetyo</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Bayar Iuran, Surat & Panic Button</p>
                </button>

                {/* 4. Komandan Satpam */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoClick('user-satpam')}
                  className="p-3 text-left rounded-xl border border-stone-200 hover:border-emerald-700 hover:bg-emerald-50/50 transition-all group shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-stone-800 bg-stone-200 px-2 py-0.5 rounded">
                      Satpam Pos Induk
                    </span>
                    <Shield className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900" />
                  </div>
                  <p className="text-xs font-bold text-stone-900">Komandan Joko Sutrisno</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Buku Tamu, Ronda & Alarm SOS</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-xs text-stone-500 border-t border-stone-200 bg-white">
        <span>© 2026 Paguyuban Perumahan Saung Kebun · RT 04 / RW 08</span>
        <span className="mx-2">·</span>
        <span>Pos Gerbang Keamanan: 021-8899-7711</span>
      </footer>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full border border-stone-200 shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <span>Bantuan Reset Kata Sandi</span>
              </h3>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Demi keamanan data sensus dan transparansi keuangan warga Saung Kebun, reset kata sandi dilakukan secara terverifikasi melalui Pengurus RT.
            </p>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1.5">
              <p className="font-semibold text-stone-800">Langkah Pemulihan Akun:</p>
              <ol className="list-decimal pl-4 space-y-1 text-stone-600 text-[11px]">
                <li>Hubungi Sekretariat RT 04 dengan menyebutkan Nama Kepala Keluarga dan Nomor Blok Kavling.</li>
                <li>Pengurus akan menerbitkan PIN verifikasi baru ke nomor WhatsApp Anda yang terdata.</li>
                <li>Untuk demo saat ini, Anda dapat langsung menggunakan fitur <strong>"Pilih Akun Demo"</strong> di halaman login.</li>
              </ol>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <a
                href="https://wa.me/6281234567890?text=Halo%20Pengurus%20RT%20Saung%20Kebun,%20saya%20warga%20butuh%20bantuan%20reset%20kata%20sandi%20akun%20SIP-SK"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Pengurus RT</span>
              </a>

              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
