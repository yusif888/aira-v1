<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Antrian Pelayanan</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 10px;
            color: #1f2937;
            background: #ffffff;
            padding: 28px 32px;
        }

        /* ── Header ── */
        .header-table { width: 100%; border-bottom: 3px solid #173c94; padding-bottom: 14px; margin-bottom: 18px; }
        .header-logo  { width: 64px; vertical-align: middle; }
        .header-logo img { height: 52px; width: auto; }
        .header-info  { vertical-align: middle; padding-left: 14px; }
        .header-info h1 { font-size: 15px; font-weight: 700; color: #173c94; margin-bottom: 3px; }
        .header-info p  { font-size: 9px; color: #6b7280; line-height: 1.6; }

        /* ── Meta ── */
        .meta-table { width: 100%; background: #f3f4f6; border-radius: 6px; margin-bottom: 16px; }
        .meta-table td { padding: 11px 16px; vertical-align: middle; }
        .meta-label { font-size: 8px; text-transform: uppercase; letter-spacing: 0.06em; color: #9ca3af; margin-bottom: 3px; }
        .meta-value { font-size: 11px; font-weight: 700; color: #111827; }
        .meta-divider { width: 1px; background: #e5e7eb; }

        /* ── Summary ── */
        .summary-table { width: 100%; margin-bottom: 18px; border-collapse: separate; border-spacing: 8px; }
        .summary-card  { border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px; text-align: center; background: #fff; }
        .summary-count { font-size: 22px; font-weight: 700; line-height: 1.1; margin-bottom: 3px; }
        .summary-label { font-size: 9px; color: #6b7280; }
        .color-pending    { color: #d97706; }
        .color-diproses   { color: #0284c7; }
        .color-selesai    { color: #059669; }
        .color-dibatalkan { color: #dc2626; }

        /* ── Table ── */
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table thead tr { background: #173c94; }
        .data-table thead th {
            padding: 8px 9px;
            text-align: left;
            font-size: 8px;
            font-weight: 700;
            color: #ffffff;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .data-table tbody tr { border-bottom: 1px solid #e5e7eb; }
        .data-table tbody tr.even { background: #f9fafb; }
        .data-table tbody td { padding: 6px 9px; vertical-align: top; color: #374151; font-size: 9.5px; }

        .kode { font-family: 'Courier New', monospace; font-weight: 700; color: #173c94; font-size: 10px; }
        .sub  { font-size: 8px; color: #9ca3af; margin-top: 1px; }

        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 8.5px;
            font-weight: 700;
        }
        .badge-pending    { background: #fef3c7; color: #92400e; }
        .badge-diproses   { background: #e0f2fe; color: #0c4a6e; }
        .badge-selesai    { background: #d1fae5; color: #064e3b; }
        .badge-dibatalkan { background: #fee2e2; color: #7f1d1d; }

        .badge-jenis {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 8.5px;
            font-weight: 700;
            background: #ede9fe;
            color: #4c1d95;
        }
        .no-jenis { color: #d1d5db; }

        /* ── Footer ── */
        .footer-table { width: 100%; margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 10px; }
        .footer-table td { font-size: 8px; color: #9ca3af; vertical-align: middle; }
    </style>
</head>
<body>

{{-- ── Header ─────────────────────────────────────────── --}}
<table class="header-table" cellpadding="0" cellspacing="0">
    <tr>
        <td class="header-logo">
            @if($logoBase64)
                <img src="{{ $logoBase64 }}" alt="Logo">
            @endif
        </td>
        <td class="header-info">
            <h1>Laporan Antrian Pelayanan</h1>
            <p>
                Dinas Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur<br>
                Dicetak pada: {{ now()->isoFormat('dddd, D MMMM YYYY · HH:mm') }} WIB
            </p>
        </td>
    </tr>
</table>

{{-- ── Meta ───────────────────────────────────────────── --}}
<table class="meta-table" cellpadding="0" cellspacing="0">
    <tr>
        <td style="width:35%">
            <div class="meta-label">Periode</div>
            <div class="meta-value">
                {{ \Carbon\Carbon::parse($dateFrom)->isoFormat('D MMMM YYYY') }}
                &mdash;
                {{ \Carbon\Carbon::parse($dateTo)->isoFormat('D MMMM YYYY') }}
            </div>
        </td>
        <td class="meta-divider" style="width:1px">&nbsp;</td>
        @if($jenisKunjungan)
        <td style="width:30%; padding-left: 16px;">
            <div class="meta-label">Jenis Kunjungan</div>
            <div class="meta-value">{{ $jenisKunjungan->kode }} — {{ $jenisKunjungan->nama }}</div>
        </td>
        <td class="meta-divider" style="width:1px">&nbsp;</td>
        @endif
        @if($status)
        <td style="width:20%; padding-left: 16px;">
            <div class="meta-label">Status</div>
            <div class="meta-value">{{ ['pending'=>'Menunggu','diproses'=>'Diproses','selesai'=>'Selesai','dibatalkan'=>'Ditolak'][$status] ?? ucfirst($status) }}</div>
        </td>
        <td class="meta-divider" style="width:1px">&nbsp;</td>
        @endif
        <td style="padding-left: 16px;">
            <div class="meta-label">Total Data</div>
            <div class="meta-value">{{ $pelayanans->count() }} antrian</div>
        </td>
    </tr>
</table>

{{-- ── Summary Cards ───────────────────────────────────── --}}
<table class="summary-table" cellpadding="0" cellspacing="0">
    <tr>
        @foreach([
            ['label'=>'Menunggu',  'key'=>'pending',    'class'=>'color-pending'],
            ['label'=>'Diproses',  'key'=>'diproses',   'class'=>'color-diproses'],
            ['label'=>'Selesai',   'key'=>'selesai',    'class'=>'color-selesai'],
            ['label'=>'Ditolak',   'key'=>'dibatalkan', 'class'=>'color-dibatalkan'],
        ] as $s)
        <td class="summary-card">
            <div class="summary-count {{ $s['class'] }}">{{ $pelayanans->where('status', $s['key'])->count() }}</div>
            <div class="summary-label">{{ $s['label'] }}</div>
        </td>
        @endforeach
    </tr>
</table>

{{-- ── Data Table ──────────────────────────────────────── --}}
<table class="data-table" cellpadding="0" cellspacing="0">
    <thead>
        <tr>
            <th style="width:3%">No</th>
            <th style="width:13%">Kode Antrian</th>
            <th style="width:20%">Nama Lengkap</th>
            <th style="width:22%">Instansi / Asal</th>
            <th style="width:10%">Jenis</th>
            <th style="width:13%">Tgl Kedatangan</th>
            <th style="width:11%">No. WhatsApp</th>
            <th style="width:8%">Status</th>
        </tr>
    </thead>
    <tbody>
        @forelse($pelayanans as $i => $p)
        <tr class="{{ $i % 2 === 1 ? 'even' : '' }}">
            <td style="color:#9ca3af; text-align:center">{{ $i + 1 }}</td>
            <td><span class="kode">{{ $p->kode_antrian }}</span></td>
            <td>
                {{ $p->nama_lengkap }}
                <div class="sub">{{ $p->email }}</div>
            </td>
            <td>{{ $p->instansi_asal }}</td>
            <td>
                @if($p->jenisKunjungan)
                    <span class="badge-jenis">{{ $p->jenisKunjungan->kode }}</span>
                @else
                    <span class="no-jenis">—</span>
                @endif
            </td>
            <td>{{ \Carbon\Carbon::parse($p->tanggal_kedatangan)->isoFormat('D MMM YYYY') }}</td>
            <td>{{ $p->nomor_whatsapp }}</td>
            <td>
                @php
                    $map = [
                        'pending'    => ['badge-pending',    'Menunggu'],
                        'diproses'   => ['badge-diproses',   'Diproses'],
                        'selesai'    => ['badge-selesai',    'Selesai'],
                        'dibatalkan' => ['badge-dibatalkan', 'Ditolak'],
                    ];
                    [$cls, $lbl] = $map[$p->status] ?? ['', ucfirst($p->status)];
                @endphp
                <span class="badge {{ $cls }}">{{ $lbl }}</span>
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="8" style="text-align:center; padding:20px; color:#9ca3af">
                Tidak ada data antrian pada periode ini.
            </td>
        </tr>
        @endforelse
    </tbody>
</table>

{{-- ── Footer ──────────────────────────────────────────── --}}
<table class="footer-table" cellpadding="0" cellspacing="0">
    <tr>
        <td>Dinas PU SDA Provinsi Jawa Timur &mdash; Dokumen ini dicetak otomatis oleh sistem</td>
        <td style="text-align:right; color:#173c94; font-weight:700">
            {{ $pelayanans->count() }} data ditemukan
        </td>
    </tr>
</table>

</body>
</html>
