import React from 'react';

type size = 'lg' | '2x' | '3x' | '4x' | '5x';

type SpinnerProps = {
  size?: size
};

const Spinner = ({ size = 'fa-' }: SpinnerProps) => {
  return <i className={`fa fa-spinner fa-spin fa-${size ? size : 'fw'}`} />;
};

export default Spinner;
