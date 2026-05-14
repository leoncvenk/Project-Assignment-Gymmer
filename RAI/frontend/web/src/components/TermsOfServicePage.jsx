import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ScrollText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_#3a3a3a_0%,_#111111_70%,_#050505_100%)] p-6 overflow-hidden">
      
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl z-10 flex flex-col max-h-[90vh]"
        style={{ fontFamily: "'Anonymous Pro', monospace" }}
      >
        <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col h-full overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl md:text-3xl text-white font-bold tracking-wide">Terms of Service</h2>
            </div>
            <Link 
              to="/profile" 
              className="flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Back to Login"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>

          {/* Scrollable Content Area */}
          <div className="overflow-y-auto pr-4 space-y-6 text-gray-400 text-sm leading-relaxed custom-scrollbar">
            
            <p><strong>Last Updated:</strong> May 14, 2026</p>
            
            <p>
              Welcome to <strong>Gymmer</strong>. These Terms of Service ("Terms") govern your access to and use of the Gymmer mobile application, website, and associated services (collectively, the "Services"). By creating an account or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the Services.
            </p>

            <h3 className="text-lg text-white font-semibold mt-4">1. Medical Disclaimer – Not Medical Advice</h3>
            <p>
              Gymmer provides fitness tracking, macro-nutrient calculations, and workout logging designed for educational and informational purposes only. <strong>We are not a healthcare provider.</strong> The Services do not constitute medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional or physician before starting any new diet, fitness program, or nutrition plan. You assume all risks associated with your physical activities and dietary choices.
            </p>

            <h3 className="text-lg text-white font-semibold mt-4">2. User Accounts</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Eligibility:</strong> You must be at least 16 years old to create an account. If you are under 18, you may only use the Services with the consent of a parent or legal guardian.</li>
              <li><strong>Account Security:</strong> You are responsible for safeguarding your password and any other login credentials. You agree to notify us immediately of any unauthorized use of your account.</li>
              <li><strong>Accuracy of Data:</strong> You agree to provide accurate, current, and complete information during registration and to update such information (such as weight, height, and age) to keep our macro and fitness calculations as accurate as possible.</li>
            </ul>

            <h3 className="text-lg text-white font-semibold mt-4">3. Acceptable Use</h3>
            <p>You agree not to engage in any of the following prohibited activities:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Using the Services for any illegal purpose or in violation of any local, state, national, or international law.</li>
              <li>Attempting to bypass, exploit, or interfere with the security or operation of the Gymmer app.</li>
              <li>Using automated systems (e.g., bots, scrapers) to extract data from our Services without our explicit written consent.</li>
              <li>Harassing, abusing, or harming another person or user of the platform.</li>
            </ul>

            <h3 className="text-lg text-white font-semibold mt-4">4. Intellectual Property</h3>
            <p>
              All content, features, and functionality of the Gymmer application—including but not limited to design, text, graphics, logos, workout databases, and software—are the exclusive property of Gymmer and are protected by international copyright, trademark, and other intellectual property laws. You are granted a limited, non-exclusive license to use the app for personal, non-commercial purposes.
            </p>

            <h3 className="text-lg text-white font-semibold mt-4">5. Premium Subscriptions & Payments</h3>
            <p>
              Certain features of Gymmer may require a premium subscription. If you choose to upgrade, you agree to the pricing and payment terms presented at the time of purchase. Subscriptions automatically renew unless canceled at least 24 hours before the end of the current billing cycle. Payments are processed securely through our third-party payment providers (e.g., Apple App Store, Google Play, Stripe).
            </p>

            <h3 className="text-lg text-white font-semibold mt-4">6. Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by law, Gymmer and its developers, directors, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, personal injury, data loss, or loss of profits resulting from your use of or inability to use the Services. 
            </p>

            <h3 className="text-lg text-white font-semibold mt-4">7. Termination</h3>
            <p>
              We reserve the right to suspend or terminate your account and access to the Services at our sole discretion, without notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Services will immediately cease.
            </p>

            <h3 className="text-lg text-white font-semibold mt-4">8. Changes to These Terms</h3>
            <p>
              We may update our Terms of Service from time to time. If we make material changes, we will notify you by email or through an in-app alert prior to the changes taking effect. Your continued use of the Services after the revised terms become effective indicates your acceptance of the new Terms.
            </p>

            <h3 className="text-lg text-white font-semibold mt-4">9. Contact Us</h3>
            <p>
              If you have any questions about these Terms, please contact us at <strong>legal@gymmer.com</strong>.
            </p>
          </div>

        </div>
      </motion.div>

      {/* Global CSS for the custom scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}