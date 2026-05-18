import { motion } from "framer-motion";

export default function PrimaryButton({ children, onClick, disabled, className = "", style }) {
  return (
    <motion.button 
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-primary)] px-10 py-4 rounded-3xl text-xl sm:text-2xl font-bold transition-all shadow-[0_0_15px_var(--accent)] hover:shadow-[0_0_25px_var(--accent)] ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      style={style}
    >
      {children}
    </motion.button>
  );
}