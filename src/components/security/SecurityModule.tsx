import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  UserPlus, 
  LogOut, 
  Moon, 
  AlertTriangle, 
  PhoneCall, 
  Car, 
  Clock, 
  MapPin, 
  Search,
  CheckCircle2
} from 'lucide-react';
import { GuestLog } from '../../types';

export const SecurityModule: React.FC = () => {
  const { 
    currentUser, 
    guestLogs, 
    addGuestLog, 
    checkoutGuest, 
    patrolSchedules, 
    panicAlert, 
    triggerPanicAlert, 
    resolvePanicAlert,
    houses
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'tamu' | 'ronda' | 'darurat'>('tamu');
  const [guestSearch, setGuestSearch] = useState('');

  // New Guest Modal
  const [isNewGuestModalOpen, setIsNewGuestModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [destinationHouse, setDestinationHouse] = useState('Blok B-03 (Bp. Bambang)');
  const [hostName, setHostName] = useState('Bambang Prasetyo');
  const [guestPurpose, setGuestPurpose] = useState('');
  const [idCardType, setIdCardType] = useState<GuestLog['idCardType']>('KTP');

  // Trigger Panic Modal
  const [isPanicModalOpen, setIsPanicModalOpen] = useState(false);
  const [emergencyType, setEmergencyType] = useState<'Pencurian / Orang Mencurigakan' | 'Kebakaran' | 'Darurat Medis' | 'Gangguan Keamanan'>('Pencurian / Orang Mencurigakan');
  const [locationNotes, setLocationNotes] = useState('');

  const filteredGuests = guestLogs.filter(g => 
    g.guestName.toLowerCase().includes(guestSearch.toLowerCase()) ||
    g.vehiclePlate.toLowerCase().includes(guestSearch.toLowerCase()) ||
    g.destinationHouse.toLowerCase().includes(guestSearch.toLowerCase())
  );

  const activeGuestsCount = guestLogs.filter(g => g.status === 'Di Dalam').length;

  const handleCreateGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !vehiclePlate || !guestPurpose) return;
    addGuestLog({
      guestName,
      vehiclePlate,
      destinationHouse,
      hostName,
      purpose: guestPurpose,
      idCardType
    });
    setIsNewGuestModalOpen(false);
    setGuestName('');
    setVehiclePlate('');
    setGuestPurpose('');
  };

  const handleLaunchPanic = (e: React.FormEvent) => {
    e.preventDefault();
    triggerPanicAlert(emergencyType, locationNotes);
    setIsPanicModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tab Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Sistem Keamanan, Buku Tamu & Ronda
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Pusat kendali portal gerbang masuk perumahan, jadwal ronda malam warga, dan sistem respon cepat panic button.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('tamu')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeSubTab === 'tamu'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Buku Tamu Gerbang ({activeGuestsCount})
          </button>
          <button
            onClick={() => setActiveSubTab('ronda')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeSubTab === 'ronda'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Jadwal Ronda Malam
          </button>
          <button
            onClick={() => setActiveSubTab('darurat')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeSubTab === 'darurat'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Pusat Darurat & SOS
          </button>
        </div>
      </div>

      {/* SUBTAB 1: BUKU TAMU */}
      {activeSubTab === 'tamu' && (
        <div className="space-y-6">
          {/* Action & Stats Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 font-medium">Tamu Sedang di Dalam Komplek</span>
                <div className="text-2xl font-bold font-mono tabular-nums text-emerald-800 mt-1">
                  {activeGuestsCount} Kendaraan
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 font-medium">Petugas Jaga Gerbang Aktif</span>
                <div className="text-sm font-bold text-stone-900 mt-1">
                  Komandan Joko Sutrisno
                </div>
                <p className="text-[11px] text-stone-400">Pos Induk Gerbang Depan</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs text-stone-500 font-medium">Pencatatan Gerbang Satpam</span>
                <p className="text-xs text-stone-600 mt-0.5">Input identitas tamu masuk kavling warga.</p>
              </div>
              <button
                onClick={() => setIsNewGuestModalOpen(true)}
                className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Catat Tamu Masuk Baru</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama tamu, plat nomor, atau rumah tujuan..."
                value={guestSearch}
                onChange={(e) => setGuestSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Table: Guest Logs */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Nama Tamu</th>
                    <th className="py-3 px-4">No. Polisi (Plat)</th>
                    <th className="py-3 px-4">Tujuan Rumah</th>
                    <th className="py-3 px-4">Keperluan Kunjungan</th>
                    <th className="py-3 px-4">Jam Masuk</th>
                    <th className="py-3 px-4">Status & Keluar</th>
                    <th className="py-3 px-4 text-right">Aksi Petugas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredGuests.map((g) => {
                    const isInside = g.status === 'Di Dalam';
                    return (
                      <tr key={g.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-stone-900">
                          {g.guestName}
                          <span className="block text-[10px] text-stone-400 font-normal">Identitas: {g.idCardType}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-stone-800 whitespace-nowrap">
                          <span className="px-2 py-0.5 bg-stone-100 border border-stone-200 rounded">
                            {g.vehiclePlate}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-stone-700 whitespace-nowrap">
                          {g.destinationHouse}
                        </td>
                        <td className="py-3.5 px-4 text-stone-600 max-w-xs truncate">
                          {g.purpose}
                        </td>
                        <td className="py-3.5 px-4 text-stone-700 font-mono tabular-nums whitespace-nowrap">
                          {g.checkInTime}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {isInside ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              Di Dalam
                            </span>
                          ) : (
                            <div className="text-[11px] text-stone-500">
                              <span>Keluar: </span>
                              <strong className="font-mono tabular-nums text-stone-700">{g.checkOutTime}</strong>
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          {isInside ? (
                            <button
                              onClick={() => checkoutGuest(g.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md transition-colors"
                            >
                              Check-Out Keluar
                            </button>
                          ) : (
                            <span className="text-stone-400 text-xs">Selesai</span>
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

      {/* SUBTAB 2: JADWAL RONDA */}
      {activeSubTab === 'ronda' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Moon className="w-4 h-4 text-stone-700" />
                <h3 className="text-base font-bold text-stone-900">Jadwal Siskamling & Ronda Malam Paguyuban</h3>
              </div>
              <p className="text-xs text-stone-600 max-w-xl">
                Sistem ronda terpadu menggabungkan Satpam profesional dan giliran warga secara bergantian demi menjaga kenyamanan lingkungan Saung Kebun.
              </p>
            </div>
            <div className="text-xs text-stone-500 font-mono">
              Pos Kamling Utama: Samping Balai Saung
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {patrolSchedules.map((pat) => (
              <div key={pat.id} className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {pat.teamName}
                  </span>
                  <span className="text-xs font-mono tabular-nums text-stone-500">{pat.date}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-stone-900">{pat.shift}</h4>
                  <p className="text-xs text-stone-500 mt-0.5">Komandan Regu: <strong>{pat.leader}</strong></p>
                </div>

                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-xs space-y-2">
                  <span className="font-semibold text-stone-700 block">Personel Giliran:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {pat.members.map(m => (
                      <span key={m} className="px-2 py-0.5 bg-white border border-stone-200 rounded font-medium text-stone-800 text-[11px]">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {pat.notes && (
                  <p className="text-xs text-stone-600 italic">
                    Catatan Pos: "{pat.notes}"
                  </p>
                )}

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>6 Titik Checkpoint Patroli</span>
                  <span className="text-emerald-700 font-medium">Status: {pat.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: DARURAT & SOS */}
      {activeSubTab === 'darurat' && (
        <div className="space-y-6">
          {/* Active Panic Alert Banner */}
          {panicAlert && panicAlert.active && (
            <div className="bg-rose-600 text-white p-6 rounded-2xl shadow-lg border-2 border-rose-700 animate-pulse space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-white" />
                  <span className="font-black text-sm uppercase tracking-wider">
                    ALARM DARURAT AKTIF (PANIC ALERT)
                  </span>
                </div>
                <span className="font-mono text-xs bg-rose-700 px-2 py-0.5 rounded">
                  {panicAlert.triggeredAt}
                </span>
              </div>

              <div className="bg-white/10 p-4 rounded-xl space-y-1">
                <p className="text-sm font-bold">
                  Pelapor: {panicAlert.triggeredBy} ({panicAlert.houseBlock})
                </p>
                <p className="text-xs">
                  Jenis Darurat: <strong>{panicAlert.emergencyType}</strong>
                </p>
                <p className="text-xs text-rose-100">
                  Keterangan: {panicAlert.locationNotes}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={resolvePanicAlert}
                  className="px-4 py-2 text-xs font-bold text-rose-900 bg-white hover:bg-rose-50 rounded-lg shadow-sm transition-colors"
                >
                  Matikan Alarm / Konfirmasi Situasi Terkendali
                </button>
              </div>
            </div>
          )}

          {/* Trigger Panic Box */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">Tombol Darurat Warga (Panic Button)</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Gunakan hanya saat situasi gawat darurat yang mengancam keselamatan jiwa atau harta benda.
                </p>
              </div>
              <button
                onClick={() => setIsPanicModalOpen(true)}
                className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-md transition-all flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Tekan Panic Button Sekarang</span>
              </button>
            </div>
          </div>

          {/* Emergency Directory Contacts */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
            <h4 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-700" />
              <span>Daftar Kontak Cepat Darurat Kawasan Saung Kebun</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 block font-medium">Pos Keamanan Utama Saung Kebun</span>
                <span className="font-bold text-stone-900 text-sm mt-0.5 block">021-8899-7711</span>
                <span className="text-emerald-700 font-semibold block mt-1">Siaga 24 Jam (Komandan Joko)</span>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 block font-medium">Polsek Pancoran Mas / Kebun Asri</span>
                <span className="font-bold text-stone-900 text-sm mt-0.5 block">021-752-0012</span>
                <span className="text-stone-500 block mt-1">Bhabinkamtibmas: Aiptu Supriadi</span>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 block font-medium">Dinas Pemadam Kebakaran (Damkar)</span>
                <span className="font-bold text-stone-900 text-sm mt-0.5 block">113 / 021-7782-3671</span>
                <span className="text-stone-500 block mt-1">Pos Cipayung / Pancoran Mas</span>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 block font-medium">Ambulans & IGD RSUD Terdekat</span>
                <span className="font-bold text-stone-900 text-sm mt-0.5 block">118 / 021-2940-2288</span>
                <span className="text-stone-500 block mt-1">Layanan Gawat Darurat Medis</span>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 block font-medium">Gangguan Listrik PLN</span>
                <span className="font-bold text-stone-900 text-sm mt-0.5 block">123</span>
                <span className="text-stone-500 block mt-1">PLN Distribusi Depok</span>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 block font-medium">Ketua RT 04 (Ir. H. Gunawan)</span>
                <span className="font-bold text-stone-900 text-sm mt-0.5 block">0812-3456-7890</span>
                <span className="text-stone-500 block mt-1">Kavling Blok A-01</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Guest Modal */}
      {isNewGuestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full border border-stone-200 shadow-xl p-6">
            <h3 className="text-base font-bold text-stone-900 mb-1">Catat Tamu Masuk Gerbang</h3>
            <p className="text-xs text-stone-500 mb-4">Pemeriksaan & Registrasi oleh Petugas Keamanan</p>

            <form onSubmit={handleCreateGuest} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Tamu / Pengunjung</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Contoh: Bp. Hendra / Kurir Logistik J&T"
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">No. Polisi / Plat</label>
                  <input
                    type="text"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    placeholder="B 1234 ABC"
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 uppercase font-mono text-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Kartu Identitas</label>
                  <select
                    value={idCardType}
                    onChange={(e) => setIdCardType(e.target.value as any)}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  >
                    <option value="KTP">KTP</option>
                    <option value="SIM">SIM</option>
                    <option value="Passport">Passport</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Rumah / Kavling Tujuan</label>
                <select
                  value={destinationHouse}
                  onChange={(e) => {
                    setDestinationHouse(e.target.value);
                    const selected = houses.find(h => `Blok ${h.block}-${h.number} (${h.residentName})` === e.target.value);
                    if (selected) setHostName(selected.residentName);
                  }}
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                >
                  {houses.map(h => (
                    <option key={h.id} value={`Blok ${h.block}-${h.number} (${h.residentName})`}>
                      Blok {h.block}-{h.number} · {h.residentName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Keperluan Kunjungan</label>
                <textarea
                  rows={2}
                  value={guestPurpose}
                  onChange={(e) => setGuestPurpose(e.target.value)}
                  placeholder="Contoh: Silaturahmi keluarga / Antar pesanan tanaman / Servis AC"
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsNewGuestModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
                >
                  Izinkan Masuk & Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Trigger Panic Modal */}
      {isPanicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full border border-rose-300 shadow-2xl p-6">
            <div className="flex items-center gap-2 text-rose-600 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-stone-900">Aktifkan Sinyal Darurat (Panic Button)</h3>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Peringatan ini akan segera disiarkan ke pos keamanan perumahan dan membunyikan sirine darurat.
            </p>

            <form onSubmit={handleLaunchPanic} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Kategori Kondisi Darurat</label>
                <select
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                >
                  <option value="Pencurian / Orang Mencurigakan">Pencurian / Orang Mencurigakan</option>
                  <option value="Kebakaran">Kebakaran</option>
                  <option value="Darurat Medis">Darurat Medis / Pingsan / Sakit Berat</option>
                  <option value="Gangguan Keamanan">Gangguan Keamanan Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Catatan Lokasi Tambahan</label>
                <textarea
                  rows={2}
                  value={locationNotes}
                  onChange={(e) => setLocationNotes(e.target.value)}
                  placeholder="Contoh: Ada asap tebal di belakang rumah Blok B-03 atau butuh tandu medis"
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsPanicModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
                >
                  SIARKAN ALARM DARURAT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
