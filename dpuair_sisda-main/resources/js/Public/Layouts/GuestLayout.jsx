import { Head } from "@inertiajs/react";

import Header from "@/Public/Components/Header";
import Footer from "@/Public/Components/Footer";

export default function GuestLayout({
    children,
    laravelVersion,
    phpVersion,
    portalData,
    transparentAtTop = false,
    title = "SISDA - Dinas PU SDA Jawa Timur",
    description = "Sistem Informasi Sumber Daya Air Dinas Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur",
}) {
    return (
        <>
            <Head title={title}>
                <meta name="description" content={description} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
            </Head>
            <div className="min-h-screen flex flex-col">
                <Header
                    portalData={portalData}
                    transparentAtTop={transparentAtTop}
                />

                <main className="flex-1">{children}</main>

                {/* Only show Footer if version props are provided */}
                <Footer
                    laravelVersion={laravelVersion}
                    phpVersion={phpVersion}
                />
            </div>
        </>
    );
}
