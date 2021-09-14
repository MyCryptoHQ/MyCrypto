import { useEffect, useState } from 'react';

function useMinimumWait(callback: () => void, wait: number, deps: unknown[]) {
  const [isTriggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!isTriggered) {
      const timeout = setTimeout(() => {
        setTriggered(true);
        callback();
      }, wait);

      return () => clearTimeout(timeout);
    } else {
      callback();
    }
  }, deps);
}

export default useMinimumWait;
