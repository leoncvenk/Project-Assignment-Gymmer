const GoogleIcon = (props) => (
  <img src="https://svgl.app/library/google.svg" alt="Google" {...props} />
);
const AppleIcon = (props) => (
  <img src="https://svgl.app/library/apple_dark.svg" alt="Apple" {...props} />
);

export default function SocialAuth({ mode = "Sign in" }) {
  return (
    <>
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-[var(--border)]"></div>
        <span className="px-3 text-sm text-[var(--muted)]">or</span>
        <div className="flex-1 border-t border-[var(--border)]"></div>
      </div>

      <div className="space-y-3">
        <button type="button" className="w-full flex items-center justify-center gap-3 py-2.5 border border-[var(--border)] rounded-xl hover:bg-[var(--surface)] transition-colors text-sm text-[var(--muted)] hover:text-[var(--text-primary)] cursor-pointer">
          <GoogleIcon className="w-4 h-4" />
          {mode} with Google
        </button>
        <button type="button" className="w-full flex items-center justify-center gap-3 py-2.5 border border-[var(--border)] rounded-xl hover:bg-[var(--surface)] transition-colors text-sm text-[var(--muted)] hover:text-[var(--text-primary)] cursor-pointer">
          <AppleIcon className="w-4 h-4" />
          {mode} with Apple
        </button>
      </div>
    </>
  );
}