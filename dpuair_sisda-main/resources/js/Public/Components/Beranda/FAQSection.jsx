import { useState, useRef } from "react";
import { motion } from "framer-motion";

const faqData = [
    {
        id: 1,
        question:
            "Bagaimana cara mengajukan permohonan data hidrologi dan kualitas air?",
        answer: (
            <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                    Terkait permohonan data hidrologi dan kualitas air seperti
                    data dari pos curah hujan, pos duga air, maupun pos kualitas
                    air, dapat diajukan melalui layanan Fast Hydrology Data
                    (FHD) yang tersedia di laman{" "}
                    <a
                        href="http://hidrologi.dpuair.jatimprov.go.id/pelayanan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 underline hover:text-gray-600 transition-colors"
                    >
                        hidrologi.dpuair.jatimprov.go.id/pelayanan
                    </a>
                    .
                </p>
                <p>
                    Alternatif lainnya, permohonan juga dapat disampaikan secara
                    resmi melalui surat yang dikirimkan ke email{" "}
                    <a
                        href="mailto:hidrokualitasair@gmail.com"
                        className="text-gray-900 underline hover:text-gray-600 transition-colors"
                    >
                        hidrokualitasair@gmail.com
                    </a>{" "}
                    atau dikirimkan ke kantor kami.
                </p>
                <p>
                    Adapun tutorial mengajukan permohonan dapat diakses melalui
                    laman:{" "}
                    <a
                        href="https://bit.ly/Tutor-FHD"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 underline hover:text-gray-600 transition-colors"
                    >
                        https://bit.ly/Tutor-FHD
                    </a>
                    .
                </p>
            </div>
        ),
    },
    {
        id: 2,
        question:
            "Apakah Dinas PU SDA menyediakan layanan pengaduan masyarakat?",
        answer: (
            <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                    Ya. Dinas PU Sumber Daya Air Provinsi Jawa Timur menyediakan
                    layanan pengaduan masyarakat yang dapat diakses melalui:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-4">
                    <li>
                        SP4N LAPOR! di laman{" "}
                        <a
                            href="https://www.lapor.go.id"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-900 underline hover:text-gray-600 transition-colors"
                        >
                            https://www.lapor.go.id
                        </a>
                    </li>
                    <li>
                        Pesan langsung (DM) ke akun media sosial resmi Dinas PU
                        SDA Jatim
                    </li>
                    <li>
                        Datang langsung ke kantor Dinas pada hari dan jam kerja
                    </li>
                </ul>
                <p>
                    Semua pengaduan akan diverifikasi dan ditindaklanjuti sesuai
                    prosedur yang berlaku.
                </p>
            </div>
        ),
    },
    {
        id: 3,
        question: "Bagaimana cara mengajukan magang di Dinas PU SDA?",
        answer: (
            <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                    Silakan mengisi formulir pendaftaran melalui tautan berikut:{" "}
                    <a
                        href="https://bit.ly/Magang-PUSDAJATIM"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 underline hover:text-gray-600 transition-colors"
                    >
                        https://bit.ly/Magang-PUSDAJATIM
                    </a>
                    .
                </p>
                <p>
                    Setelah seluruh data dan dokumen terkirim, Saudara akan
                    dihubungi oleh PIC Magang dari kami untuk proses
                    selanjutnya.
                </p>
            </div>
        ),
    },
];

const AccordionItem = ({ faq, isOpen, onClick, index }) => {
    const contentEl = useRef(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="border-b border-gray-200 last:border-b-0"
        >
            <button
                onClick={onClick}
                className="w-full flex justify-between items-start text-left py-6 group"
            >
                <div className="flex-1 pr-8">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors duration-300">
                        {faq.question}
                    </h3>
                </div>
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                    <div
                        className={`w-4 h-px bg-gray-900 transition-all duration-300 ${
                            isOpen ? "rotate-0" : ""
                        }`}
                    />
                    <div
                        className={`w-4 h-px bg-gray-900 absolute transition-all duration-300 ${
                            isOpen ? "rotate-0 opacity-0" : "rotate-90"
                        }`}
                    />
                </div>
            </button>
            <div
                ref={contentEl}
                className="transition-all duration-500 ease-in-out overflow-hidden"
                style={{
                    maxHeight: isOpen
                        ? `${contentEl.current?.scrollHeight}px`
                        : "0px",
                }}
            >
                <div className="pb-6 pr-12">{faq.answer}</div>
            </div>
        </motion.div>
    );
};

export default function FAQSection() {
    const [openItems, setOpenItems] = useState(new Set());

    const handleToggle = (id) => {
        const newSet = new Set(openItems);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setOpenItems(newSet);
    };

    return (
        <section className="relative py-24 lg:py-32 bg-white">
            <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
                {/* Section Header */}
                <div className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
                            Pertanyaan Umum
                        </h2>
                        <div className="w-16 h-px bg-gray-900"></div>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl leading-relaxed">
                            Temukan jawaban cepat untuk pertanyaan yang sering
                            diajukan mengenai layanan dan program kami
                        </p>
                    </motion.div>
                </div>

                {/* FAQ Accordion */}
                <div className="max-w-4xl mx-auto">
                    {faqData.map((faq, index) => (
                        <AccordionItem
                            key={faq.id}
                            faq={faq}
                            isOpen={openItems.has(faq.id)}
                            onClick={() => handleToggle(faq.id)}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
