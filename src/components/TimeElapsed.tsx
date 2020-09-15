import React, { useState } from 'react';

import { formatTimeDifference, useInterval } from '@utils';

interface Props {
  value: number;
}

const TimeElapsed = ({ value }: Props) => {
  const [timeElapsed, setTimeElapsed] = useState(formatTimeDifference(value));

  useInterval(
    () => {
      setTimeElapsed(formatTimeDifference(value));
    },
    1000,
    false,
    []
  );

  return <>{timeElapsed}</>;
};

export default TimeElapsed;
