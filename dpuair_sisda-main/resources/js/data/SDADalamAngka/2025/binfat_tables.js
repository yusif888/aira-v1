import { Tabel5_1 } from './binfat_table5_1';
import { Tabel5_2 } from './binfat_table5_2';
import { Tabel5_3 } from './binfat_table5_3';
import { Tabel5_4 } from './binfat_table5_4';
import { Tabel5_5 } from './binfat_table5_5';
import { Tabel5_6 } from './binfat_table5_6'; // Import Tabel5_6

export const TabelGroups = [
  { id: '5.1', title: 'Tabel 5.1 - Daftar Rekomendasi Teknis Tanah dan Air', data: Tabel5_1 },
  {
    id: '5.2',
    title: 'Tabel 5.2 - Daftar Nama GHIPPA / HIPPA',
    data: Tabel5_2,
    headers: [
      { label: 'No. SK', key: 'no_sk', align: 'left', width: '120px' },
      { label: 'Nama GHIPPA / HIPPA', key: 'nama', align: 'left', width: '220px' },
      { label: 'Luas (ha)', key: 'luas_ha', align: 'center', width: '120px' },
      { label: 'Jumlah Anggota', key: 'jumlah_anggota', align: 'center', width: '140px' },
      { label: 'Desa', key: 'desa', align: 'left', width: '180px' },
      { label: 'Kecamatan', key: 'kecamatan', align: 'left', width: '160px' },
      { label: 'Kab/Kota', key: 'kabupaten', align: 'left', width: '160px' },
      { label: 'DAS', key: 'das', align: 'left', width: '180px' },
      { label: 'Wilayah Sungai', key: 'wilayah_sungai', align: 'left', width: '200px' },
      { label: 'Tahun Berdiri', key: 'tahun_berdiri', align: 'center', width: '120px' }
    ],
    sortBy: 'no'
  },
  {
    id: '5.3',
    title: 'Tabel 5.3 - Kegiatan Penerbitan dan Sosialisasi',
    data: Tabel5_3,
    headers: [
      { label: 'Tanggal', key: 'tanggal', align: 'left', width: '140px' },
      { label: 'Lokasi', key: 'lokasi', align: 'left', width: '240px' },
      { label: 'Keterangan', key: 'keterangan', align: 'left', width: '360px' },
      { label: '750 m', key: 'panjang_750_m', align: 'center', width: '120px' },
      { label: '500 m', key: 'panjang_500_m', align: 'center', width: '120px' },
      { label: '1500 m', key: 'panjang_1500_m', align: 'center', width: '120px' }
    ],
    sortBy: 'tanggal'
  },
  {
    id: '5.4',
    title: 'Tabel 5.4 - Dokumentasi Sosialisasi',
    data: Tabel5_4,
    headers: [
      { label: 'No.', key: 'no', align: 'center', width: '60px' },
      { label: 'Wilayah Sungai', key: 'wilayah_sungai', align: 'left', width: '180px' },
      { label: 'Jenis Pelanggaran', key: 'jenis_pelanggaran', align: 'left', width: '240px' },
      { label: 'Terdampak', key: 'terdampak', align: 'left', width: '160px' }
    ],
    sortBy: 'no'
  },
  {
    id: '5.5',
    title: 'Tabel 5.5 - Rekapitulasi Aset',
    data: Tabel5_5,
    headers: [
      { label: 'No.', key: 'no', align: 'center', width: '60px' },
      { label: 'Keterangan', key: 'keterangan', align: 'left', width: '200px' },
      { label: 'Jumlah (Buah)', key: 'jumlah_buah', align: 'center', width: '120px' },
      { label: 'Perolehan - Tanah', key: 'perolehan_tanah', align: 'right', width: '140px' },
      { label: 'Perolehan - Bangunan', key: 'perolehan_bangunan', align: 'right', width: '140px' },
      { label: 'Perolehan - Peralatan Proses/Produksi', key: 'perolehan_peralatan_proses', align: 'right', width: '180px' },
      { label: 'Perolehan - Perabotan', key: 'perolehan_perabotan', align: 'right', width: '140px' },
      { label: 'Perolehan - Kendaraan', key: 'perolehan_kendaraan', align: 'right', width: '140px' },
      { label: 'Perolehan - Lainnya', key: 'perolehan_lainnya', align: 'right', width: '140px' },
      { label: 'Akumulasi Penyusutan - Tanah', key: 'akumulasi_penyusutan_tanah', align: 'right', width: '160px' },
      { label: 'Akumulasi Penyusutan - Bangunan', key: 'akumulasi_penyusutan_bangunan', align: 'right', width: '160px' },
      { label: 'Akumulasi Penyusutan - Peralatan Proses/Produksi', key: 'akumulasi_penyusutan_peralatan_proses', align: 'right', width: '200px' },
      { label: 'Akumulasi Penyusutan - Perabotan', key: 'akumulasi_penyusutan_perabotan', align: 'right', width: '160px' },
      { label: 'Akumulasi Penyusutan - Kendaraan', key: 'akumulasi_penyusutan_kendaraan', align: 'right', width: '160px' },
      { label: 'Akumulasi Penyusutan - Lainnya', key: 'akumulasi_penyusutan_lainnya', align: 'right', width: '160px' },
      { label: 'Nilai Buku - Tanah', key: 'nilai_buku_tanah', align: 'right', width: '140px' },
      { label: 'Nilai Buku - Bangunan', key: 'nilai_buku_bangunan', align: 'right', width: '140px' },
      { label: 'Nilai Buku - Peralatan Proses/Produksi', key: 'nilai_buku_peralatan_proses', align: 'right', width: '180px' },
      { label: 'Nilai Buku - Perabotan', key: 'nilai_buku_perabotan', align: 'right', width: '140px' },
      { label: 'Nilai Buku - Kendaraan', key: 'nilai_buku_kendaraan', align: 'right', width: '140px' },
      { label: 'Nilai Buku - Lainnya', key: 'nilai_buku_lainnya', align: 'right', width: '140px' }
    ],
    sortBy: 'no'
  },
  {
    id: '5.6',
    title: 'Tabel 5.6 - Data Kerjasama / MOU',
    data: Tabel5_6,
    headers: [
      { label: 'No.', key: 'no', align: 'center', width: '60px' },
      { label: 'UPT PSDA', key: 'upt_psda', align: 'left', width: '140px' },
      { label: 'Kab/Kota', key: 'kab_kota', align: 'left', width: '160px' },
      { label: 'Tgl/Tahun Dibuat', key: 'tgl_tahun_dibuat', align: 'left', width: '140px' },
      { label: 'Masa Berlaku', key: 'masa_berlaku', align: 'left', width: '120px' },
      { label: 'Jenis PKS - Irigasi', key: 'jenis_pks_irigasi', align: 'center', width: '100px' },
      { label: 'Jenis PKS - Sungai', key: 'jenis_pks_sungai', align: 'center', width: '100px' },
      { label: 'Jenis PKS - Lainnya', key: 'jenis_pks_lainnya', align: 'center', width: '100px' },
      { label: 'Jumlah PKS', key: 'jumlah_pks', align: 'center', width: '100px' },
      { label: 'Ket', key: 'ket', align: 'left', width: '140px' },
      { label: 'Progress Th. 2025', key: 'progress_th_2025', align: 'left', width: '160px' }
    ],
    sortBy: 'no'
  },
];