import React, { useRef, useState, useEffect } from "react";
import Chart from "chart.js/auto";

/**
 * Komponen grafik menggunakan Chart.js.
 *
 * @param {Object} props
 * @param {string} props.title - Judul grafik
 * @param {string} [props.subtitle] - Subjudul grafik
 * @param {string} [props.type="line"] - Tipe grafik (line, bar, pie, doughnut)
 * @param {Object} props.data - Data grafik Chart.js { labels: [], datasets: [] }
 */
const DashboardChart = ({ title, subtitle, type = "line", data }) => {
    const chartRef = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance) {
                chartInstance.destroy();
            }

            const newChart = new Chart(chartRef.current, {
                type,
                data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                    plugins: {
                        legend: {
                            position: "top",
                        },
                    },
                },
            });

            setChartInstance(newChart);
        }

        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [data, type]);

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                {subtitle && (
                    <p className="text-sm text-gray-500">{subtitle}</p>
                )}
            </div>
            <div className="h-64">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
};

export default DashboardChart;
