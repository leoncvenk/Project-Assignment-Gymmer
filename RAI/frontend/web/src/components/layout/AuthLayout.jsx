import AuthSidebar from "./AuthSidebar";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full bg-[var(--background)] text-[var(--text-primary)] font-sans">
      <AuthSidebar />
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--background)] py-12">
        {children}
      </div>
    </div>
  );
}