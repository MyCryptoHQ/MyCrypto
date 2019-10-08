import React from 'react';

interface Props {
  goToNextStep(): void;
}

export default function WaitingDeposit(props: Props) {
  const { goToNextStep } = props;

  return (
    <div>
      <div>Waiting Deposit</div>
      <button onClick={goToNextStep}>Next</button>
    </div>
  );
}
