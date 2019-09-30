import React from 'react';

interface Props {
  goToNextStep(): void;
}

export default function ConfirmSwap(props: Props) {
  const { goToNextStep } = props;

  return (
    <div>
      <div>Confirm Swap</div>
      <button onClick={goToNextStep}>Next</button>
    </div>
  );
}
