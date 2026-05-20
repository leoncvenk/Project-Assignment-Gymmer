import { motion } from 'framer-motion';

export default function ConnectionsTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h3 className="text-xl text-[var(--text-primary)] font-bold tracking-wide">Connected Accounts</h3>
      <div className="space-y-3 max-w-md">
        <div className="flex items-center justify-between p-4 bg-[var(--surface-dark)] border border-[var(--border)] rounded-2xl">
          <div className="flex items-center gap-3">
            <img src="https://svgl.app/library/google.svg" alt="Google" className="w-6 h-6" />
            <span className="text-sm text-[var(--text-primary)] font-medium">Google</span>
          </div>
          <button className="text-xs text-[var(--accent)] hover:text-[var(--text-primary)] transition cursor-pointer">Connect</button>
        </div>
        <div className="flex items-center justify-between p-4 bg-[var(--surface-dark)] border border-[var(--border)] rounded-2xl">
          <div className="flex items-center gap-3">
            <img src="https://svgl.app/library/apple_dark.svg" alt="Apple" className="w-6 h-6" />
            <span className="text-sm text-[var(--text-primary)] font-medium">Apple</span>
          </div>
          <button className="text-xs text-[var(--muted)] cursor-not-allowed">Coming Soon</button>
        </div>
      </div>
    </motion.div>
  );
}