import { Link } from "react-router-dom";

export default function Footer() {
  const legalLinks = [
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms', path: '/tos' }
  ];

  return (
    <footer className="w-full bg-[var(--surface-dark)] border-t border-[var(--border)] py-12 px-8 lg:px-16 mt-auto">
      <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
        
        {/* Left Column: flex-1 ensures it takes equal space to balance the right column */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-3">
          <h3 className="text-[var(--text-primary)] text-2xl tracking-wider uppercase mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>
            FOLLOW US
          </h3>
          {['Facebook', 'Instagram', 'TikTok', 'Twitter'].map((link) => (
            <a 
              key={link} 
              href="#" 
              className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors text-sm sm:text-base"
              style={{ fontFamily: "'Anonymous Pro', monospace" }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Center Column: shrink-0 prevents it from being squished */}
        <div className="flex flex-col items-center gap-4 shrink-0">
          <img 
            src="/images/gymmerLogo.svg" 
            alt="Gymmer Logo" 
            className="w-16 h-16 object-contain"
          />
          <span 
            className="text-[var(--muted)] text-sm tracking-widest"
            style={{ fontFamily: "'Anonymous Pro', monospace" }}
          >
            GYMMER 2026
          </span>
        </div>

        {/* Right Column: flex-1 ensures it takes equal space to balance the left column */}
        <div className="flex-1 flex flex-col items-center md:items-end text-center md:text-right gap-3">
          <h3 className="text-[var(--text-primary)] text-2xl tracking-wider uppercase mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>
            TERMS & CONDITIONS
          </h3>
          {legalLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors text-sm sm:text-base"
              style={{ fontFamily: "'Anonymous Pro', monospace" }}
            >
              {link.name}
            </Link>
          ))}
        </div>

      </div>
    </footer>
  );
}