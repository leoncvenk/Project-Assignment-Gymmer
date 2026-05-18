import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Settings, Shield, ThumbsUp, Lightbulb, Dumbbell, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");

    try {
      console.log("Password reset requested for:", email);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (error) {
      console.error("Password reset error:", error);
      alert("Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[var(--background)] text-[var(--text-primary)] font-sans">
      {/* Left Side - Information Panel */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 p-12 lg:px-24 xl:px-32 2xl:px-48 bg-[var(--background)]">
        <div className="flex items-center gap-2 mb-12">
          <Dumbbell className="text-[var(--accent)] h-6 w-6" />
          <span className="text-xl font-semibold text-[var(--text-primary)]">Gymmer</span>
        </div>

        <div className="space-y-10">
          <div className="flex gap-4">
            <Settings className="text-[var(--accent)] h-6 w-6 shrink-0 mt-1" />
            <div>
              <h3 className="text-[var(--text-primary)] font-medium mb-1">Adaptable performance</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">Our product effortlessly adjusts to your needs, boosting efficiency and simplifying your tasks.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Shield className="text-[var(--accent)] h-6 w-6 shrink-0 mt-1" />
            <div>
              <h3 className="text-[var(--text-primary)] font-medium mb-1">Built to last</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">Experience unmatched durability that goes above and beyond with lasting investment.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <ThumbsUp className="text-[var(--accent)] h-6 w-6 shrink-0 mt-1" />
            <div>
              <h3 className="text-[var(--text-primary)] font-medium mb-1">Great user experience</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">Integrate our product into your routine with an intuitive and easy-to-use interface.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Lightbulb className="text-[var(--accent)] h-6 w-6 shrink-0 mt-1" />
            <div>
              <h3 className="text-[var(--text-primary)] font-medium mb-1">Innovative functionality</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">Stay ahead with features that set new standards, addressing your evolving needs better than the rest.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--background)]">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[450px] bg-[var(--surface-dark)] border border-[var(--border)] rounded-2xl p-8 sm:p-10 shadow-2xl"
        >
          <Link to="/profile" className="inline-flex items-center text-sm text-[var(--muted)] hover:text-[var(--text-primary)] transition-colors mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>

          {!isSubmitted ? (
            <>
              <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">Reset Password</h1>
              <p className="text-sm text-[var(--muted)] mb-8 leading-relaxed">
                Enter the email address associated with your account and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm text-[var(--muted)]">Email</label>
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="your@email.com" 
                    className="w-full bg-transparent border border-[var(--border)] rounded-xl py-2.5 px-3.5 text-[var(--text-primary)] placeholder:text-[var(--border)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-primary)] font-medium py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Send reset link
                </button>
              </form>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)]/10 mb-6">
                <CheckCircle2 className="h-8 w-8 text-[var(--accent)]" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Check your email</h2>
              <p className="text-sm text-[var(--muted)] mb-8 leading-relaxed">
                We have sent a password reset link to your email. Please check your inbox and spam folder.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="w-full bg-transparent border border-[var(--border)] hover:bg-[var(--surface)] text-[var(--text-primary)] font-medium py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Try another email
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}