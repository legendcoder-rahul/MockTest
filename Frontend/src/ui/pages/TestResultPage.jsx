import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useExam } from "../../hooks/useExam";
import { initTutorSessionAsync } from "../../state/aiSlice";

export const TestResultPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const exam = useExam();

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const result = exam.testResult;

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-6 text-on-surface-variant">
        <span className="material-symbols-outlined text-5xl mb-3">analytics</span>
        <p className="font-bold text-lg">No exam results available to analyze.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-bold shadow-sm"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  // Format time spent
  const formatTimeSpent = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  const handleAnalyzeWithAI = (qAnalysis) => {
    // Reconstruct question object from analytical details
    const questionObj = {
      id: qAnalysis.questionId,
      number: qAnalysis.number,
      topic: qAnalysis.topic,
      source: qAnalysis.source,
      text: qAnalysis.text,
      options: qAnalysis.options,
      correctOption: qAnalysis.correctOption,
      userAnswer: qAnalysis.userAnswer,
      isCorrect: qAnalysis.isCorrect
    };

    // Dispatch init session to AI slice and redirect
    dispatch(initTutorSessionAsync(questionObj));
    navigate("/ai-tutor");
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-[960px] mx-auto px-4 md:px-8 py-8">
      {/* Top Banner Result summary */}
      <div className="bg-gradient-to-r from-primary to-primary-container text-primary-foreground rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase bg-primary-container text-primary-fixed px-3 py-1 rounded-full border border-primary-container/50">
            Performance Analysis
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-3 font-[Poppins]">{result.testTitle}</h1>
          <p className="text-primary-fixed-dim text-xs mt-1">{result.examType} • Practice Session Completed</p>
        </div>
        
        <button
          onClick={() => {
            exam.clearResult();
            navigate("/subjects");
          }}
          className="bg-surface-container-lowest text-primary hover:bg-surface-container-low font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
        >
          Take Another Test
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>

      {/* Score and Stats Bento Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Score Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 text-center shadow-sm">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Your Score</span>
          <div className="text-3xl font-extrabold text-primary mb-1 font-[Poppins]">
            {result.score} <span className="text-sm font-semibold text-on-surface-variant">/ {result.maxScore}</span>
          </div>
          <span className="text-[10px] font-bold text-on-surface-variant">SSC CGL Marking (+2 / -0.5)</span>
        </div>

        {/* Accuracy Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 text-center shadow-sm">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Accuracy</span>
          <div className="text-3xl font-extrabold text-primary mb-1 font-[Poppins]">{result.accuracy}%</div>
          <div className="w-full bg-surface-container-low rounded-full h-1.5 mt-2.5 mx-auto max-w-[100px]">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${result.accuracy}%` }}></div>
          </div>
        </div>

        {/* Attempt Details */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 text-center shadow-sm flex flex-col justify-center">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2">Attempt Summary</span>
          <div className="flex justify-center items-center gap-3 text-xs font-bold">
            <span className="text-tertiary bg-tertiary-container/20 px-2 py-1 rounded-lg">
              {result.correctCount} Correct
            </span>
            <span className="text-error bg-error-container/20 px-2 py-1 rounded-lg">
              {result.incorrectCount} Wrong
            </span>
          </div>
        </div>

        {/* Time Spent */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 text-center shadow-sm">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Time Elapsed</span>
          <div className="text-3xl font-extrabold text-primary mb-1 font-[Poppins]">
            {formatTimeSpent(result.timeSpentSeconds)}
          </div>
          <span className="text-[10px] font-bold text-on-surface-variant">Avg {Math.round(result.timeSpentSeconds / result.totalQuestions)}s / question</span>
        </div>
      </section>

      {/* Answer Key & AI Integration Section */}
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2 font-[Poppins]">
          <span className="material-symbols-outlined">rule</span>
          Answer Key & Explanations
        </h2>

        <div className="flex flex-col gap-6">
          {result.questionsAnalysis.map((qa, index) => {
            const statusStyle = qa.isAttempted
              ? qa.isCorrect
                ? "bg-tertiary-container/20 border-tertiary/30 text-tertiary"
                : "bg-error-container/20 border-error/30 text-error"
              : "bg-surface-container-low border-outline-variant text-on-surface-variant";

            return (
              <div
                key={qa.questionId}
                className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 md:p-6 shadow-sm"
              >
                {/* Header info */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-surface-container-low text-primary font-extrabold w-10 h-10 rounded-xl flex items-center justify-center font-[Poppins]">
                      {index + 1}
                    </span>
                    <div>
                      <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wide block">Source • Topic</span>
                      <span className="text-xs font-bold text-on-surface">
                        {qa.source} • <span className="text-primary font-black">{qa.topic}</span>
                      </span>
                    </div>
                  </div>

                  {/* Attempt Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border uppercase tracking-wider ${statusStyle}`}>
                      {qa.isAttempted
                        ? qa.isCorrect
                          ? "Correct"
                          : "Incorrect"
                        : "Unattempted"}
                    </span>
                    
                    {/* Ask AI Button */}
                    <button
                      onClick={() => handleAnalyzeWithAI(qa)}
                      className="bg-primary-fixed/30 hover:bg-primary-fixed text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        smart_toy
                      </span>
                      Analyze with AI
                    </button>
                  </div>
                </div>

                {/* Question text */}
                <p className="text-sm font-semibold text-on-surface mb-6 leading-relaxed">
                  {qa.text}
                </p>

                {/* Options Sheet */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {qa.options.map((opt, i) => {
                    const isSelected = qa.userAnswer === i;
                    const isCorrectOption = qa.correctOption === i;

                    let optBorder = "border-outline-variant";
                    let optText = "text-on-surface-variant";
                    let optBg = "bg-surface-container-lowest";

                    if (isCorrectOption) {
                      optBorder = "border-tertiary";
                      optText = "text-tertiary font-bold";
                      optBg = "bg-tertiary-container/10";
                    } else if (isSelected && !qa.isCorrect) {
                      optBorder = "border-error";
                      optText = "text-error font-bold";
                      optBg = "bg-error-container/10";
                    }

                    return (
                      <div
                        key={i}
                        className={`p-3.5 rounded-xl border-2 text-xs flex items-center justify-between ${optBorder} ${optText} ${optBg}`}
                      >
                        <span>{opt}</span>
                        <div className="flex items-center">
                          {isCorrectOption && (
                            <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
                          )}
                          {isSelected && !qa.isCorrect && (
                            <span className="material-symbols-outlined text-error text-sm">cancel</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Local explanation card */}
                {qa.explanation && (
                  <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
                    <span className="text-[10px] font-black uppercase text-primary tracking-wider block mb-1">
                      Concept: {qa.explanation.concept}
                    </span>
                    <p className="text-xs text-on-surface leading-relaxed mb-3 font-medium">
                      {qa.explanation.summary}
                    </p>
                    <div className="flex flex-col gap-1.5 pl-4 border-l-2 border-outline-variant text-[11px] text-on-surface-variant mb-3">
                      {qa.explanation.steps.map((st, sIdx) => (
                        <div key={sIdx} className="leading-relaxed">
                          • {st}
                        </div>
                      ))}
                    </div>
                    {qa.explanation.trick && (
                      <div className="text-[11px] font-bold text-secondary bg-secondary-container/10 p-2.5 rounded-lg border border-secondary-container/20 flex gap-1.5 items-start">
                        <span className="material-symbols-outlined text-sm mt-0.5">tips_and_updates</span>
                        <span>Trick: {qa.explanation.trick}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default TestResultPage;
