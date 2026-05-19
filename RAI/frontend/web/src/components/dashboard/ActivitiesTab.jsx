import { motion } from 'framer-motion';

export default function ActivitiesTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h3 className="text-xl text-[var(--text-primary)] font-bold tracking-wide">My Activities</h3>
      <div className="bg-[var(--surface-dark)] border border-[var(--border)] rounded-2xl p-10 flex flex-col items-center justify-center text-center">
        <p className="text-[var(--muted)]">Activity tracking is coming soon...</p>
      </div>
    </motion.div>
  );
}