import React from 'react';
import helpIcon from 'assets/images/info_black_24px.svg';
import translate, { translateRaw } from 'translations';
import './Help.scss';

interface HelpProps {
  link: string;
  helpText?: string;
}

const Help = ({ link, helpText }: HelpProps) => {
  return (
    <a href={link} className="help-icon" target={'_blank'}>
      <img src={helpIcon} />
      {helpText && <p className="account-help-text">{helpText}</p>}
    </a>
  );
};

export default Help;
