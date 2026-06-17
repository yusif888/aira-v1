import React from 'react';
import { StrukturOrganisasiLengkap } from '@/data/SDADalamAngka/2025/sekretariat';

// --- 1. Komponen Kartu (Header + List Anak) ---
// Ini sama dengan VerticalStackNode sebelumnya, tapi disesuaikan ukurannya agar pas di grid
const UnitKerjaCard = ({ title, childrenList = [], type = "default" }) => {
  const isDark = type === "dark";
  
  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* Header Unit Kerja */}
      <div className={`w-full p-2.5 rounded-t-md border-2 flex items-center justify-center shadow-md relative z-10 min-h-[48px]
        ${isDark ? "bg-[#0f1f40] border-[#0f1f40] text-white" : "bg-blue-600 border-blue-600 text-white"}`}>
        <span className="font-semibold text-[11px] uppercase text-center leading-tight tracking-wide">
          {title}
        </span>
      </div>

      {/* List Anak (Seksi/Subbag) */}
      <div className="w-full flex flex-col bg-white border-x-2 border-b-2 border-slate-200 rounded-b-md shadow-sm h-full">
        {childrenList.map((child, idx) => (
          <div key={idx} className={`flex items-center justify-center px-2 py-1.5 text-[10px] font-medium text-slate-700 text-center leading-tight
            ${idx !== childrenList.length - 1 ? 'border-b border-slate-200' : ''}`}>
             {/* Icon dot kecil pemanis */}
             <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1.5 shrink-0"></div>
             {child}
          </div>
        ))}
        
        {childrenList.length === 0 && (
            <div className="p-3 text-[10px] text-slate-400 italic text-center">
                Tidak ada sub-unit
            </div>
        )}
      </div>
    </div>
  );
};

// --- 2. Komponen Garis Penghubung (Connector) ---
const VerticalLine = ({ height = "h-6" }) => (
  <div className={`w-0.5 bg-slate-400 ${height}`}></div>
);

const HorizontalBracket = () => (
    <div className="w-1/2 h-5 border-x-2 border-t-2 border-slate-300 rounded-t-xl mb-[-2px]"></div>
);

const BaganStrukturFixed = () => {
  // --- Persiapan Data ---
  
  // 1. Kepala Dinas
  const kepalaDinas = "KEPALA DINAS";

  // 2. Sekretariat
  const sekretariatData = StrukturOrganisasiLengkap.find(s => s.subSections.some(sub => sub.subTitle === "Sekretaris"))?.subSections.find(sub => sub.subTitle === "Sekretaris");
  const sekretarisChildren = sekretariatData ? sekretariatData.list : [];

  // 3. Bidang-Bidang
  const bidangNodes = StrukturOrganisasiLengkap[0].subSections.filter(
    sub => sub.subTitle !== "Kepala Dinas" && sub.subTitle !== "Sekretaris"
  );

  // 4. UPT
  const uptNodes = StrukturOrganisasiLengkap[1].subSections;

  return (
    <div className="w-full bg-slate-50 py-6 px-3 md:px-6">
      <h2 className="text-xl font-semibold mb-6 text-center text-slate-800 uppercase">
        Bagan Struktur Organisasi Tahun 2025
      </h2>

      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* LEVEL 1: KEPALA DINAS */}
        <div className="relative z-20">
          <div className="bg-[#0f1f40] text-white px-6 py-3 rounded-lg border-2 border-slate-200 shadow-lg font-semibold text-xs tracking-widest">
                {kepalaDinas}
            </div>
        </div>

        {/* Garis Turun */}
        <VerticalLine height="h-8" />

        {/* LEVEL 2: SEKRETARIAT */}
        {/* Sekretariat ditaruh di tengah sebagai leher organisasi */}
        <div className="w-full max-w-sm mb-6 relative">
            {/* Garis Bracket kecil di atas sekretariat agar terlihat nyambung */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-slate-300"></div>
            
            <UnitKerjaCard 
                title="SEKRETARIS" 
                childrenList={sekretarisChildren}
                type="dark" // Warna beda dikit biar menonjol
            />
        </div>

        {/* LEVEL 3: CONTAINER GRID UNTUK BIDANG */}
        {/* Garis Penghubung Besar ke Bawah */}
        <div className="w-full flex justify-center items-center relative mb-4">
          <div className="absolute top-[-32px] bottom-0 w-0.5 bg-slate-300"></div>
            {/* Garis Horizontal Pembagi */}
          <div className="w-[80%] h-5 border-t-2 border-slate-300 rounded-t-3xl"></div>
        </div>

        {/* GRID BIDANG */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 relative z-10">
            {bidangNodes.map((bidang, idx) => (
                <div key={idx} className="flex flex-col items-center">
                    {/* Garis konektor kecil di atas tiap kartu */}
              <div className="h-5 w-0.5 bg-slate-300 -mt-5 mb-0"></div>
                    <UnitKerjaCard 
                        title={bidang.subTitle} 
                        childrenList={bidang.list} 
                    />
                </div>
            ))}
        </div>

        {/* LEVEL 4: UPT (Unit Pelaksana Teknis) */}
        {/* Divider Khusus UPT */}
           <div className="w-full flex flex-col items-center mb-6">
             <VerticalLine height="h-6" />
             <div className="bg-slate-200 px-5 py-1.5 rounded-full text-slate-600 text-[11px] font-semibold tracking-widest border border-slate-300 uppercase">
                Unit Pelaksana Teknis (UPT)
             </div>
             <VerticalLine height="h-5" />
              {/* Garis Horizontal UPT */}
             <div className="w-[80%] h-3.5 border-t-2 border-slate-300 rounded-t-3xl"></div>
        </div>

        {/* GRID UPT */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uptNodes.map((upt, idx) => (
                <div key={idx} className="flex flex-col items-center">
                     {/* Garis konektor */}
               <div className="h-5 w-0.5 bg-slate-300 -mt-5 mb-0"></div>
                    <UnitKerjaCard 
                        title={upt.subTitle} 
                        childrenList={upt.list} 
                    />
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default BaganStrukturFixed;