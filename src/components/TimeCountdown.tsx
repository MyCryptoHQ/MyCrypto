import { useState } from 'react';

import { formatTimeDuration, useInterval } from '@utils';

const TimeCountdown = ({
  value,
  format = ['days', 'hours', 'minutes', 'seconds']
}: {
  value: number;
  format?: string[];
}) => {
  const timeSince = (v: number) => formatTimeDuration(v, Date.now() / 1000, false, { format });
  const [countdown, setCountdown] = useState(timeSince(value));

  useInterval(
    () => {
      setCountdown(timeSince(value));
    },
    1000,
    true,
    [value]
  );

  return <>{countdown}</>;
};

export default TimeCountdown;
