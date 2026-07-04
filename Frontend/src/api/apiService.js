import { mockSubjects, mockTests, mockPYQPapers, mockUserStats, mockAIReplies } from "./mockData";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

// Cache for dynamically loaded tests from backend
let dbTestsCache = [];

export const apiService = {
  async fetchSubjects() {
    await delay(300);
    return [...mockSubjects];
  },

  async fetchTests(subjectId = null) {
    await delay(300);

    let dbSubjectName = "";
    if (subjectId === "english") dbSubjectName = "English Language";
    else if (subjectId === "general") dbSubjectName = "General Knowledge";
    else if (subjectId === "quant") dbSubjectName = "Quantitative Aptitude";
    else if (subjectId === "reasoning") dbSubjectName = "Logical Reasoning";

    if (dbSubjectName) {
      try {
        const response = await fetch(`${API_BASE_URL}/questions/subject/${encodeURIComponent(dbSubjectName)}`);
        if (response.ok) {
          const resData = await response.json();
          if (resData.success && resData.data && resData.data.length > 0) {
            const backendQuestions = resData.data.map((q, idx) => ({
              id: q._id,
              number: idx + 1,
              topic: q.chapter || q.section || "Vocabulary",
              source: q.source || "MockTest Database",
              text: q.questionText,
              options: q.options,
              correctOption: q.options.indexOf(q.correctAnswer) !== -1 ? q.options.indexOf(q.correctAnswer) : 0,
              explanation: {
                concept: q.chapter || q.section || "Vocabulary",
                summary: q.explanation || "",
                steps: q.explanation ? [q.explanation] : [],
                trick: ""
              }
            }));

            const dbTest = {
              id: `${subjectId}-db-test`,
              title: `${subjectId === 'english' ? 'English Comprehension' : subjectId === 'general' ? 'General Awareness' : subjectId} DB Practice Paper`,
              subjectId: subjectId,
              examType: "Database Mock",
              numQuestions: backendQuestions.length,
              timeLimit: Math.max(5, Math.ceil(backendQuestions.length * 1.5)), // 1.5 mins per question
              difficulty: "Medium",
              questions: backendQuestions
            };

            // Add or update in cache
            dbTestsCache = dbTestsCache.filter(t => t.id !== dbTest.id);
            dbTestsCache.push(dbTest);

            return [dbTest];
          }
        }
      } catch (error) {
        console.warn("Failed to fetch questions from database, falling back to mock tests:", error);
      }
    }

    if (subjectId) {
      return mockTests.filter(t => t.subjectId === subjectId);
    }
    return [...mockTests];
  },

  async fetchTestById(testId) {
    await delay(400);

    const dbTest = dbTestsCache.find(t => t.id === testId);
    if (dbTest) {
      return { ...dbTest };
    }

    const test = mockTests.find(t => t.id === testId);
    if (!test) throw new Error("Test not found");
    return { ...test };
  },

  async submitTestResults(testId, answers, timeSpentSeconds) {
    await delay(500);

    let test = dbTestsCache.find(t => t.id === testId);
    if (!test) {
      test = mockTests.find(t => t.id === testId);
    }
    if (!test) throw new Error("Test not found");

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    const questionsAnalysis = test.questions.map((q, idx) => {
      const userAnswer = answers[idx]; // answers is an object/array index
      const isAttempted = userAnswer !== undefined && userAnswer !== null && userAnswer !== "";
      const isCorrect = isAttempted && userAnswer === q.correctOption;

      if (!isAttempted) unattemptedCount++;
      else if (isCorrect) correctCount++;
      else incorrectCount++;

      return {
        questionId: q.id,
        number: q.number,
        topic: q.topic,
        source: q.source,
        text: q.text,
        options: q.options,
        correctOption: q.correctOption,
        userAnswer: isAttempted ? userAnswer : null,
        isCorrect,
        isAttempted,
        explanation: q.explanation
      };
    });

    const score = correctCount * 2 - incorrectCount * 0.5; // SSC CGL marking: +2 for correct, -0.5 for wrong
    const maxScore = test.questions.length * 2;
    const accuracy = correctCount + incorrectCount > 0 
      ? Math.round((correctCount / (correctCount + incorrectCount)) * 1000) / 10 
      : 0;

    const result = {
      testId,
      testTitle: test.title,
      examType: test.examType,
      totalQuestions: test.questions.length,
      correctCount,
      incorrectCount,
      unattemptedCount,
      score,
      maxScore,
      accuracy,
      timeSpentSeconds,
      questionsAnalysis
    };

    // Save to backend database
    try {
      const response = await fetch(`${API_BASE_URL}/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(result),
      });
      if (!response.ok) {
        console.error("Failed to save submission in backend database.");
      }
    } catch (err) {
      console.error("Error connecting to submissions API:", err);
    }

    return result;
  },

  async fetchPYQPapers() {
    await delay(300);
    return [...mockPYQPapers];
  },

  async fetchUserStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/submissions/stats`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.success) {
          return resData;
        }
      }
    } catch (error) {
      console.warn("Failed to fetch stats from database, falling back to mock stats:", error);
    }

    await delay(200);
    return {
      success: true,
      user: {
        username: mockUserStats.name,
        targetExam: mockUserStats.targetExam,
        daysLeft: mockUserStats.daysLeft,
        overallProgress: mockUserStats.overallProgress
      },
      stats: mockUserStats.stats,
      subjectAccuracy: mockUserStats.subjectAccuracy,
      recentActivity: mockUserStats.recentActivity
    };
  },

  async sendMessageToTutor(message, chatId = null, questionContext = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ message, chatId, questionContext }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send message to tutor");
      }
      return data; // Returns { success: true, chatId: '...', messages: [...] }
    } catch (err) {
      console.warn("Failed to communicate with AI tutor backend, falling back to mock reply:", err);

      await delay(600);
      return {
        chatId: chatId || "mock-chat-id",
        messages: [
          {
            sender: "bot",
            text: `I'm having trouble connecting to my brain right now (Error: ${err.message}). Let's review: HCF divides numbers while LCM is divisible by numbers.`,
            actionChips: ["Explain step-by-step", "Try another question"]
          }
        ]
      };
    }
  },

  async fetchChapters(subjectId) {
    const dbSubjectName = getDbSubjectName(subjectId);
    if (!dbSubjectName) return [];

    try {
      const response = await fetch(`${API_BASE_URL}/questions/subject/${encodeURIComponent(dbSubjectName)}/chapters`);
      if (response.ok) {
        const resData = await response.json();
        if (resData.success && resData.data) {
          return resData.data;
        }
      }
    } catch (error) {
      console.warn("Failed to fetch chapters:", error);
    }
    return [];
  },

  async fetchTestByChapter(subjectId, chapterName, difficulty = "All") {
    const dbSubjectName = getDbSubjectName(subjectId);
    if (!dbSubjectName) return null;

    try {
      let url = `${API_BASE_URL}/questions/subject/${encodeURIComponent(dbSubjectName)}/chapter/${encodeURIComponent(chapterName)}`;
      if (difficulty && difficulty !== "All") {
        url += `?difficulty=${encodeURIComponent(difficulty)}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const resData = await response.json();
        if (resData.success && resData.data && resData.data.length > 0) {
          const backendQuestions = resData.data.map((q, idx) => ({
            id: q._id,
            number: idx + 1,
            topic: q.chapter || q.section || "General",
            source: q.source || "MockTest Database",
            text: q.questionText,
            options: q.options,
            correctOption: q.options.indexOf(q.correctAnswer) !== -1 ? q.options.indexOf(q.correctAnswer) : 0,
            explanation: {
              concept: q.chapter || q.section || "General",
              summary: q.explanation || "",
              steps: q.explanation ? [q.explanation] : [],
              trick: ""
            }
          }));

          const testId = `${subjectId}-${chapterName.replace(/\s+/g, '-').toLowerCase()}`;
          const dbTest = {
            id: testId,
            title: `${chapterName}`,
            subjectId: subjectId,
            examType: "Chapter Practice",
            numQuestions: backendQuestions.length,
            timeLimit: Math.max(5, Math.ceil(backendQuestions.length * 1.5)),
            difficulty: difficulty === "All" ? "Mixed" : difficulty,
            questions: backendQuestions
          };

          dbTestsCache = dbTestsCache.filter(t => t.id !== dbTest.id);
          dbTestsCache.push(dbTest);

          return dbTest;
        }
      }
    } catch (error) {
      console.warn("Failed to fetch chapter questions:", error);
    }
    return null;
  },

  async fetchRandomTestBySubject(subjectId, numQuestions = 10) {
    const dbSubjectName = getDbSubjectName(subjectId);
    if (!dbSubjectName) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/questions/subject/${encodeURIComponent(dbSubjectName)}`);
      if (response.ok) {
        const resData = await response.json();
        if (resData.success && resData.data && resData.data.length > 0) {
          const shuffled = shuffleArray([...resData.data]);
          const selected = shuffled.slice(0, Math.min(numQuestions, shuffled.length));

          const backendQuestions = selected.map((q, idx) => ({
            id: q._id,
            number: idx + 1,
            topic: q.chapter || q.section || "General",
            source: q.source || "MockTest Database",
            text: q.questionText,
            options: q.options,
            correctOption: q.options.indexOf(q.correctAnswer) !== -1 ? q.options.indexOf(q.correctAnswer) : 0,
            explanation: {
              concept: q.chapter || q.section || "General",
              summary: q.explanation || "",
              steps: q.explanation ? [q.explanation] : [],
              trick: ""
            }
          }));

          const testId = `${subjectId}-random-${Date.now()}`;
          const dbTest = {
            id: testId,
            title: `${dbSubjectName} — Random Practice`,
            subjectId: subjectId,
            examType: "Random Practice",
            numQuestions: backendQuestions.length,
            timeLimit: Math.max(5, Math.ceil(backendQuestions.length * 1.5)),
            difficulty: "Mixed",
            questions: backendQuestions
          };

          dbTestsCache = dbTestsCache.filter(t => t.id !== dbTest.id);
          dbTestsCache.push(dbTest);
          return dbTest;
        }
      }
    } catch (error) {
      console.warn("Failed to fetch random questions:", error);
    }
    return null;
  },

  async fetchFullMockTest(questionsPerSection = 25) {
    const sections = [
      { subjectId: "quant", name: "Quantitative Aptitude", section: "Quantitative Aptitude" },
      { subjectId: "reasoning", name: "Logical Reasoning", section: "General Intelligence & Reasoning" },
      { subjectId: "english", name: "English Language", section: "English Comprehension" },
      { subjectId: "general", name: "General Knowledge", section: "General Awareness" }
    ];

    let allQuestions = [];
    let sectionIndex = [];

    for (const sec of sections) {
      const dbSubjectName = getDbSubjectName(sec.subjectId);
      if (!dbSubjectName) continue;

      try {
        const response = await fetch(`${API_BASE_URL}/questions/subject/${encodeURIComponent(dbSubjectName)}`);
        if (response.ok) {
          const resData = await response.json();
          if (resData.success && resData.data && resData.data.length > 0) {
            const shuffled = shuffleArray([...resData.data]);
            const selected = shuffled.slice(0, Math.min(questionsPerSection, shuffled.length));

            const startIdx = allQuestions.length;
            const mapped = selected.map((q, idx) => ({
              id: q._id,
              number: allQuestions.length + idx + 1,
              topic: q.chapter || q.section || sec.name,
              source: q.source || "MockTest Database",
              text: q.questionText,
              options: q.options,
              correctOption: q.options.indexOf(q.correctAnswer) !== -1 ? q.options.indexOf(q.correctAnswer) : 0,
              section: sec.section,
              explanation: {
                concept: q.chapter || q.section || sec.name,
                summary: q.explanation || "",
                steps: q.explanation ? [q.explanation] : [],
                trick: ""
              }
            }));

            allQuestions = allQuestions.concat(mapped);
            sectionIndex.push({
              name: sec.section,
              startIndex: startIdx,
              endIndex: startIdx + mapped.length - 1,
              count: mapped.length
            });
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch questions for ${sec.name}:`, error);
      }
    }

    if (allQuestions.length === 0) return null;

    // Re-number all questions sequentially
    allQuestions = allQuestions.map((q, idx) => ({ ...q, number: idx + 1 }));

    const testId = `full-mock-${Date.now()}`;
    const dbTest = {
      id: testId,
      title: "SSC CGL Full Mock Test",
      subjectId: "all",
      examType: "Full Mock — SSC Pattern",
      numQuestions: allQuestions.length,
      timeLimit: 60,
      difficulty: "Mixed",
      questions: allQuestions,
      sections: sectionIndex
    };

    dbTestsCache = dbTestsCache.filter(t => t.id !== dbTest.id);
    dbTestsCache.push(dbTest);
    return dbTest;
  }
};

function getDbSubjectName(subjectId) {
  if (subjectId === "english") return "English Language";
  if (subjectId === "general") return "General Knowledge";
  if (subjectId === "quant") return "Quantitative Aptitude";
  if (subjectId === "reasoning") return "Logical Reasoning";
  return "";
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
