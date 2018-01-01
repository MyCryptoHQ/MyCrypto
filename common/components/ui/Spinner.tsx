import React from 'react';
import './Spinner.scss';

type Size = 'x1' | 'x2' | 'x3' | 'x4' | 'x5';

interface SpinnerProps {
  size?: Size;
  light?: boolean;
}

const Spinner = ({ size = 'x1', light = false }: SpinnerProps) => {
  const color = light ? 'Spinner-light' : 'Spinner-dark';
  return (
    <svg className={`Spinner Spinner-${size} ${color}`} viewBox="0 0 50 50">
      <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
    </svg>
  );
};

export default Spinner;
