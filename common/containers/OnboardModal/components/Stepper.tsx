import React from 'react';
import './Stepper.scss';

interface Props {
  length: number;
  index: number;
  select(index: number): void;
}

export const Stepper = ({ index, length, select }: Props) => {
  // can't properly map an array without values
  const steps = new Array(length).fill(undefined);
  return (
    <div className="Stepper">
      {steps.map((_, i) => (
        <div className={`step ${index === i ? 'active' : ''}`} key={i} onClick={() => select(i)}>
          {i + 1}
        </div>
      ))}
    </div>
  );
};
