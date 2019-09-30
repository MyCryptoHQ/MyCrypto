import React from 'react';

interface Props {
  goToNextStep(): void;
}

export default function SwapAssets(props: Props) {
  const { goToNextStep } = props;

  return (
    <div>
      <div>Swap Assets</div>
      <button onClick={goToNextStep}>Next</button>
    </div>
  );
}
