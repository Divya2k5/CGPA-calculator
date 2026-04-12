import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "../firebase/auth.js";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09111f] text-[#dae2fd]">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-10">
        <div className="mb-8">
          <p className="eyebrow">Anna University</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-[#f3f6ff]">CGPA Calculator</h1>
          <p className="mt-3 text-sm leading-6 text-[#8c909f]">
            Sign in to save semester results, calculate GPA quickly, and keep your academic record available offline as an installable app.
          </p>
        </div>

        <div className="section-card space-y-5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="secondary-button justify-center bg-white text-[#0c1222] hover:bg-white"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#adc6ff] text-xs font-bold text-[#002e6a]">G</span>
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[11px] uppercase tracking-[0.16em] text-[#5f6b84]">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="space-y-4">
            <label className="input-group">
              <span className="input-label">Email</span>
              <input
                className="input-field"
                placeholder="Student email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </label>

            <label className="input-group">
              <span className="input-label">Password</span>
              <div className="relative">
                <input
                  className="input-field pr-12"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-[#7f8aa3]"
                  disabled={loading}
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </label>
          </div>

          <button
            type="button"
            onClick={handleEmailAuth}
            disabled={loading}
            className="primary-button justify-center"
          >
            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
          </button>

          <div className="text-center text-sm text-[#8c909f]">
            <span>{isSignUp ? "Already have an account? " : "New here? "}</span>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              disabled={loading}
              className="font-semibold text-[#adc6ff]"
            >
              {isSignUp ? "Sign in" : "Create account"}
            </button>
          </div>

          {error ? <p className="rounded-2xl border border-[#ffb4ab]/10 bg-[#ffb4ab]/5 px-4 py-3 text-sm text-[#ffb4ab]">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
