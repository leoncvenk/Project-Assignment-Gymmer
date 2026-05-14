import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");

    try {
      // TODO: Replace with your actual password reset API endpoint
      console.log("Password reset requested for:", email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success state
      setIsSubmitted(true);
    } catch (error) {
      console.error("Password reset error:", error);
      alert("Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_#3a3a3a_0%,_#111111_70%,_#050505_100%)] overflow-x-hidden">
      {/* Main Content: Forgot Password Form */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="w-full max-w-md px-6 mt-20 lg:mt-0 z-10"
        style={{ fontFamily: "'Anonymous Pro', monospace" }}
      >
        <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full">
          
          {!isSubmitted ? (
            <>
              <div className="text-left mb-8">
                <h2 className="text-3xl text-white font-bold tracking-wide mb-2">Reset Password</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-gray-300">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="jdoe@example.com" 
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                      required 
                    />
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold tracking-wide mt-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all cursor-pointer"
                >
                  SEND RESET LINK
                </motion.button>
              </form>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl text-white font-bold tracking-wide mb-3">Check your email</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                We have sent a password reset link to your email. Please check your inbox and spam folder.
              </p>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsSubmitted(false)}
                className="w-full bg-white/5 border border-white/10 text-white py-3.5 rounded-xl font-bold tracking-wide transition-all cursor-pointer hover:bg-white/10"
              >
                TRY ANOTHER EMAIL
              </motion.button>
            </motion.div>
          )}

          {/* Footer Link to return */}
          <div className="mt-8 flex flex-col items-center">
            <Link 
              to="/profile" 
              className="cursor-pointer flex items-center text-gray-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
}