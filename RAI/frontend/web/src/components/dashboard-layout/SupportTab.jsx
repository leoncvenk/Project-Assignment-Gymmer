import React, { useState } from 'react';
import { 
  LifeBuoy, 
  Send, 
  MessageCircle, 
  BookOpen, 
  Mail, 
  CheckCircle2, 
  Loader2,
  ChevronDown
} from 'lucide-react';

export default function SupportTab() {
  const [formData, setFormData] = useState({
    type: 'question',
    subject: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mocking an API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ type: 'question', subject: '', description: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const faqs = [
    { question: "How do I reset my macro goals?", answer: "Go to Settings > Nutrition Options to recalculate your daily macro targets." },
    { question: "Can I sync my smartwatch?", answer: "Currently, we support Apple Health and Google Fit. Navigate to Activities to connect." },
    { question: "How do I add a custom recipe?", answer: "In the Recipes tab, click the '+ Add Recipe' button in the top right corner." }
  ];

  return (
    <div className="flex flex-col w-full h-full bg-[#ffffff] font-sans text-[#2b2b2b] p-6 overflow-hidden">
      
      {/* Header Section */}
      <header className="flex-shrink-0 mb-6 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#e6f7f2] flex items-center justify-center">
            <LifeBuoy className="w-5 h-5 text-[#00a97f]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Help & Support</h1>
            <p className="text-xs text-gray-500 mt-1">We're here to help you get the most out of Gymmer.</p>
          </div>
        </div>
      </header>

      {/* Main Content Split */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-y-auto custom-scrollbar pb-6">
        
        {/* Left Column: Support Form */}
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold mb-4">Submit a Request</h2>
            
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center h-[350px]">
                <div className="w-16 h-16 rounded-full bg-[#e6f7f2] flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#00a97f]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Thanks for reaching out. Our support team will review your request and get back to you within 24 hours.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 px-4 py-2 text-sm font-medium text-[#00a97f] hover:bg-[#e6f7f2] rounded-lg transition-colors"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Issue Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">What do you need help with?</label>
                  <div className="relative">
                    <select 
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full appearance-none bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[#00a97f] focus:ring-1 focus:ring-[#00a97f] transition-all cursor-pointer"
                    >
                      <option value="question">General Question</option>
                      <option value="bug">Report a Bug</option>
                      <option value="feature">Feature Request</option>
                      <option value="troubleshooting">Troubleshooting</option>
                      <option value="billing">Billing Issue</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Title / Subject</label>
                  <input 
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Briefly describe your issue..."
                    className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[#00a97f] focus:ring-1 focus:ring-[#00a97f] transition-all"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Description</label>
                  <textarea 
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Provide as much detail as possible so we can best assist you..."
                    className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[#00a97f] focus:ring-1 focus:ring-[#00a97f] transition-all resize-none custom-scrollbar"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={isSubmitting || !formData.subject || !formData.description}
                  className="w-full flex items-center justify-center gap-2 bg-[#00a97f] hover:bg-[#008a68] disabled:bg-[#00a97f]/50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: FAQs & Contact Info */}
        <div className="lg:w-[320px] flex flex-col gap-5 flex-shrink-0">
          
          {/* Quick Contact Cards */}
          <div className="grid grid-cols-2 gap-3 lg:flex lg:flex-col lg:gap-4">
            <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="mt-0.5 p-2 bg-white rounded-lg border border-gray-200 text-[#00a97f]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold mb-0.5">Email Us</h3>
                <p className="text-[10px] text-gray-500 mb-1">support@gymmer.com</p>
                <span className="text-[9px] font-semibold text-[#00a97f] bg-[#e6f7f2] px-1.5 py-0.5 rounded-md">Responds in 24h</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="mt-0.5 p-2 bg-white rounded-lg border border-gray-200 text-[#00a97f]">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold mb-0.5">Community</h3>
                <p className="text-[10px] text-gray-500 mb-1">Join the discussion</p>
                <a href="#" className="text-[10px] font-semibold text-[#00a97f] hover:underline">Go to Forums &rarr;</a>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm flex-1">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-[#00a97f]" />
              <h3 className="text-sm font-semibold">Quick Answers</h3>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="group">
                  <h4 className="text-xs font-semibold text-[#2b2b2b] group-hover:text-[#00a97f] transition-colors mb-1 cursor-help">
                    {faq.question}
                  </h4>
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}