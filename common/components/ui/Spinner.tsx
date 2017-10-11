import React from 'react';

type Size = 'lg' | '2x' | '3x' | '4x' | '5x';

interface SpinnerProps {
  size?: Size;
}

const Spinner = ({ size = 'fa-' }: SpinnerProps) => {
  return <i className={`fa fa-spinner fa-spin fa-${size ? size : 'fw'}`} />;
};

export default Spinner;
