import React, { createContext, useContext, useState, useEffect } from 'react';
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
  NavTabId,
  AppNotification
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_HOUSES,
  INITIAL_DUES_PAYMENTS,
  INITIAL_CASH_TRANSACTIONS,
  INITIAL_CAMPAIGNS,
  INITIAL_DONATIONS,
  INITIAL_DOCUMENT_REQUESTS,
  INITIAL_GUEST_LOGS,
  INITIAL_PATROL_SCHEDULES,
  INITIAL_FACILITIES,
  INITIAL_BOOKINGS,
  INITIAL_COMPLAINTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_MARKET_ITEMS,
  INITIAL_NOTIFICATIONS
} from '../data/mockInitialData';

interface AppContextType {
  // Authentication
  isAuthenticated: boolean;
  login: (identifier: string, password?: string, rememberMe?: boolean) => { success: boolean; message?: string };
  quickLoginAs: (userId: string) => void;
  logout: () => void;

  currentUser: User;
  availableUsers: User[];
  setCurrentUser: (user: User) => void;
  activeTab: NavTabId;
  setActiveTab: (tab: NavTabId) => void;
  
  // Data
  houses: House[];
  duesPayments: DuesPayment[];
  cashTransactions: CashTransaction[];
  campaigns: DonationCampaign[];
  donations: Donation[];
  documentRequests: DocumentRequest[];
  guestLogs: GuestLog[];
  patrolSchedules: PatrolSchedule[];
  facilities: Facility[];
  bookings: FacilityBooking[];
  complaints: Complaint[];
  announcements: Announcement[];
  marketItems: MarketItem[];
  panicAlert: PanicAlert | null;
  notifications: AppNotification[];
  unreadNotificationsCount: number;

  // Actions
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addHouse: (house: Omit<House, 'id' | 'duesStatus' | 'unpaidMonthsCount'>) => void;
  updateHouse: (id: string, updatedData: Partial<House>) => void;
  deleteHouse: (id: string) => void;
  payDues: (data: {
    houseId: string;
    periodMonth: string;
    amount: number;
    paymentMethod: 'QRIS' | 'BCA' | 'Mandiri' | 'BRI' | 'Tunai' | 'GoPay';
    breakdown?: { kebersihan: number; keamanan: number; kasWarga: number; sosial: number };
  }) => void;
  verifyDuesPayment: (id: string, status: 'Lunas' | 'Ditolak') => void;
  addCashTransaction: (tx: {
    type: 'Pemasukan' | 'Pengeluaran';
    category: CashTransaction['category'];
    amount: number;
    description: string;
  }) => void;
  donateToCampaign: (campaignId: string, amount: number, donorName: string, message?: string, isAnonymous?: boolean) => void;
  createCampaign: (campaign: {
    title: string;
    category: DonationCampaign['category'];
    targetAmount: number;
    deadline: string;
    description: string;
  }) => void;
  requestDocument: (data: {
    type: DocumentRequest['type'];
    applicantName: string;
    applicantNik: string;
    houseBlock: string;
    applicantPhone: string;
    purpose: string;
  }) => void;
  updateDocumentStatus: (id: string, status: 'Disetujui' | 'Ditolak', reason?: string) => void;
  addGuestLog: (log: {
    guestName: string;
    vehiclePlate: string;
    destinationHouse: string;
    hostName: string;
    purpose: string;
    idCardType: 'KTP' | 'SIM' | 'Passport';
  }) => void;
  checkoutGuest: (id: string) => void;
  createBooking: (booking: {
    facilityId: string;
    facilityName: string;
    applicantName: string;
    houseBlock: string;
    applicantPhone: string;
    eventDate: string;
    timeSlot: string;
    purpose: string;
    guestCount: number;
  }) => void;
  updateBookingStatus: (id: string, status: 'Disetujui' | 'Ditolak') => void;
  createComplaint: (complaint: {
    title: string;
    category: Complaint['category'];
    location: string;
    description: string;
    priority: 'Rendah' | 'Sedang' | 'Tinggi';
  }) => void;
  updateComplaintStatus: (id: string, status: 'Menunggu Penanganan' | 'Dalam Proses' | 'Selesai', notes?: string) => void;
  createAnnouncement: (data: {
    title: string;
    category: Announcement['category'];
    content: string;
    pinned: boolean;
    eventDate?: string;
  }) => void;
  addMarketItem: (data: {
    title: string;
    sellerName: string;
    sellerHouse: string;
    sellerWhatsapp: string;
    price: number;
    category: MarketItem['category'];
    description: string;
  }) => void;
  triggerPanicAlert: (emergencyType: PanicAlert['emergencyType'], locationNotes: string) => void;
  resolvePanicAlert: () => void;
  playSirenTone: () => void;

  // Modals & Navigation state
  isArchitectureModalOpen: boolean;
  setIsArchitectureModalOpen: (open: boolean) => void;
  selectedLetterForPrint: DocumentRequest | null;
  setSelectedLetterForPrint: (doc: DocumentRequest | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const availableUsers = INITIAL_USERS;

  // Authentication State (defaults to false so the Login Gate is active)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('sip_sk_auth') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUserId = localStorage.getItem('sip_sk_auth_user_id');
    const matched = INITIAL_USERS.find(u => u.id === savedUserId);
    return matched || INITIAL_USERS[0];
  });

  const [activeTab, setActiveTab] = useState<NavTabId>('dashboard');
  
  const [houses, setHouses] = useState<House[]>(() => {
    const saved = localStorage.getItem('sip_sk_houses');
    return saved ? JSON.parse(saved) : INITIAL_HOUSES;
  });

  const login = (identifier: string, _password?: string, rememberMe: boolean = true): { success: boolean; message?: string } => {
    const cleanId = identifier.trim().toLowerCase();
    if (!cleanId) {
      return { success: false, message: 'Harap masukkan Nomor WhatsApp, Email, atau Blok Rumah.' };
    }

    const matchedUser = availableUsers.find(u => {
      const emailMatch = u.email.toLowerCase() === cleanId;
      const phoneMatch = u.phone.replace(/[^0-9]/g, '').includes(cleanId.replace(/[^0-9]/g, '')) && cleanId.replace(/[^0-9]/g, '').length >= 4;
      const nameMatch = u.name.toLowerCase().includes(cleanId);
      
      let houseMatch = false;
      if (u.houseId) {
        const h = houses.find(house => house.id === u.houseId);
        if (h) {
          const blockStr = `blok ${h.block}-${h.number}`.toLowerCase();
          const shortBlockStr = `${h.block}-${h.number}`.toLowerCase();
          houseMatch = blockStr.includes(cleanId) || shortBlockStr.includes(cleanId) || cleanId.includes(shortBlockStr);
        }
      }
      return emailMatch || phoneMatch || nameMatch || houseMatch;
    });

    if (matchedUser) {
      setCurrentUser(matchedUser);
      setIsAuthenticated(true);
      if (rememberMe) {
        localStorage.setItem('sip_sk_auth', 'true');
        localStorage.setItem('sip_sk_auth_user_id', matchedUser.id);
      }
      setActiveTab('dashboard');
      return { success: true };
    }

    const matchedHouse = houses.find(h => {
      const full = `blok ${h.block}-${h.number}`.toLowerCase();
      const code = `${h.block}-${h.number}`.toLowerCase();
      return full.includes(cleanId) || cleanId.includes(code);
    });

    if (matchedHouse) {
      const houseUser = availableUsers.find(u => u.houseId === matchedHouse.id) || availableUsers[2];
      setCurrentUser(houseUser);
      setIsAuthenticated(true);
      if (rememberMe) {
        localStorage.setItem('sip_sk_auth', 'true');
        localStorage.setItem('sip_sk_auth_user_id', houseUser.id);
      }
      setActiveTab('dashboard');
      return { success: true };
    }

    return { 
      success: false, 
      message: 'Kredensial tidak ditemukan. Gunakan tombol Akun Demo atau masukkan nomor kavling yang valid (misal: Blok B-03).' 
    };
  };

  const quickLoginAs = (userId: string) => {
    const user = availableUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('sip_sk_auth', 'true');
      localStorage.setItem('sip_sk_auth_user_id', user.id);
      setActiveTab('dashboard');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sip_sk_auth');
    localStorage.removeItem('sip_sk_auth_user_id');
    setActiveTab('dashboard');
  };

  const [duesPayments, setDuesPayments] = useState<DuesPayment[]>(() => {
    const saved = localStorage.getItem('sip_sk_dues');
    return saved ? JSON.parse(saved) : INITIAL_DUES_PAYMENTS;
  });

  const [cashTransactions, setCashTransactions] = useState<CashTransaction[]>(() => {
    const saved = localStorage.getItem('sip_sk_cash');
    return saved ? JSON.parse(saved) : INITIAL_CASH_TRANSACTIONS;
  });

  const [campaigns, setCampaigns] = useState<DonationCampaign[]>(() => {
    const saved = localStorage.getItem('sip_sk_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [donations, setDonations] = useState<Donation[]>(() => {
    const saved = localStorage.getItem('sip_sk_donations');
    return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
  });

  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>(() => {
    const saved = localStorage.getItem('sip_sk_docs');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENT_REQUESTS;
  });

  const [guestLogs, setGuestLogs] = useState<GuestLog[]>(() => {
    const saved = localStorage.getItem('sip_sk_guests');
    return saved ? JSON.parse(saved) : INITIAL_GUEST_LOGS;
  });

  const [patrolSchedules] = useState<PatrolSchedule[]>(INITIAL_PATROL_SCHEDULES);
  const [facilities] = useState<Facility[]>(INITIAL_FACILITIES);

  const [bookings, setBookings] = useState<FacilityBooking[]>(() => {
    const saved = localStorage.getItem('sip_sk_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('sip_sk_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('sip_sk_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [marketItems, setMarketItems] = useState<MarketItem[]>(() => {
    const saved = localStorage.getItem('sip_sk_market');
    return saved ? JSON.parse(saved) : INITIAL_MARKET_ITEMS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('sip_sk_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [panicAlert, setPanicAlert] = useState<PanicAlert | null>(null);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [selectedLetterForPrint, setSelectedLetterForPrint] = useState<DocumentRequest | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sip_sk_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const addHouse = (houseData: Omit<House, 'id' | 'duesStatus' | 'unpaidMonthsCount'>) => {
    const newHouse: House = {
      ...houseData,
      id: `h-${Date.now()}`,
      duesStatus: 'Belum Lunas',
      unpaidMonthsCount: 1
    };
    setHouses(prev => [newHouse, ...prev]);
  };

  const updateHouse = (id: string, updatedData: Partial<House>) => {
    setHouses(prev => prev.map(h => h.id === id ? { ...h, ...updatedData } : h));
  };

  const deleteHouse = (id: string) => {
    setHouses(prev => prev.filter(h => h.id !== id));
  };

  useEffect(() => {
    localStorage.setItem('sip_sk_houses', JSON.stringify(houses));
  }, [houses]);

  useEffect(() => {
    localStorage.setItem('sip_sk_dues', JSON.stringify(duesPayments));
  }, [duesPayments]);

  useEffect(() => {
    localStorage.setItem('sip_sk_cash', JSON.stringify(cashTransactions));
  }, [cashTransactions]);

  useEffect(() => {
    localStorage.setItem('sip_sk_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('sip_sk_docs', JSON.stringify(documentRequests));
  }, [documentRequests]);

  useEffect(() => {
    localStorage.setItem('sip_sk_guests', JSON.stringify(guestLogs));
  }, [guestLogs]);

  useEffect(() => {
    localStorage.setItem('sip_sk_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('sip_sk_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('sip_sk_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('sip_sk_market', JSON.stringify(marketItems));
  }, [marketItems]);

  // Audio tone for emergency
  const playSirenTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(950, ctx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.0);
    } catch {
      // Audio not permitted or unavailable
    }
  };

  // Actions
  const payDues = (data: {
    houseId: string;
    periodMonth: string;
    amount: number;
    paymentMethod: 'QRIS' | 'BCA' | 'Mandiri' | 'BRI' | 'Tunai' | 'GoPay';
    breakdown?: { kebersihan: number; keamanan: number; kasWarga: number; sosial: number };
  }) => {
    const targetHouse = houses.find(h => h.id === data.houseId);
    const residentName = targetHouse ? targetHouse.residentName : currentUser.name;
    const blockAndNumber = targetHouse ? `Blok ${targetHouse.block}-${targetHouse.number}` : 'Kavling';
    
    const isDigitalInstant = data.paymentMethod === 'QRIS';
    const newStatus: 'Lunas' | 'Menunggu Konfirmasi' = isDigitalInstant ? 'Lunas' : 'Menunggu Konfirmasi';
    const newPayment: DuesPayment = {
      id: `pay-${Date.now()}`,
      houseId: data.houseId,
      blockAndNumber,
      residentName,
      periodMonth: data.periodMonth,
      amount: data.amount,
      breakdown: data.breakdown || { kebersihan: 60000, keamanan: 50000, kasWarga: 25000, sosial: 15000 },
      paymentMethod: data.paymentMethod,
      paymentDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: newStatus,
      transactionRef: `INV-${Date.now().toString().slice(-6)}`,
      verifiedBy: isDigitalInstant ? 'QRIS Settlement Otomatis' : undefined
    };

    setDuesPayments(prev => [newPayment, ...prev]);

    if (newStatus === 'Lunas') {
      // Update house status
      setHouses(prev => prev.map(h => {
        if (h.id === data.houseId) {
          return {
            ...h,
            duesStatus: 'Lunas',
            lastPaidMonth: data.periodMonth,
            unpaidMonthsCount: Math.max(0, h.unpaidMonthsCount - 1)
          };
        }
        return h;
      }));

      // Add to cash ledger
      const currentBalance = cashTransactions[0]?.balanceAfter || 31030000;
      const newCash: CashTransaction = {
        id: `tx-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        type: 'Pemasukan',
        category: 'Iuran Warga',
        amount: data.amount,
        description: `Iuran Warga ${blockAndNumber} (${residentName}) Periode ${data.periodMonth}`,
        recordedBy: 'Sistem Pembayaran SIP-SK',
        balanceAfter: currentBalance + data.amount
      };
      setCashTransactions(prev => [newCash, ...prev]);
    }
  };

  const verifyDuesPayment = (id: string, status: 'Lunas' | 'Ditolak') => {
    setDuesPayments(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status,
          verifiedBy: `${currentUser.name} (${currentUser.position})`
        };
      }
      return p;
    }));

    if (status === 'Lunas') {
      const p = duesPayments.find(item => item.id === id);
      if (p) {
        setHouses(prev => prev.map(h => {
          if (h.id === p.houseId) {
            return {
              ...h,
              duesStatus: 'Lunas',
              lastPaidMonth: p.periodMonth,
              unpaidMonthsCount: Math.max(0, h.unpaidMonthsCount - 1)
            };
          }
          return h;
        }));

        const currentBalance = cashTransactions[0]?.balanceAfter || 31030000;
        const newCash: CashTransaction = {
          id: `tx-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          type: 'Pemasukan',
          category: 'Iuran Warga',
          amount: p.amount,
          description: `Iuran Warga ${p.blockAndNumber} (${p.residentName}) Periode ${p.periodMonth} [Diverifikasi]`,
          recordedBy: currentUser.name,
          balanceAfter: currentBalance + p.amount
        };
        setCashTransactions(prev => [newCash, ...prev]);
      }
    }
  };

  const addCashTransaction = (tx: {
    type: 'Pemasukan' | 'Pengeluaran';
    category: CashTransaction['category'];
    amount: number;
    description: string;
  }) => {
    const currentBalance = cashTransactions[0]?.balanceAfter || 31030000;
    const newBalance = tx.type === 'Pemasukan' ? currentBalance + tx.amount : currentBalance - tx.amount;
    const newTx: CashTransaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      type: tx.type,
      category: tx.category,
      amount: tx.amount,
      description: tx.description,
      recordedBy: `${currentUser.name} (${currentUser.position})`,
      balanceAfter: newBalance
    };
    setCashTransactions(prev => [newTx, ...prev]);
  };

  const donateToCampaign = (campaignId: string, amount: number, donorName: string, message?: string, isAnonymous?: boolean) => {
    const newDonation: Donation = {
      id: `don-${Date.now()}`,
      campaignId,
      donorName: isAnonymous ? 'Hamba Allah' : donorName,
      houseBlock: currentUser.houseId ? houses.find(h => h.id === currentUser.houseId)?.block : undefined,
      amount,
      date: new Date().toISOString().slice(0, 10),
      message,
      isAnonymous: Boolean(isAnonymous)
    };
    setDonations(prev => [newDonation, ...prev]);

    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        const updatedTotal = c.collectedAmount + amount;
        return {
          ...c,
          collectedAmount: updatedTotal,
          donorsCount: c.donorsCount + 1,
          status: updatedTotal >= c.targetAmount ? 'Tercapai' : 'Aktif'
        };
      }
      return c;
    }));
  };

  const createCampaign = (campaign: {
    title: string;
    category: DonationCampaign['category'];
    targetAmount: number;
    deadline: string;
    description: string;
  }) => {
    const newCamp: DonationCampaign = {
      id: `camp-${Date.now()}`,
      title: campaign.title,
      category: campaign.category,
      targetAmount: campaign.targetAmount,
      collectedAmount: 0,
      deadline: campaign.deadline,
      description: campaign.description,
      organizer: `${currentUser.name} (${currentUser.position})`,
      status: 'Aktif',
      donorsCount: 0
    };
    setCampaigns(prev => [newCamp, ...prev]);
  };

  const requestDocument = (data: {
    type: DocumentRequest['type'];
    applicantName: string;
    applicantNik: string;
    houseBlock: string;
    applicantPhone: string;
    purpose: string;
  }) => {
    const letterCount = documentRequests.length + 44;
    const currentMonthRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][new Date().getMonth()];
    const letterNumber = `0${letterCount}/SK-RT04/${currentMonthRoman}/2026`;

    const newReq: DocumentRequest = {
      id: `doc-${Date.now()}`,
      letterNumber,
      type: data.type,
      applicantName: data.applicantName,
      applicantNik: data.applicantNik,
      houseBlock: data.houseBlock,
      applicantPhone: data.applicantPhone,
      purpose: data.purpose,
      requestDate: new Date().toISOString().slice(0, 10),
      status: 'Menunggu Review'
    };

    setDocumentRequests(prev => [newReq, ...prev]);
  };

  const updateDocumentStatus = (id: string, status: 'Disetujui' | 'Ditolak', reason?: string) => {
    setDocumentRequests(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          status,
          approvedDate: status === 'Disetujui' ? new Date().toISOString().slice(0, 10) : undefined,
          approvedBy: status === 'Disetujui' ? `${currentUser.name} (${currentUser.position})` : undefined,
          rejectionReason: reason
        };
      }
      return d;
    }));
  };

  const addGuestLog = (log: {
    guestName: string;
    vehiclePlate: string;
    destinationHouse: string;
    hostName: string;
    purpose: string;
    idCardType: 'KTP' | 'SIM' | 'Passport';
  }) => {
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const newLog: GuestLog = {
      id: `gst-${Date.now()}`,
      guestName: log.guestName,
      vehiclePlate: log.vehiclePlate.toUpperCase(),
      destinationHouse: log.destinationHouse,
      hostName: log.hostName,
      purpose: log.purpose,
      checkInTime: nowTime,
      idCardType: log.idCardType,
      securityOfficer: currentUser.name,
      status: 'Di Dalam'
    };
    setGuestLogs(prev => [newLog, ...prev]);
  };

  const checkoutGuest = (id: string) => {
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    setGuestLogs(prev => prev.map(g => {
      if (g.id === id) {
        return {
          ...g,
          status: 'Sudah Keluar',
          checkOutTime: nowTime
        };
      }
      return g;
    }));
  };

  const createBooking = (booking: {
    facilityId: string;
    facilityName: string;
    applicantName: string;
    houseBlock: string;
    applicantPhone: string;
    eventDate: string;
    timeSlot: string;
    purpose: string;
    guestCount: number;
  }) => {
    const newBooking: FacilityBooking = {
      id: `bkg-${Date.now()}`,
      ...booking,
      status: 'Menunggu Persetujuan',
      bookedAt: new Date().toISOString().slice(0, 10)
    };
    setBookings(prev => [newBooking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: 'Disetujui' | 'Ditolak') => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        return { ...b, status };
      }
      return b;
    }));
  };

  const createComplaint = (complaint: {
    title: string;
    category: Complaint['category'];
    location: string;
    description: string;
    priority: 'Rendah' | 'Sedang' | 'Tinggi';
  }) => {
    const currentHouse = currentUser.houseId ? houses.find(h => h.id === currentUser.houseId) : undefined;
    const houseStr = currentHouse ? `Blok ${currentHouse.block}-${currentHouse.number}` : 'Warga Saung Kebun';
    
    const newCmp: Complaint = {
      id: `cmp-${Date.now()}`,
      title: complaint.title,
      category: complaint.category,
      location: complaint.location,
      description: complaint.description,
      reportedBy: currentUser.name,
      reporterHouse: houseStr,
      reportedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Menunggu Penanganan',
      priority: complaint.priority
    };
    setComplaints(prev => [newCmp, ...prev]);
  };

  const updateComplaintStatus = (id: string, status: 'Menunggu Penanganan' | 'Dalam Proses' | 'Selesai', notes?: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status,
          responseNotes: notes || c.responseNotes,
          officerAssigned: currentUser.name,
          resolvedAt: status === 'Selesai' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : undefined
        };
      }
      return c;
    }));
  };

  const createAnnouncement = (data: {
    title: string;
    category: Announcement['category'];
    content: string;
    pinned: boolean;
    eventDate?: string;
  }) => {
    const newAnn: Announcement = {
      id: `anc-${Date.now()}`,
      title: data.title,
      category: data.category,
      content: data.content,
      publishedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      author: currentUser.name,
      authorRole: currentUser.position,
      pinned: data.pinned,
      eventDate: data.eventDate
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const addMarketItem = (data: {
    title: string;
    sellerName: string;
    sellerHouse: string;
    sellerWhatsapp: string;
    price: number;
    category: MarketItem['category'];
    description: string;
  }) => {
    const newItem: MarketItem = {
      id: `mkt-${Date.now()}`,
      title: data.title,
      sellerName: data.sellerName,
      sellerHouse: data.sellerHouse,
      sellerWhatsapp: data.sellerWhatsapp.replace(/^0/, '62'),
      price: data.price,
      category: data.category,
      description: data.description,
      rating: 5.0,
      isReadyStock: true
    };
    setMarketItems(prev => [newItem, ...prev]);
  };

  const triggerPanicAlert = (emergencyType: PanicAlert['emergencyType'], locationNotes: string) => {
    const currentHouse = currentUser.houseId ? houses.find(h => h.id === currentUser.houseId) : undefined;
    const blockStr = currentHouse ? `Blok ${currentHouse.block}-${currentHouse.number}` : 'Posisi Perumahan';

    const newAlert: PanicAlert = {
      id: `panic-${Date.now()}`,
      active: true,
      triggeredAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB',
      triggeredBy: currentUser.name,
      houseBlock: blockStr,
      residentPhone: currentUser.phone,
      emergencyType,
      locationNotes: locationNotes || `Lokasi kediaman di ${blockStr}`,
      resolved: false
    };

    setPanicAlert(newAlert);
    playSirenTone();
  };

  const resolvePanicAlert = () => {
    if (panicAlert) {
      setPanicAlert({
        ...panicAlert,
        active: false,
        resolved: true,
        resolvedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        handledBy: `${currentUser.name} (${currentUser.position})`
      });
      setTimeout(() => {
        setPanicAlert(null);
      }, 2500);
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        quickLoginAs,
        logout,
        currentUser,
        availableUsers,
        setCurrentUser,
        activeTab,
        setActiveTab,
        houses,
        duesPayments,
        cashTransactions,
        campaigns,
        donations,
        documentRequests,
        guestLogs,
        patrolSchedules,
        facilities,
        bookings,
        complaints,
        announcements,
        marketItems,
        panicAlert,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addHouse,
        updateHouse,
        deleteHouse,
        payDues,
        verifyDuesPayment,
        addCashTransaction,
        donateToCampaign,
        createCampaign,
        requestDocument,
        updateDocumentStatus,
        addGuestLog,
        checkoutGuest,
        createBooking,
        updateBookingStatus,
        createComplaint,
        updateComplaintStatus,
        createAnnouncement,
        addMarketItem,
        triggerPanicAlert,
        resolvePanicAlert,
        playSirenTone,
        isArchitectureModalOpen,
        setIsArchitectureModalOpen,
        selectedLetterForPrint,
        setSelectedLetterForPrint
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
