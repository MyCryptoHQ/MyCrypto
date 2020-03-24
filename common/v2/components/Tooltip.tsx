import React from 'react';

import { Tooltip as UITooltip } from '@mycrypto/ui';

import questionSVG from 'assets/images/icn-question.svg';
import informationalSVG from 'assets/images/icn-info-blue.svg';

interface Props {
  tooltip: React.ReactNode;
  type?: string;
  children?: React.ReactNode;
}

const fetchIconType = (type: string): any => {
  switch (type) {
    default:
    case 'question':
      return questionSVG;
    case 'informational':
      return informationalSVG;
  }
};

function Tooltip({ type = 'question', tooltip, children }: Props) {
  const iconType = fetchIconType(type);

  return <UITooltip tooltip={tooltip}>{children ? children : <img src={iconType} />}</UITooltip>;
}

export default Tooltip;
