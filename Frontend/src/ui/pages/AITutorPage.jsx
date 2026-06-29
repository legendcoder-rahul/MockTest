import React, { useState, useEffect, useRef } from "react";
import { useAITutor } from "../../hooks/useAITutor";

export const AITutorPage = () => {
  const tutor = useAITutor();
  const [inputText, setInputText] = useState("");
  const chatBottomRef = useRef(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tutor.chatHistory, tutor.loading]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    tutor.ask(inputText);
    setInputText("");
  };

  const handleChipClick = (chipText) => {
    tutor.ask(chipText);
  };

  // Mock list of incorrect questions to select from if no active question is loaded in context
  const mockIncorrectQuestions = [
    {
      id: "q2",
      number: 2,
      topic: "HCF & LCM",
      source: "SSC CGL 2023 (Tier 1)",
      text: "Find the HCF of 2³ × 3² × 5, 2² × 3³ × 5², and 2⁴ × 3 × 5³ × 7.",
      options: [
        "A) 2⁴ × 3³ × 5³ × 7 (LCM)",
        "B) 2³ × 3² × 5",
        "C) 2² × 3 × 5",
        "D) 2² × 3² × 5²"
      ],
      correctOption: 2,
      userAnswer: 0,
      isCorrect: false
    },
    {
      id: "q1",
      number: 1,
      topic: "Number Systems",
      source: "SSC CGL 2022 (Tier 1)",
      text: "If a number is divided by 5, the remainder is 3. When the same number is divided by 10, what will the remainder be?",
      options: [
        "A) 3",
        "B) 8",
        "C) Cannot be determined",
        "D) 5"
      ],
      correctOption: 2,
      userAnswer: 0,
      isCorrect: false
    }
  ];

  return (
    <main className="flex-1 flex overflow-hidden w-full max-w-[1280px] mx-auto border-x border-outline-variant bg-surface-container-lowest h-[calc(100vh-64px)]">
      {/* Left Panel: Question Navigator (35%) - Hidden on Mobile if a chat is active */}
      <aside className="hidden md:flex md:w-[35%] border-r border-outline-variant bg-surface-container-low flex-col h-full">
        <div className="p-4 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center">
          <h2 className="text-xs font-bold text-primary uppercase tracking-wider font-[Poppins]">
            Target Questions
          </h2>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-error-container/20 text-error rounded-sm">
            Review List
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {mockIncorrectQuestions.map((q) => {
            const isActive = tutor.activeQuestionContext?.id === q.id;
            return (
              <button
                key={q.id}
                onClick={() => tutor.startSession(q)}
                className={`w-full flex items-center p-3.5 rounded-xl border text-left transition-all ${
                  isActive
                    ? "border-primary bg-primary-fixed/20 shadow-sm"
                    : "border-outline-variant hover:border-primary"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-error-container/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="material-symbols-outlined text-error text-base">cancel</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold ${isActive ? "text-primary" : "text-on-surface"}`}>
                    Q{q.number}. {q.topic}
                  </p>
                  <p className="text-[10px] text-on-surface-variant truncate mt-0.5">{q.text}</p>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Right Panel: AI Chat Interface (65%) */}
      <section className="flex-grow md:w-[65%] flex flex-col h-full bg-background relative">
        {/* Chat Header */}
        <header className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/10 text-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl font-semibold">smart_toy</span>
            </div>
            <div>
              <h1 className="text-sm font-bold uppercase tracking-wider text-primary-foreground font-[Poppins]">AI Tutor Engine</h1>
              <p className="text-[10px] font-semibold text-primary-fixed-dim">
                {tutor.activeQuestionContext
                  ? `Analyzing question: ${tutor.activeQuestionContext.topic}`
                  : "Ready to assist you with calculations"}
              </p>
            </div>
          </div>
          
          <button
            onClick={tutor.clear}
            className="text-primary-fixed-dim hover:text-primary-foreground text-xs font-bold bg-primary-foreground/5 hover:bg-primary-foreground/10 px-3 py-1.5 rounded-lg border border-primary-foreground/10"
          >
            Clear Conversation
          </button>
        </header>

        {/* Chat History Area */}
        <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6 pb-40">
          {/* Question Context Card */}
          {tutor.activeQuestionContext && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm max-w-2xl mx-auto w-full relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-secondary-container"></div>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold uppercase text-primary tracking-wider font-[Poppins]">
                  Question Context
                </span>
                <span className="px-2 py-0.5 bg-error-container/20 text-error text-[9px] uppercase font-extrabold rounded">
                  {tutor.activeQuestionContext.topic}
                </span>
              </div>
              <p className="text-sm font-semibold text-on-surface mb-4 leading-relaxed">
                {tutor.activeQuestionContext.text}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 text-xs bg-surface-container-low p-3.5 rounded-xl border border-outline-variant">
                <div className="flex-1">
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wide">Your Choice:</span>
                  <p className="text-xs text-error font-bold flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-sm">cancel</span>
                    {tutor.activeQuestionContext.options[tutor.activeQuestionContext.userAnswer] || "A) LCM"}
                  </p>
                </div>
                <div className="flex-1">
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wide">Correct Answer:</span>
                  <p className="text-xs text-tertiary font-bold flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    {tutor.activeQuestionContext.options[tutor.activeQuestionContext.correctOption] || "C) HCF"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Messages list */}
          {tutor.chatHistory.map((msg, idx) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={idx}
                className={`flex gap-3.5 max-w-[85%] ${
                  isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                  isUser
                    ? "bg-surface-container-low text-on-surface"
                    : "bg-primary text-primary-foreground"
                }`}>
                  <span className="material-symbols-outlined text-sm">
                    {isUser ? "person" : "smart_toy"}
                  </span>
                </div>

                {/* Message Bubble */}
                <div className="flex flex-col gap-3">
                  <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    isUser
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-surface-container-lowest border border-outline-variant text-on-surface rounded-tl-none font-semibold"
                  }`}>
                    {msg.text}
                  </div>

                  {/* Concept Card */}
                  {msg.conceptCard && (
                    <div className="bg-primary-fixed/20 border-l-4 border-primary p-4 rounded-r-xl max-w-lg">
                      <h4 className="text-xs font-bold text-primary mb-1.5 uppercase tracking-wide flex items-center gap-1 font-[Poppins]">
                        <span className="material-symbols-outlined text-sm">menu_book</span>
                        {msg.conceptCard.title}
                      </h4>
                      <p className="text-xs text-on-surface leading-relaxed font-semibold">
                        {msg.conceptCard.content}
                      </p>
                    </div>
                  )}

                  {/* Bento-style compare cards */}
                  {msg.bentoBox && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-error/5 rounded-bl-full -mr-4 -mt-4"></div>
                        <h4 className="text-base font-bold text-error mb-1 font-[Poppins]">HCF</h4>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-2">Highest Common Factor</p>
                        <p className="text-xs text-on-surface font-bold bg-surface-container-low px-2 py-1.5 rounded border border-outline-variant shadow-sm w-fit">
                          Take the <span className="text-error">LOWEST</span> powers of common primes.
                        </p>
                      </div>

                      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-tertiary/5 rounded-bl-full -mr-4 -mt-4"></div>
                        <h4 className="text-base font-bold text-tertiary mb-1 font-[Poppins]">LCM</h4>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-2">Lowest Common Multiple</p>
                        <p className="text-xs text-on-surface font-bold bg-surface-container-low px-2 py-1.5 rounded border border-outline-variant shadow-sm w-fit">
                          Take the <span className="text-tertiary">HIGHEST</span> powers of all primes.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Chips */}
                  {msg.actionChips && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {msg.actionChips.map((chip, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => handleChipClick(chip)}
                          className="bg-secondary-container/10 hover:bg-secondary-container/20 border border-secondary-container/30 text-secondary px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">tips_and_updates</span>
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Thinking loading indicator */}
          {tutor.loading && (
            <div className="flex gap-3.5 mr-auto max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-sm">smart_toy</span>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"></span>
                <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Bottom Input Area */}
        <div className="absolute bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant p-4 shadow-inner">
          {/* Quick Suggestion Chips */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1 hide-scrollbar">
            {["Explain in Hindi", "Shortcut trick", "Show derivation", "Show formula rules"].map((suggest, sIdx) => (
              <button
                key={sIdx}
                onClick={() => handleChipClick(suggest)}
                className="whitespace-nowrap px-3.5 py-1.5 rounded-full border border-outline-variant hover:border-primary bg-surface-container-low hover:bg-surface-container-lowest text-on-surface-variant hover:text-primary text-xs font-semibold transition-colors"
              >
                {suggest}
              </button>
            ))}
          </div>

          {/* Form Textbox */}
          <form onSubmit={handleSendMessage} className="relative flex items-center bg-surface-container-low rounded-2xl border border-outline-variant focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                tutor.activeQuestionContext
                  ? "Ask the AI Tutor a follow-up question..."
                  : "Select a question context first or ask a general doubt..."
              }
              className="w-full bg-transparent border-none focus:ring-0 py-3 pl-4 pr-12 text-sm text-on-surface placeholder:text-on-surface-variant/60"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="absolute right-2 bg-primary disabled:opacity-40 text-primary-foreground rounded-lg hover:opacity-90 transition-all shadow-sm h-9 w-9 flex items-center justify-center active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};
export default AITutorPage;
