import React, { useEffect, useRef, useState } from "react";
import {
    ProfilDinasPekerjaanUmumSumberDayaAirProvinsiJawaTimur,
    StrukturOrganisasi,
    DaftarPeraturanYangTerkaitDenganTugasDanFungsiDinas,
    DataKepegawaian,
    CapaianKinerjaOrganisasi,
    DataKepegawaianGolongan,
    DataKepegawaianPendidikan,
    DataKepegawaianDiklat,
    DataKepegawaianJabatan,
    DataKepegawaianUsia,
    DataCapaianKinerja,
    DataKepuasanMasyarakat,
    DataPrestasiOrganisasi
} from "@/data/SDADalamAngka/2025/sekretariat";
import Tabel, { renderCell, renderCells } from "../Components/Tabel";
import StrukturOrganisasiChart from "../Components/BaganOrganisasi";

export default function SekretariatContent() {
        // Reusable renderer for section arrays to avoid duplicate markup
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
                            {section.subSections && section.subSections.length > 0 && (
                                <div className="ml-6 space-y-4">
                                    {section.subSections.map((subSection, subIdx) => (
                                        <div key={subIdx} className="space-y-2">
                                            {subSection.subTitle && (
                                                <h4 className="text-lg font-semibold text-zinc-800">
                                                    {subSection.subTitle}
                                                </h4>
                                            )}
                                            {subSection.text && (
                                                <p className="text-zinc-700 leading-relaxed text-justify">
                                                    {subSection.text}
                                                </p>
                                            )}
                                            {subSection.list && subSection.list.length > 0 && (
                                                <ul className="list-disc list-inside space-y-1 ml-4">
                                                    {subSection.list.map((item, itemIdx) => (
                                                        <li key={itemIdx} className="text-zinc-700 leading-relaxed">
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            );
        };
    const [currentTableIndex, setCurrentTableIndex] = useState(0);
    const tableSectionHeaderRef = useRef(null);
    const didMountRef = useRef(false);

    // Daftar semua tabel dengan konten masing-masing
    const tables = [
        {
            id: "golongan",
            title: "1.6 Data Kepegawaian Berdasarkan Golongan",
            component: (
                <Tabel
                    headers={[
                        { label: "Unit Kerja", align: "left" },
                        { label: "PNS Gol I", align: "center" },
                        { label: "PNS Gol II", align: "center" },
                        { label: "PNS Gol III", align: "center" },
                        { label: "PNS Gol IV", align: "center" },
                        { label: "PPPK Gol V", align: "center" },
                        { label: "PPPK Gol VIII", align: "center" },
                        { label: "PPPK Gol IX", align: "center" },
                        { label: "Jumlah", align: "center" }
                    ]}
                    data={DataKepegawaianGolongan.filter(r => r.type !== "total")}
                    showNoColumn={true}
                    tableCaption="Data Kepegawaian Berdasarkan Golongan"
                    enablePagination={false}
                    renderRow={(row) => (
                        <>
                            {renderCell(row.unitKerja, 'bold')}
                            {renderCells(row, ['pns.gol1', 'pns.gol2', 'pns.gol3', 'pns.gol4', 'pppk.gol5', 'pppk.gol8', 'pppk.gol9'])}
                            {renderCell(row.jumlah, 'boldCenter')}
                        </>
                    )}
                    totalData={DataKepegawaianGolongan.find(r => r.type === "total")}
                    renderTotalRow={(total) => (
                        <>
                            {renderCell("Total", 'total', { colSpan: 2 })}
                            {renderCells(total, ['pns.gol1', 'pns.gol2', 'pns.gol3', 'pns.gol4', 'pppk.gol5', 'pppk.gol8', 'pppk.gol9'], 'totalCenter')}
                            {renderCell(total.totalKeseluruhan, 'totalBoldCenter')}
                        </>
                    )}
                />
            )
        },
        {
            id: "pendidikan",
            title: "1.7 Data Kepegawaian Berdasarkan Tingkat Pendidikan",
            component: (
                <Tabel
                    headers={[
                        { label: "Unit Kerja", align: "left" },
                        { label: "PNS SD", align: "center" },
                        { label: "PNS SMP", align: "center" },
                        { label: "PNS SMA", align: "center" },
                        { label: "PNS D3", align: "center" },
                        { label: "PNS D4", align: "center" },
                        { label: "PNS S1", align: "center" },
                        { label: "PNS S2", align: "center" },
                        { label: "PNS S3", align: "center" },
                        { label: "PNS Total", align: "center" },
                        { label: "PPPK SD", align: "center" },
                        { label: "PPPK SMP", align: "center" },
                        { label: "PPPK SMA", align: "center" },
                        { label: "PPPK D3", align: "center" },
                        { label: "PPPK D4", align: "center" },
                        { label: "PPPK S1", align: "center" },
                        { label: "PPPK S2", align: "center" },
                        { label: "PPPK S3", align: "center" },
                        { label: "PPPK Total", align: "center" }
                    ]}
                    data={DataKepegawaianPendidikan.filter(r => r.type !== "total")}
                    showNoColumn={true}
                    tableCaption="Data Kepegawaian Berdasarkan Tingkat Pendidikan"
                    enablePagination={false}
                    renderRow={(row) => (
                        <>
                            {renderCell(row.unitKerja, 'bold')}
                            {renderCells(row, ['pns.sd', 'pns.smp', 'pns.sma', 'pns.d3', 'pns.d4', 'pns.s1', 'pns.s2', 'pns.s3'])}
                            {renderCell(row.pns.total, 'boldCenter')}
                            {renderCells(row, ['pppk.sd', 'pppk.smp', 'pppk.sma', 'pppk.d3', 'pppk.d4', 'pppk.s1', 'pppk.s2', 'pppk.s3'])}
                            {renderCell(row.pppk.total, 'boldCenter')}
                        </>
                    )}
                    totalData={DataKepegawaianPendidikan.find(r => r.type === "total")}
                    renderTotalRow={(total) => (
                        <>
                            {renderCell("Total", 'total', { colSpan: 2 })}
                            {renderCells(total, ['pns.sd', 'pns.smp', 'pns.sma', 'pns.d3', 'pns.d4', 'pns.s1', 'pns.s2', 'pns.s3'], 'totalCenter')}
                            {renderCell(total.pns.total, 'totalBoldCenter')}
                            {renderCells(total, ['pppk.sd', 'pppk.smp', 'pppk.sma', 'pppk.d3', 'pppk.d4', 'pppk.s1', 'pppk.s2', 'pppk.s3'], 'totalCenter')}
                            {renderCell(total.pppk.total, 'totalBoldCenter')}
                        </>
                    )}
                />
            )
        },
        {
            id: "diklat",
            title: "1.8 Data Kepegawaian Berdasarkan Diklat Struktural",
            component: (
                <Tabel
                    headers={[
                        { label: "Unit Kerja", align: "left" },
                        { label: "PIM II", align: "center" },
                        { label: "PIM III", align: "center" },
                        { label: "PIM IV", align: "center" },
                        { label: "Diklat Fungsional", align: "center" }
                    ]}
                    data={DataKepegawaianDiklat.filter(r => r.type !== "total")}
                    showNoColumn={true}
                    tableCaption="Data Kepegawaian Berdasarkan Diklat Struktural"
                    enablePagination={false}
                    renderRow={(row) => (
                        <>
                            {renderCell(row.unitKerja, 'bold')}
                            {renderCells(row, ['diklatStruktural.pim2', 'diklatStruktural.pim3', 'diklatStruktural.pim4'])}
                            {renderCell(row.diklatFungsional, 'boldCenter')}
                        </>
                    )}
                    totalData={DataKepegawaianDiklat.find(r => r.type === "total")}
                    renderTotalRow={(total) => (
                        <>
                            {renderCell("Total", 'total', { colSpan: 2 })}
                            {renderCells(total, ['diklatStruktural.pim2', 'diklatStruktural.pim3', 'diklatStruktural.pim4'], 'totalCenter')}
                            {renderCell(total.diklatFungsional, 'totalBoldCenter')}
                        </>
                    )}
                />
            )
        },
        ...DataKepegawaianJabatan.map((kategoriData, index) => ({
            id: `jabatan-${index}`,
            title: `1.9 Data Kepegawaian Berdasarkan Nama Jabatan - ${kategoriData.kategori}`,
            component: (
                <div className="overflow-x-auto">
                    <Tabel
                        headers={[
                            { label: "Nama Jabatan", align: "left", minWidth: "250px" },
                            { label: "Sekretariat", align: "center" },
                            { label: "Bid. Bina Manfaat", align: "center" },
                            { label: "Bid. Irigasi", align: "center" },
                            { label: "Bid. PSDA", align: "center" },
                            { label: "Bid. Sungai Waduk", align: "center" },
                            { label: "UPT Kediri", align: "center" },
                            { label: "UPT Bojonegoro", align: "center" },
                            { label: "UPT Bondowoso", align: "center" },
                            { label: "UPT Lumajang", align: "center" },
                            { label: "UPT Pasuruan", align: "center" },
                            { label: "UPT Pamekasan", align: "center" },
                            { label: "Jumlah", align: "center" }
                        ]}
                        data={kategoriData.data}
                        showNoColumn={true}
                        tableCaption={`Data Kepegawaian - ${kategoriData.kategori}`}
                        enablePagination={false}
                        renderRow={(row) => (
                            <>
                                {renderCell(row.jabatan, 'bold')}
                                {renderCells(row, [
                                    'sekretariat', 
                                    'binaManfaat', 
                                    'irigasi', 
                                    'psda', 
                                    'sungaiWadukPantai',
                                    'uptKediri',
                                    'uptBojonegoro',
                                    'uptBondowoso',
                                    'uptLumajang',
                                    'uptPasuruan',
                                    'uptPamekasan'
                                ])}
                                {renderCell(row.jumlah, 'boldCenter')}
                            </>
                        )}
                        totalData={kategoriData.totalBaris}
                        renderTotalRow={(total) => (
                            <>
                                {renderCell("Total", 'total', { colSpan: 2 })}
                                {renderCells(total, [
                                    'sekretariat', 
                                    'binaManfaat', 
                                    'irigasi', 
                                    'psda', 
                                    'sungaiWadukPantai',
                                    'uptKediri',
                                    'uptBojonegoro',
                                    'uptBondowoso',
                                    'uptLumajang',
                                    'uptPasuruan',
                                    'uptPamekasan'
                                ], 'totalCenter')}
                                {renderCell(total.total, 'totalBoldCenter')}
                            </>
                        )}
                    />
                </div>
            )
        })),
        {
            id: "usia",
            title: "1.10 Data Kepegawaian Berdasarkan Usia Pegawai Tahun 2024",
            component: (
                <Tabel
                    headers={[
                        { label: "Unit Kerja", align: "left" },
                        { label: "< 20 Tahun", align: "center" },
                        { label: "21-30 Tahun", align: "center" },
                        { label: "31-40 Tahun", align: "center" },
                        { label: "41-50 Tahun", align: "center" },
                        { label: "51-60 Tahun", align: "center" },
                        { label: "> 60 Tahun", align: "center" },
                        { label: "Jumlah", align: "center" }
                    ]}
                    data={DataKepegawaianUsia.filter(r => r.type !== "total")}
                    showNoColumn={false}
                    tableCaption="Data Kepegawaian Berdasarkan Usia"
                    enablePagination={false}
                    renderRow={(row) => (
                        <>
                            {renderCell(row.unitKerja, 'bold')}
                            {renderCells(row, [
                                'usia.u20', 
                                'usia.u21_30', 
                                'usia.u31_40', 
                                'usia.u41_50', 
                                'usia.u51_60', 
                                'usia.u60plus'
                            ])}
                            {renderCell(row.jumlah, 'boldCenter')}
                        </>
                    )}
                    totalData={DataKepegawaianUsia.find(r => r.type === "total")}
                    renderTotalRow={(total) => (
                        <>
                            {renderCell("TOTAL", 'totalBoldCenter')}
                            {renderCells(total, [
                                'usia.u20', 
                                'usia.u21_30', 
                                'usia.u31_40', 
                                'usia.u41_50', 
                                'usia.u51_60', 
                                'usia.u60plus'
                            ], 'totalCenter')}
                            {renderCell(total.jumlah, 'totalBoldCenter')}
                        </>
                    )}
                />
            )
        },
        {
            id: "capaian-kinerja",
            title: "1.11 Capaian Kinerja Organisasi Tahun 2024",
            component: (
                <div className="overflow-x-auto">
                    <Tabel
                        headers={[
                            { label: "No", align: "center", width: "50px" },
                            { label: "Sasaran Strategis", align: "left", width: "250px" },
                            { label: "Indikator Kinerja", align: "left", width: "250px" },
                            { label: "Target (%)", align: "center" },
                            { label: "Realisasi (%)", align: "center" },
                            { label: "Capaian (%)", align: "center" },
                            { label: "Perspektif", align: "center" }
                        ]}
                        data={DataCapaianKinerja}
                        showNoColumn={false}
                        tableCaption="Capaian Kinerja Organisasi Tahun 2024"
                        enablePagination={false}
                        renderRow={(row, index) => {
                            const isSameAsPrev = index > 0 && DataCapaianKinerja[index - 1].no === row.no;
                            return (
                                <>
                                    <td className="p-2 border text-center font-bold align-top">
                                        {!isSameAsPrev ? row.no : ""}
                                    </td>
                                    <td className="p-2 border text-left align-top"> 
                                        {!isSameAsPrev ? row.sasaran : ""}
                                    </td>
                                    {renderCell(row.indikator, 'left')}
                                    {renderCell(row.target, 'center')}
                                    {renderCell(row.realisasi, 'center')}
                                    {renderCell(row.capaian, 'boldCenter')}
                                    {renderCell(row.perspektif, 'center')}
                                </>
                            );
                        }}
                    />
                </div>
            )
        },
        ...DataKepuasanMasyarakat.map((triwulanData, index) => ({
            id: `kepuasan-${index}`,
            title: `1.12 Penilaian Kepuasan Masyarakat - ${triwulanData.periode}`,
            component: (
                <Tabel
                    headers={[
                        { label: "No", align: "center", width: "50px" },
                        { label: "Unit Kerja", align: "left" },
                        { label: "Jumlah Responden", align: "center" },
                        { label: "Nilai SKM (%)", align: "center" },
                        { label: "Mutu Pelayanan", align: "center" }
                    ]}
                    data={triwulanData.rows}
                    showNoColumn={false}
                    tableCaption={`Tabel Kepuasan Masyarakat - ${triwulanData.periode}`}
                    enablePagination={false}
                    renderRow={(row) => (
                        <>
                            {renderCell(row.no, 'center')}
                            {renderCell(row.unitKerja, 'left')}
                            {renderCell(row.jumlahResponden, 'center')}
                            {renderCell(row.nilaiSKM, 'center')}
                            {renderCell(row.mutu, 'center')}
                        </>
                    )}
                    totalData={triwulanData.total}
                    renderTotalRow={(total) => (
                        <>
                            {renderCell("Total", 'totalBoldCenter', { colSpan: 2 })}
                            {renderCell(total.jumlahResponden, 'totalBoldCenter')}
                            {renderCell(total.nilaiSKM, 'totalBoldCenter')}
                            {renderCell(total.mutu, 'totalBoldCenter')}
                        </>
                    )}
                />
            )
        })),
        {
            id: "prestasi",
            title: "1.13 Prestasi Organisasi",
            component: (
                <div className="overflow-x-auto">
                    <Tabel
                        headers={[
                            { label: "No", align: "center", width: "50px" },
                            { label: "Nama Penghargaan", align: "left", width: "300px" },
                            { label: "Predikat", align: "center" },
                            { label: "Asal Penghargaan", align: "left" },
                            { label: "Nomor", align: "left" },
                            { label: "Tanggal", align: "center" }
                        ]}
                        data={DataPrestasiOrganisasi}
                        showNoColumn={false}
                        tableCaption="Daftar Prestasi Organisasi"
                        enablePagination={false}
                        renderRow={(row) => (
                            <>
                                {renderCell(row.no, 'center')}
                                {renderCell(row.namaPenghargaan, 'left')}
                                {renderCell(row.predikat, 'boldCenter')}
                                {renderCell(row.asalPenghargaan, 'left')}
                                {renderCell(row.nomor, 'left')}
                                {renderCell(row.tanggal, 'center')}
                            </>
                        )}
                    />
                </div>
            )
        }
    ];

    const currentTable = tables[currentTableIndex];
    const totalTables = tables.length;

    const handlePrevious = () => {
        setCurrentTableIndex(prev => (prev > 0 ? prev - 1 : prev));
    };

    const handleNext = () => {
        setCurrentTableIndex(prev => (prev < totalTables - 1 ? prev + 1 : prev));
    };

    // Auto scroll to the top of the tables section whenever the active table changes
    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true;
            return;
        }
        if (tableSectionHeaderRef.current) {
            try {
                tableSectionHeaderRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            } catch (e) {
                // Fallback for environments where scrollIntoView might fail
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    }, [currentTableIndex]);

    return (
        <div className="space-y-12">
            {/* Profil Dinas */}
            <section>
                <h2 className="text-3xl font-bold mb-6 text-zinc-900">
                    1.1 Profil Dinas Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur
                </h2>
                <SectionsRenderer sections={ProfilDinasPekerjaanUmumSumberDayaAirProvinsiJawaTimur} />
            </section>

            {/* Struktur Organisasi */}
            <section>
                <h2 className="text-3xl font-bold mb-6 text-zinc-900">
                    1.2 Struktur Organisasi
                </h2>
                <SectionsRenderer sections={StrukturOrganisasi} />
            </section>

            {/* Daftar Peraturan */}
            <section>
                <h2 className="text-3xl font-bold mb-6 text-zinc-900">
                    1.3 Daftar Peraturan Yang Terkait Dengan Tugas Dan Fungsi Dinas
                </h2>
                {DaftarPeraturanYangTerkaitDenganTugasDanFungsiDinas.length > 0 ? (
                    <ol className="space-y-2">
                        {DaftarPeraturanYangTerkaitDenganTugasDanFungsiDinas.map((peraturan, idx) => (
                            <li key={idx} className="text-zinc-700 leading-relaxed text-justify">
                                {peraturan}
                            </li>
                        ))}
                    </ol>
                ) : (
                    <p className="text-zinc-500 italic">Data belum tersedia</p>
                )}
            </section>

            {/* Data Kepegawaian */}
            <section>
                <h2 className="text-3xl font-bold mb-6 text-zinc-900">
                    1.4 Data Kepegawaian
                </h2>
                {DataKepegawaian.length > 0 ? (
                    <div className="space-y-4">
                        {DataKepegawaian.map((paragraph, idx) => (
                            <p key={idx} className="text-zinc-700 leading-relaxed text-justify">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                ) : (
                    <p className="text-zinc-500 italic">Data belum tersedia</p>
                )}
            </section>

            {/* Capaian Kinerja */}
            <section>
                <h2 className="text-3xl font-bold mb-6 text-zinc-900">
                    1.5 Capaian Kinerja Organisasi
                </h2>
                {CapaianKinerjaOrganisasi.length > 0 ? (
                    <div className="space-y-4">
                        {CapaianKinerjaOrganisasi.map((paragraph, idx) => (
                            <p key={idx} className="text-zinc-700 leading-relaxed text-justify">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                ) : (
                    <p className="text-zinc-500 italic">Data belum tersedia</p>
                )}
            </section>

            {/* Bagan Visual Struktur Organisasi */}
            <StrukturOrganisasiChart />

            {/* Container untuk Semua Tabel dengan Pagination */}
            <section className="space-y-6">
                {/* Header dengan judul tabel aktif */}
                <div ref={tableSectionHeaderRef} >
                    <h2 className="text-xl font-semibold">
                        {currentTable.title}
                    </h2>
                    <p className="text-black text-xs mt-1.5">
                        Tabel {currentTableIndex + 1} dari {totalTables}
                    </p>
                </div>

                {/* Tabel Content */}
                <div className="bg-white rounded-lg shadow-sm">
                    {currentTable.component}
                </div>

                {/* PAGINATION */}
                <div className="flex items-center justify-between mt-6 bg-white rounded-lg border border-gray-200 px-4 py-2">
                    {/* Button Sebelumnya */}
                    <button
                        onClick={handlePrevious}
                        disabled={currentTableIndex === 0}
                        className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                            currentTableIndex === 0
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
                                onClick={() => setCurrentTableIndex(idx)}
                                className={`w-3 h-3 rounded-full transition-colors ${
                                    idx === currentTableIndex ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            />
                        ))}
                    </div>

                    {/* Button Selanjutnya */}
                    <button
                        onClick={handleNext}
                        disabled={currentTableIndex === totalTables - 1}
                        className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                            currentTableIndex === totalTables - 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        &gt;
                    </button>
                </div>

                {/* Quick Jump */}
                <div className="bg-zinc-50 p-3 rounded-md border border-zinc-200">
                    <p className="text-xs font-medium text-zinc-700 mb-2.5">Langsung ke tabel:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5">
                        {tables.map((table, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentTableIndex(idx)}
                                className={`text-left px-2.5 py-1.5 rounded-md text-xs transition-all ${
                                    idx === currentTableIndex
                                        ? 'bg-blue-600 text-white font-medium shadow'
                                        : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
                                }`}
                            >
                                {(table.title || '').length > 30 ? (table.title || '').substring(0, 30) + '...' : (table.title || '')}
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
