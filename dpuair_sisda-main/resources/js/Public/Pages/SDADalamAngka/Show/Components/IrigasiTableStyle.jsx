// resources/js/Public/Pages/SDADalamAngka/Show/Components/IrigasiTableStyle.jsx
import React from 'react';

export default function IrigasiTableStyle({ title, headers, data, renderRow, metadata = {} }) {
  // Tidak ada state pagination di sini
  // Data ditampilkan semua atau hanya satu grup dari luar

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">
        {title}
      </h2>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header, idx) => (
                  <th
                    key={idx}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.align === 'center' ? 'text-center' : ''}`}
                    style={{ width: header.width }}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {renderRow(row)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Keterangan */}
      {metadata && metadata.keterangan && (
        <div className="mt-4 text-sm text-gray-600 italic">
          Keterangan: {metadata.keterangan}
        </div>
      )}
    </div>
  );
}