import React, { useEffect, useRef, useState, useMemo } from "react";
import { renderCell, renderCells } from "../Components/Tabel";


import { 
  ProfilSWP, 
  WilayahSungai, 
  MataAirWadukEmbungDanTelaga,
  TKPSDAProvinsiJawaTimur
} from "@/data/SDADalamAngka/2025/swp";

// Import data SWPS JSON
import DaftarSungaiData from "@/data/SDADalamAngka/DataTabelSWP2025/Tabel4.1_ Daftar Sungai Dalam Daerah Aliran Sungai.json";
import DataMataAirWSBengawanSolo from "@/data/SDADalamAngka/DataTabelSWP2025/Tabel4.2_DataMataAirWSBengawanSolo.json";
import DataMataAirWSBrantas from "@/data/SDADalamAngka/DataTabelSWP2025/Tabel4.3_DataMataAirWsBrantas.json";
import DataMataAirWSWelangRejoso from "@/data/SDADalamAngka/DataTabelSWP2025/Tabel4.4_DataMataAirWSWelangRejoso.json";
import DataMataAirWSPekalenSampean from "@/data/SDADalamAngka/DataTabelSWP2025/Tabel4.5_DataMataAirWSPekalen.json";
import DataMataAirWSBondoyudo from "@/data/SDADalamAngka/DataTabelSWP2025/Tabel4.6_DataMataAirWSBondoyudo.json";
import DataMataAirWSMaduraBawean from "@/data/SDADalamAngka/DataTabelSWP2025/Tabel4.7_DataMataAirWSMaduraBawean.json";
import DataMataAirWSBarBajulMati from "@/data/SDADalamAngka/DataTabelSWP2025/Tabel4.8_DataMataAirWSBarBajulMati.json";
import RekapitulasiDataMataAir from "@/data/SDADalamAngka/DataTabelSWP2025/Tabel4.9_RekapitulasiDataMataAirDiJawaTimur.json";
import DataDaftarWaduk from "@/data/SDADalamAngka/DataTabelSWP2025/Tabel4.10_DaftarWaduk.json";
import DataDaftarTelaga from "@/data/SDADalamAngka/DataTabelSWP2025/Tabel4.11_DaftarTelaga.json";
import DataRekapitulasiTampunganAir from "@/data/SDADalamAngka/DataTabelSWP2025/Tabel4.13_Daftar Rekapitulasi Tampungan Air Tahun 2024.json";


// Helper: Render sections
const SectionsRenderer = ({ sections }) => {
    if (!sections || sections.length === 0) {
        return <p className="text-zinc-500 italic">Data belum tersedia</p>;
    }
    return (
        <div className="space-y-8">
            {sections.map((section, idx) => (
                <div key={idx} className="space-y-4">
                    {section.title && (
                        <h3 className="text-xl font-semibold text-zinc-800 border-l-4 border-blue-600 pl-4">
                            {section.title}
                        </h3>
                    )}
                    {section.content && (
                        <p className="text-zinc-700 leading-relaxed text-justify">
                            {section.content}
                        </p>
                    )}
                    {section.list && section.list.length > 0 && (
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            {section.list.map((item, itemIdx) => (
                                <li key={itemIdx} className="text-zinc-700 leading-relaxed">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                    {section.subSections && section.subSections.map((sub, subIdx) => (
                         <div key={subIdx} className="ml-0 md:ml-4 mt-4">
                            <h4 className="text-lg font-bold text-zinc-900 mb-2">{sub.subTitle}</h4>
                            {sub.text && <p className="text-zinc-700 mb-2">{sub.text}</p>}
                            {sub.list && (
                                <ul className="list-disc list-inside ml-4 space-y-1 text-zinc-700">
                                    {sub.list.map((li, liIdx) => (
                                        <li key={liIdx}>{li}</li>
                                    ))}
                                </ul>
                            )}
                         </div>
                    ))}
                </div>
            ))}
        </div>
    );
};


// Quick jump navigation component
const QuickJumpNavigation = ({ tables, activeIndex, onJump }) => {
    if (!tables || tables.length === 0) return null;
    
    return (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Langsung ke tabel:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {tables.map((table, idx) => {
                    const isActive = activeIndex === idx;
                    const displayTitle = table.title
                        .replace('Tabel ', '')
                        .replace(' - ', ': ');
                    
                    return (
                        <button
                            key={idx}
                            onClick={() => onJump(idx)}
                            className={`px-4 py-2 rounded text-sm font-medium transition text-left w-full break-words whitespace-normal ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-zinc-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                        >
                            {displayTitle}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// WS detail card (accordion)
const WSDetailCard = ({ wsData }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-4 transition-all duration-300">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900 p-4 cursor-pointer flex justify-between items-center hover:bg-slate-800 transition-colors"
      >
        <div>
           <h3 className="text-base md:text-lg font-bold text-white">{wsData.nama}</h3>
           <p className="text-xs text-gray-300">Ketua: {wsData.ketua}</p>
        </div>
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
           <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
           </svg>
        </div>
      </div>
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h4 className="font-bold text-sm text-gray-900 uppercase border-b pb-2 mb-2">Pemerintah</h4>
                <ol className="list-decimal ml-4 text-sm text-gray-700 space-y-1">
                    {wsData.anggotaPemerintah.map((p, i) => <li key={i}>{p}</li>)}
                </ol>
            </div>
            <div>
                <h4 className="font-bold text-sm text-gray-900 uppercase border-b pb-2 mb-2">Non-Pemerintah</h4>
                <ol className="list-decimal ml-4 text-sm text-gray-700 space-y-1">
                    {wsData.anggotaNonPemerintah.map((p, i) => <li key={i}>{p}</li>)}
                </ol>
            </div>
        </div>
      </div>
    </div>
  );
};

// Main component
export default function SungaiWadukPantaiContent() {
    
    const [currentTableIndex, setCurrentTableIndex] = useState(0);
    const [currentTabel41Index, setCurrentTabel41Index] = useState(0);
    const [currentTabel410Index, setCurrentTabel410Index] = useState(0);
    const tableSectionHeaderRef = useRef(null);
    const didMountRef = useRef(false);

    // Validasi data dengan fallback
    const wsDataInfo = WilayahSungai?.[0] || {};
    const tampunganData = MataAirWadukEmbungDanTelaga?.[0] || {};
    const tkpsdaData = TKPSDAProvinsiJawaTimur?.[0] || {};

    // Helper: Convert roman numeral to number for sorting
    const romanToNumber = (roman) => {
        const romanMap = {
            'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5,
            'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10
        };
        return romanMap[roman] || 999;
    };

    // Helper: Convert number to Roman numeral
    const numberToRoman = (num) => {
        const romanMap = {
            1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
            6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X'
        };
        return romanMap[num] || num.toString();
    };

    // Helper: Parse number from Indonesian format string
    const parseNumber = (str) => {
        if (!str || str.trim() === '' || str === '-') return 0;
        const cleaned = str.toString().replace(/\./g, '').replace(',', '.');
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
    };

    // Helper: Format number to Indonesian format
    const formatNumber = (num, decimals = 2, emptyValue = '') => {
        if (num === 0 || isNaN(num)) return emptyValue;
        const parts = num.toFixed(decimals).split('.');
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        const decimalPart = parts[1];
        if (decimals === 0 || !decimalPart || parseFloat(decimalPart) === 0) {
            return integerPart;
        }
        return `${integerPart},${decimalPart}`;
    };

    // Sort data by WS and order number
    const sortDataByWS = (data) => {
        let currentWSOrder = 0;
        let currentDataOrder = 0;
        
        return [...data]
            .map((row) => {
            if (row.type === 'header') {
                currentDataOrder = 0;
                const romanNum = row.no?.replace(/[^IVXLCDM]/g, '') || '';
                    currentWSOrder = romanToNumber(romanNum);
                    return { ...row, _sortOrder: currentWSOrder * 10000 };
            } else {
                currentDataOrder++;
                const dataNo = parseInt(row.no) || currentDataOrder;
                return { ...row, _sortOrder: currentWSOrder * 10000 + dataNo };
            }
            })
            .sort((a, b) => (a._sortOrder || 0) - (b._sortOrder || 0))
            .map(({ _sortOrder, ...rest }) => rest);
    };
    
    // Split data into pages (max 30 rows per page or until new header)
    const createPages = (data) => {
        const pages = [];
        let currentPage = [];
        let currentPageSize = 0;
        const MAX_ROWS_PER_PAGE = 30;

        data.forEach((row) => {
            if (row.type === 'header') {
                if (currentPage.length > 0) {
                    pages.push([...currentPage]);
                    currentPage = [];
                    currentPageSize = 0;
                }
                currentPage.push(row);
                currentPageSize = 1;
            } else {
                if (currentPageSize >= MAX_ROWS_PER_PAGE) {
                    pages.push([...currentPage]);
                    currentPage = [];
                    currentPageSize = 0;
                }
                currentPage.push(row);
                currentPageSize++;
            }
        });

        if (currentPage.length > 0) {
            pages.push(currentPage);
        }

        return pages;
    };

    // Prepare data for tables
    const allSungaiData = [...(DaftarSungaiData || [])];
    const sortedSungaiData = sortDataByWS(allSungaiData);
    const dataPages = createPages(sortedSungaiData);

    // Ensure dataPages is not empty
    if (dataPages.length === 0 && sortedSungaiData.length > 0) {
        dataPages.push(sortedSungaiData);
    }

    // Table renderers
    const renderMataAirTable = (data) => {
        const safeData = Array.isArray(data) ? data : [];
        
        if (safeData.length === 0) {
            return (
                <div className="p-8 text-center text-zinc-500">
                    <p>Data belum tersedia</p>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto border border-zinc-200 rounded-lg">
                <table className="w-full text-sm text-left border-collapse min-w-[1200px]">
                    <thead className="bg-zinc-100 text-zinc-800 font-bold text-center uppercase text-xs">
                        <tr>
                            <th rowSpan={2} className="border border-zinc-300 p-2 w-12 bg-zinc-200">No.</th>
                            <th rowSpan={2} className="border border-zinc-300 p-2 min-w-[150px] bg-zinc-200">Nama Sumber</th>
                            <th className="border border-zinc-300 p-2 w-24 bg-zinc-200">Debit Sesaat</th>
                            <th rowSpan={2} className="border border-zinc-300 p-2 min-w-[100px] bg-zinc-200">Desa</th>
                            <th rowSpan={2} className="border border-zinc-300 p-2 min-w-[100px] bg-zinc-200">Kecamatan</th>
                            <th className="border border-zinc-300 p-2 min-w-[100px] bg-zinc-200">Kota/</th>
                            <th rowSpan={2} className="border border-zinc-300 p-2 w-20 bg-zinc-200">S</th>
                            <th rowSpan={2} className="border border-zinc-300 p-2 w-20 bg-zinc-200">E</th>
                            <th rowSpan={2} className="border border-zinc-300 p-2 min-w-[100px] bg-zinc-200">Peruntukan</th>
                            <th rowSpan={2} className="border border-zinc-300 p-2 min-w-[100px] bg-zinc-200">Update Data</th>
                        </tr>
                        <tr>
                            <th className="border border-zinc-300 p-1 bg-zinc-200">(lt/dt)</th>
                            <th className="border border-zinc-300 p-1 bg-zinc-200">Kabupaten</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {safeData.map((row, index) => (
                            <tr key={index} className="hover:bg-blue-50 transition-colors align-top border-b border-zinc-200">
                                {renderCell(row.no || "", 'center', { className: 'border border-zinc-300 text-zinc-500' })}
                                {renderCell(row.nama_sumber || "", 'bold', { className: 'border border-zinc-300' })}
                                {renderCell(row.debit_sesaat || "", 'center', { className: 'border border-zinc-300' })}
                                {renderCell(row.desa || "", 'normal', { className: 'border border-zinc-300 text-xs' })}
                                {renderCell(row.kecamatan || "", 'normal', { className: 'border border-zinc-300 text-xs' })}
                                {renderCell(row.kota_kabupaten || "", 'normal', { className: 'border border-zinc-300 text-xs' })}
                                {renderCell(row.s || "", 'center', { className: 'border border-zinc-300 text-xs' })}
                                {renderCell(row.e || "", 'center', { className: 'border border-zinc-300 text-xs' })}
                                {renderCell(row.peruntukan || "", 'normal', { className: 'border border-zinc-300 text-xs' })}
                                {renderCell(row.update_data || "", 'normal', { className: 'border border-zinc-300 text-xs' })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    // Render rekapitulasi table with rowspan per WS group
    const renderRekapitulasiTable = (data) => {
        const safeData = Array.isArray(data) ? data : [];
        
        if (safeData.length === 0) {
            return (
                <div className="p-8 text-center text-zinc-500">
                    <p>Data belum tersedia</p>
                </div>
            );
        }

        // Process data to calculate rowspan per WS group
        const processedData = [];
        let currentGroup = null;
        let groupStartIndex = -1;
        let groupRowCount = 0;

        safeData.forEach((row, index) => {
            if (row.is_grand_total) {
                if (currentGroup && groupStartIndex >= 0) {
                    processedData[groupStartIndex].rowspan = groupRowCount;
                }
                processedData.push({
                    ...row,
                    rowspan: 1,
                    showWilayahSungai: false
                });
                return;
            }

            const prevRow = index > 0 ? safeData[index - 1] : null;
            const isNewGroup = index === 0 || 
                              (prevRow?.is_total && row.wilayah_sungai && row.wilayah_sungai !== currentGroup) ||
                              (!row.is_total && row.wilayah_sungai && row.wilayah_sungai !== currentGroup && currentGroup);

            if (isNewGroup && !row.is_total) {
                if (currentGroup && groupStartIndex >= 0) {
                    processedData[groupStartIndex].rowspan = groupRowCount;
                }
                currentGroup = row.wilayah_sungai;
                groupStartIndex = processedData.length;
                groupRowCount = 1;
                processedData.push({
                    ...row,
                    rowspan: 1,
                    showWilayahSungai: true
                });
            } else {
                groupRowCount++;
                processedData.push({
                    ...row,
                    rowspan: 1,
                    showWilayahSungai: false,
                    isTotalRow: row.is_total
                });
            }
        });

        // Update rowspan for last group
        if (currentGroup && groupStartIndex >= 0 && groupRowCount > 0) {
            const lastProcessed = processedData[processedData.length - 1];
            if (!lastProcessed.is_grand_total) {
                processedData[groupStartIndex].rowspan = groupRowCount;
            }
        }

        return (
            <div className="overflow-x-auto border border-zinc-200 rounded-lg">
                <table className="w-full text-sm text-left border-collapse min-w-[600px]">
                    <thead className="bg-zinc-100 text-zinc-800 font-bold text-center uppercase text-xs">
                        <tr>
                            <th className="border border-zinc-300 p-2 min-w-[200px] bg-zinc-200">Wilayah Sungai</th>
                            <th className="border border-zinc-300 p-2 min-w-[200px] bg-zinc-200">Kab. / Kota</th>
                            <th className="border border-zinc-300 p-2 min-w-[150px] bg-zinc-200">Jumlah Mata Air</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {processedData.map((row, index) => {
                            if (row.is_grand_total) {
                                return (
                                    <tr key={index} className="bg-blue-100 font-bold border-t-4 border-blue-500">
                                        <td className="border border-zinc-300 p-2 font-bold">
                                            TOTAL MATA AIR DI JAWA TIMUR
                                        </td>
                                        <td className="border border-zinc-300 p-2 font-bold">
                                            Kab. / Kota : {row.jumlah_mata_air || ""}
                                        </td>
                                        <td className="border border-zinc-300 p-2"></td>
                                    </tr>
                                );
                            }
                            if (row.is_total) {
                                return (
                                    <tr key={index} className="bg-zinc-50 font-bold border-t-2 border-zinc-400">
                                        <td className="border border-zinc-300 p-2 font-bold">
                                            TOTAL : {row.jumlah_mata_air || ""}
                                        </td>
                                        <td className="border border-zinc-300 p-2"></td>
                                    </tr>
                                );
                            }
                            const displayKabKota = row.no 
                                ? `${row.no} ${row.kab_kota || ""}`.trim()
                                : row.kab_kota || "";
                            
                            return (
                                <tr key={index} className="hover:bg-blue-50 transition-colors align-top border-b border-zinc-200">
                                    {row.showWilayahSungai ? (
                                        <td 
                                            rowSpan={row.rowspan} 
                                            className="border border-zinc-300 p-2 align-middle font-medium bg-zinc-50"
                                        >
                                            {row.wilayah_sungai || ""}
                                        </td>
                                    ) : null}
                                    <td className="border border-zinc-300 p-2">
                                        {displayKabKota}
                                    </td>
                                    <td className="border border-zinc-300 p-2 text-center">
                                        {row.jumlah_mata_air || ""}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    // TableWaduk: Render waduk table with hierarchical structure
    const TableWaduk = ({ data, startNumber = 1, wsStartNumber = 1 }) => {
        const processedRows = useMemo(() => {
            if (!data || !Array.isArray(data)) return [];

            const rows = [];
            let lastWsName = "";
            let lastUptName = "";
            let regionCounter = startNumber;
            let wsCounter = wsStartNumber; // Counter untuk nomor romawi WS

            data.forEach((item, index) => {
        if (item.ws !== lastWsName) {
            rows.push({
                type: 'header_ws',
                text: item.ws,
                number: numberToRoman(wsCounter++) // Nomor romawi dinamis untuk setiap WS
            });
            lastWsName = item.ws;
            lastUptName = ""; 
        }
        if (item.upt !== lastUptName) {
            rows.push({
                type: 'header_upt',
                text: item.upt
            });
            lastUptName = item.upt;
        }

        // Rowspan logic for Kabupaten/Wilayah
        const prevItem = data[index - 1];
        const isNewRegion = !prevItem || prevItem.kabupaten !== item.kabupaten || prevItem.upt !== item.upt;

        let spanCount = 1;
        if (isNewRegion) {
            for (let i = index + 1; i < data.length; i++) {
                if (data[i].kabupaten === item.kabupaten && data[i].upt === item.upt) {
                    spanCount++;
                } else {
                    break;
                }
            }
        }

        rows.push({
            type: 'data',
            data: item,
            isNewRegion: isNewRegion,
            regionRowSpan: isNewRegion ? spanCount : 0,
            regionNumber: isNewRegion ? regionCounter++ : null
        });
    });

            return rows;
        }, [data, startNumber, wsStartNumber]);

  // Styles
  const cellClass = "border border-zinc-400 px-2 py-1 text-[11px] text-zinc-700 font-medium break-words leading-tight";
  const headerClass = "border border-zinc-400 bg-zinc-200 text-zinc-800 text-center font-bold text-[11px] uppercase p-2 align-middle";

  return (
    <div className="w-full overflow-x-auto bg-white">
      <table className="min-w-max border-collapse border border-zinc-500">
        <thead>
          <tr>
            <th rowSpan={2} className={`${headerClass} w-10`}>No.</th>
            <th rowSpan={2} className={`${headerClass} min-w-[180px]`}>
              Wilayah Sungai /<br />UPT PSDA
            </th>
            <th rowSpan={2} className={`${headerClass} min-w-[150px]`}>
              Nama Waduk
            </th>
            <th rowSpan={2} className={`${headerClass} w-24`}>DAS</th>
            <th rowSpan={2} className={`${headerClass} w-24`}>Sungai</th>
            <th rowSpan={2} className={`${headerClass} w-28`}>Desa</th>
            <th rowSpan={2} className={`${headerClass} w-28`}>Kecamatan</th>
            <th rowSpan={2} className={`${headerClass} w-20`}>S</th>
            <th rowSpan={2} className={`${headerClass} w-20`}>E</th>
            <th rowSpan={2} className={`${headerClass} w-24`}>Volume<br/>Tampungan</th>
            <th rowSpan={2} className={`${headerClass} w-24`}>Kapasitas<br/>Efektif</th>
            <th rowSpan={2} className={`${headerClass} w-24`}>Luas<br/>Daerah</th>
            <th rowSpan={2} className={`${headerClass} w-24`}>Peruntukan</th>
            <th rowSpan={2} className={`${headerClass} w-28`}>Pengelola</th>
            <th colSpan={3} className={`${headerClass}`}>Nomor Status BMN Bangunan</th>
            <th colSpan={3} className={`${headerClass}`}>Nomor Status BMN Tanah</th>
          </tr>

          <tr>
            <th className={`${headerClass} min-w-[120px]`}>Nama Satker</th>
            <th className={`${headerClass} min-w-[140px]`}>Pusat</th>
            <th className={`${headerClass} min-w-[100px]`}>Provinsi</th>
            <th className={`${headerClass} min-w-[140px] bg-zinc-100`}>Pusat</th>
            <th className={`${headerClass} min-w-[100px] bg-zinc-100`}>Provinsi</th>
            <th className={`${headerClass} min-w-[100px] bg-zinc-100`}>Kabupaten</th>
          </tr>
        </thead>

        <tbody>
          {processedRows.map((row, idx) => {
            if (row.type === 'header_ws') {
              return (
                <tr key={`ws-${idx}`} className="bg-zinc-300">
                  <td className={`${cellClass} text-center font-bold bg-zinc-300`}>{row.number}</td>
                  <td colSpan={20} className={`${cellClass} font-bold bg-zinc-300 text-left`}>
                    {row.text}
                  </td>
                </tr>
              );
            }
            if (row.type === 'header_upt') {
              return (
                <tr key={`upt-${idx}`}>
                  <td className={`${cellClass} bg-white`}></td>
                  <td colSpan={20} className={`${cellClass} font-bold bg-white text-left uppercase pl-4`}>
                    {row.text}
                  </td>
                </tr>
              );
            }
             const item = row.data;
             return (
               <tr key={`data-${idx}`} className="hover:bg-blue-50">
                 {row.isNewRegion ? (
                     <td rowSpan={row.regionRowSpan} className={`${cellClass} text-center align-top`}>
                         {row.regionNumber}
                     </td>
                 ) : null}
                 {row.isNewRegion ? (
                     <td rowSpan={row.regionRowSpan} className={`${cellClass} align-top font-semibold min-w-[100px]`}>
                         {item.kabupaten}
                     </td>
                 ) : null}
                 <td className={`${cellClass} align-top font-semibold min-w-[150px]`}>{item.nama_waduk}</td>
                <td className={`${cellClass} align-top text-center`}>{item.das}</td>
                <td className={`${cellClass} align-top`}>{item.sungai}</td>
                <td className={`${cellClass} align-top`}>{item.desa}</td>
                <td className={`${cellClass} align-top`}>{item.kecamatan}</td>
                <td className={`${cellClass} align-top text-center whitespace-nowrap`}>{item.s}</td>
                <td className={`${cellClass} align-top text-center whitespace-nowrap`}>{item.e}</td>
                <td className={`${cellClass} align-top text-right`}>{item.volume}</td>
                <td className={`${cellClass} align-top text-center`}>{item.kapasitas}</td>
                <td className={`${cellClass} align-top text-right`}>{item.luas}</td>
                <td className={`${cellClass} align-top text-center`}>{item.peruntukan}</td>
                <td className={`${cellClass} align-top text-center`}>{item.pengelola}</td>
                <td className={`${cellClass} align-top`}>{item.satker}</td>
                <td className={`${cellClass} align-top text-center`}>{item.bmn_bangunan_pusat}</td>
                <td className={`${cellClass} align-top text-center`}>
                    {item.bmn_bangunan_provinsi === 'v' ? '✓' : item.bmn_bangunan_provinsi}
                </td>
                <td className={`${cellClass} align-top text-left font-mono text-[10px]`}>
                    {item.bmn_tanah_pusat === 'v' ? '✓' : item.bmn_tanah_pusat}
                </td>
                <td className={`${cellClass} align-top text-center`}>
                    {item.bmn_tanah_provinsi === 'v' ? '✓' : item.bmn_tanah_provinsi}
                </td>
                <td className={`${cellClass} align-top text-center`}>
                    {item.bmn_tanah_kabupaten === 'v' ? '✓' : item.bmn_tanah_kabupaten}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

    // TableTelaga: Render telaga table with hierarchical structure
    const TableTelaga = ({ data, startNumber = 1, wsStartNumber = 1 }) => {
        // Calculate totals from all data
        const totals = useMemo(() => {
            if (!data || !Array.isArray(data)) {
                return { volume_tampungan: 0, kapasitas_efektif: 0, luas_daerah_genangan: 0 };
            }

            return data.reduce((acc, item) => {
                acc.volume_tampungan += parseNumber(item.volume_tampungan);
                acc.kapasitas_efektif += parseNumber(item.kapasitas_efektif);
                acc.luas_daerah_genangan += parseNumber(item.luas_daerah_genangan);
                return acc;
            }, { volume_tampungan: 0, kapasitas_efektif: 0, luas_daerah_genangan: 0 });
        }, [data, parseNumber]);

        const processedRows = useMemo(() => {
            if (!data || !Array.isArray(data)) return [];

            const rows = [];
            let lastWsName = "";
            let lastUptName = "";
            let regionCounter = startNumber;
            let wsCounter = wsStartNumber;

            data.forEach((item, index) => {
                if (item.ws !== lastWsName) {
                    rows.push({
                        type: 'header_ws',
                        text: item.ws,
                        number: numberToRoman(wsCounter++)
                    });
                    lastWsName = item.ws;
                    lastUptName = ""; 
                }
                if (item.upt !== lastUptName) {
                    rows.push({
                        type: 'header_upt',
                        text: item.upt
                    });
                    lastUptName = item.upt;
                }

                // Rowspan logic for Kabupaten/Wilayah
                const prevItem = data[index - 1];
                const isNewRegion = !prevItem || prevItem.kabupaten !== item.kabupaten || prevItem.upt !== item.upt;

                let spanCount = 1;
                if (isNewRegion) {
                    for (let i = index + 1; i < data.length; i++) {
                        if (data[i].kabupaten === item.kabupaten && data[i].upt === item.upt) {
                            spanCount++;
                        } else {
                            break;
                        }
                    }
                }

                rows.push({
                    type: 'data',
                    data: item,
                    isNewRegion: isNewRegion,
                    regionRowSpan: isNewRegion ? spanCount : 0,
                    regionNumber: isNewRegion ? regionCounter++ : null
                });
            });

            return rows;
        }, [data, startNumber, wsStartNumber]);

        // Styles
        const cellClass = "border border-zinc-400 px-2 py-1 text-[11px] text-zinc-700 font-medium break-words leading-tight";
        const headerClass = "border border-zinc-400 bg-zinc-200 text-zinc-800 text-center font-bold text-[11px] uppercase p-2 align-middle";

        return (
            <div className="w-full overflow-x-auto bg-white">
                <table className="min-w-max border-collapse border border-zinc-500">
                    <thead>
                        <tr>
                            <th rowSpan={2} className={`${headerClass} w-10`}>No.</th>
                            <th rowSpan={2} className={`${headerClass} min-w-[180px]`}>
                                Wilayah Sungai /<br />UPT PSDA /<br />Kabupaten / Kota
                            </th>
                            <th rowSpan={2} className={`${headerClass} min-w-[150px]`}>
                                Nama Telaga / Ranu
                            </th>
                            <th colSpan={2} className={`${headerClass}`}>Lokasi</th>
                            <th colSpan={2} className={`${headerClass}`}>Koordinat (DMS)</th>
                            <th rowSpan={2} className={`${headerClass} w-24`}>Tinggi Tanggul<br/>dari Dasar<br/>Terdalam (m)</th>
                            <th rowSpan={2} className={`${headerClass} w-24`}>Panjang<br/>Tanggul (m)</th>
                            <th rowSpan={2} className={`${headerClass} w-24`}>Volume<br/>Tampungan<br/>(10³ m³)</th>
                            <th rowSpan={2} className={`${headerClass} w-24`}>Kapasitas<br/>Efektif<br/>(10³ m³)</th>
                            <th rowSpan={2} className={`${headerClass} w-24`}>Luas Daerah<br/>Genangan<br/>(km²)</th>
                            <th rowSpan={2} className={`${headerClass} w-24`}>Manfaat</th>
                            <th rowSpan={2} className={`${headerClass} w-28`}>Pengelola</th>
                        </tr>
                        <tr>
                            <th className={`${headerClass} w-28`}>Kecamatan</th>
                            <th className={`${headerClass} w-28`}>Desa</th>
                            <th className={`${headerClass} w-20`}>S</th>
                            <th className={`${headerClass} w-20`}>E</th>
                        </tr>
                    </thead>

                    <tbody>
                        {processedRows.map((row, idx) => {
                            if (row.type === 'header_ws') {
                                return (
                                    <tr key={`ws-${idx}`} className="bg-zinc-300">
                                        <td className={`${cellClass} text-center font-bold bg-zinc-300`}>{row.number}</td>
                                        <td colSpan={13} className={`${cellClass} font-bold bg-zinc-300 text-left`}>
                                            {row.text}
                                        </td>
                                    </tr>
                                );
                            }
                            if (row.type === 'header_upt') {
                                return (
                                    <tr key={`upt-${idx}`}>
                                        <td className={`${cellClass} bg-white`}></td>
                                        <td colSpan={13} className={`${cellClass} font-bold bg-white text-left uppercase pl-4`}>
                                            {row.text}
                                        </td>
                                    </tr>
                                );
                            }
                            const item = row.data;
                            return (
                                <tr key={`data-${idx}`} className="hover:bg-blue-50">
                                    {row.isNewRegion ? (
                                        <td rowSpan={row.regionRowSpan} className={`${cellClass} text-center align-top`}>
                                            {row.regionNumber}
                                        </td>
                                    ) : null}
                                    {row.isNewRegion ? (
                                        <td rowSpan={row.regionRowSpan} className={`${cellClass} align-top font-semibold min-w-[100px]`}>
                                            {item.kabupaten}
                                        </td>
                                    ) : null}
                                    <td className={`${cellClass} align-top font-semibold min-w-[150px]`}>{item.nama_telaga}</td>
                                    <td className={`${cellClass} align-top`}>{item.kecamatan}</td>
                                    <td className={`${cellClass} align-top`}>{item.desa}</td>
                                    <td className={`${cellClass} align-top text-center whitespace-nowrap`}>{item.s}</td>
                                    <td className={`${cellClass} align-top text-center whitespace-nowrap`}>{item.e}</td>
                                    <td className={`${cellClass} align-top text-right`}>{item.tinggi_tanggul}</td>
                                    <td className={`${cellClass} align-top text-right`}>{item.panjang_tanggul}</td>
                                    <td className={`${cellClass} align-top text-right`}>{item.volume_tampungan}</td>
                                    <td className={`${cellClass} align-top text-right`}>{item.kapasitas_efektif}</td>
                                    <td className={`${cellClass} align-top text-right`}>{item.luas_daerah_genangan}</td>
                                    <td className={`${cellClass} align-top text-center`}>{item.manfaat}</td>
                                    <td className={`${cellClass} align-top text-center`}>{item.pengelola}</td>
                                </tr>
                            );
                        })}
                        {/* Total Row */}
                        <tr className="bg-blue-50 font-bold border-t-2 border-blue-400">
                            <td className={`${cellClass} bg-blue-50`}></td>
                            <td className={`${cellClass} bg-blue-50`}></td>
                            <td className={`${cellClass} bg-blue-50 text-center`}>TOTAL</td>
                            <td className={`${cellClass} bg-blue-50`}></td>
                            <td className={`${cellClass} bg-blue-50`}></td>
                            <td className={`${cellClass} bg-blue-50`}></td>
                            <td className={`${cellClass} bg-blue-50`}></td>
                            <td className={`${cellClass} bg-blue-50`}></td>
                            <td className={`${cellClass} bg-blue-50`}></td>
                            <td className={`${cellClass} bg-blue-50 text-right font-bold`}>
                                {formatNumber(totals.volume_tampungan, 0, '')}
                            </td>
                            <td className={`${cellClass} bg-blue-50 text-right font-bold`}>
                                {formatNumber(totals.kapasitas_efektif, 0, '')}
                            </td>
                            <td className={`${cellClass} bg-blue-50 text-right font-bold`}>
                                {formatNumber(totals.luas_daerah_genangan, 2, '')}
                            </td>
                            <td className={`${cellClass} bg-blue-50`}></td>
                            <td className={`${cellClass} bg-blue-50`}></td>
                        </tr>
                    </tbody>
      </table>
    </div>
  );
};

    // TableRekapitulasiTampunganAir: Render rekapitulasi tampungan air table
    const TableRekapitulasiTampunganAir = ({ data, startNumber = 1, wsStartNumber = 1 }) => {
        const processedRows = useMemo(() => {
            if (!data || !Array.isArray(data)) return [];

            const rows = [];
            let lastWsName = "";
            let wsCounter = wsStartNumber;
            let regionCounter = startNumber;

            data.forEach((item, index) => {
                // Check if this is a WS header
                if (item.type === 'header_ws' || (item.ws && item.ws !== lastWsName && !item.upt)) {
                    rows.push({
                        type: 'header_ws',
                        text: item.ws || item.wilayah_sungai,
                        number: numberToRoman(wsCounter++)
                    });
                    lastWsName = item.ws || item.wilayah_sungai;
                    regionCounter = startNumber;
                }

                // Check if this is a UPT row
                if (item.upt || item.type === 'data') {
                    rows.push({
                        type: 'data',
                        data: item,
                        regionNumber: regionCounter++
                    });
                }

                // Check if this is a total row
                if (item.type === 'total' || item.is_total) {
                    rows.push({
                        type: 'total',
                        data: item
                    });
                }
            });

            return rows;
        }, [data, startNumber, wsStartNumber]);

        // Calculate totals
        const totals = useMemo(() => {
            if (!data || !Array.isArray(data)) {
                return {
                    waduk: { jumlah: 0, volume: 0, kapasitas: 0 },
                    embung: { jumlah: 0, volume: 0, kapasitas: 0 },
                    telaga: { jumlah: 0, volume: 0, kapasitas: 0 }
                };
            }

            return data.reduce((acc, item) => {
                if (item.type === 'total' || item.is_total) return acc;
                
                acc.waduk.jumlah += parseNumber(item.waduk_jumlah || item.waduk?.jumlah || 0);
                acc.waduk.volume += parseNumber(item.waduk_volume || item.waduk?.volume_tampungan || 0);
                acc.waduk.kapasitas += parseNumber(item.waduk_kapasitas || item.waduk?.kapasitas_efektif || 0);
                
                acc.embung.jumlah += parseNumber(item.embung_jumlah || item.embung?.jumlah || 0);
                acc.embung.volume += parseNumber(item.embung_volume || item.embung?.volume_tampungan || 0);
                acc.embung.kapasitas += parseNumber(item.embung_kapasitas || item.embung?.kapasitas_efektif || 0);
                
                acc.telaga.jumlah += parseNumber(item.telaga_jumlah || item.telaga?.jumlah || 0);
                acc.telaga.volume += parseNumber(item.telaga_volume || item.telaga?.volume_tampungan || 0);
                acc.telaga.kapasitas += parseNumber(item.telaga_kapasitas || item.telaga?.kapasitas_efektif || 0);
                
                return acc;
            }, {
                waduk: { jumlah: 0, volume: 0, kapasitas: 0 },
                embung: { jumlah: 0, volume: 0, kapasitas: 0 },
                telaga: { jumlah: 0, volume: 0, kapasitas: 0 }
            });
        }, [data, parseNumber]);

        // Styles
        const cellClass = "border border-zinc-400 px-2 py-1 text-[11px] text-zinc-700 font-medium break-words leading-tight";
        const headerClass = "border border-zinc-400 bg-zinc-200 text-zinc-800 text-center font-bold text-[11px] uppercase p-2 align-middle";

        return (
            <div className="w-full overflow-x-auto bg-white">
                <table className="min-w-max border-collapse border border-zinc-500">
                    <thead>
                        <tr>
                            <th rowSpan={2} className={`${headerClass} w-10`}>No.</th>
                            <th rowSpan={2} className={`${headerClass} min-w-[250px]`}>
                                Wilayah Sungai /<br />UPT PSDA /<br />Kabupaten / Kota
                            </th>
                            <th colSpan={3} className={`${headerClass}`}>WADUK</th>
                            <th colSpan={3} className={`${headerClass}`}>EMBUNG</th>
                            <th colSpan={3} className={`${headerClass}`}>TELAGA</th>
                        </tr>
                        <tr>
                            <th className={`${headerClass} w-20`}>Jumlah<br/>(buah)</th>
                            <th className={`${headerClass} w-28`}>Volume<br/>Tampungan<br/>(10³ m³)</th>
                            <th className={`${headerClass} w-28`}>Kapasitas<br/>Efektif<br/>(10³ m³)</th>
                            <th className={`${headerClass} w-20`}>Jumlah<br/>(buah)</th>
                            <th className={`${headerClass} w-28`}>Volume<br/>Tampungan<br/>(10³ m³)</th>
                            <th className={`${headerClass} w-28`}>Kapasitas<br/>Efektif<br/>(10³ m³)</th>
                            <th className={`${headerClass} w-20`}>Jumlah<br/>(buah)</th>
                            <th className={`${headerClass} w-28`}>Volume<br/>Tampungan<br/>(10³ m³)</th>
                            <th className={`${headerClass} w-28`}>Kapasitas<br/>Efektif<br/>(10³ m³)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processedRows.map((row, idx) => {
                            if (row.type === 'header_ws') {
                                return (
                                    <tr key={`ws-${idx}`} className="bg-zinc-300">
                                        <td className={`${cellClass} text-center font-bold bg-zinc-300`}>{row.number}</td>
                                        <td colSpan={10} className={`${cellClass} font-bold bg-zinc-300 text-left`}>
                                            {row.text}
                                        </td>
                                    </tr>
                                );
                            }
                            
                            if (row.type === 'total') {
                                const item = row.data;
                                return (
                                    <tr key={`total-${idx}`} className="bg-blue-50 font-bold border-t-2 border-blue-400">
                                        <td className={`${cellClass} bg-blue-50`}></td>
                                        <td className={`${cellClass} bg-blue-50 font-bold`}>
                                            {item.label || 'JUMLAH'}
                                        </td>
                                        <td className={`${cellClass} bg-blue-50 text-right font-bold`}>
                                            {formatNumber(parseNumber(item.waduk_jumlah || item.waduk?.jumlah || totals.waduk.jumlah), 0, '-')}
                                        </td>
                                        <td className={`${cellClass} bg-blue-50 text-right font-bold`}>
                                            {formatNumber(parseNumber(item.waduk_volume || item.waduk?.volume_tampungan || totals.waduk.volume), 2, '-')}
                                        </td>
                                        <td className={`${cellClass} bg-blue-50 text-right font-bold`}>
                                            {formatNumber(parseNumber(item.waduk_kapasitas || item.waduk?.kapasitas_efektif || totals.waduk.kapasitas), 2, '-')}
                                        </td>
                                        <td className={`${cellClass} bg-blue-50 text-right font-bold`}>
                                            {formatNumber(parseNumber(item.embung_jumlah || item.embung?.jumlah || totals.embung.jumlah), 0, '-')}
                                        </td>
                                        <td className={`${cellClass} bg-blue-50 text-right font-bold`}>
                                            {formatNumber(parseNumber(item.embung_volume || item.embung?.volume_tampungan || totals.embung.volume), 2, '-')}
                                        </td>
                                        <td className={`${cellClass} bg-blue-50 text-right font-bold`}>
                                            {formatNumber(parseNumber(item.embung_kapasitas || item.embung?.kapasitas_efektif || totals.embung.kapasitas), 2, '-')}
                                        </td>
                                        <td className={`${cellClass} bg-blue-50 text-right font-bold`}>
                                            {formatNumber(parseNumber(item.telaga_jumlah || item.telaga?.jumlah || totals.telaga.jumlah), 0, '-')}
                                        </td>
                                        <td className={`${cellClass} bg-blue-50 text-right font-bold`}>
                                            {formatNumber(parseNumber(item.telaga_volume || item.telaga?.volume_tampungan || totals.telaga.volume), 2, '-')}
                                        </td>
                                        <td className={`${cellClass} bg-blue-50 text-right font-bold`}>
                                            {formatNumber(parseNumber(item.telaga_kapasitas || item.telaga?.kapasitas_efektif || totals.telaga.kapasitas), 2, '-')}
                                        </td>
                                    </tr>
                                );
                            }

                            const item = row.data;
                            return (
                                <tr key={`data-${idx}`} className="hover:bg-blue-50">
                                    <td className={`${cellClass} text-center align-top`}>
                                        {row.regionNumber || ''}
                                    </td>
                                    <td className={`${cellClass} align-top font-semibold min-w-[250px]`}>
                                        {item.upt || item.nama || item.wilayah_sungai || ''}
                                    </td>
                                    <td className={`${cellClass} align-top text-right`}>
                                        {item.waduk_jumlah || item.waduk?.jumlah || '-'}
                                    </td>
                                    <td className={`${cellClass} align-top text-right`}>
                                        {item.waduk_volume || item.waduk?.volume_tampungan || '-'}
                                    </td>
                                    <td className={`${cellClass} align-top text-right`}>
                                        {item.waduk_kapasitas || item.waduk?.kapasitas_efektif || '-'}
                                    </td>
                                    <td className={`${cellClass} align-top text-right`}>
                                        {item.embung_jumlah || item.embung?.jumlah || '-'}
                                    </td>
                                    <td className={`${cellClass} align-top text-right`}>
                                        {item.embung_volume || item.embung?.volume_tampungan || '-'}
                                    </td>
                                    <td className={`${cellClass} align-top text-right`}>
                                        {item.embung_kapasitas || item.embung?.kapasitas_efektif || '-'}
                                    </td>
                                    <td className={`${cellClass} align-top text-right`}>
                                        {item.telaga_jumlah || item.telaga?.jumlah || '-'}
                                    </td>
                                    <td className={`${cellClass} align-top text-right`}>
                                        {item.telaga_volume || item.telaga?.volume_tampungan || '-'}
                                    </td>
                                    <td className={`${cellClass} align-top text-right`}>
                                        {item.telaga_kapasitas || item.telaga?.kapasitas_efektif || '-'}
                                    </td>
                                </tr>
                            );
                        })}
                        {/* Total Row jika tidak ada di data */}
                        {processedRows.length > 0 && !processedRows.some(r => r.type === 'total') && (
                            <tr className="bg-blue-50 font-bold border-t-2 border-blue-400">
                                <td className={`${cellClass} bg-blue-50`}></td>
                                <td className={`${cellClass} bg-blue-50 font-bold`}>JUMLAH</td>
                                <td className={`${cellClass} bg-blue-50 text-right font-bold`}>
                                    {formatNumber(totals.waduk.jumlah, 0, '-')}
                                </td>
                                <td className={`${cellClass} bg-blue-50 text-right font-bold`}>
                                    {formatNumber(totals.waduk.volume, 2, '-')}
                                </td>
                                <td className={`${cellClass} bg-blue-50 text-right font-bold`}>
                                    {formatNumber(totals.waduk.kapasitas, 2, '-')}
                                </td>
                                <td className={`${cellClass} bg-blue-50 text-right font-bold`}>
                                    {formatNumber(totals.embung.jumlah, 0, '-')}
                                </td>
                                <td className={`${cellClass} bg-blue-50 text-right font-bold`}>
                                    {formatNumber(totals.embung.volume, 2, '-')}
                                </td>
                                <td className={`${cellClass} bg-blue-50 text-right font-bold`}>
                                    {formatNumber(totals.embung.kapasitas, 2, '-')}
                                </td>
                                <td className={`${cellClass} bg-blue-50 text-right font-bold`}>
                                    {formatNumber(totals.telaga.jumlah, 0, '-')}
                                </td>
                                <td className={`${cellClass} bg-blue-50 text-right font-bold`}>
                                    {formatNumber(totals.telaga.volume, 2, '-')}
                                </td>
                                <td className={`${cellClass} bg-blue-50 text-right font-bold`}>
                                    {formatNumber(totals.telaga.kapasitas, 2, '-')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    // Render sungai table with pagination
    const renderTable = (pageData, pageNumber) => (
                <div className="overflow-x-auto border border-zinc-200 rounded-lg">
                    <table className="w-full text-sm text-left border-collapse min-w-[1000px]">
                        <thead className="bg-zinc-100 text-zinc-800 font-bold uppercase text-xs">
                            <tr>
                                <th rowSpan={2} className="border border-zinc-300 p-2 w-10 bg-zinc-200 text-center">No</th>
                                <th rowSpan={2} className="border border-zinc-300 p-2 w-32 bg-zinc-200 text-left">Wilayah Sungai / DAS</th>
                                <th rowSpan={2} className="border border-zinc-300 p-2 w-48 bg-zinc-200 text-left">Nama Sungai</th>
                        <th rowSpan={2} className="border border-zinc-300 p-0.5 bg-blue-50 text-center text-xs w-16">Orde 1</th>
                                <th colSpan={2} className="border border-zinc-300 p-2 bg-green-50 text-center whitespace-nowrap">Lokasi</th>
                                <th colSpan={3} className="border border-zinc-300 p-2 bg-yellow-50 text-center">Pengelola</th>
                                <th rowSpan={2} className="border border-zinc-300 p-2 w-24 bg-zinc-200 text-right">Catchment Area (Km²)</th>
                                <th rowSpan={2} className="border border-zinc-300 p-2 w-20 bg-zinc-200 text-right">L (Km)</th>
                            </tr>
                            <tr>
                        <th className="border border-zinc-300 p-1 w-52 bg-green-50 text-left text-xs whitespace-nowrap">
                            Lintas Propinsi / Kab./ Kota
                        </th>
                                <th className="border border-zinc-300 p-1 w-32 bg-green-50 text-left text-xs">Lokal</th>
                                <th className="border border-zinc-300 p-1 w-16 bg-yellow-50 text-center">Pusat</th>
                                <th className="border border-zinc-300 p-1 w-16 bg-yellow-50 text-center">Prov.</th>
                                <th className="border border-zinc-300 p-1 w-16 bg-yellow-50 text-center">Kab</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {pageData.map((row, index) => {
                                if (row.type === 'header') {
                                    return (
                                        <tr key={index} className="bg-zinc-50 font-bold border-b-2 border-zinc-300">
                                            {renderCell(row.no, 'center', { className: 'border border-zinc-300' })}
                                    {renderCell(row.ws_das, 'bold', { 
                                        colSpan: 8, 
                                        className: 'border border-zinc-300 text-zinc-900 text-left' 
                                    })}
                                    {renderCell(row.catchment_area, 'normal', { 
                                        className: 'border border-zinc-300 text-right' 
                                    })}
                                            {renderCell("", 'center', { className: 'border border-zinc-300' })}
                                        </tr>
                                    );
                                }
                                return (
                                    <tr key={index} className="hover:bg-blue-50 transition-colors align-top border-b border-zinc-200">
                                        {renderCell(row.no, 'center', { className: 'border border-zinc-300 text-zinc-500' })}
                                        {renderCell(row.ws_das, 'bold', { className: 'border border-zinc-300 text-left' })}
                                        <td className="border border-zinc-300 p-2 relative text-left">
                                    <div 
                                        style={{ paddingLeft: row.level ? `${row.level * 20}px` : '0px' }} 
                                        className="flex items-center"
                                    >
                                                {row.level > 0 && (
                                                    <span className="text-zinc-400 mr-2 text-xs">↳</span>
                                                )}
                                                {row.nama_sungai}
                                            </div>
                                        </td>
                                {(() => {
                                    const cell = renderCell(row.orde?.[1] ? "*" : "", 'boldCenter');
                                            return React.cloneElement(cell, {
                                                className: 'border border-zinc-300 p-0.5 text-center font-bold text-zinc-600'
                                            });
                                })()}
                                        {React.Children.map(
                                            renderCells(row, ['lokasi.lintas', 'lokasi.lokal'], 'normal'),
                                    (cell, idx) => React.cloneElement(cell, {
                                                    key: idx,
                                                    className: 'border border-zinc-300 p-2 text-xs text-left'
                                                })
                                        )}
                                {[1, 2, 3].map((idx) => (
                                    <td key={idx} className="border border-zinc-300 text-center"></td>
                                ))}
                                {renderCell(row.catchment_area, 'normal', { 
                                    className: 'border border-zinc-300 text-right font-mono text-xs' 
                                })}
                                {renderCell(row.length, 'normal', { 
                                    className: 'border border-zinc-300 text-right font-mono text-xs' 
                                })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
    );

    // Table configuration
    const mataAirTableConfig = [
        { number: '4.2', wsName: 'Bengawan Solo', data: DataMataAirWSBengawanSolo },
        { number: '4.3', wsName: 'Brantas', data: DataMataAirWSBrantas },
        { number: '4.4', wsName: 'Welang Rejoso', data: DataMataAirWSWelangRejoso },
        { number: '4.5', wsName: 'Pekalen Sampean', data: DataMataAirWSPekalenSampean },
        { number: '4.6', wsName: 'Bondoyudo', data: DataMataAirWSBondoyudo },
        { number: '4.7', wsName: 'Madura Bawean', data: DataMataAirWSMaduraBawean },
        { number: '4.8', wsName: 'Bar Bajul Mati', data: DataMataAirWSBarBajulMati }
    ];

    // Tabel 4.1: separate pagination
    const tabel41Pages = dataPages.map((pageData, pageIndex) => ({
            id: `daftar-sungai-page-${pageIndex + 1}`,
        title: "Tabel 4.1 Daftar Sungai Dalam Daerah Aliran Sungai pada Wilayah Sungai di Provinsi Jawa Timur",
            component: renderTable(pageData, pageIndex + 1)
    }));

    // Tabel 4.11: Daftar Telaga
    const allTelagaData = DataDaftarTelaga || [];

    // Tabel 4.13: Daftar Rekapitulasi Tampungan Air Tahun 2024
    const rekapitulasiTampunganAirData = DataRekapitulasiTampunganAir || [];

    // Tabel 4.10: 3 pages (before Lamongan, all Lamongan, Gresik + WS Brantas)
    const allWadukData = DataDaftarWaduk || [];
    const lamonganIndex = allWadukData.findIndex(item => item.kabupaten === "Lamongan");
    const gresikIndex = allWadukData.findIndex(item => item.kabupaten === "Gresik");
    const brantasIndex = allWadukData.findIndex(item => item.ws === "WS. BRANTAS");
    const page3StartIndex = gresikIndex >= 0 ? gresikIndex : (brantasIndex >= 0 ? brantasIndex : allWadukData.length);
    
    const wadukDataPage1 = lamonganIndex >= 0 
        ? allWadukData.slice(0, lamonganIndex) 
        : allWadukData;
    const lamonganData = lamonganIndex >= 0 && page3StartIndex > lamonganIndex
        ? allWadukData.slice(lamonganIndex, page3StartIndex)
        : (lamonganIndex >= 0 ? allWadukData.slice(lamonganIndex) : []);
    const wadukDataPage3 = page3StartIndex < allWadukData.length
        ? allWadukData.slice(page3StartIndex)
        : [];
    
    // Count unique regions per page (new region when kabupaten or UPT changes)
    const countUniqueRegions = (data) => {
        if (!data || data.length === 0) return 0;
        
        let count = 0;
        let prevKabupaten = "";
        let prevUpt = "";
        
        data.forEach((item) => {
            if (item.kabupaten !== prevKabupaten || item.upt !== prevUpt) {
                count++;
                prevKabupaten = item.kabupaten;
                prevUpt = item.upt;
            }
        });
        
        return count;
    };
    
    // Count unique WS per page (new WS when ws name changes)
    const countUniqueWS = (data) => {
        if (!data || data.length === 0) return 0;
        
        let count = 0;
        let prevWS = "";
        
        data.forEach((item) => {
            if (item.ws && item.ws !== prevWS) {
                count++;
                prevWS = item.ws;
            }
        });
        
        return count;
    };
    
    const startNumberPage1 = 1;
    const startNumberPage2 = startNumberPage1 + countUniqueRegions(wadukDataPage1);
    const startNumberPage3 = startNumberPage2 + countUniqueRegions(lamonganData);
    
    const wsStartNumberPage1 = 1;
    const wsStartNumberPage2 = wsStartNumberPage1 + countUniqueWS(wadukDataPage1);
    const wsStartNumberPage3 = wsStartNumberPage2 + countUniqueWS(lamonganData);
    
    const tabel410Pages = [
        {
            id: `daftar-waduk-page-1`,
            title: "Tabel 4.10 Daftar Waduk",
            component: <TableWaduk data={wadukDataPage1} startNumber={startNumberPage1} wsStartNumber={wsStartNumberPage1} />
        }
    ];
    
    if (lamonganData.length > 0) {
        tabel410Pages.push({
            id: `daftar-waduk-page-2`,
            title: "Lanjutan Tabel 4.10 Daftar Waduk",
            component: <TableWaduk data={lamonganData} startNumber={startNumberPage2} wsStartNumber={wsStartNumberPage2} />
            
        });
    }
    
    // Tambahkan halaman 3 hanya jika ada data
    if (wadukDataPage3.length > 0) {
        tabel410Pages.push({
            id: `daftar-waduk-page-3`,
            title: "Lanjutan Tabel 4.10 Daftar Waduk",
            component: <TableWaduk data={wadukDataPage3} startNumber={startNumberPage3} wsStartNumber={wsStartNumberPage3} />
        });
    }

    // Array tables untuk pagination (Tabel 4.2 - 4.9, TIDAK termasuk Tabel 4.1 dan 4.10)
    const tables = [
        // Tabel 4.2 - 4.8 Data MATA AIR per WS (generated dari config)
        ...mataAirTableConfig.map((config) => ({
            id: `data-mata-air-${config.wsName.toLowerCase().replace(/\s+/g, '-')}`,
            title: `Tabel ${config.number} Data Mata Air WS ${config.wsName}`,
            component: renderMataAirTable(config.data || [])
        })),
        
        // Tabel 4.9 Rekapitulasi Data Mata Air Di Jawa Timur
        {
            id: `rekapitulasi-data-mata-air`,
            title: "Tabel 4.9 Rekapitulasi Data Mata Air Di Jawa Timur",
            component: renderRekapitulasiTable(RekapitulasiDataMataAir || [])
        }
    ];

    // =========================================================================
    // TABLE NAVIGATION: State dan handlers untuk navigasi tabel
    // =========================================================================
    const totalTables = tables.length;
    const safeTableIndex = totalTables > 0 ? Math.min(currentTableIndex, totalTables - 1) : 0;
    const currentTable = tables[safeTableIndex] || null;

    // Validasi dan reset index jika tidak valid (hanya setelah mount)
    useEffect(() => {
        if (didMountRef.current && totalTables > 0 && currentTableIndex >= totalTables) {
            const validIndex = 0;
            setCurrentTableIndex(validIndex);
            if (typeof window !== 'undefined') {
                localStorage.setItem('sda2025_swp_tableIndex', validIndex.toString());
            }
        }
    }, [totalTables, currentTableIndex]);

    // Save to localStorage whenever index changes
    useEffect(() => {
        if (typeof window !== 'undefined' && didMountRef.current) {
            localStorage.setItem('sda2025_swp_tableIndex', currentTableIndex.toString());
        }
    }, [currentTableIndex]);

    // Handlers untuk navigasi
    const handlePrevious = () => {
        setCurrentTableIndex(prev => Math.max(0, prev - 1));
    };
    
    const handleNext = () => {
        setCurrentTableIndex(prev => Math.min(totalTables - 1, prev + 1));
    };
    
    const handleTableJump = (index) => {
        setCurrentTableIndex(index);
    };

    // Initialize saved index on mount (hanya sekali saat totalTables tersedia)
    useEffect(() => {
        if (totalTables > 0 && !didMountRef.current) {
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem('sda2025_swp_tableIndex');
                const savedIndex = saved !== null ? parseInt(saved, 10) : 0;
                const validIndex = savedIndex >= 0 && savedIndex < totalTables ? savedIndex : 0;
                
                // Update state dengan nilai yang valid
                setCurrentTableIndex(validIndex);
            }
            didMountRef.current = true;
        }
    }, [totalTables]); // Hanya depend pada totalTables

    // Scroll to table section when index changes (hanya setelah mount dan bukan saat init)
    useEffect(() => {
        if (!didMountRef.current) {
            return;
        }
        // Delay sedikit untuk memastikan render selesai
        const timeoutId = setTimeout(() => {
            if (tableSectionHeaderRef.current) {
                try {
                    tableSectionHeaderRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                } catch (e) {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
            }
        }, 100);
        
        return () => clearTimeout(timeoutId);
    }, [currentTableIndex]);

    return (
        <div className="space-y-12">
            {/* ============================================================
                SECTION 1: PROFIL BIDANG
                ============================================================ */}
            <section>
                <h2 className="text-3xl font-bold mb-6 text-zinc-900">
                   IV. 1 Bidang Sungai, Waduk, dan Pantai
                </h2>
                <SectionsRenderer sections={ProfilSWP} />
            </section>

            {/* ============================================================
                SECTION 2: WILAYAH SUNGAI
                ============================================================ */}
            {wsDataInfo && Object.keys(wsDataInfo).length > 0 && (
            <section>
                <h2 className="text-3xl font-bold mb-6 text-zinc-900">
                    {wsDataInfo.title || "IV. 2 Wilayah Sungai (WS)"}
                </h2>
                    
                {wsDataInfo.content && (
                        <p className="text-zinc-700 leading-relaxed text-justify mb-8">
                            {wsDataInfo.content}
                        </p>
                )}

                {wsDataInfo.kewenangan && wsDataInfo.kewenangan.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {wsDataInfo.kewenangan.map((item, idx) => (
                        <div key={idx} className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
                                    <h4 className="font-bold text-zinc-900 mb-3 border-b border-zinc-200 pb-2">
                                        {item.label}
                                    </h4>
                            <ul className="space-y-1">
                                {item.list && item.list.map((ws, i) => (
                                    <li key={i} className="flex items-center text-sm text-zinc-700">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                        {ws}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                )}

                {wsDataInfo.statistik && (
                <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-8 justify-around items-center text-center md:text-left">
                     <div>
                                <div className="text-3xl font-bold text-blue-600 font-mono">
                                    {wsDataInfo.statistik.catchmentArea || "-"}
                                </div>
                                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mt-1">
                                    Catchment Area (km²)
                                </div>
                     </div>
                     <div className="hidden md:block w-px h-16 bg-zinc-200"></div>
                     <div>
                                <div className="text-3xl font-bold text-blue-600 font-mono">
                                    {wsDataInfo.statistik.riverLength || "-"}
                                </div>
                                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mt-1">
                                    Panjang Sungai (km)
                                </div>
                     </div>
                </div>
                )}
            </section>
            )}

            {/* ============================================================
                SECTION 3: MATA AIR, WADUK, EMBUNG & TELAGA
                ============================================================ */}
      {tampunganData && Object.keys(tampunganData).length > 0 && (
                <section>
                    <h2 className="text-3xl font-bold mb-6 text-zinc-900">
          {tampunganData.title || "IV. 3 Mata Air, Waduk, Embung & Telaga"}
        </h2>

        {tampunganData.definition && (
        <div className="space-y-6">
                            <p className="text-zinc-700 leading-relaxed text-justify text-lg">
              {tampunganData.definition}
            </p>
        </div>
        )}
      </section>
      )}

            {/* ============================================================
                SECTION 4: TABEL 4.1 (TERPISAH DARI PAGINATION)
                ============================================================ */}
            {tabel41Pages && tabel41Pages.length > 0 && (
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold mb-6 text-zinc-900">
                        Tabel 4.1 Daftar Sungai Dalam Daerah Aliran Sungai pada Wilayah Sungai di Provinsi Jawa Timur
                    </h2>
                    
                    {/* Tabel 4.1 Content dengan pagination internal */}
                    <div className="bg-white rounded-lg shadow-sm">
                        {tabel41Pages[currentTabel41Index]?.component}
                    </div>

                    {/* Pagination Controls untuk Tabel 4.1 */}
                    {tabel41Pages.length > 1 && (
                        <div className="flex items-center justify-between mt-6 bg-white rounded-lg border border-zinc-200 px-4 py-2">
                            <button
                                onClick={() => setCurrentTabel41Index(prev => Math.max(0, prev - 1))}
                                disabled={currentTabel41Index === 0}
                                className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                                    currentTabel41Index === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-zinc-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-300'
                                }`}
                            >
                                &lt;
                            </button>

                            <div className="flex items-center space-x-1 flex-1 justify-center">
                                {tabel41Pages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentTabel41Index(idx)}
                                        className={`w-3 h-3 rounded-full transition-colors ${
                                            idx === currentTabel41Index 
                                                ? 'bg-blue-600' 
                                                : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentTabel41Index(prev => Math.min(tabel41Pages.length - 1, prev + 1))}
                                disabled={currentTabel41Index === tabel41Pages.length - 1}
                                className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                                    currentTabel41Index === tabel41Pages.length - 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                &gt;
                            </button>
                        </div>
                    )}

                    {tabel41Pages.length > 1 && (
                        <p className="text-zinc-600 text-xs text-center">
                            Halaman {currentTabel41Index + 1} dari {tabel41Pages.length}
                        </p>
                    )}
                </section>
            )}

            {/* ============================================================
                SECTION 5: TABEL INTERAKTIF (Tabel 4.2 - 4.9)
                ============================================================ */}
            {currentTable && totalTables > 0 ? (
            <section className="space-y-6">
                {/* Header dengan judul tabel aktif */}
                    <div ref={tableSectionHeaderRef}>
                        <h2 className="text-3xl font-bold mb-6 text-zinc-900">
                        {currentTable.title || "Tabel Data"}
                    </h2>
                </div>

                {/* Tabel Content */}
                <div className="bg-white rounded-lg shadow-sm">
                    {currentTable.component}
                </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between mt-6 bg-white rounded-lg border border-zinc-200 px-4 py-2">
                        {/* Button Sebelumnya */}
                    <button
                        onClick={handlePrevious}
                        disabled={safeTableIndex === 0}
                        className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                            safeTableIndex === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-zinc-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-300'
                        }`}
                    >
                        &lt;
                    </button>

                        {/* Dot Indicator */}
                    <div className="flex items-center space-x-1 flex-1 justify-center">
                        {tables.map((_, idx) => (
                            <button
                                key={idx}
                                    onClick={() => handleTableJump(idx)}
                                className={`w-3 h-3 rounded-full transition-colors ${
                                        idx === safeTableIndex 
                                            ? 'bg-blue-600' 
                                            : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            />
                        ))}
                    </div>

                        {/* Button Selanjutnya */}
                    <button
                        onClick={handleNext}
                        disabled={safeTableIndex === totalTables - 1}
                        className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                            safeTableIndex === totalTables - 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        &gt;
                    </button>
                </div>

                    {/* Quick Jump Navigation */}
                    <QuickJumpNavigation 
                        tables={tables} 
                        activeIndex={safeTableIndex} 
                        onJump={handleTableJump} 
                    />
            </section>
            ) : (
                <section className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800">Data tabel belum tersedia.</p>
                    </div>
                </section>
            )}

            {/* ============================================================
                SECTION 6: TABEL 4.10 DAFTAR WADUK (DENGAN PAGINATION INTERNAL)
                ============================================================ */}
            {tabel410Pages && tabel410Pages.length > 0 && (
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold mb-1 text-zinc-900">
                        {tabel410Pages[currentTabel410Index]?.title || "Tabel 4.10 Daftar Waduk"}
                    </h2>
                    
                    {/* Tabel 4.10 Content */}
                    <div className="bg-white rounded-lg shadow-sm -mt-2">
                        {tabel410Pages[currentTabel410Index]?.component}
                    </div>

                    {/* Pagination Controls untuk Tabel 4.10 */}
                    {tabel410Pages.length > 1 && (
                        <div className="flex items-center justify-between mt-6 bg-white rounded-lg border border-zinc-200 px-4 py-2">
                            <button
                                onClick={() => setCurrentTabel410Index(prev => Math.max(0, prev - 1))}
                                disabled={currentTabel410Index === 0}
                                className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                                    currentTabel410Index === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-zinc-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-300'
                                }`}
                            >
                                &lt;
                            </button>

                            <div className="flex items-center space-x-1 flex-1 justify-center">
                                {tabel410Pages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentTabel410Index(idx)}
                                        className={`w-3 h-3 rounded-full transition-colors ${
                                            idx === currentTabel410Index 
                                                ? 'bg-blue-600' 
                                                : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    />
                                ))}
                            </div>

                                    <button
                                onClick={() => setCurrentTabel410Index(prev => Math.min(tabel410Pages.length - 1, prev + 1))}
                                disabled={currentTabel410Index === tabel410Pages.length - 1}
                                className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                                    currentTabel410Index === tabel410Pages.length - 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                    >
                                &gt;
                                    </button>
                    </div>
                    )}

                    {tabel410Pages.length > 1 && (
                        <p className="text-zinc-600 text-xs text-center">
                            Halaman {currentTabel410Index + 1} dari {tabel410Pages.length}
                        </p>
                    )}

                    {/* Quick Jump Navigation untuk Tabel 4.10 */}
                    <QuickJumpNavigation 
                        tables={tabel410Pages} 
                        activeIndex={currentTabel410Index} 
                        onJump={setCurrentTabel410Index} 
                    />
                </section>
            )}

            {/* ============================================================
                SECTION 7: TABEL 4.11 DAFTAR TELAGA
                ============================================================ */}
            {allTelagaData && allTelagaData.length > 0 && (
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold mb-6 text-zinc-900">
                        Tabel 4.11 Daftar Telaga
                    </h2>
                    
                    {/* Tabel 4.11 Content */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <TableTelaga data={allTelagaData} startNumber={1} wsStartNumber={1} />
                    </div>
                </section>
            )}

            {/* ============================================================
                SECTION 8: TABEL 4.12 (MAINTENANCE)
                ============================================================ */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold mb-6 text-zinc-900">
                    Tabel 4.12
                </h2>
                
                {/* Maintenance Message */}
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 shadow-sm">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                                Data Sedang Dalam Proses
                            </h3>
                            <p className="text-yellow-800 leading-relaxed">
                                Mohon maaf, data belum tersedia secara lengkap. Proses entri data sedang berlangsung.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                SECTION 9: TABEL 4.13 DAFTAR REKAPITULASI TAMPUNGAN AIR TAHUN 2024
                ============================================================ */}
            {rekapitulasiTampunganAirData && rekapitulasiTampunganAirData.length > 0 ? (
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold mb-6 text-zinc-900">
                        Tabel 4.13 Daftar Rekapitulasi Tampungan Air Tahun 2024
                    </h2>
                    
                    {/* Tabel 4.13 Content */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <TableRekapitulasiTampunganAir data={rekapitulasiTampunganAirData} startNumber={1} wsStartNumber={1} />
                    </div>
                </section>
            ) : (
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold mb-6 text-zinc-900">
                        Tabel 4.13 Daftar Rekapitulasi Tampungan Air Tahun 2024
                    </h2>
                    
                    {/* Maintenance Message */}
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 shadow-sm">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                                    Data Sedang Dalam Proses
                                </h3>
                                <p className="text-yellow-800 leading-relaxed">
                                    Mohon maaf, data belum tersedia secara lengkap. Proses entri data sedang berlangsung.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================================
                SECTION     : TKPSDA PROVINSI JAWA TIMUR
                ============================================================ */}
      {tkpsdaData && Object.keys(tkpsdaData).length > 0 && (
                <section>
                    <h2 className="text-3xl font-bold mb-6 text-zinc-900 text-center">
            TKPSDA Wilayah Sungai Jawa Timur
            </h2>

        {/* Intro Text */}
        {tkpsdaData.content && (
                        <div className="prose max-w-none text-zinc-700 mb-12 text-center">
            <p className="text-lg leading-relaxed">{tkpsdaData.content}</p>
        </div>
        )}

                    {/* Tugas & Fungsi */}
        <div className="mb-16">
            {/* Bagian Tugas */}
            {tkpsdaData.tugas && tkpsdaData.tugas.length > 0 && (
            <div className="mb-12">
                                <h3 className="text-2xl font-bold text-zinc-900 mb-6">Tugas</h3>
                                <div className="bg-white border border-zinc-200 rounded-xl p-6 md:p-8 shadow-sm">
                                    <div className="space-y-2 text-zinc-700 text-lg leading-relaxed">
                        {tkpsdaData.tugas.map((t, i) => (
                           <p key={i}>{t}</p> 
                        ))}
                    </div>
                </div>
            </div>
            )}

            {/* Bagian Fungsi */}
            {tkpsdaData.fungsi && tkpsdaData.fungsi.length > 0 && (
            <div>
                                <h3 className="text-2xl font-bold text-zinc-900 mb-6">Fungsi</h3>
                                <p className="text-zinc-600 mb-6 text-lg">
                    TKPSDA dalam melaksanakan tugas sebagaimana dimaksud menyelenggarakan fungsi:
                </p>
                <div className="space-y-4">
                    {tkpsdaData.fungsi.map((f, i) => (
                        <div key={i} className="flex items-start">
                                            <span className="flex-shrink-0 w-8 text-lg font-medium text-zinc-400 select-none">
                                {i + 1}.
                             </span>
                                            <span className="text-lg text-zinc-700 leading-relaxed">
                                {f}
                             </span>
                        </div>
                    ))}
                </div>
            </div>
            )}
        </div>

                    {/* Detail Keanggotaan TKPSDA */}
        {tkpsdaData.detailWS && tkpsdaData.detailWS.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold text-zinc-800 mb-4">
                                Detail Keanggotaan TKPSDA
                            </h3>
                 <div className="space-y-2">
                    {tkpsdaData.detailWS.map((ws, index) => (
                        <WSDetailCard key={index} wsData={ws} />
                    ))}
                 </div>
                        </div>
        )}
            </section>
      )}
        </div>
    );
}