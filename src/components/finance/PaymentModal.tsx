import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  QrCode, 
  Building2, 
  Wallet, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Check, 
  Upload, 
  Info 
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultHouseId?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, defaultHouseId }) => {
  const { houses, currentUser, payDues } = useApp();

  const [selectedHouseId, setSelectedHouseId] = useState<string>(
    defaultHouseId || currentUser.houseId || (houses.length > 0 ? houses[0].id : '')
  );
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Oktober 2026');
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'BCA' | 'Mandiri' | 'BRI' | 'GoPay'>('QRIS');
  const [copiedBank, setCopiedBank] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(899); // 15 mins countdown

  useEffect(() => {
    if (defaultHouseId) setSelectedHouseId(defaultHouseId);
  }, [defaultHouseId]);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyVa = (va: string) => {
    navigator.clipboard.writeText(va);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const selectedHouse = houses.find(h => h.id === selectedHouseId);
  const amount = 150000;

  const handleConfirmPayment = () => {
    payDues({
      houseId: selectedHouseId,
      periodMonth: selectedPeriod,
      amount,
      paymentMethod,
      breakdown: { kebersihan: 60000, keamanan: 50000, kasWarga: 25000, sosial: 15000 }
    });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">Pembayaran Iuran Warga Digital</h2>
              <p className="text-xs text-stone-500">Perumahan Saung Kebun · RT 04 / RW 08</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {isSuccess ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Pembayaran Berhasil Dicatat!</h3>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                {paymentMethod === 'QRIS' 
                  ? 'Verifikasi instan via QRIS berhasil. Status kavling telah diperbarui menjadi LUNAS.'
                  : 'Bukti pembayaran telah dikirim ke Bendahara RT untuk rekonsiliasi kas.'}
              </p>
            </div>
          ) : (
            <>
              {/* House & Period Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Kavling / Rumah
                  </label>
                  <select
                    value={selectedHouseId}
                    onChange={(e) => setSelectedHouseId(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    {houses.map(h => (
                      <option key={h.id} value={h.id}>
                        Blok {h.block}-{h.number} ({h.residentName.split(' ')[0]})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Periode Iuran
                  </label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="Oktober 2026">Oktober 2026</option>
                    <option value="November 2026">November 2026</option>
                    <option value="Desember 2026">Desember 2026</option>
                  </select>
                </div>
              </div>

              {/* Amount & Breakdown */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-stone-600">Total Tagihan Iuran Bulanan:</span>
                  <span className="text-base font-bold font-mono tabular-nums text-emerald-800">
                    Rp 150.000
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 space-y-1 pt-2 border-t border-stone-200">
                  <div className="flex justify-between">
                    <span>1. Kebersihan & Pengangkutan Sampah:</span>
                    <span className="font-mono tabular-nums">Rp 60.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2. Keamanan & Pos Satpam 24 Jam:</span>
                    <span className="font-mono tabular-nums">Rp 50.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>3. Kas Lingkungan & Perawatan Saung:</span>
                    <span className="font-mono tabular-nums">Rp 25.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>4. Dana Sosial Warga & Santunan:</span>
                    <span className="font-mono tabular-nums">Rp 15.000</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Metode Pembayaran Digital
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'QRIS', label: 'QRIS', icon: QrCode },
                    { id: 'BCA', label: 'BCA VA', icon: Building2 },
                    { id: 'Mandiri', label: 'Mandiri', icon: Building2 },
                    { id: 'BRI', label: 'BRI VA', icon: Building2 },
                    { id: 'GoPay', label: 'GoPay', icon: Wallet },
                  ].map((m) => {
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                          isSelected
                            ? 'border-emerald-700 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-700 font-semibold'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <m.icon className="w-4 h-4" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Method Detail Content */}
              {paymentMethod === 'QRIS' && (
                <div className="border border-stone-200 rounded-xl p-4 text-center space-y-3 bg-white">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="font-semibold text-stone-900">QRIS Standar Nasional</span>
                    <span className="flex items-center gap-1 font-mono tabular-nums text-rose-600">
                      <Clock className="w-3.5 h-3.5" />
                      {formatSeconds(timeLeft)}
                    </span>
                  </div>

                  {/* QRIS Graphic Container */}
                  <div className="w-48 h-48 mx-auto bg-stone-50 border border-stone-300 rounded-xl p-3 flex flex-col items-center justify-center relative shadow-inner">
                    {/* Stylized QR Box */}
                    <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-white rounded-lg border border-stone-200">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-xs ${
                            (i % 2 === 0 || i % 7 === 0 || i === 0 || i === 5 || i === 30 || i === 35)
                              ? 'bg-stone-900'
                              : 'bg-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="px-2 py-0.5 bg-emerald-800 text-white font-bold text-[9px] rounded shadow-md border border-white">
                        SAUNG KEBUN
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500">
                    Buka aplikasi BCA Mobile, GoPay, OVO, Livin', atau Dana. Scan QRIS di atas untuk pelunasan otomatis.
                  </p>
                </div>
              )}

              {paymentMethod !== 'QRIS' && (
                <div className="border border-stone-200 rounded-xl p-4 space-y-3 bg-stone-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-stone-900">Nomor Rekening Kas Paguyuban</p>
                      <p className="text-xs text-stone-500">Bank {paymentMethod} a.n. Kas Paguyuban Saung Kebun RT 04</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyVa('88301290334812')}
                      className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-white px-2.5 py-1.5 rounded-lg border border-stone-200 shadow-xs hover:bg-stone-50"
                    >
                      {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBank ? 'Tersalin' : 'Salin No'}</span>
                    </button>
                  </div>
                  <div className="font-mono tabular-nums font-bold text-base text-stone-900 bg-white p-2.5 rounded-lg border border-stone-200 text-center">
                    8830 1290 3348 12
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Harap cantumkan berita transfer: <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800">IURAN-{selectedHouse ? `BLOK${selectedHouse.block}${selectedHouse.number}` : 'RUMAH'}</code>
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!isSuccess && (
          <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg"
            >
              Batal
            </button>
            <button
              onClick={handleConfirmPayment}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Simulasikan Pembayaran Selesai</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
