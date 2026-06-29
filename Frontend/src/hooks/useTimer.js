import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { tickTimer, setTimeLeft } from "../state/examSlice";

export const useTimer = (onSubmit) => {
  const dispatch = useDispatch();
  const timeLeft = useSelector((state) => state.exam.timeLeft);
  const examActive = useSelector((state) => state.exam.examActive);
  const submitRef = useRef(onSubmit);

  // Sync onSubmit reference
  useEffect(() => {
    submitRef.current = onSubmit;
  }, [onSubmit]);

  useEffect(() => {
    if (!examActive) return;

    const timer = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timer);
        if (submitRef.current) {
          submitRef.current();
        }
      } else {
        dispatch(tickTimer());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [examActive, timeLeft, dispatch]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const isUrgent = timeLeft > 0 && timeLeft < 300; // Less than 5 minutes

  return {
    timeLeft,
    formattedTime: formatTime(),
    isUrgent
  };
};
export default useTimer;
