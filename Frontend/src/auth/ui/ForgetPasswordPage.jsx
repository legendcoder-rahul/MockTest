import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";

export const ForgetPasswordPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = Request OTP, 2 = Verify & Reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await authApi.forgetPassword(email);
      setSuccess("OTP sent successfully to your email!");
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email || !otp || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (otp.length !== 4 || isNaN(Number(otp))) {
      setError("Please enter a valid 4-digit OTP.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await authApi.resetPassword(email, otp, newPassword);
      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please check your OTP and try again.");
    } finally {
      setLoading(false);
    }
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
            Reset Your Password.<br />
            <span className="text-secondary-container">Get Back to Prep.</span>
          </h1>
          <p className="text-[18px] leading-[1.6] text-primary-fixed-dim mb-10">
            Securely reset your password and continue your exam preparation with AI-powered concept breakdowns and trackers.
          </p>

          {/* Features */}
          <div className="flex flex-col gap-4 mb-12">
            {[
              { icon: "lock_reset", title: "Secure Multi-Factor Recovery" },
              { icon: "schedule", title: "Instant 5-Minute OTP Window" },
              { icon: "shield", title: "Encrypted Data Integrity Protection" }
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
          <h2 className="text-2xl font-bold text-primary font-[Poppins] mb-1">
            {step === 1 ? "Reset Password" : "Enter Verification OTP"}
          </h2>
          <p className="text-xs text-on-surface-variant mb-6">
            {step === 1 
              ? "Enter your email address to receive a recovery code." 
              : "We've sent a 4-digit code to your email."}
          </p>

          {error && (
            <div className="p-3 mb-4 rounded-lg bg-error-container/20 text-error text-xs font-semibold border border-error/20 flex gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 mb-4 rounded-lg bg-success-container/20 text-success text-xs font-semibold border border-success/20 flex gap-2">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>{success}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:opacity-95 text-primary-foreground py-2.5 rounded-lg text-sm font-bold transition-all shadow-md mt-3 flex justify-center items-center gap-2 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <span>Sending OTP...</span>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <span className="material-symbols-outlined text-lg">send</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wide">Verification Code (OTP)</label>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-transparent px-4 py-2.5 text-center text-lg tracking-[8px] font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-on-surface placeholder:text-on-surface-variant/30"
                  placeholder="••••"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wide">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-transparent px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-on-surface placeholder:text-on-surface-variant/60"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wide">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-transparent px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-on-surface placeholder:text-on-surface-variant/60"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:opacity-95 text-primary-foreground py-2.5 rounded-lg text-sm font-bold transition-all shadow-md mt-3 flex justify-center items-center gap-2 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <span>Resetting Password...</span>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <span className="material-symbols-outlined text-lg">lock_open</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-on-surface-variant">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-primary font-bold hover:underline">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back to Login
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

export default ForgetPasswordPage;
