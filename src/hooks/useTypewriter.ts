import { useState, useEffect } from 'react';

type TypewriterOptions = {
  /** Milliseconds between characters while typing (default 38) */
  speed?: number;
  /** Milliseconds before typing begins (default 600) */
  startDelay?: number;
  /** Keep typing -> holding -> deleting -> retyping forever (default false) */
  loop?: boolean;
  /** Milliseconds the full text is held before deleting starts (default 1800) */
  holdDuration?: number;
  /** Milliseconds between characters while deleting (default 18) */
  deleteSpeed?: number;
  /** Milliseconds of empty pause before retyping (default 500) */
  restartDelay?: number;
};

/**
 * Custom hook that types out a string character-by-character.
 *
 * With `loop: true` the text is typed, held, deleted and typed again
 * continuously. `done` stays `false` while looping so a blinking cursor
 * can remain visible for the whole cycle.
 */
export function useTypewriter(
  text: string,
  {
    speed = 38,
    startDelay = 600,
    loop = false,
    holdDuration = 1800,
    deleteSpeed = 18,
    restartDelay = 500,
  }: TypewriterOptions = {}
): { displayed: string; done: boolean } {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);

    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let charIndex = 0;
    let deleting = false;

    const stopInterval = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const startTyping = (ms: number) => {
      stopInterval();
      intervalId = setInterval(tick, ms);
    };

    const tick = () => {
      if (cancelled) return;

      if (!deleting) {
        charIndex += 1;
        setDisplayed(text.slice(0, charIndex));

        if (charIndex >= text.length) {
          stopInterval();
          if (!loop) {
            setDone(true);
            return;
          }
          // Hold the completed text, then erase it.
          timeoutId = setTimeout(() => {
            if (cancelled) return;
            deleting = true;
            startTyping(deleteSpeed);
          }, holdDuration);
        }
        return;
      }

      // Deleting phase
      charIndex -= 1;
      setDisplayed(text.slice(0, Math.max(0, charIndex)));

      if (charIndex <= 0) {
        stopInterval();
        charIndex = 0;
        deleting = false;
        timeoutId = setTimeout(() => {
          if (cancelled) return;
          startTyping(speed);
        }, restartDelay);
      }
    };

    timeoutId = setTimeout(() => {
      if (cancelled) return;
      startTyping(speed);
    }, startDelay);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      stopInterval();
    };
  }, [text, speed, startDelay, loop, holdDuration, deleteSpeed, restartDelay]);

  return { displayed, done };
}
