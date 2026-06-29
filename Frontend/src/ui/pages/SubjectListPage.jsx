import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSubjects } from "../../state/examSlice";
import { apiService } from "../../api/apiService";

export const SubjectListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const subjects = useSelector((state) => state.exam.subjects);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const loadSubjects = async () => {
      const data = await apiService.fetchSubjects();
      dispatch(setSubjects(data));
    };
    loadSubjects();
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant pb-5">
        <div>
          <h1 className="text-[32px] leading-[1.3] font-bold text-primary tracking-tight font-[Poppins]">Syllabus Overview</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Track syllabus progress and start topic-wise practice tests for {user?.targetExam || "SSC CGL"}.
          </p>
        </div>

        {/* Selected target indicator */}
        <div className="flex items-center gap-2 bg-primary-fixed text-primary border border-outline-variant px-4 py-2 rounded-xl w-fit">
          <span className="material-symbols-outlined text-primary text-lg">verified</span>
          <span className="text-[12px] font-bold uppercase tracking-wider">
            Active target: {user?.targetExam || "SSC CGL"}
          </span>
        </div>
      </div>

      {/* Full Mock Test Card (SSC Pattern) */}
      <div
        onClick={() => navigate("/full-mock-test")}
        className="bg-gradient-to-r from-primary to-primary-container rounded-2xl p-6 md:p-8 text-primary-foreground shadow-md relative overflow-hidden cursor-pointer hover:shadow-xl transition-all active:scale-[0.99] group"
      >
        <div className="absolute right-4 top-4 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[80px]">assignment</span>
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-2xl">description</span>
              <h2 className="text-xl md:text-2xl font-bold font-[Poppins]">Full Mock Test — SSC Pattern</h2>
            </div>
            <p className="text-sm text-primary-fixed-dim max-w-xl">
              Take a complete mock test with questions from all sections — Quantitative Aptitude, Reasoning, English, and General Awareness (just like the real SSC CGL exam).
            </p>
          </div>
          <button className="bg-primary-foreground text-primary px-6 py-3 rounded-xl text-sm font-bold shadow-md flex items-center gap-2 group-hover:shadow-lg transition-all whitespace-nowrap">
            Start Full Test
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
          >
            {/* Top Border Category Styling */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary"></div>

            <div>
              {/* Subject Title & Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary bg-surface-container-low p-2.5 rounded-xl">
                    {sub.icon}
                  </span>
                  <h3 className="text-xl font-bold text-primary">{sub.name}</h3>
                </div>
                <span className="text-[12px] font-bold text-secondary bg-secondary-container/20 px-2.5 py-1 rounded-full uppercase tracking-wider border border-secondary-container/20">
                  {sub.progress}% Done
                </span>
              </div>

              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                {sub.description}
              </p>

              {/* Progress Slider */}
              <div className="w-full bg-surface-container rounded-full h-2 mb-6">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${sub.progress}%` }}
                ></div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 border-t border-outline-variant pt-4 mb-6 text-xs font-semibold text-on-surface-variant">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
                  <span>
                    Tests completed: <span className="text-on-surface">{sub.completedTests}/{sub.totalTests}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  <span>
                    Last practiced: <span className="text-on-surface">{sub.lastPracticed}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* CTA action */}
            <button
              onClick={() => navigate(`/test-config/${sub.id}`)}
              className="w-full bg-primary hover:opacity-95 text-primary-foreground py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-1"
            >
              Start Practice Test
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SubjectListPage;
