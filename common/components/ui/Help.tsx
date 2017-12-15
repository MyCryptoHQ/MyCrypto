import React from 'react';
import './Help.scss';

type Size = 'x1' | 'x2' | 'x3';

interface Props {
  link: string;
  size?: Size;
}

const Help = ({ size = 'inherit-size', link }: Props) => {
  return (
    <a href={link} className={`Help Help-${size}`} target={'_blank'}>
      <i className="nc-icon nc-question-circle" style={{ color: '#0e97c0' }} />
    </a>
  );
};

export default Help;
