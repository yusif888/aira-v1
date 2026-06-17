import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { motion } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";

import ErrorFallback from "@/Admin/Components/ErrorFallback";
import StatCard from "@/Admin/Components/Dashboard/StatCard";
import RecentActivity from "@/Admin/Components/Dashboard/RecentActivity";
import QuickActions from "@/Admin/Components/Dashboard/QuickActions";
import DashboardChart from "@/Admin/Components/Dashboard/DashboardChart";
import PendingTasks from "@/Admin/Components/Dashboard/PendingTasks";

export default function Dashboard() {
    const { stats, contentData, recentActivities, pendingTasks } =
        usePage().props;

    const [currentTime, setCurrentTime] = useState(new Date());

    const statCards = [
        {
            iconClass: "fas fa-users",
            title: "Total Pengguna",
            value: stats.totalUsers.toLocaleString("id-ID"),
            subtitle: `${stats.newUsersToday} pengguna baru hari ini`,
        },
        {
            iconClass: "fas fa-file-alt",
            title: "Total Dokumen",
            value: stats.totalDocuments.toLocaleString("id-ID"),
            subtitle: `${stats.documentsThisMonth} dokumen bulan ini`,
        },
        {
            iconClass: "fas fa-newspaper",
            title: "Berita Dipublikasi",
            value: stats.publishedNews.toLocaleString("id-ID"),
            subtitle: `${stats.newsThisMonth} berita bulan ini`,
        },
    ];

    const [quickActions] = useState([
        {
            iconClass: "fas fa-newspaper",
            title: "Buat Berita",
            subtitle: "Publikasi berita baru",
            color: "bg-blue-600",
        },
        {
            iconClass: "fas fa-file-upload",
            title: "Upload Dokumen",
            subtitle: "Tambah dokumen publik",
            color: "bg-green-600",
        },
        {
            iconClass: "fas fa-user-cog",
            title: "Kelola Pengguna",
            subtitle: "Atur hak akses",
            color: "bg-purple-600",
        },
        {
            iconClass: "fas fa-photo-video",
            title: "Upload Media",
            subtitle: "Foto & video kegiatan",
            color: "bg-yellow-600",
        },
    ]);

    const pendingTasksList = [];
    if (pendingTasks && pendingTasks.draftNews > 0) {
        pendingTasksList.push({
            icon: "fas fa-file-invoice",
            title: `${pendingTasks.draftNews} Berita Draft`,
            subtitle: "Menunggu persetujuan publikasi",
            bg: "bg-blue-50",
            color: "text-blue-600",
        });
    }

    useEffect(() => {
        const timeTimer = setInterval(() => setCurrentTime(new Date()), 1000);

        // Removed the dataTimer that was generating random data
        // The dashboard now uses live data from the backend

        return () => {
            clearInterval(timeTimer);
        };
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard Sistem Informasi Sumber Daya Air
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                            <i className="far fa-calendar text-gray-500"></i>
                            <span className="ml-1">
                                {currentTime.toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <i className="far fa-clock text-gray-500"></i>
                            <span className="ml-1">
                                {currentTime.toLocaleTimeString("id-ID")}
                            </span>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <div className="py-6">
                    <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                        {/* Welcome Section dengan animasi */}
                        <motion.div
                            className="mb-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold">
                                        Selamat Datang di Panel Administrator
                                    </h1>
                                    <p className="mt-1 text-blue-100">
                                        Dinas Pekerjaan Umum Sumber Daya Air
                                        Provinsi Jawa Timur
                                    </p>
                                </div>
                                <div className="hidden sm:block">
                                    <i className="fas fa-bell text-4xl text-blue-200"></i>
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                            {statCards.map((stat, idx) => (
                                <StatCard key={idx} {...stat} />
                            ))}
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* Recent Activity - 2 columns */}
                            <div className="lg:col-span-2">
                                <RecentActivity activities={recentActivities} />
                            </div>

                            {/* Quick Actions - 1 column */}
                            <div className="lg:col-span-1">
                                <QuickActions actions={quickActions} />
                            </div>
                        </div>

                        {/* Charts and Tasks Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <DashboardChart
                                    title="Publikasi Konten"
                                    subtitle="Distribusi konten bulan ini"
                                    type="pie"
                                    data={contentData}
                                />
                            </div>
                            <div className="lg:col-span-1">
                                <PendingTasks tasks={pendingTasksList} />
                            </div>
                        </div>
                    </div>
                </div>
            </ErrorBoundary>
        </AuthenticatedLayout>
    );
}
