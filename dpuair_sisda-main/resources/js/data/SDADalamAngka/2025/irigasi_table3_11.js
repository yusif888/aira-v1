// /data/SDADalamAngka/2025/irigasi_table3_11.js

export const Tabel3_11 = [
  {
    no: 1,
    lokasi: "UPT SOA WS Bengawan Solo",
    panjang_m: 2450.5,
    kapasitas_l_per_s: 1250.75,
    kondisi: "Baik",
    tahun_pembangunan: 2018,
    keterangan: "Jaringan primer"
  },
  {
    no: 2,
    lokasi: "UPT SOA WS Brantas",
    panjang_m: 3780.25,
    kapasitas_l_per_s: 1890.50,
    kondisi: "Baik",
    tahun_pembangunan: 2019,
    keterangan: "Jaringan sekunder"
  },
  {
    no: 3,
    lokasi: "UPT SOA WS Madura",
    panjang_m: 1560.75,
    kapasitas_l_per_s: 780.25,
    kondisi: "Sedang",
    tahun_pembangunan: 2017,
    keterangan: "Jaringan tersier"
  },
  {
    no: 4,
    lokasi: "UPT SOA WS Pekalen",
    panjang_m: 2890.00,
    kapasitas_l_per_s: 1450.00,
    kondisi: "Baik",
    tahun_pembangunan: 2020,
    keterangan: "Jaringan primer"
  },
  {
    no: 5,
    lokasi: "UPT SOA WS Sampean",
    panjang_m: 3125.50,
    kapasitas_l_per_s: 1560.25,
    kondisi: "Baik",
    tahun_pembangunan: 2021,
    keterangan: "Jaringan sekunder"
  },
  
  // Total row
  {
    no: "",
    lokasi: "JUMLAH",
    panjang_m: 13807.00,
    kapasitas_l_per_s: 6931.75,
    kondisi: "",
    tahun_pembangunan: "",
    keterangan: "",
    isTotal: true,
    bgColor: "bg-gray-100"
  }
];

export const Tabel3_11_Metadata = {
  title: "Tabel 3.11: Data Jaringan Drainase pada Kewenangan Provinsi Jawa Timur",
  description: "Data lengkap jaringan drainase yang berada di bawah kewenangan Provinsi Jawa Timur",
  source: "Dinas Sumber Daya Air Provinsi Jawa Timur",
  lastUpdated: "2025-01-15",
  columns: [
    { key: "no", label: "No." },
    { key: "lokasi", label: "Lokasi" },
    { key: "panjang_m", label: "Panjang (m)" },
    { key: "kapasitas_l_per_s", label: "Kapasitas (l/s)" },
    { key: "kondisi", label: "Kondisi" },
    { key: "tahun_pembangunan", label: "Tahun Pembangunan" },
    { key: "keterangan", label: "Keterangan" }
  ]
};