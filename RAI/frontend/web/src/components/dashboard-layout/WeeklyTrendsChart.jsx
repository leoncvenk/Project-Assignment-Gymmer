import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function WeeklyTrendsChart({ weeklyData }) {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const dailyCalories = weeklyData?.daily_calories || weeklyData?.days || [];

  const chartValues = daysOfWeek.map((day, index) => {
    if (Array.isArray(dailyCalories)) {
      const dayData = dailyCalories[index];

      if (typeof dayData === 'number') return dayData;
      if (dayData?.calories !== undefined) return dayData.calories;
      if (dayData?.total_calories !== undefined) return dayData.total_calories;
    }

    if (weeklyData?.[day] !== undefined) {
      return weeklyData[day];
    }

    return 0;
  });

  const hasChartData = chartValues.some(value => Number(value) > 0);
  const avgCalories = Math.round(weeklyData?.avg_calories || 0);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col flex-1 min-h-[220px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Calorie Intake (7 Days)</h3>
        <span className="flex items-center text-[10px] font-medium text-[#00a97f] bg-[#e6f7f2] px-2 py-1 rounded-full">
          Avg: {avgCalories} kcal/day
        </span>
      </div>

      <div className="flex-1 w-full relative">
        {hasChartData ? (
          <Bar
            data={{
              labels: daysOfWeek,
              datasets: [
                {
                  label: 'Calories',
                  data: chartValues,
                  backgroundColor: '#00a97f',
                  borderRadius: 4,
                  barThickness: 40,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: {
                  grid: { display: false },
                  border: { display: false },
                  ticks: { font: { size: 10 }, color: '#9ca3af' },
                },
                y: {
                  grid: { color: '#f3f4f6', drawBorder: false, tickLength: 0 },
                  border: { display: false },
                  ticks: { font: { size: 10 }, color: '#9ca3af', padding: 10 },
                },
              },
            }}
          />
        ) : (
          <div className="flex h-full min-h-[160px] items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-center">
            <div>
              <p className="text-sm font-semibold text-[#2b2b2b]">No calorie data yet.</p>
              <p className="mt-1 text-xs text-gray-500">
                Logged meals will appear in this weekly chart.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}