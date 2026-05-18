import { Settings, Shield, ThumbsUp, Lightbulb, Dumbbell } from "lucide-react";

export default function AuthSidebar() {
  return (
    <div className="hidden lg:flex flex-col justify-center w-1/2 p-12 lg:px-24 xl:px-32 2xl:px-48 bg-[var(--background)]">
      <div className="flex items-center gap-2 mb-12">
        <Dumbbell className="text-[var(--accent)] h-6 w-6" />
        <span className="text-xl font-semibold text-[var(--text-primary)]">Gymmer</span>
      </div>

      <div className="space-y-10">
        <div className="flex gap-4">
          <Settings className="text-[var(--accent)] h-6 w-6 shrink-0 mt-1" />
          <div>
            <h3 className="text-[var(--text-primary)] font-medium mb-1">Adaptable performance</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">Our product effortlessly adjusts to your needs, boosting efficiency and simplifying your tasks.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Shield className="text-[var(--accent)] h-6 w-6 shrink-0 mt-1" />
          <div>
            <h3 className="text-[var(--text-primary)] font-medium mb-1">Built to last</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">Experience unmatched durability that goes above and beyond with lasting investment.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <ThumbsUp className="text-[var(--accent)] h-6 w-6 shrink-0 mt-1" />
          <div>
            <h3 className="text-[var(--text-primary)] font-medium mb-1">Great user experience</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">Integrate our product into your routine with an intuitive and easy-to-use interface.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Lightbulb className="text-[var(--accent)] h-6 w-6 shrink-0 mt-1" />
          <div>
            <h3 className="text-[var(--text-primary)] font-medium mb-1">Innovative functionality</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">Stay ahead with features that set new standards, addressing your evolving needs better than the rest.</p>
          </div>
        </div>
      </div>
    </div>
  );
}