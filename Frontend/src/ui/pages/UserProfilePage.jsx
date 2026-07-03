import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateTargetExam, logoutUserAsync } from "../../auth/state/authSlice";

export const UserProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  
  const [selectedExam, setSelectedExam] = useState(user?.targetExam || "SSC CGL");
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    dispatch(updateTargetExam(selectedExam));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleLogout = () => {
    dispatch(logoutUserAsync());
    navigate("/");
  };

  // Mocked list of target achievements
  const achievements = [
    { title: "First Step", desc: "Completed your first mock test", icon: "emoji_events", unlocked: true },
    { title: "Perfect Score", desc: "Achieved 100% accuracy in a test", icon: "stars", unlocked: true },
    { title: "Consistent", desc: "Completed 5 tests in one week", icon: "local_fire_department", unlocked: true },
    { title: "Ranker", desc: "Enter top 5% of global rank", icon: "military_tech", unlocked: false }
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1000px] mx-auto px-4 md:px-8 py-8">
      {/* Header section */}
      <div className="border-b border-outline-variant pb-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-[32px] leading-[1.3] font-bold text-primary tracking-tight font-[Poppins]">Student Profile</h1>
          <p className="text-on-surface-variant text-sm mt-1">Manage target preferences and view your test achievements.</p>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-4 py-2 border border-error/30 text-error hover:bg-error-container/10 text-xs font-bold rounded-xl transition-all w-fit"
        >
          <span className="material-symbols-outlined text-base">logout</span>
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Profile Card & Settings (7 columns) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Card detailing basic info */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-outline-variant">
              <img
                alt="Avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6HqaY1NcBTLlNIqELM8m_QN42txnD8VkGJ8_-wg2NWEPRl2gfwhy2nL0T_RjihLVU8r1vDj0Xp68FCXa3h-76a_TOdspXlbgopoh4iVL4x-G1-_EnGlUOUp-L5RCqT9Ey-Ei1FRD0cJ470FMJ3z2VQFYwSAjcSyCZJ-eHyVXB5TBaxsdylJRowvxSokxvS3tVtZeTiXdC5SLLnJ9alun2Y22kvMlXbJmrgP9jz7IPZi1q6jmsiUwEkg"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary font-[Poppins]">{user?.name || "Rahul"}</h3>
              <p className="text-xs text-on-surface-variant font-semibold mt-0.5">Targeting: {user?.targetExam || "SSC CGL"}</p>
              <div className="flex gap-4 text-xs font-bold text-on-surface-variant mt-2">
                <span>Rank: <span className="text-primary">#1,247</span></span>
                <span>•</span>
                <span>Accuracy: <span className="text-primary">68.2%</span></span>
              </div>
            </div>
          </div>

          {/* Settings board */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
            <h4 className="text-base font-bold text-primary mb-6 font-[Poppins]">Target Exam Settings</h4>
            
            <form onSubmit={handleSaveSettings} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Target Exam Preference</label>
                <div className="relative">
                  <select
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant bg-transparent px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer text-on-surface"
                  >
                    <option value="SSC CGL">SSC CGL (Staff Selection Commission)</option>
                    <option value="UPSC CSE">UPSC CSE (Civil Services Exam)</option>
                    <option value="Banking (SBI/IBPS)">Banking (SBI/IBPS Exams)</option>
                    <option value="Railway (RRB)">Railway (RRB Recruitment)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
              </div>

              {isSaved && (
                <div className="p-3 rounded-lg bg-tertiary-container/10 text-tertiary text-xs font-semibold flex items-center gap-1.5 border border-tertiary/20">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Target exam preferences saved successfully!
                </div>
              )}

              <button
                type="submit"
                className="bg-primary hover:opacity-95 text-primary-foreground font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 w-fit"
              >
                Save Preferences
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Achievements (5 columns) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
            <h4 className="text-base font-bold text-primary mb-4 flex items-center gap-2 font-[Poppins]">
              <span className="material-symbols-outlined text-secondary text-lg">workspace_premium</span>
              Exam achievements
            </h4>

            <div className="flex flex-col gap-4">
              {achievements.map((ach, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all ${
                    ach.unlocked
                      ? "border-outline-variant bg-surface-container-low"
                      : "border-outline-variant opacity-50"
                  }`}
                >
                  <span className={`material-symbols-outlined p-2.5 rounded-lg text-lg ${
                    ach.unlocked
                      ? "bg-secondary-container/20 text-secondary"
                      : "bg-surface-container text-on-surface-variant"
                  }`}>
                    {ach.icon}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-on-surface">{ach.title}</h5>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserProfilePage;
