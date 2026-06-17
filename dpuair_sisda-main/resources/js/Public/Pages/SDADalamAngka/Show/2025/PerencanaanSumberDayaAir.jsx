import React from "react";
import { ProfilBidangPerencanaanSumberDayaAir, DewanSumberDayaAir, DataCurahHujan } from "@/data/SDADalamAngka/2025/psda";
import Tabel, { renderCell, renderCells } from "../Components/Tabel";

export default function PerencanaanSumberDayaAirContent() {
    return (
        <div className="space-y-12">
            {/* Profil Bidang Perencanaan Sumber Daya Air */}
            <section>
                <h2 className="text-3xl font-bold mb-6 text-zinc-900">
                    2.1 Profil Bidang Perencanaan Sumber Daya Air
                </h2>
                {ProfilBidangPerencanaanSumberDayaAir.length > 0 ? (
                    <div className="space-y-8">
                        {ProfilBidangPerencanaanSumberDayaAir.map((section, idx) => (
                            <div key={idx} className="space-y-4">
                                {/* Section Title */}
                                {section.title && (
                                    <h3 className="text-xl font-semibold text-zinc-800 border-l-4 border-blue-600 pl-4">
                                        {section.title}
                                    </h3>
                                )}
                                
                                {/* Section Content */}
                                {section.content && (
                                    <p className="text-zinc-700 leading-relaxed text-justify">
                                        {section.content}
                                    </p>
                                )}
                                
                                {/* Section List */}
                                {section.list && section.list.length > 0 && (
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        {section.list.map((item, itemIdx) => (
                                            <li key={itemIdx} className="text-zinc-700 leading-relaxed">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                
                                {/* Sub Sections */}
                                {section.subSections && section.subSections.length > 0 && (
                                    <div className="ml-6 space-y-4">
                                        {section.subSections.map((subSection, subIdx) => (
                                            <div key={subIdx} className="space-y-2">
                                                {/* Sub Section Title */}
                                                {subSection.subTitle && (
                                                    <h4 className="text-lg font-semibold text-zinc-800">
                                                        {subSection.subTitle}
                                                    </h4>
                                                )}
                                                
                                                {/* Sub Section Text */}
                                                {subSection.text && (
                                                    <p className="text-zinc-700 leading-relaxed text-justify">
                                                        {subSection.text}
                                                    </p>
                                                )}
                                                
                                                {/* Sub Section List */}
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
                ) : (
                    <p className="text-zinc-500 italic">Data belum tersedia</p>
                )}
            </section>

            {/* Dewan Sumber Daya Air */}
            <section>
                <h2 className="text-3xl font-bold mb-6 text-zinc-900">
                    2.2 Dewan Sumber Daya Air
                </h2>
                {DewanSumberDayaAir.length > 0 ? (
                    <div className="space-y-8">
                        {DewanSumberDayaAir.map((section, idx) => (
                            <div key={idx} className="space-y-4">
                                {/* Section Title */}
                                {section.title && (
                                    <h3 className="text-xl font-semibold text-zinc-800 border-l-4 border-blue-600 pl-4">
                                        {section.title}
                                    </h3>
                                )}
                                
                                {/* Section Content */}
                                {section.content && (
                                    <p className="text-zinc-700 leading-relaxed text-justify">
                                        {section.content}
                                    </p>
                                )}
                                
                                {/* Section List */}
                                {section.list && section.list.length > 0 && (
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        {section.list.map((item, itemIdx) => (
                                            <li key={itemIdx} className="text-zinc-700 leading-relaxed">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                
                                {/* Sub Sections */}
                                {section.subSections && section.subSections.length > 0 && (
                                    <div className="ml-6 space-y-4">
                                        {section.subSections.map((subSection, subIdx) => (
                                            <div key={subIdx} className="space-y-2">
                                                {/* Sub Section Title */}
                                                {subSection.subTitle && (
                                                    <h4 className="text-lg font-semibold text-zinc-800">
                                                        {subSection.subTitle}
                                                    </h4>
                                                )}
                                                
                                                {/* Sub Section Text */}
                                                {subSection.text && (
                                                    <p className="text-zinc-700 leading-relaxed text-justify">
                                                        {subSection.text}
                                                    </p>
                                                )}
                                                
                                                {/* Sub Section List */}
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
                ) : (
                    <p className="text-zinc-500 italic">Data belum tersedia</p>
                )}
            </section>

            {/* Tabel 2.1: Data Curah Hujan */}
            {DataCurahHujan.map((wilayahData, index) => (
                <section key={index} className="mb-10">
                    <h2 className="text-3xl font-bold mb-6 text-zinc-900">
                        Tabel 2.{index + 1} Data Jumlah Curah Hujan Rerata Tahunan di Kabupaten/Kota - {wilayahData.kategori}
                    </h2>
                    <div className="overflow-x-auto">
                        <Tabel
                            headers={[
                                { label: "Wilayah Sungai / UPT PSDA / Kabupaten / Kota", align: "left", minWidth: "250px" },
                                { label: "Jumlah Pos Hujan", align: "center" },
                                { label: "2014", align: "center" },
                                { label: "2015", align: "center" },
                                { label: "2016", align: "center" },
                                { label: "2017", align: "center" },
                                { label: "2018", align: "center" },
                                { label: "2019", align: "center" },
                                { label: "2020", align: "center" },
                                { label: "2021", align: "center" },
                                { label: "2022", align: "center" },
                                { label: "2023", align: "center" },
                                { label: "2024", align: "center" },
                                { label: "Jumlah Rerata 10 Tahun (mm)", align: "center" }
                            ]}
                            data={wilayahData.data}
                            showNoColumn={true}
                            tableCaption={`Data Curah Hujan - ${wilayahData.kategori}`}
                            renderRow={(row) => (
                                <>
                                    {row.isKoorwil ? (
                                        <>
                                            {renderCell(row.koorwilLabel, 'bold', { colSpan: 14 })}
                                        </>
                                    ) : (
                                        <>
                                            {renderCell(row.wilayahSungai, 'bold')}
                                            {renderCell(row.jumlahPosHujan, 'center')}
                                            {renderCell(row.tahun2014, 'center')}
                                            {renderCell(row.tahun2015, 'center')}
                                            {renderCell(row.tahun2016, 'center')}
                                            {renderCell(row.tahun2017, 'center')}
                                            {renderCell(row.tahun2018, 'center')}
                                            {renderCell(row.tahun2019, 'center')}
                                            {renderCell(row.tahun2020, 'center')}
                                            {renderCell(row.tahun2021, 'center')}
                                            {renderCell(row.tahun2022, 'center')}
                                            {renderCell(row.tahun2023, 'center')}
                                            {renderCell(row.tahun2024, 'center')}
                                            {renderCell(row.jumlahRerata10Tahun, 'boldCenter')}
                                        </>
                                    )}
                                </>
                            )}
                            customHeaderRow={
                                <tr className="bg-blue-50">
                                    <td className="px-4 py-3 text-left font-bold text-zinc-800 border border-zinc-300">
                                        {wilayahData.wilayahSungai}
                                    </td>
                                    <td className="px-4 py-3 text-center font-bold text-zinc-800 border border-zinc-300">
                                        {wilayahData.jumlahPosHujan}
                                    </td>
                                    <td className="px-4 py-3 text-center font-bold text-zinc-800 border border-zinc-300">
                                        {wilayahData.tahun2014}
                                    </td>
                                    <td className="px-4 py-3 text-center font-bold text-zinc-800 border border-zinc-300">
                                        {wilayahData.tahun2015}
                                    </td>
                                    <td className="px-4 py-3 text-center font-bold text-zinc-800 border border-zinc-300">
                                        {wilayahData.tahun2016}
                                    </td>
                                    <td className="px-4 py-3 text-center font-bold text-zinc-800 border border-zinc-300">
                                        {wilayahData.tahun2017}
                                    </td>
                                    <td className="px-4 py-3 text-center font-bold text-zinc-800 border border-zinc-300">
                                        {wilayahData.tahun2018}
                                    </td>
                                    <td className="px-4 py-3 text-center font-bold text-zinc-800 border border-zinc-300">
                                        {wilayahData.tahun2019}
                                    </td>
                                    <td className="px-4 py-3 text-center font-bold text-zinc-800 border border-zinc-300">
                                        {wilayahData.tahun2020}
                                    </td>
                                    <td className="px-4 py-3 text-center font-bold text-zinc-800 border border-zinc-300">
                                        {wilayahData.tahun2021}
                                    </td>
                                    <td className="px-4 py-3 text-center font-bold text-zinc-800 border border-zinc-300">
                                        {wilayahData.tahun2022}
                                    </td>
                                    <td className="px-4 py-3 text-center font-bold text-zinc-800 border border-zinc-300">
                                        {wilayahData.tahun2023}
                                    </td>
                                    <td className="px-4 py-3 text-center font-bold text-zinc-800 border border-zinc-300">
                                        {wilayahData.tahun2024}
                                    </td>
                                    <td className="px-4 py-3 text-center font-bold text-zinc-800 border border-zinc-300">
                                        {wilayahData.jumlahRerata10Tahun}
                                    </td>
                                </tr>
                            }
                        />
                    </div>
                </section>
            ))}
        </div>
    );
}
