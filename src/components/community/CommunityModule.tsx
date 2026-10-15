import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Trees, 
  MessageSquareWarning, 
  ShoppingBag, 
  Calendar, 
  Clock, 
  Users, 
  PlusCircle, 
  CheckCircle2, 
  Send, 
  Phone, 
  Star, 
  Filter, 
  AlertCircle,
  Megaphone,
  Check,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { FacilityBooking, Complaint, Announcement, MarketItem } from '../../types';

export const CommunityModule: React.FC = () => {
  const { 
    currentUser, 
    facilities, 
    bookings, 
    createBooking, 
    updateBookingStatus, 
    announcements, 
    createAnnouncement, 
    complaints, 
    createComplaint, 
    updateComplaintStatus, 
    marketItems, 
    addMarketItem,
    houses
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'fasilitas' | 'aspirasi' | 'pasar'>('fasilitas');

  // Booking Modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedFacilityId, setSelectedFacilityId] = useState(facilities[0]?.id || 'fac-01');
  const [bookingDate, setBookingDate] = useState('2026-10-25');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('09:00 - 12:00 WIB');
  const [bookingPurpose, setBookingPurpose] = useState('');
  const [bookingGuestCount, setBookingGuestCount] = useState(15);

  // New Complaint Modal
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [cmpTitle, setCmpTitle] = useState('');
  const [cmpCategory, setCmpCategory] = useState<Complaint['category']>('Penerangan Jalan (PJU)');
  const [cmpLocation, setCmpLocation] = useState('');
  const [cmpDesc, setCmpDesc] = useState('');
  const [cmpPriority, setCmpPriority] = useState<Complaint['priority']>('Sedang');

  // Update Complaint Notes Modal
  const [selectedCmpForUpdate, setSelectedCmpForUpdate] = useState<Complaint | null>(null);
  const [cmpUpdateStatus, setCmpUpdateStatus] = useState<Complaint['status']>('Dalam Proses');
  const [cmpUpdateNotes, setCmpUpdateNotes] = useState('');

  // New Announcement Modal
  const [isNewAnnModalOpen, setIsNewAnnModalOpen] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState<Announcement['category']>('Pengumuman Penting');
  const [annContent, setAnnContent] = useState('');
  const [annPinned, setAnnPinned] = useState(false);
  const [annEventDate, setAnnEventDate] = useState('');

  // New Market Item Modal
  const [isNewMarketModalOpen, setIsNewMarketModalOpen] = useState(false);
  const [mktTitle, setMktTitle] = useState('');
  const [mktCategory, setMktCategory] = useState<MarketItem['category']>('Hasil Kebun & Hidroponik');
  const [mktPrice, setMktPrice] = useState(25000);
  const [mktDesc, setMktDesc] = useState('');
  const [mktSellerName, setMktSellerName] = useState(currentUser.name);
  const [mktSellerHouse, setMktSellerHouse] = useState(
    currentUser.houseId 
      ? `Blok ${houses.find(h => h.id === currentUser.houseId)?.block}-${houses.find(h => h.id === currentUser.houseId)?.number}`
      : 'Blok B-03'
  );
  const [mktSellerWa, setMktSellerWa] = useState(currentUser.phone);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const facility = facilities.find(f => f.id === selectedFacilityId);
    if (!facility || !bookingPurpose) return;

    const currentHouse = currentUser.houseId ? houses.find(h => h.id === currentUser.houseId) : undefined;
    const houseStr = currentHouse ? `Blok ${currentHouse.block}-${currentHouse.number}` : 'Blok B-03';

    createBooking({
      facilityId: facility.id,
      facilityName: facility.name,
      applicantName: currentUser.name,
      houseBlock: houseStr,
      applicantPhone: currentUser.phone,
      eventDate: bookingDate,
      timeSlot: bookingTimeSlot,
      purpose: bookingPurpose,
      guestCount: bookingGuestCount
    });
    setIsBookingModalOpen(false);
    setBookingPurpose('');
  };

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmpTitle || !cmpDesc || !cmpLocation) return;
    createComplaint({
      title: cmpTitle,
      category: cmpCategory,
      location: cmpLocation,
      description: cmpDesc,
      priority: cmpPriority
    });
    setIsComplaintModalOpen(false);
    setCmpTitle('');
    setCmpDesc('');
    setCmpLocation('');
  };

  const handleSaveComplaintStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCmpForUpdate) return;
    updateComplaintStatus(selectedCmpForUpdate.id, cmpUpdateStatus, cmpUpdateNotes);
    setSelectedCmpForUpdate(null);
    setCmpUpdateNotes('');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;
    createAnnouncement({
      title: annTitle,
      category: annCategory,
      content: annContent,
      pinned: annPinned,
      eventDate: annEventDate || undefined
    });
    setIsNewAnnModalOpen(false);
    setAnnTitle('');
    setAnnContent('');
    setAnnEventDate('');
  };

  const handleCreateMarketItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mktTitle || !mktPrice) return;
    addMarketItem({
      title: mktTitle,
      sellerName: mktSellerName,
      sellerHouse: mktSellerHouse,
      sellerWhatsapp: mktSellerWa,
      price: mktPrice,
      category: mktCategory,
      description: mktDesc
    });
    setIsNewMarketModalOpen(false);
    setMktTitle('');
    setMktDesc('');
    setMktPrice(25000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tab Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Fasilitas, Komunitas & UMKM Saung Kebun
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Peminjaman fasilitas saung bersama, papan pengumuman resmi, pelaporan aspirasi lingkungan, dan pasar warga.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('fasilitas')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeSubTab === 'fasilitas'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Fasilitas Saung ({facilities.length})
          </button>
          <button
            onClick={() => setActiveSubTab('aspirasi')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeSubTab === 'aspirasi'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Pengumuman & Keluhan
          </button>
          <button
            onClick={() => setActiveSubTab('pasar')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeSubTab === 'pasar'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Pasar Warga / UMKM ({marketItems.length})
          </button>
        </div>
      </div>

      {/* SUBTAB 1: FASILITAS SAUNG */}
      {activeSubTab === 'fasilitas' && (
        <div className="space-y-6">
          {/* Facility Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {facilities.map((fac) => (
              <div key={fac.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  <div className="h-44 relative overflow-hidden bg-stone-100">
                    <img
                      src={fac.imageUrl}
                      alt={fac.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-stone-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[11px] font-semibold">
                      Gratis Warga
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">{fac.name}</h3>
                      <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-stone-400" />
                        <span>Kapasitas: {fac.capacity}</span>
                      </p>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {fac.description}
                    </p>

                    <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-[11px] text-stone-600 space-y-1">
                      <p className="font-semibold text-stone-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-500" />
                        <span>Operasional: {fac.operationalHours}</span>
                      </p>
                      <ul className="list-disc pl-3 space-y-0.5 text-stone-500">
                        {fac.rules.slice(0, 2).map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 border-t border-stone-100">
                  <button
                    onClick={() => {
                      setSelectedFacilityId(fac.id);
                      setIsBookingModalOpen(true);
                    }}
                    className="w-full py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Reservasi Fasilitas Ini</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bookings List */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-stone-900">Jadwal Penggunaan & Reservasi Fasilitas</h4>
                <p className="text-xs text-stone-500">Peminjaman fasilitas terdaftar warga Saung Kebun.</p>
              </div>
              <span className="text-xs font-mono tabular-nums text-stone-500">
                {bookings.length} Reservasi
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Fasilitas</th>
                    <th className="py-3 px-4">Pemohon</th>
                    <th className="py-3 px-4">Tanggal Acara</th>
                    <th className="py-3 px-4">Waktu</th>
                    <th className="py-3 px-4">Keperluan Kegiatan</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {bookings.map((b) => {
                    const isApproved = b.status === 'Disetujui';
                    const isPending = b.status === 'Menunggu Persetujuan';

                    return (
                      <tr key={b.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-stone-900 whitespace-nowrap">
                          {b.facilityName.split('&')[0]}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-stone-900">{b.applicantName}</p>
                          <p className="text-[11px] text-stone-500">{b.houseBlock}</p>
                        </td>
                        <td className="py-3.5 px-4 font-mono tabular-nums text-stone-700 whitespace-nowrap">
                          {b.eventDate}
                        </td>
                        <td className="py-3.5 px-4 font-mono tabular-nums text-stone-600 whitespace-nowrap">
                          {b.timeSlot}
                        </td>
                        <td className="py-3.5 px-4 text-stone-600 max-w-xs truncate">
                          {b.purpose} ({b.guestCount} orang)
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            isApproved
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : isPending
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          {isPending && currentUser.role === 'pengurus' ? (
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => updateBookingStatus(b.id, 'Disetujui')}
                                className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md shadow-xs"
                              >
                                Setujui
                              </button>
                              <button
                                onClick={() => updateBookingStatus(b.id, 'Ditolak')}
                                className="px-2 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md"
                              >
                                Tolak
                              </button>
                            </div>
                          ) : (
                            <span className="text-stone-400 text-xs">-</span>
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

      {/* SUBTAB 2: PENGUMUMAN & KELUHAN LINGKUNGAN */}
      {activeSubTab === 'aspirasi' && (
        <div className="space-y-6">
          {/* Top Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Papan Pengumuman & Kanal Lapor Aspirasi</h3>
              <p className="text-xs text-stone-500">Transparansi informasi dan penanganan keluhan fasilitas umum secara bertanggung jawab.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsComplaintModalOpen(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>+ Lapor Keluhan Lingkungan</span>
              </button>

              {currentUser.role === 'pengurus' && (
                <button
                  onClick={() => setIsNewAnnModalOpen(true)}
                  className="px-3.5 py-2 text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-300 transition-colors flex items-center gap-1.5"
                >
                  <Megaphone className="w-3.5 h-3.5 text-stone-700" />
                  <span>+ Siarkan Pengumuman RT</span>
                </button>
              )}
            </div>
          </div>

          {/* Announcements Feed */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Siaran Resmi Pengurus RT 04</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {ann.category}
                      </span>
                      <span>{ann.publishedAt}</span>
                    </div>
                    <h5 className="text-sm font-bold text-stone-900">{ann.title}</h5>
                    <p className="text-xs text-stone-600 leading-relaxed mt-1">{ann.content}</p>
                    {ann.eventDate && (
                      <div className="mt-2 text-xs text-stone-700 bg-stone-50 p-2 rounded border border-stone-200">
                        <strong>Pelaksanaan:</strong> {ann.eventDate}
                      </div>
                    )}
                  </div>
                  <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400">
                    Oleh: {ann.author} ({ann.authorRole})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Complaints Tickets Table */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-stone-900">Tiket Penanganan Keluhan & Fasum</h4>
                <p className="text-xs text-stone-500">Pelaporan kerusakan sarana prasarana perumahan Saung Kebun.</p>
              </div>
              <span className="text-xs font-mono tabular-nums text-stone-500">
                {complaints.length} Tiket Terdaftar
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Judul Keluhan</th>
                    <th className="py-3 px-4">Kategori & Prioritas</th>
                    <th className="py-3 px-4">Lokasi Titik Masalah</th>
                    <th className="py-3 px-4">Pelapor</th>
                    <th className="py-3 px-4">Status Penanganan</th>
                    <th className="py-3 px-4">Catatan Tindak Lanjut</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {complaints.map((c) => {
                    const isDone = c.status === 'Selesai';
                    const isProgress = c.status === 'Dalam Proses';

                    return (
                      <tr key={c.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-stone-900 max-w-xs">
                          {c.title}
                          <span className="block text-[11px] text-stone-500 font-normal line-clamp-1">{c.description}</span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <p className="font-semibold text-stone-800">{c.category}</p>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            c.priority === 'Tinggi' ? 'text-rose-700 bg-rose-50' : 'text-stone-600 bg-stone-100'
                          }`}>
                            Prioritas: {c.priority}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-stone-700 max-w-xs truncate">
                          {c.location}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <p className="font-medium text-stone-900">{c.reportedBy}</p>
                          <p className="text-[11px] text-stone-400 font-mono">{c.reportedAt}</p>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            isDone
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : isProgress
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-stone-100 text-stone-800 border-stone-200'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-stone-600 max-w-xs truncate">
                          {c.responseNotes ? c.responseNotes : <span className="text-stone-400 italic">Belum ada tanggapan</span>}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          {currentUser.role === 'pengurus' || currentUser.role === 'satpam' ? (
                            <button
                              onClick={() => {
                                setSelectedCmpForUpdate(c);
                                setCmpUpdateStatus(c.status);
                                setCmpUpdateNotes(c.responseNotes || '');
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
                            >
                              Update Status
                            </button>
                          ) : (
                            <span className="text-stone-400 text-xs">Terpantau</span>
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

      {/* SUBTAB 3: PASAR WARGA / UMKM */}
      {activeSubTab === 'pasar' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 rounded-2xl shadow-sm">
            <div>
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                Ekonomi Paguyuban & Produk Lokal
              </span>
              <h3 className="text-lg font-bold mt-1">
                Pasar UMKM Warga Perumahan Saung Kebun
              </h3>
              <p className="text-xs text-emerald-100/80 mt-1 max-w-xl leading-relaxed">
                Dukung usaha tetangga sendiri! Belanja sayur hidroponik segar panen komplek, masakan kuliner khas rumahan, bibit tanaman, hingga jasa pemeliharaan taman asri.
              </p>
            </div>
            <button
              onClick={() => setIsNewMarketModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-stone-900 bg-white hover:bg-stone-100 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-emerald-800" />
              <span>+ Pasang Dagangan / Jasa</span>
            </button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {item.category}
                    </span>
                    <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                      <Star className="w-3 h-3 fill-amber-500" />
                      <span>{item.rating}</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-stone-900 mb-1 line-clamp-1">{item.title}</h4>
                  <div className="text-base font-bold font-mono tabular-nums text-emerald-800 mb-2">
                    {formatIDR(item.price)}
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                    <p className="font-semibold text-stone-800">{item.sellerName}</p>
                    <p>{item.sellerHouse}</p>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 border-t border-stone-100">
                  <a
                    href={`https://wa.me/${item.sellerWhatsapp}?text=Halo%20${encodeURIComponent(item.sellerName)},%20saya%20warga%20Saung%20Kebun%20ingin%20memesan:%20${encodeURIComponent(item.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Pesan via WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full border border-stone-200 shadow-xl p-6">
            <h3 className="text-base font-bold text-stone-900 mb-1">Formulir Booking Fasilitas Bersama</h3>
            <p className="text-xs text-stone-500 mb-4">Kawasan Perumahan Saung Kebun</p>

            <form onSubmit={handleCreateBooking} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Pilih Fasilitas</label>
                <select
                  value={selectedFacilityId}
                  onChange={(e) => setSelectedFacilityId(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                >
                  {facilities.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Tanggal Acara</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Perkiraan Tamu</label>
                  <input
                    type="number"
                    min="2"
                    max="60"
                    value={bookingGuestCount}
                    onChange={(e) => setBookingGuestCount(Number(e.target.value))}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 font-mono tabular-nums text-stone-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Slot Waktu Pemakaian</label>
                <select
                  value={bookingTimeSlot}
                  onChange={(e) => setBookingTimeSlot(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                >
                  <option value="08:00 - 11:00 WIB">Pagi (08:00 - 11:00 WIB)</option>
                  <option value="13:00 - 16:00 WIB">Siang (13:00 - 16:00 WIB)</option>
                  <option value="16:00 - 18:00 WIB">Sore (16:00 - 18:00 WIB)</option>
                  <option value="19:00 - 21:30 WIB">Malam (19:00 - 21:30 WIB)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Keperluan / Nama Acara</label>
                <textarea
                  rows={2}
                  value={bookingPurpose}
                  onChange={(e) => setBookingPurpose(e.target.value)}
                  placeholder="Contoh: Arisan keluarga / Syukuran aqiqah / Latihan badminton bersama"
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
                >
                  Kirim Pengajuan Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Complaint Modal */}
      {isComplaintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full border border-stone-200 shadow-xl p-6">
            <h3 className="text-base font-bold text-stone-900 mb-1">Lapor Keluhan Lingkungan</h3>
            <p className="text-xs text-stone-500 mb-4">Aduan akan segera diverifikasi oleh tim kebersihan / keamanan.</p>

            <form onSubmit={handleCreateComplaint} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Judul Permasalahan</label>
                <input
                  type="text"
                  value={cmpTitle}
                  onChange={(e) => setCmpTitle(e.target.value)}
                  placeholder="Contoh: Lampu tiang PJU mati / Saluran got mampet"
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Kategori</label>
                  <select
                    value={cmpCategory}
                    onChange={(e) => setCmpCategory(e.target.value as any)}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  >
                    <option value="Penerangan Jalan (PJU)">Penerangan Jalan (PJU)</option>
                    <option value="Kebersihan & Sampah">Kebersihan & Sampah</option>
                    <option value="Jalan & Drainase">Jalan & Drainase</option>
                    <option value="Ketertiban & Kebisingan">Ketertiban & Kebisingan</option>
                    <option value="Keamanan">Keamanan</option>
                    <option value="Fasilitas Saung / Lapangan">Fasilitas Saung</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Tingkat Urgensi</label>
                  <select
                    value={cmpPriority}
                    onChange={(e) => setCmpPriority(e.target.value as any)}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  >
                    <option value="Rendah">Rendah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Tinggi">Tinggi / Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Lokasi Detail Kejadian</label>
                <input
                  type="text"
                  value={cmpLocation}
                  onChange={(e) => setCmpLocation(e.target.value)}
                  placeholder="Contoh: Depan kavling Blok C-08 dekat belokan saung"
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Deskripsi Keluhan</label>
                <textarea
                  rows={3}
                  value={cmpDesc}
                  onChange={(e) => setCmpDesc(e.target.value)}
                  placeholder="Jelaskan kondisi secara spesifik..."
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsComplaintModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs"
                >
                  Kirim Tiket Keluhan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Complaint Status Modal (Pengurus) */}
      {selectedCmpForUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full border border-stone-200 shadow-xl p-6">
            <h3 className="text-base font-bold text-stone-900 mb-1">Update Status Tiket Aduan</h3>
            <p className="text-xs text-stone-500 mb-4">{selectedCmpForUpdate.title}</p>

            <form onSubmit={handleSaveComplaintStatus} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Status Penanganan</label>
                <select
                  value={cmpUpdateStatus}
                  onChange={(e) => setCmpUpdateStatus(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                >
                  <option value="Menunggu Penanganan">Menunggu Penanganan</option>
                  <option value="Dalam Proses">Dalam Proses (Sedang Dikerjakan)</option>
                  <option value="Selesai">Selesai (Tuntas)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Catatan Tindak Lanjut Petugas</label>
                <textarea
                  rows={3}
                  value={cmpUpdateNotes}
                  onChange={(e) => setCmpUpdateNotes(e.target.value)}
                  placeholder="Contoh: Sudah diganti bohlam baru oleh Pak Joko satpam pukul 14:00 WIB"
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setSelectedCmpForUpdate(null)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
                >
                  Perbarui Tiket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Announcement Modal */}
      {isNewAnnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full border border-stone-200 shadow-xl p-6">
            <h3 className="text-base font-bold text-stone-900 mb-1">Siarkan Pengumuman RT Baru</h3>
            <p className="text-xs text-stone-500 mb-4">Pengurus RT 04 / RW 08 Saung Kebun</p>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Judul Pengumuman</label>
                <input
                  type="text"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="Contoh: Rapat Evaluasi Keamanan Akhir Tahun"
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Kategori</label>
                <select
                  value={annCategory}
                  onChange={(e) => setAnnCategory(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                >
                  <option value="Pengumuman Penting">Pengumuman Penting</option>
                  <option value="Kegiatan Warga">Kegiatan Warga</option>
                  <option value="Keuangan RT">Keuangan RT</option>
                  <option value="Kerja Bakti">Kerja Bakti</option>
                  <option value="Keamanan">Keamanan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Tanggal / Waktu Acara (Jika Ada)</label>
                <input
                  type="text"
                  value={annEventDate}
                  onChange={(e) => setAnnEventDate(e.target.value)}
                  placeholder="Contoh: Minggu, 25 Oktober 2026 · Pukul 08:00 WIB"
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Isi Pengumuman</label>
                <textarea
                  rows={4}
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Tuliskan detail pengumuman untuk seluruh warga..."
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsNewAnnModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
                >
                  Siarkan Pengumuman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Market Item Modal */}
      {isNewMarketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full border border-stone-200 shadow-xl p-6">
            <h3 className="text-base font-bold text-stone-900 mb-1">Daftarkan Produk / Jasa UMKM</h3>
            <p className="text-xs text-stone-500 mb-4">Etalase digital promosi untuk warga Saung Kebun</p>

            <form onSubmit={handleCreateMarketItem} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Produk / Jasa</label>
                <input
                  type="text"
                  value={mktTitle}
                  onChange={(e) => setMktTitle(e.target.value)}
                  placeholder="Contoh: Paket Sayur Bayam Hidroponik / Kue Basah"
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Kategori</label>
                  <select
                    value={mktCategory}
                    onChange={(e) => setMktCategory(e.target.value as any)}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  >
                    <option value="Hasil Kebun & Hidroponik">Hasil Kebun & Hidroponik</option>
                    <option value="Kuliner & Snack">Kuliner & Snack</option>
                    <option value="Bibit & Tanaman">Bibit & Tanaman</option>
                    <option value="Jasa & Kerajinan">Jasa & Kerajinan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={mktPrice}
                    onChange={(e) => setMktPrice(Number(e.target.value))}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 font-mono tabular-nums text-stone-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Penjual</label>
                  <input
                    type="text"
                    value={mktSellerName}
                    onChange={(e) => setMktSellerName(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">No. WhatsApp</label>
                  <input
                    type="text"
                    value={mktSellerWa}
                    onChange={(e) => setMktSellerWa(e.target.value)}
                    placeholder="08123456789"
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 font-mono tabular-nums text-stone-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Deskripsi Produk / Jasa</label>
                <textarea
                  rows={2}
                  value={mktDesc}
                  onChange={(e) => setMktDesc(e.target.value)}
                  placeholder="Jelaskan keunggulan, kesegaran atau cara pesan..."
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsNewMarketModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
                >
                  Tayangkan di Pasar Warga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
