import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessSignIn: (email: string) => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSuccessSignIn,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid workspace email address.');
      return;
    }
    if (password.length < 4) {
      setErrorMsg('Please enter your password (min 4 characters).');
      return;
    }
    setErrorMsg(null);
    onSuccessSignIn(email.trim());
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sign in to Kinetix Studio"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 select-none"
    >
      <div className="w-full max-w-[780px] h-[490px] rounded-[20px] overflow-hidden border border-[#2c2c34] shadow-[0_32px_90px_rgba(0,0,0,0.8)] grid grid-cols-1 md:grid-cols-2 bg-[#1b1b1f]">
        {/* Left Half: Bright Editorial /orbit showreel Collage Poster (matches image_7478f39d.png) */}
        <div className="relative bg-[#e3e4e8] text-[#18181b] p-6 flex flex-col justify-between overflow-hidden">
          {/* Top Header */}
          <div className="flex items-start justify-between z-10">
            <div className="text-[22px] font-bold leading-[1.02] tracking-[-0.04em] text-white drop-shadow-xs">
              <div>/orbit</div>
              <div>showreel</div>
            </div>
            <svg viewBox="0 0 28 28" className="w-8 h-8" aria-hidden="true">
              <circle cx="9.5" cy="9.5" r="5.5" fill="#ffffff" />
              <circle cx="18.5" cy="9.5" r="5.5" fill="#ffffff" />
              <circle cx="9.5" cy="18.5" r="5.5" fill="#ffffff" />
              <circle cx="18.5" cy="18.5" r="5.5" fill="#ffffff" />
            </svg>
          </div>

          {/* Center Floating Orbital Collage Cards */}
          <div className="relative flex-1 flex items-center justify-center my-2">
            <div className="relative w-64 h-64">
              {/* Top-left warm card */}
              <div className="absolute left-12 top-3 w-16 h-16 rounded-[12px] bg-gradient-to-br from-[#ff8a00] to-[#d83a22] shadow-md rotate-[-6deg]" />
              {/* Top-center mono portrait card */}
              <div className="absolute left-24 top-1 w-16 h-16 rounded-[12px] bg-gradient-to-br from-[#3a3d45] to-[#121316] shadow-md rotate-[4deg]" />
              {/* Top-right vibrant orange card */}
              <div className="absolute right-4 top-6 w-20 h-20 rounded-[14px] bg-gradient-to-br from-[#ea580c] to-[#7c2d12] shadow-lg rotate-[8deg]" />
              {/* Left wireframe mesh card */}
              <div className="absolute left-3 top-16 w-16 h-18 rounded-[12px] bg-[#d4d4d8] border border-black/10 shadow flex items-center justify-center">
                <div className="w-9 h-11 rounded-full border-2 border-[#3f3f46] opacity-60" />
              </div>
              {/* Bottom-left floral glow card */}
              <div className="absolute left-2 bottom-10 w-20 h-22 rounded-[14px] bg-gradient-to-tr from-[#fca5a5] via-[#fdba74] to-[#fef3c7] shadow-md" />
              {/* Bottom-center crimson silhouette card */}
              <div className="absolute left-16 bottom-2 w-24 h-28 rounded-[16px] bg-gradient-to-b from-[#ef4444] via-[#f97316] to-[#18181b] shadow-xl" />
              {/* Foreground Dark Supercar / Studio Tail-light Hero Card */}
              <div className="absolute right-2 bottom-10 w-32 h-32 rounded-[18px] bg-[#09090b] shadow-2xl p-3 flex flex-col justify-between border border-white/15 z-10">
                <span className="text-[9px] font-bold text-white/85 leading-tight self-end text-right">
                  (animation
                  <br />
                  templates)
                </span>
                <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#ef4444] to-[#fca5a5] shadow-[0_0_10px_#ef4444]" />
                <span className="text-[8px] font-mono text-white/40">60 FPS · 3D</span>
              </div>
            </div>
          </div>

          {/* Bottom Oversized Display Wordmark */}
          <div className="text-[52px] font-extrabold tracking-[-0.05em] leading-none text-white select-none -mx-2">
            KINETIX©26
          </div>
        </div>

        {/* Right Half: Dark Authentication Form */}
        <div className="relative p-8 flex flex-col justify-center bg-[#1b1b1f] text-[#f5f5f7]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sign in modal"
            className="absolute top-4 right-4 p-1.5 text-[#8e8e98] hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center space-y-1.5 mb-6">
            <h2 className="text-xl font-bold text-[#f5f5f7] tracking-tight">
              Welcome back!
            </h2>
            <p className="text-[13px] text-[#a0a0ab]">
              Select your preferred login method.
            </p>
            <p className="text-[11px] text-[#7c7c86] pt-1">
              Sign in to sync your 3D templates — your project is saved locally.
            </p>
          </div>

          {/* Continue with Google Button */}
          <button
            type="button"
            onClick={() => {
              onSuccessSignIn('creator@kinetix.studio');
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-[10px] bg-[#232329] hover:bg-[#2b2b33] border border-[#34343d] text-[13px] font-medium text-[#f5f5f7] flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.8c-.2-.8-.4-1.8-.4-2.8s.2-2 .4-2.8L1.6 6.4C.6 8.4 0 10.6 0 12s.6 3.6 1.6 5.6l3.7-2.8z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.8C3.5 19.9 7.4 23 12 23z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="h-[1px] flex-1 bg-[#2c2c34]" />
            <span className="text-[11px] text-[#7c7c86]">or</span>
            <div className="h-[1px] flex-1 bg-[#2c2c34]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              aria-label="Email address"
              className="w-full bg-[#222228] border border-[#32323b] focus:border-[#3b66f5] rounded-[10px] px-3.5 py-2.5 text-[13px] text-[#f5f5f7] placeholder-[#7c7c86] focus:outline-none"
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                aria-label="Password"
                className="w-full bg-[#222228] border border-[#32323b] focus:border-[#3b66f5] rounded-[10px] pl-3.5 pr-10 py-2.5 text-[13px] text-[#f5f5f7] placeholder-[#7c7c86] focus:outline-none"
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7c7c86] hover:text-[#d4d4dc] cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {errorMsg && (
              <p className="text-[11px] text-[#ef4444]">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-full bg-[#3b66f5] hover:bg-[#4e76ff] text-[13px] font-semibold text-white shadow-[0_0_24px_rgba(59,102,245,0.4)] transition-colors cursor-pointer mt-1"
            >
              Sign in
            </button>
          </form>

          <div className="mt-4 space-y-1 text-[11px] text-[#7c7c86]">
            <div>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  onSuccessSignIn('studio@kinetix.app');
                  onClose();
                }}
                className="text-[#3b66f5] hover:underline font-medium cursor-pointer"
              >
                Register Now
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span>Email magic link</span>
              <span>Forgot password?</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
