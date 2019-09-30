import React from 'react';

interface Props {
  goToNextStep(): void;
}

export default function SwapTransactionReceipt(props: Props) {
  const { goToNextStep } = props;

  return (
    <div>
      <div>Transaction Receipt</div>
      <button onClick={goToNextStep}>Next</button>
    </div>
  );
}
