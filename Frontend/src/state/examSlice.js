import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../api/apiService";

export const startExamAsync = createAsyncThunk(
  "exam/startExam",
  async (testId, { rejectWithValue }) => {
    try {
      const test = await apiService.fetchTestById(testId);
      return test;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const submitExamAsync = createAsyncThunk(
  "exam/submitExam",
  async ({ testId, answers, timeSpent }, { rejectWithValue }) => {
    try {
      const result = await apiService.submitTestResults(testId, answers, timeSpent);
      return result;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  subjects: [],
  tests: [],
  activeTest: null,
  userAnswers: {}, // index -> optionIndex
  markedForReview: {}, // index -> boolean
  visitedQuestions: { 0: true }, // index -> boolean
  currentQuestionIndex: 0,
  timeLeft: 0, // in seconds
  examActive: false,
  testResult: null,
  recentActivity: [],
  loading: false,
  error: null
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    setSubjects(state, action) {
      state.subjects = action.payload;
    },
    setTests(state, action) {
      state.tests = action.payload;
    },
    selectAnswer(state, action) {
      const { questionIndex, optionIndex } = action.payload;
      state.userAnswers[questionIndex] = optionIndex;
    },
    clearAnswer(state, action) {
      const { questionIndex } = action.payload;
      delete state.userAnswers[questionIndex];
    },
    toggleMarkForReview(state, action) {
      const { questionIndex } = action.payload;
      state.markedForReview[questionIndex] = !state.markedForReview[questionIndex];
    },
    nextQuestion(state) {
      if (state.activeTest && state.currentQuestionIndex < state.activeTest.questions.length - 1) {
        state.currentQuestionIndex += 1;
        state.visitedQuestions[state.currentQuestionIndex] = true;
      }
    },
    prevQuestion(state) {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
        state.visitedQuestions[state.currentQuestionIndex] = true;
      }
    },
    goToQuestion(state, action) {
      const index = action.payload;
      if (state.activeTest && index >= 0 && index < state.activeTest.questions.length) {
        state.currentQuestionIndex = index;
        state.visitedQuestions[index] = true;
      }
    },
    tickTimer(state) {
      if (state.timeLeft > 0) {
        state.timeLeft -= 1;
      }
    },
    setTimeLeft(state, action) {
      state.timeLeft = action.payload;
    },
    exitExam(state) {
      state.examActive = false;
      state.activeTest = null;
      state.userAnswers = {};
      state.markedForReview = {};
      state.visitedQuestions = { 0: true };
      state.currentQuestionIndex = 0;
      state.timeLeft = 0;
    },
    clearTestResult(state) {
      state.testResult = null;
    },
    addRecentActivity(state, action) {
      state.recentActivity.unshift(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Start Exam
      .addCase(startExamAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.testResult = null;
      })
      .addCase(startExamAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.activeTest = action.payload;
        state.userAnswers = {};
        state.markedForReview = {};
        state.visitedQuestions = { 0: true };
        state.currentQuestionIndex = 0;
        state.timeLeft = action.payload.timeLimit * 60; // Convert to seconds
        state.examActive = true;
      })
      .addCase(startExamAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit Exam
      .addCase(submitExamAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitExamAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.examActive = false;
        state.testResult = action.payload;
        state.activeTest = null;
        state.recentActivity.unshift({
          id: `act-${Date.now()}`,
          type: "test",
          title: action.payload.testTitle,
          date: "Just now",
          score: `${Math.round((action.payload.score / action.payload.maxScore) * 100)}%`,
          status: "completed"
        });
      })
      .addCase(submitExamAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setSubjects,
  setTests,
  selectAnswer,
  clearAnswer,
  toggleMarkForReview,
  nextQuestion,
  prevQuestion,
  goToQuestion,
  tickTimer,
  setTimeLeft,
  exitExam,
  clearTestResult,
  addRecentActivity
} = examSlice.actions;

export default examSlice.reducer;
