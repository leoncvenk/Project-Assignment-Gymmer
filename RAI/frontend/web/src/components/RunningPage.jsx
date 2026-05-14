import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function RunningPage() {

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center bg-[radial-gradient(circle_at_center,_#3a3a3a_0%,_#111111_70%,_#050505_100%)] overflow-x-hidden">

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-[1500px] px-8 lg:px-16 pt-32 lg:pt-0 min-h-screen flex-1 gap-12 lg:gap-16">
        
        {/* Left Column: Phone Image */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="w-full flex justify-center lg:justify-start flex-1 pb-16 lg:pb-0 order-2 lg:order-1"
        >
          <img 
            src="/images/phoneSteps.svg" 
            alt="Running App Interface" 
            className="w-full max-w-[500px] lg:max-w-[450px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
            draggable="false"
          />
        </motion.div>

        {/* Right Column: Text Content */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          className="flex flex-col items-start max-w-2xl w-full z-10 order-1 lg:order-2"
        >
          {/* Header */}
          <h1 
            className="text-white text-[60px] sm:text-[80px] md:text-[100px] lg:text-[110px] leading-[0.9] tracking-wide m-0 uppercase"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            TRACK YOUR<br />RUNNING
          </h1>
          
          {/* Paragraph Description */}
          <p 
            className="text-gray-300 text-lg sm:text-xl mt-6 leading-relaxed"
            style={{ fontFamily: "'Anonymous Pro', monospace" }}
          >
            Monitor your distance, pace, and total time with real time precision. Stay focused on the path ahead while Gymmer handles the data, making it easy to analyze your performance and share your progress with friends.
          </p>

          {/* Social Media Section */}
          <div className="mt-16 flex flex-col gap-6">
            <h2 
              className="text-white text-2xl sm:text-3xl tracking-wider m-0 uppercase"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              CHECK POSTS WITH #GYMMER TAG
            </h2>
            
            <div className="flex items-center gap-6">
              
              {/* Instagram SVG */}
              <motion.a 
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                href="#" 
                className="text-white hover:text-pink-500 transition-colors duration-300"
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </motion.a>
              
              {/* Facebook SVG */}
              <motion.a 
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                href="#" 
                className="text-white hover:text-blue-500 transition-colors duration-300"
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </motion.a>
              
              {/* Twitter (X) SVG */}
              <motion.a 
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                href="#" 
                className="text-white hover:text-blue-400 transition-colors duration-300"
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </motion.a>

              {/* TikTok SVG */}
              <motion.a 
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                href="#" 
                className="text-white hover:text-gray-300 transition-colors duration-300"
              >
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </motion.a>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}