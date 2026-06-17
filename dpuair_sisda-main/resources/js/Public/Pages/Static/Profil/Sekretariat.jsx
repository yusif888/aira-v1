import GuestLayout from "@/Public/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";

export default function Sekretariat() {
    return (
        <GuestLayout>
            <Head>
                <title>Sekretariat - Dinas PU SDA Jatim</title>
                <meta
                    name="description"
                    content="Pusat koordinasi administrasi, perencanaan keuangan, dan pengelolaan sumber daya manusia di Dinas PU Sumber Daya Air Provinsi Jawa Timur."
                />
            </Head>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 h-[35vh] flex items-center overflow-hidden -mt-0">
                <div className="absolute inset-0 opacity-10"></div>

                {/* Floating Elements */}
                <div className="absolute top-10 left-20 w-12 h-12 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-1/3 right-32 w-16 h-16 bg-cyan-400/20 rounded-full blur-2xl animate-bounce"></div>
                <div className="absolute bottom-16 left-1/4 w-14 h-14 bg-blue-300/15 rounded-full blur-xl animate-pulse delay-1000"></div>

                {/* Main Content */}
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                            <span className="text-cyan-300 text-sm font-medium">
                                🏛️ Koordinasi & Administrasi Dinas SDA Provinsi
                                Jawa Timur
                            </span>
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            Sekretariat
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">
                                &nbsp;Dinas
                            </span>
                        </h1>

                        <p className="text-lg text-blue-100 leading-relaxed max-w-3xl mx-auto">
                            Pusat koordinasi administrasi, perencanaan keuangan,
                            dan pengelolaan sumber daya manusia untuk mendukung
                            kelancaran operasional organisasi.
                        </p>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
