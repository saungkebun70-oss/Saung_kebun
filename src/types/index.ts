export type UserRole = 'pengurus' | 'warga' | 'satpam';

export type NavTabId = 
  | 'dashboard'
  | 'overview'
  | 'data-warga'
  | 'administrasi'
  | 'iuran'
  | 'pengeluaran'
  | 'buku-kas'
  | 'keuangan'
  | 'grafik-keuangan'
  | 'lpj-triwulan'
  | 'pengumuman'
  | 'kegiatan'
  | 'inventaris'
  | 'fasilitas'
  | 'buku-tamu'
  | 'surat-menyurat'
  | 'pengaduan'
  | 'komunitas'
  | 'data-keamanan'
  | 'keamanan'
  | 'profil'
  | 'pasar'
  | 'pengaturan';

export type SpecificPosition = 
  | 'Ketua RT'
  | 'Sekretaris'
  | 'Bendahara'
  | 'Seksi Keamanan'
  | 'Warga Tetap'
  | 'Warga Kontrak'
  | 'Komandan Regu Satpam'
  | 'Petugas Keamanan';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  category: 'iuran' | 'surat' | 'pengaduan' | 'keamanan' | 'fasilitas';
  isRead: boolean;
  targetTab: NavTabId;
  relatedId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  position: SpecificPosition;
  houseId?: string;
  avatarUrl?: string;
  familyMembersCount?: number;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export type OwnershipStatus = 'Pemilik Tetap' | 'Pengontrak' | 'Kosong';

export interface House {
  id: string;
  block: string;
  number: string;
  address: string;
  ownershipStatus: OwnershipStatus;
  residentName: string;
  residentPhone: string;
  occupantCount: number;
  vehicles: {
    cars: number;
    motorcycles: number;
    plateNumbers: string[];
  };
  duesStatus: 'Lunas' | 'Belum Lunas' | 'Menunggak';
  lastPaidMonth?: string;
  unpaidMonthsCount: number;
}

export interface DuesPayment {
  id: string;
  houseId: string;
  blockAndNumber: string;
  residentName: string;
  periodMonth: string; // e.g., 'Oktober 2026'
  amount: number;
  breakdown: {
    kebersihan: number;
    keamanan: number;
    kasWarga: number;
    sosial: number;
  };
  paymentMethod: 'QRIS' | 'BCA' | 'Mandiri' | 'BRI' | 'Tunai' | 'GoPay';
  paymentDate: string;
  status: 'Lunas' | 'Menunggu Konfirmasi' | 'Ditolak';
  receiptUrl?: string;
  verifiedBy?: string;
  transactionRef: string;
}

export interface CashTransaction {
  id: string;
  date: string;
  type: 'Pemasukan' | 'Pengeluaran';
  category: 
    | 'Iuran Warga'
    | 'Honor Petugas Keamanan'
    | 'Honor Petugas Kebersihan'
    | 'Pemeliharaan Taman & Saung'
    | 'Listrik & Air Fasum'
    | 'Santunan Sosial'
    | 'Kas Operasional RT'
    | 'Donasi Sukarela';
  amount: number;
  description: string;
  recordedBy: string;
  evidenceRef?: string;
  balanceAfter: number;
}

export interface DonationCampaign {
  id: string;
  title: string;
  category: 'Kesehatan Warga' | 'Renovasi Fasilitas' | 'Santunan Sosial' | 'Peringatan Hari Besar';
  targetAmount: number;
  collectedAmount: number;
  deadline: string;
  description: string;
  organizer: string;
  imageUrl?: string;
  status: 'Aktif' | 'Tercapai' | 'Selesai';
  donorsCount: number;
}

export interface Donation {
  id: string;
  campaignId: string;
  donorName: string;
  houseBlock?: string;
  amount: number;
  date: string;
  message?: string;
  isAnonymous: boolean;
}

export type LetterType = 
  | 'Surat Keterangan Domisili'
  | 'Surat Pengantar SKCK'
  | 'Surat Pengantar Nikah'
  | 'Surat Keterangan Pindah'
  | 'Surat Keterangan Usaha (SKU)'
  | 'Surat Keterangan Kematian';

export interface DocumentRequest {
  id: string;
  letterNumber: string;
  type: LetterType;
  applicantName: string;
  applicantNik: string;
  houseBlock: string;
  applicantPhone: string;
  purpose: string;
  requestDate: string;
  status: 'Menunggu Review' | 'Disetujui' | 'Ditolak';
  approvedDate?: string;
  approvedBy?: string;
  rejectionReason?: string;
  signedDocumentUrl?: string;
}

export interface GuestLog {
  id: string;
  guestName: string;
  vehiclePlate: string;
  destinationHouse: string;
  hostName: string;
  purpose: string;
  checkInTime: string;
  checkOutTime?: string;
  idCardType: 'KTP' | 'SIM' | 'Passport';
  securityOfficer: string;
  status: 'Di Dalam' | 'Sudah Keluar';
}

export interface PatrolSchedule {
  id: string;
  date: string;
  shift: 'Malam 1 (22:00 - 02:00)' | 'Malam 2 (02:00 - 06:00)';
  teamName: string;
  leader: string;
  members: string[];
  status: 'Terjadwal' | 'Sedang Berlangsung' | 'Selesai';
  checkPointsCompleted: number;
  totalCheckPoints: number;
  notes?: string;
}

export interface Facility {
  id: string;
  name: string;
  capacity: string;
  description: string;
  operationalHours: string;
  rules: string[];
  imageUrl: string;
  feePerSlot: number; // 0 for free community facilities
}

export interface FacilityBooking {
  id: string;
  facilityId: string;
  facilityName: string;
  applicantName: string;
  houseBlock: string;
  applicantPhone: string;
  eventDate: string;
  timeSlot: string;
  purpose: string;
  guestCount: number;
  status: 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak';
  bookedAt: string;
}

export type ComplaintCategory = 
  | 'Penerangan Jalan (PJU)'
  | 'Kebersihan & Sampah'
  | 'Jalan & Drainase'
  | 'Ketertiban & Kebisingan'
  | 'Keamanan'
  | 'Fasilitas Saung / Lapangan';

export interface Complaint {
  id: string;
  title: string;
  category: ComplaintCategory;
  location: string;
  description: string;
  reportedBy: string;
  reporterHouse: string;
  reportedAt: string;
  status: 'Menunggu Penanganan' | 'Dalam Proses' | 'Selesai';
  priority: 'Rendah' | 'Sedang' | 'Tinggi';
  officerAssigned?: string;
  responseNotes?: string;
  resolvedAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Pengumuman Penting' | 'Kegiatan Warga' | 'Keuangan RT' | 'Kerja Bakti' | 'Keamanan';
  content: string;
  publishedAt: string;
  author: string;
  authorRole: string;
  pinned: boolean;
  eventDate?: string;
}

export interface MarketItem {
  id: string;
  title: string;
  sellerName: string;
  sellerHouse: string;
  sellerWhatsapp: string;
  price: number;
  category: 'Kuliner & Snack' | 'Hasil Kebun & Hidroponik' | 'Bibit & Tanaman' | 'Jasa & Kerajinan';
  description: string;
  rating: number;
  isReadyStock: boolean;
  imageFallbackIcon?: string;
}

export interface PanicAlert {
  id: string;
  active: boolean;
  triggeredAt: string;
  triggeredBy: string;
  houseBlock: string;
  residentPhone: string;
  emergencyType: 'Pencurian / Orang Mencurigakan' | 'Kebakaran' | 'Darurat Medis' | 'Gangguan Keamanan';
  locationNotes: string;
  resolved: boolean;
  resolvedAt?: string;
  handledBy?: string;
}
