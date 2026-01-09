import { useState, useEffect } from "react";

/**
 * Hook to animate a score value from 0 to target
 */
export function useScoreAnimation(targetScore: number, duration = 1200) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (targetScore === 0) {
      setDisplayScore(0);
      return;
    }

    const steps = 60;
    const increment = targetScore / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        setDisplayScore(targetScore);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [targetScore, duration]);

  return displayScore;
}
