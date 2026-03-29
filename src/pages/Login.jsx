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
      navigate("/dashboard");
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
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between overflow-hidden relative"
      style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)" }}
    >
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#adc6ff]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-[#64d8d8]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex flex-col items-center pt-20 px-6 z-10 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[#adc6ff]/30 blur-2xl rounded-full scale-150" />
          <div className="relative w-24 h-24 bg-[#222a3d] rounded-full flex items-center justify-center border border-[#adc6ff]/20 shadow-2xl">
            <span className="material-symbols-outlined text-[#adc6ff] text-5xl">school</span>
          </div>
        </div>

        <h1 className="text-[32px] font-extrabold tracking-tighter text-white mb-2 leading-tight">AU CGPA Calculator</h1>
        <p className="text-slate-400 font-medium tracking-wide text-sm uppercase">Your Academic Journey, Simplified</p>
      </div>

      <div className="w-full max-w-md px-4 pb-12 z-10 mt-auto">
        <div className="glass-card rounded-[2rem] p-8 shadow-2xl border border-white/5 flex flex-col gap-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white text-slate-900 font-semibold py-4 rounded-full flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="h-7 w-7 rounded-full bg-[#adc6ff] text-[#002e6a] flex items-center justify-center text-sm font-bold">G</span>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-4 py-2">
            <div className="h-[1px] flex-1 bg-[#424754]/30" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">or</span>
            <div className="h-[1px] flex-1 bg-[#424754]/30" />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-500 text-xl">mail</span>
            </div>
            <input
              className="w-full bg-[#131b2e] border-none rounded-xl py-4 pl-12 pr-4 text-[#dae2fd] placeholder:text-slate-500 focus:ring-2 focus:ring-[#adc6ff]/50 outline-none"
              placeholder="Student Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-500 text-xl">lock</span>
            </div>
            <input
              className="w-full bg-[#131b2e] border-none rounded-xl py-4 pl-12 pr-14 text-[#dae2fd] placeholder:text-slate-500 focus:ring-2 focus:ring-[#adc6ff]/50 outline-none"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-[#adc6ff]"
              disabled={loading}
            >
              <span className="material-symbols-outlined text-xl">{showPassword ? "visibility_off" : "visibility"}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleEmailAuth}
            disabled={loading}
            className="w-full font-bold py-4 rounded-xl active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(to right, #adc6ff, #4d8eff)", color: "#002e6a" }}
          >
            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
          </button>

          <div className="text-center text-slate-400 text-sm">
            <span>{isSignUp ? "Already have an account? " : "New here? "}</span>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              disabled={loading}
              className="text-[#adc6ff] font-bold cursor-pointer hover:underline disabled:opacity-70"
            >
              {isSignUp ? "Sign in" : "Create account"}
            </button>
          </div>

          {error ? <p className="text-[#ffb4ab] text-xs text-center">{error}</p> : null}

          <div className="text-center mt-4">
            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index} className="material-symbols-outlined text-[#64d8d8] text-sm">star</span>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Trusted by Anna University Students</p>
          </div>
        </div>
      </div>
    </div>
  );
}
