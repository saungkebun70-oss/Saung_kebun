import React from 'react';
import { DocumentRequest } from '../../types';
import { X, Printer, CheckCircle, ShieldCheck } from 'lucide-react';

interface OfficialLetterModalProps {
  document: DocumentRequest | null;
  onClose: () => void;
}

export const OfficialLetterModal: React.FC<OfficialLetterModalProps> = ({ document, onClose }) => {
  if (!document) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden my-8">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-3 bg-stone-100 border-b border-stone-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-700">Preview Dokumen Resmi RT/RW</span>
            <span className="text-xs text-stone-400">·</span>
            <span className="text-xs text-emerald-800 font-mono font-medium">{document.letterNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Unduh Surat</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Letter Sheet */}
        <div className="p-8 sm:p-12 text-stone-900 font-sans space-y-6 bg-white" id="printable-letter">
          {/* Kop Surat Resmi */}
          <div className="border-b-4 border-double border-stone-900 pb-4 text-center space-y-1">
            <h1 className="text-base sm:text-lg font-bold tracking-wider text-stone-900 uppercase">
              RUKUN TETANGGA 04 / RUKUN WARGA 08
            </h1>
            <h2 className="text-lg sm:text-xl font-extrabold tracking-wide text-emerald-950 uppercase">
              PERUMAHAN SAUNG KEBUN
            </h2>
            <p className="text-xs text-stone-600">
              Kelurahan Sukadamai, Kecamatan Kebun Asri, Kota Depok, Jawa Barat 16411
            </p>
            <p className="text-[11px] text-stone-500 font-mono">
              Telp / WhatsApp Pengurus: 0812-3456-7890 · Email: rt04@saungkebun.id
            </p>
          </div>

          {/* Letter Title & Number */}
          <div className="text-center space-y-1 pt-2">
            <h3 className="text-sm font-bold tracking-wide uppercase underline decoration-2 underline-offset-4 text-stone-900">
              {document.type}
            </h3>
            <p className="text-xs font-mono tabular-nums text-stone-600">
              Nomor: {document.letterNumber}
            </p>
          </div>

          {/* Body Paragraph */}
          <div className="space-y-4 text-xs leading-relaxed text-stone-800">
            <p className="text-justify indent-8">
              Yang bertanda tangan di bawah ini, Pengurus Rukun Tetangga (RT) 04 / Rukun Warga (RW) 08 Perumahan Saung Kebun, menerangkan dengan sesungguhnya bahwa:
            </p>

            {/* Resident Bio Table */}
            <div className="pl-6 sm:pl-10 space-y-2 py-1">
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 font-semibold text-stone-700">Nama Lengkap</span>
                <span className="col-span-8 font-bold text-stone-950">: {document.applicantName}</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 font-semibold text-stone-700">NIK (KTP)</span>
                <span className="col-span-8 font-mono tabular-nums text-stone-950">: {document.applicantNik}</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 font-semibold text-stone-700">Alamat / Kavling</span>
                <span className="col-span-8 text-stone-950">: {document.houseBlock}, Kawasan Perumahan Saung Kebun</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 font-semibold text-stone-700">Nomor Kontak / WA</span>
                <span className="col-span-8 font-mono tabular-nums text-stone-950">: {document.applicantPhone}</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 font-semibold text-stone-700">Keperluan Surat</span>
                <span className="col-span-8 font-medium text-stone-950">: {document.purpose}</span>
              </div>
            </div>

            <p className="text-justify indent-8">
              Berdasarkan catatan kependudukan kami, nama tersebut di atas adalah benar-benar warga yang berdomisili sah dan tercatat aktif dalam lingkungan Perumahan Saung Kebun RT 04 / RW 08 serta berkelakuan baik dalam kehidupan bertetangga.
            </p>

            <p className="text-justify indent-8">
              Demikian Surat Pengantar ini diterbitkan secara digital untuk dapat dipergunakan sebagaimana mestinya dan sesuai peruntukan yang sah.
            </p>
          </div>

          {/* Signature & Digital Stempel */}
          <div className="pt-6 flex justify-end">
            <div className="w-64 text-center space-y-2 relative">
              <p className="text-xs text-stone-700">
                Depok, {document.approvedDate || document.requestDate}
              </p>
              <p className="text-xs font-semibold text-stone-900">
                Pengurus RT 04 Perumahan Saung Kebun
              </p>

              {/* Digital Stamp Simulation */}
              <div className="relative py-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center opacity-85 pointer-events-none rotate-[-6deg]">
                  <div className="border-2 border-dashed border-emerald-800 rounded-full w-28 h-28 p-1 flex flex-col items-center justify-center text-center text-[8px] font-bold text-emerald-800 uppercase tracking-tighter">
                    <span className="border-b border-emerald-800 pb-0.5">PENGURUS RT 04</span>
                    <span className="text-[10px] my-0.5">SAUNG KEBUN</span>
                    <span>KOTA DEPOK</span>
                  </div>
                </div>

                <div className="font-serif italic font-bold text-stone-700 text-lg sm:text-xl py-2 relative z-10">
                  Gunawan Wibisono
                </div>
              </div>

              <div className="border-t border-stone-800 pt-1">
                <p className="text-xs font-bold text-stone-900 underline">
                  {document.approvedBy ? document.approvedBy.split(' (')[0] : 'Ir. H. Gunawan Wibisono'}
                </p>
                <p className="text-[10px] text-stone-500">Ketua RT 04 / RW 08</p>
              </div>

              <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-800 pt-1 font-mono">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                <span>Dokumen Resmi Terverifikasi Sistem</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
