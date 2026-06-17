import { Link, Head } from "@inertiajs/react";
import GuestLayout from "../Layouts/GuestLayout";
import CurahHujanSection from "@/Public/Components/Beranda/CurahHujanSection";
import InformasiBanjirSection from "@/Public/Components/Beranda/InformasiBanjirSection";
import HeroSection from "@/Public/Components/Beranda/HeroSection";
import PortalDataSection from "@/Public/Components/Beranda/PortalDataSection";
import TaglineSection from "@/Public/Components/Beranda/TaglineSection";
import StatsCarouselSection from "@/Public/Components/Beranda/StatsCarouselSection";
import BeritaSection from "@/Public/Components/Beranda/BeritaSection";
import SocialMediaEmbed from "@/Public/Components/Beranda/SocialMediaEmbed";
import FAQSection from "../Components/Beranda/FAQSection";
import AntrianSection from "../Components/Beranda/AntrianSection";
import AiraChat from "../Components/AiraChat";

export default function Welcome({ auth, heroNews, latestNews, weatherData }) {
    return (
        <GuestLayout>
            <Head>
                <title>Beranda</title>
                <meta
                    name="description"
                    content="Situs resmi Dinas Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur. Temukan informasi terbaru tentang program, kegiatan, data SDA, dan layanan publik kami."
                />
            </Head>

            {/* Hero Section */}
            <HeroSection weatherData={weatherData} />

            {/* Parallax section — bg-fixed only on desktop, mobile uses bg-scroll (iOS doesn't support bg-fixed) */}
            <div className="h-[50vh] md:h-[90vh] w-full bg-scroll md:bg-fixed bg-center bg-cover bg-no-repeat bg-[url('/storage/images/CCROOM.jpeg')]"></div>
            {/* Curah Hujan Section */}
            {/* <CurahHujanSection /> */}

            {/* <StatsCarouselSection /> */}
            <StatsCarouselSection />

            {/* Informasi Banjir Section */}
            <InformasiBanjirSection />

            {/* Portal Data Section */}
            <PortalDataSection />

            {/* Berita Section - Simplified */}
            <BeritaSection latestNews={latestNews} />

            {/* Social Media Section */}
            <SocialMediaEmbed />

            {/* Peta Pos Kewenangan Section */}
            {/* <PetaPosKewenanganSection /> */}

            {/* FFWSSection */}
            {/* <FFWSSection /> */}

            {/* FAQ Section */}
            <FAQSection />

            {/* Antrian Pelayanan Section */}
            <AntrianSection />

            <AiraChat /> 

        </GuestLayout>
    );
}
