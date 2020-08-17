import React, { useState } from 'react';
import { formatDistance } from 'date-fns';

import { useInterval } from '@utils';

const TimeElapsed = ({ value }: { value: number }) => {
  const formatValue = () =>
    formatDistance(value, new Date(), { addSuffix: true, includeSeconds: true });

  const [timeElapsed, setTimeElapsed] = useState(formatValue());

  useInterval(
    () => {
      setTimeElapsed(formatValue());
    },
    1000,
    false,
    []
  );

  return <>{timeElapsed}</>;
};

export default TimeElapsed;
