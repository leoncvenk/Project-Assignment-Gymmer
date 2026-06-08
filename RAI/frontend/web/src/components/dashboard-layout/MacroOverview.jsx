import { Flame, Beef, Wheat, Droplet } from 'lucide-react';

export default function MacroOverview({ summary }) {
  const macros = [
    { label: "Calories Logged", value: summary.calories, unit: "kcal", icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Total Protein", value: summary.protein, unit: "g", icon: Beef, color: "text-red-500", bg: "bg-red-50" },
    { label: "Total Carbs", value: summary.carbs, unit: "g", icon: Wheat, color: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "Total Fats", value: summary.fat, unit: "g", icon: Droplet, color: "text-blue-500", bg: "bg-blue-50" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {macros.map((macro, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col hover:shadow-sm transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${macro.bg}`}>
              <macro.icon className={`h-4 w-4 ${macro.color}`} strokeWidth={2.5} />
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{macro.label}</p>
          </div>
          <div className="flex items-baseline gap-1">
            <h3 className="text-2xl font-bold">{Math.round(macro.value)}</h3>
            <span className="text-sm font-medium text-gray-400">{macro.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}