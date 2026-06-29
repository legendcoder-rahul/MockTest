import { useDispatch, useSelector } from "react-redux";
import {
  selectAnswer,
  clearAnswer,
  toggleMarkForReview,
  nextQuestion,
  prevQuestion,
  goToQuestion,
  exitExam,
  clearTestResult,
  startExamAsync,
  submitExamAsync
} from "../state/examSlice";

export const useExam = () => {
  const dispatch = useDispatch();
  const activeTest = useSelector((state) => state.exam.activeTest);
  const currentQuestionIndex = useSelector((state) => state.exam.currentQuestionIndex);
  const userAnswers = useSelector((state) => state.exam.userAnswers);
  const markedForReview = useSelector((state) => state.exam.markedForReview);
  const visitedQuestions = useSelector((state) => state.exam.visitedQuestions);
  const examActive = useSelector((state) => state.exam.examActive);
  const testResult = useSelector((state) => state.exam.testResult);
  const loading = useSelector((state) => state.exam.loading);
  const error = useSelector((state) => state.exam.error);
  const timeLeft = useSelector((state) => state.exam.timeLeft);

  const currentQuestion = activeTest?.questions?.[currentQuestionIndex] || null;

  const select = (optionIndex) => {
    dispatch(selectAnswer({ questionIndex: currentQuestionIndex, optionIndex }));
  };

  const clear = () => {
    dispatch(clearAnswer({ questionIndex: currentQuestionIndex }));
  };

  const toggleReview = () => {
    dispatch(toggleMarkForReview({ questionIndex: currentQuestionIndex }));
  };

  const next = () => {
    dispatch(nextQuestion());
  };

  const prev = () => {
    dispatch(prevQuestion());
  };

  const goTo = (index) => {
    dispatch(goToQuestion(index));
  };

  const startTest = (testId) => {
    dispatch(startExamAsync(testId));
  };

  const submitTest = (testId, timeSpent) => {
    dispatch(submitExamAsync({ testId, answers: userAnswers, timeSpent }));
  };

  const exit = () => {
    dispatch(exitExam());
  };

  const clearResult = () => {
    dispatch(clearTestResult());
  };

  return {
    activeTest,
    currentQuestionIndex,
    currentQuestion,
    userAnswers,
    markedForReview,
    visitedQuestions,
    examActive,
    testResult,
    loading,
    error,
    timeLeft,
    select,
    clear,
    toggleReview,
    next,
    prev,
    goTo,
    startTest,
    submitTest,
    exit,
    clearResult
  };
};

export default useExam;
