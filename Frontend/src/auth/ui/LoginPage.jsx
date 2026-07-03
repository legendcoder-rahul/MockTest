import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUserAsync, clearAuthError } from "../state/authSlice";
import GoogleAuthButton from "../../components/GoogleAuthButton";

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Clear any residual errors when switching screens
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUserAsync({ email, password }));
  };

  return (
    <main className="flex min-h-screen w-full flex-col lg:flex-row bg-background text-foreground">
      {/* Left Panel: Hero Banner (55%) */}
      <section className="relative hidden lg:flex w-[55%] bg-gradient-to-br from-primary to-primary-container overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-xl flex flex-col items-start w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-on-secondary-container font-bold text-lg">neurology</span>
            </div>
            <span className="font-bold text-2xl text-primary-foreground tracking-wide font-[Poppins]">ExamAI</span>
          </div>

          {/* Slogan */}
          <h1 className="text-[48px] leading-[1.2] font-bold text-primary-foreground mb-6 tracking-tight font-[Poppins]">
            Crack Your Govt Exam.<br />
            <span className="text-secondary-container">With AI Guidance.</span>
          </h1>
          <p className="text-[18px] leading-[1.6] text-primary-fixed-dim mb-10">
            Chapter-wise mock tests + dynamic AI explanations from real past papers. Experience the ultimate preparation system engineered for serious aspirants.
          </p>

          {/* Features */}
          <div className="flex flex-col gap-4 mb-12">
            {[
              { icon: "account_balance", title: "SSC | UPSC | Banking Coverage" },
              { icon: "analytics", title: "AI-Powered PYQ Concept Breakdown" },
              { icon: "monitoring", title: "Real-Time Syllabus Progress Tracker" }
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary-foreground/5 border border-primary-foreground/10 backdrop-blur-sm">
                <span className="material-symbols-outlined text-secondary-container text-xl">{f.icon}</span>
                <span className="text-sm font-semibold text-primary-foreground">{f.title}</span>
              </div>
            ))}
          </div>

          {/* Graphic mockup */}
          <div className="w-full max-w-lg mt-auto rounded-xl overflow-hidden border border-primary-foreground/10 shadow-2xl relative group">
            <div
              className="w-full aspect-[16/10] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCELB3jANWLQIcBcycAuefd2uNFZMWCldjNuNXdU5LziNFk2fBQEe6i6ID5E3-yfhVO0IfUhxhc51ZMu98pv60uXhdqc9ZCx69WvlkRzroLw07I91fuK_zndgmM02AQj094CyMY8YxfxM3GB2sN3L_o7JbeQAaKw29tvRMQDsRuBklW_B-TUgsVAbe93BcyZPWLu99AQv3bnnVFyfj-wzhLZ9hQ2J4Fztjwn220Y5PJs0zsiT7OI20UYg')`
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/75 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Right Panel: Form Container (45%) */}
      <section className="w-full lg:w-[45%] flex flex-col justify-center items-center p-6 md:p-12 bg-background relative min-h-screen">
        {/* Mobile Header Logo */}
        <div className="lg:hidden flex items-center gap-2.5 absolute top-6 left-6">
          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-on-secondary-container font-bold text-base">neurology</span>
          </div>
          <span className="font-extrabold text-xl text-primary font-[Poppins]">ExamAI</span>
        </div>

        <div className="w-full max-w-[420px] bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant p-8 md:p-10">
          <h2 className="text-2xl font-bold text-primary font-[Poppins] mb-1">Welcome Back</h2>
          <p className="text-xs text-on-surface-variant mb-6">Enter your details to access your portal</p>

          {error && (
            <div className="p-3 mb-4 rounded-lg bg-error-container/20 text-error text-xs font-semibold border border-error/20 flex gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wide">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-outline-variant bg-transparent px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-on-surface placeholder:text-on-surface-variant/60"
                placeholder="aspirant@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-transparent pl-4 pr-10 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-on-surface placeholder:text-on-surface-variant/60"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary" />
                <span className="text-xs text-on-surface-variant font-medium">Remember me</span>
              </label>
              <Link className="text-xs text-primary hover:underline font-semibold" to="/forgot-password">Forgot password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:opacity-95 text-primary-foreground py-2.5 rounded-lg text-sm font-bold transition-all shadow-md mt-3 flex justify-center items-center gap-2 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Log In</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-outline-variant"></div>
              <span className="flex-shrink mx-4 text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-wider">or</span>
              <div className="flex-grow border-t border-outline-variant"></div>
            </div>

            <GoogleAuthButton />
          </form>

          <div className="mt-6 text-center text-xs text-on-surface-variant">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Create Account
            </Link>
          </div>
        </div>

        <div className="mt-8 flex gap-6 z-10 text-xs font-bold text-on-surface-variant">
          <a className="hover:text-primary transition-colors" href="#">Help & Support</a>
          <a className="hover:text-primary transition-colors" href="#">System Status</a>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
