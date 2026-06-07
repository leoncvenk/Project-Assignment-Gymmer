import { motion } from "framer-motion";
import Footer from "../layout/Footer";
import Navigation from "../ui/Navigation";

const GoogleIcon = (props) => <img src="https://svgl.app/library/google.svg" alt="Google" {...props} />;
const AppleIcon = (props) => <img src="https://svgl.app/library/apple_dark.svg" alt="Apple" {...props} />;

export default function BottomPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[var(--background)] overflow-x-hidden text-[var(--text-primary)]">
      <Navigation />
      <div className="flex-1 flex flex-col justify-center w-full max-w-[1500px] mx-auto px-8 lg:px-16 pt-32 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32 w-full mb-20">
          <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }} className="flex flex-col items-start text-left">
            <h1 className="text-[var(--text-primary)] text-[40px] sm:text-[50px] lg:text-[60px] leading-none tracking-wider mb-6 uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>
              BROWSE RECIPES
            </h1>
            <p className="text-[var(--muted)] text-lg sm:text-xl leading-relaxed max-w-md" style={{ fontFamily: "'Anonymous Pro', monospace" }}>
              Discover a library of healthy, easy to follow recipes that don't sacrifice flavor. From quick breakfasts to meal prep staples, find the inspiration you need to stay on track in the kitchen.
            </p>
          </motion.div>

          <motion.div initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut", delay: 0.2 }} className="flex flex-col items-start md:items-end text-left md:text-right">
            <h1 className="text-[var(--text-primary)] text-[40px] sm:text-[50px] lg:text-[60px] leading-none tracking-wider mb-6 uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>
              TRACK YOUR WORKOUT
            </h1>
            <p className="text-[var(--muted)] text-lg sm:text-xl leading-relaxed max-w-md" style={{ fontFamily: "'Anonymous Pro', monospace" }}>
              Log every set, rep, and personal best with our intuitive tracker. Visualize your strength gains over time and stay consistent with structured routines tailored to your level.
            </p>
          </motion.div>
        </div>

        <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut", delay: 0.4 }} className="flex flex-col items-center mt-10">
          <h2 className="text-[var(--text-primary)] text-[40px] sm:text-[50px] lg:text-[60px] leading-none tracking-wider mb-8 uppercase text-center" style={{ fontFamily: "'Anton', sans-serif" }}>
            GET IN SHAPE TODAY
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[var(--surface-dark)] border border-[var(--border)] flex items-center gap-3 px-6 py-3 rounded-xl hover:bg-[var(--surface)] transition-colors cursor-pointer">
              <GoogleIcon className="w-7 h-7" />
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] text-[var(--muted)] uppercase leading-none mb-1">Get it on</span>
                <span className="text-lg text-[var(--text-primary)] font-semibold leading-none tracking-wide">Google Play</span>
              </div>
            </motion.button>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[var(--surface-dark)] border border-[var(--border)] flex items-center gap-3 px-6 py-3 rounded-xl hover:bg-[var(--surface)] transition-colors cursor-pointer">
              <AppleIcon className="w-7 h-7" />
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] text-[var(--muted)] uppercase leading-none mb-1">Download on the</span>
                <span className="text-lg text-[var(--text-primary)] font-semibold leading-none tracking-wide">App Store</span>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}