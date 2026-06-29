import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../api/apiService";

export const sendMessageAsync = createAsyncThunk(
  "ai/sendMessage",
  async ({ questionId, text }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const history = state.ai.chatHistory;
      const response = await apiService.sendMessageToTutor(questionId, text, history);
      return response; // Returns array of messages
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const initTutorSessionAsync = createAsyncThunk(
  "ai/initTutorSession",
  async (question, { rejectWithValue }) => {
    try {
      const response = await apiService.sendMessageToTutor(question.id, "", []);
      return { question, response };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  chatHistory: [], // Array of messages
  activeQuestionContext: null, // Current question object
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
      })
      .addCase(initTutorSessionAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.activeQuestionContext = action.payload.question;
        state.chatHistory = action.payload.response;
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
        state.chatHistory.push(...action.payload);
      })
      .addCase(sendMessageAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { addMessage, clearChat, setQuestionContext } = aiSlice.actions;

export default aiSlice.reducer;
