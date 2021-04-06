import React, { useState } from 'react';

import { formatTimeDuration, useInterval } from '@utils';

const TimeCountdown = ({
  value,
  format = ['days', 'hours', 'minutes']
}: {
  value: number;
  format?: string[];
}) => {
  const timeSince = (v: number) => formatTimeDuration(v, undefined, undefined, { format });
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
