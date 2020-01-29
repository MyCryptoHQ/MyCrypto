import React from 'react';
import { Button } from 'v2/components';
import { IZapConfig } from '../config';

interface Props {
  zapSelected: IZapConfig;
  onComplete(): void;
}

const ZapSelection = ({ onComplete }: Props) => {
  return (
    <>
      Form
      <div>
        <Button onClick={onComplete}>Continue on!</Button>
      </div>
    </>
  );
};

export default ZapSelection;
