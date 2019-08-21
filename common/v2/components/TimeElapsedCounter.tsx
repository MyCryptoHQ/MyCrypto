import React, { useEffect, useState } from 'react';

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
    setTimeout(() => {
      const newElapsedTimeSeconds = Math.floor((Date.now() - convertedTimestamp) / 1000);
      setElapsedTime(calculateTimeComponents(newElapsedTimeSeconds));
    }, 1000);
  }, [elapsedTime]);

  return (
    <>
      {elapsedTime.days !== 0 &&
        (elapsedTime.days === 1 ? `${elapsedTime.days} day ` : `${elapsedTime.days} days `)}
      {elapsedTime.hours !== 0 &&
        (elapsedTime.hours === 1 ? `${elapsedTime.hours} hour ` : `${elapsedTime.hours} hours `)}
      {elapsedTime.minutes !== 0 &&
        (elapsedTime.minutes === 1
          ? `${elapsedTime.minutes} minute `
          : `${elapsedTime.minutes} minutes `)}
      {elapsedTime.seconds !== 0 &&
        (elapsedTime.seconds === 1
          ? `${elapsedTime.seconds} second `
          : `${elapsedTime.seconds} seconds `)}
      {'ago'}
    </>
  );
};

export default TimeElapsedCounter;
