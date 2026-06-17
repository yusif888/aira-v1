// /data/SDADalamAngka/2025/irigasi_table3_5.js

export const Tabel3_5 = [
  // Header untuk Wilayah dengan Penyelesaian Tinggi (Hijau)
  {
    isHeader: true,
    wilayah_sungai: "WILAYAH DENGAN PENYELESAIAN TINGGI",
    bgColor: "bg-green-100"
  },
  // Data wilayah hijau
  {
    no: 1,
    wilayah_sungai: "Bengawan Solo",
    jumlah_petugas: 24,
    status: {
      selesai: 18,
      proses: 5,
      tertunda: 1
    },
    prioritas: "Tinggi",
    bgColor: "bg-green-50"
  },
  {
    no: 2,
    wilayah_sungai: "Brantas",
    jumlah_petugas: 18,
    status: {
      selesai: 15,
      proses: 3,
      tertunda: 0
    },
    prioritas: "Tinggi",
    bgColor: "bg-green-50"
  },
  {
    no: 3,
    wilayah_sungai: "Madiun",
    jumlah_petugas: 20,
    status: {
      selesai: 16,
      proses: 4,
      tertunda: 0
    },
    prioritas: "Tinggi",
    bgColor: "bg-green-50"
  },
  
  // Header untuk Wilayah dengan Penyelesaian Sedang (Orange)
  {
    isHeader: true,
    wilayah_sungai: "WILAYAH DENGAN PENYELESAIAN SEDANG",
    bgColor: "bg-orange-100"
  },
  // Data wilayah orange
  {
    no: 4,
    wilayah_sungai: "Madura",
    jumlah_petugas: 15,
    status: {
      selesai: 7,
      proses: 6,
      tertunda: 2
    },
    prioritas: "Sedang",
    bgColor: "bg-orange-50"
  },
  {
    no: 5,
    wilayah_sungai: "Pekalen",
    jumlah_petugas: 12,
    status: {
      selesai: 5,
      proses: 5,
      tertunda: 2
    },
    prioritas: "Sedang",
    bgColor: "bg-orange-50"
  },
  {
    no: 6,
    wilayah_sungai: "Sampean Baru",
    jumlah_petugas: 14,
    status: {
      selesai: 8,
      proses: 4,
      tertunda: 2
    },
    prioritas: "Sedang",
    bgColor: "bg-orange-50"
  },
  
  // Header untuk Wilayah dengan Penyelesaian Rendah (Biru)
  {
    isHeader: true,
    wilayah_sungai: "WILAYAH DENGAN PENYELESAIAN RENDAH",
    bgColor: "bg-blue-100"
  },
  // Data wilayah biru
  {
    no: 7,
    wilayah_sungai: "Sampean",
    jumlah_petugas: 10,
    status: {
      selesai: 2,
      proses: 4,
      tertunda: 4
    },
    prioritas: "Rendah",
    bgColor: "bg-blue-50"
  },
  {
    no: 8,
    wilayah_sungai: "Jalalabad",
    jumlah_petugas: 8,
    status: {
      selesai: 1,
      proses: 3,
      tertunda: 4
    },
    prioritas: "Rendah",
    bgColor: "bg-blue-50"
  },
  {
    no: 9,
    wilayah_sungai: "Bondoyudo",
    jumlah_petugas: 9,
    status: {
      selesai: 2,
      proses: 3,
      tertunda: 4
    },
    prioritas: "Rendah",
    bgColor: "bg-blue-50"
  },
  
  // Total
  {
    no: "TOTAL",
    wilayah_sungai: "SEMUA WILAYAH",
    jumlah_petugas: 130,
    status: {
      selesai: 74,
      proses: 37,
      tertunda: 19
    },
    prioritas: "-",
    isTotal: true,
    bgColor: "bg-gray-100"
  }
];

export const Tabel3_5_Metadata = {
  title: "Tabel 3.5: Distribusi Tugas Irigasi per Wilayah",
  description: "Data distribusi tugas irigasi berdasarkan wilayah sungai di Provinsi Jawa Timur",
  source: "Jalalabad Task 3.5",
  lastUpdated: "2025-01-15",
  columns: [
    { key: "wilayah_sungai", label: "Wilayah Sungai" },
    { key: "jumlah_petugas", label: "Jumlah Petugas" },
    { key: "status.selesai", label: "Selesai" },
    { key: "status.proses", label: "Proses" },
    { key: "status.tertunda", label: "Tertunda" },
    { key: "prioritas", label: "Prioritas" }
  ]
};