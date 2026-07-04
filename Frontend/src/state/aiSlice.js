import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../api/apiService";

export const sendMessageAsync = createAsyncThunk(
  "ai/sendMessage",
  async ({ text }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const chatId = state.ai.chatId;
      const questionContext = state.ai.activeQuestionContext;
      const response = await apiService.sendMessageToTutor(text, chatId, questionContext);
      return response; // Returns { success: true, chatId, messages }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const initTutorSessionAsync = createAsyncThunk(
  "ai/initTutorSession",
  async (question, { rejectWithValue }) => {
    try {
      const response = await apiService.sendMessageToTutor(
        `Please explain this question: "${question.text}"`,
        null,
        question
      );
      return { question, response }; // response is { success: true, chatId, messages }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  chatHistory: [], // Array of messages
  activeQuestionContext: null, // Current question object
  chatId: null, // Database chat session ID
  loading: false,
  error: null
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    addMessage(state, action) {
      state.chatHistory.push(action.payload);
    },
    clearChat(state) {
      state.chatHistory = [];
      state.activeQuestionContext = null;
      state.chatId = null;
    },
    setQuestionContext(state, action) {
      state.activeQuestionContext = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Init Session
      .addCase(initTutorSessionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.chatHistory = [];
        state.chatId = null;
      })
      .addCase(initTutorSessionAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.activeQuestionContext = action.payload.question;
        state.chatId = action.payload.response.chatId;
        state.chatHistory = action.payload.response.messages;
      })
      .addCase(initTutorSessionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send Message
      .addCase(sendMessageAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessageAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.chatId = action.payload.chatId;
        state.chatHistory.push(...action.payload.messages);
      })
      .addCase(sendMessageAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { addMessage, clearChat, setQuestionContext } = aiSlice.actions;

export default aiSlice.reducer;
