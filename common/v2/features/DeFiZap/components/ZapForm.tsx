import React from 'react';
import { Button } from 'v2/components';
import { ZapInteractionState } from '../types';

interface Props extends ZapInteractionState {
  onComplete(): void;
}

const ZapForm = (props: Props) => {
  console.debug('[ZapSelection]: here -> ', props);
  return (
    <>
      Form
      <div>
        <span>{JSON.stringify(props, null, 4)}</span>
      </div>
      <div>
        <Button onClick={props.onComplete}>Continue on!</Button>
      </div>
    </>
  );
};

export default ZapForm;
