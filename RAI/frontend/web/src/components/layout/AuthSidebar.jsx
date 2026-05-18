import { Camera, Activity, ChefHat, Route } from "lucide-react";

export default function AuthSidebar() {
  return (
    <div className="hidden lg:flex flex-col justify-center w-1/2 p-12 lg:px-24 xl:px-32 2xl:px-48 bg-[var(--background)]">
      <div className="flex items-center gap-2 mb-12">
        <img 
          src="/images/gymmerLogo.svg" 
          alt="Gymmer Logo" 
          className="h-12 w-12 object-contain" 
        />
        <span className="text-xl font-semibold text-[var(--text-primary)]">Gymmer</span>
      </div>

      <div className="space-y-10">
        <div className="flex gap-4">
          <Camera className="text-[var(--accent)] h-6 w-6 shrink-0 mt-1" />
          <div>
            <h3 className="text-[var(--text-primary)] font-medium mb-1">Snap & Track Nutrition</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">Instantly log your meals with real-time AI food recognition. Just take a picture, and we'll calculate the calories for you.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Activity className="text-[var(--accent)] h-6 w-6 shrink-0 mt-1" />
          <div>
            <h3 className="text-[var(--text-primary)] font-medium mb-1">Universal Activity Sync</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">Manage your workouts seamlessly by connecting to your smartwatches and wearable devices, keeping all your data in one place.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <ChefHat className="text-[var(--accent)] h-6 w-6 shrink-0 mt-1" />
          <div>
            <h3 className="text-[var(--text-primary)] font-medium mb-1">Endless Recipe Inspiration</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">Browse a diverse library of delicious, goal-oriented recipes tailored to fit your macros and dietary preferences.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Route className="text-[var(--accent)] h-6 w-6 shrink-0 mt-1" />
          <div>
            <h3 className="text-[var(--text-primary)] font-medium mb-1">Map, Run, and Connect</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">Track your outdoor routes with precision mapping, analyze your pace, and share your fitness journey with an active community.</p>
          </div>
        </div>
      </div>
    </div>
  );
}