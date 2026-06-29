import { useDispatch, useSelector } from "react-redux";
import {
  sendMessageAsync,
  initTutorSessionAsync,
  clearChat,
  addMessage
} from "../state/aiSlice";

export const useAITutor = () => {
  const dispatch = useDispatch();
  const chatHistory = useSelector((state) => state.ai.chatHistory);
  const activeQuestionContext = useSelector((state) => state.ai.activeQuestionContext);
  const loading = useSelector((state) => state.ai.loading);
  const error = useSelector((state) => state.ai.error);

  const startSession = (question) => {
    dispatch(initTutorSessionAsync(question));
  };

  const ask = async (text) => {
    if (!text.trim()) return;
    
    // Add user message to UI immediately
    dispatch(addMessage({ sender: "user", text }));

    // Send to mock backend API
    const questionId = activeQuestionContext ? activeQuestionContext.id : "general";
    dispatch(sendMessageAsync({ questionId, text }));
  };

  const clear = () => {
    dispatch(clearChat());
  };

  return {
    chatHistory,
    activeQuestionContext,
    loading,
    error,
    startSession,
    ask,
    clear
  };
};

export default useAITutor;
