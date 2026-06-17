import React, { useState } from "react";
// Pastikan path import sesuai dengan lokasi file data Anda
import { 
  ProfilBidangIrigasi, 
  DaerahIrigasiDanIndeksKinerjaSistemIrigasi 
} from "@/data/SDADalamAngka/2025/irigasi";
import { Tabel3_1 } from "@/data/SDADalamAngka/2025/irigasi_table3_1";
import { Tabel3_2 } from "@/data/SDADalamAngka/2025/irigasi_table3_2";
import { Tabel3_3 } from "@/data/SDADalamAngka/2025/irigasi_table3_3";
import { Tabel3_4 } from "@/data/SDADalamAngka/2025/irigasi_table3_4";
import { Tabel3_5, Tabel3_5_Metadata } from "@/data/SDADalamAngka/2025/irigasi_table3_5";
import { Tabel3_6, Tabel3_6_Metadata } from "@/data/SDADalamAngka/2025/irigasi_table3_6";
import { Tabel3_7, Tabel3_7_Metadata } from "@/data/SDADalamAngka/2025/irigasi_table3_7";
import { Tabel3_8, Tabel3_8_Metadata } from "@/data/SDADalamAngka/2025/irigasi_table3_8";
import { Tabel3_9, Tabel3_9_Metadata } from "@/data/SDADalamAngka/2025/irigasi_table3_9";
import { Tabel3_10, Tabel3_10_Metadata } from "@/data/SDADalamAngka/2025/irigasi_table3_10";
import { Tabel3_11, Tabel3_11_Metadata } from "@/data/SDADalamAngka/2025/irigasi_table3_11";
import { Tabel3_12, Tabel3_12_Metadata } from "@/data/SDADalamAngka/2025/irigasi_table3_12";
import { Tabel3_13, Tabel3_13_Metadata } from "@/data/SDADalamAngka/2025/irigasi_table3_13";
import { Tabel3_14, Tabel3_14_Metadata } from "@/data/SDADalamAngka/2025/irigasi_table3_14";
import { Tabel3_15, Tabel3_15_Metadata } from "@/data/SDADalamAngka/2025/irigasi_table3_15";

// Import komponen baru
import IrigasiTableStyle from "@/Public/Pages/SDADalamAngka/Show/Components/IrigasiTableStyle";

export default function IrigasiPage() {
  const profilData = ProfilBidangIrigasi[0];
  const daerahIrigasiData = DaerahIrigasiDanIndeksKinerjaSistemIrigasi[0];
  const iksiData = DaerahIrigasiDanIndeksKinerjaSistemIrigasi[1];

  const groupsToRender = [
    { id: '3.1', title: 'Tabel 3.1: Daftar Rekapitulasi Daerah Irigasi Permukaan Di Provinsi Jawa Timur', data: Tabel3_1 },
    { id: '3.2', title: 'Tabel 3.2: Daftar Rekapitulasi Daerah Irigasi Tambak di Provinsi Jawa Timur', data: Tabel3_2 },
    { id: '3.3', title: 'Tabel 3.3: Daftar Rekapitulasi Daerah Irigasi Air Tanah di Provinsi Jawa Timur', data: Tabel3_3 },
    { id: '3.4', title: 'Tabel 3.4: Rekapitulasi Daerah Irigasi di Provinsi Jawa Timur', data: Tabel3_4 },
    { id: '3.5', title: 'Tabel 3.5: Distribusi Tugas Irigasi di Provinsi Jawa Timur', data: Tabel3_5, metadata: Tabel3_5_Metadata },
    { id: '3.6', title: 'Tabel 3.6: Daerah Irigasi di Provinsi Jawa Timur', data: Tabel3_6, metadata: Tabel3_6_Metadata },
    { id: '3.7', title: 'Tabel 3.7: Daerah Irigasi di Kabupaten/Kota', data: Tabel3_7, metadata: Tabel3_7_Metadata },
    { id: '3.8', title: 'Tabel 3.8: Daerah Irigasi Berdasarkan Kabupaten/Kota', data: Tabel3_8, metadata: Tabel3_8_Metadata },
    { id: '3.9', title: 'Tabel 3.9: Luasan Irigasi Berdasarkan Wilayah', data: Tabel3_9, metadata: Tabel3_9_Metadata },
    { id: '3.10', title: 'Tabel 3.10: Koordinat Lokasi Irigasi', data: Tabel3_10, metadata: Tabel3_10_Metadata },
    { id: '3.11', title: 'Tabel 3.11: Kondisi Bangunan Irigasi', data: Tabel3_11, metadata: Tabel3_11_Metadata },
    { id: '3.12', title: 'Tabel 3.12: Kondisi Bangunan Irigasi Pada Jaringan Provinsi', data: Tabel3_12, metadata: Tabel3_12_Metadata },
    { id: '3.13', title: 'Tabel 3.13: Jumlah Ketersediaan dan Penempatan Operasional Setiap Unit Kerja', data: Tabel3_13, metadata: Tabel3_13_Metadata },
    { id: '3.14', title: 'Tabel 3.14: Jenis Kendaraan', data: Tabel3_14, metadata: Tabel3_14_Metadata },
    { id: '3.15', title: 'Tabel 3.15: Kegiatan dan Volume', data: Tabel3_15, metadata: Tabel3_15_Metadata },
  ];

  const [currentPage, setCurrentPage] = useState(0);

  const currentGroup = groupsToRender[currentPage] || null;

  // Render row untuk setiap tabel
  const renderRow = (row, group) => {
    if (group.id === '3.1') {
      return [
        <td key="no" className="px-4 py-3 text-center text-zinc-700">{row.no}</td>,
        <td key="wilayah_sungai" className="px-4 py-3 text-zinc-700">{row.wilayah_sungai}</td>,
        <td key="provinsi_total" className="px-4 py-3 text-right text-zinc-700">{row.irigasi_kewenangan.provinsi.total}</td>,
        <td key="kab_kota_unitas" className="px-4 py-3 text-right text-zinc-700">{row.irigasi_kewenangan.kab_kota.unit_kab_kota}</td>,
        <td key="pusat_jumlah" className="px-4 py-3 text-right text-zinc-700">{row.irigasi_kewenangan.pusat.jumlah}</td>,
        <td key="provinsi_ha_total" className="px-4 py-3 text-right text-zinc-700">{row.kewenangan_ha.provinsi.total}</td>,
        <td key="kab_kota_ha_unitas" className="px-4 py-3 text-right text-zinc-700">{row.kewenangan_ha.kab_kota.unit_kab_kota}</td>,
        <td key="pusat_ha_jumlah" className="px-4 py-3 text-right text-zinc-700">{row.kewenangan_ha.pusat.jumlah}</td>,
        <td key="total_ha" className="px-4 py-3 text-right text-zinc-700">{row.total_ha}</td>
      ];
    }
    if (group.id === '3.2') {
      return [
        <td key="no" className="px-4 py-3 text-center text-zinc-700">{row.no}</td>,
        <td key="wilayah_sungai" className="px-4 py-3 text-zinc-700">{row.wilayah_sungai}</td>,
        <td key="kurang_1000_uruh" className="px-4 py-3 text-right text-zinc-700">{row.tambak.kurang_1000.uruh_kab_kota.jumlah}</td>,
        <td key="kurang_1000_unitas_kab" className="px-4 py-3 text-right text-zinc-700">{row.tambak.kurang_1000.uruh_kab_kota.unitas_kab_kota}</td>,
        <td key="kurang_1000_jumlah_unitas" className="px-4 py-3 text-right text-zinc-700">{row.tambak.kurang_1000.uruh_kab_kota.jumlah_unitas}</td>,
        <td key="kurang_1000_provinsi" className="px-4 py-3 text-right text-zinc-700">{row.tambak.kurang_1000.unitas_provinsi.jumlah}</td>,
        <td key="lebih_3000_uruh" className="px-4 py-3 text-right text-zinc-700">{row.tambak.lebih_3000.uruh_kab_kota.jumlah}</td>,
        <td key="lebih_3000_unitas_kab" className="px-4 py-3 text-right text-zinc-700">{row.tambak.lebih_3000.uruh_kab_kota.unitas_kab_kota}</td>,
        <td key="lebih_3000_jumlah_unitas" className="px-4 py-3 text-right text-zinc-700">{row.tambak.lebih_3000.uruh_kab_kota.jumlah_unitas}</td>,
        <td key="lebih_3000_provinsi" className="px-4 py-3 text-right text-zinc-700">{row.tambak.lebih_3000.unitas_provinsi.jumlah}</td>
      ];
    }
    if (group.id === '3.3') {
      return [
        <td key="no" className="px-4 py-3 text-center text-zinc-700">{row.no}</td>,
        <td key="wilayah_sungai" className="px-4 py-3 text-zinc-700">{row.wilayah_sungai}</td>,
        <td key="kurang_1000_uruh" className="px-4 py-3 text-right text-zinc-700">{row.air_tanah.kurang_1000.uruh_kab_kota.jumlah}</td>,
        <td key="kurang_1000_unitas_kab" className="px-4 py-3 text-right text-zinc-700">{row.air_tanah.kurang_1000.uruh_kab_kota.unitas_kab_kota}</td>,
        <td key="kurang_1000_jumlah_unitas" className="px-4 py-3 text-right text-zinc-700">{row.air_tanah.kurang_1000.uruh_kab_kota.jumlah_unitas}</td>,
        <td key="kurang_1000_provinsi" className="px-4 py-3 text-right text-zinc-700">{row.air_tanah.kurang_1000.unitas_provinsi.jumlah}</td>,
        <td key="lebih_3000_uruh" className="px-4 py-3 text-right text-zinc-700">{row.air_tanah.lebih_3000.uruh_kab_kota.jumlah}</td>,
        <td key="lebih_3000_unitas_kab" className="px-4 py-3 text-right text-zinc-700">{row.air_tanah.lebih_3000.uruh_kab_kota.unitas_kab_kota}</td>,
        <td key="lebih_3000_jumlah_unitas" className="px-4 py-3 text-right text-zinc-700">{row.air_tanah.lebih_3000.uruh_kab_kota.jumlah_unitas}</td>,
        <td key="lebih_3000_provinsi" className="px-4 py-3 text-right text-zinc-700">{row.air_tanah.lebih_3000.unitas_provinsi.jumlah}</td>
      ];
    }
    if (group.id === '3.4') {
      return [
        <td key="wilayah_sungai" className="px-4 py-3 text-zinc-700">{row.wilayah_sungai}</td>,
        <td key="kab_kota" className="px-4 py-3 text-right text-zinc-700">{row.kewenangan.kab_kota}</td>,
        <td key="provinsi" className="px-4 py-3 text-right text-zinc-700">{row.kewenangan.provinsi}</td>,
        <td key="pusat" className="px-4 py-3 text-right text-zinc-700">{row.kewenangan.pusat}</td>,
        <td key="jumlah" className="px-4 py-3 text-right text-zinc-700">{row.kewenangan.jumlah}</td>
      ];
    }
   if (group.id === '3.5') {
      return [
        <td key="no" className="px-4 py-3 text-center text-zinc-700">{row.no}</td>,
        <td key="wilayah_sungai" className="px-4 py-3 text-zinc-700">{row.wilayah_sungai}</td>,
        <td key="jumlah_petugas" className="px-4 py-3 text-center text-zinc-700">
          {typeof row.jumlah_petugas === 'number' || typeof row.jumlah_petugas === 'string' ? row.jumlah_petugas : '-'}
        </td>,
        <td key="selesai" className="px-4 py-3 text-center text-zinc-700">
          {typeof row.status?.selesai === 'number' || typeof row.status?.selesai === 'string' ? row.status.selesai : '-'}
        </td>,
        <td key="proses" className="px-4 py-3 text-center text-zinc-700">
          {typeof row.status?.proses === 'number' || typeof row.status?.proses === 'string' ? row.status.proses : '-'}
        </td>,
        <td key="tertunda" className="px-4 py-3 text-center text-zinc-700">
          {typeof row.status?.tertunda === 'number' || typeof row.status?.tertunda === 'string' ? row.status.tertunda : '-'}
        </td>,
        <td key="prioritas" className="px-4 py-3 text-center text-zinc-700">
          {typeof row.prioritas === 'number' || typeof row.prioritas === 'string' ? row.prioritas : '-'}
        </td>
      ];
    }
    if (group.id === '3.6') {
      return [
        <td key="no" className="px-4 py-3 text-center text-zinc-700">{row.no}</td>,
        <td key="provinsi_kab_kota" className="px-4 py-3 text-zinc-700">{row.provinsi_kab_kota}</td>,
        <td key="daerah_irigasi" className="px-4 py-3 text-zinc-700">{row.daerah_irigasi}</td>,
        <td key="luasan_ha" className="px-4 py-3 text-right text-zinc-700">{row.luasan_ha.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>,
        <td key="keterangan" className="px-4 py-3 text-zinc-700">{row.keterangan}</td>
      ];
    }
    if (group.id === '3.7') {
      return [
        <td key="no" className="px-4 py-3 text-center text-zinc-700">{row.no}</td>,
        <td key="provinsi_kab_kota" className="px-4 py-3 text-zinc-700">{row.provinsi_kab_kota}</td>,
        <td key="desa_kelurahan" className="px-4 py-3 text-zinc-700">{row.desa_kelurahan}</td>,
        <td key="jumlah" className="px-4 py-3 text-center text-zinc-700">{row.jumlah}</td>,
        <td key="luasan_ha" className="px-4 py-3 text-right text-zinc-700">{row.luasan_ha.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>,
        <td key="keterangan" className="px-4 py-3 text-zinc-700">{row.keterangan}</td>
      ];
    }
     if (group.id === '3.8') {
      return [
        <td key="no" className="px-4 py-3 text-center text-zinc-700">{row.no}</td>,
        <td key="daerah_irigasi" className="px-4 py-3 text-zinc-700">{row.daerah_irigasi}</td>,
        <td key="jumlah" className="px-4 py-3 text-center text-zinc-700">{row.jumlah}</td>,
        <td key="luasan_ha" className="px-4 py-3 text-right text-zinc-700">
          {typeof row.luasan_ha === 'number' ? row.luasan_ha.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : '-'}
        </td>,
        <td key="kabupaten_kota" className="px-4 py-3 text-zinc-700">{row.kabupaten_kota ? row.kabupaten_kota.join(', ') : ''}</td>,
        <td key="keterangan" className="px-4 py-3 text-zinc-700">{row.keterangan}</td>
      ];
    }
    if (group.id === '3.9') {
      return [
        <td key="no" className="px-4 py-3 text-center text-zinc-700">{row.no}</td>,
        <td key="wilayah" className="px-4 py-3 text-zinc-700">{row.wilayah}</td>,
        <td key="koordinat" className="px-4 py-3 text-center text-zinc-700">{row.koordinat ? `${row.koordinat.lat}, ${row.koordinat.long}` : '-'}</td>,
        <td key="kurang_1000" className="px-4 py-3 text-right text-zinc-700">
          {typeof row.kurang_1000 === 'number' ? row.kurang_1000.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
        </td>,
        <td key="antara_1000_3000" className="px-4 py-3 text-right text-zinc-700">
          {typeof row.antara_1000_3000 === 'number' ? row.antara_1000_3000.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
        </td>,
        <td key="lebih_3000" className="px-4 py-3 text-right text-zinc-700">
          {typeof row.lebih_3000 === 'number' ? row.lebih_3000.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
        </td>,
        <td key="total" className="px-4 py-3 text-right text-zinc-700">
          {typeof row.total === 'number' ? row.total.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
        </td>
      ];
    }
    if (group.id === '3.10') {
      return [
        <td key="no" className="px-4 py-3 text-center text-zinc-700">{row.no}</td>,
        <td key="wilayah" className="px-4 py-3 text-zinc-700">{row.wilayah}</td>,
        <td key="koordinat_bt" className="px-4 py-3 text-center text-zinc-700">{row.koordinat_bt}</td>,
        <td key="koordinat_dms" className="px-4 py-3 text-center text-zinc-700">{row.koordinat_dms}</td>,
        <td key="lokasi_desa" className="px-4 py-3 text-zinc-700">{row.lokasi_desa}</td>,
        <td key="lokasi_kecamatan" className="px-4 py-3 text-zinc-700">{row.lokasi_kecamatan}</td>,
        <td key="lokasi_kabupaten" className="px-4 py-3 text-zinc-700">{row.lokasi_kabupaten}</td>,
        <td key="nilai_1" className="px-4 py-3 text-right text-zinc-700">{row.nilai_1 ? row.nilai_1.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</td>,
        <td key="nilai_2" className="px-4 py-3 text-right text-zinc-700">{row.nilai_2 ? row.nilai_2.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</td>,
        <td key="nilai_3" className="px-4 py-3 text-right text-zinc-700">{row.nilai_3 ? row.nilai_3.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</td>
      ];
    }
    if (group.id === '3.11') {
      return [
        <td key="no" className="px-4 py-3 text-center text-zinc-700">{row.no}</td>,
        <td key="lokasi" className="px-4 py-3 text-zinc-700">{row.lokasi}</td>,
        <td key="panjang_m" className="px-4 py-3 text-right text-zinc-700">{row.panjang_m ? row.panjang_m.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</td>,
        <td key="kapasitas_l_per_s" className="px-4 py-3 text-right text-zinc-700">{row.kapasitas_l_per_s ? row.kapasitas_l_per_s.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</td>,
        <td key="kondisi" className="px-4 py-3 text-center text-zinc-700">{row.kondisi || '-'}</td>,
        <td key="tahun_pembangunan" className="px-4 py-3 text-center text-zinc-700">{row.tahun_pembangunan || '-'}</td>,
        <td key="keterangan" className="px-4 py-3 text-zinc-700">{row.keterangan || '-'}</td>
      ];
    }
    if (group.id === '3.12') {
      return [
        <td key="no" className="px-4 py-3 text-center text-zinc-700">{row.no}</td>,
        <td key="das" className="px-4 py-3 text-zinc-700">{row.das}</td>,
        <td key="bendungan_baik" className="px-4 py-3 text-center text-zinc-700">{row.bendungan.baik}</td>,
        <td key="bendungan_rusak_ringan" className="px-4 py-3 text-center text-zinc-700">{row.bendungan.rusak_ringan}</td>,
        <td key="bendungan_rusak_berat" className="px-4 py-3 text-center text-zinc-700">{row.bendungan.rusak_berat}</td>,
        <td key="bendungan_jumlah" className="px-4 py-3 text-center text-zinc-700">{row.bendungan.jumlah}</td>,
        <td key="bangunan_bagi_baik" className="px-4 py-3 text-center text-zinc-700">{row.bangunan_bagi.baik}</td>,
        <td key="bangunan_bagi_rusak_ringan" className="px-4 py-3 text-center text-zinc-700">{row.bangunan_bagi.rusak_ringan}</td>,
        <td key="bangunan_bagi_rusak_berat" className="px-4 py-3 text-center text-zinc-700">{row.bangunan_bagi.rusak_berat}</td>,
        <td key="bangunan_bagi_jumlah" className="px-4 py-3 text-center text-zinc-700">{row.bangunan_bagi.jumlah}</td>,
        <td key="bangunan_sadap_baik" className="px-4 py-3 text-center text-zinc-700">{row.bangunan_sadap.baik}</td>,
        <td key="bangunan_sadap_rusak_ringan" className="px-4 py-3 text-center text-zinc-700">{row.bangunan_sadap.rusak_ringan}</td>,
        <td key="bangunan_sadap_rusak_berat" className="px-4 py-3 text-center text-zinc-700">{row.bangunan_sadap.rusak_berat}</td>,
        <td key="bangunan_sadap_jumlah" className="px-4 py-3 text-center text-zinc-700">{row.bangunan_sadap.jumlah}</td>,
        <td key="bangunan_pelengkap_baik" className="px-4 py-3 text-center text-zinc-700">{row.bangunan_pelengkap.baik}</td>,
        <td key="bangunan_pelengkap_rusak_ringan" className="px-4 py-3 text-center text-zinc-700">{row.bangunan_pelengkap.rusak_ringan}</td>,
        <td key="bangunan_pelengkap_rusak_berat" className="px-4 py-3 text-center text-zinc-700">{row.bangunan_pelengkap.rusak_berat}</td>,
        <td key="bangunan_pelengkap_jumlah" className="px-4 py-3 text-center text-zinc-700">{row.bangunan_pelengkap.jumlah}</td>
      ];
    }
    if (group.id === '3.13') {
      return [
        <td key="unitKerja" className="px-4 py-3 text-zinc-700">{row.unitKerja}</td>,
        <td key="kebutuhan" className="px-4 py-3 text-center text-zinc-700">{row.kebutuhan}</td>,
        <td key="staf" className="px-4 py-3 text-center text-zinc-700">{row.staf}</td>,
        <td key="pengawas" className="px-4 py-3 text-center text-zinc-700">{row.pengawas}</td>,
        <td key="pengawasPemula" className="px-4 py-3 text-center text-zinc-700">{row.pengawasPemula}</td>,
        <td key="juruUkur" className="px-4 py-3 text-center text-zinc-700">{row.juruUkur}</td>,
        <td key="juruUkurPemula" className="px-4 py-3 text-center text-zinc-700">{row.juruUkurPemula}</td>,
        <td key="mandor" className="px-4 py-3 text-center text-zinc-700">{row.mandor}</td>,
        <td key="pelaksana" className="px-4 py-3 text-center text-zinc-700">{row.pelaksana}</td>,
        <td key="pelaksanaPemula" className="px-4 py-3 text-center text-zinc-700">{row.pelaksanaPemula}</td>,
        <td key="total" className="px-4 py-3 text-center text-zinc-700">{row.total}</td>
      ];
    }
    if (group.id === '3.14') {
      return [
        <td key="metric" className="px-4 py-3 text-zinc-700">{row.metric}</td>,
        <td key="peroduaMyvi" className="px-4 py-3 text-center text-zinc-700">{row.peroduaMyvi}</td>,
        <td key="protonSaga" className="px-4 py-3 text-center text-zinc-700">{row.protonSaga}</td>,
        <td key="peroduaAxia" className="px-4 py-3 text-center text-zinc-700">{row.peroduaAxia}</td>,
        <td key="toyotaVios" className="px-4 py-3 text-center text-zinc-700">{row.toyotaVios}</td>,
        <td key="hondaCity" className="px-4 py-3 text-center text-zinc-700">{row.hondaCity}</td>,
        <td key="toyotaHilux" className="px-4 py-3 text-center text-zinc-700">{row.toyotaHilux}</td>,
        <td key="toyotaInnova" className="px-4 py-3 text-center text-zinc-700">{row.toyotaInnova}</td>,
        <td key="hondaCRV" className="px-4 py-3 text-center text-zinc-700">{row.hondaCRV}</td>,
        <td key="jumlah" className="px-4 py-3 text-center text-zinc-700">{row.jumlah}</td>
      ];
    }
    if (group.id === '3.15') {
      return [
        <td key="kodeKegiatan" className="px-4 py-3 text-center text-zinc-700">{row.kodeKegiatan || '-'}</td>,
        <td key="kegiatan" className="px-4 py-3 text-zinc-700">{row.kegiatan}</td>,
        <td key="volume" className="px-4 py-3 text-right text-zinc-700">{row.volume ? row.volume.toLocaleString('id-ID') : '-'}</td>,
        <td key="satuan" className="px-4 py-3 text-center text-zinc-700">{row.satuan}</td>
      ];
    }
    return [];
  };

  // Headers untuk setiap tabel
  const getHeaders = (group) => {
    if (group.id === '3.1') {
      return [
        { label: 'No.', align: 'center', width: '60px' },
        { label: 'Wilayah Sungai / UPT PSDA / Kabupaten/Kota', align: 'left', width: '200px' },
        { label: 'Provinsi', align: 'right', width: '80px' },
        { label: 'Unit Kab/Kota', align: 'right', width: '80px' },
        { label: 'Jumlah', align: 'right', width: '80px' },
        { label: 'Provinsi', align: 'right', width: '80px' },
        { label: 'Unit Kab/Kota', align: 'right', width: '80px' },
        { label: 'Jumlah', align: 'right', width: '80px' },
        { label: 'Jumlah', align: 'right', width: '80px' }
      ];
    }
    if (group.id === '3.2') {
      return [
        { label: 'No.', align: 'center', width: '60px' },
        { label: 'Wilayah Sungai / UPT PSDA / Kabupaten / Kota', align: 'left', width: '200px' },
        { label: 'Uruh Kab/Kota', align: 'right', width: '80px' },
        { label: 'Unitas Kab/Kota', align: 'right', width: '80px' },
        { label: 'Jumlah', align: 'right', width: '80px' },
        { label: 'Unitas Provinsi', align: 'right', width: '80px' },
        { label: 'Uruh Kab/Kota', align: 'right', width: '80px' },
        { label: 'Unitas Kab/Kota', align: 'right', width: '80px' },
        { label: 'Jumlah', align: 'right', width: '80px' },
        { label: 'Unitas Provinsi', align: 'right', width: '80px' }
      ];
    }
    if (group.id === '3.3') {
      return [
        { label: 'No.', align: 'center', width: '60px' },
        { label: 'Wilayah Sungai / UPT PSDA / Kabupaten / Kota', align: 'left', width: '200px' },
        { label: 'Uruh Kab/Kota', align: 'right', width: '80px' },
        { label: 'Unitas Kab/Kota', align: 'right', width: '80px' },
        { label: 'Jumlah', align: 'right', width: '80px' },
        { label: 'Unitas Provinsi', align: 'right', width: '80px' },
        { label: 'Uruh Kab/Kota', align: 'right', width: '80px' },
        { label: 'Unitas Kab/Kota', align: 'right', width: '80px' },
        { label: 'Jumlah', align: 'right', width: '80px' },
        { label: 'Unitas Provinsi', align: 'right', width: '80px' }
      ];
    }
    if (group.id === '3.4') {
      return [
        { label: 'Wilayah Sungai / Jenis Irigasi', align: 'left', width: '200px' },
        { label: 'Kab./Kota', align: 'right', width: '80px' },
        { label: 'Provinsi', align: 'right', width: '80px' },
        { label: 'Pusat', align: 'right', width: '80px' },
        { label: 'Jumlah', align: 'right', width: '80px' }
      ];
    }
    if (group.id === '3.5') {
      return [
        { label: 'No.', align: 'center', width: '60px' },
        { label: 'Wilayah Sungai', align: 'left', width: '150px' },
        { label: 'Jumlah Petugas', align: 'center', width: '80px' },
        { label: 'Selesai', align: 'center', width: '60px' },
        { label: 'Proses', align: 'center', width: '60px' },
        { label: 'Tertunda', align: 'center', width: '60px' },
        { label: 'Prioritas', align: 'center', width: '80px' }
      ];
    }
    if (group.id === '3.6') {
      return [
        { label: 'No.', align: 'center', width: '60px' },
        { label: 'Provinsi/Kabupaten/Kota', align: 'left', width: '200px' },
        { label: 'Daerah Irigasi', align: 'left', width: '200px' },
        { label: 'Luasan (Ha)', align: 'right', width: '100px' },
        { label: 'Keterangan', align: 'left', width: '200px' }
      ];
    }
    if (group.id === '3.7') {
      return [
        { label: 'NO', align: 'center', width: '60px' },
        { label: 'Provinsi/Kabupaten/Kota', align: 'left', width: '200px' },
        { label: 'Desa/Kelurahan', align: 'left', width: '200px' },
        { label: 'Jumlah', align: 'center', width: '80px' },
        { label: 'Luasan (Ha)', align: 'right', width: '100px' },
        { label: 'Keterangan', align: 'left', width: '200px' }
      ];
    }
    if (group.id === '3.8') {
      return [
        { label: 'NO', align: 'center', width: '60px' },
        { label: 'Daerah Irigasi', align: 'left', width: '200px' },
        { label: 'Jumlah', align: 'center', width: '80px' },
        { label: 'Luasan (Ha)', align: 'right', width: '100px' },
        { label: 'Kabupaten/Kota', align: 'left', width: '200px' },
        { label: 'Keterangan', align: 'left', width: '200px' }
      ];
    }
    if (group.id === '3.9') {
      return [
        { label: 'No.', align: 'center', width: '60px' },
        { label: 'Wilayah', align: 'left', width: '150px' },
        { label: 'Koordinat', align: 'center', width: '150px' },
        { label: '< 1000 Ha', align: 'right', width: '100px' },
        { label: '1000 - 3000 Ha', align: 'right', width: '100px' },
        { label: '> 3000 Ha', align: 'right', width: '100px' },
        { label: 'Total', align: 'right', width: '100px' }
      ];
    }
    if (group.id === '3.10') {
      return [
        { label: 'No.', align: 'center', width: '60px' },
        { label: 'Wilayah', align: 'left', width: '150px' },
        { label: 'BT', align: 'center', width: '80px' },
        { label: 'DMS', align: 'center', width: '80px' },
        { label: 'Desa', align: 'left', width: '150px' },
        { label: 'Kecamatan', align: 'left', width: '150px' },
        { label: 'Kabupaten', align: 'left', width: '150px' },
        { label: 'Nilai 1', align: 'right', width: '80px' },
        { label: 'Nilai 2', align: 'right', width: '80px' },
        { label: 'Nilai 3', align: 'right', width: '80px' }
      ];
    }
    if (group.id === '3.11') {
      return [
        { label: 'No.', align: 'center', width: '60px' },
        { label: 'Lokasi', align: 'left', width: '200px' },
        { label: 'Panjang (m)', align: 'right', width: '100px' },
        { label: 'Kapasitas (l/s)', align: 'right', width: '100px' },
        { label: 'Kondisi', align: 'center', width: '80px' },
        { label: 'Tahun Pembangunan', align: 'center', width: '100px' },
        { label: 'Keterangan', align: 'left', width: '200px' }
      ];
    }
    if (group.id === '3.12') {
      return [
        { label: 'No.', align: 'center', width: '60px' },
        { label: 'DAS', align: 'left', width: '150px' },
        { label: 'Baik', align: 'center', width: '60px' },
        { label: 'Rusak Ringan', align: 'center', width: '80px' },
        { label: 'Rusak Berat', align: 'center', width: '80px' },
        { label: 'Jumlah', align: 'center', width: '60px' },
        { label: 'Baik', align: 'center', width: '60px' },
        { label: 'Rusak Ringan', align: 'center', width: '80px' },
        { label: 'Rusak Berat', align: 'center', width: '80px' },
        { label: 'Jumlah', align: 'center', width: '60px' },
        { label: 'Baik', align: 'center', width: '60px' },
        { label: 'Rusak Ringan', align: 'center', width: '80px' },
        { label: 'Rusak Berat', align: 'center', width: '80px' },
        { label: 'Jumlah', align: 'center', width: '60px' },
        { label: 'Baik', align: 'center', width: '60px' },
        { label: 'Rusak Ringan', align: 'center', width: '80px' },
        { label: 'Rusak Berat', align: 'center', width: '80px' },
        { label: 'Jumlah', align: 'center', width: '60px' }
      ];
    }
    if (group.id === '3.13') {
      return [
        { label: 'Unit Kerja', align: 'left', width: '200px' },
        { label: 'Kebutuhan', align: 'center', width: '80px' },
        { label: 'Staf', align: 'center', width: '80px' },
        { label: 'Pengawas', align: 'center', width: '80px' },
        { label: 'Pengawas Pemula', align: 'center', width: '100px' },
        { label: 'Juru Ukur', align: 'center', width: '80px' },
        { label: 'Juru Ukur Pemula', align: 'center', width: '100px' },
        { label: 'Mandor', align: 'center', width: '80px' },
        { label: 'Pelaksana', align: 'center', width: '80px' },
        { label: 'Pelaksana Pemula', align: 'center', width: '100px' },
        { label: 'Total', align: 'center', width: '80px' }
      ];
    }
    if (group.id === '3.14') {
      return [
        { label: 'Jenis Kendaraan', align: 'left', width: '200px' },
        { label: 'Perodua Myvi', align: 'center', width: '80px' },
        { label: 'Proton Saga', align: 'center', width: '80px' },
        { label: 'Perodua Axia', align: 'center', width: '80px' },
        { label: 'Toyota Vios', align: 'center', width: '80px' },
        { label: 'Honda City', align: 'center', width: '80px' },
        { label: 'Toyota Hilux', align: 'center', width: '80px' },
        { label: 'Toyota Innova', align: 'center', width: '80px' },
        { label: 'Honda CR-V', align: 'center', width: '80px' },
        { label: 'Jumlah', align: 'center', width: '80px' }
      ];
    }
    if (group.id === '3.15') {
      return [
        { label: 'Kode Kegiatan', align: 'center', width: '100px' },
        { label: 'Kegiatan', align: 'left', width: '200px' },
        { label: 'Volume', align: 'center', width: '80px' },
        { label: 'Satuan', align: 'center', width: '80px' }
      ];
    }
    return [];
  };

  return (
    <div className="space-y-12">
      {/* SECTION 1: PROFIL BIDANG IRIGASI */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-zinc-900">V.1 Profil Bidang Irigasi</h2>
        {profilData && profilData.content ? (
            <div className="space-y-8">
                <p className="text-zinc-700 leading-relaxed text-justify">{profilData.content}</p>
                {profilData.subSections && profilData.subSections.length > 0 && (
                    <div className="ml-6 space-y-4">
                        {profilData.subSections.map((sub, i) => (
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
        ) : (
            <p className="text-zinc-500 italic">Data belum tersedia</p>
        )}
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-zinc-900">V.2 Rekomendasi Teknis, Aset dan Penertiban</h2>
        {daerahIrigasiData && daerahIrigasiData.content ? (
            <div className="space-y-6">
                <p className="text-zinc-700 leading-relaxed text-justify">{daerahIrigasiData.content}</p>
                {daerahIrigasiData.kewenangan && daerahIrigasiData.kewenangan.length > 0 && (
                    <div className="space-y-10 mb-12">
                       {daerahIrigasiData.kewenangan.map((item, index) => (
                         <div key={index}>
                           <div className="border-l-[4px] border-blue-700 pl-4 mb-4">
                              <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">
                                  {item.label}
                              </h3>
                           </div>
                           
                           <div className="space-y-3">
                              <p className="text-lg font-medium text-gray-800">
                                {item.value}
                              </p>
                              <p className="text-gray-600 text-lg leading-relaxed">
                                {item.description}
                              </p>
                           </div>
                         </div>
                       ))}
                    </div>
                )}
                {daerahIrigasiData.statistik && (
                    <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                       <div className="border-l-[4px] border-gray-900 pl-4 mb-8">
                          <h4 className="text-xl font-bold text-gray-900">
                            {daerahIrigasiData.statistik.title}
                          </h4>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          {daerahIrigasiData.statistik.items.map((stat, idx) => (
                            <div key={idx} className="flex flex-col">
                              <span className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                                {stat.value}
                              </span>
                              <span className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-widest">
                                {stat.label}
                              </span>
                            </div>
                          ))}
                       </div>
                    </div>
                )}
            </div>
        ) : (
            <p className="text-zinc-500 italic">Data belum tersedia</p>
        )}
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-zinc-900">V.3 Himpunan Petani Pemakai Air (HIPPA)</h2>
        {iksiData && iksiData.content ? (
            <div className="space-y-6">
                <p className="text-zinc-700 leading-relaxed text-justify">{iksiData.content}</p>
                
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <p className="font-bold text-gray-900 mb-4 uppercase tracking-wide text-sm">
                        {iksiData.subTitle}:
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {iksiData.list.map((item, idx) => (
                        <span key={idx} className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-200 shadow-sm">
                            {item}
                        </span>
                        ))}
                    </div>
                </div>
            </div>
        ) : (
            <p className="text-zinc-500 italic">Data belum tersedia</p>
        )}
      </section>

      {/* TABEL 3.1 SAMPAI 3.15 */}
      {currentGroup && (
        <IrigasiTableStyle
          title={currentGroup.title}
          headers={getHeaders(currentGroup)}
          data={currentGroup.data}
          renderRow={(row) => renderRow(row, currentGroup)}
          metadata={currentGroup.metadata}
        />
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
          
      {/* NAVIGASI TABEL */}
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
      {/* --- SECTION: V.4 KOMISI IRIGASI PROVINSI JAWA TIMUR (KOMIR) --- */}
      <section className="mt-12 border-t border-zinc-200 pt--10">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-32px font-bold text-zinc-900 mb-4">V.4 Komisi Irigasi Provinsi Jawa Timur (KOMIR)</h2>
          <p className="text-zinc-700 leading-relaxed mb-4">
            Komisi Irigasi adalah Lembaga atau institusi koordinasi dan komunikasi antara pemerintah dengan wakil petani, pemakai air serta pengguna jaringan irigasi lainnya dalam pengelolaan irigasi.
          </p>
          <p className="text-zinc-700 leading-relaxed mb-4">
            Tujuan dibentuknya komisi irigasi adalah Mewujudkan pengelolaan irigasi yang partisipatif, Meningkatkan koordinasi antar-sektor, Memberikan masukan dalam perumusan kebijakan, Meningkatkan efisiensi dan keberlanjutan pengelolaan irigasi, Menguatkan kelembagaan petani pemakai air dan Mendukung tercapainya ketahanan pangan daerah dan nasional.
          </p>
          <p className="text-zinc-700 leading-relaxed mb-4">
            Sedangkan pada tahun 2025 Komisi Irigasi Provinsi Jawa Timur melaksanakan revitalisasi dan dalam proses penjaringan sekaligus tanda tangan SK Gubernur Provinsi Jawa Timur. Untuk ke anggotan Komisi Irigasi periode tahun 2022-2025 telah beranggotakan 72 anggota, dengan komposisi 36 anggota dari unsur Pemerintah dan 36 dari unsur non Pemerintah, dengan nomor Keputusan Gubernur Jawa Timur (Nomor 188/497/KPTS/013/2022).
          </p>

          <div className="space-y-6 mt-6">
            <h3 className="text-25px font-semibold text-zinc-800 mb-3">A. Daftar Anggota Komisi Irigasi Periode 2022-2025</h3>

            <div className="pl-4 space-y-4">
              <h4 className="text-xl font-semibold text-zinc-800 mb-2">1. Pengurus</h4>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Ketua → Kepala Badan Perencanaan Pembangunan Provinsi Jawa Timur</li>
                <li>Ketua Harian → Kepala Dinas Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur</li>
                <li>Sekretaris I → Kepala Bidang Irigasi Dinas Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur</li>
                <li>Sekretaris II → Kepala Sarana dan Prasarana Pertanian Dinas Pertanian dan Ketahanan Pangan Provinsi Jawa Timur</li>
              </ol>

              <h4 className="text-xl font-semibold text-zinc-800 mb-2">2. Anggota dari Unsur Pemerintah</h4>
              <ol className="list-decimal pl-5 space-y-1" start="5">
                <li>Kepala Balai Besar Wilayah Sungai Brantas</li>
                <li>Kepala Balai Besar Wilayah Sungai Bengawan Solo</li>
                <li>Kepala Biro Administrasi Pembangunan Sekretariat Daerah Provinsi Jawa Timur</li>
                <li>Kepala Dinas Kelautan dan Perikanan Provinsi Jawa Timur</li>
                <li>Kepala Dinas Pekerjaan Umum Sumber Daya Air Kabupaten Lamongan</li>
                <li>Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Nganjuk</li>
                <li>Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Kediri</li>
                <li>Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Probolinggo</li>
                <li>Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Situbondo</li>
                <li>Kepala Dinas Bina Marga, Sumber Daya Air dan Bina Konstruksi Kabupaten Bondowoso</li>
                <li>Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Madiun</li>
                <li>Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Magetan</li>
                <li>Kepala Dinas Perumahan, Kawasan Permukiman dan Sumber Daya Air Kabupaten Tulungagung</li>
                <li>Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Gresik</li>
                <li>Kepala Dinas Pekerjaan Umum Sumber Daya Air Kabupaten Malang</li>
                <li>Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Trenggalek</li>
                <li>Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Ponorogo</li>
                <li>Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Jombang</li>
                <li>Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Mojokerto</li>
                <li>Kepala Dinas Pekerjaan Umum Sumber Daya Air dan Tata Ruang Kabupaten Pasuruan</li>
                <li>Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Blitar</li>
                <li>Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Ngawi</li>
                <li>Kepala Dinas Pekerjaan Umum Bina Marga dan Sumber Daya Air Kabupaten Jember</li>
                <li>Kepala Dinas Pekerjaan Umum dan Tata Ruang Kabupaten Lumajang</li>
                <li>Kepala Dinas Bina Marga dan Sumber Daya Air Kabupaten Sidoarjo*</li>
                <li>Kepala Dinas Pekerjaan Umum Pengairan Kabupaten Banyuwangi</li>
                <li>Kepala Dinas Pekerjaan Umum Sumber Daya Air Kabupaten Bojonegoro</li>
                <li>Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tuban</li>
                <li>Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Bangkalan</li>
                <li>Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Sampang</li>
                <li>Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Pamekasan</li>
                <li>Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Sumenep</li>
                <li>Kepala Dinas Kelautan dan Perikanan Kabupaten Sidoarjo</li>
                <li>Kepala Dinas Kelautan dan Perikanan Kabupaten Gresik</li>
              </ol>

              <h4 className="text-xl font-semibold text-zinc-800 mb-2">3. Anggota dari Unsur Non Pemerintah</h4>
              <ol className="list-decimal pl-5 space-y-1" start="39">
                <li>PG. Djatiroto Lumajang Jl. Ranupakis Kec. Jatiroto, Kabupaten Lumajang</li>
                <li>PG. Semboro Jember Semboro RT.2 RW.18 Semboro, Kabupaten Jember</li>
                <li>PG. Jombang Baru, Jombang Jl. Panglima Sudirman 1 Kabupaten Jombang</li>
                <li>PG. Rejo Agung, Magetan Jl. Yos Sudarso No. 23 Madiun</li>
                <li>PG. Rejosari, Magetan Jl. Rejosari I, Kel. Kewedanan, Kabupaten Magetan</li>
                <li>PG. Soedono, Ngawi Tepas, Geneng, Satriyan II, Kec. Ngawi, Kabupaten Ngawi</li>
                <li>Perum Jasa Tirta I Jl. Surabaya 2A, Malang</li>
                <li>Kelompok Pengelola Irigasi Perikanan (POKLINA) Gotong Royong Kec. Ujung Pangkah, Kabupaten Gresik</li>
                <li>Kelompok Budidaya Ikan (POKDAKAN) Sumber Urip Ds. Kedungpeluk, Kec. Candi, Kabupaten Sidoarjo</li>
                <li>D.I Gandong Kerik, Hadi Subroto, GHIPPA Tirto Wening, Desa Kerik, Kec. Takeran, Kabupaten Magetan</li>
                <li>D.I Sumorobangun, Soenoto, GHIPPA Sumotirto, Desa Nglampong, Kec. Badegan, Kabupaten Ponorogo</li>
                <li>D.I Blambangan, Agus Sugiarto, GHIPPA Jinggo Kencono, Desa Kumendung, Kec. Rejogung, Kabupaten Banyuwangi</li>
                <li>D.I Jepun Sarbini, GHIPPA Banyu Lestari, Desa Jambu, Kec. Lenteng, Kabupaten Sumenep</li>
                <li>D.I Sumber Gayam, Serin, GHIPPA Sumber Gayam Mandiri, Desa Malasan, Kec. Duren, Kabupaten Trenggalek</li>
                <li>D.I Kedung Kandang, H. Talar Isbandi, IHIPPA Sri Sedono, Desa Balerejo Kec. Pagelaran, Kabupaten Malang</li>
                <li>D.I Sarangan, Budi Santosa, GHIPPA Sidomulyo, Desa Dimong, Kec. Wonoasri, Kabupaten Madiun</li>
                <li>D.I Pirang, Tjatur Prasetyo, GHIPPA Sumber Rejeki, Desa Tanjung Harjo, Kec. Kapas, Kabupaten Bojonegoro</li>
                <li>D.I Sampean Baru, Karibun, GHIPPA Karya Sejahtera, Desa Tembokrejo, Kec. Bagorejo, Kabupaten Bondowoso</li>
                <li>D.I Samiran, Hanafi, GHIPPA Delapan Bersaudara, Desa Laden Kec. Pamekasan, Kabupaten Pamekasan</li>
                <li>D.I Ketandan, Sunariyo, GHIPPA Ponco Tirto, Desa Kempleng, Kec. Purwosari, Kabupaten Kediri</li>
                <li>D.I Paingan, Imam Khanafi, GHIPPA Tirto Guno, Desa Kiping, Kec. Gondang, Kabupaten Tulungagung</li>
                <li>D.I Mrican Kanan, Burhanudin, IHIPPA Sumber Agung, Desa Watudakan, Kec. Kesamben, Kabupaten Jombang</li>
                <li>D.I Mrican Kiri, Suwanto, IHIPPA Prambon Makmur, Desa Watukandang, Kec. Prambon, Kabupaten Nganjuk</li>
                <li>D.I Penewon, Muryono, GHIPPA Tirto Agung, Desa Kedungmaling Kec. Sooko, Kabupaten Mojokerto</li>
                <li>D.I Delta Brantas, Ir. Mulyohadi, IHIPPA Delta Sapta Tirta, Desa Banjanwungu, Kec. Tarik, Kabupaten Sidoarjo</li>
                <li>D.I Kertosari, Drs. H. Muhammad Taufik, GHIPPA Kenari Jaya, Desa Wiroligi Kec. Sumbarsari Kabupaten Jember</li>
                <li>D.I Nangger, Sofyan, GHIPPA Jaya Abadi, Desa Bungatan, Kec. Bungatan, Kabupaten Situbondo</li>
                <li>D.I Umbul, M. Zaini Hasan, GHIPPA Umbul, Desa Umbul, Kec. Arosbaya, Kabupaten Bangkalan</li>
                <li>D.I Klampis, Mudji, GHIPPA Sekar Arum, Desa Kara, Kec. Torjun, Kabupaten Sampang</li>
                <li>D.I Lodoyo, Haryoko, IHIPPA Gotong Royong, Desa Sutojayan, Kec. Sutojayan, Kabupaten Blitar</li>
                <li>D.I Curah menjangang, Dodi Dianto, GHIPPA Mitra Tani, Desa Selok Basuki, Kec. Sukodono, Kabupaten Lumajang</li>
                <li>D.I Taposan, Senewiyanto, GHIPPA Taposan Tirta, Desa Ngepeh, Kec. Dringu, Kabupaten Probolinggo</li>
                <li>D.I. Pang,Kadin Raharjo, GHIPPA Tirto Bening, Desa Sumber Bening, Kec. Bringin, Kabupaten Ngawi</li>
                <li>D.I. Rawa Jabung, Suraji, GHIPPA Tirto Joyo, Desa Jabung, Kec. Larsen, Kabupaten Lamongan.</li>
              </ol>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold text-zinc-800 mb-3">4. Tugas dan Fungsi Komisi Irigasi</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Merumuskan rencana kebijakan untuk mempertahankan dan meningkatkan kondisi dan fungsi irigasi;</li>
                <li>Merumuskan rencana tahunan penyediaan, pembagian, dan pemberian air irigasi yang efisien bagi pertanian dan keperluan lain;</li>
                <li>Merekomendasikan prioritas alokasi dana pengelolaan irigasi melalui forum musyawarah pembangunan;</li>
                <li>Memberikan pertimbangan mengenai izin alih fungsi lahan beririgasi;</li>
                <li>Merumuskan rencana tata tanam yang telah disiapkan oleh dinas instansi terkait dengan mempertimbangkan data debit air yang tersedia pada setiap daerah irigasi, pemberian air serentak atau golongan, kesesuaian jenis tanaman, serta rencana pembagian dan pemberian air;</li>
                <li>Merumuskan rencana pemeliharaan dan rehabilitasi jaringan irigasi yang meliputi prioritas penyediaan dana, pemeliharaan, dan rehabilitasi;</li>
                <li>Memberikan masukan dalam rangka evaluasi pengelolaan aset irigasi;</li>
                <li>Memberikan pertimbangan dan masukan atas pemberian izin alokasi air untuk kegiatan perluasan daerah layanan jaringan irigasi dan peningkatan jaringan irigasi;</li>
                <li>Memberikan masukan atas penetapan hak guna pakai air untuk irigasi dan hak guna usaha untuk irigasi kepada badan usaha, badan sosial, ataupun</li>
                <li>Membahas dan memberi pertimbangan dalam mengatasi permasalahan daerah irigasi akibat kekeringan, kebanjiran, dan akibat bencana alam lain;</li>
                <li>Memberikan masukan dan pertimbangan dalam proses penetapan peraturan daerah tentang irigasi;</li>
                <li>Memberikan masukan dan pertimbangan dalam upaya menjaga keandalan dan keberlanjutan sistem irigasi; dan</li>
                <li>Melaporkan hasil kegiatan kepada Gubernur mengenai program dan progres, masukan yang diperoleh, serta melaporkan kegiatan yang dilakukan selama 1 (satu) tahun.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}