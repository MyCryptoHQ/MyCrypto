import React from 'react';

import { Tooltip as UITooltip } from '@mycrypto/ui';

import questionSVG from '@assets/images/icn-question-white.svg';
import informationalSVG from '@assets/images/icn-info-blue.svg';
import warningSVG from '@assets/images/icn-warning.svg';

export enum IconID {
  question = 'question',
  informational = 'informational',
  warning = 'warning'
}

interface Props {
  tooltip: React.ReactNode;
  type?: IconID;
  children?: React.ReactNode;
}

const selectIconType = (type: IconID): any => {
  switch (type) {
    default:
    case IconID.question:
      return questionSVG;
    case IconID.informational:
      return informationalSVG;
    case IconID.warning:
      return warningSVG;
  }
};

function Tooltip({ type = IconID.question, tooltip, children }: Props) {
  const iconType = selectIconType(type);

  return <UITooltip tooltip={tooltip}>{children ? children : <img src={iconType} />}</UITooltip>;
}

export default Tooltip;
