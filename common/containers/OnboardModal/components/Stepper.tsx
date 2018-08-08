import React from 'react';
import './Stepper.scss';

interface Props {
  length: number;
  index: number;
}

export const Stepper = ({ index, length }: Props) => {
  // can't properly map an array without values
  const steps = new Array(length).fill(undefined);
  return (
    <div className="Stepper">
      {steps.map((_, i) => (
        <div className={`${index === i ? 'active' : ''} step`} key={i}>
          {i}
        </div>
      ))}
    </div>
  );
};
