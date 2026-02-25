"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface KpiChartProps {
    dates: string[];
    tasksDone: number[];
    moods: number[];
}

export default function KpiChart({ dates, tasksDone, moods }: KpiChartProps) {
    const chartData = {
        labels: dates.map(d => {
            const parts = d.split('-');
            return `${parts[1]}/${parts[2]}`;
        }),
        datasets: [
            {
                type: "line" as const,
                label: "Humeur",
                data: moods,
                borderColor: "#6366f1",
                backgroundColor: "#6366f133",
                borderWidth: 2.5,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 5,
                fill: true,
                yAxisID: "y1",
                order: 1,
            },
            {
                type: "bar" as const,
                label: "Tâches Terminées",
                data: tasksDone,
                backgroundColor: "rgba(129, 140, 248, 0.25)",
                borderColor: "rgba(129, 140, 248, 0.5)",
                borderWidth: 1,
                borderRadius: 4,
                yAxisID: "y",
                order: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index" as const,
            intersect: false,
        },
        plugins: {
            legend: {
                display: true,
                position: "bottom" as const,
                labels: {
                    color: "#94a3b8",
                    font: { family: "Inter", size: 11 },
                    boxWidth: 12,
                    padding: 16,
                },
            },
            tooltip: {
                backgroundColor: "#ffffff",
                titleColor: "#1e293b",
                bodyColor: "#475569",
                borderColor: "rgba(0,0,0,0.1)",
                borderWidth: 1,
                cornerRadius: 8,
                padding: 10,
                titleFont: { family: "Inter", weight: "bold" as const },
                bodyFont: { family: "Inter" },
            },
        },
        scales: {
            x: {
                ticks: { color: "#94a3b8", font: { family: "Inter", size: 9 }, maxTicksLimit: 10 },
                grid: { display: false },
            },
            y: {
                position: "left" as const,
                title: { display: true, text: "Tâches", color: "#94a3b8", font: { family: "Inter", size: 10 } },
                ticks: { color: "#94a3b8", font: { family: "Inter", size: 10 }, stepSize: 1 },
                grid: { color: "rgba(0,0,0,0.06)", borderDash: [5, 5] },
                beginAtZero: true,
            },
            y1: {
                position: "right" as const,
                title: { display: true, text: "Humeur", color: "#94a3b8", font: { family: "Inter", size: 10 } },
                ticks: { color: "#94a3b8", font: { family: "Inter", size: 10 } },
                grid: { display: false },
                min: 0,
                max: 10,
            },
        },
    };

    return (
        <div className="w-full h-[300px]">
            <Chart type="bar" data={chartData as any} options={chartOptions as any} />
        </div>
    );
}
