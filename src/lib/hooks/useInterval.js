import { useEffect, useRef } from "react";

export function useInterval(callback, delay) {
  const callbacRef = useRef();

  // update callback function with current render callback that has access to latest props and state
  useEffect(() => {
    callbacRef.current = callback;
  });

  useEffect(() => {
    if (!delay) {
      return () => {};
    }

    const interval = setInterval(() => {
      if (callbacRef.current) {
        callbacRef.current();
      }
    }, delay);
    return () => clearInterval(interval);
  }, [delay]);
}
