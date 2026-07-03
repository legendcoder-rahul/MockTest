import React from "react";
import googleIcon from "../assets/googleIcon.png";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export const GoogleAuthButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-3 bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant py-2.5 rounded-lg text-sm font-bold text-on-surface transition-all active:scale-[0.98] cursor-pointer"
    >
      <img src={googleIcon} alt="Google logo" className="w-5 h-5 object-contain" />
      <span>Continue with Google</span>
    </button>
  );
};

export default GoogleAuthButton;
