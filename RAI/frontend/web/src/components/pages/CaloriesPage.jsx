import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import PrimaryButton from "../ui/PrimaryButton";

export default function CaloriesPage() {
  const navigate = useNavigate(); 

  const handleStartTracking = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/profile'); 
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center bg-[var(--background)] overflow-x-hidden">

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-[1700px] px-8 lg:px-16 pt-32 lg:pt-0 min-h-screen flex-1 gap-12 lg:gap-8">
        
        {/* Left Column: Text Content */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col items-start max-w-2xl w-full z-10"
        >
          {/* Header */}
          <h1 
            className="text-[var(--text-primary)] text-[70px] sm:text-[90px] md:text-[110px] lg:text-[130px] leading-[0.9] tracking-wide m-0"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            TRACK<br />CALORIES
          </h1>
          
          {/* Paragraph Description */}
          <p 
            className="text-[var(--muted)] text-lg sm:text-xl mt-6 leading-relaxed"
            style={{ fontFamily: "'Anonymous Pro', monospace" }}
          >
            Stay on track, stay accountable. Whether you're aiming for a deficit or a surplus, our intuitive tracker helps you hit your daily goals with ease. Watch your progress unfold as you master your nutrition one meal at a time.
          </p>

          {/* Feature List */}
          <ul className="mt-8 flex flex-col gap-4 w-full" style={{ fontFamily: "'Anonymous Pro', monospace" }}>
            <li className="flex items-start gap-3">
              <p className="text-[var(--muted)] text-lg sm:text-xl">
                <span className="text-[var(--accent)] font-bold tracking-wide">Instant Logging :</span> Barcode scanning & quick add.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <p className="text-[var(--muted)] text-lg sm:text-xl">
                <span className="text-[var(--accent)] font-bold tracking-wide">Macro Tracking :</span> Protein, Carbs, Fats at a glance.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <p className="text-[var(--muted)] text-lg sm:text-xl">
                <span className="text-[var(--accent)] font-bold tracking-wide">Goal Setting :</span> Tailor targets to your specific journey.
              </p>
            </li>
          </ul>
          
          <PrimaryButton onClick={handleStartTracking} className="mt-12" style={{ fontFamily: "'Anonymous Pro', monospace" }}>
            START TRACKING
          </PrimaryButton>
        </motion.div>

        {/* Right Column: Phone Image */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          className="w-full flex justify-center lg:justify-end flex-1 pb-16 lg:pb-0"
        >
          <img 
            src="/images/phoneCalories.svg" 
            alt="Calories App Interface" 
            className="w-full max-w-[700px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
            draggable="false"
          />
        </motion.div>

      </div>
    </div>
  );
}