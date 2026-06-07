import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import AuthLayout from "../layout/AuthLayout";
import FormInput from "../ui/FormInput";
import Navigation from "../ui/Navigation";

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
    <>
      <Navigation />
      <AuthLayout>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-[450px] bg-[var(--surface-dark)] border border-[var(--border)] rounded-2xl p-8 sm:p-10 shadow-2xl relative z-10 mt-16">
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
                <FormInput label="Email" id="email" type="email" placeholder="your@email.com" required />
                <button type="submit" className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-primary)] font-medium py-2.5 rounded-xl transition-colors cursor-pointer">
                  Send reset link
                </button>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)]/10 mb-6">
                <CheckCircle2 className="h-8 w-8 text-[var(--accent)]" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Check your email</h2>
              <p className="text-sm text-[var(--muted)] mb-8 leading-relaxed">
                We have sent a password reset link to your email. Please check your inbox and spam folder.
              </p>
              <button onClick={() => setIsSubmitted(false)} className="w-full bg-transparent border border-[var(--border)] hover:bg-[var(--surface)] text-[var(--text-primary)] font-medium py-2.5 rounded-xl transition-colors cursor-pointer">
                Try another email
              </button>
            </motion.div>
          )}
        </motion.div>
      </AuthLayout>
    </>
  );
}