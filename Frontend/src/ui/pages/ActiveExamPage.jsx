import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExam } from "../../hooks/useExam";
import { useTimer } from "../../hooks/useTimer";

export const ActiveExamPage = () => {
  const navigate = useNavigate();
  const exam = useExam();
  const [paletteMobileOpen, setPaletteMobileOpen] = useState(false);

  // Calculate time spent (initial time - current time)
  const totalTimeSeconds = (exam.activeTest?.timeLimit || 10) * 60;
  
  const handleExamSubmit = async () => {
    if (!exam.activeTest) return;
    const timeSpent = totalTimeSeconds - exam.timeLeft;
    
    // Submit test results to Redux
    await exam.submitTest(exam.activeTest.id, timeSpent);
    navigate("/test-result/analysis");
  };

  const timer = useTimer(handleExamSubmit);

  if (!exam.activeTest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-6 text-on-surface-variant">
        <span className="material-symbols-outlined text-5xl mb-3">assignment_late</span>
        <p className="font-bold text-lg">No active exam session.</p>
        <button
          onClick={() => navigate("/subjects")}
          className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-bold shadow-sm"
        >
          Go to Subjects
        </button>
      </div>
    );
  }

  const qIndex = exam.currentQuestionIndex;
  const qCount = exam.activeTest.questions.length;
  const currentQ = exam.currentQuestion;
  const selectedOption = exam.userAnswers[qIndex];
  const isMarked = exam.markedForReview[qIndex];

  // Calculate progress percent
  const attemptedCount = Object.keys(exam.userAnswers).length;
  const progressPercent = Math.round((attemptedCount / qCount) * 100);

  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit the exam? Your progress will be lost.")) {
      exam.exit();
      navigate("/dashboard");
    }
  };

  const getQuestionPaletteStyle = (idx) => {
    const isCurrent = idx === qIndex;
    const isAns = exam.userAnswers[idx] !== undefined;
    const isFlg = exam.markedForReview[idx];

    if (isCurrent) {
      return "border-2 border-secondary text-secondary bg-surface-container-lowest font-extrabold shadow-sm ring-2 ring-secondary/20";
    }
    if (isFlg) {
      return "bg-secondary text-secondary-foreground border-transparent font-bold shadow-sm";
    }
    if (isAns) {
      return "bg-primary text-primary-foreground border-transparent font-bold shadow-sm";
    }
    return "bg-surface-container-lowest border-outline-variant text-on-surface hover:bg-surface-container-low";
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground select-none">
      {/* Top Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant h-16 flex justify-between items-center px-4 md:px-8 z-40">
        <button
          onClick={handleExit}
          className="flex items-center text-on-surface-variant hover:text-error font-bold text-sm gap-1 hover:bg-surface-container-low p-2 rounded-xl transition-colors"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Exit
        </button>

        <div className="flex flex-col items-center">
          <h1 className="text-sm md:text-base font-bold text-primary text-center font-[Poppins]">
            {exam.activeTest.title}
          </h1>
          <span className="text-[10px] md:text-xs font-bold bg-surface-container-low text-on-surface-variant px-2.5 py-0.5 rounded-full mt-0.5">
            {exam.activeTest.examType}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Desktop Timer */}
          <div className="hidden md:flex items-center gap-2 bg-surface-container-low border border-outline-variant px-3.5 py-1.5 rounded-xl">
            <span className="text-xs font-bold text-on-surface-variant">Q {qIndex + 1}/{qCount}</span>
            <span className="w-px h-3.5 bg-outline-variant"></span>
            <span className={`material-symbols-outlined text-lg ${timer.isUrgent ? "text-secondary animate-pulse" : "text-on-surface-variant"}`}>
              timer
            </span>
            <span className={`text-sm font-extrabold tracking-wider ${timer.isUrgent ? "text-secondary font-black" : "text-primary"}`}>
              {timer.formattedTime}
            </span>
          </div>

          <button
            onClick={handleExamSubmit}
            className="bg-primary hover:opacity-95 text-primary-foreground font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
          >
            Submit
          </button>
        </div>
      </header>

      {/* Global Progress Bar */}
      <div className="w-full h-1 bg-surface-container-low z-30">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Main Panel - Split Layout */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Panel: Question Canvas (70% on desktop) */}
        <section className="flex-1 md:w-[70%] bg-surface-container-lowest flex flex-col border-r border-outline-variant relative h-full overflow-y-auto">
          {/* Mobile Timer & Stats Bar */}
          <div className="md:hidden flex justify-between items-center p-4 bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-10 shadow-sm">
            <span className="text-xs font-bold text-on-surface-variant">Question {qIndex + 1} of {qCount}</span>
            <div className={`flex items-center gap-1 font-extrabold text-sm ${timer.isUrgent ? "text-secondary" : "text-primary"}`}>
              <span className="material-symbols-outlined text-base">timer</span>
              <span>{timer.formattedTime}</span>
            </div>
          </div>

          {/* Question Text Options */}
          <div className="p-6 md:p-10 lg:p-12 flex-1 max-w-3xl mx-auto w-full flex flex-col justify-start">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant">
              <div className="flex items-center gap-3">
                <span className="bg-surface-container-low text-primary font-extrabold text-lg w-11 h-11 rounded-xl flex items-center justify-center shadow-inner font-[Poppins]">
                  {qIndex + 1}
                </span>
                <div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Source & Topic</span>
                  <span className="text-xs font-bold text-on-surface">
                    {currentQ.source} • <span className="text-primary font-black">{currentQ.topic}</span>
                  </span>
                </div>
              </div>

              <button
                onClick={exam.toggleReview}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                  isMarked
                    ? "bg-secondary-container/20 border-secondary/30 text-secondary"
                    : "bg-surface-container-low hover:bg-surface-container border-outline-variant text-on-surface-variant"
                }`}
              >
                <span className={`material-symbols-outlined text-sm ${isMarked ? "fill" : ""}`}>flag</span>
                {isMarked ? "Marked for Review" : "Mark for Review"}
              </button>
            </div>

            {/* Question Text */}
            <div className="text-base md:text-lg text-on-surface leading-relaxed font-semibold mb-8">
              {currentQ.text}
            </div>

            {/* Options List */}
            <div className="flex flex-col gap-4 flex-grow">
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedOption === i;
                return (
                  <label
                    key={i}
                    onClick={() => exam.select(i)}
                    className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary-fixed/20"
                        : "border-outline-variant hover:border-primary"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${currentQ.id}`}
                      checked={isSelected}
                      readOnly
                      className="mt-1 w-4 h-4 text-primary border-outline-variant focus:ring-primary"
                    />
                    <span className={`ml-4 text-sm font-semibold ${isSelected ? "text-primary font-bold" : "text-on-surface-variant"}`}>
                      {opt}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Footer Bar */}
          <div className="p-4 md:p-6 bg-surface-container-lowest border-t border-outline-variant flex flex-col sm:flex-row justify-between items-center sticky bottom-0 z-10 gap-4 sm:gap-0">
            <button
              onClick={exam.clear}
              className="w-full sm:w-auto text-xs font-bold text-on-surface-variant hover:text-error py-2.5 px-4 rounded-xl border border-outline-variant hover:bg-surface-container-low transition-colors"
            >
              Clear Response
            </button>

            <div className="flex w-full sm:w-auto gap-3">
              <button
                onClick={exam.prev}
                disabled={qIndex === 0}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl border border-primary text-primary text-xs font-bold hover:bg-surface-container-low disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <span className="material-symbols-outlined text-sm">navigate_before</span>
                Previous
              </button>
              {qIndex === qCount - 1 ? (
                <button
                  onClick={handleExamSubmit}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-7 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-bold hover:opacity-90 transition-all shadow-md cursor-pointer"
                >
                  Submit Test
                  <span className="material-symbols-outlined text-xs">check_circle</span>
                </button>
              ) : (
                <button
                  onClick={exam.next}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-7 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all"
                >
                  Save &amp; Next
                  <span className="material-symbols-outlined text-sm">navigate_next</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Right Panel: Question Palette (30% on desktop) */}
        <section className="w-[30%] bg-surface-container-lowest flex flex-col h-full hidden md:flex border-l border-outline-variant">
          <div className="p-5 border-b border-outline-variant">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-1 font-[Poppins]">Question Palette</h3>
            <p className="text-xs text-on-surface-variant">Navigate to any question directly</p>
          </div>

          <div className="flex-grow p-5 overflow-y-auto flex flex-col gap-6">
            {/* Palette status labels */}
            <div className="grid grid-cols-2 gap-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-primary rounded flex items-center justify-center text-primary-foreground text-[9px]">✔</span>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-secondary rounded flex items-center justify-center text-secondary-foreground text-[9px]">⚑</span>
                <span>Marked</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-surface-container-lowest border border-outline-variant rounded flex items-center justify-center text-on-surface-variant"></span>
                <span>Not Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-secondary bg-surface-container-lowest rounded flex items-center justify-center"></span>
                <span>Current</span>
              </div>
            </div>

            {/* Grid Box */}
            <div className="grid grid-cols-5 gap-2.5">
              {Array.from({ length: qCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => exam.goTo(i)}
                  className={`w-10 h-10 rounded-lg border text-xs font-bold flex items-center justify-center transition-all ${getQuestionPaletteStyle(i)}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 bg-surface-container border-t border-outline-variant text-xs font-semibold text-on-surface-variant">
            <div className="flex justify-between items-center mb-2">
              <span>Attempted</span>
              <span className="font-extrabold text-primary">{attemptedCount} / {qCount}</span>
            </div>
            <div className="w-full bg-surface-container-low rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Drawer Trigger (Floating Apps Icon) */}
      <div className="md:hidden fixed bottom-24 right-4 z-20">
        <button
          onClick={() => setPaletteMobileOpen(true)}
          className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center focus:outline-none active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-2xl">apps</span>
        </button>
      </div>

      {/* Mobile Drawer Slide-over */}
      {paletteMobileOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          {/* Backdrop */}
          <div onClick={() => setPaletteMobileOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

          {/* Drawer content */}
          <div className="relative w-[80%] max-w-[320px] h-full bg-surface-container-lowest flex flex-col shadow-2xl z-10 animation-slide-in">
            <div className="p-5 border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-extrabold text-primary uppercase tracking-wide text-sm font-[Poppins]">Question Palette</h3>
              <button
                onClick={() => setPaletteMobileOpen(false)}
                className="text-on-surface-variant hover:text-primary hover:bg-surface-container-low p-1.5 rounded-lg"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase text-on-surface-variant">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 bg-primary rounded flex items-center justify-center text-primary-foreground text-[8px]">✔</span>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 bg-secondary rounded flex items-center justify-center text-secondary-foreground text-[8px]">⚑</span>
                  <span>Marked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 bg-surface-container-lowest border border-outline-variant rounded flex items-center justify-center"></span>
                  <span>Not Visited</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 border border-secondary bg-surface-container-lowest rounded flex items-center justify-center"></span>
                  <span>Current</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: qCount }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      exam.goTo(i);
                      setPaletteMobileOpen(false);
                    }}
                    className={`w-10 h-10 rounded-lg border text-xs font-bold flex items-center justify-center transition-all ${getQuestionPaletteStyle(i)}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 bg-surface-container border-t border-outline-variant text-xs font-semibold text-on-surface-variant">
              <div className="flex justify-between items-center mb-2">
                <span>Attempted</span>
                <span>{attemptedCount} / {qCount}</span>
              </div>
              <div className="w-full bg-surface-container-low rounded-full h-1.5">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ActiveExamPage;
