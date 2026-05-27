import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, ChartTooltip, Legend);

export default function MacroDonutChart({ summary }) {
  const macroData = [
    { name: 'Protein', value: summary.protein, color: '#ef4444' },
    { name: 'Carbs', value: summary.carbs, color: '#eab308' },
    { name: 'Fats', value: summary.fat, color: '#3b82f6' },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between">
      <h3 className="text-sm font-semibold mb-2">Macro Breakdown</h3>
      
      <div className="flex-1 relative min-h-[200px] flex items-center justify-center">
        <div className="w-[170px] h-[170px] relative">
          <Doughnut 
            data={{
              labels: ['Protein', 'Carbs', 'Fats'],
              datasets: [{
                data: [summary.protein, summary.carbs, summary.fat],
                backgroundColor: ['#ef4444', '#eab308', '#3b82f6'],
                borderWidth: 0,
                cutout: '80%',
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              cutout: '80%'
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
            <span className="text-2xl font-bold text-[#2b2b2b]">{Math.round(summary.calories)}</span>
            <span className="text-[10px] font-semibold text-gray-500 uppercase">Kcal Total</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
        {macroData.map((macro, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: macro.color }}></div>
              <span className="text-[10px] font-semibold text-gray-500">{macro.name}</span>
            </div>
            <span className="text-sm font-bold">{Math.round(macro.value)}g</span>
          </div>
        ))}
      </div>
    </div>
  );
}