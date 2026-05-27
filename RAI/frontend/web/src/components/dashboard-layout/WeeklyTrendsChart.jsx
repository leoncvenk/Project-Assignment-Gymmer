import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function WeeklyTrendsChart({ weeklyData }) {
  const avgDaily = weeklyData?.avg_calories || 2000;
  
  // Replace with real logic if weeklyData changes shape
  const mockWeeklyChart = [
    { day: 'Mon', calories: avgDaily * 0.9 },
    { day: 'Tue', calories: avgDaily * 1.1 },
    { day: 'Wed', calories: avgDaily * 0.85 },
    { day: 'Thu', calories: avgDaily * 1.2 },
    { day: 'Fri', calories: avgDaily * 0.95 },
    { day: 'Sat', calories: avgDaily * 1.3 },
    { day: 'Sun', calories: avgDaily * 1.0 },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col flex-1 min-h-[220px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Calorie Intake (7 Days)</h3>
        <span className="flex items-center text-[10px] font-medium text-[#00a97f] bg-[#e6f7f2] px-2 py-1 rounded-full">
          Avg: {Math.round(weeklyData?.avg_calories || 0)} kcal/day
        </span>
      </div>
      <div className="flex-1 w-full relative">
        <Bar 
          data={{
            labels: mockWeeklyChart.map(d => d.day),
            datasets: [{
              label: 'Calories',
              data: mockWeeklyChart.map(d => d.calories),
              backgroundColor: '#00a97f',
              borderRadius: 4,
              barThickness: 40,
            }]
          }} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 10 }, color: '#9ca3af' } },
              y: { grid: { color: '#f3f4f6', drawBorder: false, tickLength: 0 }, border: { display: false }, ticks: { font: { size: 10 }, color: '#9ca3af', padding: 10 } }
            }
          }} 
        />
      </div>
    </div>
  );
}