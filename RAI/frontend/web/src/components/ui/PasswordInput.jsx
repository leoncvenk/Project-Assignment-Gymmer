import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ label, id, action, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-sm text-[var(--muted)]">{label}</label>
        {action && action}
      </div>
      <div className="relative">
        <input 
          id={id} 
          name={id} 
          type={showPassword ? "text" : "password"} 
          placeholder="••••••"
          className="w-full bg-transparent border border-[var(--border)] rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--border)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
          required
          {...props}
        />
        <button 
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}