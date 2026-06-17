// Public/Pages/SDADalamAngka/Show/Components/SimpleTable.jsx
import React from 'react';

export default function SimpleTable({ title, headers, data, renderRow, showTotal = false, totalRow = null }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-zinc-800">{title}</h3>
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
                {renderRow(row, rowIndex)} {/* <-- Sekarang mengirimkan rowIndex */}
              </tr>
            ))}
            {showTotal && totalRow && (
              <tr className="bg-blue-50 font-semibold">
                {renderRow(totalRow, null)} {/* Untuk baris total, kirim null */}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}