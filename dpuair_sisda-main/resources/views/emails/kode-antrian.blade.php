<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode Antrian Pelayanan</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }

        .container {
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
        }

        .content {
            padding: 30px 20px;
        }

        .kode-box {
            background-color: #eff6ff;
            border-left: 4px solid #2563eb;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }

        .kode {
            font-size: 32px;
            font-weight: bold;
            color: #2563eb;
            font-family: 'Courier New', monospace;
            text-align: center;
            letter-spacing: 2px;
        }

        .kode-label {
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 10px;
        }

        .detail-table {
            width: 100%;
            margin: 20px 0;
        }

        .detail-table td {
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }

        .detail-table td:first-child {
            font-weight: 600;
            color: #6b7280;
            width: 40%;
        }

        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            background-color: #dbeafe;
            color: #1e40af;
        }

        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
        }

        .note {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }

        .note strong {
            color: #92400e;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>🎫 Antrian Pelayanan Terdaftar</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px;">Dinas Pengairan Provinsi Jawa Timur</p>
        </div>

        <div class="content">
            <p>Yth. <strong>{{ $pelayanan->nama_lengkap }}</strong>,</p>

            <p>Terima kasih telah mendaftar untuk layanan <strong>{{ $pelayanan->jenis_layanan }}</strong>. Pendaftaran
                Anda telah berhasil diproses.</p>

            <div class="kode-box">
                <div class="kode-label">KODE ANTRIAN ANDA</div>
                <div class="kode">{{ $pelayanan->kode_antrian }}</div>
            </div>

            <p><strong>Detail Pendaftaran:</strong></p>

            <table class="detail-table">
                <tr>
                    <td>Nama Lengkap</td>
                    <td>{{ $pelayanan->nama_lengkap }}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>{{ $pelayanan->email }}</td>
                </tr>
                <tr>
                    <td>Instansi/Asal</td>
                    <td>{{ $pelayanan->instansi_asal }}</td>
                </tr>
                <tr>
                    <td>Jenis Layanan</td>
                    <td><span class="badge">{{ $pelayanan->jenis_layanan }}</span></td>
                </tr>
                <tr>
                    <td>No. WhatsApp</td>
                    <td>{{ $pelayanan->nomor_whatsapp }}</td>
                </tr>
                <tr>
                    <td>Tanggal Kedatangan</td>
                    <td>{{ \Carbon\Carbon::parse($pelayanan->tanggal_kedatangan)->isoFormat('dddd, D MMMM YYYY') }}</td>
                </tr>
                @if ($pelayanan->catatan)
                    <tr>
                        <td>Catatan</td>
                        <td>{{ $pelayanan->catatan }}</td>
                    </tr>
                @endif
            </table>

            <div class="note">
                <strong>⚠️ Penting:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Simpan kode antrian ini dengan baik</li>
                    <li>Tunjukkan kode ini saat datang ke kantor</li>
                    <li>Datang 15 menit sebelum jadwal untuk registrasi</li>
                    <li>Untuk cek status, kunjungi website kami</li>
                </ul>
            </div>

            <p>Jika ada pertanyaan, silakan hubungi kami melalui:</p>
            <p>
                📧 Email: info@pusdajatim.go.id<br>
                📞 Telepon: (031) 1234-5678
            </p>
        </div>

        <div class="footer">
            <p><strong>Dinas Pengairan Provinsi Jawa Timur</strong></p>
            <p>Jl. Example No. 123, Surabaya, Jawa Timur</p>
            <p style="margin-top: 10px;">
                Email ini dikirim otomatis, mohon tidak membalas email ini.
            </p>
        </div>
    </div>
</body>

</html>
