import React from 'react';
import icon from 'assets/images/icon-help-3.svg';
import './Help.scss';

type Size = 'x1' | 'x2' | 'x3';

interface Props {
  link: string;
  size?: Size;
}

const Help = ({ size = 'x1', link }: Props) => {
  return (
    <a href={link} className={`Help Help-${size}`} target="_blank" rel="noopener noreferrer">
      <img src={icon} />
    </a>
  );
};

export default Help;
