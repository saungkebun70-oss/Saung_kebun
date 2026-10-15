import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, Phone, Shield, X, Bell } from 'lucide-react';

export const PanicAlertOverlay: React.FC = () => {
  const { panicAlert, resolvePanicAlert, playSirenTone } = useApp();

  useEffect(() => {
    if (!panicAlert || !panicAlert.active) return;
    // Play siren tone at interval
    const interval = setInterval(() => {
      playSirenTone();
    }, 4000);
    return () => clearInterval(interval);
  }, [panicAlert, playSirenTone]);

  if (!panicAlert || !panicAlert.active) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-rose-600 text-white shadow-2xl border-b-4 border-rose-800 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-rose-600 flex items-center justify-center font-bold text-lg shrink-0">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-wide uppercase bg-rose-800 px-2 py-0.5 rounded text-[11px]">
                  DARURAT / PANIC ALERT AKTIF
                </span>
                <span className="text-xs font-mono tabular-nums">{panicAlert.triggeredAt}</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold mt-0.5">
                {panicAlert.emergencyType} dilaporkan oleh <span className="underline">{panicAlert.triggeredBy}</span> ({panicAlert.houseBlock})
              </p>
              <p className="text-xs text-rose-100">
                Lokasi / Keterangan: {panicAlert.locationNotes} · Kontak Pelapor: {panicAlert.residentPhone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <a
              href="tel:02188997711"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-white hover:bg-rose-50 rounded-lg shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hubungi Satpam Gerbang</span>
            </a>
            <button
              onClick={resolvePanicAlert}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-950 hover:bg-black rounded-lg shadow-sm border border-rose-400"
            >
              Tandai Terkendali & Matikan Alarm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
