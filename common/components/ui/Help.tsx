import React from 'react';
import helpIcon from 'assets/images/icon-help.svg';
import translate, { translateRaw } from 'translations';

type sizeType = 'small' | 'medium' | 'large';

interface HelpProps {
  link: string;
  size?: sizeType;
  helpText?: string;
}

const Help = ({ size, link, helpText }: HelpProps) => {
  let width = 30;
  let height = 12;

  switch (size) {
    case 'medium':
      width = width * 3;
      height = height * 3;
      break;
    case 'large':
      width = width * 4;
      height = height * 4;
      break;
    default:
      break;
  }

  return (
    <a href={link} className={'account-help-icon'} target={'_blank'}>
      <img src={helpIcon} width={width} height={height} />

      {helpText && <p className="account-help-text">{helpText}</p>}
    </a>
  );
};

export default Help;
