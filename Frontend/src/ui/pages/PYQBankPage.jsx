import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../api/apiService";

export const PYQBankPage = () => {
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  useEffect(() => {
    const loadPYQs = async () => {
      const data = await apiService.fetchPYQPapers();
      setPapers(data);
    };
    loadPYQs();
  }, []);

  const handlePracticePaper = (paperId) => {
    // Redirect to test configuration board with default template matching the paper type
    navigate(`/test-config/quant`);
  };

  const filteredPapers = papers.filter((p) => {
    const subMatch = selectedSubject === "all" || p.subject === selectedSubject;
    const yearMatch = selectedYear === "all" || p.year.toString() === selectedYear;
    return subMatch && yearMatch;
  });

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8">
      {/* Header info */}
      <div className="border-b border-outline-variant pb-5">
        <h1 className="text-[32px] leading-[1.3] font-bold text-primary tracking-tight font-[Poppins]">
          Previous Year Question Bank
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Access actual past papers and solve them in real exam conditions. Solve, analyze, and learn with AI explanation tools.
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-container-lowest border border-outline-variant p-4 rounded-2xl shadow-sm">
        <div className="flex flex-wrap gap-3">
          {/* Subject Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Subject</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="rounded-xl border border-outline-variant bg-transparent px-3 py-1.5 text-xs outline-none text-on-surface"
            >
              <option value="all">All Subjects</option>
              <option value="quant">Quantitative Aptitude</option>
              <option value="reasoning">Logical Reasoning</option>
              <option value="english">English Comprehension</option>
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Year</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="rounded-xl border border-outline-variant bg-transparent px-3 py-1.5 text-xs outline-none text-on-surface"
            >
              <option value="all">All Years</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-on-surface-variant font-semibold">{filteredPapers.length} Papers Available</div>
      </div>

      {/* Paper Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPapers.map((paper) => (
          <div
            key={paper.id}
            className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-all duration-300"
          >
            <div>
              <div className="flex justify-between items-start gap-4 mb-3">
                <h3 className="text-lg font-bold text-primary hover:opacity-85 transition-colors font-[Poppins]">
                  {paper.title}
                </h3>
                <span className="text-xs font-bold bg-primary-fixed text-primary border border-outline-variant px-3 py-0.5 rounded-full">
                  {paper.year}
                </span>
              </div>

              {/* Badges info */}
              <div className="flex flex-wrap gap-2 text-xs font-bold text-on-surface-variant mt-1 mb-6">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">subject</span>
                  <span>{paper.subject === "quant" ? "Mathematics" : paper.subject}</span>
                </span>
                <span className="text-outline-variant">•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">quiz</span>
                  <span>{paper.questionsCount} Questions</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => handlePracticePaper(paper.id)}
              className="w-full bg-primary hover:opacity-95 text-primary-foreground py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              Solve Paper
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PYQBankPage;
