import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { startExamAsync } from "../../state/examSlice";
import { apiService } from "../../api/apiService";

export const TestConfigPage = () => {
  const { subjectId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subjects = useSelector((state) => state.exam.subjects);
  const loading = useSelector((state) => state.exam.loading);

  const activeSubject = subjects.find((s) => s.id === subjectId) || {
    name: subjectId || "Subject"
  };

  // Mode: "select" | "random" | "chapter"
  const [mode, setMode] = useState("select");

  // Chapter-wise state
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [chaptersLoading, setChaptersLoading] = useState(false);

  // Random state
  const [numQuestions, setNumQuestions] = useState(10);

  // Common
  const [startingTest, setStartingTest] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "chapter") {
      const loadChapters = async () => {
        setChaptersLoading(true);
        setError("");
        const data = await apiService.fetchChapters(subjectId);
        setChapters(data);
        if (data.length > 0) {
          setSelectedChapter(data[0].name);
        } else {
          setError("No chapters found in database for this subject.");
        }
        setChaptersLoading(false);
      };
      loadChapters();
    }
  }, [subjectId, mode]);

  const selectedChapterData = chapters.find(ch => ch.name === selectedChapter);

  const handleStartChapterTest = async () => {
    if (!selectedChapter) return;
    setStartingTest(true);
    setError("");

    const test = await apiService.fetchTestByChapter(subjectId, selectedChapter, difficulty);
    if (!test) {
      setError("No questions found for this chapter/difficulty combination.");
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

  const handleStartRandomTest = async () => {
    setStartingTest(true);
    setError("");

    const test = await apiService.fetchRandomTestBySubject(subjectId, numQuestions);
    if (!test) {
      setError("No questions found for this subject in the database.");
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
        onClick={() => mode === "select" ? navigate("/subjects") : setMode("select")}
        className="flex items-center text-on-surface-variant hover:text-primary transition-colors w-fit text-sm font-bold gap-1"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        {mode === "select" ? "Back to Subjects" : "Back to Test Mode"}
      </button>

      {/* ========== MODE SELECT SCREEN ========== */}
      {mode === "select" && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight mb-2 font-[Poppins]">
            {activeSubject.name}
          </h1>
          <p className="text-on-surface-variant text-sm mb-8">
            Choose how you want to practice
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Random Questions Card */}
            <button
              onClick={() => setMode("random")}
              className="flex flex-col items-start gap-4 p-6 rounded-2xl border-2 border-outline-variant hover:border-primary hover:shadow-lg transition-all text-left group bg-surface-container-lowest"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-2xl">shuffle</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                  Random Questions
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Get a random mix of questions from all chapters of this subject. Great for quick revision and surprise practice.
                </p>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Select <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </button>

            {/* Chapter-wise Card */}
            <button
              onClick={() => setMode("chapter")}
              className="flex flex-col items-start gap-4 p-6 rounded-2xl border-2 border-outline-variant hover:border-primary hover:shadow-lg transition-all text-left group bg-surface-container-lowest"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">menu_book</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                  Chapter-wise Test
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Pick a specific chapter and difficulty level. Focus on your weak areas and practice targeted questions.
                </p>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Select <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ========== RANDOM MODE ========== */}
      {mode === "random" && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight mb-2 font-[Poppins]">
            Random Practice
          </h1>
          <p className="text-on-surface-variant text-sm mb-8">
            Subject: <span className="font-bold text-primary">{activeSubject.name}</span>
            {" "}— Questions will be randomly picked from all chapters.
          </p>

          {/* Number of questions */}
          <div className="flex flex-col gap-2 mb-6">
            <label className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wide">
              Number of Questions
            </label>
            <div className="flex gap-2 flex-wrap">
              {[5, 10, 15, 20, 25].map((n) => (
                <button
                  key={n}
                  onClick={() => setNumQuestions(n)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                    numQuestions === n
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-transparent text-on-surface-variant border-outline-variant hover:border-primary"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="p-4 rounded-xl bg-secondary-container/10 border border-secondary-container/20 flex gap-3 text-on-surface mb-6">
            <span className="material-symbols-outlined text-secondary mt-0.5">info</span>
            <div className="text-xs flex flex-col gap-1 leading-relaxed">
              <span className="font-bold text-on-surface">Exam Instructions:</span>
              <span>• Negative marking: +2.0 for correct answers, -0.5 for incorrect selections.</span>
              <span>• Questions are randomly selected from the database each time.</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-semibold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          <button
            onClick={handleStartRandomTest}
            disabled={startingTest || loading}
            className="w-full bg-primary hover:opacity-95 text-primary-foreground py-3.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {startingTest || loading ? (
              <span>Loading Random Questions...</span>
            ) : (
              <>
                <span>Start Random Test ({numQuestions} Qs)</span>
                <span className="material-symbols-outlined text-sm">rocket_launch</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* ========== CHAPTER-WISE MODE ========== */}
      {mode === "chapter" && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight mb-2 font-[Poppins]">
            Chapter-wise Mock Test
          </h1>
          <p className="text-on-surface-variant text-sm mb-8">
            Subject: <span className="font-bold text-primary">{activeSubject.name}</span>
          </p>

          {chaptersLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl animate-spin mb-3">progress_activity</span>
              <p className="text-sm font-semibold">Loading chapters from database...</p>
            </div>
          ) : chapters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-3">folder_off</span>
              <p className="text-sm font-semibold">{error || "No chapters available."}</p>
            </div>
          ) : (
            <>
              {/* Chapter Cards */}
              <div className="flex flex-col gap-3 mb-6">
                <label className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wide">
                  Select Chapter
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {chapters.map((ch) => {
                    const isSelected = selectedChapter === ch.name;
                    return (
                      <button
                        key={ch.name}
                        onClick={() => setSelectedChapter(ch.name)}
                        className={`flex flex-col gap-2 p-4 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary-fixed/20 shadow-sm"
                            : "border-outline-variant hover:border-primary/50 hover:bg-surface-container-low"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-bold ${isSelected ? "text-primary" : "text-on-surface"}`}>
                            {ch.name}
                          </span>
                          {isSelected && (
                            <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-semibold text-on-surface-variant">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">quiz</span>
                            {ch.questionCount} Questions
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">signal_cellular_alt</span>
                            {ch.difficulties.join(", ")}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="flex flex-col gap-2 mb-6">
                <label className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wide">
                  Difficulty
                </label>
                <div className="flex gap-2 flex-wrap">
                  {["All", "Easy", "Medium", "Hard"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        difficulty === d
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-transparent text-on-surface-variant border-outline-variant hover:border-primary"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Chapter Info */}
              {selectedChapterData && (
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary text-xl">menu_book</span>
                  <div className="text-sm">
                    <span className="font-bold text-on-surface">{selectedChapterData.name}</span>
                    <span className="text-on-surface-variant"> — {selectedChapterData.questionCount} questions available</span>
                    {difficulty !== "All" && (
                      <span className="text-on-surface-variant"> (filtering: {difficulty})</span>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-semibold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {error}
                </div>
              )}

              {/* Instructions */}
              <div className="p-4 rounded-xl bg-secondary-container/10 border border-secondary-container/20 flex gap-3 text-on-surface">
                <span className="material-symbols-outlined text-secondary mt-0.5">info</span>
                <div className="text-xs flex flex-col gap-1 leading-relaxed">
                  <span className="font-bold text-on-surface">Exam Instructions:</span>
                  <span>• Negative marking: +2.0 for correct answers, -0.5 for incorrect selections.</span>
                  <span>• Auto-submit: Test will end automatically when the countdown expires.</span>
                </div>
              </div>

              <button
                onClick={handleStartChapterTest}
                disabled={startingTest || loading || !selectedChapter}
                className="w-full bg-primary hover:opacity-95 text-primary-foreground py-3.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-[0.98] mt-8 flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {startingTest || loading ? (
                  <span>Loading Exam Paper...</span>
                ) : (
                  <>
                    <span>Launch Chapter Test</span>
                    <span className="material-symbols-outlined text-sm">rocket_launch</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default TestConfigPage;
