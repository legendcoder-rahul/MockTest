import React from "react";
import { useSelector } from "react-redux";

export const Footer = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) return null;

  return (
    <footer className="bg-surface-container text-on-surface-variant border-t border-outline-variant mt-auto">
      <div className="w-full py-8 px-6 md:px-8 flex flex-col sm:flex-row justify-between items-center max-w-[1280px] mx-auto">
        <div className="text-[14px] font-bold text-primary tracking-[0.05em] mb-4 sm:mb-0 font-[Poppins]">
          ExamAI
        </div>
        <div className="text-[14px] text-on-surface-variant mb-4 sm:mb-0">
          © 2026 ExamAI. All rights reserved.
        </div>
        <div className="flex gap-6 text-[12px] font-medium">
          <a className="hover:text-primary transition-colors" href="#">Terms</a>
          <a className="hover:text-primary transition-colors" href="#">Privacy</a>
          <a className="hover:text-primary transition-colors" href="#">Help</a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
