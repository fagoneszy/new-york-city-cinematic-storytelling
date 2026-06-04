import { useEffect } from "react";
import { useSpring, useMotionValue, type SpringOptions } from "motion/react";

export function useSmoothProgress(progress: number, options?: SpringOptions) {
  const progressValue = useMotionValue(progress);
  useEffect(() => {
    progressValue.set(progress);
  }, [progress, progressValue]);

  const smoothProgress = useSpring(progressValue, {
    stiffness: 45,
    damping: 20,
    ...options,
  });

  return smoothProgress;
}
