import React, { useState } from 'react';

import { formatTimeDuration, useInterval } from '@utils';

const TimeCountdown = ({ value }: { value: number }) => {
  const [countdown, setCountdown] = useState(formatTimeDuration(value));

  useInterval(
    () => {
      setCountdown(formatTimeDuration(value));
    },
    1000,
    false,
    []
  );

  return <>{countdown}</>;
};

export default TimeCountdown;
