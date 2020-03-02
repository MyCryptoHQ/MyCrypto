import React from 'react';

import { Tooltip as UITooltip } from '@mycrypto/ui';

import questionSVG from 'assets/images/icn-question.svg';

interface Props {
  tooltip: React.ReactNode;
  children?: React.ReactNode;
}

function Tooltip({ tooltip, children }: Props) {
  return <UITooltip tooltip={tooltip}>{children ? children : <img src={questionSVG} />}</UITooltip>;
}

export default Tooltip;
