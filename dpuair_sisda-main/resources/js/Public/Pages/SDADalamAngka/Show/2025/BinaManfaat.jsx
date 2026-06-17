import React, { useState } from "react";
import { ProfilBinfat, RekomendasiTeknisAsetDanPenertiban, HimpunanPetaniPemakaiAir } from "@/data/SDADalamAngka/2025/binfat";
import SimpleTable from "@/Public/Pages/SDADalamAngka/Show/Components/SimpleTable";
import { Tabel5_1 } from "@/data/SDADalamAngka/2025/binfat_table5_1";
import { TabelGroups } from "@/data/SDADalamAngka/2025/binfat_tables";

export default function BinaManfaatContent() {
    const [currentPage, setCurrentPage] = useState(0);
    
    const parseDate = (str) => {
        if (!str) return 0;
        const d = Date.parse(str);
        return isNaN(d) ? 0 : d;
    };

    const groupsToRender = TabelGroups
        .filter(g => g && g.data && g.data.length > 0)
        .sort((a, b) => parseFloat(a.id) - parseFloat(b.id));

    const currentGroup = groupsToRender[currentPage] || null;

    // Table configurations for headers and rendering
    const tableConfigs = {
        '5.1': {
            headers: [
                { label: 'No.', align: 'center', width: '60px', key: 'no' },
                { label: 'Tanggal', align: 'left', width: '120px', key: 'tanggal' },
                { label: 'Lokasi', align: 'left', width: '200px', key: 'lokasi' },
                { label: 'Peruntukan', align: 'left', width: '150px', key: 'peruntukan' },
                { label: 'Masa Berlaku', align: 'center', width: '100px', key: 'masa_berlaku' },
                { label: 'UPT', align: 'left', width: '150px', key: 'upt' },
                { label: 'Korwil', align: 'left', width: '150px', key: 'korwil' }
            ],
            renderRow: (row, rowIndex) => [
                <td key="no" className="px-4 py-3 text-center text-zinc-700">{rowIndex + 1}</td>,
                <td key="tanggal" className="px-4 py-3 text-zinc-700">{row.tanggal}</td>,
                <td key="lokasi" className="px-4 py-3 text-zinc-700">{row.lokasi}</td>,
                <td key="peruntukan" className="px-4 py-3 text-zinc-700">{row.peruntukan}</td>,
                <td key="masa_berlaku" className="px-4 py-3 text-center text-zinc-700">{row.masa_berlaku}</td>,
                <td key="upt" className="px-4 py-3 text-zinc-700">{row.upt}</td>,
                <td key="korwil" className="px-4 py-3 text-zinc-700">{row.korwil}</td>
            ]
        },
        '5.2': {
            headers: [
                { label: 'No. SK', align: 'left', width: '120px', key: 'no_sk' },
                { label: 'Nama GHIPPA / HIPPA', align: 'left', width: '200px', key: 'nama' },
                { label: 'Luas (ha)', align: 'right', width: '100px', key: 'luas_ha' },
                { label: 'Jumlah Anggota', align: 'center', width: '100px', key: 'jumlah_anggota' },
                { label: 'Desa', align: 'left', width: '140px', key: 'desa' },
                { label: 'Kecamatan', align: 'left', width: '140px', key: 'kecamatan' },
                { label: 'Kab/Kota', align: 'left', width: '140px', key: 'kabupaten' },
                { label: 'DAS', align: 'left', width: '140px', key: 'das' },
                { label: 'Wilayah Sungai', align: 'left', width: '160px', key: 'wilayah_sungai' },
                { label: 'Tahun Berdiri', align: 'center', width: '100px', key: 'tahun_berdiri' }
            ],
            renderRow: (row) => [
                <td key="no_sk" className="px-4 py-3 text-zinc-700">{row.no_sk}</td>,
                <td key="nama" className="px-4 py-3 text-zinc-700">{row.nama}</td>,
                <td key="luas_ha" className="px-4 py-3 text-right text-zinc-700">{row.luas_ha}</td>,
                <td key="jumlah_anggota" className="px-4 py-3 text-center text-zinc-700">{row.jumlah_anggota}</td>,
                <td key="desa" className="px-4 py-3 text-zinc-700">{row.desa}</td>,
                <td key="kecamatan" className="px-4 py-3 text-zinc-700">{row.kecamatan}</td>,
                <td key="kabupaten" className="px-4 py-3 text-zinc-700">{row.kabupaten}</td>,
                <td key="das" className="px-4 py-3 text-zinc-700">{row.das}</td>,
                <td key="wilayah_sungai" className="px-4 py-3 text-zinc-700">{row.wilayah_sungai}</td>,
                <td key="tahun_berdiri" className="px-4 py-3 text-center text-zinc-700">{row.tahun_berdiri}</td>
            ]
        },
        '5.3': {
            headers: [
                { label: 'Tanggal', align: 'left', width: '140px', key: 'tanggal' },
                { label: 'Lokasi', align: 'left', width: '200px', key: 'lokasi' },
                { label: 'Keterangan', align: 'left', width: '250px', key: 'keterangan' },
                { label: '750 m', align: 'center', width: '80px', key: 'panjang_750_m' },
                { label: '500 m', align: 'center', width: '80px', key: 'panjang_500_m' },
                { label: '1500 m', align: 'center', width: '80px', key: 'panjang_1500_m' }
            ],
            renderRow: (row) => [
                <td key="tanggal" className="px-4 py-3 text-zinc-700">{row.tanggal}</td>,
                <td key="lokasi" className="px-4 py-3 text-zinc-700">{row.lokasi}</td>,
                <td key="keterangan" className="px-4 py-3 text-zinc-700">{row.keterangan}</td>,
                <td key="panjang_750_m" className="px-4 py-3 text-center text-zinc-700">{row.panjang_750_m}</td>,
                <td key="panjang_500_m" className="px-4 py-3 text-center text-zinc-700">{row.panjang_500_m}</td>,
                <td key="panjang_1500_m" className="px-4 py-3 text-center text-zinc-700">{row.panjang_1500_m}</td>
            ]
        },
        '5.4': {
            headers: [
                { label: 'No.', align: 'center', width: '60px', key: 'no' },
                { label: 'Wilayah Sungai', align: 'left', width: '200px', key: 'wilayah_sungai' },
                { label: 'Jenis Pelanggaran', align: 'left', width: '300px', key: 'jenis_pelanggaran' },
                { label: 'Terdampak', align: 'left', width: '200px', key: 'terdampak' }
            ],
            renderRow: (row) => [
                <td key="no" className="px-4 py-3 text-center text-zinc-700">{row.no}</td>,
                <td key="wilayah_sungai" className="px-4 py-3 text-zinc-700">{row.wilayah_sungai}</td>,
                <td key="jenis_pelanggaran" className="px-4 py-3 text-zinc-700">{row.jenis_pelanggaran}</td>,
                <td key="terdampak" className="px-4 py-3 text-zinc-700">{row.terdampak}</td>
            ]
        },
        '5.5': {
            headers: [
                { label: 'No.', align: 'center', width: '50px', key: 'no' },
                { label: 'Keterangan', align: 'left', width: '200px', key: 'keterangan' },
                { label: 'Jumlah (Buah)', align: 'center', width: '100px', key: 'jumlah_buah' },
                { label: 'Perolehan - Tanah', align: 'right', width: '120px', key: 'perolehan_tanah' },
                { label: 'Perolehan - Bangunan', align: 'right', width: '120px', key: 'perolehan_bangunan' },
                { label: 'Perolehan - Peralatan Proses/Produksi', align: 'right', width: '160px', key: 'perolehan_peralatan_proses' },
                { label: 'Perolehan - Perabotan', align: 'right', width: '120px', key: 'perolehan_perabotan' },
                { label: 'Perolehan - Kendaraan', align: 'right', width: '120px', key: 'perolehan_kendaraan' },
                { label: 'Perolehan - Lainnya', align: 'right', width: '120px', key: 'perolehan_lainnya' },
                { label: 'Akumulasi Penyusutan - Tanah', align: 'right', width: '140px', key: 'akumulasi_penyusutan_tanah' },
                { label: 'Akumulasi Penyusutan - Bangunan', align: 'right', width: '140px', key: 'akumulasi_penyusutan_bangunan' },
                { label: 'Akumulasi Penyusutan - Peralatan Proses/Produksi', align: 'right', width: '180px', key: 'akumulasi_penyusutan_peralatan_proses' },
                { label: 'Akumulasi Penyusutan - Perabotan', align: 'right', width: '140px', key: 'akumulasi_penyusutan_perabotan' },
                { label: 'Akumulasi Penyusutan - Kendaraan', align: 'right', width: '140px', key: 'akumulasi_penyusutan_kendaraan' },
                { label: 'Akumulasi Penyusutan - Lainnya', align: 'right', width: '140px', key: 'akumulasi_penyusutan_lainnya' },
                { label: 'Nilai Buku - Tanah', align: 'right', width: '120px', key: 'nilai_buku_tanah' },
                { label: 'Nilai Buku - Bangunan', align: 'right', width: '120px', key: 'nilai_buku_bangunan' },
                { label: 'Nilai Buku - Peralatan Proses/Produksi', align: 'right', width: '160px', key: 'nilai_buku_peralatan_proses' },
                { label: 'Nilai Buku - Perabotan', align: 'right', width: '120px', key: 'nilai_buku_perabotan' },
                { label: 'Nilai Buku - Kendaraan', align: 'right', width: '120px', key: 'nilai_buku_kendaraan' },
                { label: 'Nilai Buku - Lainnya', align: 'right', width: '120px', key: 'nilai_buku_lainnya' }
            ],
            renderRow: (row) => [
                <td key="no" className="px-4 py-3 text-center text-zinc-700">{row.no}</td>,
                <td key="keterangan" className="px-4 py-3 text-zinc-700">{row.keterangan}</td>,
                <td key="jumlah_buah" className="px-4 py-3 text-center text-zinc-700">{row.jumlah_buah}</td>,
                <td key="perolehan_tanah" className="px-4 py-3 text-right text-zinc-700">{row.perolehan_tanah}</td>,
                <td key="perolehan_bangunan" className="px-4 py-3 text-right text-zinc-700">{row.perolehan_bangunan}</td>,
                <td key="perolehan_peralatan_proses" className="px-4 py-3 text-right text-zinc-700">{row.perolehan_peralatan_proses}</td>,
                <td key="perolehan_perabotan" className="px-4 py-3 text-right text-zinc-700">{row.perolehan_perabotan}</td>,
                <td key="perolehan_kendaraan" className="px-4 py-3 text-right text-zinc-700">{row.perolehan_kendaraan}</td>,
                <td key="perolehan_lainnya" className="px-4 py-3 text-right text-zinc-700">{row.perolehan_lainnya}</td>,
                <td key="akumulasi_penyusutan_tanah" className="px-4 py-3 text-right text-zinc-700">{row.akumulasi_penyusutan_tanah}</td>,
                <td key="akumulasi_penyusutan_bangunan" className="px-4 py-3 text-right text-zinc-700">{row.akumulasi_penyusutan_bangunan}</td>,
                <td key="akumulasi_penyusutan_peralatan_proses" className="px-4 py-3 text-right text-zinc-700">{row.akumulasi_penyusutan_peralatan_proses}</td>,
                <td key="akumulasi_penyusutan_perabotan" className="px-4 py-3 text-right text-zinc-700">{row.akumulasi_penyusutan_perabotan}</td>,
                <td key="akumulasi_penyusutan_kendaraan" className="px-4 py-3 text-right text-zinc-700">{row.akumulasi_penyusutan_kendaraan}</td>,
                <td key="akumulasi_penyusutan_lainnya" className="px-4 py-3 text-right text-zinc-700">{row.akumulasi_penyusutan_lainnya}</td>,
                <td key="nilai_buku_tanah" className="px-4 py-3 text-right text-zinc-700">{row.nilai_buku_tanah}</td>,
                <td key="nilai_buku_bangunan" className="px-4 py-3 text-right text-zinc-700">{row.nilai_buku_bangunan}</td>,
                <td key="nilai_buku_peralatan_proses" className="px-4 py-3 text-right text-zinc-700">{row.nilai_buku_peralatan_proses}</td>,
                <td key="nilai_buku_perabotan" className="px-4 py-3 text-right text-zinc-700">{row.nilai_buku_perabotan}</td>,
                <td key="nilai_buku_kendaraan" className="px-4 py-3 text-right text-zinc-700">{row.nilai_buku_kendaraan}</td>,
                <td key="nilai_buku_lainnya" className="px-4 py-3 text-right text-zinc-700">{row.nilai_buku_lainnya}</td>
            ],
            totalFields: [
                'jumlah_buah', 'perolehan_tanah', 'perolehan_bangunan', 'perolehan_peralatan_proses',
                'perolehan_perabotan', 'perolehan_kendaraan', 'perolehan_lainnya',
                'akumulasi_penyusutan_tanah', 'akumulasi_penyusutan_bangunan', 'akumulasi_penyusutan_peralatan_proses',
                'akumulasi_penyusutan_perabotan', 'akumulasi_penyusutan_kendaraan', 'akumulasi_penyusutan_lainnya',
                'nilai_buku_tanah', 'nilai_buku_bangunan', 'nilai_buku_peralatan_proses',
                'nilai_buku_perabotan', 'nilai_buku_kendaraan', 'nilai_buku_lainnya'
            ]
        },
        '5.6': {
            headers: [
                { label: 'No.', align: 'center', width: '50px', key: 'no' },
                { label: 'UPT PSDA', align: 'left', width: '120px', key: 'upt_psda' },
                { label: 'Kab/Kota', align: 'left', width: '140px', key: 'kab_kota' },
                { label: 'Tgl/Tahun Dibuat', align: 'left', width: '120px', key: 'tgl_tahun_dibuat' },
                { label: 'Masa Berlaku', align: 'left', width: '100px', key: 'masa_berlaku' },
                { label: 'Irigasi', align: 'center', width: '60px', key: 'jenis_pks_irigasi' },
                { label: 'Sungai', align: 'center', width: '60px', key: 'jenis_pks_sungai' },
                { label: 'Lainnya', align: 'center', width: '60px', key: 'jenis_pks_lainnya' },
                { label: 'Jumlah', align: 'center', width: '60px', key: 'jumlah_pks' },
                { label: 'Ket', align: 'left', width: '120px', key: 'ket' },
                { label: 'Progress 2025', align: 'left', width: '140px', key: 'progress_th_2025' }
            ],
            renderRow: (row) => [
                <td key="no" className="px-4 py-3 text-center text-zinc-700">{row.no}</td>,
                <td key="upt_psda" className="px-4 py-3 text-zinc-700">{row.upt_psda}</td>,
                <td key="kab_kota" className="px-4 py-3 text-zinc-700">{row.kab_kota}</td>,
                <td key="tgl_tahun_dibuat" className="px-4 py-3 text-zinc-700">{row.tgl_tahun_dibuat}</td>,
                <td key="masa_berlaku" className="px-4 py-3 text-zinc-700">{row.masa_berlaku}</td>,
                <td key="jenis_pks_irigasi" className="px-4 py-3 text-center text-zinc-700">{row.jenis_pks_irigasi ? '✓' : '-'}</td>,
                <td key="jenis_pks_sungai" className="px-4 py-3 text-center text-zinc-700">{row.jenis_pks_sungai ? '✓' : '-'}</td>,
                <td key="jenis_pks_lainnya" className="px-4 py-3 text-center text-zinc-700">{row.jenis_pks_lainnya ? '✓' : '-'}</td>,
                <td key="jumlah_pks" className="px-4 py-3 text-center text-zinc-700">{row.jumlah_pks}</td>,
                <td key="ket" className="px-4 py-3 text-zinc-700">{row.ket}</td>,
                <td key="progress_th_2025" className="px-4 py-3 text-zinc-700">{row.progress_th_2025}</td>
            ]
        },
        '5.7': {
            headers: [
                { label: 'No.', align: 'center', width: '50px', key: 'no' },
                { label: 'Unit Kerja', align: 'left', width: '200px', key: 'unit_kerja' },
                { label: 'PNS Gol I', align: 'center', width: '100px', key: 'pns_gol_i' },
                { label: 'PNS Gol II', align: 'center', width: '100px', key: 'pns_gol_ii' },
                { label: 'PNS Gol III', align: 'center', width: '100px', key: 'pns_gol_iii' },
                { label: 'PNS Gol IV', align: 'center', width: '100px', key: 'pns_gol_iv' },
                { label: 'PPPK Gol V', align: 'center', width: '100px', key: 'pppk_gol_v' },
                { label: 'PPPK Gol VIII', align: 'center', width: '100px', key: 'pppk_gol_viii' },
                { label: 'PPPK Gol IX', align: 'center', width: '100px', key: 'pppk_gol_ix' },
                { label: 'Jumlah', align: 'center', width: '100px', key: 'jumlah' }
            ],
            renderRow: (row) => [
                <td key="no" className="px-4 py-3 text-center text-zinc-700">{row.no}</td>,
                <td key="unit_kerja" className="px-4 py-3 text-zinc-700">{row.unit_kerja}</td>,
                <td key="pns_gol_i" className="px-4 py-3 text-center text-zinc-700">{row.pns_gol_i}</td>,
                <td key="pns_gol_ii" className="px-4 py-3 text-center text-zinc-700">{row.pns_gol_ii}</td>,
                <td key="pns_gol_iii" className="px-4 py-3 text-center text-zinc-700">{row.pns_gol_iii}</td>,
                <td key="pns_gol_iv" className="px-4 py-3 text-center text-zinc-700">{row.pns_gol_iv}</td>,
                <td key="pppk_gol_v" className="px-4 py-3 text-center text-zinc-700">{row.pppk_gol_v}</td>,
                <td key="pppk_gol_viii" className="px-4 py-3 text-center text-zinc-700">{row.pppk_gol_viii}</td>,
                <td key="pppk_gol_ix" className="px-4 py-3 text-center text-zinc-700">{row.pppk_gol_ix}</td>,
                <td key="jumlah" className="px-4 py-3 text-center text-zinc-700">{row.jumlah}</td>
            ],
            totalFields: [
                'pns_gol_i', 'pns_gol_ii', 'pns_gol_iii', 'pns_gol_iv',
                'pppk_gol_v', 'pppk_gol_viii', 'pppk_gol_ix', 'jumlah'
            ]
        }
    };

    // Calculate total for tables that need it
    const calculateTotal = (data, group) => {
        if (!data || data.length === 0) return null;
        
        const config = tableConfigs[group.id];
        if (!config || !config.totalFields) return null;
        
        const total = { no: 'Total' };
        
        // Add unit_kerja or keterangan field if needed
        if (group.id === '5.5') total.keterangan = '';
        if (group.id === '5.7') total.unit_kerja = '';
        
        // Calculate sum for each field
        config.totalFields.forEach(field => {
            total[field] = data.reduce((sum, row) => sum + (row[field] || 0), 0);
        });
        
        return total;
    };

    // Sort data based on group configuration
    const sortedData = currentGroup ? [...currentGroup.data].sort((a, b) => {
        const va = a?.[currentGroup.sortBy || 'tanggal'];
        const vb = b?.[currentGroup.sortBy || 'tanggal'];
        const da = parseDate(va);
        const db = parseDate(vb);
        if (da && db) return da - db;
        if (!isNaN(Number(va)) && !isNaN(Number(vb))) return Number(va) - Number(vb);
        return String(va ?? '').localeCompare(String(vb ?? ''));
    }) : [];

    // Get headers for current table
    const getHeaders = (group) => {
        const config = tableConfigs[group.id];
        return config ? config.headers.map(({ label, align, width }) => ({ label, align, width })) : [];
    };

    // Render row for current table
    const renderRow = (row, group, rowIndex) => {
        const config = tableConfigs[group.id];
        return config ? config.renderRow(row, rowIndex) : [];
    };

    return (
        <div className="space-y-12">
            {/* Profil, Rekomendasi, HIPPA sections */}
            <section>
                <h2 className="text-3xl font-bold mb-6 text-zinc-900">V.1 Profil Bidang Bina Manfaat</h2>
                {ProfilBinfat.length > 0 ? (
                    <div className="space-y-8">
                        {ProfilBinfat.map((section, idx) => (
                            <div key={idx}>
                                {section.title && <h3 className="text-xl font-semibold text-zinc-800 border-l-4 border-blue-600 pl-4">{section.title}</h3>}
                                {section.content && <p className="text-zinc-700 leading-relaxed text-justify">{section.content}</p>}
                                {section.subSections && section.subSections.length > 0 && (
                                    <div className="ml-6 space-y-4">
                                        {section.subSections.map((sub, i) => (
                                            <div key={i} className="space-y-2">
                                                {sub.subTitle && <h4 className="text-lg font-semibold text-zinc-800">{sub.subTitle}</h4>}
                                                {sub.text && <p className="text-zinc-700 leading-relaxed text-justify">{sub.text}</p>}
                                                {sub.list && sub.list.length > 0 && (
                                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                                        {sub.list.map((item, idx2) => (
                                                            <li key={idx2} className="text-zinc-700 leading-relaxed">{item}</li>
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
                ) : (
                    <p className="text-zinc-500 italic">Data belum tersedia</p>
                )}
            </section>

            <section>
                <h2 className="text-3xl font-bold mb-6 text-zinc-900">V.2 Rekomendasi Teknis, Aset dan Penertiban</h2>
                {RekomendasiTeknisAsetDanPenertiban.length > 0 ? (
                    <div className="space-y-6">
                        {RekomendasiTeknisAsetDanPenertiban.map((section, idx) => (
                            <div key={idx}>
                                {section.title && <h3 className="text-xl font-semibold text-zinc-800">{section.title}</h3>}
                                {section.content && <p className="text-zinc-700 leading-relaxed text-justify">{section.content}</p>}
                                {section.subSections && section.subSections.length > 0 && (
                                    <div className="ml-6 space-y-4">
                                        {section.subSections.map((sub, i) => (
                                            <div key={i}>
                                                {sub.subTitle && <h4 className="text-lg font-semibold text-zinc-800">{sub.subTitle}</h4>}
                                                {sub.text && <p className="text-zinc-700 leading-relaxed">{sub.text}</p>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-zinc-500 italic">Data belum tersedia</p>
                )}
            </section>

            <section>
                <h2 className="text-3xl font-bold mb-6 text-zinc-900">V.3 Himpunan Petani Pemakai Air (HIPPA)</h2>
                {HimpunanPetaniPemakaiAir.length > 0 ? (
                    <div className="space-y-6">
                        {HimpunanPetaniPemakaiAir.map((section, idx) => (
                            <div key={idx}>
                                {section.title && <h3 className="text-xl font-semibold text-zinc-800">{section.title}</h3>}
                                {section.content && <p className="text-zinc-700 leading-relaxed text-justify">{section.content}</p>}
                                {section.subSections && section.subSections.length > 0 && (
                                    <div className="ml-6 space-y-4">
                                        {section.subSections.map((sub, i) => (
                                            <div key={i}>
                                                {sub.subTitle && <h4 className="text-lg font-semibold text-zinc-800">{sub.subTitle}</h4>}
                                                {sub.text && <p className="text-zinc-700 leading-relaxed">{sub.text}</p>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-zinc-500 italic">Data belum tersedia</p>
                )}
            </section>

            {/* Tables */}
            {currentGroup && (
                <section>
                    <SimpleTable
                        title={currentGroup.title}
                        headers={getHeaders(currentGroup)}
                        data={sortedData}
                        renderRow={(row, rowIndex) => renderRow(row, currentGroup, rowIndex)}
                        showTotal={currentGroup.id === '5.5' || currentGroup.id === '5.7'}
                        totalRow={calculateTotal(sortedData, currentGroup)}
                    />
                </section>
            )}

      {/* PAGINATION */}
        <div className="flex items-center justify-between mt-6 bg-white rounded-lg border border-gray-200 px-4 py-2">
        {/* Button Sebelumnya */}
        <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
            currentPage === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
            &lt;
        </button>

        {/* Dot Indicator (Persis seperti gambar) */}
        <div className="flex items-center space-x-2 flex-1 justify-center">
            {Array.from({ length: groupsToRender.length }, (_, index) => (
            <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`h-3 rounded-full transition-all duration-200 ${
                currentPage === index
                    ? 'bg-blue-600 w-8' // Titik aktif: biru dan lebih lebar
                    : 'bg-gray-300 w-3 hover:bg-gray-400' // Titik biasa: abu-abu dan kecil
                }`}
            />
            ))}
        </div>

        {/* Button Selanjutnya */}
        <button
            onClick={() => setCurrentPage(prev => Math.min(groupsToRender.length - 1, prev + 1))}
            disabled={currentPage === groupsToRender.length - 1}
            className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
            currentPage === groupsToRender.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
            &gt;
        </button>
        </div>
            {/* Table Navigation */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Langsung ke tabel:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {groupsToRender.map((group, idx) => (
                        <button
                            key={group.id}
                            onClick={() => setCurrentPage(idx)}
                            className={`px-4 py-2 rounded text-sm font-medium transition ${
                                currentPage === idx
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-zinc-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                        >
                            {group.title.replace('Tabel ', '').replace(' - ', ': ')}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}