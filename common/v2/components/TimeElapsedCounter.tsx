import React, { useEffect, useState } from 'react';
import { translateRaw } from 'v2/translations';

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
          ? `${elapsedTime.days} ${translateRaw('ELAPSED_TIME_DAY')} `
          : `${elapsedTime.days} ${translateRaw('ELAPSED_TIME_DAYS')} `)}
      {elapsedTime.hours !== 0 &&
        (elapsedTime.hours === 1
          ? `${elapsedTime.hours} ${translateRaw('ELAPSED_TIME_HOUR')} `
          : `${elapsedTime.hours} ${translateRaw('ELAPSED_TIME_HOURS')} `)}
      {elapsedTime.minutes !== 0 &&
        (elapsedTime.minutes === 1
          ? `${elapsedTime.minutes} ${translateRaw('ELAPSED_TIME_MINUTE')} `
          : `${elapsedTime.minutes} ${translateRaw('ELAPSED_TIME_MINUTES')} `)}
      {elapsedTime.seconds !== 0 &&
        (elapsedTime.seconds === 1
          ? `${elapsedTime.seconds} ${translateRaw('ELAPSED_TIME_SECOND')} `
          : `${elapsedTime.seconds} ${translateRaw('ELAPSED_TIME_SECONDS')} `)}
      {'ago'}
    </>
  );
};

export default TimeElapsedCounter;
