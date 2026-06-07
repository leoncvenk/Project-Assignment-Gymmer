import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function WeeklyStatsCard({ weeklyData, totalHoursDisplay, onViewReport }) {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const values = daysOfWeek.map(day => weeklyData?.[day] || 0);
  const hasActivityData = values.some(value => Number(value) > 0);

  const chartData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: 'Active Time (min)',
        data: values,
        backgroundColor: (context) => {
          const value = context.dataset.data[context.dataIndex];
          return value >= 60 ? '#00a97f' : 'rgba(0, 169, 127, 0.4)';
        },
        hoverBackgroundColor: 'rgba(0, 169, 127, 0.8)',
        borderRadius: 4,
        borderSkipped: false,
        barPercentage: 0.6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#2b2b2b',
        titleFont: { size: 11, family: 'sans-serif' },
        bodyFont: { size: 12, family: 'sans-serif' },
        padding: 10,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const val = context.raw;
            if (val >= 60) return `${Math.floor(val / 60)}h ${val % 60}m`;
            return `${val}m`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: '#9ca3af', font: { size: 10 } },
        border: { display: false },
      },
      y: {
        display: false,
        grid: { display: false },
        max: Math.max(...values, 140) + 20,
      },
    },
    animation: { duration: 1000, easing: 'easeOutQuart' },
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm flex-shrink-0">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Active Time
          </h3>
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-bold text-[#2b2b2b]">
              {totalHoursDisplay}
              <span className="text-sm font-normal text-gray-500 ml-1">hrs</span>
            </h2>
          </div>
        </div>

        <button
          onClick={onViewReport}
          disabled={!hasActivityData}
          className={`text-[10px] font-semibold transition-colors ${
            hasActivityData
              ? 'text-[#00a97f] hover:underline cursor-pointer'
              : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          View Report
        </button>
      </div>

      <div className="text-[10px] text-gray-400 border-b border-gray-100 border-dashed pb-2 mb-4">
        <span>Target: 60m/day</span>
      </div>

      <div className="h-32 w-full relative">
        {hasActivityData ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-center">
            <div>
              <p className="text-xs font-semibold text-[#2b2b2b]">No activity data yet.</p>
              <p className="mt-1 text-[10px] text-gray-500">
                Logged workouts will appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}