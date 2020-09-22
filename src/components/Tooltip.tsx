import React from 'react';

import { Tooltip as UITooltip } from '@mycrypto/ui';

import informationalSVG from '@assets/images/icn-info-blue.svg';
import questionWhiteSVG from '@assets/images/icn-question-white.svg';
import questionBlackSVG from '@assets/images/icn-question.svg';
import warningSVG from '@assets/images/icn-warning.svg';

export enum IconID {
  questionBlack = 'questionBlack',
  questionWhite = 'questionWhite',
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
    case IconID.questionBlack:
      return questionBlackSVG;
    case IconID.questionWhite:
      return questionWhiteSVG;
    case IconID.informational:
      return informationalSVG;
    case IconID.warning:
      return warningSVG;
  }
};

function Tooltip({ type = IconID.questionBlack, tooltip, children }: Props) {
  const iconType = selectIconType(type);

  return <UITooltip tooltip={tooltip}>{children ? children : <img src={iconType} />}</UITooltip>;
}

export default Tooltip;
