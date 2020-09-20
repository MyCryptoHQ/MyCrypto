import React, { useEffect, useState } from 'react';

import { translateRaw } from '@translations';

interface Props {
  timestamp: number;
  isSeconds?: boolean; // Used to convert s timestamps to ms.
}

interface TimeCalculations {
  elapsedSeconds: number;
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
}

const calculateTimeComponents = (elapsedTimeInSeconds: number): TimeCalculations => {
  return {
    elapsedSeconds: elapsedTimeInSeconds,
    seconds: Math.floor(elapsedTimeInSeconds % 60),
    minutes: Math.floor(elapsedTimeInSeconds / 60) % 60,
    hours: Math.floor(elapsedTimeInSeconds / 3600) % 24,
    days: Math.floor(elapsedTimeInSeconds / 86400)
  };
};

const TimeElapsedCounter = ({ timestamp, isSeconds }: Props) => {
  const convertedTimestamp = isSeconds ? timestamp * 1000 : timestamp;
  const elapsed = Math.floor((Date.now() - convertedTimestamp) / 1000);

  const timeComponents = calculateTimeComponents(elapsed);

  const [elapsedTime, setElapsedTime] = useState(timeComponents);

  useEffect(() => {
    let elapsedTimeTimer: number | null = null;
    // @ts-ignore
    elapsedTimeTimer = setTimeout(() => {
      const newElapsedTimeSeconds = Math.floor((Date.now() - convertedTimestamp) / 1000);
      setElapsedTime(calculateTimeComponents(newElapsedTimeSeconds));
    }, 1000);

    return () => {
      if (elapsedTimeTimer) {
        clearTimeout(elapsedTimeTimer);
      }
    };
  }, [elapsedTime]);

  return (
    <>
      {elapsedTime.days !== 0 &&
        (elapsedTime.days === 1
          ? translateRaw('ELAPSED_TIME_DAY', { $value: elapsedTime.days.toString() })
          : translateRaw('ELAPSED_TIME_DAYS', { $value: elapsedTime.days.toString() }))}
      {elapsedTime.days !== 0 && ' '}
      {elapsedTime.hours !== 0 &&
        (elapsedTime.hours === 1
          ? translateRaw('ELAPSED_TIME_HOUR', { $value: elapsedTime.hours.toString() })
          : translateRaw('ELAPSED_TIME_HOURS', { $value: elapsedTime.hours.toString() }))}
      {elapsedTime.hours !== 0 && ' '}
      {elapsedTime.minutes !== 0 &&
        (elapsedTime.minutes === 1
          ? translateRaw('ELAPSED_TIME_MINUTE', { $value: elapsedTime.minutes.toString() })
          : translateRaw('ELAPSED_TIME_MINUTES', { $value: elapsedTime.minutes.toString() }))}
      {elapsedTime.minutes !== 0 && ' '}
      {elapsedTime.seconds !== 0 &&
        (elapsedTime.seconds === 1
          ? translateRaw('ELAPSED_TIME_SECOND', { $value: elapsedTime.seconds.toString() })
          : translateRaw('ELAPSED_TIME_SECONDS', { $value: elapsedTime.seconds.toString() }))}
      {elapsedTime.seconds !== 0 && ' '}
      {translateRaw('ELAPSED_TIME_AGO')}
    </>
  );
};

export default TimeElapsedCounter;
