import {
  User,
  House,
  DuesPayment,
  CashTransaction,
  DonationCampaign,
  Donation,
  DocumentRequest,
  GuestLog,
  PatrolSchedule,
  Facility,
  FacilityBooking,
  Complaint,
  Announcement,
  MarketItem,
  PanicAlert,
  AppNotification
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-ketua',
    name: 'Ir. H. Gunawan Wibisono',
    email: 'gunawan.wibisono@saungkebun.id',
    phone: '0812-3456-7890',
    role: 'pengurus',
    position: 'Ketua RT',
    houseId: 'h-a01',
    familyMembersCount: 4,
    emergencyContact: {
      name: 'Ibu Hj. Siti Nurhaliza',
      relationship: 'Istri',
      phone: '0812-3456-7891'
    }
  },
  {
    id: 'user-bendahara',
    name: 'Siti Rahmawati, S.E.',
    email: 'bendahara.sk@saungkebun.id',
    phone: '0813-8877-6655',
    role: 'pengurus',
    position: 'Bendahara',
    houseId: 'h-b04',
    familyMembersCount: 3,
    emergencyContact: {
      name: 'Budi Santoso',
      relationship: 'Suami',
      phone: '0813-8877-6656'
    }
  },
  {
    id: 'user-warga1',
    name: 'Bambang Prasetyo',
    email: 'bambang.prasetyo@gmail.com',
    phone: '0811-9876-5432',
    role: 'warga',
    position: 'Warga Tetap',
    houseId: 'h-b03',
    familyMembersCount: 4,
    emergencyContact: {
      name: 'Ratna Ayu',
      relationship: 'Istri',
      phone: '0811-9876-5433'
    }
  },
  {
    id: 'user-warga2',
    name: 'Ratna Indah Sari',
    email: 'ratna.indah@gmail.com',
    phone: '0857-1234-5678',
    role: 'warga',
    position: 'Warga Kontrak',
    houseId: 'h-c08',
    familyMembersCount: 2,
    emergencyContact: {
      name: 'Ahmad Fauzi',
      relationship: 'Kakak',
      phone: '0857-1234-5679'
    }
  },
  {
    id: 'user-satpam',
    name: 'Komandan Joko Sutrisno',
    email: 'keamanan.joko@saungkebun.id',
    phone: '0822-4455-6677',
    role: 'satpam',
    position: 'Komandan Regu Satpam',
    emergencyContact: {
      name: 'Pos Jaga Induk Saung Kebun',
      relationship: 'Pos Keamanan Gerbang',
      phone: '021-8899-7711'
    }
  }
];

export const INITIAL_HOUSES: House[] = [
  {
    id: 'h-a01',
    block: 'A',
    number: '01',
    address: 'Jl. Saung Kebun Raya Blok A-01',
    ownershipStatus: 'Pemilik Tetap',
    residentName: 'Ir. H. Gunawan Wibisono',
    residentPhone: '0812-3456-7890',
    occupantCount: 4,
    vehicles: { cars: 2, motorcycles: 1, plateNumbers: ['B 1890 WBI', 'B 4567 SK', 'B 3012 AA'] },
    duesStatus: 'Lunas',
    lastPaidMonth: 'Oktober 2026',
    unpaidMonthsCount: 0
  },
  {
    id: 'h-a02',
    block: 'A',
    number: '02',
    address: 'Jl. Saung Kebun Raya Blok A-02',
    ownershipStatus: 'Pemilik Tetap',
    residentName: 'Dr. Hendra Kusuma',
    residentPhone: '0812-9988-1122',
    occupantCount: 3,
    vehicles: { cars: 1, motorcycles: 2, plateNumbers: ['B 2234 HND', 'B 6789 ZX'] },
    duesStatus: 'Lunas',
    lastPaidMonth: 'Oktober 2026',
    unpaidMonthsCount: 0
  },
  {
    id: 'h-a03',
    block: 'A',
    number: '03',
    address: 'Jl. Saung Kebun Raya Blok A-03',
    ownershipStatus: 'Pengontrak',
    residentName: 'Farhan Maulana',
    residentPhone: '0856-7788-9900',
    occupantCount: 2,
    vehicles: { cars: 1, motorcycles: 1, plateNumbers: ['D 1450 FA'] },
    duesStatus: 'Belum Lunas',
    lastPaidMonth: 'September 2026',
    unpaidMonthsCount: 1
  },
  {
    id: 'h-b03',
    block: 'B',
    number: '03',
    address: 'Jl. Cempaka Saung Blok B-03',
    ownershipStatus: 'Pemilik Tetap',
    residentName: 'Bambang Prasetyo',
    residentPhone: '0811-9876-5432',
    occupantCount: 4,
    vehicles: { cars: 1, motorcycles: 2, plateNumbers: ['B 1244 BBG', 'B 5509 QR'] },
    duesStatus: 'Lunas',
    lastPaidMonth: 'Oktober 2026',
    unpaidMonthsCount: 0
  },
  {
    id: 'h-b04',
    block: 'B',
    number: '04',
    address: 'Jl. Cempaka Saung Blok B-04',
    ownershipStatus: 'Pemilik Tetap',
    residentName: 'Siti Rahmawati, S.E.',
    residentPhone: '0813-8877-6655',
    occupantCount: 3,
    vehicles: { cars: 1, motorcycles: 1, plateNumbers: ['B 3344 STR'] },
    duesStatus: 'Lunas',
    lastPaidMonth: 'Oktober 2026',
    unpaidMonthsCount: 0
  },
  {
    id: 'h-b05',
    block: 'B',
    number: '05',
    address: 'Jl. Cempaka Saung Blok B-05',
    ownershipStatus: 'Pemilik Tetap',
    residentName: 'Agus Salim',
    residentPhone: '0813-2211-4433',
    occupantCount: 5,
    vehicles: { cars: 1, motorcycles: 3, plateNumbers: ['B 4411 AGS'] },
    duesStatus: 'Menunggak',
    lastPaidMonth: 'Agustus 2026',
    unpaidMonthsCount: 2
  },
  {
    id: 'h-c08',
    block: 'C',
    number: '08',
    address: 'Jl. Melati Saung Blok C-08',
    ownershipStatus: 'Pengontrak',
    residentName: 'Ratna Indah Sari',
    residentPhone: '0857-1234-5678',
    occupantCount: 2,
    vehicles: { cars: 0, motorcycles: 1, plateNumbers: ['B 6621 RIS'] },
    duesStatus: 'Belum Lunas',
    lastPaidMonth: 'September 2026',
    unpaidMonthsCount: 1
  },
  {
    id: 'h-c09',
    block: 'C',
    number: '09',
    address: 'Jl. Melati Saung Blok C-09',
    ownershipStatus: 'Pemilik Tetap',
    residentName: 'Drs. Tri Wahyudi',
    residentPhone: '0817-4433-2211',
    occupantCount: 4,
    vehicles: { cars: 2, motorcycles: 0, plateNumbers: ['B 7788 TWY'] },
    duesStatus: 'Lunas',
    lastPaidMonth: 'Oktober 2026',
    unpaidMonthsCount: 0
  },
  {
    id: 'h-d02',
    block: 'D',
    number: '02',
    address: 'Jl. Kenanga Saung Blok D-02',
    ownershipStatus: 'Pemilik Tetap',
    residentName: 'Eko Prabowo',
    residentPhone: '0818-5566-7788',
    occupantCount: 3,
    vehicles: { cars: 1, motorcycles: 2, plateNumbers: ['B 8901 EPB'] },
    duesStatus: 'Lunas',
    lastPaidMonth: 'Oktober 2026',
    unpaidMonthsCount: 0
  },
  {
    id: 'h-d03',
    block: 'D',
    number: '03',
    address: 'Jl. Kenanga Saung Blok D-03',
    ownershipStatus: 'Kosong',
    residentName: '(Dalam Renovasi / Pemilik Luar Kota)',
    residentPhone: '0812-0000-1111',
    occupantCount: 0,
    vehicles: { cars: 0, motorcycles: 0, plateNumbers: [] },
    duesStatus: 'Lunas',
    lastPaidMonth: 'Oktober 2026',
    unpaidMonthsCount: 0
  },
  {
    id: 'h-e01',
    block: 'E',
    number: '01',
    address: 'Jl. Bougenville Saung Blok E-01',
    ownershipStatus: 'Pemilik Tetap',
    residentName: 'H. Suherman',
    residentPhone: '0815-9988-7766',
    occupantCount: 5,
    vehicles: { cars: 2, motorcycles: 2, plateNumbers: ['B 9001 SHM'] },
    duesStatus: 'Lunas',
    lastPaidMonth: 'Oktober 2026',
    unpaidMonthsCount: 0
  },
  {
    id: 'h-e02',
    block: 'E',
    number: '02',
    address: 'Jl. Bougenville Saung Blok E-02',
    ownershipStatus: 'Pengontrak',
    residentName: 'Maya Anggraini',
    residentPhone: '0878-1122-3344',
    occupantCount: 2,
    vehicles: { cars: 1, motorcycles: 1, plateNumbers: ['B 3322 MYA'] },
    duesStatus: 'Menunggak',
    lastPaidMonth: 'Juli 2026',
    unpaidMonthsCount: 3
  }
];

export const INITIAL_DUES_PAYMENTS: DuesPayment[] = [
  {
    id: 'pay-001',
    houseId: 'h-b03',
    blockAndNumber: 'Blok B-03',
    residentName: 'Bambang Prasetyo',
    periodMonth: 'Oktober 2026',
    amount: 150000,
    breakdown: { kebersihan: 60000, keamanan: 50000, kasWarga: 25000, sosial: 15000 },
    paymentMethod: 'QRIS',
    paymentDate: '2026-10-02 08:35',
    status: 'Lunas',
    verifiedBy: 'Siti Rahmawati (Bendahara)',
    transactionRef: 'QRS-202610-0041'
  },
  {
    id: 'pay-002',
    houseId: 'h-a01',
    blockAndNumber: 'Blok A-01',
    residentName: 'Ir. H. Gunawan Wibisono',
    periodMonth: 'Oktober 2026',
    amount: 150000,
    breakdown: { kebersihan: 60000, keamanan: 50000, kasWarga: 25000, sosial: 15000 },
    paymentMethod: 'BCA',
    paymentDate: '2026-10-01 09:12',
    status: 'Lunas',
    verifiedBy: 'Siti Rahmawati (Bendahara)',
    transactionRef: 'BCA-889123001'
  },
  {
    id: 'pay-003',
    houseId: 'h-a02',
    blockAndNumber: 'Blok A-02',
    residentName: 'Dr. Hendra Kusuma',
    periodMonth: 'Oktober 2026',
    amount: 150000,
    breakdown: { kebersihan: 60000, keamanan: 50000, kasWarga: 25000, sosial: 15000 },
    paymentMethod: 'Mandiri',
    paymentDate: '2026-10-03 14:20',
    status: 'Lunas',
    verifiedBy: 'Siti Rahmawati (Bendahara)',
    transactionRef: 'MDR-44551122'
  },
  {
    id: 'pay-004',
    houseId: 'h-b04',
    blockAndNumber: 'Blok B-04',
    residentName: 'Siti Rahmawati, S.E.',
    periodMonth: 'Oktober 2026',
    amount: 150000,
    breakdown: { kebersihan: 60000, keamanan: 50000, kasWarga: 25000, sosial: 15000 },
    paymentMethod: 'QRIS',
    paymentDate: '2026-10-01 07:45',
    status: 'Lunas',
    verifiedBy: 'Sistem Terverifikasi',
    transactionRef: 'QRS-202610-0012'
  },
  {
    id: 'pay-005',
    houseId: 'h-c08',
    blockAndNumber: 'Blok C-08',
    residentName: 'Ratna Indah Sari',
    periodMonth: 'Oktober 2026',
    amount: 150000,
    breakdown: { kebersihan: 60000, keamanan: 50000, kasWarga: 25000, sosial: 15000 },
    paymentMethod: 'GoPay',
    paymentDate: '2026-10-14 07:15',
    status: 'Menunggu Konfirmasi',
    transactionRef: 'GPY-99081273'
  }
];

export const INITIAL_CASH_TRANSACTIONS: CashTransaction[] = [
  {
    id: 'tx-001',
    date: '2026-10-01',
    type: 'Pemasukan',
    category: 'Iuran Warga',
    amount: 1500000,
    description: 'Penerimaan Iuran Warga Gelombang 1 (10 Rumah)',
    recordedBy: 'Siti Rahmawati (Bendahara)',
    balanceAfter: 35250000
  },
  {
    id: 'tx-002',
    date: '2026-10-03',
    type: 'Pengeluaran',
    category: 'Honor Petugas Keamanan',
    amount: 3200000,
    description: 'Honor 2 Personil Satpam Regu Jaga Bulan Berjalan',
    recordedBy: 'Siti Rahmawati (Bendahara)',
    balanceAfter: 32050000
  },
  {
    id: 'tx-003',
    date: '2026-10-04',
    type: 'Pengeluaran',
    category: 'Honor Petugas Kebersihan',
    amount: 1800000,
    description: 'Operasional Angkut Sampah & Kebersihan Jalan Perumahan',
    recordedBy: 'Siti Rahmawati (Bendahara)',
    balanceAfter: 30250000
  },
  {
    id: 'tx-004',
    date: '2026-10-06',
    type: 'Pengeluaran',
    category: 'Pemeliharaan Taman & Saung',
    amount: 650000,
    description: 'Pembelian Pupuk Organik, Tanaman Hias, dan Cat Kayu Saung Utama',
    recordedBy: 'Siti Rahmawati (Bendahara)',
    balanceAfter: 29600000
  },
  {
    id: 'tx-005',
    date: '2026-10-08',
    type: 'Pengeluaran',
    category: 'Listrik & Air Fasum',
    amount: 420000,
    description: 'Token Listrik PJU Gerbang Utama & Pompa Air Kebun Hidroponik',
    recordedBy: 'Siti Rahmawati (Bendahara)',
    balanceAfter: 29180000
  },
  {
    id: 'tx-006',
    date: '2026-10-10',
    type: 'Pemasukan',
    category: 'Iuran Warga',
    amount: 1350000,
    description: 'Penerimaan Iuran Warga Gelombang 2 (9 Rumah via QRIS & Transfer)',
    recordedBy: 'Siti Rahmawati (Bendahara)',
    balanceAfter: 30530000
  },
  {
    id: 'tx-007',
    date: '2026-10-12',
    type: 'Pemasukan',
    category: 'Donasi Sukarela',
    amount: 500000,
    description: 'Sumbangan Kas Warga dari Warga Syukuran Rumah Baru',
    recordedBy: 'Siti Rahmawati (Bendahara)',
    balanceAfter: 31030000
  }
];

export const INITIAL_CAMPAIGNS: DonationCampaign[] = [
  {
    id: 'camp-01',
    title: 'Santunan dan Pengobatan Pak Slamet (Tukang Kebun Komplek)',
    category: 'Kesehatan Warga',
    targetAmount: 5000000,
    collectedAmount: 3850000,
    deadline: '25 Oktober 2026',
    description: 'Pak Slamet yang setia merawat taman perumahan sedang menjalani pengobatan rawat inap. Mari ulurkan tangan kita untuk meringankan biaya keluarga beliau.',
    organizer: 'Seksi Sosial & Keagamaan RT 04',
    status: 'Aktif',
    donorsCount: 19
  },
  {
    id: 'camp-02',
    title: 'Pemasangan Lampu Solar Cell & CCTV Saung Gazebo Utama',
    category: 'Renovasi Fasilitas',
    targetAmount: 4200000,
    collectedAmount: 4200000,
    deadline: '10 Oktober 2026',
    description: 'Upgrade fasilitas pencahayaan hemat energi solar cell serta penambahan 2 unit CCTV Wi-Fi untuk meningkatkan kenyamanan di Saung Kebun.',
    organizer: 'Seksi Pembangunan RT 04',
    status: 'Tercapai',
    donorsCount: 22
  },
  {
    id: 'camp-03',
    title: 'Program Berbagi Jumat Berkah untuk Kaum Dhuafa Sekitar Kebun',
    category: 'Santunan Sosial',
    targetAmount: 2000000,
    collectedAmount: 1450000,
    deadline: '31 Oktober 2026',
    description: 'Penyaluran 80 kotak makanan sehat & paket sembako untuk pekerja lapangan dan lingkungan sekitar perumahan.',
    organizer: 'Ibu-ibu PKK Saung Kebun',
    status: 'Aktif',
    donorsCount: 14
  }
];

export const INITIAL_DONATIONS: Donation[] = [
  {
    id: 'don-01',
    campaignId: 'camp-01',
    donorName: 'Keluarga Bp. Gunawan',
    houseBlock: 'Blok A-01',
    amount: 500000,
    date: '2026-10-11',
    message: 'Semoga lekas sehat kembali Pak Slamet, kami sekeluarga mendoakan.',
    isAnonymous: false
  },
  {
    id: 'don-02',
    campaignId: 'camp-01',
    donorName: 'Hamba Allah',
    amount: 250000,
    date: '2026-10-12',
    message: 'Semoga berkah dan lekas pulih.',
    isAnonymous: true
  },
  {
    id: 'don-03',
    campaignId: 'camp-01',
    donorName: 'Bambang Prasetyo',
    houseBlock: 'Blok B-03',
    amount: 300000,
    date: '2026-10-13',
    message: 'Semangat sembuh Pak Slamet.',
    isAnonymous: false
  }
];

export const INITIAL_DOCUMENT_REQUESTS: DocumentRequest[] = [
  {
    id: 'doc-001',
    letterNumber: '042/SK-RT04/X/2026',
    type: 'Surat Keterangan Domisili',
    applicantName: 'Bambang Prasetyo',
    applicantNik: '3174091208850003',
    houseBlock: 'Blok B-03',
    applicantPhone: '0811-9876-5432',
    purpose: 'Kelengkapan administrasi perpanjangan paspor dan KTP elektronik',
    requestDate: '2026-10-09',
    status: 'Disetujui',
    approvedDate: '2026-10-10',
    approvedBy: 'Ir. H. Gunawan Wibisono (Ketua RT 04)'
  },
  {
    id: 'doc-002',
    letterNumber: '043/SK-RT04/X/2026',
    type: 'Surat Keterangan Usaha (SKU)',
    applicantName: 'Ratna Indah Sari',
    applicantNik: '3201085509920001',
    houseBlock: 'Blok C-08',
    applicantPhone: '0857-1234-5678',
    purpose: 'Pengajuan kemitraan UMKM kuliner katering rumahan ke Bank Mandiri',
    requestDate: '2026-10-13',
    status: 'Menunggu Review'
  },
  {
    id: 'doc-003',
    letterNumber: '041/SK-RT04/X/2026',
    type: 'Surat Pengantar SKCK',
    applicantName: 'Dimas Aditya (Anak Bp. Tri Wahyudi)',
    applicantNik: '3174092201020004',
    houseBlock: 'Blok C-09',
    applicantPhone: '0812-9900-1122',
    purpose: 'Pendaftaran seleksi Calon Pegawai Negeri Sipil (CPNS) 2026',
    requestDate: '2026-10-07',
    status: 'Disetujui',
    approvedDate: '2026-10-08',
    approvedBy: 'Ir. H. Gunawan Wibisono (Ketua RT 04)'
  }
];

export const INITIAL_GUEST_LOGS: GuestLog[] = [
  {
    id: 'gst-01',
    guestName: 'Rian Kurniawan (Kurir Logistik)',
    vehiclePlate: 'B 4120 KZA',
    destinationHouse: 'Blok B-03 (Bp. Bambang)',
    hostName: 'Bambang Prasetyo',
    purpose: 'Pengantaran paket furnitur saung',
    checkInTime: '10:15 WIB',
    idCardType: 'SIM',
    securityOfficer: 'Joko Sutrisno',
    status: 'Sudah Keluar',
    checkOutTime: '10:42 WIB'
  },
  {
    id: 'gst-02',
    guestName: 'Tamu Keluarga Bp. Hendra (Kakek & Nenek)',
    vehiclePlate: 'D 1288 BD',
    destinationHouse: 'Blok A-02 (Dr. Hendra)',
    hostName: 'Dr. Hendra Kusuma',
    purpose: 'Kunjungan silaturahmi keluarga',
    checkInTime: '13:30 WIB',
    idCardType: 'KTP',
    securityOfficer: 'Joko Sutrisno',
    status: 'Di Dalam'
  },
  {
    id: 'gst-03',
    guestName: 'Teknisi Internet Fiber Optik',
    vehiclePlate: 'B 3099 TKN',
    destinationHouse: 'Blok C-08 (Ibu Ratna)',
    hostName: 'Ratna Indah Sari',
    purpose: 'Perbaikan koneksi modem Wi-Fi',
    checkInTime: '14:10 WIB',
    idCardType: 'KTP',
    securityOfficer: 'Joko Sutrisno',
    status: 'Di Dalam'
  }
];

export const INITIAL_PATROL_SCHEDULES: PatrolSchedule[] = [
  {
    id: 'pat-01',
    date: 'Rabu, 14 Oktober 2026',
    shift: 'Malam 1 (22:00 - 02:00)',
    teamName: 'Regu Elang (Satpam & Warga)',
    leader: 'Joko Sutrisno (Komandan)',
    members: ['Agus Salim (Blok B-05)', 'Farhan Maulana (Blok A-03)', 'Suparno (Satpam)'],
    status: 'Terjadwal',
    checkPointsCompleted: 0,
    totalCheckPoints: 6,
    notes: 'Fokus patroli area gerbang belakang dan penerangan saung gazebo'
  },
  {
    id: 'pat-02',
    date: 'Kamis, 15 Oktober 2026',
    shift: 'Malam 2 (02:00 - 06:00)',
    teamName: 'Regu Garuda',
    leader: 'Hadi Wardhana (Satpam)',
    members: ['Eko Prabowo (Blok D-02)', 'Tri Wahyudi (Blok C-09)'],
    status: 'Terjadwal',
    checkPointsCompleted: 0,
    totalCheckPoints: 6,
    notes: 'Pemeriksaan portal gerbang masuk dan CCTV perbatasan kebun'
  }
];

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'fac-01',
    name: 'Saung Utama Gazebo & Kebun Asri',
    capacity: '35 - 50 Orang',
    description: 'Paviliun kayu jati dengan ornamen ukir tradisional nusantara, dilengkapi meja panjang lesehan, colokan listrik, Wi-Fi gratis, dan pemandangan kebun asri.',
    operationalHours: '06:00 - 22:00 WIB',
    rules: [
      'Menjaga kebersihan dan membawa kantong sampah sendiri',
      'Tidak menyalakan musik keras di atas jam 21:00 WIB',
      'Mematikan lampu dan kipas saung setelah selesai digunakan',
      'Reservasi minimal H-1 sebelum kegiatan'
    ],
    imageUrl: '/src/assets/images/saung_gazebo_facility_1791991914772.jpg',
    feePerSlot: 0
  },
  {
    id: 'fac-02',
    name: 'Lapangan Badminton & Tenis Meja',
    capacity: '10 - 20 Orang',
    description: 'Lapangan outdoor beralas semen halus standar turnamen komunitas dengan net terpasang dan pencahayaan lampu sorot LED malam hari.',
    operationalHours: '06:00 - 21:30 WIB',
    rules: [
      'Wajib menggunakan sepatu olahraga beralas karet',
      'Maksimal durasi peminjaman 2 jam jika ada antrean warga',
      'Kembalikan net dan matikan saklar lampu lapangan'
    ],
    imageUrl: '/src/assets/images/saung_kebun_hero_1791991915164.jpg',
    feePerSlot: 0
  },
  {
    id: 'fac-03',
    name: 'Kebun Hidroponik Komunitas Saung Kebun',
    capacity: '15 Orang (Edukasi / Panen)',
    description: 'Greenhouse hidroponik sistem NFT (Nutrient Film Technique) untuk budidaya selada, pakcoy, kangkung, dan mint segar. Tersedia kelas cocok tanam mingguan.',
    operationalHours: '07:00 - 17:00 WIB',
    rules: [
      'Dilarang memetik tanaman tanpa izin pengurus kebun',
      'Ikuti petunjuk takaran nutrisi AB Mix pada tandon air',
      'Tutup pintu jaring kasa greenhouse untuk mencegah hama'
    ],
    imageUrl: '/src/assets/images/saung_kebun_hero_1791991915164.jpg',
    feePerSlot: 0
  }
];

export const INITIAL_BOOKINGS: FacilityBooking[] = [
  {
    id: 'bkg-01',
    facilityId: 'fac-01',
    facilityName: 'Saung Utama Gazebo & Kebun Asri',
    applicantName: 'Bambang Prasetyo',
    houseBlock: 'Blok B-03',
    applicantPhone: '0811-9876-5432',
    eventDate: '2026-10-18',
    timeSlot: '09:00 - 12:00 WIB',
    purpose: 'Syukuran Ulang Tahun Anak & Ramah Tamah Tetangga',
    guestCount: 20,
    status: 'Disetujui',
    bookedAt: '2026-10-10'
  },
  {
    id: 'bkg-02',
    facilityId: 'fac-01',
    facilityName: 'Saung Utama Gazebo & Kebun Asri',
    applicantName: 'Ibu-ibu Pengajian RT 04',
    houseBlock: 'Blok A-01',
    applicantPhone: '0812-3456-7890',
    eventDate: '2026-10-23',
    timeSlot: '15:30 - 17:30 WIB',
    purpose: 'Kajian Rutin Muslimah dan Arisan Warga',
    guestCount: 25,
    status: 'Disetujui',
    bookedAt: '2026-10-12'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp-01',
    title: 'Lampu PJU Tiang No. 04 di Depan Blok C Padam',
    category: 'Penerangan Jalan (PJU)',
    location: 'Tikungan Jalan Melati Saung dekat Kavling C-08',
    description: 'Lampu penerangan jalan sudah 2 malam mati. Area menjadi gelap dan rawan tersandung atau mengundang orang mencurigakan.',
    reportedBy: 'Ratna Indah Sari',
    reporterHouse: 'Blok C-08',
    reportedAt: '2026-10-13 19:40',
    status: 'Dalam Proses',
    priority: 'Sedang',
    officerAssigned: 'Joko Sutrisno & Tim Maintenance',
    responseNotes: 'Bohlam LED 50W sudah dibeli di toko material, akan diganti siang ini pukul 14:00 WIB.'
  },
  {
    id: 'cmp-02',
    title: 'Saluran Drainase Samping Saung Tersumbat Sampah Daun',
    category: 'Jalan & Drainase',
    location: 'Sisi timur Gazebo Saung Utama',
    description: 'Ketika hujan lebat kemarin sore, air got sedikit meluap karena penumpukan daun kering dari pohon rindang.',
    reportedBy: 'Bambang Prasetyo',
    reporterHouse: 'Blok B-03',
    reportedAt: '2026-10-12 11:20',
    status: 'Selesai',
    priority: 'Tinggi',
    officerAssigned: 'Petugas Kebersihan Mang Ujang',
    responseNotes: 'Telah dikeruk dan dibersihkan 3 karung daun. Aliran air kembali lancar normal.',
    resolvedAt: '2026-10-13 10:00'
  },
  {
    id: 'cmp-03',
    title: 'Kucing Liar Mengacak-acak Tempat Sampah Blok D',
    category: 'Kebersihan & Sampah',
    location: 'Bak sampah depan Kavling D-02',
    description: 'Mohon pengurus mengingatkan warga agar selalu menutup rapat tong sampah fiberglass agar tidak diacak kucing liar.',
    reportedBy: 'Eko Prabowo',
    reporterHouse: 'Blok D-02',
    reportedAt: '2026-10-14 06:50',
    status: 'Menunggu Penanganan',
    priority: 'Rendah'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'anc-01',
    title: 'Kerja Bakti Akbar Menjelang Musim Hujan & Fogging Demam Berdarah',
    category: 'Kerja Bakti',
    content: 'Dihimbau kepada seluruh bapak-bapak dan remaja warga Saung Kebun untuk berpartisipasi dalam Kerja Bakti Akbar hari Minggu, 20 Oktober 2026 pukul 07:00 WIB. Titik kumpul di Saung Utama Gazebo. Disediakan kopi, teh hangat, dan bubur kacang ijo.',
    publishedAt: '12 Oktober 2026',
    author: 'Ir. H. Gunawan Wibisono',
    authorRole: 'Ketua RT 04 / RW 08',
    pinned: true,
    eventDate: '20 Oktober 2026 · 07:00 WIB'
  },
  {
    id: 'anc-02',
    title: 'Pembaruan Jadwal Pengangkutan Sampah & Pilah Sampah Organik',
    category: 'Pengumuman Penting',
    content: 'Mulai 15 Oktober 2026, truk pengangkut sampah Dinas Lingkungan Hidup akan masuk setiap hari Selasa, Kamis, dan Sabtu pagi pukul 06:30 WIB. Mohon sisa dedaunan kebun dimasukkan ke komposter bersama di belakang gazebo.',
    publishedAt: '10 Oktober 2026',
    author: 'Seksi Lingkungan & Kebersihan',
    authorRole: 'Pengurus RT 04',
    pinned: false
  },
  {
    id: 'anc-03',
    title: 'Panen Raya Selada Hidroponik Komunitas Saung Kebun',
    category: 'Kegiatan Warga',
    content: 'Alhamdulillah, instalasi kebun hidroponik kita siap panen sekitar 40 kg sayur selada segar non-pestisida. Warga yang berminat dapat mengambil sayuran dengan infak sukarela kas kebun di Saung Utama hari Jumat sore.',
    publishedAt: '08 Oktober 2026',
    author: 'Pokdarwis Kebun Asri',
    authorRole: 'Pengelola Kebun',
    pinned: false
  }
];

export const INITIAL_MARKET_ITEMS: MarketItem[] = [
  {
    id: 'mkt-01',
    title: 'Paket Sayur Hidroponik Segar (Selada & Pakcoy)',
    sellerName: 'Ibu Ratna (Kebun Asri)',
    sellerHouse: 'Blok C-08',
    sellerWhatsapp: '6285712345678',
    price: 15000,
    category: 'Hasil Kebun & Hidroponik',
    description: 'Sayuran segar baru petik dari instalasi hidroponik Saung Kebun. Tanpa pestisida kimia, renyah dan higienis. 250 gram per pack.',
    rating: 4.9,
    isReadyStock: true
  },
  {
    id: 'mkt-02',
    title: 'Nasi Liwet Sunda Komplit Saung Berkah',
    sellerName: 'Dapur Bu Endang',
    sellerHouse: 'Blok A-01',
    sellerWhatsapp: '6281234567891',
    price: 28000,
    category: 'Kuliner & Snack',
    description: 'Nasi liwet wangi teri medan, ayam goreng rempah, tahu/tempe bacem, lalapan segar dari kebun, dan sambal terasi dadak pedas mantap.',
    rating: 5.0,
    isReadyStock: true
  },
  {
    id: 'mkt-03',
    title: 'Bibit Tanaman Mint & Rosemary Organik dalam Pot',
    sellerName: 'Pak Bambang Nursery',
    sellerHouse: 'Blok B-03',
    sellerWhatsapp: '6281198765432',
    price: 20000,
    category: 'Bibit & Tanaman',
    description: 'Bibit herbal aroma wangi untuk teh, infuse water, atau bumbu dapur. Mudah dirawat di teras rumah.',
    rating: 4.8,
    isReadyStock: true
  },
  {
    id: 'mkt-04',
    title: 'Jasa Potong Rumput & Perapian Taman Rumah',
    sellerName: 'Kang Ujang & Tim Taman',
    sellerHouse: 'Bina Lingkungan Saung',
    sellerWhatsapp: '6281322114433',
    price: 75000,
    category: 'Jasa & Kerajinan',
    description: 'Pengerjaan rapi termasuk pembersihan sampah daun, pemangkasan dahan pohon peneduh, dan perapian rumput gajah mini.',
    rating: 4.9,
    isReadyStock: true
  }
];

export const INITIAL_PANIC_ALERT: PanicAlert | null = null;

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Pembayaran Iuran Masuk',
    message: 'Ratna Indah Sari (Blok C-08) telah mentransfer iuran Oktober 2026 via GoPay sebesar Rp 150.000.',
    timeAgo: '15 menit yang lalu',
    category: 'iuran',
    isRead: false,
    targetTab: 'iuran',
    relatedId: 'pay-005'
  },
  {
    id: 'notif-2',
    title: 'Permohonan Surat Baru',
    message: 'Pengajuan Surat Keterangan Usaha (SKU) oleh Ratna Indah (Blok C-08) menunggu review Ketua RT.',
    timeAgo: '1 jam yang lalu',
    category: 'surat',
    isRead: false,
    targetTab: 'surat-menyurat',
    relatedId: 'doc-002'
  },
  {
    id: 'notif-3',
    title: 'Tiket Aduan Lingkungan',
    message: 'Lampu PJU Tiang No. 04 di belokan Blok C dilaporkan padam oleh warga.',
    timeAgo: '2 jam yang lalu',
    category: 'pengaduan',
    isRead: false,
    targetTab: 'pengaduan',
    relatedId: 'cmp-01'
  },
  {
    id: 'notif-4',
    title: 'Reservasi Saung Gazebo',
    message: 'Pengajuan peminjaman Saung Utama untuk 18 Oktober 2026 oleh Bp. Bambang Prasetyo.',
    timeAgo: '4 jam yang lalu',
    category: 'fasilitas',
    isRead: false,
    targetTab: 'inventaris',
    relatedId: 'bkg-01'
  },
  {
    id: 'notif-5',
    title: 'Jadwal Ronda Malam Regu Elang',
    message: 'Giliran pos ronda malam ini: Joko Sutrisno, Agus Salim, dan Farhan Maulana.',
    timeAgo: '6 jam yang lalu',
    category: 'keamanan',
    isRead: false,
    targetTab: 'data-keamanan',
    relatedId: 'pat-01'
  }
];
