import React from 'react';
import { Button } from 'v2/components';
import { IDeFiStepComponentProps } from '../types';

const DeFiZapEducation = ({ onComplete }: IDeFiStepComponentProps) => {
  return (
    <>
      mehhh!
      <div>
        <Button onClick={onComplete}>Continue on!</Button>
      </div>
    </>
  );
};

export default DeFiZapEducation;
