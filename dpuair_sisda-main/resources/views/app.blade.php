<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="facebook-domain-verification" content="45nypiqnqz74cogppmo8mr1khuqxqh" />
    <meta name="google-site-verification" content="KxWoxfczb8iZ0rkjQCKVJAVc8FECwDacTgyC4AXwyio" />

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    @if (request()->routeIs(['dashboard', 'profile.*', 'admin.*']) || str_starts_with(request()->path(), 'admin/'))
        <!-- Admin specific meta (no SEO needed) -->
        <meta name="robots" content="noindex, nofollow">
        <meta name="app-type" content="admin">
    @else
        <!-- Identifikasi Aplikasi Publik -->
        <meta name="app-type" content="public">

        <!-- Tag Meta SEO -->
        <meta name="description" content="@yield('description', 'Selamat datang di Dinas Pekerjaan Umum Sumber Daya Air Jawa Timur')">
        <meta name="keywords" content="@yield('keywords', 'Dinas PU SDA, Jawa Timur, pengelolaan air, infrastruktur')">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="@yield('og:title', 'Dinas Pekerjaan Umum Sumber Daya Air Jawa Timur')">
        <meta property="og:description" content="@yield('og:description', 'Selamat datang di Dinas Pekerjaan Umum Sumber Daya Air Jawa Timur')">

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="{{ url()->current() }}">
        <meta property="twitter:title" content="@yield('twitter:title', 'Dinas Pekerjaan Umum Sumber Daya Air Jawa Timur')">
        <meta property="twitter:description" content="@yield('twitter:description', 'Selamat datang di Dinas Pekerjaan Umum Sumber Daya Air Jawa Timur')">

        <!-- Canonical URL -->
        <link rel="canonical" href="{{ url()->current() }}">

        <!-- JSON-LD: Organization -->
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "GovernmentOrganization",
            "name": "Dinas Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur",
            "alternateName": "SISDA Jawa Timur",
            "url": "{{ config('app.url') }}",
            "logo": "{{ asset('assets/images/PUSDAJATIM_WHITE.png') }}",
            "description": "Sistem Informasi Sumber Daya Air Dinas Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur"
        }
        </script>

        <!-- JSON-LD: WebSite + SearchAction -->
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "SISDA - Dinas PU SDA Jawa Timur",
            "alternateName": "SISDA",
            "url": "{{ config('app.url') }}",
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "{{ config('app.url') }}/berita?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
            }
        }
        </script>

        <!-- JSON-LD: SiteNavigationElement (sinyal sitelinks) -->
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SiteNavigationElement",
                    "name": "Berita",
                    "url": "{{ config('app.url') }}/berita"
                },
                {
                    "@type": "SiteNavigationElement",
                    "name": "Profil",
                    "url": "{{ config('app.url') }}/profil/selayang-pandang"
                },
                {
                    "@type": "SiteNavigationElement",
                    "name": "Infrastruktur SDA",
                    "url": "{{ config('app.url') }}/infrastruktur-sda"
                },
                {
                    "@type": "SiteNavigationElement",
                    "name": "Portal Data",
                    "url": "{{ config('app.url') }}/portal-data"
                },
                {
                    "@type": "SiteNavigationElement",
                    "name": "Dokumen & Regulasi",
                    "url": "{{ config('app.url') }}/dokumen"
                },
                {
                    "@type": "SiteNavigationElement",
                    "name": "Pelayanan",
                    "url": "{{ config('app.url') }}/pelayanan"
                },
                {
                    "@type": "SiteNavigationElement",
                    "name": "SDA Dalam Angka",
                    "url": "{{ config('app.url') }}/sda-dalam-angka"
                },
                {
                    "@type": "SiteNavigationElement",
                    "name": "Galeri",
                    "url": "{{ config('app.url') }}/galeri"
                }
            ]
        }
        </script>
    @endif

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-HF53EL3453"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());

        gtag('config', 'G-HF53EL3453');
    </script>

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="{{ asset('assets/images/PUSDAJATIM_WHITE.png') }}">
    <link rel="shortcut icon" type="image/png" href="{{ asset('assets/images/PUSDAJATIM_WHITE.png') }}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])

    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
