import React, { useEffect, useState } from 'react';

export interface Props {
  timestamp: number;
  isSeconds?: boolean; // Used to convert s timestamps to ms.
}

const TimeElapsedCounter = ({ timestamp, isSeconds }: Props) => {
  const convertedTimestamp = isSeconds ? timestamp * 1000 : timestamp;
  const elapsed = Math.floor((Date.now() - convertedTimestamp) / 1000);

  const [elapsedTimeSeconds, setElapsedTimeSeconds] = useState(Math.floor(elapsed % 60));
  const [elapsedTimeMinutes, setElapsedTimeMinutes] = useState(Math.floor(elapsed / 60) % 60);
  const [elapsedTimeHours, setElapsedTimeHours] = useState(Math.floor(elapsed / 3600) % 24);
  const [elapsedTimeDays, setElapsedTimeDays] = useState(Math.floor(elapsed / 86400));

  useEffect(() => {
    /* TODO: Remove memory leak associated with not clearing this 
    interval. Figure out how to do that in hooks. */
    setInterval(() => {
      setElapsedTimeSeconds(elapsedSeconds => {
        const newElapsedTimeSeconds = elapsedSeconds + 1;
        if (newElapsedTimeSeconds % 60 === 0) {
          setElapsedTimeMinutes(elapsedMinutes => {
            const newElapsedTimeMinutes = elapsedMinutes + 1;
            if (newElapsedTimeMinutes % 60 === 0) {
              setElapsedTimeHours(elapsedHours => {
                const newElapsedTimeHours = elapsedHours + 1;
                if (newElapsedTimeHours % 24 === 0) {
                  setElapsedTimeDays(elapsedDays => {
                    const newElapsedTimeDays = elapsedDays + 1;
                    return newElapsedTimeDays;
                  });
                }
                return newElapsedTimeHours % 24;
              });
            }
            return newElapsedTimeMinutes % 60;
          });
        }
        return newElapsedTimeSeconds % 60;
      });
    }, 1000);
  }, []);

  return (
    <>
      {elapsedTimeDays !== 0 &&
        (elapsedTimeDays === 1 ? `${elapsedTimeDays} day ` : `${elapsedTimeDays} days `)}
      {elapsedTimeHours !== 0 &&
        (elapsedTimeHours === 1 ? `${elapsedTimeHours} hour ` : `${elapsedTimeHours} hours `)}
      {elapsedTimeMinutes !== 0 &&
        (elapsedTimeMinutes === 1
          ? `${elapsedTimeMinutes} minute `
          : `${elapsedTimeMinutes} minutes `)}
      {elapsedTimeSeconds !== 0 &&
        (elapsedTimeSeconds === 1
          ? `${elapsedTimeSeconds} second `
          : `${elapsedTimeSeconds} seconds `)}
      {'ago'}
    </>
  );
};

export default TimeElapsedCounter;
