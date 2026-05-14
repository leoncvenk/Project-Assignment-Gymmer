import { motion } from "framer-motion";

// Icons
const GoogleIcon = (props) => (
  <img src="https://svgl.app/library/google.svg" alt="Google" {...props} />
);
const AppleIcon = (props) => (
  <img src="https://svgl.app/library/apple_dark.svg" alt="Apple" {...props} />
);

export default function BottomPage() {

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[radial-gradient(circle_at_center,_#3a3a3a_0%,_#111111_70%,_#050505_100%)] overflow-x-hidden text-white">

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center w-full max-w-[1500px] mx-auto px-8 lg:px-16 pt-32 pb-16">
        
        {/* Top Text Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32 w-full mb-20">
          
          {/* Left Side: Recipes */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-start text-left"
          >
            <h1 
              className="text-[40px] sm:text-[50px] lg:text-[60px] leading-none tracking-wider mb-6 uppercase"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              BROWSE RECIPES
            </h1>
            <p 
              className="text-gray-300 text-lg sm:text-xl leading-relaxed max-w-md"
              style={{ fontFamily: "'Anonymous Pro', monospace" }}
            >
              Discover a library of healthy, easy to follow recipes that don't sacrifice flavor. From quick breakfasts to meal prep staples, find the inspiration you need to stay on track in the kitchen.
            </p>
          </motion.div>

          {/* Right Side: Workouts */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col items-start md:items-end text-left md:text-right"
          >
            <h1 
              className="text-[40px] sm:text-[50px] lg:text-[60px] leading-none tracking-wider mb-6 uppercase"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              TRACK YOUR WORKOUT
            </h1>
            <p 
              className="text-gray-300 text-lg sm:text-xl leading-relaxed max-w-md"
              style={{ fontFamily: "'Anonymous Pro', monospace" }}
            >
              Log every set, rep, and personal best with our intuitive tracker. Visualize your strength gains over time and stay consistent with structured routines tailored to your level.
            </p>
          </motion.div>

        </div>

        {/* Center Action Section */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          className="flex flex-col items-center mt-10"
        >
          <h2 
            className="text-[40px] sm:text-[50px] lg:text-[60px] leading-none tracking-wider mb-8 uppercase text-center"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            GET IN SHAPE TODAY
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Google Play Button */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black border border-white/20 flex items-center gap-3 px-6 py-3 rounded-xl hover:bg-[#111] transition-colors cursor-pointer"
            >
              <GoogleIcon className="w-7 h-7" />
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] text-gray-300 uppercase leading-none mb-1">Get it on</span>
                <span className="text-lg font-semibold leading-none tracking-wide">Google Play</span>
              </div>
            </motion.button>

            {/* App Store Button */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black border border-white/20 flex items-center gap-3 px-6 py-3 rounded-xl hover:bg-[#111] transition-colors cursor-pointer"
            >
              <AppleIcon className="w-7 h-7" />
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] text-gray-300 uppercase leading-none mb-1">Download on the</span>
                <span className="text-lg font-semibold leading-none tracking-wide">App Store</span>
              </div>
            </motion.button>
          </div>
        </motion.div>

      </div>

      {/* Footer Section */}
      <footer className="w-full bg-[#161616] border-t border-white/5 py-12 px-8 lg:px-16 mt-auto">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
          
          {/* Footer Left */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
            <h3 className="text-2xl tracking-wider uppercase mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>
              FOLLOW US
            </h3>
            {['Facebook', 'Instagram', 'TikTok', 'Twitter'].map((link) => (
              <a 
                key={link} 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                style={{ fontFamily: "'Anonymous Pro', monospace" }}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Footer Center (Logo) */}
          <div className="flex flex-col items-center gap-4">
            <img 
              src="/images/gymmerlogo.png" 
              alt="Gymmer Logo" 
              className="w-16 h-16 object-contain"
            />
            <span 
              className="text-gray-500 text-sm tracking-widest"
              style={{ fontFamily: "'Anonymous Pro', monospace" }}
            >
              GYMMER 2026
            </span>
          </div>

          {/* Footer Right */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right gap-3">
            <h3 className="text-2xl tracking-wider uppercase mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>
              TERMS & CONDITIONS
            </h3>
            {['Privacy Policy', 'Terms', 'Privacy Settings'].map((link) => (
              <a 
                key={link} 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                style={{ fontFamily: "'Anonymous Pro', monospace" }}
              >
                {link}
              </a>
            ))}
          </div>

        </div>
      </footer>

    </div>
  );
}