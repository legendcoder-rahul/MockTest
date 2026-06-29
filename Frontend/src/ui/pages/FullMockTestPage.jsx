import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { startExamAsync } from "../../state/examSlice";
import { apiService } from "../../api/apiService";

export const FullMockTestPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.exam.loading);

  const [questionsPerSection, setQuestionsPerSection] = useState(25);
  const [startingTest, setStartingTest] = useState(false);
  const [error, setError] = useState("");

  const sectionInfo = [
    { name: "Quantitative Aptitude", icon: "calculate", color: "text-primary" },
    { name: "General Intelligence & Reasoning", icon: "psychology", color: "text-secondary" },
    { name: "English Comprehension", icon: "translate", color: "text-primary" },
    { name: "General Awareness", icon: "menu_book", color: "text-secondary" }
  ];

  const handleStartFullMock = async () => {
    setStartingTest(true);
    setError("");

    const test = await apiService.fetchFullMockTest(questionsPerSection);
    if (!test) {
      setError("Could not generate full mock test. Make sure questions exist in the database for at least one subject.");
      setStartingTest(false);
      return;
    }

    const resultAction = await dispatch(startExamAsync(test.id));
    if (startExamAsync.fulfilled.match(resultAction)) {
      navigate(`/active-exam/${test.id}`);
    } else {
      setError("Failed to start the exam.");
    }
    setStartingTest(false);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-[800px] mx-auto px-4 md:px-8 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate("/subjects")}
        className="flex items-center text-on-surface-variant hover:text-primary transition-colors w-fit text-sm font-bold gap-1"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Back to Subjects
      </button>

      {/* Main Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-primary text-3xl">description</span>
          <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight font-[Poppins]">
            Full Mock Test — SSC Pattern
          </h1>
        </div>
        <p className="text-on-surface-variant text-sm mb-8">
          A complete exam simulation with questions from all 4 sections, just like the real SSC CGL exam.
        </p>

        {/* Section Breakdown */}
        <div className="flex flex-col gap-3 mb-8">
          <label className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wide">
            Sections Included
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sectionInfo.map((sec) => (
              <div
                key={sec.name}
                className="flex items-center gap-3 p-4 rounded-xl border border-outline-variant bg-surface-container-low"
              >
                <span className={`material-symbols-outlined ${sec.color} bg-surface-container-lowest p-2 rounded-lg`}>
                  {sec.icon}
                </span>
                <div>
                  <span className="text-sm font-bold text-on-surface">{sec.name}</span>
                  <p className="text-[11px] text-on-surface-variant">{questionsPerSection} questions</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Questions per section */}
        <div className="flex flex-col gap-2 mb-8">
          <label className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wide">
            Questions Per Section
          </label>
          <div className="flex gap-2 flex-wrap">
            {[5, 10, 15, 25].map((n) => (
              <button
                key={n}
                onClick={() => setQuestionsPerSection(n)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                  questionsPerSection === n
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-transparent text-on-surface-variant border-outline-variant hover:border-primary"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Total: <span className="font-bold text-primary">{questionsPerSection * 4} questions</span> • 
            Duration: <span className="font-bold text-primary">60 minutes</span>
          </p>
        </div>

        {/* Instructions */}
        <div className="p-4 rounded-xl bg-secondary-container/10 border border-secondary-container/20 flex gap-3 text-on-surface mb-6">
          <span className="material-symbols-outlined text-secondary mt-0.5">info</span>
          <div className="text-xs flex flex-col gap-1 leading-relaxed">
            <span className="font-bold text-on-surface">Exam Instructions (SSC CGL Pattern):</span>
            <span>• Total 4 sections with {questionsPerSection} questions each.</span>
            <span>• Negative marking: +2.0 for correct, -0.5 for incorrect.</span>
            <span>• Duration: 60 minutes for the entire paper.</span>
            <span>• Questions are randomly selected from the database.</span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-semibold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={handleStartFullMock}
          disabled={startingTest || loading}
          className="w-full bg-primary hover:opacity-95 text-primary-foreground py-3.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {startingTest || loading ? (
            <span>Generating Full Mock Test...</span>
          ) : (
            <>
              <span>Launch Full Mock Test ({questionsPerSection * 4} Qs)</span>
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
export default FullMockTestPage;
