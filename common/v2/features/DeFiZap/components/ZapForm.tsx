import React from 'react';
import { IDeFiStepComponentProps } from '../types';
import { Button } from 'v2/components';

const ZapSelection = ({ onComplete }: IDeFiStepComponentProps) => {
  return (
    <>
      mehhhForm
      <div>
        <Button onClick={onComplete}>Continue on!</Button>
      </div>
    </>
  );
};

export default ZapSelection;
