import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  FileText, 
  Home, 
  Search, 
  Car, 
  Phone, 
  PlusCircle, 
  CheckCircle, 
  XCircle, 
  Printer, 
  Clock, 
  AlertCircle,
  FileCheck2,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  Check,
  Building,
  ShieldCheck
} from 'lucide-react';
import { House, DocumentRequest, OwnershipStatus } from '../../types';
import { OfficialLetterModal } from '../letters/OfficialLetterModal';

export const AdministrationModule: React.FC = () => {
  const { 
    currentUser, 
    houses, 
    documentRequests, 
    requestDocument, 
    updateDocumentStatus,
    addHouse,
    updateHouse,
    deleteHouse
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'direktori' | 'surat'>('direktori');
  const [searchTerm, setSearchTerm] = useState('');
  const [ownershipFilter, setOwnershipFilter] = useState<string>('Semua');
  const [blockFilter, setBlockFilter] = useState<string>('Semua');

  // Selected house for detail view
  const [selectedHouseDetail, setSelectedHouseDetail] = useState<House | null>(null);

  // CRUD Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
  const [deletingHouse, setDeletingHouse] = useState<House | null>(null);

  // House Form State
  const [formBlock, setFormBlock] = useState('A');
  const [formNumber, setFormNumber] = useState('01');
  const [formResidentName, setFormResidentName] = useState('');
  const [formOwnershipStatus, setFormOwnershipStatus] = useState<OwnershipStatus>('Pemilik Tetap');
  const [formOccupantCount, setFormOccupantCount] = useState(3);
  const [formResidentPhone, setFormResidentPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCars, setFormCars] = useState(1);
  const [formMotorcycles, setFormMotorcycles] = useState(1);
  const [formPlateNumbers, setFormPlateNumbers] = useState('');

  // Open Add Modal
  const openAddModal = () => {
    setFormBlock('A');
    setFormNumber('01');
    setFormResidentName('');
    setFormOwnershipStatus('Pemilik Tetap');
    setFormOccupantCount(3);
    setFormResidentPhone('0812-');
    setFormAddress('Jl. Saung Kebun Raya Blok A-01');
    setFormCars(1);
    setFormMotorcycles(1);
    setFormPlateNumbers('B 1234 SKB');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (house: House) => {
    setEditingHouse(house);
    setFormBlock(house.block);
    setFormNumber(house.number);
    setFormResidentName(house.residentName);
    setFormOwnershipStatus(house.ownershipStatus);
    setFormOccupantCount(house.occupantCount);
    setFormResidentPhone(house.residentPhone);
    setFormAddress(house.address);
    setFormCars(house.vehicles.cars);
    setFormMotorcycles(house.vehicles.motorcycles);
    setFormPlateNumbers(house.vehicles.plateNumbers.join(', '));
  };

  // Handle Save New House
  const handleSaveAddHouse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formResidentName || !formNumber) return;

    const plates = formPlateNumbers
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    addHouse({
      block: formBlock,
      number: formNumber.padStart(2, '0'),
      residentName: formResidentName,
      ownershipStatus: formOwnershipStatus,
      occupantCount: Number(formOccupantCount) || 1,
      residentPhone: formResidentPhone,
      address: formAddress || `Jl. Saung Kebun Raya Blok ${formBlock}-${formNumber.padStart(2, '0')}`,
      vehicles: {
        cars: Number(formCars) || 0,
        motorcycles: Number(formMotorcycles) || 0,
        plateNumbers: plates.length > 0 ? plates : ['B 1000 SKB']
      }
    });

    setIsAddModalOpen(false);
  };

  // Handle Save Edit House
  const handleSaveEditHouse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHouse || !formResidentName || !formNumber) return;

    const plates = formPlateNumbers
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    updateHouse(editingHouse.id, {
      block: formBlock,
      number: formNumber.padStart(2, '0'),
      residentName: formResidentName,
      ownershipStatus: formOwnershipStatus,
      occupantCount: Number(formOccupantCount) || 1,
      residentPhone: formResidentPhone,
      address: formAddress || `Jl. Saung Kebun Raya Blok ${formBlock}-${formNumber.padStart(2, '0')}`,
      vehicles: {
        cars: Number(formCars) || 0,
        motorcycles: Number(formMotorcycles) || 0,
        plateNumbers: plates
      }
    });

    setEditingHouse(null);
  };

  // Handle Confirm Delete House
  const handleConfirmDelete = () => {
    if (deletingHouse) {
      deleteHouse(deletingHouse.id);
      setDeletingHouse(null);
    }
  };

  // New Document Request Modal
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState(false);
  const [docType, setDocType] = useState<DocumentRequest['type']>('Surat Keterangan Domisili');
  const [docName, setDocName] = useState(currentUser.name);
  const [docNik, setDocNik] = useState('3174091208850003');
  const [docHouse, setDocHouse] = useState(
    currentUser.houseId 
      ? `Blok ${houses.find(h => h.id === currentUser.houseId)?.block}-${houses.find(h => h.id === currentUser.houseId)?.number}`
      : 'Blok B-03'
  );
  const [docPhone, setDocPhone] = useState(currentUser.phone);
  const [docPurpose, setDocPurpose] = useState('');

  // Selected document for official print preview
  const [previewDoc, setPreviewDoc] = useState<DocumentRequest | null>(null);

  // Filtered houses
  const filteredHouses = houses.filter(h => {
    const matchBlock = blockFilter === 'Semua' || h.block === blockFilter;
    const matchOwnership = ownershipFilter === 'Semua' || h.ownershipStatus === ownershipFilter;
    const query = searchTerm.toLowerCase();
    const matchSearch = 
      h.residentName.toLowerCase().includes(query) ||
      `blok ${h.block}-${h.number}`.toLowerCase().includes(query) ||
      h.vehicles.plateNumbers.some(p => p.toLowerCase().includes(query));
    return matchBlock && matchOwnership && matchSearch;
  });

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !docNik || !docPurpose) return;
    requestDocument({
      type: docType,
      applicantName: docName,
      applicantNik: docNik,
      houseBlock: docHouse,
      applicantPhone: docPhone,
      purpose: docPurpose
    });
    setIsNewDocModalOpen(false);
    setDocPurpose('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tab Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Administrasi & Layanan Warga Digital
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Pendataan sensus warga, kavling perumahan, dan pengajuan surat pengantar resmi RT 04 / RW 08.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('direktori')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeSubTab === 'direktori'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Direktori Warga & Rumah
          </button>
          <button
            onClick={() => setActiveSubTab('surat')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeSubTab === 'surat'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Layanan Surat Menyurat
          </button>
        </div>
      </div>

      {/* SUBTAB 1: DIREKTORI WARGA & RUMAH */}
      {activeSubTab === 'direktori' && (
        <div className="space-y-6">
          {/* Summary Counts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <span className="text-xs text-stone-500">Total Kavling Terdata</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1">{houses.length}</div>
              <p className="text-[11px] text-stone-400 mt-1">Blok A s/d Blok E</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <span className="text-xs text-stone-500">Pemilik Tetap</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-emerald-800 mt-1">
                {houses.filter(h => h.ownershipStatus === 'Pemilik Tetap').length}
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Warga domisili KTP</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <span className="text-xs text-stone-500">Pengontrak / Sewa</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-blue-800 mt-1">
                {houses.filter(h => h.ownershipStatus === 'Pengontrak').length}
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Lapor domisili aktif</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <span className="text-xs text-stone-500">Kendaraan Terdaftar</span>
              <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1">
                {houses.reduce((acc, h) => acc + h.vehicles.cars + h.vehicles.motorcycles, 0)}
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Stiker gerbang satpam</p>
            </div>
          </div>

          {/* Filter Bar & Tambah Warga Button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama warga, nomor kavling, atau plat nomor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="text-xs text-stone-500">Blok:</span>
                <select
                  value={blockFilter}
                  onChange={(e) => setBlockFilter(e.target.value)}
                  className="text-xs rounded-lg border border-stone-300 p-1.5 text-stone-800 bg-white"
                >
                  <option value="Semua">Semua Blok</option>
                  <option value="A">Blok A</option>
                  <option value="B">Blok B</option>
                  <option value="C">Blok C</option>
                  <option value="D">Blok D</option>
                  <option value="E">Blok E</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs text-stone-500">Status:</span>
                <select
                  value={ownershipFilter}
                  onChange={(e) => setOwnershipFilter(e.target.value)}
                  className="text-xs rounded-lg border border-stone-300 p-1.5 text-stone-800 bg-white"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Pemilik Tetap">Pemilik Tetap</option>
                  <option value="Pengontrak">Pengontrak</option>
                  <option value="Kosong">Kosong / Renovasi</option>
                </select>
              </div>

              {/* Tambah Warga Baru Button */}
              <button
                onClick={openAddModal}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#10B981] hover:bg-[#059669] rounded-xl shadow-xs transition-colors whitespace-nowrap w-full sm:w-auto ml-0 sm:ml-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tambah Warga Baru</span>
              </button>
            </div>
          </div>

          {/* Table: Houses Directory */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Kavling</th>
                    <th className="py-3 px-4">Nama Kepala Keluarga</th>
                    <th className="py-3 px-4">Status Hak Milik</th>
                    <th className="py-3 px-4">Anggota Keluarga</th>
                    <th className="py-3 px-4">Kendaraan Terdata</th>
                    <th className="py-3 px-4">Kontak WhatsApp</th>
                    <th className="py-3 px-4 text-center min-w-[200px]">Aksi & Sensus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredHouses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-stone-400">
                        <Users className="w-8 h-8 mx-auto mb-2 text-stone-300 stroke-[1.5]" />
                        <p className="font-semibold text-stone-600">Tidak ada data warga ditemukan</p>
                        <p className="text-[11px] text-stone-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter blok di atas</p>
                      </td>
                    </tr>
                  ) : (
                    filteredHouses.map((h) => (
                      <tr key={h.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-stone-900 whitespace-nowrap">
                          Blok {h.block}-{h.number}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-stone-900">
                          {h.residentName}
                        </td>
                        <td className="py-3.5 px-4 text-stone-600">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                            h.ownershipStatus === 'Pemilik Tetap'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : h.ownershipStatus === 'Pengontrak'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-stone-100 text-stone-600 border-stone-200'
                          }`}>
                            {h.ownershipStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-stone-700 font-mono tabular-nums">
                          {h.occupantCount > 0 ? `${h.occupantCount} Jiwa` : '-'}
                        </td>
                        <td className="py-3.5 px-4 text-stone-600">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {h.vehicles.cars > 0 && (
                              <span className="font-mono tabular-nums">{h.vehicles.cars} Mobil</span>
                            )}
                            {h.vehicles.motorcycles > 0 && (
                              <span className="font-mono tabular-nums">· {h.vehicles.motorcycles} Motor</span>
                            )}
                            {h.vehicles.cars === 0 && h.vehicles.motorcycles === 0 && (
                              <span className="text-stone-400">-</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono tabular-nums text-stone-700">
                          {h.residentPhone}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            {/* Lihat Sensus */}
                            <button
                              onClick={() => setSelectedHouseDetail(h)}
                              className="px-2 py-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors flex items-center gap-1"
                              title="Lihat Detail Sensus"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Sensus</span>
                            </button>

                            {/* Edit Warga */}
                            <button
                              onClick={() => openEditModal(h)}
                              className="px-2 py-1 text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors flex items-center gap-1"
                              title="Edit Data Warga"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            {/* Hapus Warga */}
                            <button
                              onClick={() => setDeletingHouse(h)}
                              className="px-2 py-1 text-[11px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors flex items-center gap-1"
                              title="Hapus Data Warga"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: LAYANAN SURAT MENYURAT */}
      {activeSubTab === 'surat' && (
        <div className="space-y-6">
          {/* Top Info Banner & Request Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-700" />
                <span>Pengurusan Surat Pengantar RT/RW Cepat & Digital</span>
              </h3>
              <p className="text-xs text-stone-600 max-w-xl">
                Ajukan Surat Keterangan Domisili, Pengantar SKCK, Keterangan Pindah, atau Surat Usaha (SKU) secara online tanpa perlu ketok pintu saat jam istirahat pengurus. Dokumen resmi langsung bernomor registrasi dengan tanda tangan digital.
              </p>
            </div>

            <button
              onClick={() => setIsNewDocModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ajukan Permohonan Surat</span>
            </button>
          </div>

          {/* Document Requests Table */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
              <h4 className="text-sm font-bold text-stone-900">Daftar Pengajuan Surat RT 04 / RW 08</h4>
              <span className="text-xs text-stone-500 font-mono tabular-nums">
                Total: {documentRequests.length} Dokumen
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">No. Registrasi</th>
                    <th className="py-3 px-4">Jenis Surat</th>
                    <th className="py-3 px-4">Pemohon & NIK</th>
                    <th className="py-3 px-4">Kavling</th>
                    <th className="py-3 px-4">Keperluan</th>
                    <th className="py-3 px-4">Tgl Pengajuan</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {documentRequests.map((doc) => {
                    const isApproved = doc.status === 'Disetujui';
                    const isPending = doc.status === 'Menunggu Review';

                    return (
                      <tr key={doc.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-stone-900 whitespace-nowrap">
                          {doc.letterNumber}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-stone-900">
                          {doc.type}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-stone-900">{doc.applicantName}</p>
                          <p className="text-[11px] text-stone-500 font-mono tabular-nums">NIK: {doc.applicantNik}</p>
                        </td>
                        <td className="py-3.5 px-4 text-stone-700 whitespace-nowrap">
                          {doc.houseBlock}
                        </td>
                        <td className="py-3.5 px-4 text-stone-600 max-w-xs truncate" title={doc.purpose}>
                          {doc.purpose}
                        </td>
                        <td className="py-3.5 px-4 text-stone-500 font-mono tabular-nums whitespace-nowrap">
                          {doc.requestDate}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            isApproved
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : isPending
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Action for Pengurus: Approve / Reject */}
                            {isPending && currentUser.role === 'pengurus' && (
                              <>
                                <button
                                  onClick={() => updateDocumentStatus(doc.id, 'Disetujui')}
                                  className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors shadow-xs"
                                >
                                  Setujui
                                </button>
                                <button
                                  onClick={() => updateDocumentStatus(doc.id, 'Ditolak', 'Persyaratan berkas kurang lengkap')}
                                  className="px-2 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors"
                                >
                                  Tolak
                                </button>
                              </>
                            )}

                            {/* Action to View & Print Letter */}
                            {isApproved && (
                              <button
                                onClick={() => setPreviewDoc(doc)}
                                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
                              >
                                <Printer className="w-3 h-3" />
                                <span>Cetak Surat</span>
                              </button>
                            )}

                            {isPending && currentUser.role !== 'pengurus' && (
                              <span className="text-stone-400 text-xs italic">Menunggu TTD RT</span>
                            )}
                          </div>
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

      {/* House Sensus Detail Modal */}
      {selectedHouseDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-lg w-full border border-stone-200 shadow-xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Data Sensus Kavling Blok {selectedHouseDetail.block}-{selectedHouseDetail.number}
                </h3>
                <p className="text-xs text-stone-500">{selectedHouseDetail.address}</p>
              </div>
              <button
                onClick={() => setSelectedHouseDetail(null)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3 rounded-lg border border-stone-200">
                <div>
                  <span className="text-stone-500 block">Kepala Keluarga / Penghuni:</span>
                  <strong className="text-stone-900 text-sm">{selectedHouseDetail.residentName}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">Status Kepemilikan:</span>
                  <span className="font-semibold text-emerald-800">{selectedHouseDetail.ownershipStatus}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Nomor WhatsApp:</span>
                  <span className="font-mono font-medium text-stone-900">{selectedHouseDetail.residentPhone}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Jumlah Anggota Keluarga:</span>
                  <span className="font-mono font-bold text-stone-900">{selectedHouseDetail.occupantCount} Jiwa</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-stone-600" />
                  <span>Kendaraan & Stiker Gerbang:</span>
                </h4>
                <div className="space-y-1 pl-1">
                  <p className="text-stone-700">
                    Mobil: <strong className="font-mono">{selectedHouseDetail.vehicles.cars} Unit</strong> · Motor: <strong className="font-mono">{selectedHouseDetail.vehicles.motorcycles} Unit</strong>
                  </p>
                  {selectedHouseDetail.vehicles.plateNumbers.length > 0 ? (
                    <div className="flex gap-1.5 flex-wrap mt-1">
                      {selectedHouseDetail.vehicles.plateNumbers.map(pl => (
                        <span key={pl} className="font-mono px-2 py-0.5 bg-stone-200 text-stone-800 rounded font-semibold text-[11px]">
                          {pl}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-stone-400 italic">Tidak ada kendaraan bermotor terdaftar.</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-rose-600" />
                  <span>Kontak Darurat Tersimpan:</span>
                </h4>
                <p className="text-stone-600">
                  Tersambung ke sistem Panic Button & Pos Keamanan Saung Kebun.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedHouseDetail(null)}
                className="px-4 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Document Request Modal */}
      {isNewDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full border border-stone-200 shadow-xl p-6">
            <h3 className="text-base font-bold text-stone-900 mb-1">Permohonan Surat Pengantar RT</h3>
            <p className="text-xs text-stone-500 mb-4">Pengurus RT 04 / RW 08 Perumahan Saung Kebun</p>

            <form onSubmit={handleCreateDocument} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Jenis Surat</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                >
                  <option value="Surat Keterangan Domisili">Surat Keterangan Domisili</option>
                  <option value="Surat Pengantar SKCK">Surat Pengantar SKCK</option>
                  <option value="Surat Pengantar Nikah">Surat Pengantar Nikah</option>
                  <option value="Surat Keterangan Pindah">Surat Keterangan Pindah</option>
                  <option value="Surat Keterangan Usaha (SKU)">Surat Keterangan Usaha (SKU)</option>
                  <option value="Surat Keterangan Kematian">Surat Keterangan Kematian</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Lengkap Pemohon</label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Nomor NIK KTP</label>
                  <input
                    type="text"
                    value={docNik}
                    onChange={(e) => setDocNik(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 font-mono tabular-nums text-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Kavling / Blok</label>
                  <input
                    type="text"
                    value={docHouse}
                    onChange={(e) => setDocHouse(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Nomor Kontak WhatsApp</label>
                <input
                  type="text"
                  value={docPhone}
                  onChange={(e) => setDocPhone(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 font-mono tabular-nums text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Keperluan Pengajuan Surat</label>
                <textarea
                  rows={2}
                  value={docPurpose}
                  onChange={(e) => setDocPurpose(e.target.value)}
                  placeholder="Contoh: Kelengkapan berkas pembukaan rekening bank / pendaftaran CPNS"
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsNewDocModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
                >
                  Kirim Permohonan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Letter Printable Preview */}
      {previewDoc && (
        <OfficialLetterModal
          document={previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}

      {/* MODAL 1: TAMBAH WARGA BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-[#10B981]" />
                  <span>Tambah Data Warga & Kavling Baru</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">Pendataan warga baru RT 04 / RW 08 Perumahan Saung Kebun</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAddHouse} className="space-y-4">
              {/* Row 1: Blok & Nomor */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Blok Kavling *</label>
                  <select
                    value={formBlock}
                    onChange={(e) => setFormBlock(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-300 p-2 text-stone-900 bg-white"
                    required
                  >
                    <option value="A">Blok A (Taman Depan)</option>
                    <option value="B">Blok B (Jalur Utama)</option>
                    <option value="C">Blok C (Dekat Saung)</option>
                    <option value="D">Blok D (Tengah Asri)</option>
                    <option value="E">Blok E (Area Kebun)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Nomor Rumah *</label>
                  <input
                    type="text"
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    placeholder="Contoh: 01, 09"
                    className="w-full text-xs rounded-xl border border-stone-300 p-2 font-mono tabular-nums text-stone-900"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Nama Kepala Keluarga */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Kepala Keluarga *</label>
                <input
                  type="text"
                  value={formResidentName}
                  onChange={(e) => setFormResidentName(e.target.value)}
                  placeholder="Contoh: Bp. Hendra Kusuma, S.T."
                  className="w-full text-xs rounded-xl border border-stone-300 p-2 text-stone-900"
                  required
                />
              </div>

              {/* Row 3: Status Hak Milik & Jumlah Jiwa */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Status Hak Milik *</label>
                  <select
                    value={formOwnershipStatus}
                    onChange={(e) => setFormOwnershipStatus(e.target.value as OwnershipStatus)}
                    className="w-full text-xs rounded-xl border border-stone-300 p-2 text-stone-900 bg-white"
                  >
                    <option value="Pemilik Tetap">Pemilik Tetap</option>
                    <option value="Pengontrak">Pengontrak / Sewa</option>
                    <option value="Kosong">Kosong / Renovasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Anggota Keluarga (Jiwa)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formOccupantCount}
                    onChange={(e) => setFormOccupantCount(Number(e.target.value))}
                    className="w-full text-xs rounded-xl border border-stone-300 p-2 font-mono tabular-nums text-stone-900"
                    required
                  />
                </div>
              </div>

              {/* Row 4: WhatsApp & Alamat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Nomor WhatsApp / HP *</label>
                  <input
                    type="text"
                    value={formResidentPhone}
                    onChange={(e) => setFormResidentPhone(e.target.value)}
                    placeholder="Contoh: 0812-8877-6655"
                    className="w-full text-xs rounded-xl border border-stone-300 p-2 font-mono tabular-nums text-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Alamat Lengkap</label>
                  <input
                    type="text"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder={`Jl. Saung Kebun Raya Blok ${formBlock}-${formNumber}`}
                    className="w-full text-xs rounded-xl border border-stone-300 p-2 text-stone-900"
                  />
                </div>
              </div>

              {/* Row 5: Data Kendaraan */}
              <div className="p-3.5 bg-stone-50 rounded-xl space-y-3 border border-stone-200/80">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-emerald-700" />
                  <span>Data Kendaraan Warga (Akses Gerbang Satpam)</span>
                </span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Jumlah Mobil</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formCars}
                      onChange={(e) => setFormCars(Number(e.target.value))}
                      className="w-full text-xs rounded-lg border border-stone-300 p-1.5 bg-white font-mono tabular-nums text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Jumlah Motor</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formMotorcycles}
                      onChange={(e) => setFormMotorcycles(Number(e.target.value))}
                      className="w-full text-xs rounded-lg border border-stone-300 p-1.5 bg-white font-mono tabular-nums text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Plat Nomor Kendaraan (Pisahkan dengan koma)</label>
                  <input
                    type="text"
                    value={formPlateNumbers}
                    onChange={(e) => setFormPlateNumbers(e.target.value)}
                    placeholder="Contoh: B 1234 SKB, B 5678 SK"
                    className="w-full text-xs rounded-lg border border-stone-300 p-1.5 bg-white font-mono text-stone-900"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#10B981] hover:bg-[#059669] rounded-xl shadow-xs transition-colors"
                >
                  Simpan Data Warga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT DATA WARGA */}
      {editingHouse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Edit className="w-5 h-5 text-blue-600" />
                  <span>Edit Data Warga: Blok {editingHouse.block}-{editingHouse.number}</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">Perbarui sensus kavling di Perumahan Saung Kebun</p>
              </div>
              <button
                onClick={() => setEditingHouse(null)}
                className="w-7 h-7 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditHouse} className="space-y-4">
              {/* Row 1: Blok & Nomor */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Blok Kavling *</label>
                  <select
                    value={formBlock}
                    onChange={(e) => setFormBlock(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-300 p-2 text-stone-900 bg-white"
                    required
                  >
                    <option value="A">Blok A</option>
                    <option value="B">Blok B</option>
                    <option value="C">Blok C</option>
                    <option value="D">Blok D</option>
                    <option value="E">Blok E</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Nomor Rumah *</label>
                  <input
                    type="text"
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-300 p-2 font-mono tabular-nums text-stone-900"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Nama Kepala Keluarga */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Kepala Keluarga *</label>
                <input
                  type="text"
                  value={formResidentName}
                  onChange={(e) => setFormResidentName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 p-2 text-stone-900"
                  required
                />
              </div>

              {/* Row 3: Status Hak Milik & Jumlah Jiwa */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Status Hak Milik *</label>
                  <select
                    value={formOwnershipStatus}
                    onChange={(e) => setFormOwnershipStatus(e.target.value as OwnershipStatus)}
                    className="w-full text-xs rounded-xl border border-stone-300 p-2 text-stone-900 bg-white"
                  >
                    <option value="Pemilik Tetap">Pemilik Tetap</option>
                    <option value="Pengontrak">Pengontrak / Sewa</option>
                    <option value="Kosong">Kosong / Renovasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Anggota Keluarga (Jiwa)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formOccupantCount}
                    onChange={(e) => setFormOccupantCount(Number(e.target.value))}
                    className="w-full text-xs rounded-xl border border-stone-300 p-2 font-mono tabular-nums text-stone-900"
                    required
                  />
                </div>
              </div>

              {/* Row 4: WhatsApp & Alamat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Nomor WhatsApp / HP *</label>
                  <input
                    type="text"
                    value={formResidentPhone}
                    onChange={(e) => setFormResidentPhone(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-300 p-2 font-mono tabular-nums text-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Alamat Lengkap</label>
                  <input
                    type="text"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-300 p-2 text-stone-900"
                  />
                </div>
              </div>

              {/* Row 5: Data Kendaraan */}
              <div className="p-3.5 bg-stone-50 rounded-xl space-y-3 border border-stone-200/80">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-emerald-700" />
                  <span>Data Kendaraan Warga</span>
                </span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Jumlah Mobil</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formCars}
                      onChange={(e) => setFormCars(Number(e.target.value))}
                      className="w-full text-xs rounded-lg border border-stone-300 p-1.5 bg-white font-mono tabular-nums text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Jumlah Motor</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formMotorcycles}
                      onChange={(e) => setFormMotorcycles(Number(e.target.value))}
                      className="w-full text-xs rounded-lg border border-stone-300 p-1.5 bg-white font-mono tabular-nums text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Plat Nomor Kendaraan (Pisahkan dengan koma)</label>
                  <input
                    type="text"
                    value={formPlateNumbers}
                    onChange={(e) => setFormPlateNumbers(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-300 p-1.5 bg-white font-mono text-stone-900"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingHouse(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: KONFIRMASI HAPUS WARGA */}
      {deletingHouse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl p-6">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>

            <h3 className="text-base font-bold text-stone-900 text-center mb-2">
              Konfirmasi Hapus Data Warga
            </h3>

            <p className="text-xs text-stone-600 text-center leading-relaxed mb-6">
              Apakah Anda yakin ingin menghapus catatan warga <strong className="text-stone-900">{deletingHouse.residentName}</strong> dari kavling <strong className="text-stone-900">Blok {deletingHouse.block}-{deletingHouse.number}</strong>?
              <br />
              Tindakan ini akan menghapus data sensus dan nomor kavling dari direktori aktif perumahan.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingHouse(null)}
                className="flex-1 px-4 py-2.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Warga</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
