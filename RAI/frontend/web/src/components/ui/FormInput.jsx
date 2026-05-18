export default function FormInput({ label, id, type = "text", optional = false, ...props }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm text-[var(--muted)]">
        {label} {optional && <span className="text-[var(--border)]">(Optional)</span>}
      </label>
      <input 
        id={id} 
        name={id} 
        type={type} 
        className="w-full bg-transparent border border-[var(--border)] rounded-xl py-2.5 px-3.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--border)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all [color-scheme:dark]" 
        {...props}
      />
    </div>
  );
}