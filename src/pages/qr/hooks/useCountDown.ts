import { useEffect, useState } from 'react';

export function useCountdown(expiredAt: number) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      forceUpdate((v) => v + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const secondsLeft = Math.max(0, Math.floor((expiredAt - Date.now()) / 1000));

  return {
    secondsLeft,
    isExpired: secondsLeft === 0,
  };
}
