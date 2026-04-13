import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, hasFirebaseConfig } from "../firebase/config.js";
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "../firebase/auth.js";
import { FIREBASE_SETUP_MESSAGE, toAppErrorMessage } from "../utils/appErrors.js";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (auth?.currentUser) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    if (!hasFirebaseConfig) {
      setError(FIREBASE_SETUP_MESSAGE);
      return;
    }

    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      setError(toAppErrorMessage(err, "Google sign-in could not be completed."));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    const trimmedEmail = email.trim();

    if (!hasFirebaseConfig) {
      setError(FIREBASE_SETUP_MESSAGE);
      return;
    }

    if (!trimmedEmail) {
      setError("Enter your email address.");
      return;
    }

    if (!password) {
      setError("Enter your password.");
      return;
    }

    if (isSignUp && password.length < 6) {
      setError("Use a password with at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      if (isSignUp) {
        await signUpWithEmail(trimmedEmail, password);
      } else {
        await signInWithEmail(trimmedEmail, password);
      }
      navigate("/");
    } catch (err) {
      setError(toAppErrorMessage(err, isSignUp ? "Account creation failed." : "Sign-in failed."));
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
          {!hasFirebaseConfig ? (
            <div className="status-banner status-banner--warning" role="status" aria-live="polite">
              Firebase is not configured. Add the required `VITE_*` values before deploying authentication features.
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || !hasFirebaseConfig}
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
                disabled={loading || !hasFirebaseConfig}
                autoComplete="email"
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
                  disabled={loading || !hasFirebaseConfig}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-[#7f8aa3]"
                  disabled={loading || !hasFirebaseConfig}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </label>
          </div>

          <button
            type="button"
            onClick={handleEmailAuth}
            disabled={loading || !hasFirebaseConfig}
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

          {error ? (
            <p className="status-banner status-banner--error" role="alert" aria-live="assertive">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
